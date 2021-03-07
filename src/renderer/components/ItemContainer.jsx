import React from 'react';
import { connect } from 'react-redux';
import getProp from '../functions/getProp';
import Item from './Item';

function ItemContainer(props) {
  const items = [];
  for (const itemId in props.items) {
    const item = props.items[itemId];
    items.push({
      unread: getProp(item, 'unread'),
      rating: getProp(item, 'rating'),
      read: getProp(item, 'read'),
      element: <Item item={item} key={itemId} />,
    });
  }

  items.sort((a, b) => {
    if ((b.unread > 0) !== (a.unread > 0)) return b.unread - a.unread;
    if (b.rating !== a.rating) return b.rating - a.rating;
    if (b.unread !== a.unread) return b.unread - a.unread;
    return b.read - a.read;
  });

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
