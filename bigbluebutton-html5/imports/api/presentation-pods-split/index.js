import { Meteor } from 'meteor/meteor';
import PresentationsPodSplit from '/imports/api/presentation-pods';

const PresentationPods = PresentationsPodSplit
// if (Meteor.isServer) {
//   // types of queries for the presentation pods:
//   // 1. meetingId, podId  ( 4 )

//   PresentationPods._ensureIndex({ meetingId: 1, podId: 1 });
// }

export default PresentationPods;
