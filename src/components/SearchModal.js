import React, { Component, PropTypes } from 'react';
import {Search, Modal, Button, Label, Header, Icon, Grid} from 'semantic-ui-react';
import _ from 'lodash';

const resultRenderer = ({ name, id}) => (
  <Label content={name} />
);

class SearchModal extends Component{
  constructor(){
    super();
    this.state = {
      isLoading: false,
      results: [],
      value: '',
      channel: {},
    };
  }
  componentWillMount() {
    this.resetComponent();
  }
  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, result) => this.setState({ value: result.name, channel: result })

  handleSearchChange = (e, value) => {
    this.setState({ isLoading: true, value });
    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();
      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = (result) => re.test(result.name);
      this.setState({
        isLoading: false,
        results: _.filter(this.props.results, isMatch),
      });
    }, 500);

  }

  render(){
    const { isLoading, value, id, results, channel } = this.state;
    return(
      <Modal open={this.props.isOpen} basic>
        <Modal.Header>
        <Header icon size='huge' textAlign='center' inverted><Icon name='group'/>Search a Channel to Join</Header>
        </Modal.Header>
        <Modal.Content>
          <Search aligned='center' fluid
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}
            results={results}
            value={value}
            resultRenderer={resultRenderer}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='blue' onClick={() => this.props.handleJoinChannel(channel)} inverted> Join </Button>
          <Button basic color='red' onClick={this.props.handleSearchClose} inverted> No </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default SearchModal;
