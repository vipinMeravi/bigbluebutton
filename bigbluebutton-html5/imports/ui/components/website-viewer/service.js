import ReactPlayer from 'react-player';
import Meetings from '/imports/api/meetings';
import Auth from '/imports/ui/services/auth';

const isUrlValid = url => ReactPlayer.canPlay(url);

const startWatching = (url, isSite) => {
    const externalWebsiteUrl = url;
    makeCall('startWatchingExternalWebsite', { externalWebsiteUrl, isSite });
};

const getWebsiteUrl = () => {
    const meetingId = Auth.meetingID;
    const meeting = Meetings.findOne({ meetingId }, { fields: { externalWebsiteUrl: 1 } });
    let video_response = Meetings.find({ meetingId }, { fields: { externalWebsiteUrl: 1 } });
    console.log("============== Get Video Url ============")
    console.log(video_response);
    console.log("============== Get Video Url ============")
    return meeting && meeting.externalWebsiteUrl;
  };

const stopWatching = () => {
    makeCall('stopWatchingExternalWebsite');
};

export {
    getWebsiteUrl,
    isUrlValid,
    startWatching,
    stopWatching
  };