exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Players = function() {
  var playerNames   = new Array();
  var places        = new Array(6);
  var purses        = new Array(6);
  var inPenaltyBox = new Array(6);

  this.howManyPlayers = function() {
    return playerNames.length;
  };

  this.add = function(playerName) {
    playerNames.push(playerName);
    places[this.howManyPlayers() - 1] = 0;
    purses[this.howManyPlayers() - 1] = 0;
    inPenaltyBox[this.howManyPlayers() - 1] = false;

    console.log(playerName + " was added");
    console.log("They are player number " + playerNames.length);

    return true;
  };

  this.getPlace = function(playerNumber) {
    return places[playerNumber]
  };

  this.addToPlace = function(playerNumber, addAmount) {
    places[playerNumber] += addAmount
  };

  this.getPlayerName = function(playerNumber) {
    return playerNames[playerNumber]
  };

  this.getPurse = function(playerNumber) {
    return purses[playerNumber]
  };

  this.incrementPurse = function(playerNumber) {
    purses[playerNumber] += 1
  };

  this.isInPenaltyBox = function(playerNumber) {
    return inPenaltyBox[playerNumber]
  };

  this.putInPenaltyBox = function(playerNumber) {
    inPenaltyBox[playerNumber] = true
  }
};

exports.Questions = function() {
  var popQuestions     = new Array();
  var scienceQuestions = new Array();
  var sportsQuestions  = new Array();
  var rockQuestions    = new Array();

  this.generateQuestions = function() {
    for(var i = 0; i < 50; i++){
      popQuestions.push("Pop Question "+i);
      scienceQuestions.push("Science Question "+i);
      sportsQuestions.push("Sports Question "+i);
      rockQuestions.push("Rock Question "+i);
    };
  };

  this.getNextQuestion = function(category) {
    if(category == 'Pop')
      return popQuestions.shift();
    if(category == 'Science')
      return scienceQuestions.shift();
    if(category == 'Sports')
      return sportsQuestions.shift();
    if(category == 'Rock')
      return rockQuestions.shift();
  };
};

exports.Game = function(players) {
  var questions        = new Questions();
  var currentPlayer    = 0;
  var isGettingOutOfPenaltyBox = false;

  var didPlayerWin = function(){
    return !(players.getPurse(currentPlayer) == 6)
  };

  var currentCategory = function(){
    if(players.getPlace(currentPlayer) == 0)  return 'Pop';
    if(players.getPlace(currentPlayer) == 4)  return 'Pop';
    if(players.getPlace(currentPlayer) == 8)  return 'Pop';
    if(players.getPlace(currentPlayer) == 1)  return 'Science';
    if(players.getPlace(currentPlayer) == 5)  return 'Science';
    if(players.getPlace(currentPlayer) == 9)  return 'Science';
    if(players.getPlace(currentPlayer) == 2)  return 'Sports';
    if(players.getPlace(currentPlayer) == 6)  return 'Sports';
    if(players.getPlace(currentPlayer) == 10) return 'Sports';
    return 'Rock';
  };

  questions.generateQuestions()

  this.isPlayable = function(howManyPlayers){
    return howManyPlayers >= 2;
  };

  var askQuestion = function(){
    var question = questions.getNextQuestion(currentCategory());
    console.log(question)
  };

  this.roll = function(roll){
    console.log(players.getPlayerName(currentPlayer) + " is the current player");
    console.log("They have rolled a " + roll);

    if(players.isInPenaltyBox(currentPlayer)){
      if(roll % 2 != 0){
        isGettingOutOfPenaltyBox = true;

        console.log(players.getPlayerName(currentPlayer) + " is getting out of the penalty box");
        players.addToPlace(currentPlayer, roll)
        if(players.getPlace(currentPlayer) > 11){
          players.addToPlace(currentPlayer, -12)
        }

        console.log(players.getPlayerName(currentPlayer) + "'s new location is " + players.getPlace(currentPlayer));
        console.log("The category is " + currentCategory());
        askQuestion();
      }else{
        console.log(players.getPlayerName(currentPlayer) + " is not getting out of the penalty box");
        isGettingOutOfPenaltyBox = false;
      }
    }else{

      players.addToPlace(currentPlayer, roll)
      if(players.getPlace(currentPlayer) > 11){
        players.addToPlace(currentPlayer, -12)
      }

      console.log(players.getPlayerName(currentPlayer) + "'s new location is " + players.getPlace(currentPlayer));
      console.log("The category is " + currentCategory());
      askQuestion();
    }
  };

  this.wasCorrectlyAnswered = function(){
    if(players.isInPenaltyBox(currentPlayer)){
      if(isGettingOutOfPenaltyBox){
        console.log('Answer was correct!!!!');
        players.incrementPurse(currentPlayer);
        console.log(players.getPlayerName(currentPlayer) + " now has " +
                    players.getPurse(currentPlayer)  + " Gold Coins.");

        var winner = didPlayerWin();
        currentPlayer += 1;
        if(currentPlayer == players.howManyPlayers())
          currentPlayer = 0;

        return winner;
      }else{
        currentPlayer += 1;
        if(currentPlayer == players.howManyPlayers())
          currentPlayer = 0;
        return true;
      }



    }else{

      console.log("Answer was correct!!!!");

      players.incrementPurse(currentPlayer);
      console.log(players.getPlayerName(currentPlayer) + " now has " +
                  players.getPurse(currentPlayer)  + " Gold Coins.");

      var winner = didPlayerWin();

      currentPlayer += 1;
      if(currentPlayer == players.howManyPlayers())
        currentPlayer = 0;

      return winner;
    }
  };

  this.wrongAnswer = function(){
		console.log('Question was incorrectly answered');
		console.log(players.getPlayerName(currentPlayer) + " was sent to the penalty box");
		players.putInPenaltyBox(currentPlayer);

    currentPlayer += 1;
    if(currentPlayer == players.howManyPlayers())
      currentPlayer = 0;
		return true;
  };
};

var notAWinner = false;

var players = new Players();
players.add('Chet');
players.add('Pat');
players.add('Sue');

var game = new Game(players);

do{

  game.roll(Math.floor(Math.random()*6) + 1);

  if(Math.floor(Math.random()*10) == 7){
    notAWinner = game.wrongAnswer();
  }else{
    notAWinner = game.wasCorrectlyAnswered();
  }

}while(notAWinner);