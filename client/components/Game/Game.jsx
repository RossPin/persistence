import React from 'react'
import { connect } from 'react-redux'
import GameBoard from './GameBoard'
import Buttons from './Buttons'
import StatusBar from './StatusBar'
import ChatWindow from './ChatWindow'
import { updateCurrentGame } from '../../actions/currentGame'
import Votes from './Votes'
import GameOver from './GameOver'
import IntentionsSuspense from './IntentionsSuspense'
import {getGameState} from '../../actions/currentGame'

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: '',
      showVotes: false,
      showIntentions: false,
      gameOver: false,
      mission: {},
      round: {}
    }
    this.timeout = null
    this.sortIntentions = this.sortIntentions.bind(this)
    this.grabVotes = this.grabVotes.bind(this)
    this.getData = this.getData.bind(this)
  }

  componentDidMount() {
    this.mounted = true
    const gameId = this.props.match.params.id
    let user_name = this.props.auth.user.user_name
    let localSocket = this.props.socket
    localSocket.emit('joinGame', gameId, user_name)
    localSocket.on('receiveUpdateGame', (gameData) => {
      if (this.mounted) {
        const { dispatch } = this.props
        clearTimeout(this.timeout)        
        dispatch(updateCurrentGame(gameData.currentGame))
        this.timeout = setTimeout(() => {
          if (this.mounted && !this.state.gameOver) this.getData()
        },30000)
      }     
    })
    this.getData()
  }

  componentWillUnmount(){
    clearTimeout(this.timeout)
    this.mounted = false
  }


  componentWillReceiveProps(newProps){
    if (this.state.stage == 'voting' && newProps.currentGame.gameStage !== 'voting') this.grabVotes(newProps.currentGame.missions)
    if (this.state.stage == 'intentions' && newProps.currentGame.gameStage !== 'intentions') this.sortIntentions(newProps.currentGame.missions)
    if (newProps.currentGame.gameStage == 'goodWin' || newProps.currentGame.gameStage == 'spyWin') this.setState({ gameOver: true })
    this.setState({ stage: newProps.currentGame.gameStage })
  }

  getData(){
    const gameId = this.props.match.params.id
    clearTimeout(this.timeout)
    this.props.dispatch(getGameState(gameId)).then(() => {
      console.log('data update on timeout')      
      this.timeout = setTimeout(() => {
        if (this.mounted && !this.state.gameOver) this.getData()
      },30000)
    })    
  }


  grabVotes(missions){
    let mission = missions[missions.length -1]
    let round = mission.rounds.slice().reverse().find(x => x.votes.length > 0)
    this.setState({showVotes: true, round: round})
  }

  sortIntentions(missions){
    let mission = missions.slice().reverse().find(x => x.intentions.length > 0)
    let team = mission.intentions.map(member => {
      let player = this.props.currentGame.players.find(x => x.id == member.user_id)
      return player
    })


    let intentions = mission.intentions.map(x => x.intention)
    if (Math.random() > 0.5) this.shuffleArray(intentions)
    else intentions.sort((a, b) => b - a)
    this.setState({ showIntentions: true, mission: { intentions, team, outcome: mission.outcome } })
  }


  shuffleArray(a) {
      for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
  }

  hideModal(modal) {
    let {showVotes, showIntentions, gameOver} = this.state
    if (modal === 'votes') showVotes = false
    else if (modal === 'intentions') showIntentions = false
    else if (modal === 'gameOver') {
      clearTimeout(this.timeout)
      gameOver = false
    }
    this.setState({ showVotes, showIntentions, gameOver})
  }

  render() {
    return (
      <div className="container">
          <StatusBar leader={(this.props.currentGame.currentRound.leader_id == this.props.auth.user.id)} />
            <Buttons />
            <GameBoard />            
            {this.state.gameOver && <GameOver hideModal={this.hideModal.bind(this)} />}
            {this.state.showIntentions && <IntentionsSuspense hideModal={this.hideModal.bind(this)} mission={this.state.mission} />}
            {this.state.showVotes && <Votes hideModal={this.hideModal.bind(this)} round={this.state.round} />}           
            <div style={{marginTop: '1vw'}} className="ChatContainer">
            <ChatWindow id={this.props.match.params.id} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => state

export default connect(mapStateToProps)(Game)
