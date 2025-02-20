import React from 'react';
import { connect } from 'react-redux';
import updateItem from '../functions/updateItem';
import Filter from './Filter';

function handleOpenItemEditor() {
  this.dispatch({
    type: 'OPEN_EDITOR',
    open: true,
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
    type: 'MARK_ITEM',
    id: loadingIds,
    set: true,
    prop: 'loading',
  });

  for (const id in this.items) {
    await updateItem(this.items[id], this.dispatch);
  }
}

function Controls(props) {
  return (
    <div className="controls">
      <button id="button-add-new" onClick={handleOpenItemEditor.bind(props)}>
        add new
      </button>
      <button id="button-update-all" onClick={handleUpdate.bind(props)}>
        update all
      </button>
      <Filter />
    </div>
  );
}

export default connect(state => ({
  items: state.items,
  loading: state.switches.loading,
}))(Controls);
