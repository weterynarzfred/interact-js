import { ipcRenderer } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import mangadexUpdateItem from '../functions/mangadexUpdateItem';
import ItemProp from './ItemProp';

function handleDelete() {
  this.dispatch({
    type: 'DELETE_ITEM',
    id: this.item.id,
  });
}

async function handleUpdate() {
  const { latestChapter, cover } = mangadexUpdateItem(this.item.mangadex.id);

  this.dispatch({
    type: 'UPDATE_ITEM',
    id: this.item.id,
    prop: 'mangadex.ready',
    value: latestChapter,
  });

  // if (!this.item.mangadex.coverDownloaded && cover !== undefined) {
  if (cover !== undefined) {
    const extension = cover.split('.').pop();
    const dest = `./static/mangadexCovers/${this.item.mangadex.id}.${extension}`;
    const result = await ipcRenderer.sendSync('downloadFile', {
      url: cover,
      dest,
    });
    if (result) {
      this.dispatch({
        type: 'UPDATE_ITEM',
        id: this.item.id,
        prop: 'mangadex.cover',
        value: `${this.item.mangadex.id}.${extension}`,
      });
    }
  }
}

function handleIncrement() {
  const value = parseFloat(this.item.manual.read);
  this.dispatch({
    type: 'UPDATE_ITEM',
    id: this.item.id,
    prop: 'manual.read',
    value: isNaN(value) ? 1 : value + 1,
  });
}

function Item(props) {
  const classes = ['item'];
  try {
    const read = parseFloat(props.item.manual.read);
    const ready = parseFloat(props.item.mangadex.ready.number);
    if (!isNaN(read) && !isNaN(ready)) {
      if (ready > read) classes.push('item-unread');
    }
  } catch (e) {}

  return (
    <div className={classes.join(' ')}>
      <div className="item-cover">
        <a
          href={`https://mangadex.org/title/${props.item.mangadex.id}`}
          target="_blank"
        >
          <div
            className="item-cover-img"
            style={{
              backgroundImage: `url(./mangadexCovers/${props.item.mangadex.cover})`,
            }}
          ></div>
        </a>
      </div>
      <div className="item-title">
        <ItemProp item={props.item} prop="manual.title" editable={true} />
      </div>
      <div className="item-line">
        <div className="item-line-text">read:</div>
        <ItemProp item={props.item} prop="manual.read" editable={true} />
        <button className="item-button" onClick={handleIncrement.bind(props)}>
          +
        </button>
      </div>
      <div className="item-line">
        <div className="item-line-text">ready:</div>
        <ItemProp item={props.item} prop="mangadex.ready.number" />
      </div>
      <button
        className="item-button item-delete"
        onClick={handleDelete.bind(props)}
      >
        delete
      </button>
      <button
        className="item-button item-update"
        onClick={handleUpdate.bind(props)}
      >
        update
      </button>
    </div>
  );
}

export default connect()(Item);
