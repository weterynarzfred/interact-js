import { ipcRenderer } from 'electron';

function mangadexUpdateItem(id) {
  const data = ipcRenderer.sendSync(
    'fetch',
    `https://mangadex.org/title/${id}`
  );
  const matches = [
    ...data.matchAll(
      /<div class="[^"]*?chapter-row[^"]*?"[^>]*?data-chapter="([0-9]*?)"[^>]*?data-lang="([0-9]*)"[^>]*?data-timestamp="([0-9]*)"/gms
    ),
  ];
  let latestChapter;
  for (let i = 0; i < matches.length; i++) {
    const element = matches[i];
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

  return latestChapter;
}

export default mangadexUpdateItem;
