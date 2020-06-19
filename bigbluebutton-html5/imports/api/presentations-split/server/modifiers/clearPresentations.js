import Presentations from '/imports/api/presentations-split';
import Logger from '/imports/startup/server/logger';

export default function clearPresentations(meetingId, podSplitId) {
  // clearing presentations for 1 pod
  if (meetingId && podSplitId) {
    return Presentations.remove({ meetingId, podSplitId }, () => {
      Logger.info(`Cleared Presentations (${meetingId}, ${podSplitId})`);
    });
  }

  // clearing presentations for the whole meeting
  if (meetingId) {
    return Presentations.remove({ meetingId }, () => {
      Logger.info(`Cleared Split Presentations (${meetingId})`);
    });
  }

  // clearing presentations for the whole server
  return Presentations.remove({}, () => {
    Logger.info('Cleared Split Presentations (all)');
  });
}
