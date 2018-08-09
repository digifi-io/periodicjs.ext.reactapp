import React, { Component, PropTypes } from 'react';
import { getRenderedComponent, } from '../AppLayoutMap';
import styles from '../../styles';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const propTypes = {
  getFileData: PropTypes.func,
  getCropperBoxData: PropTypes.func
};

const defaultProps = {
};

class ResponsiveCropper extends Component {
  constructor(props) {
    super(props);
    this.getRenderedComponent = getRenderedComponent.bind(this);
    this.state = {
      src: null,
      cropbox: {
        left: 0,
        top: 0,
        width: 100,
        height: 100,
      }
    }
  }

  onSelectFile(e) {
    const self = this;
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      let files = e.target;
      reader.addEventListener(
        'load',
        () =>
        self.setState({
            src: reader.result,
          }, () => {
            if (self.props.getFileData) {
              self.props.getFileData(files)
            }
          }),
        false
      )
      reader.readAsDataURL(e.target.files[ 0 ])
    }
  }

  onCropComplete (e) {
    const self = this;
    let boxData = self.refs.cropper.getCropBoxData();
    if (self.props.getCropperBoxData) {
      self.props.getCropperBoxData(boxData);
    }
    this.setState({
      cropbox: {
        left: boxData.left,
        top: boxData.top,
        width: boxData.width,
        height: boxData.height,
      }
    }, () => {
      self.refs.cropper.setCropBoxData(boxData);
    })
  }

  render() {
    const self = this;
    let onCropEnd = self.onCropComplete.bind(self);
    let onFileSelect = self.onSelectFile.bind(self);
    return (
      <div style={{ height: 'auto', width: 'auto' }}>
        <div>
          <input type="file" onChange={onFileSelect} {...self.props.fileInputProps} />
        </div>
        {this.state.src && (
          <Cropper
            src={this.state.src}
            ref='cropper'
            style={{ height: 'auto', width: 'auto' }}
            aspectRatio={NaN}
            cropend={onCropEnd}
          />
        )}
      </div>
    )
  }
}

ResponsiveCropper.propTypes = propTypes;
ResponsiveCropper.defaultProps = defaultProps;

export default ResponsiveCropper;
