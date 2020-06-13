import { check } from 'meteor/check';
import addPresentationPod from '../modifiers/addPresentationPod';

export default function handleCreateNewPresentationPod({ body }, meetingId) {
  check(body, {
    currentPresenterId: String,
    podId: String,
  });
  check(meetingId, String);

  const { currentPresenterId, podId } = body;

  const pod = {
    currentPresenterId,
    podId,
  };
  console.log("===========>> Handle Create New Presnentation Body <<========",  body);
  console.log("===========>> Handle Create New Presnentation pod <<========",  pod);
  addPresentationPod(meetingId, pod);
}
