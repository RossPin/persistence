import React from 'react'
import {connect} from 'react-redux'
import {loginUser} from '../../actions/login'
import { registerUserRequest } from '../../actions/register';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user_name: '',
      password: ''
    }
    this.updateDetails = this.updateDetails.bind(this)
    this.submit = this.submit.bind(this)
    this.guestLogin = this.guestLogin.bind(this)
  }
  componentWillReceiveProps(newProps){
    if (newProps.auth.isAuthenticated) newProps.history.push('/lobby')
  }

  updateDetails(e) {
    this.setState({[e.target.name]: e.target.value})
  }
  submit(e) {
    e.preventDefault()
    let {user_name, password} = this.state
    this.props.dispatch(loginUser({user_name, password}))
  }

  guestLogin() {
    this.props.dispatch(registerUserRequest({
      user_name: 'guest'+Date.now(),
      display_name: 'Guest',
      img: '/Guest.png',
      password: 'GuestLoginPassword'
    }))
  }
  
  render() {
    return (
      <form className="Login container" onSubmit={this.submit}>
        <label className="has-text-white is-size-4">Username:
          <input style={{margin: '0.5vw'}} className="input is-medium is-rounded" type="text" name="user_name" onChange={this.updateDetails}/>
        </label><br/>
        <label className="has-text-white is-size-4">Password:
          <input style={{margin: '0.5vw'}} className="input is-medium is-rounded" type="password" name="password" onChange={this.updateDetails}/>
        </label><br/>
        <input className="button is-white is-outlined is-medium" type="submit" value="Login" />
        <span className="button is-white is-outlined is-medium" onClick={this.guestLogin}>Continue as Guest</span>
      </form>
    )
  }
}

const mapStateToProps = ({auth}) => {
  return {auth}
}

export default connect(mapStateToProps)(Login)
