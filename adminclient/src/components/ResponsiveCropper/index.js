import React, { Component, PropTypes } from 'react';
import { getRenderedComponent, } from '../AppLayoutMap';
import styles from '../../styles';
import Cropper from 'react-cropper';


const propTypes = {
  getFileData: PropTypes.func,
  getCropperBoxData: PropTypes.func
};

const defaultProps = {
  cropbox: {
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  },

};

class ResponsiveCropper extends Component {
  constructor(props) {
    super(props);
    this.getRenderedComponent = getRenderedComponent.bind(this);
    this.state = {
      src: props.src || null,
      // cropbox: props.cropbox || {},
      cropbox: props.cropperProps.data || {},
      scaledcropbox: {
        left: props.cropperProps.data.x,
        top: props.cropperProps.data.y,
        width: props.cropperProps.data.width,
        height: props.cropperProps.data.height,
      } || {},
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

  onCropComplete(e) {
    const self = this;
    let boxData = self.refs.cropper.getCropBoxData();
    let imageData = self.refs.cropper.getImageData();
    let canvasData = self.refs.cropper.getCanvasData();
    let ratio = imageData.naturalHeight / imageData.height;
    let scaledBoxData = Object.assign({}, boxData, {
      height: boxData.height * ratio,
      width: boxData.width * ratio,
      left: (boxData.left - canvasData.left) * ratio,
      top: (boxData.top - canvasData.top) * ratio,
    })
    if (self.props.getCropperBoxData) {
      self.props.getCropperBoxData(scaledBoxData);
    }
    this.setState({
      cropbox: {
        left: boxData.left,
        top: boxData.top,
        width: boxData.width,
        height: boxData.height,
      },
      scaledcropbox: scaledBoxData,
    }, () => {
      self.refs.cropper.setCropBoxData(boxData);
    })
  }

  render() {
    const self = this;
    let onCropEnd = self.onCropComplete.bind(self);
    let onFileSelect = self.onSelectFile.bind(self);
    let fileInput = self.props.includeFileInput ? (<div>
      <input type="file" onChange={onFileSelect} {...self.props.fileInputProps} />
    </div>) : null;
    let cropperProps = self.props.cropperProps || {};
    let formatted_data = {x: this.state.scaledcropbox.left, y: this.state.scaledcropbox.top, width:  this.state.scaledcropbox.width, height:  this.state.scaledcropbox.height}
    return (
      <div style={{ height: 'auto', width: 'auto' }}>
        {fileInput}
        {this.state.src && (
          <Cropper
            {...cropperProps}
            data={formatted_data}
            src={this.state.src}
            ref='cropper'
            aspectRatio={cropperProps.aspectRatio || NaN}
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
