import React from 'react';

function Item(props) {
  return <div className="item">{props.item.title}</div>;
}

export default Item;
