import { ipcRenderer } from 'electron';
import fs from 'fs';
import _ from 'lodash';

async function downloadCover(data, item, dispatch) {
  if (
    item.mangatown.cover === undefined ||
    !fs.existsSync(`${__static}/mangatownCovers/${item.mangatown.cover}`)
  ) {
    const coverMatches = [
      ...data.matchAll(
        /<div class="detail_info clearfix">[^<]*?<img src="([^"]*?)"/gms
      ),
    ];
    let cover;
    if (coverMatches[0] !== undefined) {
      cover = coverMatches[0][1];
    }

    if (cover !== undefined) {
      const extension = cover.split('.').pop().split('?')[0];
      const dest = `${__static}/mangatownCovers/${item.mangatown.id}.${extension}`;

      const promise = new Promise((resolve, reject) => {
        ipcRenderer.once(
          `downloadFile-mangatown-${item.id}`,
          async (event, data) => {
            dispatch({
              type: 'UPDATE_ITEM',
              id: item.id,
              prop: 'mangatown.cover',
              value: `${item.mangatown.id}.${extension}`,
            });
            resolve();
          }
        );
      });

      if (!fs.existsSync(`${__static}/mangatownCovers`)) {
        fs.mkdirSync(`${__static}/mangatownCovers`);
      }

      ipcRenderer.send('downloadFile', {
        url: cover,
        dest,
        requestId: `mangatown-${item.id}`,
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
      /<li>[^<]*?<a href="\/manga\/[^/]*?\/c([0-9.]*).*?class="time">([^<]*?)<\/span>/gms
    ),
  ];
  let latestChapter;
  for (let i = 0; i < chapterMatches.length; i++) {
    const element = chapterMatches[i];
    const number = element[1];
    if (number === undefined) continue;
    latestChapter = {
      number: parseFloat(number),
      timestamp: Date.parse(element[2]),
    };
    break;
  }

  if (latestChapter !== undefined && latestChapter.number !== undefined) {
    dispatch({
      type: 'UPDATE_ITEM',
      id: item.id,
      prop: 'mangatown.ready',
      value: latestChapter.number,
    });
    dispatch({
      type: 'UPDATE_ITEM',
      id: item.id,
      prop: 'mangatown.lastChapterTimestamp',
      value: latestChapter.timestamp,
    });
    return latestChapter.number;
  } else {
    console.log(`latest chapter not found on mangatown for`, item);
    return false;
  }
}

async function mangatownUpdateItem(item, dispatch) {
  const promise = new Promise((resolve, reject) => {
    ipcRenderer.once(`fetch-mangatown-${item.id}`, async (event, data) => {
      const success = updateReadyChapters(data, item, dispatch);
      await downloadCover(data, item, dispatch);
      resolve(success);
    });
  });

  ipcRenderer.send('fetch', {
    url: `https://www.mangatown.com/manga/${item.mangatown.id}`,
    requestId: `mangatown-${item.id}`,
  });

  return await promise;
}

export default mangatownUpdateItem;
