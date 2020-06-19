import { Match, check } from 'meteor/check';
import PresentationPods from '/imports/api/presentation-pods-split';
import Logger from '/imports/startup/server/logger';
import addPresentation from '/imports/api/presentations-split/server/modifiers/addPresentation';

// 'presentations' is passed down here when we receive a Sync message
// and it's not used when we just create a new presentation pod
export default function addPresentationPod(meetingId, pod, presentations = undefined) {
  check(meetingId, String);
  check(presentations, Match.Maybe(Array));
  check(pod, {
    currentPresenterId: String,
    podSplitId: String,
  });

  const { currentPresenterId, podSplitId } = pod;

  const selector = {
    meetingId,
    podSplitId,
  };

  const modifier = {
    meetingId,
    podSplitId,
    currentPresenterId,
  };

  const cb = (err, numChanged) => {
    if (err) {
      return Logger.error(`Adding presentation pod to the collection: ${err}`);
    }

    // if it's a Sync message - continue adding the attached presentations
    if (presentations) {
      presentations.forEach(presentation => addPresentation(meetingId, podSplitId, presentation));
    }

    if (numChanged) {
      return Logger.info(`Added presentation pod id=${podSplitId} meeting=${meetingId}`);
    }

    return Logger.info(`Upserted presentation pod id=${podSplitId} meeting=${meetingId}`);
  };

  return PresentationPods.upsert(selector, modifier, cb);
}
