'use strict';

import React  from 'react';
import {Link} from 'react-router';

const CreateNewCard = React.createClass({

  propTypes: {
    type: React.PropTypes.oneOf(['playlist', 'group']),
    onClick: React.PropTypes.func
  },

  renderLink() {
    let element;

    if ( this.props.onClick ) {
      element = (
        <a href onClick={this.props.onClick} />
      );
    } else {
      element = (
        <Link to={`/${this.props.type}s/create`} />
      );
    }

    return element;
  },

  render() {
    const capitalizedType = this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1);

    return (
      <div className="create-new-card nudge-half--bottom nudge-half--right">
        <div className="create-new-card-inner">
          <div className="create-new-card-icon-container td islet">
            <i className="create-new-card-icon icon-plus" />
          </div>
          <div className="create-new-card-details-container td islet">
            <h5 className="title">Create New {capitalizedType}</h5>
          </div>
        </div>
        {this.renderLink()}
      </div>
    );
  }

});

export default CreateNewCard;