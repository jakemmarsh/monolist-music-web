'use strict';

import React                 from 'react/addons';
import {RouteHandler, State} from 'react-router';
import DocumentTitle         from 'react-document-title';

import Helpers               from '../utils/Helpers';
import PageControlBar        from '../components/PageControlBar';
import SearchBar             from '../components/SearchBar';
import TabBar                from '../components/TabBar';
import ListLink              from '../components/ListLink';

var SearchPage = React.createClass({

  mixins: [State, React.addons.LinkedStateMixin],

  getInitialState() {
    return {
      query: this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : ''
    };
  },

  handleKeyPress(evt) {
    let keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.reloadPage();
    }
  },

  reloadPage(params = {}, query = {}) {
    _.assign(query, {
      q: this.state.query
    });

    if ( this.state.query ) {
      this.replaceWith(this.getPathName(), params, query);
    }
  },

  renderSpinner() {
    if ( this.state.loading ) {
      return (
        <Spinner size={18} />
      );
    }
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Search')}>
      <section className="content search">

        <PageControlBar type="search">
          <div className="search-container">
            <SearchBar ref="SearchBar"
                       valueLink={this.linkState('query')}
                       onKeyPress={this.handleKeyPress}
                       placeholder="Search..." />
          </div>
          <div className="loading-container">
            {this.renderSpinner()}
          </div>
          <div className="options-container" />
        </PageControlBar>

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

        <RouteHandler {...this.props}
                      {...this.state}
                      reloadPage={this.reloadPage} />

      </section>
      </DocumentTitle>
    );
  }

});

export default SearchPage;