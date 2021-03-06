import React, { useState } from 'react';
import { connect } from 'react-redux';

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
  },
  mangadex: {
    id: 0,
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

  function handleAdd(values) {
    this.dispatch({
      type: 'ADD_ITEM',
      item: values,
    });

    setValues(initialValues);
  }

  if (!props.itemCreatorOpened) return null;

  return (
    <div className="item-creator">
      <h2>item creator</h2>
      <div className="close" onClick={handleCloseItemCreator.bind(props)}>
        close
      </div>

      <div className="item-creator-input">
        <label>
          <div className="item-creator-input-label">title</div>
          <input
            type="text"
            value={values.manual.title}
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
          <div className="item-creator-input-label">mangadex id</div>
          <input
            type="number"
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

      <button onClick={handleAdd.bind(props, values)}>add</button>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    itemCreatorOpened: state.switches.itemCreatorOpened,
  };
}

export default connect(mapStateToProps)(ItemCreator);
