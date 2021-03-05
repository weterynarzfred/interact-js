import { ipcRenderer } from 'electron';

function mangadexUpdateItem(id) {
  const data = ipcRenderer.sendSync(
    'fetch',
    `https://mangadex.org/title/${id}`
  );
  const chapterMatches = [
    ...data.matchAll(
      /<div class="[^"]*?chapter-row[^"]*?"[^>]*?data-chapter="([0-9]*?)"[^>]*?data-lang="([0-9]*)"[^>]*?data-timestamp="([0-9]*)"/gms
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

  const coverMatches = [
    ...data.matchAll(/title="See covers">[^<]*?<img[^>]*?src="([^"]*?)\?/gms),
  ];
  let cover;
  if (coverMatches[0] !== undefined) {
    cover = coverMatches[0][1];
  }

  return {
    latestChapter,
    cover,
  };
}

export default mangadexUpdateItem;
