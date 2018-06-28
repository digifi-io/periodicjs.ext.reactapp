import _ from 'lodash'
import React, { Component } from 'react'
import { Button, Dropdown, Grid, Header } from 'semantic-ui-react'
const names = [ "Banana", "Orange", "Cherry", "Apple", "Pineapple", "Melon", "Plum", "Watermelon", "Blueberry", "Lime"  ];
const getOptions = () =>
  _.times(3, () => {
    let idx = Math.floor(Math.random() * 10);
    const name = names[ idx ];
    return { key: name, text: name, value: _.snakeCase(name) }
  })

// const getOptions = () => {
//   function debounce(func, wait, immediate) {
//     var timeout;
//     return function () {
//       var context = this, args = arguments;
//       var later = function () {
//         timeout = null;
//         if (!immediate && self.state[ `${formElement.name}_query` ] !== args[ 1 ]) {
//           console.log('DIFF')
//           return func.apply(context, args);
//         } else {
//           console.log('SAME');
//           return [];
//         }
//       };
//       var callNow = immediate && !timeout;
//       clearTimeout(timeout);
//       timeout = setTimeout(later, wait);
//       if (callNow) func.apply(context, args);
//     };
//   }
//   passedProps.search = debounce((dropdowns, query) => {
//     console.log({ dropdowns, query })
//     let options = formElement.searchProps;
//     if (options.pagenum < 1) {
//       options.pagenum = 1;
//     }
//     let stateProps = this.props.getState();
//     let fetchURL = `${stateProps.settings.basename}${options.baseUrl}&${qs.stringify({
//       limit: this.state.limit || this.props.limit || 50,
//       sort: '-createdat',
//       query: query,
//       allowSpecialCharacters: true,
//       pagenum: options.pagenum || 1,
//     })}`;
//     let headers = Object.assign({
//       'x-access-token': stateProps.user.jwt_token,
//     }, stateProps.settings.userprofile.options.headers);
//     utilities.fetchComponent(fetchURL, { headers, })()
//       .then(response => {
//         console.log({response})
//       }, e => {
//         console.log({ e })
//       });
//   }, 3000);
// }

class RemoteDropdown extends Component {
  componentWillMount() {
    this.setState({
      isFetching: false,
      multiple: true,
      search: true,
      searchQuery: null,
      value: [],
      options: getOptions(),
    })
  }

  handleChange = (e, { value }) => this.setState({ value })
  handleSearchChange = (e, { searchQuery }) => {
    this.setState({ searchQuery });
    this.fetchOptions();
  }

  fetchOptions = () => {
    this.setState({ isFetching: true })
    //make query here
    setTimeout(() => {
      this.setState({ isFetching: false, options: getOptions() })
    }, 500)
  }

  toggleSearch = e => this.setState({ search: e.target.checked })

  toggleMultiple = (e) => {
    const { value } = this.state
    const multiple = e.target.checked
    // convert the value to/from an array
    const newValue = multiple ? _.compact([value]) : _.head(value) || ''
    this.setState({ multiple, value: newValue })
  }

  render() {
    const { multiple, options, isFetching, search, value } = this.state

    return (
      <Grid>
        <Grid.Column width={8}>
          <p>
            <Button onClick={this.fetchOptions}>Fetch</Button>
            <Button onClick={this.selectRandom} disabled={_.isEmpty(options)}>
              Random
            </Button>
            <label>
              <input type='checkbox' checked={search} onChange={this.toggleSearch} /> Search
            </label>{' '}
            <label>
              <input type='checkbox' checked={multiple} onChange={this.toggleMultiple} /> Multiple
            </label>
          </p>
          <Dropdown
            fluid
            selection
            multiple={multiple}
            search={search}
            options={options}
            value={value}
            placeholder='Add Users'
            onChange={this.handleChange}
            onSearchChange={this.handleSearchChange}
            disabled={isFetching}
            loading={isFetching}
          />
        </Grid.Column>
        <Grid.Column width={8}>
          <Header>State</Header>
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
        </Grid.Column>
      </Grid>
    )
  }
}

export default RemoteDropdown