import React from 'react';
import { connect } from 'react-redux';

function handleChange(event) {
  this.dispatch({
    type: 'UPDATE_ITEM',
    id: this.item.id,
    prop: this.prop,
    value: event.target.value,
  });
}

function ItemProp(props) {
  const classes = ['item-prop'];
  let value = '';
  try {
    value = props.prop.split('.').reduce((a, b) => a[b], props.item);
  } catch (e) {
    classes.push('item-prop-default');
  }
  if (value === undefined || value === null) {
    value = '';
    classes.push('item-prop-default');
  }
  return (
    <input
      readOnly={!props.editable}
      className={classes.join(' ')}
      value={value}
      onChange={handleChange.bind(props)}
      placeholder={props.placeholder}
    />
  );
}

export default connect()(ItemProp);
