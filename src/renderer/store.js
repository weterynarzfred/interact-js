import fs from 'fs';
import { createStore } from 'redux';
import produce from 'immer';

function initStore() {
  const file = fs.readFileSync('./static/items.json', { encoding: 'utf8' });
  const data = JSON.parse(file);

  const initialState = {
    nextId: data.nextId,
    items: data.items,
    switches: {
      itemCreatorOpened: false,
    },
  };

  function rootReducer(state = initialState, action = '') {
    return produce(state, newState => {
      switch (action.type) {
        case 'ADD_ITEM':
          newState.items[state.nextId] = action.item;
          newState.nextId = state.nextId + 1;
          fs.writeFileSync(
            './static/items.json',
            JSON.stringify({
              nextId: newState.nextId,
              items: newState.items,
            })
          );
          break;
        case 'SWITCH':
          newState.switches[action.name] = action.value;
          break;
        default:
      }

      return newState;
    });
  }

  return createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}

export default initStore;
