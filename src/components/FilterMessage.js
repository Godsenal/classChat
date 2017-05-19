import React, { PropTypes } from 'react'
import {List} from 'semantic-ui-react';
import moment from 'moment';
class FilterMessage extends React.Component {
  render () {
    const {types, url, contents, created} = this.props;
    const icon = types =='application'?'file':types =='image'?'image':'comment';
    const header = types =='application'|| types=='image' ?
      <List.Header as='a' href={`/api/download/${this.props.types}/${this.props.url}/${this.props.contents}`} download>{this.props.contents}</List.Header>
      :<List.Header>{this.props.contents}</List.Header>;
    return(
      <List.Item>
        <List.Icon name={icon} size='small' verticalAlign='middle' />
        <List.Content>
          {header}
          <List.Description >{this.props.userName} ...{moment(this.props.created).fromNow()}</List.Description>
        </List.Content>
      </List.Item>
    );
  }
}

export default FilterMessage;
