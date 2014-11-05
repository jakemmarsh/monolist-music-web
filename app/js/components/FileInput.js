/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var FileInput = React.createClass({

  propTypes: {
    processFile: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      dataUri: null,
    };
  },

  handleSubmit: function(e) {
    e.preventDefault();
  },

  handleFile: function(e) {
    var reader = new FileReader();
    var file = e.target.files[0];

    reader.onload = function(upload) {
      this.setState({
        dataUri: upload.target.result,
      }, function() {
        this.props.processFile(this.state.dataUri);
      });
    }.bind(this);

    reader.readAsDataURL(file);
  },

  render: function() {
    return (
      <input type="file" onChange={this.handleFile} />
    );
  }

});

module.exports = React.createFactory(FileInput);