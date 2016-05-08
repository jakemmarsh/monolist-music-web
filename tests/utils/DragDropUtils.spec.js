'use strict';

import ReactDOM        from 'react-dom';

import testHelpers     from '../../utils/testHelpers';
import copyObject      from '../../utils/copyObject';
import PlaylistActions from '../../app/js/actions/PlaylistActions';
import DragDropUtils   from '../../app/js/utils/DragDropUtils';

describe('Util: DragDropUtils', function() {

  const TRACK = copyObject(testHelpers.fixtures.track);
  const PLAYLIST = copyObject(testHelpers.fixtures.playlist);

  describe('#calculateNewIndex', function() {
    let placement;
    let hoverDropIndex;

    context('when placement is above', function() {
      beforeEach(function() {
        placement = 'above';
      });

      context('when hoverDropIndex - 1 would be below zero', function() {
        beforeEach(function() {
          hoverDropIndex = 0;
        });

        it('should return 0', function() {
          assert.strictEqual(DragDropUtils.calculateNewIndex(placement, hoverDropIndex), 0);
        });
      });

      context('when hoverDropIndex - 1 would not be below zero', function() {
        beforeEach(function() {
          hoverDropIndex = 5;
        });

        it('should return hoverDropIndex - 1', function() {
          assert.strictEqual(DragDropUtils.calculateNewIndex(placement, hoverDropIndex), 4);
        });
      });
    });

    context('when placement is below', function() {
      beforeEach(function() {
        placement = 'below';
        hoverDropIndex = 7;
      });

      it('should return hoverDropIndex', function() {
        assert.strictEqual(DragDropUtils.calculateNewIndex(placement, hoverDropIndex), hoverDropIndex);
      });
    });
  });

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

      sandbox.stub(PlaylistActions, 'reorderTracks');
      sandbox.stub(DragDropUtils, 'buildRemainingUpdates').returns([]);
    });

    context('when dragIndex === newIndex', function() {
      beforeEach(function() {
        sandbox.stub(DragDropUtils, 'calculateNewIndex').returns(dragIndex);
      });

      it('should do nothing', function() {
        DragDropUtils.reorderTrack(placement, playlist, dragTrack, dropTrack, dragIndex, dropIndex);

        sinon.assert.notCalled(DragDropUtils.buildRemainingUpdates);
        sinon.assert.notCalled(PlaylistActions.reorderTracks);
      });
    });

    context('when dragIndex !== newIndex', function() {
      beforeEach(function() {
        sandbox.stub(DragDropUtils, 'calculateNewIndex').returns(dragIndex + 1);
      });

      it('should call PlaylistActions.reorderTracks with playlist and correct updates', function() {
        const updates = [
          {
            track: dragTrack,
            newIndex: dragIndex + 1
          }
        ];

        DragDropUtils.reorderTrack(placement, playlist, dragTrack, dropTrack, dragIndex, dropIndex);

        sinon.assert.calledOnce(PlaylistActions.reorderTracks);
        sinon.assert.calledWith(PlaylistActions.reorderTracks, playlist, updates);
      });
    });
  });

  describe('#buildRemainingUpdates', function() {

  });

});
