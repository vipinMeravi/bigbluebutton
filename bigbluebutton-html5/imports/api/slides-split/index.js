import { Meteor } from 'meteor/meteor';

const Slides = new Mongo.Collection('slides-split');
const SlidePositions = new Mongo.Collection('slide-positions-split');

if (Meteor.isServer) {
  // types of queries for the slides:

  // 1. meetingId                                  ( 1 )
  // 2. meetingId, podSplitId                           ( 1 )
  // 3. meetingId, presentationId                  ( 1 )
  // 3. meetingId, presentationId, num             ( 1 )
  // 4. meetingId, podSplitId, presentationId, id       ( 3 ) - incl. resizeSlide, which can be intense
  // 5. meetingId, podSplitId, presentationId, current  ( 1 )

  Slides._ensureIndex({
    meetingId: 1, podSplitId: 1, presentationId: 1, id: 1,
  });

  SlidePositions._ensureIndex({
    meetingId: 1, podSplitId: 1, presentationId: 1, id: 1,
  });
}

export { Slides, SlidePositions };
