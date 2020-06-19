import RedisPubSub from '/imports/startup/server/redis';
import { processForHTML5ServerOnly } from '/imports/api/common/server/helpers';
import handleGetWhiteboardAccessSplit from './handlers/modifyWhiteboardAccess';

RedisPubSub.on('GetWhiteboardAccessRespMsg', processForHTML5ServerOnly(handleGetWhiteboardAccessSplit));
RedisPubSub.on('SyncGetWhiteboardAccessRespMsg', handleGetWhiteboardAccessSplit);
RedisPubSub.on('ModifyWhiteboardAccessEvtMsg', handleGetWhiteboardAccessSplit);
