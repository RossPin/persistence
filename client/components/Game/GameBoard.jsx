import React from 'react'
import { connect } from 'react-redux'

import Mission from './Mission'
import Player from './Player'

export class GameBoard extends React.Component {
  render() {    
    const {
      players,      
      missions,
      currentMission,
      currentRound
    } = this.props.currentGame

    const { mission_num } = currentMission
    const { round_num, leader_id } = currentRound

    const leader = players.find(player => player.id == leader_id)
    // index to decide who gets rendered on top and who gets rendered on bottom
    const halfPlayersIndex = Math.round(players.length / 2)

    // finding the hammer
    const initialLeader = missions[mission_num - 1].rounds[0].leader_id
    const initialLeaderIndex = players.findIndex(x => x.id == initialLeader)
    const hammer = players[(initialLeaderIndex + 4) % players.length].id
    const spies = players.filter(x => x.role == 'spy').length

    // this stuff fixed a problem with mission array only being as long as mission exists

    const missionDisplay = Array(5).fill(0).map((x, i) =>
      missions[i] ? missions[i] : {outcome: null}
    )

    return (

      <div className="columns">
        <div className="column is-2">
          {players.slice(0, halfPlayersIndex).map((player, i) => {
            return <Player key={i} player={player} leader={leader_id} hammer={hammer}/>
          })}
        </div>
        <div className='column is-8'>
          <h1>{players.map((x, i) => {
            if (x.role == 'spy') return <img key={i} className="spyIcon" src="/spy.png" />
          })}</h1>

          <div className="mission-board">
            <p className="is-size-3 has-text-white">Missions</p>
            <div className="level missionDisplay">
              {missionDisplay.map((mission, i) => {
                return <Mission key={i} mission={mission} number={i}  />
              })}

            </div>
            <p className="voteTrack is-size-3 has-text-white">Vote Track</p>
            <div className="RoundContainer is-centered columns">
              {Array(5).fill(0).map((x, i) => (
                <span key={i} className={`${i + 1 === round_num && "cake"} column is-size-2 has-text-white`}>{i + 1}</span>
            ))}
            </div>
          </div>
        </div>


        <div className="column is-2">
          {players.slice(halfPlayersIndex).map((player, i) => {
            return <Player key={i} player={player} leader={leader_id} hammer={hammer}/>
          })}
        </div>
      </div>

    )
  }
}


const mapStateToProps = state => state

export default connect(mapStateToProps)(GameBoard)
