'use strict';

import React              from 'react';
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

    return isSortedByOrder && isCollaborator;
  }
};

const TRACK_TARGET = {
  hover(props, monitor, component) {
    function highlightMoveAbove(placement, playlist, dragTrack, hoverTrack, dragIndex, hoverIndex) {
      component.setState({
        highlightTop: dragIndex !== hoverIndex,
        highlightBottom: false
      });
    }

    function highlightMoveBelow(placement, playlist, dragTrack, hoverTrack, dragIndex, hoverIndex) {
      component.setState({
        highlightTop: false,
        highlightBottom: dragIndex !== hoverIndex
      });
    }

    DragDropUtils.processHoverOrDrop(props, monitor, component, highlightMoveAbove, highlightMoveBelow);
  },
  drop(props, monitor, component) {
    DragDropUtils.processHoverOrDrop(props, monitor, component, DragDropUtils.reorderTrack, DragDropUtils.reorderTrack);
  }
};

const DraggableTrack = React.createClass({
  propTypes: {
    track: React.PropTypes.object.isRequired,
    isActive: React.PropTypes.bool,
    isHoveredOver: React.PropTypes.bool,
    connectDragSource: React.PropTypes.func.isRequired,
    connectDropTarget: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      highlightTop: false,
      highlightBottom: false
    };
  },

  componentWillReceiveProps(nextProps) {
    const isHoveredOver = nextProps.isHoveredOver;

    this.setState({
      highlightTop: isHoveredOver ? this.state.highlightTop : false,
      highlightBottom: isHoveredOver ? this.state.highlightBottom : false
    });
  },

  shouldComponentUpdate(nextProps) {
    const nextTrack = nextProps.track;
    const currentTrack = this.props.track;
    const hasNewHoverStatus = nextProps.isHoveredOver !== this.props.isHoveredOver;
    const hasNewActiveStatus = nextProps.isActive !== this.props.isActive;
    const hasNewTrack = nextTrack.source !== currentTrack.source || nextTrack.sourceParam !== currentTrack.sourceParam;

    return hasNewHoverStatus || hasNewActiveStatus || hasNewTrack;
  },

  render() {
    const connectDragSource = this.props.connectDragSource;
    const connectDropTarget = this.props.connectDropTarget;

    return connectDragSource(connectDropTarget(
      <div>
        <Track {...this.props} {...this.state} />
      </div>
    ));
  }
});

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
)(DraggableTrack);
