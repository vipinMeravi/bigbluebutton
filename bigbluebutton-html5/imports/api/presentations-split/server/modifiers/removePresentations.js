import { check } from 'meteor/check';
import Presentations from '/imports/api/presentations-split';
import Logger from '/imports/startup/server/logger';

import clearSlidesPresentation from '/imports/api/slides-split/server/modifiers/clearSlidesPresentation';

export default function removePresentations(meetingId, podSplitId, presentationId) {
  check(meetingId, String);
  check(presentationId, String);
  check(podSplitId, String);

  const selector = {
    meetingId,
    podSplitId,
    id: presentationId,
  };

  const cb = (err, numChanged) => {
    if (err) {
      Logger.error(`Removing presentation from collection: ${err}`);
      return;
    }

    if (numChanged) {
      clearSlidesPresentation(meetingId, presentationId);
      Logger.info(`Removed presentation id=${presentationId} meeting=${meetingId}`);
    }
  };

  return Presentations.remove(selector, cb);
}
