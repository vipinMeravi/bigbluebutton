import { check } from 'meteor/check';

import removePresentations from '../modifiers/removePresentations';

export default function handlePresentationRemove({ body }, meetingId) {
  const { podId, presentationId } = body;
  console.log("=============>> handlePresentationRemove <<===========", body);
  check(meetingId, String);
  check(podId, String);
  check(presentationId, String);

  return removePresentations(meetingId, podId, presentationId);
}
