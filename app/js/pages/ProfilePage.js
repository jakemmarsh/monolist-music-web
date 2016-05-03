'use strict';

import React               from 'react';
import {ListenerMixin}     from 'reflux';
import _                   from 'lodash';
import DocumentTitle       from 'react-document-title';

import Helpers             from '../utils/Helpers';
import MetaTagsMixin       from '../mixins/MetaTagsMixin';
import UserActions         from '../actions/UserActions';
import ViewingProfileStore from '../stores/ViewingProfileStore';
import ProfileSubheader    from '../components/ProfileSubheader';
import TabBar              from '../components/TabBar';
import ListLink            from '../components/ListLink';

const ProfilePage = React.createClass({

  mixins: [ListenerMixin, MetaTagsMixin],

  propTypes: {
    children: React.PropTypes.object,
    params: React.PropTypes.object,
    query: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    userLikes: React.PropTypes.array
  },

  getInitialState() {
    return {
      currentUser: {},
      profile: {},
      error: null
    };
  },

  _onViewingProfileChange(err, profile) {
    if ( err ) {
      this.setState({ error: err });
    } else {
      this.setState({ profile: profile }, () => {
        this.updateMetaTags({
          'url': 'http://www.monolist.co/profile/' + this.state.profile.username,
          'title': this.state.profile.username,
          'name': this.state.profile.username,
          'image': this.state.profile.imageUrl
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
    return this.props.children && React.cloneElement(this.props.children, {
      params: this.props.params,
      query: this.props.query,
      currentUser: this.props.currentUser,
      currentTrack: this.props.currentTrack,
      user: this.state.profile,
      userCollaborations: this.props.userCollaborations,
      userLikes: this.props.userLikes
    });
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle(this.state.profile.username)}>
      <div className="d-f fx-4">
        <section className="content profile fx-3">
          <ProfileSubheader currentUser={this.props.currentUser}
                            profile={this.state.profile} />
          <div className="max-width-wrapper">
            <TabBar className="nudge-half--bottom">
              <ListLink to={`/profile/${this.props.params.username}/playlists`}>
                Playlists
              </ListLink>
              <ListLink to={`/profile/${this.props.params.username}/collaborations`}>
                Collaborations
              </ListLink>
              <ListLink to={`/profile/${this.props.params.username}/groups`}>
                Groups
              </ListLink>
              <ListLink to={`/profile/${this.props.params.username}/likes`}>
                Likes
              </ListLink>
              <ListLink to={`/profile/${this.props.params.username}/starred`}>
                Stars
              </ListLink>
            </TabBar>
            {this.renderChildren()}
          </div>
        </section>
      </div>
      </DocumentTitle>
    );
  }

});

export default ProfilePage;
