import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import getUnread from '../functions/getUnread';
import ItemContent from './ItemContent.jsx';
import ItemRating from './ItemRating.jsx';

function Item(props) {
  const [opened, setOpened] = useState(false);

  const hasImage = _.get(props.item, 'mangadex.cover') !== undefined;

  const classes = ['item'];
  const ready = _.get(props.item, 'mangadex.ready.number');
  const unread = Math.round(getUnread(props.item) * 100) / 100;
  if (unread > 0) classes.push('item-unread');
  if (opened) classes.push('item-opened');
  if (props.loading.includes(props.item.id)) classes.push('item-loading');

  return (
    <div className={classes.join(' ')}>

      <div className="item-cover">
        <a
          href={`https://mangadex.org/title/${_.get(props.item, 'mangadex.id')}`}
          target="_blank"
        >
          <div
            className="item-cover-img"
            style={hasImage ? {
              backgroundImage: `url(./mangadexCovers/${_.get(props.item, 'mangadex.cover')})`,
            } : null}
          ></div>
        </a>
      </div>

      <button className="item-open" onClick={() => setOpened(!opened)}>
        {opened ? 'x' : 'edit'}
      </button>

      <ItemRating item={props.item} />

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
