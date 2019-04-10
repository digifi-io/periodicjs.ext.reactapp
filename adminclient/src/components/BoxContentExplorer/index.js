import React, { Component, PropTypes, } from 'react';
import ContentExplorer from 'box-ui-elements/es/elements/content-explorer';
import messages from 'box-ui-elements/i18n/en-US';
import { getRenderedComponent, } from '../AppLayoutMap';

const propTypes = {
  // example props for the demo
  // autoFocus: PropTypes.bool,
};

const defaultProps = {

};
function getToken() {
  this.props.token = 'abc123';
}

class BoxContentExplorer extends Component {
  constructor(props) {
    super(props);
    this.getToken = getToken.bind(this);
  }
  render() {
    return (
      <div>
        <ContentExplorer
          language='en-US'
          messages={messages}
          token={this.getToken()}
          contentPreviewProps={{
              contentSidebarProps: {
                  hasActivityFeed: true,
                  hasSkills: true,
                  hasMetadata: true,
                  detailsSidebarProps: {
                      hasProperties: true,
                      hasNotices: true,
                      hasAccessStats: true,
                      hasVersions: true,
                  },
              },
          }}
      />
      </div>
    );
  }
}

BoxContentExplorer.propTypes = propTypes;
BoxContentExplorer.defaultProps = defaultProps;

export default BoxContentExplorer;