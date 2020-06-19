import { check } from 'meteor/check';
import changeCurrentSlide from '../modifiers/changeCurrentSlide';

export default function handleSlideChange({ body }, meetingId) {
  const { pageId, presentationId, podSplitId } = body;

  check(pageId, String);
  check(presentationId, String);
  check(podSplitId, String);

  return changeCurrentSlide(meetingId, podSplitId, presentationId, pageId);
}
