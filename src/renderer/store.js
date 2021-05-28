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
    filter: '',
    switches: {
      itemEditorOpened: false,
      itemEditorItemId: -1,
      loading: [],
      loadingCount: 0,
      failedUpdates: [],
      failedUpdatesCount: 0,
      fresh: [],
      freshCount: 0,
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
        case 'MARK_ITEM':
          const IDs = isArray(action.id) ? action.id : [action.id];
          if (action.set) {
            if (state.switches[action.prop].length === 0) {
              newState.switches[action.prop + 'Count'] = IDs.length;
            } else {
              newState.switches[action.prop + 'Count'] =
                state.switches[action.prop + 'Count'] + IDs.length;
            }
            for (const ID of IDs) {
              if (!newState.switches[action.prop].includes(parseInt(ID))) {
                newState.switches[action.prop].push(parseInt(ID));
              }
            }
          } else {
            for (const ID of IDs) {
              const removeIndex = newState.switches[action.prop].indexOf(
                parseInt(ID)
              );
              if (removeIndex !== -1) {
                newState.switches[action.prop].splice(removeIndex, 1);
                console.log(newState.switches[action.prop + 'Count']);
                newState.switches[action.prop + 'Count'] =
                  state.switches[action.prop + 'Count'] - 1;
              }
            }
          }
          break;
        case 'FILTER':
          newState.filter = action.value;
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
