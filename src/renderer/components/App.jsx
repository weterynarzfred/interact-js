import React from 'react';
import Controls from './Controls.jsx';
import ItemContainer from './ItemContainer.jsx';
import ItemEditor from './ItemEditor.jsx';

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
