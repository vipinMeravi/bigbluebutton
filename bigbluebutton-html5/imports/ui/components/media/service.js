import Presentations from '/imports/api/presentations';
import Screens from '/imports/api/screens';
import { isVideoBroadcasting } from '/imports/ui/components/screenshare/service';
import { getVideoUrl } from '/imports/ui/components/external-video-player/service';
import { getWebsiteUrl } from '/imports/ui/components/website-viewer/service';
import Auth from '/imports/ui/services/auth';
import Users from '/imports/api/users';
import Settings from '/imports/ui/services/settings';
import VideoService from '/imports/ui/components/video-provider/service';
import PollingService from '/imports/ui/components/polling/service';
import getFromUserSettings from '/imports/ui/services/users-settings';
import { makeCall } from '/imports/ui/services/api';

const LAYOUT_CONFIG = Meteor.settings.public.layout;
const KURENTO_CONFIG = Meteor.settings.public.kurento;

const getPresentationInfo = () => {
  const currentPresentation = Presentations.findOne({
    current: true,
  });

  return {
    current_presentation: (currentPresentation != null),
  };
};

const isUserPresenter = () => Users.findOne({ userId: Auth.userID },
  { fields: { presenter: 1 } }).presenter;

function shouldShowWhiteboard() {
  return true;
}

function shouldShowScreenshare() {
  const { viewScreenshare } = Settings.dataSaving;
  const enableScreensharing = getFromUserSettings('bbb_enable_screen_sharing', KURENTO_CONFIG.enableScreensharing);
  return enableScreensharing && viewScreenshare && isVideoBroadcasting();
}

function shouldShowExternalVideo() {
  const { enabled: enableExternalVideo } = Meteor.settings.public.externalVideoPlayer;
  return enableExternalVideo && getVideoUrl();
}

function shouldShowExternalWebsite() {
  return getWebsiteUrl();
}

function shouldShowOverlay() {
  return getFromUserSettings('bbb_enable_video', KURENTO_CONFIG.enableVideo);
}

const swapLayout = {
  value: getFromUserSettings('bbb_auto_swap_layout', LAYOUT_CONFIG.autoSwapLayout),
  tracker: new Tracker.Dependency(),
};

const setSwapLayout = () => {
  swapLayout.value = getFromUserSettings('bbb_auto_swap_layout', LAYOUT_CONFIG.autoSwapLayout);
  swapLayout.tracker.changed();
};

const toggleSwapLayout = () => {
  swapLayout.value = !swapLayout.value;
  swapLayout.tracker.changed();
};

export const shouldEnableSwapLayout = () => !shouldShowScreenshare() && !shouldShowExternalVideo();

export const getSwapLayout = () => {
  swapLayout.tracker.depend();
  console.log("================>>>getSwapLayout<<==============")
  console.log(swapLayout.value)
  console.log(swapLayout)
  console.log("================>>>getSwapLayout<<==============")
  return swapLayout.value;
};
 
const getScreenValueFor = (screen_value) => {
  console.log("======== get subscrbe value of screen ========== ")
  const sub = Meteor.subscribe('screen-values');
  console.log(sub);
  const screens = Screens.findOne({
    screen_value: screen_value
  })
  console.log(screen);
  console.log("======== get subscrbe value of screen ========== ")
  return screens
}

export default {
  getPresentationInfo,
  shouldShowWhiteboard,
  shouldShowScreenshare,
  shouldShowExternalVideo,
  shouldShowOverlay,
  isUserPresenter,
  isVideoBroadcasting,
  toggleSwapLayout,
  shouldEnableSwapLayout,
  getSwapLayout,
  setSwapLayout,
  shouldShowExternalWebsite,
  getScreenValueFor
};
