import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

function handleRating(event) {
  this.dispatch({
    type: 'UPDATE_ITEM',
    id: this.item.id,
    prop: 'manual.rating',
    value: parseInt(event.currentTarget.dataset.rating),
  });
}

function ItemRating(props) {
  const stars = [];
  const rating = parseInt(_.get(props.item, 'manual.rating'));
  for (let i = 1; i < 6; i++) {
    const classes = ['star'];
    if (i <= rating) classes.push('star-selected');
    stars.push(<svg className={classes.join(' ')} key={i} data-rating={i} onClick={handleRating.bind(props)} viewBox="0 0 100 100">
      <path d="M 49.969364,6.4346872 36.147985,34.592658 5.116286,39.170158 27.625507,61.016886 22.38965,91.944195 50.122324,77.287726 77.918044,91.824307 72.548864,60.919733 94.963514,38.976369 63.912184,34.532714 Z" />
    </svg>);
  }

  return (
    <div className="item-rating">
      <svg className="star-null" data-rating="0" onClick={handleRating.bind(props)} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="25" />
      </svg>
      {stars}
    </div>
  );
}

export default connect()(ItemRating);
