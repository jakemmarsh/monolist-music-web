'use strict';

import React           from 'react/addons';
import _               from 'lodash';
import {ListenerMixin} from 'reflux';

import GroupActions    from '../actions/GroupActions';
import PlaylistList    from '../components/PlaylistList';

var GroupPlaylistsPage = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    group: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      loading: false,
      error: null,
      playlists: []
    };
  },

  _onPlaylistsChange(err, playlists) {
    if ( err ) {
      this.setState({ error: err });
    } else {
      this.setState({
        loading: false,
        error: null,
        playlists: playlists || []
      });
    }
  },

  componentDidUpdate(prevProps) {
    if ( !_.isEmpty(this.props.group) && !_.isEqual(this.props.group, prevProps.group) ) {
      GroupActions.loadPlaylists(this.props.group.id, this._onPlaylistsChange);
    }
  },

  componentDidMount() {
    if ( !_.isEmpty(this.props.group) ) {
      GroupActions.loadPlaylists(this.props.group.id, this._onPlaylistsChange);
    }
  },

  render() {
    return (
      <div>
        <PlaylistList playlists={this.state.playlists} cardClassName="pure-u-1-3" />
      </div>
    );
  }

});

export default GroupPlaylistsPage;