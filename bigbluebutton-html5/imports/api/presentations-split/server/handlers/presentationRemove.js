import { check } from 'meteor/check';

import removePresentations from '../modifiers/removePresentations';

export default function handlePresentationRemove({ body }, meetingId) {
  const { podSplitId, presentationId } = body;
  console.log("=============>> handlePresentationRemove <<===========", body);
  check(meetingId, String);
  check(podSplitId, String);
  check(presentationId, String);

  return removePresentations(meetingId, podSplitId, presentationId);
}
