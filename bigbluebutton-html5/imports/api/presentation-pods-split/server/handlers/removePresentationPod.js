import { check } from 'meteor/check';
import removePresentationPod from '../modifiers/removePresentationPod';

export default function handleRemovePresentationPod({ body }, meetingId) {
  check(body, Object);
  check(meetingId, String);

  const { podSplitId } = body;

  check(podSplitId, String);

  console.log("+++++++>>Remove Presentation Pod Body <<+++++", body)

  removePresentationPod(meetingId, podSplitId);
}
