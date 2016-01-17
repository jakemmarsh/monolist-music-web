'use strict';

import React            from 'react';

import GlobalActions    from '../actions/GlobalActions';
import EditPlaylistForm from '../components/EditPlaylistForm';

const EditPlaylistModalMixin = {

  openEditPlaylistModal(playlist) {
    GlobalActions.openModal('edit-playlist',
      <EditPlaylistForm playlist={playlist} />
    );
  }

};

export default EditPlaylistModalMixin;
