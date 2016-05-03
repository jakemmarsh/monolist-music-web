'use strict';

const Animations = {

  fadeIn(elem, duration = 500) {
    return new Promise((resolve) => {
      let opacity = 0;

      elem.style.opacity = opacity;
      elem.style.filter = `alpha(opacity=${opacity})`;
      elem.style.display = 'inline-block';
      elem.style.visibility = 'visible';

      const timer = setInterval(() => {
        opacity += 50/duration;

        if ( opacity >= 1 ) {
          clearInterval(timer);
          opacity = 1;
        }

        elem.style.opacity = opacity;
        elem.style.filter = `alpha(opacity=${opacity * 100})`;

        if ( opacity === 1 ) {
          resolve();
        }
      }, 50);
    });
  },

  fadeOut(elem, duration = 500) {
    return new Promise((resolve) => {
      let opacity = 1;

      const timer = setInterval(() => {
        opacity -= 50/duration;

        if ( opacity <= 0 ) {
          clearInterval(timer);
          opacity = 0;
          elem.style.display = 'none';
          elem.style.visibility = 'hidden';
        }

        elem.style.opacity = opacity;
        elem.style.filter = `alpha(opacity=${opacity * 100})`;

        if ( opacity === 0 ) {
          resolve();
        }
      }, 50);
    });
  }

};

export default Animations;
