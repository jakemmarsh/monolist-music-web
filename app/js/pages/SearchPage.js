'use strict';

import React                from 'react/addons';
import {RouteHandler}       from 'react-router';
import DocumentTitle        from 'react-document-title';

import Helpers              from '../utils/Helpers';
import TabBar               from '../components/TabBar';
import ListLink             from '../components/ListLink';

var SearchPage = React.createClass({

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Search')}>
      <div>

        <section className="content search">
          <TabBar className="nudge-half--bottom">
            <ListLink to="TrackSearch" query={{ q: this.props.query.q }}>
              Tracks
            </ListLink>
            <ListLink to="PlaylistSearch" query={{ q: this.props.query.q }}>
              Playlists
            </ListLink>
            <ListLink to="GroupSearch" query={{ q: this.props.query.q }}>
              Groups
            </ListLink>
          </TabBar>

          <RouteHandler {...this.props} {...this.state} />
        </section>

      </div>
      </DocumentTitle>
    );
  }

});

export default SearchPage;