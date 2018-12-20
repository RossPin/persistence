import React from 'react'
import { connect } from 'react-redux'
import NewGameForm from './NewGameForm'
import { joinGame } from '../../actions/playerInputs'
import {resetCurrentGame} from '../../actions/currentGame'

const buttonStyling = "button is-medium is-fullwidth is-white is-outlined"

class Lobby extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      games: []
    }
    this.handleJoinGame = this.handleJoinGame.bind(this)
  }

  componentDidMount() {
    this.mounted = true
    const { socket } = this.props
    socket.emit('getGames')
    socket.on('receiveGames', (games) => {      
      if(this.mounted) this.setState({
        games: games
      })
    })
    this.props.dispatch(resetCurrentGame)
  }

  componentWillUnmount(){
    this.mounted = false
  }

  handleJoinGame(game, user) {    
    joinGame({game, user})
      .then(res => {
        const gameData = res.body        
        const localSocket = this.props.socket
        localSocket.emit('updateWaitingRoom', gameData, game.id)
        this.props.history.push(`/waiting/${game.id}`)
      })
  }

  render() {
    const user = this.props.auth.user
    const games = this.state.games

    return (
      <div>
        <h1 className="is-size-1 has-text-white">Welcome to the lobby</h1>
        <NewGameForm joinGame={this.handleJoinGame}/>
        <br />
        <p className="is-size-4 has-text-white">Join a game</p>
        <br />
        <div className="columns is-4 is-multiline">
          {games.map((game, i) => {
            if ((!game.in_progress || game.playerIds.includes(user.id)) && !game.is_finished) return (
              <div key={i} className="column is-4">
                <button onClick={() => this.handleJoinGame(game, user)} className={buttonStyling}>{game.game_name}</button>
              </div>
              )
            })}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(Lobby)
