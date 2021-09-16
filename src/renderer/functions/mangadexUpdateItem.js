import { ipcRenderer } from 'electron';
import fs from 'fs';
import _ from 'lodash';
const MFA = require('mangadex-full-api');

async function downloadCover(manga, item, dispatch) {
  if (
    item.mangadex.cover === undefined ||
    !fs.existsSync(`${__static}/mangadexCovers/${item.mangadex.cover}`)
  ) {
    const coverData = await manga.mainCover.resolve();
    const cover = coverData.image256;

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

      if (!fs.existsSync(`${__static}/mangadexCovers`)) {
        fs.mkdirSync(`${__static}/mangadexCovers`);
      }

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

async function updateReadyChapters(manga, item, dispatch) {
  let latestChapter;
  const chapters = await manga.getFeed({
    translatedLanguage: ['en'],
    order: {
      chapter: 'desc',
    },
    limit: 1,
  }, false);

  latestChapter = chapters[0].chapter;

  if (latestChapter !== undefined) {
    dispatch({
      type: 'UPDATE_ITEM',
      id: item.id,
      prop: 'mangadex.ready',
      value: latestChapter,
    });
    return latestChapter;
  } else {
    console.log(`latest chapter not found on mangadex for`, item);
    return false;
  }
}

function updateMeta(manga, item, dispatch) {
  const prevTitle = _.get(item, 'mangadex.title');
  if (prevTitle === undefined || prevTitle === '') {

    if (manga.localizedTitle.en !== undefined) {
      dispatch({
        type: 'UPDATE_ITEM',
        id: item.id,
        prop: 'mangadex.title',
        value: manga.localizedTitle.en,
      });
    } else {
      console.log(`title not found for`, item);
    }
  }
}

async function mangadexUpdateItem(item, dispatch) {
  try {
    const manga = await MFA.Manga.get(item.mangadex.id, false);

    const success = updateReadyChapters(manga, item, dispatch);
    await downloadCover(manga, item, dispatch);
    updateMeta(manga, item, dispatch);
    return success;

  } catch (error) {
    return false;
  }
}

export default mangadexUpdateItem;
