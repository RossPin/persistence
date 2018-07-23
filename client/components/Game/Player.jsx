import React from 'react'
import { connect } from 'react-redux'
import {Tooltip} from 'react-tippy'
import Template from './Template'
import PlayerToolTip from './PlayerToolTip'
import {sendNomination} from '../../actions/playerInputs'

const roundStyleObj = {
  borderRadius: "50%",
  height: "120px",
  width: "120px"
}

class Player extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        isNominated: false,
        roundId: 0
    }
    this.handleClick = this.handleClick.bind(this)
    this.checkNewRound = this.checkNewRound.bind(this)
  }

  handleClick() {
      if (this.state.isNominated) return
      //do somthing
      const user = {id: this.props.auth.user.id} //needs to be from auth
      const nom = {user, game: this.props.currentGame.game, nomination: {user: this.props.player}}
      sendNomination(nom)
      this.setState({isNominated: true, roundId: this.props.currentRound.id})
  }

  checkNewRound() {
    if (this.state.isNominated && this.props.currentRound.id != this.state.roundId) this.setState({isNominated: false})
  }

    render() {

        const authID = this.props.auth.user.id
        //console.log(authID)
        const id = authID // this needs to be auth user id

        const currentUser = this.props.currentGame.players.find(player => player.id == id)
        const userIsSpy = currentUser.role == 'spy'
        const { display_name, user_name, img } = this.props.player
        const isLeader = (this.props.currentRound.leader_id == this.props.player.id)
        const isNominating = (this.props.currentRound.leader_id == authID && this.props.currentGame.gameStage == 'nominating') 
        const isSpy = this.props.player.role == 'spy' && userIsSpy
        const glow = this.state.isNominated ? 'button-glow' : isSpy ? 'spy-glow' : ''
        this.checkNewRound() 

        return (
            <Tooltip
                // options
                position="bottom"
                trigger="mouseenter"
                html={(
                    <PlayerToolTip player={this.props.player}/>
                )}
            >

                <div onClick={(isNominating) && this.handleClick} className="player" >
                {isLeader && <i className="fas fa-crown"></i>}
                <p className="is-size-5"> {display_name || user_name} </p>
                <img className={glow} style={roundStyleObj} src={img} />
            </div>


            </Tooltip>
        )

    }

}

const mapStateToProps = (state) => state

export default connect(mapStateToProps)(Player)
