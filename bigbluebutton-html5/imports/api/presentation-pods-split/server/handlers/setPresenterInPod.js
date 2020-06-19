import { check } from 'meteor/check';
import setPresenterInPod from '../modifiers/setPresenterInPod';

export default function handleSetPresenterInPod({ body }, meetingId) {
  check(body, Object);

  const { podSplitId, nextPresenterId } = body;

  check(podSplitId, String);
  check(nextPresenterId, String);

  console.log("========>>Handle Set Presenttaion Pod Split<<======", body);

  setPresenterInPod(meetingId, podSplitId, nextPresenterId);
}
