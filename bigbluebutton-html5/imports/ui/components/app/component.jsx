import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Modal from 'react-modal';
import browser from 'browser-detect';
import PanelManager from '/imports/ui/components/panel-manager/component';
import PollingContainer from '/imports/ui/components/polling/container';
import logger from '/imports/startup/client/logger';
import ActivityCheckContainer from '/imports/ui/components/activity-check/container';
import UserInfoContainer from '/imports/ui/components/user-info/container';
import BreakoutRoomInvitation from '/imports/ui/components/breakout-room/invitation/container';
import ToastContainer from '../toast/container';
import ModalContainer from '../modal/container';
import NotificationsBarContainer from '../notifications-bar/container';
import AudioContainer from '../audio/container';
import ChatAlertContainer from '../chat/alert/container';
import BannerBarContainer from '/imports/ui/components/banner-bar/container';
import WaitingNotifierContainer from '/imports/ui/components/waiting-users/alert/container';
import LockNotifier from '/imports/ui/components/lock-viewers/notify/container';
import PingPongContainer from '/imports/ui/components/ping-pong/container';
import MediaService from '/imports/ui/components/media/service';
import ManyWebcamsNotifier from '/imports/ui/components/video-provider/many-users-notify/container';
import { styles } from './styles';
import cx from 'classnames';

import NavBarContainer from '../nav-bar/container';
import MediaContainer from '../media/container';
import ActionsBarContainer from '../actions-bar/container';

const MOBILE_MEDIA = 'only screen and (max-width: 40em)';
const APP_CONFIG = Meteor.settings.public.app;
const DESKTOP_FONT_SIZE = APP_CONFIG.desktopFontSize;
const MOBILE_FONT_SIZE = APP_CONFIG.mobileFontSize;
const ENABLE_NETWORK_MONITORING = Meteor.settings.public.networkMonitoring.enableNetworkMonitoring;

const intlMessages = defineMessages({
  userListLabel: {
    id: 'app.userList.label',
    description: 'Aria-label for Userlist Nav',
  },
  chatLabel: {
    id: 'app.chat.label',
    description: 'Aria-label for Chat Section',
  },
  mediaLabel: {
    id: 'app.media.label',
    description: 'Aria-label for Media Section',
  },
  actionsBarLabel: {
    id: 'app.actionsBar.label',
    description: 'Aria-label for ActionsBar Section',
  },
  iOSWarning: {
    id: 'app.iOSWarning.label',
    description: 'message indicating to upgrade ios version',
  },
  clearedEmoji: {
    id: 'app.toast.clearedEmoji.label',
    description: 'message for cleared emoji status',
  },
  setEmoji: {
    id: 'app.toast.setEmoji.label',
    description: 'message when a user emoji has been set',
  },
  meetingMuteOn: {
    id: 'app.toast.meetingMuteOn.label',
    description: 'message used when meeting has been muted',
  },
  meetingMuteOff: {
    id: 'app.toast.meetingMuteOff.label',
    description: 'message used when meeting has been unmuted',
  },
  pollPublishedLabel: {
    id: 'app.whiteboard.annotations.poll',
    description: 'message displayed when a poll is published',
  },
});

const propTypes = {
  navbar: PropTypes.element,
  sidebar: PropTypes.element,
  media: PropTypes.element,
  actionsbar: PropTypes.element,
  captions: PropTypes.element,
  locale: PropTypes.string,
  intl: intlShape.isRequired,
};

const defaultProps = {
  navbar: null,
  sidebar: null,
  media: null,
  actionsbar: null,
  captions: null,
  locale: 'en',
};

const LAYERED_BREAKPOINT = 640;
const isLayeredView = window.matchMedia(`(max-width: ${LAYERED_BREAKPOINT}px)`);

class App extends Component {
  constructor() {
    super();
    this.state = {
      enableResize: !window.matchMedia(MOBILE_MEDIA).matches,
      arrScreen: ['pdf'],
      isUpdate: false,
      screen_value: "fullscreen",
      screen_for: 'document'
    };
    this.mediaContainer = React.createRef();
    this.handleWindowResize = throttle(this.handleWindowResize).bind(this);
    this.shouldAriaHide = this.shouldAriaHide.bind(this);
  }

  componentDidMount() {
    const {
      locale, notify, intl, validIOSVersion, startBandwidthMonitoring, handleNetworkConnection,
    } = this.props;
    const BROWSER_RESULTS = browser();
    const isMobileBrowser = BROWSER_RESULTS.mobile || BROWSER_RESULTS.os.includes('Android');

    MediaService.setSwapLayout();
    Modal.setAppElement('#app');
    document.getElementsByTagName('html')[0].lang = locale;
    document.getElementsByTagName('html')[0].style.fontSize = isMobileBrowser ? MOBILE_FONT_SIZE : DESKTOP_FONT_SIZE;

    const body = document.getElementsByTagName('body')[0];
    if (BROWSER_RESULTS && BROWSER_RESULTS.name) {
      body.classList.add(`browser-${BROWSER_RESULTS.name}`);
    }
    if (BROWSER_RESULTS && BROWSER_RESULTS.os) {
      body.classList.add(`os-${BROWSER_RESULTS.os.split(' ').shift().toLowerCase()}`);
    }

    if (!validIOSVersion()) {
      notify(
        intl.formatMessage(intlMessages.iOSWarning), 'error', 'warning',
      );
    }

    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize, false);

    if (ENABLE_NETWORK_MONITORING) {
      if (navigator.connection) {
        handleNetworkConnection();
        navigator.connection.addEventListener('change', handleNetworkConnection);
      }

      startBandwidthMonitoring();
    }

    logger.info({ logCode: 'app_component_componentdidmount' }, 'Client loaded successfully');
  }

  componentDidUpdate(prevProps) {
    const {
      meetingMuted, notify, currentUserEmoji, intl, hasPublishedPoll,
    } = this.props;

    if (prevProps.currentUserEmoji.status !== currentUserEmoji.status) {
      const formattedEmojiStatus = intl.formatMessage({ id: `app.actionsBar.emojiMenu.${currentUserEmoji.status}Label` })
        || currentUserEmoji.status;

      notify(
        currentUserEmoji.status === 'none'
          ? intl.formatMessage(intlMessages.clearedEmoji)
          : intl.formatMessage(intlMessages.setEmoji, ({ 0: formattedEmojiStatus })),
        'info',
        currentUserEmoji.status === 'none'
          ? 'clear_status'
          : 'user',
      );
    }
    if (!prevProps.meetingMuted && meetingMuted) {
      notify(
        intl.formatMessage(intlMessages.meetingMuteOn), 'info', 'mute',
      );
    }
    if (prevProps.meetingMuted && !meetingMuted) {
      notify(
        intl.formatMessage(intlMessages.meetingMuteOff), 'info', 'unmute',
      );
    }
    if (!prevProps.hasPublishedPoll && hasPublishedPoll) {
      notify(
        intl.formatMessage(intlMessages.pollPublishedLabel), 'info', 'polling',
      );
    }
  }

  componentWillUnmount() {
    const { handleNetworkConnection } = this.props;
    window.removeEventListener('resize', this.handleWindowResize, false);
    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleNetworkConnection, false);
    }
  }

  handleWindowResize() {
    const { enableResize } = this.state;
    const shouldEnableResize = !window.matchMedia(MOBILE_MEDIA).matches;
    if (enableResize === shouldEnableResize) return;

    this.setState({ enableResize: shouldEnableResize });
  }

  shouldAriaHide() {
    const { openPanel, isPhone } = this.props;
    return openPanel !== '' && (isPhone || isLayeredView.matches);
  }

  renderPanel() {
    const { enableResize } = this.state;
    const { openPanel, isRTL } = this.props;

    return (
      <PanelManager
        {...{
          openPanel,
          enableResize,
          isRTL,
        }}
        shouldAriaHide={this.shouldAriaHide}
      />
    );
  }

  renderNavBar() {
    const { navbar } = this.props;

    if (!navbar) return null;

    return (
      <header className={styles.navbar}>
        {navbar}
      </header>
    );
  }


  renderSideNavBar() {
    const ulNave = cx({
      [styles["nav"]]: true,
    });
    const aNav = cx({
      [styles["nav-link"]]: true,
      [styles["brand-logo"]]: true,
    });

    return (
      <div className={styles.main}>
        <aside class="primary-nav" className={styles["primary-nav"]} >
          <ul class="nav flex-column text-center" className={ulNave} id="typeNav" role="tablist">
            <li class="nav-item" className={styles["nav-item"]} >
              <a class="nav-link brand-logo text-white" className={aNav} href="#">
                SeeIT
              </a>
            </li>
          </ul>
          <li class="nav-item" className={styles["nav-item"]} >
            <a class="nav-link active" data-toggle="tab" href="#ppts" role="tab" aria-controls="ppts"
              aria-selected="true">
              <img src="resources/images/nav-images/ppt.svg" class="img-fluid" alt=""></img>
            </a>
          </li>
          <li class="nav-item" className={styles["nav-item"]}>
            <a class="nav-link" data-toggle="tab" href="#pdfs" role="tab" aria-controls="pdfs"
              aria-selected="false">
              <img src="resources/images/nav-images/pdf.svg" class="img-fluid" alt=""></img>
            </a>
          </li>
          <li class="nav-item" className={styles["nav-item"]}>
            <a class="nav-link" data-toggle="tab" href="#videos" role="tab" aria-controls="videos"
              aria-selected="false">
              <img src="resources/images/nav-images/video.svg" class="img-fluid" alt=""></img>
            </a>
          </li>
          <li class="nav-item" className={styles["nav-item"]}>
            <a class="nav-link" href="#">
              <img src="resources/images/nav-images/plus.svg" class="img-fluid" alt=""></img>
            </a>
          </li>
        </aside>
        <aside class="secondary-nav" className={styles["secondary-nav"]} >
          <div class="secondary-actions d-flex justify-content-around p-3">
            <a href="#" class="btn btn-info">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path fill-rule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
              </svg>
            </a>
            <a href="#" class="btn btn-info">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-box-arrow-left" fill="currentColor"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M4.354 11.354a.5.5 0 0 0 0-.708L1.707 8l2.647-2.646a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708 0z" />
                <path fill-rule="evenodd" d="M11.5 8a.5.5 0 0 0-.5-.5H2a.5.5 0 0 0 0 1h9a.5.5 0 0 0 .5-.5z" />
                <path fill-rule="evenodd"
                  d="M14 13.5a1.5 1.5 0 0 0 1.5-1.5V4A1.5 1.5 0 0 0 14 2.5H7A1.5 1.5 0 0 0 5.5 4v1.5a.5.5 0 0 0 1 0V4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5v-1.5a.5.5 0 0 0-1 0V12A1.5 1.5 0 0 0 7 13.5h7z" />
              </svg>
            </a>
            <a href="#" class="btn btn-info">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path fill-rule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
              </svg>
            </a>
            <a href="#" class="btn btn-info">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-easel" fill="currentColor"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.473.337a.5.5 0 0 0-.946 0L6.954 2h2.092L8.473.337zM12.15 11h-1.058l1.435 4.163a.5.5 0 0 0 .946-.326L12.15 11zM8.5 11h-1v2.5a.5.5 0 0 0 1 0V11zm-3.592 0H3.85l-1.323 3.837a.5.5 0 1 0 .946.326L4.908 11z" />
                <path fill-rule="evenodd"
                  d="M14 3H2v7h12V3zM2 2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
              </svg>
            </a>
            <a href="#" class="btn btn-light">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z" />
                <path fill-rule="evenodd"
                  d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z" />
              </svg>
            </a>
          </div>
          <div class="tab-content">
            <div class="tab-pane fade show active" id="ppts" role="tabpanel" aria-labelledby="ppts-tab">
              <div class="dropdown m-3">
                <button class="btn btn-light bg-white text-left btn-lg btn-block dropdown-toggle" type="button"
                  id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Pitchdeck ver2.1
                        </button>
                <div class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="#">High variation index</a>
                  <a class="dropdown-item" href="#">Analysis Report</a>
                  <a class="dropdown-item" href="#">Marketing Report</a>
                </div>
              </div>
              <ul class="nav flex-column slides">
                <li class="nav-item">
                  <a class="nav-link text-dark" href="#">
                    Slide 1
                                <img src="resources/images/nav-images/slide-1.png" class="img-fluid" alt=""></img>
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link text-dark" href="#">
                    Slide 2
                                <img src="resources/images/nav-images/slide-2.png" class="img-fluid" alt=""></img>
                  </a>
                </li>
                <li class="nav-item active">
                  <a class="nav-link text-dark" href="#">
                    Slide 3
                                <img src="resources/images/nav-images/r-side.png" class="img-fluid" alt=""></img>
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link text-dark" href="#">
                    Slide 4
                                <img src="resources/images/nav-images/l-side.png" class="img-fluid" alt=""></img>
                  </a>
                </li>
              </ul>
            </div>
            <div class="tab-pane fade" id="pdfs" role="tabpanel" aria-labelledby="pdfs-tab">pdfs</div>
            <div class="tab-pane fade" id="videos" role="tabpanel" aria-labelledby="videos-tab">videos</div>
          </div>
        </aside>
      </div>
    );
  }

  renderSidebar() {
    const { sidebar } = this.props;

    if (!sidebar) return null;

    return (
      <aside className={styles.sidebar}>
        {sidebar}
      </aside>
    );
  }

  renderCaptions() {
    const { captions } = this.props;

    if (!captions) return null;

    return (
      <div className={styles.captionsWrapper}>
        {captions}
      </div>
    );
  }

  renderMedia() {
    const {
      media,
      intl,
    } = this.props;

    if (!media) return null;
    return (
      <section
        className={styles.media}
        aria-label={intl.formatMessage(intlMessages.mediaLabel)}
        aria-hidden={this.shouldAriaHide()}
      >
        {media}
        {this.renderCaptions()}
      </section>
    );
  }

  renderActionsBar() {
    const {
      actionsbar,
      intl,
    } = this.props;
    console.log('-----------Action Bar Props --------> ', this.props.actionsbar);
    if (!actionsbar) return null;

    return (
      <section
        className={styles.actionsbar}
        aria-label={intl.formatMessage(intlMessages.actionsBarLabel)}
        aria-hidden={this.shouldAriaHide()}
      >
        {actionsbar}
      </section>
    );
  }

  renderActivityCheck() {
    const { User } = this.props;

    const { inactivityCheck, responseDelay } = User;

    return (inactivityCheck ? (
      <ActivityCheckContainer
        inactivityCheck={inactivityCheck}
        responseDelay={responseDelay}
      />) : null);
  }

  renderUserInformation() {
    const { UserInfo, User } = this.props;

    return (UserInfo.length > 0 ? (
      <UserInfoContainer
        UserInfo={UserInfo}
        requesterUserId={User.userId}
        meetingId={User.meetingId}
      />) : null);
  }

  render() {
    const {
      customStyle, customStyleUrl, openPanel,
    } = this.props;
    return (
      <main className={styles.main}>
        {this.renderActivityCheck()}
        {this.renderUserInformation()}
        <BannerBarContainer />
        <NotificationsBarContainer />
        <section className={styles.wrapper}>
          <div className={openPanel ? styles.content : styles.noPanelContent}>
            {this.renderNavBar()}

            {/* <header className={styles.navbar}>
              <NavBarContainer getScreenValue={(screen_value, screen_for, arrScreen)=>{
                console.log('==================?>>>>>??>>?>>??')
                console.log(this.state.screen_value)
                console.log('==================?>>>>>??>>?>>??')
                this.setState({
                  screen_value: screen_value,
                  screen_for: screen_for,
                  arrScreen
                },()=>{
                  console.log('=========?>>>UPDAGTE>>??>>?>',this.state.screen_value)
                })
              }} />
            </header> */}

            {this.renderMedia()}

            {/* <section
              className={styles.media}
              aria-label={this.props.intl.formatMessage(intlMessages.mediaLabel)}
              aria-hidden={this.shouldAriaHide()}
            >
              <MediaContainer arrScreen={this.state.arrScreen} screen_value={this.state.screen_value} screen_for={this.state.screen_for}/>
              {this.renderCaptions()}
            </section> */}


            {/* <section
              className={styles.actionsbar}
              aria-label={this.props.intl.formatMessage(intlMessages.actionsBarLabel)}
              aria-hidden={this.shouldAriaHide()}
            > */}
            {/* <ActionsBarContainer updateArrScreen={()=>{
                console.log('==================?>>>>>??>>?>>??')
                console.log(this.state.isUpdate)
                console.log('==================?>>>>>??>>?>>??')
                this.setState({
                  isUpdate:!this.state.isUpdate
                },()=>{
                  console.log('=========?>>>UPDAGTE>>??>>?>',this.state.isUpdate)
                })
              }} /> */}
            {/* <ActionsBarContainer getScreenValue={(screen_value, screen_for)=>{
                console.log('==================?>>>>>??>>?>>??')
                console.log(this.state.screen_value)
                console.log('==================?>>>>>??>>?>>??')
                this.setState({
                  screen_value: screen_value,
                  screen_for: screen_for
                },()=>{
                  console.log('=========?>>>UPDAGTE>>??>>?>',this.state.screen_value)
                })
              }} />              
            </section> */}


            {/* {this.renderActionsBar()} */}
          </div>
          {/* {this.renderPanel()} */}
          {this.renderSideNavBar()}
          {this.renderSidebar()}
        </section>
        <BreakoutRoomInvitation />
        <PollingContainer />
        <ModalContainer />
        <AudioContainer />
        <ToastContainer rtl />
        <ChatAlertContainer />
        <WaitingNotifierContainer />
        <LockNotifier />
        <PingPongContainer />
        <ManyWebcamsNotifier />
        {customStyleUrl ? <link rel="stylesheet" type="text/css" href={customStyleUrl} /> : null}
        {customStyle ? <link rel="stylesheet" type="text/css" href={`data:text/css;charset=UTF-8,${encodeURIComponent(customStyle)}`} /> : null}
      </main>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default injectIntl(App);
