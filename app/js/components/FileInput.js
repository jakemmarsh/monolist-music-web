'use strict';

import React from 'react';

var FileInput = React.createClass({

  propTypes: {
    processFile: React.PropTypes.func,
    id: React.PropTypes.string,
    accept: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      accept: '*',
      id: ''
    };
  },

  handleSubmit(e) {
    e.preventDefault();
  },

  onFileSelect(e) {
    this.props.processFile(e.target.files[0]);
  },

  render() {
    return (
      <input type="file" id={this.props.id} accept={this.props.accept} onChange={this.onFileSelect} />
    );
  }

});

export default FileInput;