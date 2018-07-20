import React from 'react'
import { connect } from 'react-redux'
import GameBoard from './GameBoard'

// this is the head component for both game and waitingRoom- it decides what to render- based
// on game start, game won etc!!! 

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.startGame = this.startGame.bind(this)
  }

  startGame() {
  }

  endGame() {
  }

  render() {
    const { playerNumber } = this.props
    return (
      <div>
         <h2>Waiting!!</h2>
        <ReadyButton />
        <GameBoard />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

  id: 9,
  playerNumber: 5,
  in_progress: false,
  is_finished: false

})

// const mapDispatchToProps = (dispatch) => {
//   return {
//     startGame: creds => {
//       return dispatch(loginUser(creds))
//     }
//   }
// }

export default connect(mapStateToProps)(Game)