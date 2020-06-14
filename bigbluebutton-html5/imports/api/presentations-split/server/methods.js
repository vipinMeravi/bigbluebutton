import { Meteor } from 'meteor/meteor';
import removePresentations from './methods/removePresentations';
import setPresentation from './methods/setPresentation';
import setPresentationDownloadable from './methods/setPresentationDownloadable';

Meteor.methods({
  removePresentations,
  setPresentation,
  setPresentationDownloadable,
});
