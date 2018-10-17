import React from 'react'

const PlayerToolTip = props => {
    const {isHammer, authID, isLeader} = props
    const { id, display_name, user_name } = props.player
    const whoHammer = isHammer && authID == id 
    const whoLeader = isLeader && authID == id
    
    return (<div className="playerToolTip">
        <p> User: {user_name} </p>
        {isHammer &&<div> <p className="playerToolTipStat"><img className="toolTipStatusIcon" src="/goldhammer.png"/>{whoHammer? "  You are" : "This player is"} the hammer</p> </div>}
        {isLeader &&<div> <p className="playerToolTipStat"><img className="toolTipStatusIcon" src="/goldcrown.png"/>{whoLeader? "  You are" : "This player is"} the leader</p></div>}
    </div>)
}

export default PlayerToolTip

