import { check } from 'meteor/check';
import { Slides } from '/imports/api/slides-split';
import Logger from '/imports/startup/server/logger';

export default function changeCurrentSlide(meetingId, podSplitId, presentationId, slideId) {
  check(meetingId, String);
  check(presentationId, String);
  check(slideId, String);
  check(podSplitId, String);

  const oldCurrent = {
    selector: {
      meetingId,
      podSplitId,
      presentationId,
      current: true,
    },
    modifier: {
      $set: { current: false },
    },
    callback: (err) => {
      if (err) {
        return Logger.error(`Unsetting the current slide: ${err}`);
      }

      return Logger.info('Unsetted the current slide');
    },
  };

  const newCurrent = {
    selector: {
      meetingId,
      podSplitId,
      presentationId,
      id: slideId,
    },
    modifier: {
      $set: { current: true },
    },
    callback: (err) => {
      if (err) {
        return Logger.error(`Setting as current slide id=${slideId}: ${err}`);
      }

      return Logger.info(`Setted as current slide id=${slideId}`);
    },
  };

  const oldSlide = Slides.findOne(oldCurrent.selector);
  const newSlide = Slides.findOne(newCurrent.selector);

  // if the oldCurrent and newCurrent have the same ids
  if (oldSlide && newSlide && (oldSlide._id === newSlide._id)) {
    return;
  }

  if (newSlide) {
    Slides.update(newSlide._id, newCurrent.modifier, newCurrent.callback);
  }

  if (oldSlide) {
    Slides.update(oldSlide._id, oldCurrent.modifier, oldCurrent.callback);
  }
}
