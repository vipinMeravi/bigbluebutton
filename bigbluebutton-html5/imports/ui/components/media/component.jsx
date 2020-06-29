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
      screen_value,
      onScreenOne,
      onScreenTwo,
      onFullscreen
    } = this.props;

    const contentClassName = cx({
      [styles.content]: true,
    });

    const overlayClassName = cx({
      [styles.overlay]: true,
      [styles.hideOverlay]: hideOverlay,
      [styles.floatingOverlay]: (webcamPlacement === 'floating'),
    });

    let isDocumentOne, isDocumentTwo = false;
    if(onFullscreen.screen_for == 'document' || onScreenOne.screen_for == 'document'){
      isDocumentOne = true;
    } else {
      isDocumentOne = false;
    }
    if(onScreenTwo.screen_for == 'document'){
      isDocumentTwo = true;
    } else {
      isDocumentTwo = false;
    }

    console.log("===============Swap layout==================")
    console.log('isDocument isDocumentOne : ', isDocumentOne);
    console.log('isDocument isDocumentTwo : ', isDocumentTwo);
    console.log("===============Swap layout==================")

    return (
      <div
        id="container"
        className={cx(styles.container)}
        ref={this.refContainer}
      >

        <div
          className={swapLayout && isDocumentOne ? overlayClassName :  contentClassName}
          style={{
            maxHeight: usersVideo.length < 1 || (webcamPlacement === 'floating') ? '100%' : '80%',
            minHeight: '20%', border: '2px dashed', 'border-radius': '10px', 'border-color': 'white',
          }}
        >
          {children}
        </div>
        {children_split ?
          <div
            className={swapLayout && isDocumentTwo ? overlayClassName :  contentClassName}
            style={{
              maxHeight: usersVideo.length < 1 || (webcamPlacement === 'floating') ? '100%' : '80%',
              minHeight: '20%', border: '2px dashed', 'border-radius': '10px', 'border-color': 'white'
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
