import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import {Grid, Header, Divider, Icon} from 'semantic-ui-react';
import { signinRequest, getStatusRequest } from '../actions/authentication';


class Signin extends Component{
  constructor() {
    super();
    this.state= {
      id:'',
      pw:'',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignin = this.handleSignin.bind(this);
  }
  handleChange(e){
    if(e.target.name === 'id')
      this.setState({id: e.target.value});
    else if(e.target.name ==='pw')
      this.setState({pw: e.target.value});
  }
  handleSignin(){
    let id = this.state.id;
    let pw = this.state.pw;

    this.props.signinRequest(id,pw)
      .then(() => {
        if(this.props.status === 'SUCCESS') {
          let signinData = {
            isSignedIn: true,
            id: id,
            nickname: this.props.nickname,
            isAdmin: false,
          };
          document.cookie = 'key=' + btoa(JSON.stringify(signinData));
          Materialize.toast('Welcome ' + id + '!', 2000);
          browserHistory.push('/channel');
          return true;
        }
        else{
          Materialize.toast('Incorrect username or password', 2000);
          this.setState({pw : ''});
          return false;
        }
      });
  }
  render(){
    return(<Grid centered style = {{'height':'100vh'}}>
            <Grid.Row centered>
              <Header size='huge'><Link to = '/'><Icon name='home'/>HOME</Link></Header>
            </Grid.Row>
            <Grid.Row centered>
              <Header size='huge'>WELCOME</Header>
            </Grid.Row>
            <Grid.Row centered>
              <Grid.Column width={6}>
                <div className="input-field">
                  <label htmlFor='id'>ID</label>
                  <input name= 'id' ref='id' type="text" className="validate" value={this.state.id} onChange={this.handleChange}/>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Grid.Column width={6}>
                <div className="input-field">
                  <label htmlFor='pw'>PASSWORD</label>
                  <input name= 'pw' ref='pw' type="password" className="validate" value={this.state.pw} onChange={this.handleChange}/>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
                <button className="btn waves-effect waves-light pink" type="submit" name="action" onClick={this.handleSignin}>Sign In
                  <Icon name='privacy' />
                </button>
            </Grid.Row>
            <Grid.Row centered>
              <Divider />
              <h3>or</h3>
            </Grid.Row>
            <Grid.Row centered>
                <Link to='/signup'><h1>Create a New Account</h1></Link>
            </Grid.Row>
          </Grid>

    );
  }
}
Signin.defaultProps = {
  nickname: 'Guest',
};
Signin.propTypes = {
  signinRequest: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => {
  return {
    status: state.authentication.signin.status,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signinRequest: (id, pw) => {
      return dispatch(signinRequest(id,pw));
    },
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
