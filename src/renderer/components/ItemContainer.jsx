import React from 'react';
import { connect } from 'react-redux';
import getUnread from '../functions/getUnread';
import Item from './Item.jsx';

function ItemContainer(props) {
  const items = [];
  for (const itemId in props.items) {
    const item = props.items[itemId];
    items.push({
      unread: getUnread(item),
      element: <Item item={item} key={itemId} />,
    });
  }

  items.sort((a, b) => b.unread - a.unread);

  return (
    <div className="item-container">{items.map(item => item.element)}</div>
  );
}

function mapStateToProps(state) {
  return {
    items: state.items,
  };
}

export default connect(mapStateToProps)(ItemContainer);
