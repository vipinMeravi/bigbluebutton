import Auth from '/imports/ui/services/auth';
import Presentations from '/imports/api/presentations';
import { makeCall } from '/imports/ui/services/api';
import { throttle } from 'lodash';

const PAN_ZOOM_INTERVAL = Meteor.settings.public.presentation.panZoomInterval || 200;

const getNumberOfSlides = (podId, presentationId) => {
  const meetingId = Auth.meetingID;

  const presentation = Presentations.findOne({
    meetingId,
    podId,
    id: presentationId,
  });

  return presentation ? presentation.pages.length : 0;
};

const previousSlide = (currentSlideNum, podId) => {
  if (currentSlideNum > 1) {
    makeCall('switchSlides', currentSlideNum - 1, podId);
  }
};

const nextSlide = (currentSlideNum, numberOfSlides, podId) => {
  if (currentSlideNum < numberOfSlides) {
    makeCall('switchSlides', currentSlideNum + 1, podId);
  }
};

const zoomSlide = throttle((currentSlideNum, podId, widthRatio, heightRatio, xOffset, yOffset) => {
  makeCall('zoomSlides', currentSlideNum, podId, widthRatio, heightRatio, xOffset, yOffset);
}, PAN_ZOOM_INTERVAL);

const skipToSlide = (requestedSlideNum, podId) => {
  makeCall('switchSlides', requestedSlideNum, podId);
};

export default {
  getNumberOfSlides,
  nextSlide,
  previousSlide,
  skipToSlide,
  zoomSlide,
};
