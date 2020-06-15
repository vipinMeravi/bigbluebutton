import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { getWebsiteUrl } from './service';
import { isUrlValid } from './service';

import WebsiteView from './component';

const WebsiteViewerContainer = props => (
  <WebsiteView {...{ ...props }} />
);

export default withTracker(({ isPresenter }) => {
    const inEchoTest = Session.get('inEchoTest');
    return {
      inEchoTest,
      isPresenter,
      videoUrl: getWebsiteUrl(),
      isUrlValid : isUrlValid(getWebsiteUrl())
    };
  })(WebsiteViewerContainer);