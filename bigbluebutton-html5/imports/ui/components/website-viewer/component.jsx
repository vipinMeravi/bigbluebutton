import React, { Component } from 'react';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';


class WebsiteView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { websiteUrl } = this.props;
        console.log("---------- Final Destination iFrame -------", this.props);
        return (
        <div class="resp-container" >
            <iframe width="630" height="410" src={websiteUrl} />
        </div>
        )
    }
}

export default WebsiteView;