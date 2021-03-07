import _ from 'lodash';

function getTitle(item) {
  let title = _.get(item, 'manual.title');
  if (!title) title = _.get(item, 'mangadex.title');
  return title;
}

export default getTitle;
