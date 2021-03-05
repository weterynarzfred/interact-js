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

function handleUpdate() {
  const latestChapter = mangadexUpdateItem(this.item.mangadex.id);

  this.dispatch({
    type: 'UPDATE_ITEM',
    id: this.item.id,
    prop: 'mangadex.ready',
    value: latestChapter,
  });
}

function handleIncrement() {
  this.dispatch({
    type: 'UPDATE_ITEM',
    id: this.item.id,
    prop: 'manual.read',
    value:
      typeof this.item.manual.read === 'number' ? this.item.manual.read + 1 : 1,
  });
}

function Item(props) {
  return (
    <div className="item">
      <div className="item-cover">
        <a
          href={`https://mangadex.org/title/${props.item.mangadex.id}`}
          target="_blank"
        >
          <div className="item-cover-img"></div>
        </a>
      </div>
      <div className="item-title">
        <ItemProp item={props.item} prop="manual.title" editable={true} />
      </div>
      <div className="item-line">
        read:
        <ItemProp item={props.item} prop="manual.read" editable={true} />
        <button className="item-button" onClick={handleIncrement.bind(props)}>
          increment
        </button>
      </div>
      <div className="item-line">
        ready:
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
