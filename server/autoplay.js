const {currentGames} = require('./currentGames')

function getAutoPlayers(game_id) {
  return currentGames[gameId].players.filter(x => x.id <= 10)
}

function checkAutoPlayers(game_id) {
  getAutoPlayers(game_id).map(player => {
    if (nominateRequired(game_id, player)) makeNomination(game_id, player)  
  })
}

function nominateRequired(game_id, player) {
  return (currentGames[gameId].currentRound.leader_id === player.id && currentGames[gameId].gameStage === 'nominating')
}

function makeNomination(game_id, player) {
  
}