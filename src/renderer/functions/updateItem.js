import { _ } from 'lodash';
import getProp from '../functions/getProp';
import mangadexUpdateItem from './mangadexUpdateItem';
import mangatownUpdateItem from './mangatownUpdateItem';

async function updateItem(item, dispatch) {
  dispatch({
    type: 'MARK_ITEM',
    id: item.id,
    set: true,
    prop: 'loading',
  });

  let prevReady = getProp(item, 'ready');

  let latestChapterNumber = false;
  if (_.get(item, 'mangadex.id')) {
    latestChapterNumber = await mangadexUpdateItem(item, dispatch);
  }
  if (_.get(item, 'mangatown.id')) {
    latestChapterNumber = latestChapterNumber || (await mangatownUpdateItem(item, dispatch));
  }

  if (!latestChapterNumber) {
    dispatch({
      type: 'MARK_ITEM',
      id: item.id,
      prop: 'failedUpdates',
      set: true,
    });
  }

  if (latestChapterNumber > prevReady) {
    dispatch({
      type: 'MARK_ITEM',
      id: item.id,
      prop: 'fresh',
      set: true,
    });
  }

  dispatch({
    type: 'MARK_ITEM',
    id: item.id,
    prop: 'loading',
    set: false,
  });
}

export default updateItem;
