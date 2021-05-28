import _ from 'lodash';

const providers = {
  mangadex: {
    getLink: item => `https://mangadex.org/title/${_.get(item, 'mangadex.id')}`,
  },
  mangatown: {
    getLink: item => `https://www.mangatown.com/manga/${_.get(item, 'mangatown.id')}`,
  },
};

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

    case 'cover':
      const dir = `.${process.env.NODE_ENV === 'production' ? '/../static' : ''
        }`;
      let cover = _.get(item, 'mangadex.cover');
      if (![undefined, ''].includes(cover)) {
        return `${dir}/mangadexCovers/${cover}`;
      }

      cover = _.get(item, 'mangatown.cover');
      if (![undefined, ''].includes(cover)) {
        return `${dir}/mangatownCovers/${cover}`;
      }

      if (cover === undefined) cover = '';
      return cover;

    case 'link':
      let max = 0;
      let currentProvider;
      for (const providerSlug in providers) {
        const ready = _.get(item, `${providerSlug}.ready`);
        if (ready > max) {
          max = ready;
          currentProvider = providers[providerSlug];
        }
      }
      if (currentProvider === undefined) return '';
      return currentProvider.getLink(item);
  }
}

export default getProp;
