/**
 * @jsx React.DOM
 */
'use strict';

var PageTitleMixin = {

  updatePageTitle: function(title) {
    var newPageTitle = '';

    if ( title ) {
      newPageTitle += title;
      newPageTitle += ' \u2014 ';
    }

    newPageTitle += 'Monolist';

    document.title = newPageTitle;
  }

};

module.exports = PageTitleMixin;