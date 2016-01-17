'use strict';

import React         from 'react';

import GlobalActions from '../actions/GlobalActions';
import EditGroupForm from '../components/EditGroupForm';

const EditGroupModalMixin = {

  openEditGroupModal(group) {
    GlobalActions.openModal('edit-group',
      <EditGroupForm group={group} />
    );
  }

};

export default EditGroupModalMixin;
