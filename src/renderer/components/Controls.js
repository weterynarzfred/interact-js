import React from 'react';
import { connect } from 'react-redux';

function handleOpenItemCreator() {
  this.dispatch({
    type: 'SWITCH',
    name: 'itemCreatorOpened',
    value: true,
  });
}

function Controls(props) {
  return (
    <div className="controls">
      <button id="button-add-new" onClick={handleOpenItemCreator.bind(props)}>
        add new
      </button>
    </div>
  );
}

export default connect()(Controls);
