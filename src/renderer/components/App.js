import React from 'react';
import Controls from './Controls';
import ItemContainer from './ItemContainer';
import ItemCreator from './ItemCreator';

function App(props) {
  return (
    <div className="App">
      <ItemContainer />
      <Controls />
      <ItemCreator />
    </div>
  );
}

export default App;
