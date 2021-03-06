import React, { useState } from 'react';
import { connect } from 'react-redux';
import getUnread from '../functions/getUnread';
import ItemContent from './ItemContent.jsx';

function Item(props) {
  const [opened, setOpened] = useState(false);
  const classes = ['item'];
  if (getUnread(props.item) > 0) classes.push('item-unread');
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
            style={{
              backgroundImage: `url(./mangadexCovers/${props.item.mangadex.cover})`,
            }}
          ></div>
        </a>
      </div>
      <button className="item-open" onClick={() => setOpened(!opened)}>
        {opened ? 'x' : 'edit'}
      </button>
      {opened ? <ItemContent item={props.item} /> : null}
    </div>
  );
}

export default connect(state => ({ loading: state.switches.loading }))(Item);
