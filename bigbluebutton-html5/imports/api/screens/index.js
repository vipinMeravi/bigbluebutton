import { Meteor } from 'meteor/meteor';
import { extractCredentials } from '/imports/api/common/server/helpers';
const Screens = new Mongo.Collection('screens')

if(Meteor.isServer){
  Screens._ensureIndex({
    meetingId: 1
  });
  const { meetingId } = extractCredentials(this.userId);
  
  const fullscreenSelector = {
    meetingId,
    screen_value: 'fullscreen'
  }

  const initialFullscreenModifier = {
    meetingId,
    screen_value: 'fullscreen',
    screen_for: 'document'
  }
  

  if (!Screens.find().count()) {
    console.log("---------------- First Insertion of screen ----------------")
    Screens.upsert(fullscreenSelector, initialFullscreenModifier);
  }
}

export default Screens;