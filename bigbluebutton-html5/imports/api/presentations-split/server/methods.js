import { Meteor } from 'meteor/meteor';
import removePresentations from './methods/removePresentations';
import setPresentations from './methods/setPresentation';
import setPresentationDownloadables from './methods/setPresentationDownloadable';

Meteor.methods({
  removePresentations,
  setPresentations,
  setPresentationDownloadables,
});
