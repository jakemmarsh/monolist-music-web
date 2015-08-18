'use strict';

import React   from 'react/addons';
import _       from 'lodash';
import getUrls from 'get-urls';

import Track   from './Track';

var CreatePostForm = React.createClass({

  propTypes: {
    requiresTrack: React.PropTypes.bool,
    handlePostCreation: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      requiresTrack: true,
      handlePostCreation: function() {}
    }
  },

  getInitialState() {
    return {
      body: '',
      track: {},
      submitDisabled: true
    };
  },

  componentDidUpdate(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  checkForm() {
    if ( this.props.track ) {
      this.setState({ submitDisabled: false });
    } else if ( !this.props.requiresTrack && !this.state.body ) {
      this.setState({ submitDisabled: true });
    }
  },

  buildTrack(sourceUrl, source) {
    let newTrack;

    // TODO: get track info
    newTrack = {
      id: 1,
      title: 'test title'
    };

    console.log('build track:', sourceUrl, source);

    this.setState({ track: newTrack });
  },

  checkUrls(urls) {
    let scRegex = new RegExp('soundcloud.com', 'i');
    let ytRegex = new RegExp('youtu\.be|youtube\.com', 'i');
    let bcRegex = new RegExp('bandcamp.com', 'i');
    let source = null;
    let sourceUrl = _.find(urls, (url) => {
      if ( scRegex.test(url) ) {
        source = 'soundcloud';
        return true;
      } else if ( ytRegex.test(url) ) {
        source = 'youtube';
        return true;
      } else if ( bcRegex.test(url) ) {
        source = 'bandcamp';
        return true;
      }
    });

    if ( sourceUrl ) {
      this.buildTrack(sourceUrl, source);
    }
  },

  handleChange(evt) {
    let newVal = evt.target.value;
    let urls = getUrls(newVal);

    this.setState({ body: newVal }, this.checkUrls.bind(null, urls));
  },

  handleSubmit(evt) {
    let post;

    evt.preventDefault();

    this.props.handlePostCreation(post);
  },

  renderTrack() {
    if ( !_.isEmpty(this.state.track) ) {
      return (
        <Track type="post"
               track={this.state.track}
               index={0}
               currentUser={this.props.currentUser} />
      );
    }
  },

  render() {
    return (
      <form className="create-post" onSubmit={this.handleSubmit}>

        <div className="create-post-inner">
          <textarea value={this.state.body}
                    onChange={this.handleChange}>
          </textarea>

          {this.renderTrack()}
        </div>

        <input ref="submitButton"
               type="submit"
               className="btn"
               value="Post"
               disabled={this.state.submitDisabled ? 'true' : ''} />

      </form>
    );
  }

});

export default CreatePostForm;