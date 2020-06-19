import Screen from '/imports/api/screen';
import Logger from '/imports/startup/server/logger';

export default function removeScreen(meetingId) {
  if (meetingId) {
    return Screen.remove({ meetingId }, () => {
      Logger.info(`Cleared Screen (${meetingId})`);
    });
  }

  return Screen.remove({}, () => {
    Logger.info('Cleared Screen (all)');
  });
}
