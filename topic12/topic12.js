const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');

fs.readFile(argv.fin, function(err,data){
  if (err) {
     return console.error(err);
  }

  var loto_obj = dataToObject(data);

  if (argv.norm){
    normBallNumbers(loto_obj);
  }

  if(argv.sort === 'asc'){
    sortGamesAscByNormBallNumbers(loto_obj);
  }

  var output = outputResult(loto_obj);

  fs.writeFile(argv.fout, output, function(err){
    if (err) {
          return console.error(err);
     }
     else {
       console.log('Look result in '+ argv.fout);
     }
   });
});



function dataToObject(data){
  var loto_obj = [];
  var loto_arr = data.toString().split(/\n/);

  loto_arr.forEach(function(elem){

    var game_item = elem.split(';',20);
        loto_obj.push({
          game_num: game_item[0],
          game_date:game_item[1],
          gambler:game_item[2],
          game_set:game_item[3],
          game_balls:[
            game_item[4],
            game_item[5],
            game_item[6],
            game_item[7],
            game_item[8],
            game_item[9]
          ],
          win_two_numbers:game_item[10],
          prize_two_numbers:game_item[11],
          win_three_numbers:game_item[12],
          prize_three_numbers:game_item[13],
          win_four_numbers:game_item[14],
          prize_four_numbers:game_item[15],
          win_five_numbers:game_item[16],
          prize_five_numbers:game_item[17],
          win_six_numbers:game_item[18],
          prize_six_numbers:game_item[19]
        });
  });
  return loto_obj;
};

function normBallNumbers(loto_obj){
    for (game_item of loto_obj){
        game_item.game_balls = game_item.game_balls.sort(function(a,b){
           return parseInt(a) - parseInt(b);
        });
    }
    return loto_obj;
  };

function sortGamesAscByNormBallNumbers(loto_obj){

  var sort_loto_obj = normBallNumbers(loto_obj);
  sort_loto_obj = sort_loto_obj.sort(function(a,b){
        for (var i = 0; i < a.game_balls.length; i++) {
            //todo: ????
          }
    });
  return sort_loto_obj;
};


function outputResult(loto_obj){
  var output = '';
    for (game_item of loto_obj){
       output += game_item.game_num + "|"
              + game_item.game_date + "|"
              + game_item.gambler + "|"
              + game_item.game_set + "|"
              + game_item.game_balls.join(" ") + "|"
              + game_item.win_two_numbers + "|"
              + game_item.prize_two_numbers + "|"
              + game_item.win_three_numbers + "|"
              + game_item.prize_three_numbers + "|"
              + game_item.win_four_numbers + "|"
              + game_item.prize_four_numbers + "|"
              + game_item.win_five_numbers + "|"
              + game_item.prize_five_numbers + "|"
              + game_item.win_six_numbers + "|"
              + game_item.prize_six_numbers + "|"
              +"\n";
    }
  return output;
};
