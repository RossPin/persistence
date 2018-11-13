import React from 'react'
import { connect } from 'react-redux'
import MissionToolTip from './MissionToolTip'
import {Tooltip} from 'react-tippy'


const Mission = props => {
  const textStyle = 'is-uppercase is-size-5'
  const { id, outcome } = props.mission
  const missionNumber = props.number
  const currentMissionNumber = props.currentGame.currentMission.mission_num
  const glow = (props.currentGame.currentMission.mission_num == missionNumber + 1) ? 'cake' : ''
  const iconDrop = currentMissionNumber > missionNumber + 1 || (props.currentGame.game.is_finished && currentMissionNumber === missionNumber + 1)
  return (
    <Tooltip
      // options
      position="bottom"
      trigger="mouseenter"
      html={(
        <MissionToolTip mission={props.mission} players={props.currentGame.players} />
      )}
    >

      <h2 className={`innerShadow level-item circles has-text-centered has-text-black is-size-2 mission ${glow}`}>{iconDrop ? <img src={outcome ? '/fist.png' : '/dagger.png'} /> : props.missionParams[missionNumber].team_total}</h2>
      <br />




    </Tooltip>
  )
}


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(Mission)
