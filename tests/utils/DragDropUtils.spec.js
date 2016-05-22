'use strict';

import ReactDOM        from 'react-dom';

import testHelpers     from '../../utils/testHelpers';
import copyObject      from '../../utils/copyObject';
import PlaylistActions from '../../app/js/actions/PlaylistActions';
import DragDropUtils   from '../../app/js/utils/DragDropUtils';

describe('Util: DragDropUtils', function() {

  const TRACK = copyObject(testHelpers.fixtures.track);
  const PLAYLIST = copyObject(testHelpers.fixtures.playlist);

  describe('#processHoverOrDrop', function() {
    let dragProps; // eslint-disable-line
    let playlist;
    let dragTrack;
    let dragIndex;
    let props;
    let hoverDropTrack;
    let hoverDropTrackTop;
    let hoverDropTrackBottom;
    let hoverDropIndex;
    let monitor;
    let component;
    let hoverDropBoundingRect; // eslint-disable-line
    let clientOffset;
    let clientOffsetY;
    let aboveCb;
    let belowCb;

    function setupElements() {
      dragProps = {
        playlist: playlist,
        track: dragTrack
      };

      monitor = {
        getItem() {
          return dragProps;
        },
        getClientOffset() {
          return clientOffset;
        }
      };

      component = {};

      hoverDropBoundingRect = {
        top: hoverDropTrackTop,
        bottom: hoverDropTrackBottom
      };

      clientOffset = {
        y: clientOffsetY
      };

      props = {
        track: hoverDropTrack
      };

      dragIndex = dragTrack.order;
      hoverDropIndex = hoverDropTrack.order;

      sandbox.stub(ReactDOM, 'findDOMNode').returns({
        getBoundingClientRect: () => hoverDropBoundingRect
      });
    }

    beforeEach(function() {
      playlist = copyObject(PLAYLIST);
      dragTrack = copyObject(TRACK);
      hoverDropTrack = copyObject(TRACK);

      aboveCb = sandbox.stub();
      belowCb = sandbox.stub();
    });

    context('when mouse is above the middle of the drop target', function() {
      beforeEach(function() {
        clientOffsetY = 5;
        hoverDropTrackTop = 2;
        hoverDropTrackBottom = 12;
        hoverDropTrackTop = 2;
      });

      context('when dragIndex !== hoverDropIndex - 1', function() {
        beforeEach(function() {
          dragTrack.order = 7;
          hoverDropTrack.order = 5;

          setupElements();
        });

        it('should invoke the above callback', function() {
          DragDropUtils.processHoverOrDrop(props, monitor, component, aboveCb, belowCb);

          sinon.assert.calledOnce(aboveCb);
          sinon.assert.calledWith(aboveCb, 'above', playlist, dragTrack, hoverDropTrack, dragIndex, hoverDropIndex);
        });
      });

      context('when dragIndex === hoverDropIndex - 1', function() {
        beforeEach(function() {
          dragTrack.order = 3;
          hoverDropTrack.order = 4;

          setupElements();
        });

        it('should not invoke any callbacks', function() {
          DragDropUtils.processHoverOrDrop(props, monitor, component, aboveCb, belowCb);

          sinon.assert.notCalled(aboveCb);
          sinon.assert.notCalled(belowCb);
        });
      });
    });

    context('when mouse is below the middle of the drop target', function() {
      beforeEach(function() {
        clientOffsetY = 25;
        hoverDropTrackTop = 5;
        hoverDropTrackBottom = 12;
      });

      context('when dragIndex !== hoverDropIndex + 1', function() {
        beforeEach(function() {
          dragTrack.order = 4;
          hoverDropTrack.order = 2;

          setupElements();
        });

        it('should invoke the below callback', function() {
          DragDropUtils.processHoverOrDrop(props, monitor, component, aboveCb, belowCb);

          sinon.assert.notCalled(aboveCb);
          sinon.assert.calledOnce(belowCb);
          sinon.assert.calledWith(belowCb, 'below', playlist, dragTrack, hoverDropTrack, dragIndex, hoverDropIndex);
        });
      });

      context('when dragIndex === hoverDropIndex + 1', function() {
        beforeEach(function() {
          dragTrack.order = 4;
          hoverDropTrack.order = 3;

          setupElements();
        });

        it('should not invoke any callbacks', function() {
          DragDropUtils.processHoverOrDrop(props, monitor, component, aboveCb, belowCb);

          sinon.assert.notCalled(aboveCb);
          sinon.assert.notCalled(belowCb);
        });
      });
    });

    context('when mouse is at middle of the drop target', function() {
      beforeEach(function() {
        clientOffsetY = 10;
        hoverDropTrackTop = 5;
        hoverDropTrackBottom = 15;

        dragTrack.order = 4;
        hoverDropTrack.order = 2;

        setupElements();
      });

      it('should not invoke any callbacks', function() {
        DragDropUtils.processHoverOrDrop(props, monitor, component, aboveCb, belowCb);

        sinon.assert.notCalled(aboveCb);
        sinon.assert.notCalled(belowCb);
      });
    });
  });

  describe('#reorderTrack', function() {
    let placement;
    let playlist;
    let dragTrack;
    let dropTrack;
    let dragIndex;
    let dropIndex;

    beforeEach(function() {
      playlist = copyObject(PLAYLIST);
      dragTrack = copyObject(TRACK);
      dropTrack = copyObject(TRACK);
      dropTrack.id += 1;

      dragIndex = 5;
      dropIndex = 7;

      sandbox.stub(PlaylistActions, 'reorderTracks');
      sandbox.stub(DragDropUtils, 'buildRemainingUpdates').returns([]);
    });

    context('when dragIndex === dropIndex', function() {
      beforeEach(function() {
        dropIndex = dragIndex;
      });

      it('should do nothing', function() {
        DragDropUtils.reorderTrack(placement, playlist, dragTrack, dropTrack, dragIndex, dropIndex);

        sinon.assert.notCalled(DragDropUtils.buildRemainingUpdates);
        sinon.assert.notCalled(PlaylistActions.reorderTracks);
      });
    });

    context('when dragIndex !== newIndex', function() {
      beforeEach(function() {
        dropIndex = dragIndex + 1;
      });

      it('should call PlaylistActions.reorderTracks with playlist and correct updates', function() {
        const updates = [
          {
            track: dragTrack,
            newIndex: dropIndex
          }
        ];

        DragDropUtils.reorderTrack(placement, playlist, dragTrack, dropTrack, dragIndex, dropIndex);

        sinon.assert.calledOnce(PlaylistActions.reorderTracks);
        sinon.assert.calledWith(PlaylistActions.reorderTracks, playlist, updates);
      });
    });
  });

  describe('#buildRemainingUpdates', function() {
    let placement;
    let playlist;
    let dragTrack;
    let dragIndex;
    let dropIndex;

    beforeEach(function() {
      dragTrack = copyObject(TRACK);

      playlist = {};
      playlist.tracks = [
        {
          id: dragTrack.id,
          order: 1
        },
        {
          id: 10,
          order: 3
        },
        {
          id: 11,
          order: 2
        },
        {
          id: 12,
          order: 9
        },
        {
          id: 13,
          order: 7
        },
        {
          id: 14,
          order: 0
        },
        {
          id: 15,
          order: 8
        },
        {
          id: 16,
          order: 6
        },
        {
          id: 17,
          order: 4
        },
        {
          id: 18,
          order: 5
        }
      ];
    });

    context('when placement is above', function() {
      beforeEach(function() {
        dragIndex = 9;
        dropIndex = 6;
        placement = 'above';
      });

      it('should return updates for all the tracks from (and including) the dropIndex to the dragIndex', function() {
        const builtUpdates = DragDropUtils.buildRemainingUpdates(placement, playlist, dragTrack, dragIndex, dropIndex);

        assert.deepEqual(builtUpdates, [
          {
            newIndex: 8,
            track: {
              id: 13,
              order: 7
            }
          },
          {
            newIndex: 9,
            track: {
              id: 15,
              order: 8
            }
          },
          {
            newIndex: 7,
            track: {
              id: 16,
              order: 6
            }
          }
        ]);
      });
    });

    context('when placement is below', function() {
      beforeEach(function() {
        placement = 'below';
        dragIndex = 2;
        dropIndex = 6;
      });

      it('should return updates for all the tracks from the dragIndex to (and including) the dropIndex', function() {
        const builtUpdates = DragDropUtils.buildRemainingUpdates(placement, playlist, dragTrack, dragIndex, dropIndex);

        assert.deepEqual(builtUpdates, [
          {
            newIndex: 2,
            track: {
              id: 10,
              order: 3
            }
          },
          {
            newIndex: 5,
            track: {
              id: 16,
              order: 6
            }
          },
          {
            newIndex: 3,
            track: {
              id: 17,
              order: 4
            }
          },
          {
            newIndex: 4,
            track: {
              id: 18,
              order: 5
            }
          }
        ]);
      });
    });
  });

});
