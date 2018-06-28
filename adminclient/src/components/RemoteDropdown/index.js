import _ from 'lodash';
import React, { Component } from 'react';
import { Button, Dropdown, Grid, Header } from 'semantic-ui-react';
import utilities from '../../util';
import qs from 'querystring';

class RemoteDropdown extends Component {
  constructor(props) {
    super(props);
    this.debounce = this.debounce.bind(this);
  }

  componentWillMount() {
    this.setState({
      isFetching: false,
      multiple: true,
      search: true,
      searchQuery: null,
      value: [],
      options: [],
    })
  }

  handleChange = (e, { value }) => this.setState({ value })

  debounce(func, wait, immediate) {
    var timeout;
    const self = this;
    return function () {
      var context = self, args = arguments;
      var later = function () {
        timeout = null;
        func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    }
  }
  handleSearchChange = this.debounce((e, { searchQuery }) => {
    const self = this;
    if (searchQuery && self.state.searchQuery !== searchQuery) {
      self.setState({ searchQuery }, () => {
        self.setState({ isFetching: true })
        let stateProps = self.props.getState();
        let options = self.props.searchProps;
        let fetchURL = `${stateProps.settings.basename}${options.baseUrl}&${qs.stringify({
          limit: self.state.limit || self.props.limit || 50,
          sort: '-createdat',
          query: searchQuery,
          allowSpecialCharacters: true,
          pagenum: options.pagenum || 1,
        })}`;
        let headers = Object.assign({
          'x-access-token': stateProps.user.jwt_token,
        }, stateProps.settings.userprofile.options.headers);
        utilities.fetchComponent(fetchURL, { headers, })()
          .then(response => {
            let dropdown = response[ 'test_search' ].map((item, idx) => ({
              "key": idx,
              "text": item.label,
              "value": item.value,
            }));
            self.setState({ isFetching: false, options: dropdown })
          }, e => {
            self.setState({ isFetching: false, options: [] })
          });
      })
    } else {
      self.setState({ isFetching: false });
    }
  }, 1000, false)

  toggleSearch = e => this.setState({ search: e.target.checked })

  toggleMultiple = (e) => {
    const { value } = this.state
    const multiple = e.target.checked
    // convert the value to/from an array
    const newValue = multiple ? _.compact([ value ]) : _.head(value) || ''
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