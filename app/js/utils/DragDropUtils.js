'use strict';

import ReactDOM        from 'react-dom';
import _               from 'lodash';

import PlaylistActions from '../actions/PlaylistActions';

const DragDropUtils = {

  calculateNewIndex(placement, hoverDropIndex) {
    let newIndex;

    if ( placement === 'above' ) {
      newIndex = (hoverDropIndex - 1) > -1 ? hoverDropIndex - 1 : 0;
    } else if ( placement === 'below' ) {
      newIndex = hoverDropIndex;
    }

    return newIndex;
  },

  processHoverOrDrop(props, monitor, component, aboveCb, belowCb) {
    const dragProps = monitor.getItem();
    const playlist = dragProps.playlist;
    const dragTrack = dragProps.track;
    const dragIndex = dragTrack.order || dragProps.index;
    const hoverDropTrack = props.track;
    const hoverDropIndex = hoverDropTrack.order || props.index;

    // Rectangle on screen
    const hoverDropBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
    // Vertical middle of rectangle on screen
    const hoverDropMiddleY = (hoverDropBoundingRect.bottom - hoverDropBoundingRect.top) / 2;
    // Mouse position
    const clientOffset = monitor.getClientOffset();
    // Pixels to top
    const hoverDropClientY = clientOffset.y - hoverDropBoundingRect.top;

    // If above target track midpoint
    if ( hoverDropClientY < hoverDropMiddleY && dragIndex !== hoverDropIndex - 1 ) {
      aboveCb('above', playlist, dragTrack, hoverDropTrack, dragIndex, hoverDropIndex);
      return;
    }

    // If below target track midpoint
    if ( hoverDropClientY > hoverDropMiddleY && dragIndex !== hoverDropIndex + 1 ) {
      belowCb('below', playlist, dragTrack, hoverDropTrack, dragIndex, hoverDropIndex);
      return;
    }
  },

  reorderTrack(placement, playlist, dragTrack, dropTrack, dragIndex, dropIndex) {
    const newIndex = DragDropUtils.calculateNewIndex(placement, dropIndex);
    let updates = [];

    if ( dragIndex !== newIndex ) {
      updates.push({
        track: dragTrack,
        newIndex: newIndex
      });

      updates = updates.concat(DragDropUtils.buildRemainingUpdates(placement, playlist, dragTrack, newIndex));

      console.log('updates:', updates);

      PlaylistActions.reorderTracks(playlist, updates);
    }
  },

  buildRemainingUpdates(placement, playlist, dragTrack, newIndex) {
    return _.chain(playlist.tracks)
    .reject((track) => {
      return track.id === dragTrack.id;
    })
    .map((track) => {
      let newSiblingIndex;

      if ( placement === 'above' && track.order >= newIndex ) {
        newSiblingIndex = track.order + 1;
      } else if ( placement === 'below' && track.order <= newIndex ) {
        newSiblingIndex = (track.order - 1) > -1 ? track.order - 1 : 0;
      }

      if ( newSiblingIndex !== undefined ) {
        return {
          track: track,
          newIndex: newSiblingIndex
        };
      }
    })
    .filter()
    .value();
  }

};

export default DragDropUtils;
