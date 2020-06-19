import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PresentationSplitAreaContainer from '../presentation-split/container';

class PresentationSplitPods extends PureComponent {
  render() {
    /*
      filtering/sorting presentation pods goes here
      all the future UI for the pods also goes here
      PresentationAreaContainer should fill any empty box provided by us
    */
   console.log("=========Presentation Pod Split propes==========")
   console.log(this.props);
   console.log("=========Presentation Pod Split propes==========")
   return (
    <PresentationSplitAreaContainer podSplitId="DEFAULT_PRESENTATION_POD_SPLIT" {...this.props} />
  );
  }
}

export default PresentationSplitPods;

PresentationSplitPods.propTypes = {
  presentationPodIds: PropTypes.arrayOf(PropTypes.shape({
    podSplitId: PropTypes.string.isRequired,
  })).isRequired,
};
