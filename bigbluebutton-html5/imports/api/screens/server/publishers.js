import Screens from '/imports/api/screens';
import { Meteor } from 'meteor/meteor';
import Logger from '/imports/startup/server/logger';
import { extractCredentials } from '/imports/api/common/server/helpers';

function screenValues() {
  if (!this.userId) {
    return Screens.find({ meetingId: '' });
  }
  const { meetingId } = extractCredentials(this.userId);

  Logger.debug(`Publishing Screen Values for ${meetingId}`);

  return Screens.find({ meetingId });
}

function publish(...args) {
  const screen_values = screenValues.bind(this);
  return screen_values(...args);
}

Meteor.publish('screen-values', publish);
