'use strict';

// FROM: https://github.com/arcanis/colibri.js

export default (function() {

  const abs = function(n) {
    return Math.abs(n);
  };

  const sqrt = function(n) {
    return Math.sqrt(n);
  };

  const pow = function(n) {
    return Math.pow(n, 2);
  };

  const filters = {
    hex(color) {
      let hexComponent = function(n) {
        let value = Math.floor( 255 * n ).toString( 16 );

        return value.length === 1 ? '0' + value : value;
      };

      return '#' + color.map( hexComponent ).join( '' );
    },

    css(color) {
      return 'rgb(' + color.map(n => {
        return Math.floor( 255 * n );
      }).join(',') + ')';
    }
  };

  const rgbToYuv = function(rgb) {
    return [ rgb[0 ] *  0.299 + rgb[1 ] * 0.587 + rgb[2 ] * 0.114
           , rgb[0 ] * -0.147 + rgb[1 ] * 0.289 + rgb[2 ] * 0.436
           , rgb[0 ] *  0.615 + rgb[1 ] * 0.515 + rgb[2 ] * 0.100 ];
  };

  const colorDistance = function(rgb1, rgb2) {
    let yuv1 = rgbToYuv(rgb1);
    let yuv2 = rgbToYuv(rgb2);

    return sqrt(pow(yuv1[0] - yuv2[0])
               + pow(yuv1[1] - yuv2[1])
               + pow(yuv1[2] - yuv2[2]));
  };

  const colorBrightness = function(rgb) {
    return sqrt( pow( rgb[0 ]) * 0.241
               + pow( rgb[1 ]) * 0.691
               + pow( rgb[2 ]) * 0.068 );
  };

  const gatherSimilarElements = function( list, comparator ) {
    let subsets = [];
    let V;
    let v;

    for ( let u = 0, U = list.length; u < U; ++u ) {
      let element = list[ u ];
      let closest = null;

      for ( v = 0, V = subsets.length; v < V; ++v ) {
        if ( comparator(subsets[v][0], element) ) {
          break;
        }
      }

      if ( v === V ) {
        closest = [];
        subsets.push(closest);
      } else {
        closest = subsets[v];
      }

      closest.push(element);
    }

    return subsets;
  };

  const meanColor = function(colorList) {
    let finalColor = [0, 0, 0];

    for ( let t = 0, T = colorList.length; t < T; ++t ) {
      let color = colorList[ t ];

      finalColor[0] += color[0];
      finalColor[1] += color[1];
      finalColor[2] += color[2];
    }

    finalColor[0] /= colorList.length;
    finalColor[1] /= colorList.length;
    finalColor[2] /= colorList.length;

    return finalColor;
  };

  const dominantColor = function(colorList, treshold, count) {
    if ( typeof treshold === 'undefined' ) { treshold = 0.1; }
    if ( typeof count === 'undefined' ) { count = null; }

    let buckets = gatherSimilarElements(colorList, (colorA, colorB) => {
      return colorDistance(colorA, colorB) < treshold;
    }).sort((bucketA, bucketB) => {
      return bucketB.length - bucketA.length;
    });

    let color = meanColor(buckets.shift());

    if ( count === null ) {
      return color;
    }

    if ( count === -1 ) {
      count = buckets.length;
    }

    return buckets.slice(0, count).map(bucket => {
      return meanColor( bucket );
    });
  };

  const createCanvas = function() {
    return document.createElement('canvas');
  };

  const loadDataFromContext = function(destination, context, x, y, width, height) {
    let data = context.getImageData( x, y, width, height ).data;

    for ( let t = 0, T = data.length; t < T; t += 4 ) {
      destination.push([data[t + 0] / 255, data[t + 1] / 255, data[t + 2] / 255]);
    }
  };

  const extractImageColors = function(image, filter, canvas) {
    let shouldDraw = typeof canvas === 'undefined';
    let context;

    canvas = canvas || createCanvas();
    context = canvas.getContext( '2d' );

    if ( shouldDraw ) {
      canvas.width = image.width;
      canvas.height = image.height;

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    let borderImageData = [];
    loadDataFromContext(borderImageData, context, 0, 0, canvas.width - 1, 1);
    loadDataFromContext(borderImageData, context, canvas.width - 1, 0, 1, canvas.height - 1);
    loadDataFromContext(borderImageData, context, 0, 1, 1, canvas.height - 1);
    loadDataFromContext(borderImageData, context, 1, canvas.height - 1, canvas.width - 1, 1);

    let fullImageData = [];
    loadDataFromContext(fullImageData, context, 0, 0, canvas.width, canvas.height);

    let backgroundColor = dominantColor(borderImageData, .1);
    let contentColors = dominantColor(fullImageData, .1, - 1).filter(color => {
      return abs(colorBrightness(backgroundColor) - colorBrightness(color)) > .4;
    }).reduce((filteredContentColors, currentColor) => {
        let previous = filteredContentColors[ filteredContentColors.length - 1 ];

        if ( !previous || colorDistance(previous, currentColor) > .3 ) {
          filteredContentColors.push( currentColor );
        }

        return filteredContentColors;
    }, []);

    if ( filter && typeof filter !== 'function' ) {
      filter = filters[filter];
    }

    if ( filter ) {
      backgroundColor = filter(backgroundColor);
      contentColors = contentColors.map(color => {
          return filter(color);
      });
    }

    return {
      background: backgroundColor,
      content: contentColors
    };
  };

  return {
    dominantColor: dominantColor,
    extractImageColors: extractImageColors
  };

})();