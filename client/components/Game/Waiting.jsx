import React from 'react'
import { connect } from 'react-redux'
import EmptyPlayer from './EmptyPlayer'
import ReadyButton from './ReadyButton'
import ChatWindow from './ChatWindow'
import {updateCurrentGame, updateMissionParams} from '../../actions/currentGame'

class Waiting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }    
  }

  componentWillReceiveProps(nextProps){
    const {in_progress, id} = nextProps.currentGame.game
    const gameId = Number(this.props.match.params.id)
    if (in_progress && id === gameId){
      this.props.history.push(`/game/${gameId}`)
    }
  }

  componentDidMount() {
    const gameId = this.props.match.params.id
    let user_name = this.props.auth.user.user_name
    let localSocket = this.props.socket
    localSocket.emit('joinGame', gameId, user_name)
    localSocket.on('receiveUpdateWaiting', (gameData) => {
      const {dispatch} = this.props      
      dispatch(updateMissionParams(gameData.missionParams))
      dispatch(updateCurrentGame(gameData.currentGame))
    })
  }

  render() {    
    const {host_id, id} = this.props.currentGame.game
    const gameId = Number(this.props.match.params.id)
    const players = gameId === id ? this.props.currentGame.players : []

    return (
      <div>
        <ChatWindow id={gameId} />        
        <div className='is-size-3 statusBar' >
          <p className="has-text-white">Waiting for Players</p>
        </div>
        {(host_id == this.props.auth.user.id && players.length > 1) && <ReadyButton />}
        <div className="level">
          {players.map((player, i) => {
            return (
              <div key={i} className="level-item">
              <EmptyPlayer player={player} />
              </div>
            )
          })}
        </div>
      </div>
  )

}

}


const mapStateToProps = (state) => state


export default connect(mapStateToProps)(Waiting)
