import React from 'react';
import Controls from './Controls.jsx';
import ItemContainer from './ItemContainer.jsx';
import ItemCreator from './ItemCreator.jsx';

function App(props) {
  return (
    <div className="App">
      <Controls />
      <ItemContainer />
      <ItemCreator />
    </div>
  );
}

export default App;
