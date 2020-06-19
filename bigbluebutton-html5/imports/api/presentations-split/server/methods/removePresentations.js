import RedisPubSub from '/imports/startup/server/redis';
import { check } from 'meteor/check';
import { extractCredentials } from '/imports/api/common/server/helpers';

export default function removePresentations(presentationId, podSplitId) {
  const REDIS_CONFIG = Meteor.settings.private.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'RemovePresentationPubMsg';

  const { meetingId, requesterUserId } = extractCredentials(this.userId);

  check(presentationId, String);
  check(podSplitId, String);

  const payload = {
    presentationId,
    podSplitId,
  };

  return RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);
}
