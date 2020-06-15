import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withModalMounter } from '/imports/ui/components/modal/service';
import ExternalWebsiteModal from './component';
import { startWatching, getVideoUrl } from '../service';

const ExternalWebsiteModalContainer = props => <ExternalWebsiteModal {...props} />;

export default withModalMounter(withTracker(({ mountModal }) => ({
  closeModal: () => {
    mountModal(null);
  },
  startWatching,
  videoUrl: getVideoUrl(),
}))(ExternalWebsiteModalContainer));
