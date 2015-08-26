'use strict';

import React       from 'react/addons';
import _           from 'lodash';
import getUrls     from 'get-urls';
import TextArea    from 'react-textarea-autosize';

import PostAPI     from '../utils/PostAPI';
import PostActions from '../actions/PostActions';
import Track       from './Track';

var CreatePostForm = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    requiresTrack: React.PropTypes.bool,
    className: React.PropTypes.string,
    group: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      requiresTrack: true
    };
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
    let isValid = !_.isEmpty(this.state.track) || (!this.props.requiresTrack && this.state.body.length);

    if ( isValid ) {
      this.setState({ submitDisabled: false });
    } else {
      this.setState({ submitDisabled: true });
    }
  },

  buildTrack(source, sourceUrl) {
    PostAPI.getTrackDetails(source, sourceUrl).then((track) => {
      this.setState({ track: track });
    });
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

    if ( source && sourceUrl ) {
      this.buildTrack(source, sourceUrl);
    } else {
      this.clearTrack();
    }
  },

  clearTrack() {
    this.setState({ track: {} });
  },

  handleChange(evt) {
    let newVal = evt.target.value;
    let urls = getUrls(newVal);

    this.setState({ body: newVal }, this.checkUrls.bind(null, urls));
  },

  handleSubmit(evt) {
    let post = {
      user: this.props.currentUser,
      body: this.state.body,
      track: !_.isEmpty(this.state.track) ? this.state.track : null,
      comments: [],
      createdAt: new Date(),
      GroupId: this.props.group ? this.props.group.id : null
    };

    evt.preventDefault();

    PostActions.create(post, () => {
      this.setState(this.getInitialState());
    });
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
    let classes = 'create-post table full-width';

    if ( this.props.className ) {
      classes = classes + ' ' + this.props.className;
    }

    return (
      <form className={classes} onSubmit={this.handleSubmit}>

        <div className="td form-container">
          <TextArea value={this.state.body}
                    placeholder="Share a track..."
                    onChange={this.handleChange}>
          </TextArea>

          {this.renderTrack()}
        </div>

        <div className="td text-right button-container">
          <input ref="submitButton"
                 type="submit"
                 className="btn"
                 value="Post"
                 disabled={this.state.submitDisabled ? 'true' : ''} />
        </div>

      </form>
    );
  }

});

export default CreatePostForm;