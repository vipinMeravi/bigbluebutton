import Screens from '/imports/api/screens';
import Logger from '/imports/startup/server/logger';
import { extractCredentials } from '/imports/api/common/server/helpers';
import { NULL } from 'node-sass';
// import { modes } from 'react-transition-group/SwitchTransition';

export default function updateScreen(screen_value, screen_for) {
  const { meetingId } = extractCredentials(this.userId);
  check(meetingId, String);
  check(screen_value, String);
  check(screen_for, String);

  const fullscreenSelector = {
    meetingId,
    screen_value: 'fullscreen'
  }
  const fullscreenModifier = {
    meetingId,
    screen_value: 'fullscreen',
    screen_for: ''
  }
  const initialFullscreenModifier = {
    meetingId,
    screen_value: 'fullscreen',
    screen_for: NULL
  }

  const screenOneSelector = {
    meetingId,
    screen_value: 'screen_one'
  }
  const screenOneModifier = {
    meetingId,
    screen_value: 'screen_one',
    screen_for: ''
  }
  const initialScreenOneModifier = {
    meetingId,
    screen_value: 'screen_one',
    screen_for: NULL
  }

  const screenTwoSelector = {
    meetingId,
    screen_value: 'screen_two'
  }
  const screenTwoModifier = {
    meetingId,
    screen_value: 'screen_two',
    screen_for: ''
  }
  const initialScreenTwoModifier = {
    meetingId,
    screen_value: 'screen_two',
    screen_for: NULL
  }

  console.log("================ update update screen ==============")
  console.log(meetingId, screen_value, screen_for);
  console.log("================ update update screen ==============")

  const cb = (err, numChanged) => {
    if (err) {
      return Logger.error(`Adding update Screen in collection: ${err}`);
    }
    console.log("============ callback update of screen insert ================")
    console.log(numChanged);
    console.log("============ callback of update screen insert ================")
    return Logger.info(`Upserted Screen Value=${screen_value} Screen For=${screen_for} meeting=${meetingId}`);
  };

  if (!Screens.findOne(fullscreenSelector)) {
    Screens.upsert(fullscreenSelector, initialFullscreenModifier, cb);
  }

  if (!Screens.findOne(screenOneSelector)) {
    Screens.upsert(fullscreenSelector, initialScreenOneModifier);
  }

  if (!Screens.findOne(screenTwoSelector)) {
    Screens.upsert(fullscreenSelector, initialScreenTwoModifier, cb);
  }

  var modifier = {};

  if (screen_value == 'fullscreen') {

    Screens.upsert(screenOneSelector, screenOneModifier, cb);
    Screens.upsert(screenTwoSelector, screenTwoModifier, cb);
    modifier = {
      meetingId,
      screen_value: 'fullscreen',
      screen_for: screen_for,

    }
    return Screens.upsert(fullscreenSelector, modifier, cb);
  }

  if (screen_value == 'screen_one') {
    let screen = Screens.findOne(fullscreenSelector);
    if (screen && screen.screen_for == screen_for) {
      return;
    } else {
      modifier = {
        meetingId,
        screen_value: 'screen_two',
        screen_for: screen.screen_for
      }
      Screens.upsert(screenTwoSelector, modifier, cb);

      modifier = {
        meetingId,
        screen_value,
        screen_for
      }
      Screens.upsert(screenOneSelector, modifier, cb);

      return Screens.upsert(fullscreenSelector, fullscreenModifier, cb);
    }
  }

  if (screen_value == 'screen_two') {
    let screen = Screens.findOne(fullscreenSelector);
    if (screen && screen.screen_for == screen_for) {
      return;
    }
    else {
      modifier = {
        meetingId,
        screen_value: 'screen_one',
        screen_for: screen.screen_for,
      }
      Screens.upsert(screenOneSelector, modifier, cb);

      modifier = {
        meetingId,
        screen_value: screen_value,
        screen_for: screen_for 
      }
      Screens.upsert(screenTwoSelector, modifier, cb);

      return Screens.upsert(fullscreenSelector, fullscreenModifier, cb);
    }
  }

  Meteor.publish('screen-values', () => {
    return Screens.find({ meetingId });
  });

}