import { check } from 'meteor/check';
import PresentationPods from '/imports/api/presentation-pods-split';
import removePresentationPod from '../modifiers/removePresentationPod';
import addPresentationPod from '../modifiers/addPresentationPod';

export default function handleSyncGetPresentationPods({ body }, meetingId) {
  check(body, Object);
  check(meetingId, String);

  const { pods } = body;
  check(pods, Array);

  console.log("=======>>Sync Get Presnentaion pod <<=========", body);

  const presentationPodIds = pods.map(pod => pod.id);

  const presentationPodsToRemove = PresentationPods.find({
    meetingId,
    podSplitId: { $nin: presentationPodIds },
  }, { fields: { podSplitId: 1 } }).fetch();

  presentationPodsToRemove.forEach(p => removePresentationPod(meetingId, p.podSplitId));

  pods.forEach((pod) => {
    // 'podId' and 'currentPresenterId' for some reason called 'id' and 'currentPresenter'
    // in this message
    const {
      id: podSplitId,
      currentPresenter: currentPresenterId,
      presentations,
    } = pod;
    addPresentationPod(meetingId, { podSplitId, currentPresenterId }, presentations);
  });
}
