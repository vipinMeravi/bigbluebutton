import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Logger from '/imports/startup/server/logger';
import Meetings from '/imports/api/meetings';
import RedisPubSub from '/imports/startup/server/redis';
import { extractCredentials } from '/imports/api/common/server/helpers';

export default function startWatchingExternalVideo(options) {
  const REDIS_CONFIG = Meteor.settings.private.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'StartExternalVideoMsg';
  // var EVENT_NAME = ''

  const { meetingId, requesterUserId } = extractCredentials(this.userId);
  const { externalWebsiteUrl, isSite } = options;

  console.log("Server External Website-------------------------------------")
  console.log(options)
  console.log("Server External Website-------------------------------------")
  
  // if(isSite){
  //   EVENT_NAME = 'StartExternalSiteMsg';
  // } else {
  // const EVENT_NAME = 'StartExternalVideoMsg';
  // }

  check(externalWebsiteUrl, String);

  Meetings.update({ meetingId }, { $set: { externalWebsiteUrl } });

  const payload = { externalWebsiteUrl };

  Logger.info(`User id=${requesterUserId} sharing an external Website: ${externalWebsiteUrl} for meeting ${meetingId}`);

  return RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);
}
