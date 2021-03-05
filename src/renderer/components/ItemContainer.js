import React from 'react';
import { connect } from 'react-redux';
import Item from './Item';

function ItemContainer(props) {
  const items = [];
  for (const itemId in props.items) {
    const item = props.items[itemId];
    items.push(<Item item={item} key={itemId} />);
  }

  return <div className="item-container">{items}</div>;
}

function mapStateToProps(state) {
  return {
    items: state.items,
  };
}

export default connect(mapStateToProps)(ItemContainer);
