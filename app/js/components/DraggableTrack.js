'use strict';

import _                  from 'lodash';
import {
  DragSource,
  DropTarget
} from 'react-dnd';

import DragDropUtils      from '../utils/DragDropUtils';
import PermissionsHelpers from '../utils/PermissionsHelpers';
import Track              from './Track';

const TRACK_SOURCE = {
  beginDrag(props) {
    return {
      playlist: props.playlist,
      track: props.track,
      index: props.index
    };
  },
  canDrag(props) {
    const isSortedByOrder = props.sortAttribute === 'order';
    const isCollaborator = PermissionsHelpers.isUserPlaylistCollaborator(props.playlist, props.currentUser);

    console.log('isSortedByOrder:', isSortedByOrder);
    console.log('isCollaborator:', isCollaborator);

    return isSortedByOrder && isCollaborator;
  }
};

const TRACK_TARGET = {
  hover(props, monitor, component) {
    function highlightMoveAbove(placement, playlist, dragTrack, hoverTrack, dragIndex, hoverIndex) {
      component.setState({
        highlightTop: dragIndex !== DragDropUtils.calculateNewIndex(placement, hoverIndex),
        highlightBottom: false
      });
    }

    function highlightMoveBelow(placement, playlist, dragTrack, hoverTrack, dragIndex, hoverIndex) {
      component.setState({
        highlightTop: false,
        highlightBottom: dragIndex !== DragDropUtils.calculateNewIndex(placement, hoverIndex)
      });
    }

    DragDropUtils.processHoverOrDrop(props, monitor, component, highlightMoveAbove, highlightMoveBelow);
  },
  drop(props, monitor, component) {
    DragDropUtils.processHoverOrDrop(props, monitor, component, DragDropUtils.reorderTrack, DragDropUtils.reorderTrack);
  }
};

export default _.flow(
  DropTarget('track', TRACK_TARGET, (connect, monitor) => {
    return {
      connectDropTarget: connect.dropTarget(),
      isHoveredOver: monitor.isOver()
    };
  }),
  DragSource('track', TRACK_SOURCE, (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  })
)(Track);
