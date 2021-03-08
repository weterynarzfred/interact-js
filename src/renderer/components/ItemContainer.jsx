import React from 'react';
import { connect } from 'react-redux';
import getProp from '../functions/getProp';
import Item from './Item';

function ItemContainer(props) {
  let itemElements = [];
  for (const itemId in props.items) {
    const item = props.items[itemId];
    itemElements.push({
      unread: getProp(item, 'unread'),
      rating: getProp(item, 'rating'),
      read: getProp(item, 'read'),
      lowerCaseTitle: getProp(item, 'title').toLowerCase(),
      element: <Item item={item} key={itemId} />,
    });
  }

  itemElements.sort((a, b) => {
    if ((b.unread > 0) !== (a.unread > 0)) return b.unread - a.unread;
    if (b.rating !== a.rating) return b.rating - a.rating;
    if (b.unread !== a.unread) return b.unread - a.unread;
    return b.read - a.read;
  });

  if (props.filter !== '') {
    const filter = props.filter.toLowerCase();
    itemElements = itemElements.filter(item => item.lowerCaseTitle.search(filter) >= 0);
  }

  return (
    <div className="item-container">{itemElements.map(item => item.element)}</div>
  );
}

function mapStateToProps(state) {
  return {
    items: state.items,
    filter: state.filter,
  };
}

export default connect(mapStateToProps)(ItemContainer);
