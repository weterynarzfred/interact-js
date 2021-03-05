import fs from 'fs';
import { createStore } from 'redux';
import produce from 'immer';
import _ from 'lodash';

function saveData(state) {
  fs.writeFileSync(
    './static/items.json',
    JSON.stringify({
      nextId: state.nextId,
      items: state.items,
    })
  );
}

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
          saveData(newState);
          break;
        case 'DELETE_ITEM':
          delete newState.items[action.id];
          saveData(newState);
          break;
        case 'UPDATE_ITEM':
          console.log(action);
          try {
            _.set(newState.items[action.id], action.prop, action.value);
            saveData(newState);
          } catch (e) {
            console.log(e);
          }
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
