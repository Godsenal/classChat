import React, { PropTypes } from 'react';
import {List, Button, Icon} from 'semantic-ui-react';
import moment from 'moment';
class FilterMessage extends React.Component {

  handleJump = () => {
    this.props.jumpMessage(this.props.id);
  }
  render () {
    const {types, url, contents, created, userName} = this.props;
    const icon = types =='application'?'file':types =='image'?'image':'comment';
    const header = types =='application'|| types=='image' ?
      <List.Header as='a' href={`/api/download/${types}/${url}/${contents}`} download>{contents}</List.Header>
      :<List.Header >{contents}</List.Header>;
    return(
      <List.Item>
        <List.Content floated='right'>
          <Button icon inverted onClick={this.handleJump}><Icon name='arrow right'/></Button>
        </List.Content>
        <List.Icon name={icon} size='small' verticalAlign='middle' />
        <List.Content>
          {header}
          <List.Description >{userName} ...{moment(created).fromNow()}</List.Description>
        </List.Content>
      </List.Item>
    );
  }
}

FilterMessage.propTypes = {
  jumpMessage : PropTypes.func.isRequired,
  types: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  contents: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};
export default FilterMessage;
