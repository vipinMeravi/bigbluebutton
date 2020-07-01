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
        <div class="resp-container" style={{
            width: '200%',
            height: '200%',
            transform: 'scale(.5)',
        }}>
            <iframe style={{
                width: '96vw',
                height: '160vh'
            }} src={websiteUrl} />
        </div>
        )
    }
}

export default WebsiteView;