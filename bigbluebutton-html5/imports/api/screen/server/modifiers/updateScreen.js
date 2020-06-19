import Screen from '/imports/api/screen';
import Logger from '/imports/startup/server/logger';
import { check } from 'meteor/check';

export default function updateOwnerId(meetingId, screenValue, screenFor, isActive) {
    check(meetingId, String);
    check(screenValue, String);
    check(screenFor, String);
    check(isActive, Boolean);

  const selector = {
    meetingId,
    screenValue,
  };

  const modifier = {
    $set: {
        screenValue: screenValue,
        screenFor: screenFor,
        isActive: isActive
    },
  };

  const cb = (err) => {
    if (err) {
      return Logger.error(`Updating screen : ${err}`);
    }
    return Logger.verbose(`Update screen meetingId=${meetingId}`);
  };

  return Screen.update(selector, modifier, cb);
}
