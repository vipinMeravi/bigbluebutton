import { Meteor } from 'meteor/meteor';
import getFullscreen from './methods/getFullscreen';
import getScreenOne from './methods/getScreenOne';
import getScreenTwo from './methods/getScreenTwo';

Meteor.methods({
    getFullscreen,
    getScreenOne,
    getScreenTwo
});