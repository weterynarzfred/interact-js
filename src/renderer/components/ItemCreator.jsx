import React, { useState } from 'react';
import { connect } from 'react-redux';
import mangadexUpdateItem from '../functions/mangadexUpdateItem';

function handleCloseItemCreator() {
  this.dispatch({
    type: 'SWITCH',
    name: 'itemCreatorOpened',
    open: false,
  });
}

const initialValues = {
  manual: {
    title: '',
    read: '',
  },
  mangadex: {
    id: '',
  },
};

function ItemCreator(props) {
  const [values, setValues] = useState(initialValues);

  function handleChange(data) {
    const newValues = JSON.parse(JSON.stringify(values));
    if (newValues[data.group] === undefined) {
      newValues[data.group] = {};
    }
    newValues[data.group][data.name] = data.value;
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

    handleCloseItemCreator.call(this);
    setValues(initialValues);
  }

  if (!props.itemCreatorOpened) return null;

  return (
    <div className="item-creator">
      <div className="item-creator-content">
        <h2>item creator</h2>
        <button className="close" onClick={handleCloseItemCreator.bind(props)}>
          x
        </button>

        <div className="item-creator-inputs">
          <div className="item-creator-input">
            <label>
              <div className="input-label-text">title</div>
              <input
                type="text"
                value={values.manual.title}
                placeholder="can be loaded from mangadex id"
                onChange={e => {
                  handleChange({
                    group: 'manual',
                    name: 'title',
                    value: e.target.value,
                  });
                }}
              />
            </label>
          </div>
          <div className="item-creator-input">
            <label>
              <div className="input-label-text">read</div>
              <input
                type="text"
                value={values.manual.read}
                onChange={e => {
                  handleChange({
                    group: 'manual',
                    name: 'read',
                    value: e.target.value,
                  });
                }}
              />
            </label>
          </div>
          <div className="item-creator-input">
            <label>
              <div className="input-label-text">mangadex id</div>
              <input
                type="text"
                value={values.mangadex.id}
                onChange={e => {
                  handleChange({
                    group: 'mangadex',
                    name: 'id',
                    value: e.target.value,
                  });
                }}
              />
            </label>
          </div>
        </div>

        <button onClick={handleAdd.bind(props, values)}>add</button>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    itemCreatorOpened: state.switches.itemCreatorOpened,
    items: state.items,
    nextId: state.nextId,
  };
}

export default connect(mapStateToProps)(ItemCreator);
