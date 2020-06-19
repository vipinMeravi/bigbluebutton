import { check } from 'meteor/check';
import addPresentationPod from '../modifiers/addPresentationPod';

export default function handleCreateNewPresentationPod({ body }, meetingId) {
  check(body, {
    currentSplitPresenterId: String,
    podSplitId: String,
  });
  check(meetingId, String);

  const { currentSplitPresenterId, podSplitId } = body;

  const pod = {
    currentSplitPresenterId,
    podSplitId,
  };
  console.log("===========>> Handle Create New Presnentation Body <<========",  body);
  console.log("===========>> Handle Create New Presnentation pod <<========",  pod);
  addPresentationPod(meetingId, pod);
}
