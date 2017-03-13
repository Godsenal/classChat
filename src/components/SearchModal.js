import React, { Component, PropTypes } from 'react';
import {Search, Modal, Button, Label, Header, Icon, Grid} from 'semantic-ui-react';

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
      id: '',
    };
  }
  componentWillMount() {
    this.resetComponent();
  }
  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, result) => this.setState({ value: result.name, id: result.id, })

  handleSearchChange = (e, value) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      this.props.searchChannel(this.state.value).then(()=>{
        this.setState({isLoading: false, results: this.props.results});
      });
    }, 500);

  }

  render(){
    const { isLoading, value, id, results } = this.state;
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
          <Button basic color='blue' onClick={() => this.props.handleJoinChannel({value, id})} inverted> Join </Button>
          <Button basic color='red' onClick={this.props.handleSearchClose} inverted> No </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default SearchModal;
