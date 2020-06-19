import { check } from 'meteor/check';
import PresentationPods from '/imports/api/presentation-pods-split';
import Logger from '/imports/startup/server/logger';

export default function setPresenterInPod(meetingId, podSplitId, nextPresenterId) {
  check(meetingId, String);
  check(podSplitId, String);
  check(nextPresenterId, String);

  const selector = {
    meetingId,
    podSplitId,
  };

  const modifier = {
    $set: {
      currentPresenterId: nextPresenterId,
    },
  };

  const cb = (err, numChanged) => {
    if (err) {
      Logger.error(`Setting a presenter in pod Split: ${err}`);
      return;
    }

    if (numChanged) {
      Logger.info(`Set a new presenter in pod Split id=${podSplitId} meeting=${meetingId}`);
    }
  };

  return PresentationPods.upsert(selector, modifier, cb);
}
