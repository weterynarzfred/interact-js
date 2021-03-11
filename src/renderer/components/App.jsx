import React from 'react';
import Controls from './Controls';
import ItemContainer from './ItemContainer';
import ItemEditor from './ItemEditor';
import LoadingBar from './LoadingBar';

function App(props) {
  return (
    <div className="App">
      <Controls />
      <LoadingBar />
      <ItemContainer />
      <ItemEditor />
    </div>
  );
}

export default App;
