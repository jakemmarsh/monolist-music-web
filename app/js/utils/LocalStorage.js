'use strict';

function localStorageSupported() {
  const test = 'test';

  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
}

const LocalStorage = {

  localStorageSupported: localStorageSupported(),

  set(key, val) {
    if ( this.localStorageSupported ) {
      localStorage.setItem(key, val);
    }
  },

  get(key) {
    if ( this.localStorageSupported ) {
      return localStorage.getItem(key);
    }

    return null;
  },

  del(key) {
    if ( this.localStorageSupported ) {
      localStorage.removeItem(key);
    }
  }

};

export default LocalStorage;
