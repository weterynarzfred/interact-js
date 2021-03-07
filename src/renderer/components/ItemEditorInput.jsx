import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';

function ItemEditorInput(props) {
  return (
    <div className={classNames("item-editor-input", { editable: props.editable !== false })}>
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
