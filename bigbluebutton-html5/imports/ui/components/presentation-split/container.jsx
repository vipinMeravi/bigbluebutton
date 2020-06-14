import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import MediaService, { getSwapLayout, shouldEnableSwapLayout } from '/imports/ui/components/media/service';
import { notify } from '/imports/ui/services/notification';
import PresentationAreaService from './service';
import PresentationArea from './component';
import PresentationToolbarService from './presentation-toolbar/service';
import Auth from '/imports/ui/services/auth';
import Meetings from '/imports/api/meetings';
import Users from '/imports/api/users';
import getFromUserSettings from '/imports/ui/services/users-settings';

const ROLE_VIEWER = Meteor.settings.public.user.role_viewer;

const PresentationAreaContainer = ({ presentationSplitPodIds, mountSplitPresentationArea, ...props }) => (
  mountSplitPresentationArea && <PresentationArea {...props} />
);

export default withTracker(({ podsplitId, screen_value }) => {
  const currentSplitSlide = PresentationAreaService.getCurrentSlide(podsplitId, screen_value);
  console.log('======================================>>> podid =======>')
  console.log('======================================>>> podid =======>')
  console.log(podsplitId)
  console.log(currentSplitSlide);
  console.log('======================================>>> podid =======>')
  console.log('======================================>>> podid =======>')
  const presentationIsDownloadable = PresentationAreaService.isPresentationDownloadable(podsplitId, screen_value);
  const layoutSwapped = getSwapLayout() && shouldEnableSwapLayout();
  const isViewer = Users.findOne({ meetingId: Auth.meetingID, userId: Auth.userID }, {
    fields: {
      role: 1,
    },
  }).role === ROLE_VIEWER;

  let slidePosition;
  if (currentSplitSlide) {
    const {
      presentationId,
      id: slideId,
    } = currentSplitSlide;
    slidePosition = PresentationAreaService.getSlidePosition(podsplitId, presentationId, slideId);
  }
  return {
    currentSplitSlide,
    slidePosition,
    downloadPresentationUri: PresentationAreaService.downloadPresentationUri(podsplitId, screen_value),
    // userIsPresenter: PresentationAreaService.isPresenter(podsplitId) && !layoutSwapped,
    multiUser: PresentationAreaService.getMultiUserStatus(currentSplitSlide && currentSplitSlide.id)
      && !layoutSwapped,
    presentationIsDownloadable,
    mountSplitPresentationArea: !!currentSplitSlide,
    currentPresentation: PresentationAreaService.getCurrentPresentation(podsplitId),
    notify,
    zoomSlide: PresentationToolbarService.zoomSlide,
    layoutSwapped,
    toggleSwapLayout: MediaService.toggleSwapLayout,
    publishedPoll: Meetings.findOne({ meetingId: Auth.meetingID }, {
      fields: {
        publishedPoll: 1,
      },
    }).publishedPoll,
    isViewer,
    currentPresentationId: Session.get('currentPresentationId') || null,
    restoreOnUpdate: getFromUserSettings(
      'bbb_force_restore_presentation_on_new_events',
      Meteor.settings.public.presentation.restoreOnUpdate,
    ),
  };
})(PresentationAreaContainer);
