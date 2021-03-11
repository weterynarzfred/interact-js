import { _ } from 'lodash';
import mangadexUpdateItem from './mangadexUpdateItem';
import mangatownUpdateItem from './mangatownUpdateItem';

async function updateItem(item, dispatch) {
  dispatch({
    type: 'MARK_ITEM',
    id: item.id,
    set: true,
    prop: 'loading',
  });

  let success = false;
  if (_.get(item, 'mangadex.id')) {
    success = await mangadexUpdateItem(item, dispatch);
  }
  if (_.get(item, 'mangatown.id')) {
    success = success || (await mangatownUpdateItem(item, dispatch));
  }

  if (!success) {
    dispatch({
      type: 'MARK_ITEM',
      id: item.id,
      set: true,
      prop: 'failedUpdates',
    });
  }

  dispatch({
    type: 'MARK_ITEM',
    id: item.id,
    set: false,
    prop: 'loading',
  });
}

export default updateItem;
