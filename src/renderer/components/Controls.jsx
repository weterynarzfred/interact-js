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
  if (this.loading.length > 0) {
    console.log('already loading');
    return;
  }

  const loadingIds = [];
  for (const id in this.items) loadingIds.push(id);
  this.dispatch({
    type: 'MARK_ITEM_LOADING',
    id: loadingIds,
    loading: true,
  });

  for (const id in this.items) {
    await mangadexUpdateItem(this.items[id], this.dispatch);
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

export default connect(state => ({
  items: state.items,
  loading: state.switches.loading,
}))(Controls);
