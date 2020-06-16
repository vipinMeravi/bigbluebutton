import ReactPlayer from 'react-player';
import Meetings from '/imports/api/meetings';
import Auth from '/imports/ui/services/auth';
import { makeCall } from '/imports/ui/services/api';

const isUrlValid = url => ReactPlayer.canPlay(url);

const startWatchingSite = (url, isSite) => {
    const externalWebsiteUrl = url;
    
    console.log("Start Watching External website", externalWebsiteUrl);
    makeCall('startWatchingExternalWebsite', { externalWebsiteUrl, isSite });
};

const getWebsiteUrl = () => {
    const meetingId = Auth.meetingID;
    const meeting = Meetings.findOne({ meetingId }, { fields: { externalWebsiteUrl: 1 } });
    let video_response = Meetings.find({ meetingId }, { fields: { externalWebsiteUrl: 1 } });
    console.log("============== Get Website Url ============")
    console.log(video_response);
    console.log(meeting.externalWebsiteUrl);
    console.log("============== Get Website Url ============")
    return meeting && meeting.externalWebsiteUrl;
  };

const stopWatching = () => {
    makeCall('stopWatchingExternalWebsite');
};

export {
    getWebsiteUrl,
    isUrlValid,
    startWatchingSite,
    stopWatching
  };