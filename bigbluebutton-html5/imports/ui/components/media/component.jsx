import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import WebcamDraggable from './webcam-draggable-overlay/component';

import { styles } from './styles';

const propTypes = {
  children: PropTypes.element.isRequired,
  children_split: PropTypes.element.isRequired,
  usersVideo: PropTypes.arrayOf(Array),
  singleWebcam: PropTypes.bool.isRequired,
  hideOverlay: PropTypes.bool,
  swapLayout: PropTypes.bool,
  disableVideo: PropTypes.bool,
  userWasInWebcam: PropTypes.bool,
  audioModalIsOpen: PropTypes.bool,
  joinVideo: PropTypes.func,
  webcamPlacement: PropTypes.string,
  isUpdate: PropTypes.bool.isRequired,
  screen_value: PropTypes.string.isRequired,
};

const defaultProps = {
  usersVideo: [],
  hideOverlay: true,
  swapLayout: false,
  disableVideo: false,
  userWasInWebcam: false,
  audioModalIsOpen: false,
  joinVideo: null,
  webcamPlacement: 'top',
  screen_value: 'fullscreen'
};


export default class Media extends Component {
  constructor(props) {
    super(props);
    this.refContainer = React.createRef();
  }
  updateMediaSection = () => {
    alert('Media section updated')
  }
  componentWillUpdate() {
    window.dispatchEvent(new Event('resize'));
  }

  componentDidUpdate(prevProps) {
    const {
      userWasInWebcam,
      audioModalIsOpen,
      joinVideo,
    } = this.props;

    const {
      audioModalIsOpen: oldAudioModalIsOpen,
    } = prevProps;

    if ((!audioModalIsOpen && oldAudioModalIsOpen) && userWasInWebcam) {
      Session.set('userWasInWebcam', false);
      joinVideo();
    }
  }
  componentWillReceiveProps() {
    console.log('--------- componentWillReceiveProps componetnt =====>')
    console.log(this.props)
  }

  static getDerivedStateFromProps(prevProps, prevState) {
    console.log({
      prevProps,
      prevState
    })
  }

  render() {
    const {
      swapLayout,
      singleWebcam,
      hideOverlay,
      disableVideo,
      children,
      children_split,
      audioModalIsOpen,
      usersVideo,
      webcamPlacement,
      screen_value
    } = this.props;


    const contentClassName = cx({
      [styles.content]: true,
    });

    const overlayClassName = cx({
      [styles.overlay]: true,
      [styles.hideOverlay]: hideOverlay,
      [styles.floatingOverlay]: (webcamPlacement === 'floating'),
    });

    const containerClassName = cx({
      [styles.container]: true,
      [styles.containerV]: webcamPlacement === 'top' || webcamPlacement === 'bottom' || webcamPlacement === 'floating',
      [styles.containerH]: webcamPlacement === 'left' || webcamPlacement === 'right',
    });
    console.log("================ usersVideo ===============");
    console.log(usersVideo);
    console.log("================ usersVideo ===============");

    return (
      <div
        id="container"
        className={containerClassName}
        ref={this.refContainer}
      >
        <div
          className={!swapLayout ? contentClassName : overlayClassName}
          style={{
            maxHeight: usersVideo.length > 0
            && (
              webcamPlacement !== 'left'
              || webcamPlacement !== 'right'
            )
            && (
              webcamPlacement === 'top'
              || webcamPlacement === 'bottom'
            )
              ? '80%'
              : '100%',
            // minHeight: BROWSER_ISMOBILE && window.innerWidth > window.innerHeight ? '50%' : '20%',
            maxWidth: usersVideo.length > 0
            && (
              webcamPlacement !== 'top'
              || webcamPlacement !== 'bottom'
            )
            && (
              webcamPlacement === 'left'
              || webcamPlacement === 'right'
            )
              ? '80%'
              : '100%',
            minWidth: '20%',
          }}
        >
          {children}
        </div>
        {children_split ?
          <div
            className={!swapLayout ? contentClassName : overlayClassName}
            style={{
              maxHeight: usersVideo.length < 1 || (webcamPlacement === 'floating') ? '100%' : '50%',
              minHeight: '20%', width: "50%",
            }}
          >
            {children_split}
          </div> : null}
        {usersVideo.length > 0 ? (
          <WebcamDraggable
            refMediaContainer={this.refContainer}
            swapLayout={swapLayout}
            singleWebcam={singleWebcam}
            usersVideoLenght={usersVideo.length}
            hideOverlay={hideOverlay}
            disableVideo={disableVideo}
            audioModalIsOpen={audioModalIsOpen}
            usersVideo={usersVideo}
          />
        ) : null}
      </div>
    );
  }
}

Media.propTypes = propTypes;
Media.defaultProps = defaultProps;
