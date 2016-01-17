'use strict';

import React         from 'react';

import GlobalActions from '../actions/GlobalActions';
import EditGroupForm from '../components/EditGroupForm';

const EditGroupModalMixin = {

  openEditGroupModal() {
    GlobalActions.openModal('edit-group',
      <EditGroupForm />
    );
  }

};

export default EditGroupModalMixin;
