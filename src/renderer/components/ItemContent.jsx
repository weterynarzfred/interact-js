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
      <div className="item-title">
        <ItemProp item={props.item} prop="manual.title" editable={true} />
      </div>
      <div className="item-line">
        <div className="item-line-text">read:</div>
        <ItemProp item={props.item} prop="manual.read" editable={true} />
        <button className="item-button item-button-increment" onClick={handleIncrement.bind(props)}>
          +
        </button>
      </div>
      <div className="item-line">
        <div className="item-line-text">ready:</div>
        <ItemProp item={props.item} prop="mangadex.ready.number" />
      </div>

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
