import { Meteor } from 'meteor/meteor';
import { makeCall } from '/imports/ui/services/api';

let streamer = null;
const getStreamer = (meetingID) => {
  if (!streamer) {
    streamer = new Meteor.Streamer(`website-viewer-${meetingID}`);
    makeCall('initializeExternalVideo');
  }
  return streamer;
};

export { getStreamer };
