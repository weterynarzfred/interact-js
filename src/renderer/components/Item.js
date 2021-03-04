import { ipcRenderer } from 'electron';
import React from 'react';
import { connect } from 'react-redux';

function handleDelete() {
  this.dispatch({
    type: 'DELETE_ITEM',
    id: this.item.id,
  });
}

function handleUpdate() {
  const data = ipcRenderer.sendSync(
    'fetch',
    `https://mangadex.org/title/${this.item.mangadex.id}`
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
  console.log(latestChapter);
}

function Item(props) {
  return (
    <div className="item">
      <div className="item-title">{props.item.manual.title}</div>
      <div className="item-delete" onClick={handleDelete.bind(props)}>
        delete
      </div>
      <div className="item-update" onClick={handleUpdate.bind(props)}>
        update
      </div>
    </div>
  );
}

export default connect()(Item);
