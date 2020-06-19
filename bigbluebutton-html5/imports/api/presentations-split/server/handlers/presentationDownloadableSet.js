import { check } from 'meteor/check';
import setPresentationDownloadable from '../modifiers/setPresentationDownloadable';

export default function handlePresentationDownloadableSet({ body }, meetingId) {
  check(body, Object);
  console.log("=============>> handlePresentationDownloadableSet <<===========", body);
  const { presentationId, podSplitId, downloadable } = body;

  check(meetingId, String);
  check(presentationId, String);
  check(podSplitId, String);
  check(downloadable, Boolean);

  return setPresentationDownloadable(meetingId, podSplitId, presentationId, downloadable);
}
