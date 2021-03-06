import fs from 'fs';
import { createStore } from 'redux';
import produce from 'immer';
import _, { isArray } from 'lodash';

function saveData(state) {
  fs.writeFileSync(
    `${__static}/items.json`,
    JSON.stringify({
      nextId: state.nextId,
      items: state.items,
    })
  );
}

function initStore() {
  const file = fs.readFileSync(`${__static}/items.json`, {
    encoding: 'utf8',
  });
  const data = JSON.parse(file);

  const initialState = {
    nextId: data.nextId,
    items: data.items,
    switches: {
      itemCreatorOpened: false,
      loading: [],
    },
  };

  function rootReducer(state = initialState, action = '') {
    return produce(state, newState => {
      switch (action.type) {
        case 'ADD_ITEM':
          console.log(action);
          newState.items[action.item.id] = action.item;
          newState.nextId = state.nextId + 1;
          saveData(newState);
          break;
        case 'DELETE_ITEM':
          console.log(action);
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
        case 'MARK_ITEM_LOADING':
          const loadingIds = isArray(action.id) ? action.id : [action.id];
          if (action.loading) {
            for (const loadingId of loadingIds) {
              if (!newState.switches.loading.includes(parseInt(loadingId))) {
                newState.switches.loading.push(parseInt(loadingId));
              }
            }
          } else {
            for (const loadingId of loadingIds) {
              const removeIndex = newState.switches.loading.indexOf(
                parseInt(loadingId)
              );
              if (removeIndex !== -1) {
                newState.switches.loading.splice(removeIndex, 1);
              }
            }
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
