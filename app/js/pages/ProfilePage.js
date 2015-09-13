'use strict';

import React               from 'react/addons';
import {ListenerMixin}     from 'reflux';
import _                   from 'lodash';
import DocumentTitle       from 'react-document-title';

import Helpers             from '../utils/Helpers';
import MetaTagsMixin       from '../mixins/MetaTagsMixin';
import UserActions         from '../actions/UserActions';
import ViewingProfileStore from '../stores/ViewingProfileStore';
import ProfileSidebar      from '../components/ProfileSidebar';
import TabBar              from '../components/TabBar';
import ListLink            from '../components/ListLink';

var ProfilePage = React.createClass({

  mixins: [ListenerMixin, MetaTagsMixin],

  propTypes: {
    children: React.PropTypes.object,
    params: React.PropTypes.object,
    query: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    currentTrack: React.PropTypes.object
  },

  getInitialState() {
    return {
      currentUser: {},
      user: {},
      error: null
    };
  },

  _onViewingProfileChange(err, user) {
    if ( err ) {
      this.setState({ error: err });
    } else {
      this.setState({ user: user }, () => {
        this.updateMetaTags({
          'url': 'http://www.monolist.co/profile/' + this.state.user.username,
          'title': this.state.user.username,
          'name': this.state.user.username,
          'image': this.state.user.imageUrl
        });
      });
    }
  },

  componentWillReceiveProps(nextProps) {
    if ( nextProps.params.username !== this.props.params.username || !_.isEqual(this.props.currentUser, nextProps.currentUser) ) {
      UserActions.openProfile(nextProps.params.username);
    }
  },

  componentDidMount() {
    this.listenTo(ViewingProfileStore, this._onViewingProfileChange);
    UserActions.openProfile(this.props.params.username);
  },

  renderChildren() {
    return this.props.children && React.coleElement(this.props.children, {
      params: this.props.params,
      query: this.props.query,
      currentUser: this.props.currentUser,
      user: this.state.user
    });
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle(this.state.user.username)}>
      <div>

        <section className="content profile has-right-sidebar">
          <TabBar className="nudge-half--bottom">
            <ListLink to={`/profile/${this.props.params.username}/playlists`}>
              Playlists
            </ListLink>
            <ListLink to={`/profile/${this.props.params.username}/collaborations`}>
              Collaborations
            </ListLink>
            <ListLink to={`/profile/${this.props.params.username}/likes`}>
              Likes
            </ListLink>
            <ListLink to={`/profile/${this.props.params.username}/starred`}>
              Stars
            </ListLink>
          </TabBar>

          {this.renderChildren()}
        </section>

        <nav className="sidebar right">
          <ProfileSidebar currentUser={this.props.currentUser} user={this.state.user} />
        </nav>

      </div>
      </DocumentTitle>
    );
  }

});

export default ProfilePage;