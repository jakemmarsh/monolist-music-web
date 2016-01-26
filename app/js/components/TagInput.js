'use strict';

import React     from 'react';
import TagsInput from 'react-tagsinput';

var TagInput = React.createClass({

  propTypes: {
    tags: React.PropTypes.array,
    placeholder: React.PropTypes.string,
    limit: React.PropTypes.number,
    addKeys: React.PropTypes.array,
    onChange: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      limit: 3,
      addKeys: [9, 3, 188, 32],

    };
  },

  getInitialState() {
    return {
      tags: this.props.tags || []
    };
  },

  handleChange(tags) {
    this.setState({ tags: tags.slice(0, this.props.limit) }, () => {
      this.props.onChange(this.state.tags);
    });
  },

  render() {
    const inputProps = {
      id: 'tags',
      className: 'react-tagsinput-input',
      placeholder: this.props.placeholder
    };

    return (
      <TagsInput value={this.state.tags}
                 addKeys={this.props.addKeys}
                 inputProps={inputProps}
                 onChange={this.handleChange} />
    );
  }

});

export default TagInput;
