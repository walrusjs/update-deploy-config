export default {
  iterator: (key, obj) => {
    if (key === 'baseURL') {
      return 'test';
    }
    return obj[key];
  }
}
