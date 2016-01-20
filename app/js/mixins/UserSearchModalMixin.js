'use strict';

import React           from 'react';
import _               from 'lodash';

import GlobalActions   from '../actions/GlobalActions';
import UserSearchForm  from '../components/UserSearchForm';

const UserSearchModalMixin = {

  openUserSearchModal(initialResults) {
    initialResults = _.reject(initialResults || [], user => {
      return user.id === this.props.currentUser.id;
    });

    GlobalActions.openModal('user-search',
      <UserSearchForm currentUser={this.props.currentUser}
                      selectUser={this.selectUser}
                      deselectUser={this.deselectUser}
                      initialResults={initialResults} />
    );
  }

};

export default UserSearchModalMixin;
