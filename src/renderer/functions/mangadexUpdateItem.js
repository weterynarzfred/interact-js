import { ipcRenderer } from 'electron';
import fs from 'fs';

async function downloadCover(data, item, dispatch) {
  const coverMatches = [
    ...data.matchAll(/title="See covers">[^<]*?<img[^>]*?src="([^"]*?)\?/gms),
  ];
  let cover;
  if (coverMatches[0] !== undefined) {
    cover = coverMatches[0][1];
  }

  if (cover !== undefined) {
    if (
      item.mangadex.cover === undefined ||
      !fs.existsSync(`./static/mangadexCovers/${item.mangadex.cover}`)
    ) {
      const extension = cover.split('.').pop();
      const dest = `./static/mangadexCovers/${item.mangadex.id}.${extension}`;

      const promise = new Promise((resolve, reject) => {
        dispatch({
          type: 'UPDATE_ITEM',
          id: item.id,
          prop: 'mangadex.cover',
          value: `${item.mangadex.id}.${extension}`,
        });
        resolve();
      });

      ipcRenderer.send('downloadFile', {
        url: cover,
        dest,
        requestId: item.id,
      });

      await promise;
    }
  }
}

function updateReadyChapters(data, item, dispatch) {
  const chapterMatches = [
    ...data.matchAll(
      /<div class="[^"]*?chapter-row[^"]*?"[^>]*?data-chapter="([0-9.]*?)"[^>]*?data-lang="([0-9]*)"[^>]*?data-timestamp="([0-9]*)"/gms
    ),
  ];
  let latestChapter;
  for (let i = 0; i < chapterMatches.length; i++) {
    const element = chapterMatches[i];
    const number = element[1];
    if (number === undefined) continue;
    const lang = parseInt(element[2]);
    if (lang !== 1) continue;
    latestChapter = {
      number: parseFloat(number),
      timestamp: parseInt(element[3]),
    };
    break;
  }

  dispatch({
    type: 'UPDATE_ITEM',
    id: item.id,
    prop: 'mangadex.ready',
    value: latestChapter,
  });
}

async function mangadexUpdateItem(item, dispatch) {
  dispatch({
    type: 'MARK_ITEM_LOADING',
    id: item.id,
    loading: true,
  });

  const promise = new Promise((resolve, reject) => {
    ipcRenderer.once(`fetch-${item.id}`, async (event, data) => {
      updateReadyChapters(data, item, dispatch);
      await downloadCover(data, item, dispatch);
      resolve();
    });
  });

  ipcRenderer.send('fetch', {
    url: `https://mangadex.org/title/${item.mangadex.id}`,
    requestId: item.id,
  });

  await promise;

  dispatch({
    type: 'MARK_ITEM_LOADING',
    id: item.id,
    loading: false,
  });
}

export default mangadexUpdateItem;
