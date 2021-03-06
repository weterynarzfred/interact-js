function getUnread(item) {
  let unread = 0;
  try {
    const read = parseFloat(item.manual.read);
    const ready = parseFloat(item.mangadex.ready.number);
    if (!isNaN(read) && !isNaN(ready)) {
      unread = Math.max(ready - read, 0);
    }
  } catch (e) {}
  return unread;
}

export default getUnread;
