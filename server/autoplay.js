const {currentGames} = require('./currentGames')
const db = require('../db/game')
const {checkVotes, checkIntentions, checkNominations} = require('../gameFunctions')

function getAutoPlayers(game) {
  return game.players.filter(player => player.id <= 10)
}

function checkAutoPlayers(game_id, callback) {
  const game = currentGames[game_id]
  getAutoPlayers(game).map(autoPlayer => {
    if (nominateRequired(game, autoPlayer)) makeNomination(game, autoPlayer, callback)
    else if (voteRequired(game, autoPlayer)) makeVote(game, game_id, autoPlayer, callback)
  })
}

function nominateRequired(game, autoPlayer) {
  return (game.currentRound.leader_id === autoPlayer.id && game.gameStage === 'nominating')
}

function makeNomination(game, autoPlayer, callback) {
  setTimeout(() => {
    const {id: round_id, round_num} = game.currentRound 
    const {mission_num} = game.currentMission
    const numNominations = game.missionParams[mission_num - 1].team_total
    const nominations = game.missions[mission_num-1].rounds[round_num-1].nominations
    let nominee = isNominated(autoPlayer, nominations) ? selectNominee(game, nominations) : autoPlayer.id
    db.castNomination(round_id, nominee).then(() => {
      db.getNominations(round_id).then(updatedNominations => {
        console.log('nomination recieved')
          game.missions[mission_num-1].rounds[round_num-1].nominations = updatedNominations
          callback(game)
          if (updatedNominations.length <= numNominations) makeNomination(game, autoPlayer, callback)
          else checkNominations(game_id, round_id).then(() => {
            callback(game)
          })
      })
    })
  },2000) 
}

function isNominated(player, nominations) {
  return nominations.filter(nomination => nomination.user_id === player.id).length > 0
}

function selectNominee(game, nominations) {
  const unNominated = game.players.filter(player => !isNominated(player, nominations))
  return (unNominated[Math.floor(Math.random()*unNominated.length)].id)
}

function voteRequired(game, autoPlayer) {
  return (game.gameStage === 'voting' && autoPlayer.voted < game.currentRound.round_num)
}

function makeVote(game, game_id, autoPlayer, callback){
  const {id: round_id, round_num} = game.currentRound
  autoPlayer.voted = round_num
  const vote = Math.random() < 0.5 + round_num*.1
  db.castVote(round_id, autoPlayer.id, vote).then(() => {
    console.log('vote recieved')
    checkVotes(game_id, round_id).then(() => {
      callback(game)
    })
  })
}
