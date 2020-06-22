import { Meteor } from 'meteor/meteor';

const Screens = new Mongo.Collection('screens')

if(Meteor.isServer){
  Screens._ensureIndex({
    meetingId: 1
  });
}

export default Screens;