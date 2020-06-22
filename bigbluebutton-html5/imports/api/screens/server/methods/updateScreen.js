import Screens from '/imports/api/screens';
import Logger from '/imports/startup/server/logger';
import { extractCredentials } from '/imports/api/common/server/helpers';
import { NULL } from 'node-sass';
// import { modes } from 'react-transition-group/SwitchTransition';

export default function updateScreen( screen_value, screen_for) {
  const { meetingId } = extractCredentials(this.userId);
  check(meetingId, String);
  check(screen_value, String);
  check(screen_for, String);

  const fullscreenSelector = {
    meetingId,
    screen_value: 'fullscreen'
  }
  const fullscreenModifier = {
    $set : {screen_for: NULL}
  }

  const screenOneSelector = {
    meetingId,
    screen_value: 'screen_one'
  }
  const screenOneModifier = {
    $set : {screen_for: NULL}
  }
  
  const screenTwoSelector = {
    meetingId,
    screen_value: 'screen_two'
  }
  const screenTwoModifier = {
    $set : {screen_for: NULL}
  }

  const cb = (err, numChanged) => {
    if (err) {
      return Logger.error(`Adding update Screen in collection: ${err}`);
    } 
    console.log("============ callback update of screen insert ================")
    console.log(numChanged);
    console.log("============ callback of update screen insert ================")
    return Logger.info(`Upserted Screen Value=${screen_value} Screen For=${screen_for} meeting=${meetingId}`);
  };

  if(screen_value == 'fullscreen'){
    Screens.upsert(screenOneSelector, screenOneModifier, cb);
    Screens.upsert(screenTwoSelector, screenTwoModifier, cb);
    let modifier = {
      $set: {screen_for: screen_for}
    }
    return Screens.upsert(fullscreenSelector, modifier, cb);
  } 

  if(screen_value == 'screen_one'){
    let screen = Screens.findOne(fullscreenSelector);
    if(screen && screen.screen_for == screen_for){
      return;
    }
    else {
      let modifier = {
        $set: {screen_for: screen.screen_for}
      }
      Screens.upsert(screenTwoModifier, modifier, cb);

      modifier = {
        $set: {screen_for: screen_for}
      }
      Screens.upsert(screenOneSelector, modifier, cb);

      return Screens.upsert(fullscreenSelector, fullscreenModifier, cb);
    }
  }

  if(screen_value == 'screen_two'){
    let screen = Screens.findOne(fullscreenSelector);
    if(screen && screen.screen_for == screen_for){
      return;
    }
    else {
      let modifier = {
        $set: {screen_for: screen.screen_for}
      }
      Screens.upsert(screenOneSelector, modifier, cb);

      modifier = {
        meetingId,
        screen_value,
        screen_for
      }
      Screens.upsert(screenTwoModifier, modifier, cb);

      return Screens.upsert(fullscreenSelector, fullscreenModifier, cb);
    }
  }
  Meteor.publish('screen-values', ()=>{
    return Screens.find({ meetingId });
  });
  // const selector = {
  //   meetingId,
  //   screen_value,
  // };

  // var modifier = {};
  // let screen = Screens.findOne(selector);

  // if(screen){
  //   modifier = {
  //     $set: { screen_for: screen_for },
  //   }
  // } else {
  //   modifier = {
  //     meetingId,
  //     screen_value,
  //     screen_for
  //   }
  // }


  console.log("================ update update screen ==============")
  console.log(meetingId,  screen_value  , screen_for );
  console.log("================ update update screen ==============")

  // return Screens.upsert(selector, modifier, cb);

  // return true;

}