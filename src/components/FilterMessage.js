import React, { PropTypes } from 'react'
import {List} from 'semantic-ui-react';
import moment from 'moment';
class FilterMessage extends React.Component {
  render () {
    return(
      <List.Item>
        <List.Icon name='file' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header as='a' href={`/api/download/${this.props.types}/${this.props.url}/${this.props.contents}`} download>{this.props.contents}</List.Header>
          <List.Description >{this.props.userName} ...{moment(this.props.created).fromNow()}</List.Description>
        </List.Content>
      </List.Item>
    );
  }
}

export default FilterMessage;
