import tree from '../state';

export function setCursorData(cursor, data, reset, newDataObj) {
  let updatedData = false;
  const dataObj = newDataObj || {
    loading: false,
    data,
    error: null
  };

  if (reset) {
    cursor.set(dataObj);
    updatedData = true;
  } else if (cursor.get()) {
    cursor.merge(dataObj);
    updatedData = true;
  }

  if (updatedData) {
    tree.commit();
  }

  return updatedData;
}

export function setCursorError(cursor, error, message, data) {
  // Keep this so we can see the error when it happens
  console.error(error);

  if (cursor.get()) {
    cursor.merge({
      loading: false,
      data: data,
      error: message || error.message
    });

    tree.commit();
  }
}
