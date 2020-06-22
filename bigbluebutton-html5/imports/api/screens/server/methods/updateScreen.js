import Screens from '/imports/api/screens';
import Logger from '/imports/startup/server/logger';
import { extractCredentials } from '/imports/api/common/server/helpers';
import { NULL } from 'node-sass';
// import { modes } from 'react-transition-group/SwitchTransition';

export default async function updateScreen(screen_value, screen_for) {
  const { meetingId } = extractCredentials(this.userId);
  check(meetingId, String);
  check(screen_value, String);
  check(screen_for, String);

  const fullscreenSelector = {
    meetingId,
    screen_value: 'fullscreen'
  }
  const fullscreenModifier = {
    $set: { screen_for: NULL }
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
    $set: { screen_for: NULL }
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
    $set: { screen_for: NULL }
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

  if (!await Screens.findOne(fullscreenSelector)) {
    Screens.upsert(fullscreenSelector, initialFullscreenModifier, cb);
  }

  if (!await Screens.findOne(screenOneSelector)) {
    Screens.upsert(fullscreenSelector, initialScreenOneModifier);
  }

  if (!await Screens.findOne(screenTwoSelector)) {
    Screens.upsert(fullscreenSelector, initialScreenTwoModifier, cb);
  }

  var modifier = {};

  if (screen_value == 'fullscreen') {

    await Screens.upsert(screenOneSelector, screenOneModifier, cb);
    await Screens.upsert(screenTwoSelector, screenTwoModifier, cb);
    modifier = {
      meetingId,
      screen_value: 'fullscreen',
      screen_for: screen_for,

    }
    return await Screens.upsert(fullscreenSelector, modifier, cb);
  }

  if (screen_value == 'screen_one') {
    let screen = await Screens.findOne(fullscreenSelector);
    if (screen && screen.screen_for == screen_for) {
      return;
    }
    else {
      modifier = {
        meetingId,
        screen_value: 'screen_two',
        screen_for: screen.screen_for
      }
      await Screens.upsert(screenTwoModifier, modifier, cb);

      modifier = {
        meetingId,
        screen_value,
        screen_for
      }
      await Screens.upsert(screenOneSelector, modifier, cb);

      return await Screens.upsert(fullscreenSelector, fullscreenModifier, cb);
    }
  }

  if (screen_value == 'screen_two') {
    let screen = await Screens.findOne(fullscreenSelector);
    if (screen && screen.screen_for == screen_for) {
      return;
    }
    else {
      modifier = {
        meetingId,
        screen_value: 'screen_one',
        screen_for: screen.screen_for,
      }
      await Screens.upsert(screenOneSelector, modifier, cb);

      modifier = {
        meetingId,
        screen_value,
        screen_for
      }
      await Screens.upsert(screenTwoModifier, modifier, cb);

      return await Screens.upsert(fullscreenSelector, fullscreenModifier, cb);
    }
  }

  Meteor.publish('screen-values', () => {
    return Screens.find({ meetingId });
  });

}