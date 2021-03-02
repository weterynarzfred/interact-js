import fs from 'fs';
import React from 'react';
import Item from './Item';

function ItemContainer(props) {
  const file = fs.readFileSync('./static/items.json', { encoding: 'utf8' });
  const data = JSON.parse(file);

  const items = [];
  for (const itemId in data) {
    const item = data[itemId];
    items.push(<Item item={item} key={itemId} />);
  }

  return (
    <div className="item-container">
      <h1>Item list:</h1>
      {items}
    </div>
  );
}

export default ItemContainer;
