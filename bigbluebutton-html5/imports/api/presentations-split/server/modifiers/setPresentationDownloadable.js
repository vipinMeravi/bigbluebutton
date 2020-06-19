import { check } from 'meteor/check';
import Presentations from '/imports/api/presentations-split';
import Logger from '/imports/startup/server/logger';

export default function setPresentationDownloadable(meetingId, podSplitId,
  presentationId, downloadable) {
  check(meetingId, String);
  check(presentationId, String);
  check(podSplitId, String);
  check(downloadable, Boolean);

  const selector = {
    meetingId,
    podSplitId,
    id: presentationId,
  };

  const modifier = {
    $set: {
      downloadable,
    },
  };

  const cb = (err, numChanged) => {
    if (err) {
      Logger.error(`Could not set downloadable Split on pres {${presentationId} in meeting {${meetingId}} ${err}`);
      return;
    }

    if (numChanged) {
      Logger.info(`Set downloadable status on presentation Split {${presentationId} in meeting {${meetingId}}`);
    }
  };

  return Presentations.upsert(selector, modifier, cb);
}
