'use strict';

import React          from 'react/addons';
import when           from 'when';

import CreatePostForm from '../../app/js/components/CreatePostForm';
import PostAPI        from '../../app/js/utils/PostAPI';
import PostActions    from '../../app/js/actions/PostActions';

const  TestUtils      = React.addons.TestUtils;

describe('Component: CreatePostForm', function() {

  it('#buildTrack should retrieve details from API and update state', function(done) {
    const form = TestUtils.renderIntoDocument(
      <CreatePostForm />
    );
    const source = 'youtube';
    const url = 'https://www.youtube.com/watch?v=cTGQrA5HHIU';

    sandbox.mock(PostAPI).expects('getTrackDetails').once().withArgs(source, url).returns(when({ id: 1 }));
    form.state.track.should.eql({ id: 1 });

    done();
  });

  it('#checkUrls should check any detected URLs for song URLs and call buildTrack', function(done) {
    const form = TestUtils.renderIntoDocument(
      <CreatePostForm />
    );
    const urls = ['https://www.youtube.com/watch?v=cTGQrA5HHIU'];

    sandbox.mock(form).expects('buildTrack').once().withArgs('youtube', urls[0]);
    form.checkUrls(urls);

    done();
  });

  it('#checkUrls should call clearTrack if no song URLs detected', function(done) {
    const form = TestUtils.renderIntoDocument(
      <CreatePostForm />
    );
    const urls = ['http://www.google.com'];

    sandbox.mock(form).expects('clearTrack').once();
    form.checkUrls(urls);

    done();
  });

  it('#clearTrack should clear state.track', function(done) {
    const form = TestUtils.renderIntoDocument(
      <CreatePostForm />
    );

    form.setState({ track: { id: 1 }});
    form.state.track.should.eql({ id: 1 });
    form.clearTrack();
    form.state.track.should.eql({});

    done();
  });

  it('#handleChange should update state and call #checkUrls', function(done) {
    const form = TestUtils.renderIntoDocument(
      <CreatePostForm />
    );
    const textarea = React.findDOMNode(form.refs.textArea);

    sandbox.mock(form).expects('checkUrls');
    TestUtils.Simulate.change(textarea, { target: { value: 'test' } });
    form.state.body.should.equal('test');

    done();
  });

  it('#handleSubmit should show an error if a track is missing but required', function(done) {
    const form = TestUtils.renderIntoDocument(
      <CreatePostForm requiresTrack={true} />
    );

    done();
  });

  it('#handleSubmit should call the create action and reset state', function(done) {
    const form = TestUtils.renderIntoDocument(
      <CreatePostForm />
    );

    // TODO: part-matching to do .withArgs
    sandbox.mock(PostActions).expects('create').once();

    done();
  });

});