import { ipcRenderer } from 'electron';
import fs from 'fs';
import _ from 'lodash';

async function downloadCover(data, item, dispatch) {
  if (
    item.mangadex.cover === undefined ||
    !fs.existsSync(`${__static}/mangadexCovers/${item.mangadex.cover}`)
  ) {
    const coverMatches = [
      ...data.matchAll(/title="See covers">[^<]*?<img[^>]*?src="([^"]*?)\?/gms),
    ];
    let cover;
    if (coverMatches[0] !== undefined) {
      cover = coverMatches[0][1];
    }

    if (cover !== undefined) {
      const extension = cover.split('.').pop();
      const dest = `${__static}/mangadexCovers/${item.mangadex.id}.${extension}`;

      const promise = new Promise((resolve, reject) => {
        ipcRenderer.once(`downloadFile-${item.id}`, async (event, data) => {
          dispatch({
            type: 'UPDATE_ITEM',
            id: item.id,
            prop: 'mangadex.cover',
            value: `${item.mangadex.id}.${extension}`,
          });
          resolve();
        });
      });

      ipcRenderer.send('downloadFile', {
        url: cover,
        dest,
        requestId: item.id,
      });

      await promise;
    } else {
      console.log(`cover not found for`, item);
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

  if (latestChapter !== undefined && latestChapter.number !== undefined) {
    dispatch({
      type: 'UPDATE_ITEM',
      id: item.id,
      prop: 'mangadex.ready',
      value: latestChapter.number,
    });
    dispatch({
      type: 'UPDATE_ITEM',
      id: item.id,
      prop: 'mangadex.lastChapterTimestamp',
      value: latestChapter.timestamp,
    });
  } else {
    console.log(`latest chapter not found for`, item);
  }
}

function updateMeta(data, item, dispatch) {
  if (_.get(item, 'mangadex.title') === undefined) {
    const titleMatches = [
      ...data.matchAll(
        /class="card-header[^>]*?>.*?mx-1">([^<]*?)<\/span>.*?<\/h6>/gms
      ),
    ];

    if (titleMatches[0] !== undefined) {
      const title = titleMatches[0][1];
      dispatch({
        type: 'UPDATE_ITEM',
        id: item.id,
        prop: 'mangadex.title',
        value: title,
      });
    } else {
      console.log(`title not found for`, item);
    }
  }
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
      updateMeta(data, item, dispatch);
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
