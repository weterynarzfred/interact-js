import _ from 'lodash';

function getProp(item, prop) {
  switch (prop) {
    case 'title':
      let title = _.get(item, 'manual.title');
      if ([undefined, ''].includes(title))
        title = _.get(item, 'mangadex.title');
      if (title === undefined) title = '';
      return title;
    case 'read':
      let read = _.get(item, 'manual.read');
      if (isNaN(read)) read = 0;
      return Math.max(0, read);
    case 'ready':
      let ready = _.get(item, 'manual.ready');
      if (isNaN(ready)) ready = 0;

      let mangadexReady = Math.max(ready, _.get(item, 'mangadex.ready'));
      if (isNaN(mangadexReady)) mangadexReady = 0;

      let mangatownReady = Math.max(ready, _.get(item, 'mangatown.ready'));
      if (isNaN(mangatownReady)) mangatownReady = 0;

      return Math.max(ready, mangadexReady, mangatownReady, 0);
    case 'unread':
      let unread = Math.max(getProp(item, 'ready') - getProp(item, 'read'), 0);
      return Math.round(unread * 100) / 100;
    case 'rating':
      let rating = _.get(item, 'manual.rating');
      if (isNaN(rating)) rating = 0;
      return Math.max(0, rating);
  }
}

export default getProp;
