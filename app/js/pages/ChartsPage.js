'use strict';

import React           from 'react';
import {ListenerMixin} from 'reflux';
import moment          from 'moment';
import _               from 'lodash';
import DocumentTitle   from 'react-document-title';

import Helpers         from '../utils/Helpers';
import GlobalActions   from '../actions/GlobalActions';
import ChartsPageStore from '../stores/ChartsPageStore';
import Title           from '../components/Title';
import PlaylistList    from '../components/PlaylistList';

const PlaylistsPage = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    userLikes: React.PropTypes.array,
    playlist: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      userCollaborations: [],
      userLikes: []
    };
  },

  getInitialState() {
    return {
      playlists: {
        trending: [],
        topMonthly: []
      }
    };
  },

  _onPlaylistsChange(err, playlists) {
    if ( err ) {
      this.setState({
        loading: false,
        error: err
      });
    } else if ( playlists ) {
      this.setState({
        loading: false,
        error: null,
        playlists: playlists
      });
    }
  },

  componentDidMount() {
    this.listenTo(ChartsPageStore, this._onPlaylistsChange);
    GlobalActions.loadChartsPage();
  },

  renderTrendingPlaylists() {
    if ( !_.isEmpty(this.state.playlists.trending) ) {
      return (
        <div>
          <Title text="Trending Playlists" icon="line-chart" />
          <PlaylistList playlists={this.state.playlists.trending}
                        cardClassName="pure-u-1-3" />
        </div>
      );
    }
  },

  renderTopMonthlyPlaylists() {
    if ( !_.isEmpty(this.state.playlists.topMonthly) ) {
      const en = moment().locale('en');
      const currentMonthName = en.localeData().months(moment());

      return (
        <div>
          <Title text={`Top Playlists for ${currentMonthName}`} icon="calendar-o" />
          <PlaylistList playlists={this.state.playlists.topMonthly}
                        cardClassName="pure-u-1-3" />
        </div>
      );
    }
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Charts')}>
      <section className="content charts fx-4 max-width-wrapper">

        {this.renderTrendingPlaylists()}

        {this.renderTopMonthlyPlaylists()}

      </section>
      </DocumentTitle>
    );
  }

});

export default PlaylistsPage;
