import RedisPubSub from '/imports/startup/server/redis';
import handleSlideResizeSplit from './handlers/slideResize';
import handleSlideChangeSplit from './handlers/slideChange';

RedisPubSub.on('ResizeAndMovePageEvtMsg', handleSlideResizeSplit);
RedisPubSub.on('SetCurrentPageEvtMsg', handleSlideChangeSplit);
