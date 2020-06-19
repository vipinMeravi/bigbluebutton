import { Meteor } from 'meteor/meteor';
import removePresentationsSplit from './methods/removePresentations';
import setPresentationsSplit from './methods/setPresentation';
import setPresentationDownloadablesSplit from './methods/setPresentationDownloadable';

Meteor.methods({
  removePresentationsSplit,
  setPresentationsSplit,
  setPresentationDownloadablesSplit,
});
