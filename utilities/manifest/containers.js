'use strict';

// const DICTIONARY = require('../dictionary');
const capitalize = require('capitalize');
const pluralize = require('pluralize');
const contenttabs = require('./components/contenttabs');
const indextable = require('./components/indextable');
const buildDetail = require('./components/build_detail');
const buildAdvancedDetail = require('./components/build_advanced_detail');
const helpers = require('./helpers');
// pluralize.addIrregularRule('data', 'datas');

/**
 * This constructs a mongo schema detail page
 *
 * @param {*} schema 
 * @param {*} label 
 * @param {*} options 
 */
const constructDetail = function(options) {
  const { newEntity, schemaName, } = options;
  let dataRoutePrefix = helpers.getDataRoute(options);
  let manifestPrefix = helpers.getManifestPathPrefix(options.adminRoute);
  let customPageData = false;
  // let customPageData = helpers.getExtensionOverride('customDetailPageData', schema, label, options);
  let customTabs = false;
  // let customTabs = helpers.getExtensionOverride('customDetailTabs', schema, label, options);
  let customHeader = false;
  // let customHeader = helpers.getExtensionOverride('customDetailHeader', schema, label, options);
  let customDetailEditor = false;
  // let customDetailEditor = helpers.getExtensionOverride('customDetailEditor', schema, label, options);
  let detailPageBasicEditor = {
    name: 'Basic Editor',
    layout: {
      component: 'div',
      children: buildDetail(options),
    },
  };
  let detailPageAdvancedEditor = {
    name: 'Advanced Editor',
    layout: {
      component: 'div',
      children: buildAdvancedDetail(options),
    },
  };
  let detailPageTabs = [];
  // if (customDetailEditor) {
  //   if (customDetailEditor.base) {
  //     detailPageTabs.push(detailPageBasicEditor);
  //   }
  //   if (customDetailEditor.advanced) {
  //     detailPageTabs.push(detailPageAdvancedEditor);
  //   }
  //   if (customDetailEditor.customTabs) {
  //     detailPageTabs.push(...customDetailEditor.customTabs);
  //   }
  //   if (customDetailEditor.customTab) {
  //     detailPageTabs.push(customDetailEditor.customTabs);
  //   }
  // } else {
  detailPageTabs.push(detailPageBasicEditor, detailPageAdvancedEditor);
  // }

  return {
    resources: (newEntity) ? {} : {
      [helpers.getDetailLabel(schemaName)]: `${dataRoutePrefix}/:id?format=json`,

    },
    onFinish: 'render',
    pageData: (customPageData) ?
      customPageData : {
        title: `Content › ${pluralize(capitalize(schemaName))}`,
        navLabel: `Content › ${pluralize(capitalize(schemaName))}`,
      },
    layout: {
      component: 'div',
      props: {
        style: {
          marginTop: 80,
          marginBottom: 80,
          paddingBottom: 80,
        },
      },
      children: [
        customHeader,
        (customTabs) ? customTabs : contenttabs(options),

        {
          component: 'Container',
          props: {},
          children: [{
            component: 'ResponsiveTabs',
            asyncprops: {
              formdata: [helpers.getDetailLabel(schemaName), 'data'],
            },
            props: {
              tabsType: 'navBar',
              tabsProps: {
                style: {
                  border: 'none',
                  fontSize: 14,
                },
              },
              tabgroupProps: {
                style: {
                  border: 'none',
                  fontSize: 14,
                },
                className: '__ra_no_border',
              },
              tabs: detailPageTabs,
            },
            // children:'',
          }, ],
          // .concat(buildDetail(schema, label, options)),
        },
        // {
        //   component: 'RawStateOutput',
        //   // component: 'RawStateOutput',
        //   props: {
        //     select: 'SOMEFORMDATA',
        //     style: {
        //       padding: '10px',
        //       margin: '10px',
        //       border: '1px solid black',
        //     },
        //   },
        //   asyncprops: {
        //     'SOMEFORMDATA': [
        //       helpers.getDetailLabel(schemaName), 'data'
        //     ],
        //   },
        // },
      ],
    },
  };
};

/**
 * constructs index page
 *
 * @param {*} schema 
 * @param {*} label 
 * @param {*} options 
 */
const constructIndex = function(options = {}) {
  const { schema, schemaName, indexOptions } = options;

  let dataRoutePrefix = helpers.getDataRoute(options);
  let manifestPrefix = helpers.getManifestPathPrefix(options.adminRoute);
  // let customPageData = helpers.getExtensionOverride('customIndexPageData', schema, label, options);
  // let customTabs = helpers.getExtensionOverride('customIndexTabs', schema, label, options);
  // let customHeader = helpers.getExtensionOverride('customIndexHeader', schema, label, options);
  // let customIndexButton = helpers.getSettingOverride('customIndexButton', schema, label, options);
  let customPageData, customTabs, customHeader, customIndexButton;
  return {
    resources: {
      [helpers.getIndexLabel(schemaName)]: `${dataRoutePrefix}?format=json`,
    },
    onFinish: 'render',
    pageData: (customPageData) ?
      customPageData : {
        title: `Content › ${pluralize(capitalize(schemaName))}`,
        navLabel: `Content › ${pluralize(capitalize(schemaName))}`,
      },
    layout: {
      component: 'div',
      props: {
        style: {
          marginTop: 80,
          marginBottom: 80,
          paddingBottom: 80,
        },
      },
      children: [
        customHeader,
        (customTabs) ? customTabs : contenttabs(options),
        {
          component: 'Container',
          props: {},
          children: [{
              component: 'div',
              props: {
                style: {
                  display: 'flex',
                  flex: 1,
                },
              },
              children: [{
                  component: 'Title',
                  props: {
                    style: {
                      marginTop: 30,
                      display: 'flex',
                      flex: 1,
                    },
                  },
                  children: capitalize(schemaName),
                },
                {
                  component: 'ResponsiveButton',
                  children: `Create ${capitalize(schemaName)}`,
                  props: {
                    onClick: (customIndexButton && customIndexButton.onClick) ?
                      customIndexButton.onClick : 'func:this.props.reduxRouter.push',
                    onclickProps: (customIndexButton && customIndexButton.onclickProps) ?
                      customIndexButton.onclickProps : `${manifestPrefix}/${pluralize(schemaName)}/new`,
                    buttonProps: {
                      size: 'isMedium',
                      color: 'isPrimary',
                    },
                    style: {
                      alignSelf: 'center',
                      textAlign: 'right',
                      // padding: 0,
                    },
                  },
                },
              ],
            }, ]
            .concat(indextable.indextable(options)),
        },
      ],
    },
  };
};

module.exports = {
  constructDetail,
  constructIndex,
};