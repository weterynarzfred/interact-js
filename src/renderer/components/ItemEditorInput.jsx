import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';


function ItemEditorInput(props) {
  return (
    <div className="item-editor-ipnut">
      <label>
        <div className="input-label-text">{props.label}</div>
        <input
          type="text"
          value={_.get(props.values, props.prop)}
          placeholder={props.placeholder}
          onChange={event => props.handleChange(props.prop, event)}
        />
      </label>
    </div>
  );
}

export default connect()(ItemEditorInput);
