import React, { PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import Meetings from '/imports/api/meetings';
import Users from '/imports/api/users';
import Auth from '/imports/ui/services/auth';
import getFromUserSettings from '/imports/ui/services/users-settings';
import userListService from '../user-list/service';
import Service from './service';
import NavBar from './component';

import PresentationService from '/imports/ui/components/presentation/service';
import Presentations from '/imports/api/presentations';
import { injectIntl } from 'react-intl';

import VideoService from '../video-provider/service';
import ExternalVideoService from '/imports/ui/components/external-video-player/service';
import CaptionsService from '/imports/ui/components/captions/service';
import {
  shareScreen,
  unshareScreen,
  isVideoBroadcasting,
  screenShareEndAlert,
  dataSavingSetting,
} from '../screenshare/service';

import MediaService, {
  getSwapLayout,
  shouldEnableSwapLayout,
} from '../media/service';

const PUBLIC_CONFIG = Meteor.settings.public;
const ROLE_MODERATOR = PUBLIC_CONFIG.user.role_moderator;
const NavBarContainer = ({ children, ...props }) => (
  <NavBar {...props}>
    {children}
  </NavBar>
);

const POLLING_ENABLED = Meteor.settings.public.poll.enabled;

export default withTracker(() => {
  const CLIENT_TITLE = getFromUserSettings('bbb_client_title', PUBLIC_CONFIG.app.clientTitle);

  let meetingTitle;
  const meetingId = Auth.meetingID;
  const meetingObject = Meetings.findOne({
    meetingId,
  }, { fields: { 'meetingProp.name': 1, 'breakoutProps.sequence': 1 } });

  if (meetingObject != null) {
    meetingTitle = meetingObject.meetingProp.name;
    let titleString = `${CLIENT_TITLE} - ${meetingTitle}`;
    if (meetingObject.breakoutProps) {
      const breakoutNum = meetingObject.breakoutProps.sequence;
      if (breakoutNum > 0) {
        titleString = `${breakoutNum} - ${titleString}`;
      }
    }
    document.title = titleString;
  }

  const checkUnreadMessages = () => {
    const activeChats = userListService.getActiveChats();
    const hasUnreadMessages = activeChats
      .filter(chat => chat.userId !== Session.get('idChatOpen'))
      .some(chat => chat.unreadCounter > 0);
    return hasUnreadMessages;
  };

  const { connectRecordingObserver, processOutsideToggleRecording } = Service;
  const currentUser = Users.findOne({ userId: Auth.userID }, { fields: { role: 1 } });
  const openPanel = Session.get('openPanel');
  const isExpanded = openPanel !== '';
  const amIModerator = currentUser.role === ROLE_MODERATOR;
  const hasUnreadMessages = checkUnreadMessages();

  return {
    amIModerator,
    isExpanded,
    currentUserId: Auth.userID,
    processOutsideToggleRecording,
    connectRecordingObserver,
    meetingId,
    presentationTitle: meetingTitle,
    hasUnreadMessages,

    //Action Bar Parameters: 
    amIPresenter: Service.amIPresenter(),
    amIModerator: Service.amIModerator(),
    stopExternalVideoShare: ExternalVideoService.stopWatching,
    handleExitVideo: () => VideoService.exitVideo(),
    handleJoinVideo: () => VideoService.joinVideo(),
    handleShareScreen: onFail => shareScreen(onFail),
    handleUnshareScreen: () => unshareScreen(),
    isVideoBroadcasting: isVideoBroadcasting(),
    screenSharingCheck: getFromUserSettings('bbb_enable_screen_sharing', Meteor.settings.public.kurento.enableScreensharing),
    enableVideo: getFromUserSettings('bbb_enable_video', Meteor.settings.public.kurento.enableVideo),
    isLayoutSwapped: getSwapLayout() && shouldEnableSwapLayout(),
    toggleSwapLayout: MediaService.toggleSwapLayout,
    handleTakePresenter: Service.takePresenterRole,
    currentSlidHasContent: PresentationService.currentSlidHasContent(),
    parseCurrentSlideContent: PresentationService.parseCurrentSlideContent,
    isSharingVideo: Service.isSharingVideo(),
    screenShareEndAlert,
    screenshareDataSavingSetting: dataSavingSetting(),
    isCaptionsAvailable: CaptionsService.isCaptionsAvailable(),
    isMeteorConnected: Meteor.status().connected,
    isPollingEnabled: POLLING_ENABLED,
    isThereCurrentPresentation: Presentations.findOne({ meetingId: Auth.meetingID, current: true },
      { fields: {} }),
    allowExternalVideo: Meteor.settings.public.externalVideoPlayer.enabled,
  };
})(injectIntl(NavBarContainer));
