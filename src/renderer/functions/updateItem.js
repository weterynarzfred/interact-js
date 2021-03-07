import { _ } from 'lodash';
import mangadexUpdateItem from './mangadexUpdateItem';
import mangatownUpdateItem from './mangatownUpdateItem';

async function updateItem(item, dispatch) {
  dispatch({
    type: 'MARK_ITEM_LOADING',
    id: item.id,
    loading: true,
  });

  if (_.get(item, 'mangadex.id')) {
    await mangadexUpdateItem(item, dispatch);
  }
  if (_.get(item, 'mangatown.id')) {
    await mangatownUpdateItem(item, dispatch);
  }

  dispatch({
    type: 'MARK_ITEM_LOADING',
    id: item.id,
    loading: false,
  });
}

export default updateItem;
