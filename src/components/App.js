import React,{Component, PropTypes} from 'react';
import {Link} from 'react-router';

import Header from './Header';
class App extends Component{
  constructor(){
    super();
  }

  render(){
    return(
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }

}


export default App;
