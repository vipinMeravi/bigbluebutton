import Screens from '/imports/api/screens';
import Logger from '/imports/startup/server/logger';
import { extractCredentials } from '/imports/api/common/server/helpers';
// import { modes } from 'react-transition-group/SwitchTransition';

export default function updateScreen( screen_value, screen_for) {
  const { meetingId } = extractCredentials(this.userId);
  check(meetingId, String);
  check(screen_value, String);
  check(screen_for, String);

  
  const selector = {
    meetingId,
    screen_value,
  };

  var modifier = {};
  let screen = Screens.findOne(selector);

  if(screen){
    modifier = {
      $set: { screen_for: screen_for },
    }
  } else {
    modifier = {
      meetingId,
      screen_value,
      screen_for
    }
  }

  const cb = (err, numChanged) => {
    if (err) {
      return Logger.error(`Adding update Screen in collection: ${err}`);
    } 
    console.log("============ callback update of screen insert ================")
    console.log(numChanged);
    console.log("============ callback of update screen insert ================")
    return Logger.info(`Upserted Screen Value=${screen_value} Screen For=${screen_for} meeting=${meetingId}`);
  };
  console.log("================ update update screen ==============")
  console.log(meetingId,  screen_value  , screen_for );
  console.log("================ update update screen ==============")

  return Screens.upsert(selector, modifier, cb);

  // return true;

}