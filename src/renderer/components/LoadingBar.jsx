import React from 'react';
import { connect } from 'react-redux';

function LoadingBar(props) {
  if (props.loading.length === 0 || props.loadingCount <= 1) return null;

  const progress = (props.loadingCount - props.loading.length) / props.loadingCount;
  console.log(props.loading.length, props.loadingCount);

  return <div className="loading-bar">
    <div className="bar" style={{ width: progress * 100 + '%' }}></div>
  </div>;
}

export default connect(state => ({
  loadingCount: state.switches.loadingCount,
  loading: state.switches.loading,
}))(LoadingBar);