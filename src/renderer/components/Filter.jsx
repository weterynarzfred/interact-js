import React from 'react';
import { connect } from 'react-redux';

function handleChange(event) {
  this.dispatch({
    type: 'FILTER',
    value: event.target.value,
  });
}

function Filter(props) {
  return <div className="filter">
    <input type="text" value={props.filter} onChange={handleChange.bind(props)} placeholder="filter" />
  </div>;
}

export default connect(state => ({ filter: state.filter }))(Filter);