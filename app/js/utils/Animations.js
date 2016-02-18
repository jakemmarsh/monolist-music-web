'use strict';

const Animations = {

  fadeIn(elem, duration = 500) {
    return new Promise((resolve) => {
      let opacity = 0;

      elem.style.display = 'inline-block';

      let timer = setInterval(() => {
        if ( opacity >= 1 ) {
          clearInterval(timer);
          resolve();
        } else {
          opacity += 0.1;
          elem.style.opacity = opacity;
        }
      }, duration/10);
    });
  },

  fadeOut(elem, duration = 500) {
    return new Promise((resolve) => {
      let opacity = elem.style.opacity;

      let timer = setInterval(() => {
        if ( opacity <= 0 ) {
          elem.style.display = 'none';
          clearInterval(timer);
          resolve();
        } else {
          opacity -= 0.1;
          elem.style.opacity = opacity;
        }
      }, duration/10);
    });
  }

};

export default Animations;
