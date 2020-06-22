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
    $set : {screen_for: NULL}
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
    $set : {screen_for: NULL}
  }
  const initialScreenTwoModifier = {
    meetingId,
    screen_value: 'screen_two',
    screen_for: NULL
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

  if(!Screens.findOne(fullscreenSelector)){
    Screens.upsert(fullscreenSelector, initialFullscreenModifier, cb);
  }

  if(!Screens.findOne(screenOneSelector)){
    Screens.upsert(fullscreenSelector, initialScreenOneModifier);
  }

  if(!Screens.findOne(screenTwoSelector)){
    Screens.upsert(fullscreenSelector, initialScreenTwoModifier, cb);
  }


  if(screen_value == 'fullscreen'){
    if(screen){}
    Screens.update(screenOneSelector, screenOneModifier, cb);
    Screens.update(screenTwoSelector, screenTwoModifier, cb);
    let modifier = {
      $set: {screen_for: screen_for}
    }
    return Screens.update(fullscreenSelector, modifier, cb);
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
      Screens.update(screenTwoModifier, modifier, cb);

      modifier = {
        meetingId,
        screen_value,
        screen_for
      }
      Screens.update(screenOneSelector, modifier, cb);

      return Screens.update(fullscreenSelector, fullscreenModifier, cb);
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
      Screens.update(screenOneSelector, modifier, cb);

      modifier = {
        meetingId,
        screen_value,
        screen_for
      }
      Screens.update(screenTwoModifier, modifier, cb);

      return Screens.update(fullscreenSelector, fullscreenModifier, cb);
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