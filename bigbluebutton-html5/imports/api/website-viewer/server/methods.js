import { Meteor } from 'meteor/meteor';
import startWatchingExternalWebsite from './methods/startWatchingExternalVideo';
import stopWatchingExternalWebsite from './methods/stopWatchingExternalVideo';
import initializeExternalWebsite from './methods/initializeExternalVideo';
import emitExternalWebsiteEvent from './methods/emitExternalVideoEvent';

Meteor.methods({
  startWatchingExternalWebsite,
  stopWatchingExternalWebsite,
  initializeExternalWebsite,
  emitExternalWebsiteEvent,
});
