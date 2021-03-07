import React from 'react';
import Controls from './Controls';
import ItemContainer from './ItemContainer';
import ItemEditor from './ItemEditor';

function App(props) {
  return (
    <div className="App">
      <Controls />
      <ItemContainer />
      <ItemEditor />
    </div>
  );
}

export default App;
