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

  const prev_fullscreen = Screens.findOne(fullscreenSelector);
  const prev_screen_one = Screens.findOne(screenOneSelector);
  const prev_screen_two = Screens.findOne(screenTwoSelector)

  console.log("================ update update prev_fullscreen ==============")
  console.log(meetingId, screen_value, screen_for);
  console.log("================ update update prev_fullscreen ==============")

  const cb = (err, numChanged) => {
    if (err) {
      return Logger.error(`Adding update Screen in collection: ${err}`);
    }
    console.log("============ callback update of prev_fullscreen insert ================")
    console.log(numChanged);
    console.log("============ callback of update prev_fullscreen insert ================")
    return Logger.info(`Upserted Screen Value=${screen_value} Screen For=${screen_for} meeting=${meetingId}`);
  };

  if (!prev_fullscreen) {
    Screens.upsert(fullscreenSelector, initialFullscreenModifier, cb);
  }

  if (!prev_screen_one) {
    Screens.upsert(fullscreenSelector, initialScreenOneModifier);
  }

  if (!prev_screen_two) {
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
    let prev_fullscreen = prev_fullscreen;
    let prev_screen_one = prev_screen_one;

    if (prev_fullscreen && prev_fullscreen.screen_for == screen_for) {
      return;
    } else if (prev_fullscreen.screen_for == "") {
      modifier = {
        meetingId,
        screen_value,
        screen_for
      }
      Screens.upsert(screenOneSelector, modifier, cb);

      modifier = {
        meetingId,
        screen_value: 'screen_two',
        screen_for: prev_screen_one.screen_for
      }
      return Screens.upsert(screenTwoSelector, modifier, cb);
    } else {
      modifier = {
        meetingId,
        screen_value: 'screen_two',
        screen_for: prev_fullscreen.screen_for
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
    let prev_fullscreen = prev_fullscreen;
    let prev_screen_two = prev_screen_two;

    if (prev_fullscreen && prev_fullscreen.screen_for == screen_for) {
      return;
    } else if (prev_fullscreen.screen_for == "") {
      modifier = {
        meetingId,
        screen_value,
        screen_for
      }
      Screens.upsert(screenTwoSelector, modifier, cb);

      modifier = {
        meetingId,
        screen_value: 'screen_two',
        screen_for: prev_screen_two.screen_for
      }
      return Screens.upsert(screenOneSelector, modifier, cb);
    }
    else {
      modifier = {
        meetingId,
        screen_value: 'screen_one',
        screen_for: prev_fullscreen.screen_for,
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

  Meteor.publish('prev_fullscreen-values', () => {
    return Screens.find({ meetingId });
  });

}