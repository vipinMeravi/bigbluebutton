import { check } from 'meteor/check';
import setCurrentPresentation from '../modifiers/setCurrentPresentation';

export default function handlePresentationCurrentSet({ body }, meetingId) {
  check(body, Object);
  console.log("=============>> handlePresentationCurrentSet <<===========", body);
  const { presentationId, podId } = body;

  check(meetingId, String);
  check(presentationId, String);
  check(podId, String);

  return setCurrentPresentation(meetingId, podId, presentationId);
}
