import RedisPubSub from '/imports/startup/server/redis';
import handlePresentationAddedSplit from './handlers/presentationAdded';
import handlePresentationRemoveSplit from './handlers/presentationRemove';
import handlePresentationCurrentSetSplit from './handlers/presentationCurrentSet';
import handlePresentationConversionUpdateSplit from './handlers/presentationConversionUpdate';
import handlePresentationDownloadableSetSplit from './handlers/presentationDownloadableSet';

RedisPubSub.on('PdfConversionInvalidErrorEvtMsg', handlePresentationConversionUpdateSplit);
RedisPubSub.on('PresentationPageGeneratedEvtMsg', handlePresentationConversionUpdateSplit);
RedisPubSub.on('PresentationPageCountErrorEvtMsg', handlePresentationConversionUpdateSplit);
RedisPubSub.on('PresentationConversionUpdateEvtMsg', handlePresentationConversionUpdateSplit);
RedisPubSub.on('PresentationConversionCompletedEvtMsg', handlePresentationAddedSplit);
RedisPubSub.on('RemovePresentationEvtMsg', handlePresentationRemoveSplit);
RedisPubSub.on('SetCurrentPresentationEvtMsg', handlePresentationCurrentSetSplit);
RedisPubSub.on('SetPresentationDownloadableEvtMsg', handlePresentationDownloadableSetSplit);
