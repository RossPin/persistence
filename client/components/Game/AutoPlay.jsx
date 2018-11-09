import React from 'react'
import { connect } from 'react-redux'
import {addAuto} from '../../actions/playerInputs'

class AutoPlay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
        this.addAuto = this.addAuto.bind(this)
    }
    addAuto() {
        const {currentGame, socket} = this.props
        if (this.state.isLoading) return
        this.setState({isLoading: true})

        addAuto(currentGame.game)
            .then((res) => {
                const gameData = res.body
                const game_id = currentGame.game.id
                socket.emit('updateWaitingRoom', gameData, game_id)
                this.setState({isLoading: false})
            })
    }
    render() {
        return <button onClick={this.addAuto} style={{marginBottom: '0.5vw'}} className={`button is-medium is-white is-outlined ${this.state.isLoading ? 'is-loading' : ''}`}>Add Auto</button>
    }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(AutoPlay)
