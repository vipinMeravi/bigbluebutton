import { Meteor } from 'meteor/meteor';
import switchSlides from './methods/switchSlide';
import zoomSlides from './methods/zoomSlide';

Meteor.methods({
  switchSlides,
  zoomSlides,
});
