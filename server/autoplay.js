const {currentGames} = require('./currentGames')
const db = require('./db/game')
const {checkVotes, checkIntentions, checkNominations} = require('./gameFunctions')

function getAutoPlayers(game) {
  return game.players.filter(player => player.id <= 10)
}

function checkAutoPlayers(game_id, callback) {
  const game = currentGames[game_id]
  getAutoPlayers(game).some(autoPlayer => {
    if (nominateRequired(game, autoPlayer)) {
      makeNomination(game, game_id, autoPlayer, callback)
      return true
    }
    else if (voteRequired(game, autoPlayer)) {
      makeVote(game, game_id, autoPlayer, callback)
      return true
    }
    else if (intentionRequired(game, autoPlayer)) {
      makeIntention(game, game_id, autoPlayer, callback)
      return true
    }
    else return false
  })
}

function nominateRequired(game, autoPlayer) {
  return (game.currentRound.leader_id === autoPlayer.id && game.gameStage === 'nominating')
}

function makeNomination(game, game_id, autoPlayer, callback) {  
    const {id: round_id, round_num} = game.currentRound 
    const {mission_num} = game.currentMission
    const numNominations = game.missionParams[mission_num - 1].team_total
    const nominations = game.missions[mission_num-1].rounds[round_num-1].nominations
    if (nominations.length < numNominations) {
      let nominee = isNominated(autoPlayer, nominations) ? selectNominee(game, nominations) : autoPlayer.id
      db.castNomination(round_id, nominee).then(() => {
        db.getNominations(round_id).then(updatedNominations => {
          console.log('nomination recieved: ' + autoPlayer.display_name)
          game.missions[mission_num-1].rounds[round_num-1].nominations = updatedNominations
          callback({currentGame: game})
        })
      })
    }
    else {
      checkNominations(game_id, round_id).then(() => {
        callback({currentGame: game})
      })
    }  
}

function isNominated(player, nominations) {
  return nominations.filter(nomination => nomination.user_id === player.id).length > 0
}

function selectNominee(game, nominations) {
  const unNominated = game.players.filter(player => !isNominated(player, nominations))
  return (unNominated[Math.floor(Math.random()*unNominated.length)].id)
}

function voteRequired(game, autoPlayer) {
  return (game.gameStage === 'voting' && autoPlayer.voted != game.currentRound.id)
}

function makeVote(game, game_id, autoPlayer, callback){
  const {id: round_id, round_num} = game.currentRound
  autoPlayer.voted = round_id
  const vote = Math.random() < (0.4 + round_num/10)
  db.castVote(round_id, autoPlayer.id, vote).then(() => {
    console.log('vote recieved: ' + autoPlayer.display_name)
    checkVotes(game_id, round_id).then(() => {
      callback({currentGame: game})
    })
  })
}

function intentionRequired(game, autoPlayer) {
  const {round_num} = game.currentRound 
  const {mission_num} = game.currentMission    
  const nominations = game.missions[mission_num-1].rounds[round_num-1].nominations
  return (game.gameStage === 'intentions' && isNominated(autoPlayer, nominations) && autoPlayer.intention != game.currentMission.id)
}

function makeIntention(game, game_id, autoPlayer, callback) {
  let intention = true
  const {id: mission_id, mission_num} = game.currentMission
  autoPlayer.intention = mission_id
  if (autoPlayer.role === 'spy') {
    const failFactor = (0.2 + (mission_num)/5)/(spyCanWin(game) ? 1 : numSpiesOnMission(game)) // probability of playing fail reduced by number of other spies on mission unless game can be won this mission 
    intention = Math.random() > failFactor
    console.log(failFactor, spyCanWin(game), numSpiesOnMission(game))
  }
  db.castIntention(mission_id, autoPlayer.id, intention).then(() => {
    console.log('intention recieved: ' + autoPlayer.display_name)
    checkIntentions(game_id, mission_id).then(() => {
      callback({currentGame: game})
    })
  })
}

function spyCanWin(game){
  return game.missions.filter(mission => mission.outcome === false).length >= 2
}

function numSpiesOnMission(game){
  const {round_num} = game.currentRound 
  const {mission_num} = game.currentMission 
  const nominations = game.missions[mission_num-1].rounds[round_num-1].nominations
  const spies = nominations.filter(nomination => game.players.find(player => player.id === nomination.user_id).role === 'spy')
  return spies.length
}

module.exports = checkAutoPlayers
