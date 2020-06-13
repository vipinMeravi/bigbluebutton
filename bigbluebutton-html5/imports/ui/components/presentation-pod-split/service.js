import PresentationPods from '/imports/api/presentation-pods';
import Presentations from '/imports/api/presentations';
import Auth from '/imports/ui/services/auth';

const getPresentationPodIds = () => {
  const podIds = PresentationPods.find(
    {
      meetingId: Auth.meetingID,
    },
    {
      fields: {
        podId: 1,
      },
    },
  ).fetch();

  return podIds;
};

const getPresentationsPodIds = () => {
  const podIds = Presentations.find(
    // {
    //   meetingId: Auth.meetingID,
    // },
    // {
    //   fields: {
    //     podId: 1,
    //   },
    // },
  ).fetch();

  return podIds;
};

export default {
  getPresentationPodIds,
  getPresentationsPodIds
};
