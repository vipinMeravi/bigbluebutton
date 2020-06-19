import RedisPubSub from '/imports/startup/server/redis';
import handleCreateNewPresentationPodSplit from './handlers/createNewPresentationPod';
import handleRemovePresentationPodSplit from './handlers/removePresentationPod';
import handleSyncGetPresentationPodsSplit from './handlers/syncGetPresentationPods';
import handleSetPresenterInPodSplit from './handlers/setPresenterInPod';

RedisPubSub.on('CreateNewPresentationPodEvtMsg', handleCreateNewPresentationPodSplit);
RedisPubSub.on('RemovePresentationPodEvtMsg', handleRemovePresentationPodSplit);
RedisPubSub.on('SetPresenterInPodRespMsg', handleSetPresenterInPodSplit);
RedisPubSub.on('SyncGetPresentationPodsRespMsg', handleSyncGetPresentationPodsSplit);
