'use strict';

import React               from 'react';

import GlobalActions       from '../actions/GlobalActions';
import AddTrackFromUrlForm from '../components/AddTrackFromUrlForm';

const AddTrackModalByUrlMixin = {

  openAddTrackByUrlModal(playlist) {
    GlobalActions.openModal('add-track-from-url',
      <AddTrackFromUrlForm currentUser={this.props.currentUser} playlist={playlist} />
    );
  }

};

export default AddTrackModalByUrlMixin;
