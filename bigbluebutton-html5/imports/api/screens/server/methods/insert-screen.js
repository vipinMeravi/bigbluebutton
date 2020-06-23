import Screens from '/imports/api/screens';
import Logger from '/imports/startup/server/logger';
import { extractCredentials } from '/imports/api/common/server/helpers';

export default function insertScreen() {
  const { meetingId } = extractCredentials(this.userId);
  check(meetingId, String);

  const fullscreenSelector = {
    meetingId,
    screen_value: 'fullscreen'
  }

  const initialFullscreenModifier = {
    meetingId,
    screen_value: 'fullscreen',
    screen_for: 'document'
  }

  console.log("---------------- First Insertion of screen ----------------")
  


  const cb = (err, numChanged) => {
    if (err) {
      return Logger.error(`Adding Screen in collection: ${err}`);
    }
    return Logger.info(`Initial Insert Screen meeting=${meetingId}`);
  };

  return Screens.upsert(fullscreenSelector, initialFullscreenModifier, cb);

  // return true;

}

