import _ from 'lodash';
import React, { Component } from 'react';
import { Button, Dropdown, Grid, Header } from 'semantic-ui-react';
import utilities from '../../util';
import qs from 'querystring';

class RemoteDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      multiple: props.multiple || false,
      search: props.search || false,
      searchQuery: null,
      value: props.multiple? []  : '',
      options: props.default_options || [],
    };
    this.debounce = this.debounce.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, { value }) {
    this.setState({ value })
  }

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
          limit: options.limit || 20,
          sort: options.sort,
          query: searchQuery,
          allowSpecialCharacters: true,
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