import React from 'react';
import { connect } from 'react-redux';
import getUnread from '../functions/getUnread';
import mangadexUpdateItem from '../functions/mangadexUpdateItem';
import ItemProp from './ItemProp.jsx';

function handleDelete() {
  this.dispatch({
    type: 'DELETE_ITEM',
    id: this.item.id,
  });
}

function handleUpdate() {
  mangadexUpdateItem(this.item, this.dispatch);
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

function ItemContent(props) {
  const classes = ['item'];
  if (getUnread(props.item) > 0) classes.push('item-unread');

  return (
    <div className="item-content">
      <div className="item-custom-title">
        <ItemProp item={props.item} prop="manual.title" editable={true} placeholder="custom title" />
      </div>
      <label className="item-line">
        <div className="input-label-text">read:</div>
        <ItemProp item={props.item} prop="manual.read" editable={true} />
        <button className="item-button item-button-increment" onClick={handleIncrement.bind(props)}>
          +
        </button>
      </label>
      <label className="item-line">
        <div className="input-label-text">ready:</div>
        <ItemProp item={props.item} prop="mangadex.ready.number" />
      </label>

      <div className="item-buttons">
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
    </div>
  );
}

export default connect()(ItemContent);
