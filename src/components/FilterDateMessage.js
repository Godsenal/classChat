import React, { PropTypes } from 'react'
import {Divider, List} from 'semantic-ui-react';
import {FilterMessage} from './';
import moment from 'moment';
class FilterDateMessage extends React.Component {
  render () {
    return(
      <div>
        <Divider horizontal>{moment(this.props.date).format('LL')}</Divider>
        <List divided relaxed>
        {this.props.messages.map((message, i) => {
          return <FilterMessage key={i} currentUser={this.props.currentUser} {...message} />;
        })}
        </List>
      </div>
    );
  }
}

export default FilterDateMessage;
