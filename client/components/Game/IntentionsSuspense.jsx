import React from 'react'
import {connect} from 'react-redux'

const roundStyleObj = {
    borderRadius: "50%",
    height: "120px",
    width: "120px"
}

class IntentionsSuspense extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasStarted: false,
      hasEnded: false,
      revealed: 0
    }
    this.timeout = null
    this.tick = this.tick.bind(this)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.triggerStart = this.triggerStart.bind(this)

    this.props.socket.on('startReveal', () => {
      this.start()
    })
  }
  triggerStart() {
    this.props.socket.emit('startReveal', this.props.currentGame.game.id)
  }
  start() {
    this.setState({hasStarted: true})
    window.clearTimeout(this.timeout)
    this.timeout = setTimeout(() => this.tick(), 1500)
  }
  tick() {
    let {revealed} = this.state
    revealed++
    this.setState({revealed})
    if (revealed >= this.props.mission.intentions.length) this.stop()
    else this.timeout = setTimeout(() => this.tick(), revealed * 1000)
  }
  stop() {
    window.clearTimeout(this.timeout)
    this.setState({hasEnded: true})
  }

  render() {
    let {intentions, team, outcome} = this.props.mission
    const {hasStarted, hasEnded, revealed} = this.state

    return <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Mission Intentions</p>
        </header>
        <section className="modal-card-body">
          <h1 className={`title ${!hasEnded ? '' : outcome ? 'has-text-info' : 'has-text-danger'}`}>
            {!hasStarted
              ? 'All shall be revealed...'
              : hasEnded
                ? outcome
                  ? 'The Mission was a success!'
                  : 'The Mission has failed!'
                : 'Reveal in progress...'
            }
          </h1>
          <h2 className="subtitle">
            The Team:
          </h2>
          <div className="columns is-multiline">
            {team.map(player => <div className="column is-4">{player.user_name}<img style={roundStyleObj} src={player.img} /></div>)}
          </div>
          <hr />
          <div className="has-text-centered columns is-multiline">
            {intentions.map((intention, i) => <div className={`column is-${12 /  intentions.length} box ${
              i < revealed
                ? ''
                : intention ? 'has-text-success' : 'has-text-danger'
            }`}>
              <img src={
                hasStarted
                  ? i < revealed
                    ? intention
                      ? '/success.png'
                      : '/fail.png'
                    : '/blank-card.png'
                  : '/blank-card.png'
              } className=" image is-128x128" />
            </div>)}

          </div>
        </section>
        <footer className="modal-card-foot">
          {!hasStarted && <button className="button is-fullwidth" onClick={this.triggerStart}>Reveal!</button>}
          {hasEnded && <button onClick={this.props.hideModal} className="button is-fullwidth">Close</button>}
        </footer>
      </div>
    </div>
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(IntentionsSuspense)
