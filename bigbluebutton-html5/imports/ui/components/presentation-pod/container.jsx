import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorBoundary from '/imports/ui/components/error-boundary/component';
import FallbackPresentation from '/imports/ui/components/fallback-errors/fallback-presentation/component';
import PresentationPodService from './service';
import PresentationPods from './component';

// PresentationPods component will be the place to go once we have the presentation pods designs
// it should give each PresentationAreaContainer some space
// which it will fill with the uploaded presentation
const PresentationPodsContainer = ({ presentationPodIds,presentationsPodIds, ...props }) => {
  console.log("=========Presentation Pod Container propes==========")
  console.log(presentationPodIds);
  console.log(presentationsPodIds);
  console.log({...props});
  console.log("=========Presentation Pod Container propes==========")
  if (presentationPodIds && presentationPodIds.length > 0) {
    if(props.screen_value == "fullscreen"){
      return (
        <ErrorBoundary Fallback={FallbackPresentation}>
          <PresentationPods presentationPodIds={presentationPodIds} {...props} />
        </ErrorBoundary>
      );
    } else if (props.screen_value == "screen_one"){
      return (
        <ErrorBoundary Fallback={FallbackPresentation}>
          <PresentationPods presentationPodIds={presentationPodIds} {...props} />
        </ErrorBoundary>
      );
    } else if (props.screen_value == "screen_two"){
      let presentation_pod_ids = [];
      let temp_obj = {
        podId: presentationsPodIds[1].podId,
        _id: presentationsPodIds[1]._id,
      }
      presentation_pod_ids.push(temp_obj) 
      console.log("=======<< Screen Two Presentation >>=======");
      console.log(presentation_pod_ids);
      console.log("=======<< Screen Two Presentation >>=======");
      return (
        <ErrorBoundary Fallback={FallbackPresentation}>
          <PresentationPods presentationPodIds={presentation_pod_ids} {...props} />
        </ErrorBoundary>
      );
    }

  }

  return null;
};

export default withTracker(() => ({
  presentationPodIds: PresentationPodService.getPresentationPodIds(),
  presentationsPodIds: PresentationPodService.getPresentationsPodIds()
}))(PresentationPodsContainer);

PresentationPodsContainer.propTypes = {
  presentationPodIds: PropTypes.arrayOf(PropTypes.shape({
    podId: PropTypes.string.isRequired,
  })).isRequired,
};
