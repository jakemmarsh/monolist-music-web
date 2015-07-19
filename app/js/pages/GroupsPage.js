'use strict';

import React              from 'react/addons';
import _                  from 'lodash';
import {ListenerMixin}    from 'reflux';
import {Navigation, Link} from 'react-router';
import DocumentTitle      from 'react-document-title';

import APIUtils           from '../utils/APIUtils';
import GroupsStore        from '../stores/GroupsStore';
import GlobalActions      from '../actions/GlobalActions';
import GroupActions       from '../actions/GroupActions';
import GroupList          from '../components/GroupList';
import PageControlBar     from '../components/PageControlBar';
import SearchBar          from '../components/SearchBar';
import Spinner            from '../components/Spinner';

var GroupsPage = React.createClass({

  mixins: [Navigation, ListenerMixin, React.addons.LinkedStateMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      query: this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : '',
      groups: {
        user: [],
        popular: [],
        results: null
      },
      error: null,
      loading: true,
      searching: false
    };
  },

  _onGroupsChange(err, groups) {
    if ( err ) {
      this.setState({
        loading: false,
        searching: false,
        error: err.message
      });
    } else if ( groups ) {
      this.setState({
        loading: false,
        searching: false,
        error: null,
        groups: groups
      });
    }
  },

  componentDidMount() {
    this.listenTo(GroupsStore, this._onGroupsChange);
    GlobalActions.loadGroups();
    if ( this.state.query.length ) { this.doSearch(); }
  },

  componentDidUpdate(prevProps) {
    let haveNewQuery = prevProps.query.q !== this.props.query.q;

    if ( !_.isEmpty(this.props.currentUser) && !_.isEqual(this.props.currentUser, prevProps.currentUser) ) {
      GlobalActions.loadGroups();
    }

    if ( haveNewQuery ) {
      this.setState({
        query: this.props.query.q
      }, this.doSearch);
    }
  },

  reloadPage() {
    this.replaceWith('Groups', {}, { q: this.state.query });
  },

  handleKeyPress(evt) {
    let keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.reloadPage();
    }
  },

  doSearch() {
    this.setState({ searching: true }, GroupActions.search.bind(null, this.state.query));
  },

  renderSpinner() {
    if ( this.state.searching ) {
      return (
        <Spinner size={18} />
      );
    }
  },

  renderSearchResults() {
    let element = null;
    let didSearch = this.state.groups.results !== null;
    let hasResults = didSearch && this.state.groups.results.length > 0;

    console.log('did search:', didSearch);

    if ( didSearch && hasResults ) {
      element = (
        <div>
          <div className="title-container">
            <div className="icon-container">
              <i className="fa fa-search"></i>
            </div>
            <h5 className="title">Search Results</h5>
          </div>
          <GroupList groups={this.state.groups.results} className="nudge-half--bottom" />
        </div>
      );
    } else if ( didSearch ) {
      element = (
        <div>
          <div className="title-container">
            <div className="icon-container">
              <i className="fa fa-search"></i>
            </div>
            <h5 className="title">Search Results</h5>
          </div>
          <h3 className="flush--top light nudge-half--bottom">No groups match!</h3>
        </div>
      );
    }

    return element;
  },

  render() {
    return (
      <DocumentTitle title={APIUtils.buildPageTitle('Groups')}>
      <section className="content groups">

        <PageControlBar type="search" className="nudge-half--bottom">
          <div className="search-container">
            <SearchBar ref="SearchBar"
                       valueLink={this.linkState('query')}
                       onKeyPress={this.handleKeyPress}
                       placeholder="Search all tracks..." />
          </div>
          <div className="loading-container text-right">
            {this.renderSpinner()}
          </div>
        </PageControlBar>

        {this.renderSearchResults()}

        <div className="title-container">
          <div className="icon-container">
            <i className="fa fa-user"></i>
          </div>
          <h5 className="title">My Groups</h5>
        </div>

        <GroupList groups={this.state.groups.user} className="nudge-half--bottom" />

        <div className="title-container">
          <div className="icon-container">
            <i className="fa fa-line-chart"></i>
          </div>
          <h5 className="title">Popular Groups</h5>
        </div>

        <GroupList groups={this.state.groups.popular} />

      </section>
      </DocumentTitle>
    );
  }

});

export default GroupsPage;