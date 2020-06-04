import Meetings from '/imports/api/meetings';
import Users from '/imports/api/users';
import Auth from '/imports/ui/services/auth';
import Logger from '/imports/startup/client/logger';

import { getStreamer } from '/imports/api/external-videos';
import { makeCall } from '/imports/ui/services/api';

import ReactPlayer from 'react-player';

const isUrlValid = url => ReactPlayer.canPlay(url);

const startWatching = (url, isSite) => {
  const externalVideoUrl = url;
  makeCall('startWatchingExternalVideo', { externalVideoUrl, isSite });
};

const stopWatching = () => {
  makeCall('stopWatchingExternalVideo');
};

const sendMessage = (event, data) => {
  const meetingId = Auth.meetingID;
  const userId = Auth.userID;

  makeCall('emitExternalVideoEvent', event, { ...data, meetingId, userId });
};

const onMessage = (message, func) => {
  const streamer = getStreamer(Auth.meetingID);
  streamer.on(message, func);
};

const removeAllListeners = (eventType) => {
  const streamer = getStreamer(Auth.meetingID);
  streamer.removeAllListeners(eventType);
};

const getVideoUrl = () => {
  const meetingId = Auth.meetingID;
  const meeting = Meetings.findOne({ meetingId }, { fields: { externalVideoUrl: 1 } });

  return meeting && meeting.externalVideoUrl;
};

const getEventNameUrl = () => {
  const meetingId = Auth.meetingID;
  const meeting = Meetings.findOne({ meetingId }, { fields: { EVENT_NAME } });
  console.log("----------------getEventNameUrl------------------ ", meeting);
  return meeting && meeting.EVENT_NAME;
};

export {
  sendMessage,
  onMessage,
  removeAllListeners,
  getVideoUrl,
  isUrlValid,
  startWatching,
  stopWatching,
  getEventNameUrl
};
