import React, { Component } from 'react';
import { withModalMounter } from '/imports/ui/components/modal/service';
import Modal from '/imports/ui/components/modal/simple/component';
import Button from '/imports/ui/components/button/component';

import { defineMessages, injectIntl } from 'react-intl';
import { isUrlValid } from '../service';

import { styles } from './styles';

const intlMessages = defineMessages({
  start: {
    id: 'app.externalVideo.start',
    description: 'Share external video',
  },
  urlError: {
    id: 'app.externalVideo.urlError',
    description: 'Not a video URL error',
  },
  input: {
    id: 'app.externalVideo.input',
    description: 'Video URL',
  },
  urlInput: {
    id: 'app.externalVideo.urlInput',
    description: 'URL input field placeholder',
  },
  title: {
    id: 'app.externalVideo.title',
    description: 'Modal title',
  },
  close: {
    id: 'app.externalVideo.close',
    description: 'Close',
  },
  note: {
    id: 'app.externalVideo.noteLabel',
    description: 'provides hint about Shared External videos',
  },
});

class ExternalVideoModal extends Component {
  constructor(props) {
    super(props);

    const { videoUrl, screenType } = props;

    this.state = {
      url: videoUrl,
      sharing: videoUrl,
      screen: screenType,
    };

    this.startWatchingHandler = this.startWatchingHandler.bind(this);
    this.updateVideoUrlHandler = this.updateVideoUrlHandler.bind(this);
    this.renderUrlError = this.renderUrlError.bind(this);
    this.updateScreenChangeHandler = this.updateScreenChangeHandler.bind(this);
  }

  startWatchingHandler() {
    const {
      startWatching,
      closeModal,
    } = this.props;

    const { url, screen } = this.state;
    
    console.log("-------------------- start watching handler", this.props.isSite)
    startWatching(url.trim(), this.props.isSite);
    closeModal();
  }

  updateVideoUrlHandler(ev) {
    console.log("------------> ev url values ----------->", ev.target.value);
    this.setState({ url: ev.target.value });
  }

  updateScreenChangeHandler(ev) {
    this.setState({ screen: ev.target.value });
    console.log("------------> ev values ----------->", ev.target.value);
  }

  renderUrlError() {
    const { intl } = this.props;
    const { url } = this.state;

    const valid = (!url || url.length <= 3) || isUrlValid(url);

    return (
      !valid && !this.props.isSite
        ? (
          <div className={styles.urlError}>
            {intl.formatMessage(intlMessages.urlError)}
          </div>
        )
        : null
    );
  }

  render() {
    const { intl, closeModal } = this.props;
    const { url, sharing, screen } = this.state;
    console.log("-------------------- Inside modal render props ----------------- ", this.props);
    console.log("-------------------- Inside modal render state ----------------- ", this.state);
    const startDisabled = !isUrlValid(url);

    return (
      <Modal
        overlayClassName={styles.overlay}
        className={styles.modal}
        onRequestClose={closeModal}
        contentLabel={intl.formatMessage(intlMessages.title)}
        hideBorder
      >
        <header data-test="videoModealHeader" className={styles.header}>
          <h3 className={styles.title}>{this.props.isSite ? "Share a Web-Site" :intl.formatMessage(intlMessages.title)}</h3>
        </header>

        <div className={styles.content}>
          <div className={styles.videoUrl}>
            <label htmlFor="video-modal-input" id="video-modal-input">
              {this.props.isSite ? "Web-Site URL" :intl.formatMessage(intlMessages.input)}
              <input
                id="video-modal-input"
                onChange={this.updateVideoUrlHandler}
                name="video-modal-input"
                placeholder={this.props.isSite ? "Add Web-Site URL" :intl.formatMessage(intlMessages.urlInput)}
                disabled={sharing}
                aria-describedby="exernal-video-note"
              />
            </label>
            
            <div className={styles.externalVideoNote} id="external-video-note">
              {this.props.isSite ? null :intl.formatMessage(intlMessages.note)}
            </div>
          </div>
            <label htmlFor="vide-screen-full-modal-input" id="vide-screen-full-modal-input">
              {"FullScreen"}
              <input
                // id="vide-screen-full-modal-input"
                type="radio"
                onChange={this.updateScreenChangeHandler}
                value="fullscreen"
                name="vide-screen-modal-input"
                checked={this.state.screen === 'fullscreen'}
                // placeholder={this.props.isSite ? "Add Web-Site URL" :intl.formatMessage(intlMessages.urlInput)}
                // disabled={sharing}
                aria-describedby="exernal-video-note"
              />
            </label>
            <label htmlFor="vide-screen-one-modal-input" id="vide-screen-one-modal-input">
              {"Screen One"}
              <input
                id="vide-screen-one-modal-input"
                type="radio"
                onChange={this.updateScreenChangeHandler}
                value="screen_one"
                name="vide-screen-modal-input"
                checked={this.state.screen === 'screen_one'}
                // placeholder={this.props.isSite ? "Add Web-Site URL" :intl.formatMessage(intlMessages.urlInput)}
                // disabled={sharing}
                aria-describedby="exernal-video-note"
              />
            </label>
            <label htmlFor="vide-screen-two-modal-input" id="vide-screen-two-modal-input">
              {"Screen Two"}
              <input
                id="vide-screen-two-modal-input"
                type="radio"
                onChange={this.updateScreenChangeHandler}
                value="screen_two"
                name="vide-screen-modal-input"
                checked={this.state.screen === 'screen_two'}
                // placeholder={this.props.isSite ? "Add Web-Site URL" :intl.formatMessage(intlMessages.urlInput)}
                // disabled={sharing}
                aria-describedby="exernal-video-note"
              />
            </label>
            
            <div class="wrapper">
              <div class="toggle_radio">
                <input type="radio" class="toggle_option" id="first_toggle" name="toggle_option"/>
                <input type="radio" checked class="toggle_option" id="second_toggle" name="toggle_option"/>
                <input type="radio" class="toggle_option" id="third_toggle" name="toggle_option"/>
                <label for="first_toggle">
                  <span class="description">TODAY</span>
                    <p class="day">3 </p>
                  <span class="day-week">Tuesday</span>
                </label>
                <label for="second_toggle">
                  <span class="description">TOMORROW</span>
                    <p class="day">4 </p>
                  <span class="day-week">Wednesday</span>
                </label>
                <label for="third_toggle">
                  <span class="description">DAY AFTER</span>
                    <p class="day">5 </p>
                  <span class="day-week">Thursday</span>
                </label>
              <div class="toggle_option_slider">
              </div>
              </div>
            </div>    

          <div>
            {this.renderUrlError()}
          </div>
        
          <Button
            className={styles.startBtn}
            label={this.props.isSite ? "Share Site" :intl.formatMessage(intlMessages.start)}
            onClick={this.startWatchingHandler}
            disabled={this.props.isSite ? null :startDisabled}
          />
        </div>
      </Modal>
    );
  }
}

export default injectIntl(withModalMounter(ExternalVideoModal));
