import { Meteor } from 'meteor/meteor';
import Presentations from '/imports/api/presentations-split';
import Logger from '/imports/startup/server/logger';
import { extractCredentials } from '/imports/api/common/server/helpers';

function presentations() {
  if (!this.userId) {
    return Presentations.find({ meetingId: '' });
  }
  const { meetingId, requesterUserId } = extractCredentials(this.userId);

  Logger.debug(`Publishing Presentations Split for ${meetingId} ${requesterUserId}`);

  return Presentations.find({ meetingId });
}

function publish(...args) {
  const boundPresentations = presentations.bind(this);
  return boundPresentations(...args);
}

Meteor.publish('presentations-split', publish);
