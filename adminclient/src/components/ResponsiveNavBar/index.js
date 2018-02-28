import React, { Component, PropTypes } from 'react';
import { Link, } from 'react-router';
import { getRenderedComponent, } from '../AppLayoutMap';
import { Accordion, Menu } from 'semantic-ui-react';

const propTypes = {
  activeLinkStyle: PropTypes.object,
  linkProps: PropTypes.object,
  navData: PropTypes.array,
  navSections: PropTypes.array,
  params: PropTypes.array,
  active: PropTypes.boolean,
};

const defaultProps = {
  activeLinkStyle: {},
  navData: [],
  navSections: [],
  params: [],
  linkProps: {},
};

class ResponsiveNavBar extends Component {
  constructor(props) {
    super(props);
    let navData = props.navData || [];
    let navSections = props.navSections || [];
    let params = props.params || [];
    let linkProps = props.linkProps || {};
    this.state = {
      initialActiveIndex: -1,
      activeIndex: this.props.navSections.map((section, idx) => {
      if (this.props.navData[idx]) {
        this.props.navData[idx].map((link, linkIdx) => {
          let linkURL = this.getBaseUrl(section.baseURL, this.props.params, this.props, linkIdx);
          link.linkURL = linkURL;
        })
        return idx;
      }
    }),
    };
    this.handleClick = this.handleClick.bind(this);
    this.getBaseUrl = this.getBaseUrl.bind(this);
    this.getRenderedComponent = getRenderedComponent.bind(this);
  } 

  componentWillMount() {
  }

  getBaseUrl(baseurl, params, prop, index) {
    let returnLink = baseurl;
    if (params && params.length > 0) {
      params.forEach((param) => {
        if (param.key === ":index") {
          returnLink = returnLink.replace(":index", index);
        } else {
          returnLink = returnLink.replace(param.key, prop[ param.val ]);
        }
      });
    }
    return returnLink
  }
  handleClick(e, titleProps) {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    if (activeIndex.indexOf(index) === -1) {
      this.setState({ 
        activeIndex: [...activeIndex, index] 
      });
    } else {
      let newIndexArray = activeIndex;
      newIndexArray.splice(newIndexArray.indexOf(index), 1);
      this.setState({
        activeIndex: newIndexArray,
      });
    }
  }



  render() {
  const { activeIndex } = this.state;
   let navMenu = this.props.navSections.map((section, idx)=> {
    if (!this.props.toggleData[section.toggle]) { return; }
    
    let subMenu = this.props.navData[idx].map((link, linkIdx) => {
      let itemProps = (this.props.linkProps && this.props.linkProps.className) ? this.props.linkProps.className : '';
      let activeClass = (link.linkURL === this.props.location.pathname) 
        ? 'active-nav-link nav-link' + itemProps
        : 'nav-link' + itemProps;
      return (
        <div 
          {...this.props.itemProps}
          key={idx + '-' + linkIdx}
          className={activeClass} >
          <Link 
              to={link.linkURL}
              {...this.props.linkProps}
              >
            {link.name}
          </Link>
          {(section.buttons) ? section.buttons.map(button => {
              return this.getRenderedComponent(Object.assign({
                component: 'ResponsiveButton',
                props: Object.assign({
                  buttonProps: {},
                }, button.passProps, 
                {
                  onclickProps: this.getBaseUrl(button.passProps.onclickBaseUrl, button.passProps.onclickLinkParams, this.props, linkIdx),
                  onclickBaseUrl: null,
                  onclickLinkParams: null,
                }
              ),
              }))
            }) : null }
        </div>
        )
      });

     return (
        <Menu.Item {...this.props.sectionProps}>
          <Accordion.Title  
            active={activeIndex.indexOf(idx) !== -1} 
            index={idx} onClick={this.handleClick} 
            content={section.title} 
            {...this.props.titleProps}>
          </Accordion.Title>
          <Accordion.Content 
            active={activeIndex.indexOf(idx) !== -1}
            {...this.props.contentProps}>
            {subMenu}
          </Accordion.Content>
        </Menu.Item>
     )
    })
    return (
      <Accordion 
        as={Menu} 
        vertical
        {...this.props.accordionProps}
        >
       {navMenu}
      </Accordion>
    );
  }
}

ResponsiveNavBar.propType = propTypes;
ResponsiveNavBar.defaultProps = defaultProps;

export default ResponsiveNavBar;