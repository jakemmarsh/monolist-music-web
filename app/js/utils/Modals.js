'use strict';

import React               from 'react';
import _                   from 'lodash';

import GlobalActions       from '../actions/GlobalActions';
import UserSearchForm      from '../components/UserSearchForm';
import AddTrackFromUrlForm from '../components/AddTrackFromUrlForm';
import EditGroupForm       from '../components/EditGroupForm';
import EditPlaylistForm    from '../components/EditPlaylistForm';
import ConfirmationModal   from '../components/ConfirmationModal';
import LoginForm           from '../components/LoginForm';
import ShareModal          from '../components/ShareModal';
import FlashWarningModal   from '../components/FlashWarningModal';

const Modals = {
  openUserSearch(initialResults, currentUser, selectUser, deselectUser, isUserSelected) {
    initialResults = _.reject(initialResults || [], user => {
      return user.id === currentUser.id;
    });

    GlobalActions.openModal('user-search',
      <UserSearchForm currentUser={currentUser}
                      selectUser={selectUser}
                      deselectUser={deselectUser}
                      isUserSelected={isUserSelected}
                      initialResults={initialResults} />
    );
  },

  openAddTrackByUrl(playlist, currentUser) {
    GlobalActions.openModal('add-track-from-url',
      <AddTrackFromUrlForm currentUser={currentUser} playlist={playlist} />
    );
  },

  openEditGroup(group) {
    GlobalActions.openModal('edit-group',
      <EditGroupForm group={group} />
    );
  },

  openEditPlaylist(playlist) {
    GlobalActions.openModal('edit-playlist',
      <EditPlaylistForm playlist={playlist} />
    );
  },

  openShare(playlist) {
    GlobalActions.openModal('share',
      <ShareModal playlist={playlist} />
    );
  },

  openConfirmation(prompt, cb) {
    GlobalActions.openModal('confirmation',
      <ConfirmationModal prompt={prompt} cb={cb} />
    );
  },

  openLogin() {
    GlobalActions.openModal('login',
      <LoginForm onLogin={GlobalActions.closeModal} />
    );
  },

  openFlashError() {
    GlobalActions.openModal('flash-warning error',
      <FlashWarningModal />
    );
  }

};

export default Modals;
