import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class Home extends React.Component {
  componentDidMount() {
    this.props.history.push(this.props.auth.isAuthenticated ? "/lobby" : "/login")
  }
    
  render() {
    return (
      <div></div>
  )
  }
  
}

const mapStateToProps = ({ auth }) => {
  return { auth }
}

export default connect(mapStateToProps)(Home)

