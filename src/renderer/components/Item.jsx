import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import ItemRating from './ItemRating';
import getProp from '../functions/getProp';

function handleOpenItemEditor() {
  this.dispatch({
    type: 'OPEN_EDITOR',
    open: true,
    itemId: this.item.id,
  });
}

function handleIncrement(increment) {
  this.dispatch({
    type: 'UPDATE_ITEM',
    id: this.item.id,
    prop: 'manual.read',
    value: parseFloat(getProp(this.item, 'read')) + parseFloat(increment),
  });
}

function Item(props) {
  const cover = getProp(props.item, 'cover');
  const hasImage = cover !== '';

  const classes = ['item'];
  const read = getProp(props.item, 'read');
  const ready = getProp(props.item, 'ready');
  const title = getProp(props.item, 'title');
  const unread = getProp(props.item, 'unread');
  if (unread > 0) classes.push('item-unread');
  if (props.loading.includes(props.item.id)) classes.push('item-loading');
  if (props.failedUpdates.includes(props.item.id)) classes.push('item-warning');

  return (
    <div className={classes.join(' ')}>

      <div className="item-cover">
        <a
          href={`https://mangadex.org/title/${_.get(props.item, 'mangadex.id')}`}
          target="_blank"
        >
          <div
            className="item-cover-img"
            style={hasImage ? { backgroundImage: `url(${cover})` } : null}
          ></div>
        </a>
      </div>

      <button className="item-open" onClick={handleOpenItemEditor.bind(props)}>
        edit
      </button>

      <ItemRating item={props.item} />

      <div className="item-title">{title}</div>

      <div className="item-unread-count">
        {unread > 0 ? <>
          <div className="unread-count">{read}</div>
        /
        <div className="unread-count-ready">{ready}</div>
          <div className="unread-count-title">{unread} unread</div>
          <div className="item-increments">
            {unread >= 1 ? <div
              className="item-increment"
              onClick={handleIncrement.bind(props, 1)}
            >+1</div> : null}
            {unread !== 1 ? <div
              className="item-increment-all"
              onClick={handleIncrement.bind(props, unread)}
            >+{unread}</div> : null}
          </div>
        </> : <>
          <div className="unread-count-read">{read}</div>
          <div className="unread-count-title">read</div>
        </>}
      </div>

      {
        props.loading.includes(props.item.id) ? <svg className="item-loader" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" />
        </svg> : null
      }

      <div className="item-overlay"></div>

    </div>
  );
}

export default connect(state => ({
  loading: state.switches.loading,
  failedUpdates: state.switches.failedUpdates,
}))(Item);
