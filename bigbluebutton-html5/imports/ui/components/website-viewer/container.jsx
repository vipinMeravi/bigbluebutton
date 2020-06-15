import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
// import { Session } from 'meteor/session';
import { getVideoUrl } from './service';
import { isUrlValid } from './service';

import WebsiteView from './component';

const WebsiteViewerContainer = props => (
  <WebsiteView {...{ ...props }} />
);

export default withTracker(({ isPresenter }) => {
    // const inEchoTest = Session.get('inEchoTest');
    return {
    //   inEchoTest,
      isPresenter,
      videoUrl: getVideoUrl(),
      isUrlValid : isUrlValid(getVideoUrl())
    };
  })(WebsiteViewerContainer);