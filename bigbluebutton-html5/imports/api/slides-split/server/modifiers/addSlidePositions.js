import { SlidePositions } from '/imports/api/slides-split';
import Logger from '/imports/startup/server/logger';
import { check } from 'meteor/check';
import flat from 'flat';

export default function addSlidePositions(
  meetingId,
  podSplitId,
  presentationId,
  slideId,
  slidePosition,
) {
  check(meetingId, String);
  check(podSplitId, String);
  check(presentationId, String);
  check(slideId, String);

  check(slidePosition, {
    width: Number,
    height: Number,
    x: Number,
    y: Number,
    viewBoxWidth: Number,
    viewBoxHeight: Number,
  });

  const selector = {
    meetingId,
    podSplitId,
    presentationId,
    id: slideId,
  };

  const modifier = {
    $set: Object.assign(
      { meetingId },
      { podSplitId },
      { presentationId },
      { id: slideId },
      flat(slidePosition),
      { safe: true },
    ),
  };

  const cb = (err, numChanged) => {
    if (err) {
      return Logger.error(`Adding slide position to collection: ${err}`);
    }

    const { insertedId } = numChanged;

    if (insertedId) {
      return Logger.info(`Added slide position id=${slideId} pod=${podSplitId} presentation=${presentationId}`);
    }

    return Logger.info(`Upserted slide position id=${slideId} pod=${podSplitId} presentation=${presentationId}`);
  };

  return SlidePositions.upsert(selector, modifier, cb);
}
