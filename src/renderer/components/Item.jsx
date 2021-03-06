import React, { useState } from 'react';
import { connect } from 'react-redux';
import getUnread from '../functions/getUnread';
import ItemContent from './ItemContent.jsx';

function Item(props) {
  const [opened, setOpened] = useState(false);

  const hasImage = props.item.mangadex.cover !== undefined;

  const classes = ['item'];
  const ready = props.item.mangadex.ready === undefined ? 0 : props.item.mangadex.ready.number;
  const unread = Math.round(getUnread(props.item) * 100) / 100;
  if (unread > 0) classes.push('item-unread');
  if (opened) classes.push('item-opened');
  if (props.loading.includes(props.item.id)) classes.push('item-loading');

  return (
    <div className={classes.join(' ')}>

      <div className="item-cover">
        <a
          href={`https://mangadex.org/title/${props.item.mangadex.id}`}
          target="_blank"
        >
          <div
            className="item-cover-img"
            style={hasImage ? {
              backgroundImage: `url(./mangadexCovers/${props.item.mangadex.cover})`,
            } : null}
          ></div>
        </a>
      </div>

      <button className="item-open" onClick={() => setOpened(!opened)}>
        {opened ? 'x' : 'edit'}
      </button>

      {unread > 0 ? <div className="item-unread-count">
        <div className="unread-count">{unread}</div>
        /
        <div className="unread-count-ready">{ready}</div>
        <div className="unread-count-title">unread</div>
      </div> : <div className="item-unread-count">
        {ready}
        <div className="unread-count-title">read</div>
      </div>}

      {opened ? <ItemContent item={props.item} /> : null}
      {
        props.loading.includes(props.item.id) ? <svg className="item-loader" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" />
        </svg> : null
      }

    </div>
  );
}

export default connect(state => ({ loading: state.switches.loading }))(Item);
