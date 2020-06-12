import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Settings from '/imports/ui/services/settings';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { notify } from '/imports/ui/services/notification';
import VideoService from '/imports/ui/components/video-provider/service';
import getFromUserSettings from '/imports/ui/services/users-settings';
import { withModalMounter } from '/imports/ui/components/modal/service';
import Media from './component';
import MediaService, { getSwapLayout, shouldEnableSwapLayout } from './service';
import PresentationPodsContainer from '../presentation-pod/container';
import ScreenshareContainer from '../screenshare/container';
import DefaultContent from '../presentation/default-content/component';
import ExternalVideoContainer from '../external-video-player/container';
import Storage from '../../services/storage/session';

const LAYOUT_CONFIG = Meteor.settings.public.layout;
const KURENTO_CONFIG = Meteor.settings.public.kurento;

const propTypes = {
  isScreensharing: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  arrScreen: PropTypes.array.isRequired,
  isUpdate :PropTypes.bool.isRequired,
  screen_value: PropTypes.string.isRequired,
};

const intlMessages = defineMessages({
  screenshareStarted: {
    id: 'app.media.screenshare.start',
    description: 'toast to show when a screenshare has started',
  },
  screenshareEnded: {
    id: 'app.media.screenshare.end',
    description: 'toast to show when a screenshare has ended',
  },
  screenshareNotSupported: {
    id: 'app.media.screenshare.notSupported',
    description: 'Error message for screenshare not supported',
  },
  chromeExtensionError: {
    id: 'app.video.chromeExtensionError',
    description: 'Error message for Chrome Extension not installed',
  },
  chromeExtensionErrorLink: {
    id: 'app.video.chromeExtensionErrorLink',
    description: 'Error message for Chrome Extension not installed',
  },
});

class MediaContainer extends Component {
  state={
    isTempState :true
  }
  componentWillMount() {
    document.addEventListener('installChromeExtension', this.installChromeExtension.bind(this));
    document.addEventListener('screenshareNotSupported', this.screenshareNotSupported.bind(this));
  }
  updateMediaSection = () =>{
    alert('Media section updated')
  }
  componentWillReceiveProps(nextProps) {
    console.log('--------- componentWillReceiveProps props =====>')
    console.log(this.props)
    const {
      isScreensharing,
      intl,
    } = this.props;

    if (isScreensharing !== nextProps.isScreensharing) {
      if (nextProps.isScreensharing) {
        notify(intl.formatMessage(intlMessages.screenshareStarted), 'info', 'desktop');
      } else {
        notify(intl.formatMessage(intlMessages.screenshareEnded), 'info', 'desktop');
      }
    }
  }

  componentWillUnmount() {
    console.log('---------- unmounted componentWillUnmount =====>')
    document.removeEventListener('installChromeExtension', this.installChromeExtension.bind(this));
    document.removeEventListener('screenshareNotSupported', this.screenshareNotSupported.bind(this));
  }

  installChromeExtension() {
    const { intl } = this.props;

    const CHROME_DEFAULT_EXTENSION_LINK = KURENTO_CONFIG.chromeDefaultExtensionLink;
    const CHROME_CUSTOM_EXTENSION_LINK = KURENTO_CONFIG.chromeExtensionLink;
    const CHROME_EXTENSION_LINK = CHROME_CUSTOM_EXTENSION_LINK === 'LINK' ? CHROME_DEFAULT_EXTENSION_LINK : CHROME_CUSTOM_EXTENSION_LINK;

    const chromeErrorElement = (
      <div>
        {intl.formatMessage(intlMessages.chromeExtensionError)}
        {' '}
        <a href={CHROME_EXTENSION_LINK} target="_blank" rel="noopener noreferrer">
          {intl.formatMessage(intlMessages.chromeExtensionErrorLink)}
        </a>
      </div>
    );
    notify(chromeErrorElement, 'error', 'desktop');
  }

  screenshareNotSupported() {
    const { intl } = this.props;
    notify(intl.formatMessage(intlMessages.screenshareNotSupported), 'error', 'desktop');
  }

  // componentWillReceiveProps () {
  //   console.log('--------- componentWillReceiveProps props =====>')
  //   console.log(this.props)
  // }
  static getDerivedStateFromProps(prevProps, prevState) {
    console.log('CONTAINER',{
      prevProps,
      prevState
    })
  }
  render() {
    console.log("============== <<Media Container Props>> ============");
    console.log(this.props);
    console.log("============== <<Media Container Props>> ============");
    return <Media {...this.props} />;
  }
}

export default withModalMounter(withTracker((props) => {
  const { dataSaving } = Settings;
  const { viewParticipantsWebcams, viewScreenshare } = dataSaving;
  const hidePresentation = getFromUserSettings('bbb_hide_presentation', LAYOUT_CONFIG.hidePresentation);
  const { current_presentation: hasPresentation } = MediaService.getPresentationInfo();
  const data = {
    children: <DefaultContent />,
    audioModalIsOpen: Session.get('audioModalIsOpen'),
    userWasInWebcam: Session.get('userWasInWebcam'),
    joinVideo: VideoService.joinVideo,
  };

  this.props? console.log("media container this.props",this.props):console.log("media container this.props undefined")
  props? console.log("media container this.props",props):console.log("media container props undefined")

  if (MediaService.shouldShowWhiteboard() && !hidePresentation) {
    data.currentPresentation = MediaService.getPresentationInfo();

    if(props.screen_value == "fullscreen" && props.screen_for == "document"){
      data.children = <PresentationPodsContainer screen_value={props.screen_value}/>;
      data.children_split = null;
    } else if(props.screen_value == "screen_one" && props.screen_for == "document"){

      data.children = <PresentationPodsContainer screen_value={props.screen_value}/>;

    } else if(props.screen_value == "screen_two" && props.screen_for == "document"){

      data.children = <PresentationPodsContainer screen_value={"screen_one"}/>;
      // data.children = <PresentationPodsContainer/>;
      data.children_split = <PresentationPodsContainer screen_value={props.screen_value}/>;

    } else if(props.screen_value == "fullscreen" && props.screen_for == "media"){
      
      data.children = null

    } else if(props.screen_value == "screen_one" && props.screen_for == "media"){
      
      data.children_split = <PresentationPodsContainer screen_value={props.screen_value}/>;

    } else if(props.screen_value == "screen_two" && props.screen_for == "media"){
      
      data.children = <PresentationPodsContainer screen_value={props.screen_value}/>;

    }
    

    // if(props.screen_value == "fullscreen"){
    //   data.children = <PresentationPodsContainer />;
    //   data.children_split = null;
    // } else if( props.screen_value == "screen_two"){
    //   data.children_split = <PresentationPodsContainer />;
    // } else if (props.screen_value == "screen_one" ) {
    //   data.children = <PresentationPodsContainer />;
    // }   
  }

  if (MediaService.shouldShowScreenshare() && (viewScreenshare || MediaService.isUserPresenter())) {
    data.children = <ScreenshareContainer />;
  }

  const usersVideo = VideoService.getAllWebcamUsers();
  data.usersVideo = usersVideo;

  if (MediaService.shouldShowOverlay() && usersVideo.length && viewParticipantsWebcams) {
    data.floatingOverlay = usersVideo.length < 2;
    data.hideOverlay = usersVideo.length === 0;
  }

  data.singleWebcam = (usersVideo.length < 2);

  data.isScreensharing = MediaService.isVideoBroadcasting();
  data.swapLayout = (getSwapLayout() || !hasPresentation) && shouldEnableSwapLayout();
  data.disableVideo = !viewParticipantsWebcams;

  if (data.swapLayout) {
    data.floatingOverlay = true;
    data.hideOverlay = true;
  }

  if (MediaService.shouldShowExternalVideo()) {
    if (props.screen_value == "fullscreen" && props.screen_for == "media") {
      data.children = (
        <ExternalVideoContainer
          isPresenter={MediaService.isUserPresenter()}
        />
      );
      data.children_split = null;
    } else if(props.screen_value == "screen_two" && props.screen_for == "media"){
      data.children_split = (
        <ExternalVideoContainer
          isPresenter={MediaService.isUserPresenter()}
        />
      );
    } else if(props.screen_value == "screen_one" && props.screen_for == "media"){
      data.children = (
        <ExternalVideoContainer
          isPresenter={MediaService.isUserPresenter()}
        />
      );
    }
  }

  data.webcamPlacement = Storage.getItem('webcamPlacement');

  MediaContainer.propTypes = propTypes;
  return data;
})(injectIntl(MediaContainer)));
