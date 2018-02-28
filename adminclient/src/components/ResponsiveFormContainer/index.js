import React, { Component, PropTypes, } from 'react';
import { getRenderedComponent, } from '../AppLayoutMap';
import ResponsiveForm from '../ResponsiveForm';

const propTypes = {
  form: PropTypes.object,
  renderFormElements: PropTypes.object,
  validations: PropTypes.object,
};

const defaultProps = {
  form: {},
  validations: {},
  renderFormElements: {},
};

class ResponsiveFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updateFormLayout = this.updateFormLayout.bind(this);
    this.updateFormGroup = this.updateFormGroup.bind(this);
    this.updateValidations = this.updateValidations.bind(this);
    this.updateDoubleCardFormGroup = this.updateDoubleCardFormGroup.bind(this);
  }

  componentWillMount() {
    this.formgroups = this.props.formgroups.slice();
    this.props.form.formgroups = this.props.formgroups.slice();
    this.props.form.validations = this.updateValidations();
  }

  updateFormGroup(options) {
    let { formgroup, prevState, currState } = options;
    let formElementsQueue = [];
    formElementsQueue.push(...formgroup.formElements.slice());
    formgroup.formElements = [];
    while (formElementsQueue.length > 0) {
      let currentElement = formElementsQueue.shift();
      if (currentElement.name && this.props.renderFormElements[ currentElement.name ]) {
        currentElement = window[ this.props.renderFormElements[ currentElement.name ].replace('func:window.', '') ].call(this, currState, formElementsQueue, currentElement, prevState);
        if(currentElement) formgroup.formElements.push(currentElement);
      } else {
        formgroup.formElements.push(currentElement);
      }
    }
    return formgroup;
  }

  updateDoubleCardFormGroup(options) {
    let { formgroup, prevState, currState, prop, order} = options;
    let formElementsQueue = [];
    formElementsQueue.push(...formgroup.formElements[ 0 ][ prop ].slice());
    formgroup.formElements[ 0 ][ prop ] = (order.length) ? order.map(el => false) : [];
    while (formElementsQueue.length > 0) {
      let currentElement = formElementsQueue.shift();
      if (currentElement.name && this.props.renderFormElements[ currentElement.name ]) {
        currentElement = window[ this.props.renderFormElements[ currentElement.name ].replace('func:window.', '') ].call(this, currState, formElementsQueue, currentElement, prevState);
        if (currentElement) {
          if (order.length) formgroup.formElements[ 0 ][ prop ][ order.indexOf(currentElement.name) ] = currentElement;
          else formgroup.formElements[ 0 ][ prop ].push(currentElement);
        }
      } else {
        if (order.length) formgroup.formElements[ 0 ][ prop ][ order.indexOf(currentElement.name) ] = currentElement;
        else formgroup.formElements[ 0 ][ prop ].push(currentElement);
      }
    }
    formgroup.formElements[ 0 ][ prop ]= formgroup.formElements[ 0 ][ prop ].filter(el => el !== false);
    return formgroup;
  }

  updateValidations(options) {
    let formElements = [];
    this.props.form.formgroups.forEach(formgroup => {
      if ((formgroup.formElements[ 0 ].formGroupCardLeft && formgroup.formElements[ 0 ].formGroupCardRight)) {
        formElements.push(...formgroup.formElements[0].formGroupCardLeft);
        formElements.push(...formgroup.formElements[0].formGroupCardRight);
      } else if ((formgroup.formElements[ 0 ].formGroupElementsLeft && formgroup.formElements[ 0 ].formGroupElementsRight)) {
        formElements.push(...formgroup.formElements[0].formGroupElementsLeft);
        formElements.push(...formgroup.formElements[0].formGroupElementsRight);
      } else if (formgroup.formElements) {
        formElements.push(...formgroup.formElements);
      }
    });
    let validations = formElements.reduce((valArr, formElement) => { 
      if (formElement.name && this.props.validations[ formElement.name ]) valArr.push(this.props.validations[ formElement.name ]);
      return valArr;
    }, []);
    return validations;
  }

  updateFormLayout(prevState, currState) {
    this.props.form.formgroups = this.props.form.formgroups.map(formgroup => {
      if ((formgroup.formElements[0].formGroupCardLeft && formgroup.formElements[0].formGroupCardRight)) {
        formgroup = this.updateDoubleCardFormGroup({ formgroup, prevState, currState, prop: 'formGroupCardLeft', order: formgroup.formElements[0].leftOrder });
        formgroup = this.updateDoubleCardFormGroup({ formgroup, prevState, currState, prop: 'formGroupCardRight', order: formgroup.formElements[0].rightOrder });
        return formgroup;
      } else if ((formgroup.formElements[0].formGroupElementsLeft && formgroup.formElements[0].formGroupElementsRight)) {
        formgroup = this.updateDoubleCardFormGroup({ formgroup, prevState, currState, prop: 'formGroupElementsLeft', order: formgroup.formElements[0].leftOrder });
        formgroup = this.updateDoubleCardFormGroup({ formgroup, prevState, currState, prop: 'formGroupElementsRight', order: formgroup.formElements[0].rightOrder });
        return formgroup;
      } else if (formgroup.formElements) {
        return this.updateFormGroup({formgroup, prevState, currState });
      } else {
        return formgroup;
      }
    });
    let validations = this.updateValidations();
    return { validations };
  }

  render() {
    let validations = this.updateValidations();
    let passedProps = Object.assign({}, this.props, this.props.form, { validations });
    return (<div><ResponsiveForm updateFormLayout={this.updateFormLayout}
      {...passedProps} hasContainer={true} />{this.props.children}</div>)
  }
}

ResponsiveFormContainer.propTypes = propTypes;
ResponsiveFormContainer.defaultProps = defaultProps;

export default ResponsiveFormContainer;