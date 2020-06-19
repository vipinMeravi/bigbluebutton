import { check } from 'meteor/check';
import PresentationPods from '/imports/api/presentation-pods-split';
import Logger from '/imports/startup/server/logger';
import clearPresentations from '/imports/api/presentations-split/server/modifiers/clearPresentations';
import clearPresentationUploadToken from '/imports/api/presentation-upload-token/server/modifiers/clearPresentationUploadToken';

export default function removePresentationPod(meetingId, podSplitId) {
  check(meetingId, String);
  check(podSplitId, String);

  const selector = {
    meetingId,
    podSplitId,
  };

  const cb = (err) => {
    if (err) {
      Logger.error(`Removing presentation pod from collection: ${err}`);
      return;
    }

    if (podSplitId) {
      Logger.info(`Removed presentation pod id=${podSplitId} meeting=${meetingId}`);
      clearPresentations(meetingId, podSplitId);
      clearPresentationUploadToken(meetingId, podSplitId);
    }
  };

  return PresentationPods.remove(selector, cb);
}
