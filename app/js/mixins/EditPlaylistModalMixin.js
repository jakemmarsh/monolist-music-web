'use strict';

import React            from 'react';

import GlobalActions    from '../actions/GlobalActions';
import EditPlaylistForm from '../components/EditPlaylistForm';

const EditPlaylistModalMixin = {

  openEditPlaylistModal() {
    GlobalActions.openModal('edit-playlist',
      <EditPlaylistForm />
    );
  }

};

export default EditPlaylistModalMixin;
