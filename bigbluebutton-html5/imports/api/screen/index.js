import { Meteor } from 'meteor/meteor';

const Captions = new Mongo.Collection('screen');

if (Meteor.isServer) {
  Captions._ensureIndex({ meetingId: 1, screenValue: 1, screenFor: 1, isActive: 1 });
}

export default Captions;
