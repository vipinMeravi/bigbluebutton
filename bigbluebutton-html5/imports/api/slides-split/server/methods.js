import { Meteor } from 'meteor/meteor';
import switchSlidesSplit from './methods/switchSlide';
import zoomSlidesSplit from './methods/zoomSlide';

Meteor.methods({
  switchSlidesSplit,
  zoomSlidesSplit,
});
