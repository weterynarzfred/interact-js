import React from 'react';
import { connect } from 'react-redux';
import mangadexUpdateItem from '../functions/mangadexUpdateItem';

function handleOpenItemCreator() {
  this.dispatch({
    type: 'SWITCH',
    name: 'itemCreatorOpened',
    value: true,
  });
}

async function handleUpdate() {
  for (const id in this.items) {
    const item = this.items[id];
    await mangadexUpdateItem(item, this.dispatch);
  }
}

function Controls(props) {
  return (
    <div className="controls">
      <button id="button-add-new" onClick={handleOpenItemCreator.bind(props)}>
        add new
      </button>
      <button id="button-update-all" onClick={handleUpdate.bind(props)}>
        update all
      </button>
    </div>
  );
}

export default connect(state => ({ items: state.items }))(Controls);
