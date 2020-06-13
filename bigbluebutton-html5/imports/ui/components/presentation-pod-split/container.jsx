import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorBoundary from '/imports/ui/components/error-boundary/component';
import FallbackPresentation from '/imports/ui/components/fallback-errors/fallback-presentation/component';
import PresentationPodService from './service';
import PresentationSplitPods from './component';

// PresentationPods component will be the place to go once we have the presentation pods designs
// it should give each PresentationAreaContainer some space
// which it will fill with the uploaded presentation
const PresentationPodsSplitContainer = ({ presentationPodIds,presentationsPodIds, ...props }) => {
  console.log("=========Presentation Split Pod Container propes==========")
  console.log(presentationPodIds);
  console.log(presentationsPodIds);
  console.log({...props});
  console.log("=========Presentation Split Pod Container propes==========")
  if (presentationPodIds && presentationPodIds.length > 0) {
  
      return (
        <ErrorBoundary Fallback={FallbackPresentation}>
          <PresentationSplitPods presentationPodIds={presentationPodIds} {...props} />
        </ErrorBoundary>
      );
  }
  return null;
};

export default withTracker(() => ({
  presentationPodIds: PresentationPodService.getPresentationPodIds(),
  presentationsPodIds: PresentationPodService.getPresentationsPodIds()
}))(PresentationPodsSplitContainer);

PresentationPodsSplitContainer.propTypes = {
  presentationPodIds: PropTypes.arrayOf(PropTypes.shape({
    podId: PropTypes.string.isRequired,
  })).isRequired,
};
