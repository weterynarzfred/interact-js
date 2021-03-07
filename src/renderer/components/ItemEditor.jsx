import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import mangadexUpdateItem from '../functions/mangadexUpdateItem';
import ItemEditorInput from './ItemEditorInput.jsx';

function handleCloseItemEditor() {
  this.dispatch({
    type: 'OPEN_EDITOR',
    open: false,
  });
}

function handleDelete() {
  this.dispatch({
    type: 'DELETE_ITEM',
    id: this.itemId,
  });
}

function handleUpdate() {
  mangadexUpdateItem(this.items[this.itemId], this.dispatch);
}

function ItemEditor(props) {
  const [values, setValues] = useState({});

  function handleChange(prop, event) {
    const newValues = JSON.parse(JSON.stringify(values));
    _.set(newValues, prop, event.target.value);
    setValues(newValues);
  }

  async function handleAdd(values) {
    const newItem = JSON.parse(JSON.stringify(values));
    newItem.id = props.nextId;
    this.dispatch({
      type: 'ADD_ITEM',
      item: newItem,
    });
    mangadexUpdateItem(newItem, props.dispatch);

    handleCloseItemEditor.call(this);
    setValues({});
  }

  function handleSave() {
    this.dispatch({
      type: 'UPDATE_ITEM',
      item: values,
    });
    handleCloseItemEditor.call(this);
    setValues({});
  }

  if (!props.opened) return null;

  if (values.id === undefined || values.id !== props.itemId) {
    if (props.itemId >= 0) {
      setValues(props.items[props.itemId]);
    } else {
      setValues({ id: -1, });
    }
  }

  return (
    <div className="item-editor">
      <div className="item-editor-content">
        <h2>item editor</h2>
        <div className="top-buttons">
          {props.itemId >= 0 ? <button onClick={handleSave.bind(props, values)}>save</button> : <button onClick={handleAdd.bind(props, values)}>add</button>}
          <button className="close" onClick={handleCloseItemEditor.bind(props)}>
            x
          </button>
        </div>

        <div className="item-editor-inputs">
          <ItemEditorInput
            values={values}
            label="read"
            prop="manual.read"
            handleChange={handleChange.bind(props)}
          />
          <ItemEditorInput
            values={values}
            label="mangadex id"
            prop="mangadex.id"
            handleChange={handleChange.bind(props)}
          />
        </div>

        {props.itemId >= 0 ? <>
          <button onClick={handleDelete.bind(props)}>delete</button>
          <button onClick={handleUpdate.bind(props)}>check updates</button>
        </> : null}

        <div className="item-editor-inputs">
          <h3>manual</h3>
          <ItemEditorInput
            values={values}
            label="title"
            prop="manual.title"
            handleChange={handleChange.bind(props)}
          />
          <ItemEditorInput
            values={values}
            label="read"
            prop="manual.read"
            handleChange={handleChange.bind(props)}
          />
          <ItemEditorInput
            values={values}
            label="ready"
            prop="manual.ready"
            handleChange={handleChange.bind(props)}
          />
          <ItemEditorInput
            values={values}
            label="rating"
            prop="manual.rating"
            handleChange={handleChange.bind(props)}
          />

          <h3>mangadex</h3>
          <ItemEditorInput
            values={values}
            label="id"
            prop="mangadex.id"
            handleChange={handleChange.bind(props)}
          />
          <ItemEditorInput
            values={values}
            label="title"
            prop="mangadex.title"
            handleChange={handleChange.bind(props)}
          />
          <ItemEditorInput
            values={values}
            label="ready"
            prop="mangadex.ready"
            handleChange={handleChange.bind(props)}
          />
        </div>

      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    opened: state.switches.itemEditorOpened,
    itemId: state.switches.itemEditorItemId,
    items: state.items,
    nextId: state.nextId,
  };
}

export default connect(mapStateToProps)(ItemEditor);
