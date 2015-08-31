'use strict';

import React                   from 'react/addons';
import {ListenerMixin}         from 'reflux';
import _                       from 'lodash';
import {RouteHandler}          from 'react-router';
import DocumentTitle           from 'react-document-title';

import Helpers                 from '../utils/Helpers';
import MetaTagsMixin           from '../mixins/MetaTagsMixin';
import UserActions             from '../actions/UserActions';
import ViewingProfileStore     from '../stores/ViewingProfileStore';
import AuthenticatedRouteMixin from '../mixins/AuthenticatedRouteMixin';
import ProfileSidebar          from '../components/ProfileSidebar';
import TabBar                  from '../components/TabBar';
import ListLink                from '../components/ListLink';

var ProfilePage = React.createClass({

  mixins: [AuthenticatedRouteMixin, ListenerMixin, MetaTagsMixin],

  propTypes: {
    params: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object.isRequired,
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

  render() {
    console.log(this.props.currentUser);
    return (
      <DocumentTitle title={Helpers.buildPageTitle(this.state.user.username)}>
      <div>

        <section className="content profile has-right-sidebar">
          <TabBar className="nudge-half--bottom">
            <ListLink to="ProfilePlaylists" params={{ username: this.props.params.username }}>
              Playlists
            </ListLink>
            <ListLink to="ProfileCollaborations" params={{ username: this.props.params.username }}>
              Collaborations
            </ListLink>
            <ListLink to="ProfileLikes" params={{ username: this.props.params.username }}>
              Likes
            </ListLink>
            <ListLink to="ProfileStars" params={{ username: this.props.params.username }}>
              Stars
            </ListLink>
          </TabBar>

          <RouteHandler {...this.props} {...this.state} currentUser={this.props.currentUser} />
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