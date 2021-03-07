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
  let data;
  if (!fs.existsSync(`${__static}`)) {
    fs.mkdirSync(`${__static}`);
  }
  if (fs.existsSync(`${__static}/items.json`)) {
    const file = fs.readFileSync(`${__static}/items.json`, {
      encoding: 'utf8',
    });
    data = JSON.parse(file);
  } else {
    data = { nextId: 0, items: {} };
  }

  const initialState = {
    nextId: data.nextId,
    items: data.items,
    switches: {
      itemEditorOpened: false,
      itemEditorItemId: -1,
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
          if (action.item === undefined) {
            _.set(newState.items[action.id], action.prop, action.value);
          } else {
            newState.items[action.item.id] = action.item;
          }
          saveData(newState);
          break;
        case 'OPEN_EDITOR':
          newState.switches.itemEditorOpened = action.open;
          newState.switches.itemEditorItemId =
            action.itemId === undefined ? -1 : action.itemId;
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
