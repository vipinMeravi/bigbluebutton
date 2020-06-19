import { check } from 'meteor/check';
import addPresentation from '../modifiers/addPresentation';

export default function handlePresentationAdded({ body }, meetingId) {
  check(body, Object);

  const { presentation, podSplitId } = body;

  check(meetingId, String);
  check(podSplitId, String);
  check(presentation, Object);
  console.log("=============>> Presentation Added <<===========", body);
  return addPresentation(meetingId, podSplitId, presentation);
}
