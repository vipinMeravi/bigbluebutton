import { check } from 'meteor/check';
import setCurrentPresentation from '../modifiers/setCurrentPresentation';

export default function handlePresentationCurrentSet({ body }, meetingId) {
  check(body, Object);
  console.log("=============>> handlePresentationCurrentSet Split <<===========", body);
  const { presentationId, podSplitId } = body;

  check(meetingId, String);
  check(presentationId, String);
  check(podSplitId, String);

  return setCurrentPresentation(meetingId, podSplitId, presentationId);
}
