import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import Presentations from '/imports/api/presentations-split';
import Logger from '/imports/startup/server/logger';
import flat from 'flat';
import addSlide from '/imports/api/slides-split/server/modifiers/addSlide';
import setCurrentPresentation from './setCurrentPresentation';

const getSlideText = async (url) => {
  let content = '';
  try {
    content = await HTTP.get(url).content;
  } catch (error) {
    Logger.error(`No file found. ${error}`);
  }
  return content;
};

const addSlides = (meetingId, podSplitId, presentationId, slides) => {
  slides.forEach(async (slide) => {
    const content = await getSlideText(slide.txtUri);

    Object.assign(slide, { content });

    addSlide(meetingId, podSplitId, presentationId, slide);
  });
};

export default function addPresentation(meetingId, podSplitId, presentation) {
  check(meetingId, String);
  check(podSplitId, String);
  check(presentation, {
    id: String,
    name: String,
    current: Boolean,
    pages: [
      {
        id: String,
        num: Number,
        thumbUri: String,
        swfUri: String,
        txtUri: String,
        svgUri: String,
        current: Boolean,
        xOffset: Number,
        yOffset: Number,
        widthRatio: Number,
        heightRatio: Number,
      },
    ],
    downloadable: Boolean,
  });

  const selector = {
    meetingId,
    podSplitId,
    id: presentation.id,
  };

  const modifier = {
    $set: Object.assign({
      meetingId,
      podSplitId,
      'conversion.done': true,
      'conversion.error': false,
    }, flat(presentation, { safe: true })),
  };

  const cb = (err, numChanged) => {
    if (err) {
      return Logger.error(`Adding presentation to collection: ${err}`);
    }

    addSlides(meetingId, podSplitId, presentation.id, presentation.pages);

    const { insertedId } = numChanged;
    if (insertedId) {
      if (presentation.current) {
        setCurrentPresentation(meetingId, podSplitId, presentation.id);
      }

      return Logger.info(`Added presentation split id=${presentation.id} meeting=${meetingId}`);
    }

    return Logger.info(`Upserted presentation split id=${presentation.id} meeting=${meetingId}`);
  };

  return Presentations.upsert(selector, modifier, cb);
}
