import { check } from 'meteor/check';
import Screen from '/imports/api/screen';
import Logger from '/imports/startup/server/logger';

export default function addScreen(meetingId, screenValue, screenFor, isActive) {
    check(meetingId, String);
    check(screenValue, String);
    check(screenFor, String);
    check(isActive, Boolean);

    const selector = {
        meetingId,
        screenValue,
    };

    const modifier = {
        meetingId,
        screenValue,
        screenFor,
        isActive,
    };

    const cb = (err, numChanged) => {
        if (err) {
            return Logger.error(`Adding Screen to Collection Error: ${err}`);
        }

        const { insertedId } = numChanged;
        if (insertedId) {
            return Logger.verbose(`Added Screen Value=${screenValue} meeting=${meetingId}`);
        }
        return Logger.verbose(`Upserted Screen Value=${screenValue} meeting=${meetingId}`);
    };

    return Screen.upsert(selector, modifier, cb);
}