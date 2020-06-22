import Screens from '/imports/api/screens';
import Logger from '/imports/startup/server/logger';
import { extractCredentials } from '/imports/api/common/server/helpers';

export default function removeScreen( screen_value, screen_for) {
  const { meetingId } = extractCredentials(this.userId);
  check(meetingId, String);
  check(screen_value, String);
  check(screen_for, String);

  const selector = {
    meetingId,
    screen_value,
  };

  const modifier = {
    meetingId,
    screen_value,
    screen_for: ""
  };

  const cb = (err, numChanged) => {
    if (err) {
      return Logger.error(`Adding Screen in collection: ${err}`);
    } 
    console.log("============ callback of screen insert ================")
    console.log(numChanged);
    console.log("============ callback of screen insert ================")
    return Logger.info(`Upserted Screen Value=${screen_value} Screen For=${screen_for} meeting=${meetingId}`);
  };
  console.log("================ insert update screen ==============")
  console.log(meetingId,  screen_value  , screen_for );
  console.log("================ insert update screen ==============")
  Screens.upsert(selector, modifier, cb);
  return Screens.upsert(selector, modifier, cb);

  // return true;

}

