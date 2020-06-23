import { Meteor } from 'meteor/meteor';
import insertScreen from './server/methods/insert-screen';

const Screens = new Mongo.Collection('screens')

if(Meteor.isServer){
  Screens._ensureIndex({
    meetingId: 1
  });

  if(!Screens.find().count()){
    insertScreen();
  }
}

export default Screens;