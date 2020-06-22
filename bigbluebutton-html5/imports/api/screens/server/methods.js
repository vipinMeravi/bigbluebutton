import { Meteor } from 'meteor/meteor';
import insertScreen from './methods/insert-screen';
import updateScreen from './methods/update-screen';
import removeScreen from './methods/remove-screen';

Meteor.methods({
  insertScreen,
  updateScreen,
  removeScreen
});
