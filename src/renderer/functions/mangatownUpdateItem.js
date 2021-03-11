import { ipcRenderer } from 'electron';

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
    return true;
  } else {
    console.log(`latest chapter not found on mangatown for`, item);
    return false;
  }
}

async function mangatownUpdateItem(item, dispatch) {
  const promise = new Promise((resolve, reject) => {
    ipcRenderer.once(`fetch-mangatown-${item.id}`, async (event, data) => {
      const success = updateReadyChapters(data, item, dispatch);
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
