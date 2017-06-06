const http = require('http');
const fs = require('fs');
const multiparty = require('multiparty');
var util = require('util');

var max_sum = -Infinity;
var min_sum = Infinity;
var num_counts = {};

var server = http.createServer(function(req,res){
    if (req.url === '/'){
      fs.readFile('index.html', function(err, data) {
        if (err) return console.error(err);
          res.writeHead(200, { "Content-Type" : "text/html" });
          res.write(data);
          res.end();
        });
    }
    else if (req.url === '/game_load' && req.method === 'POST'){
      var form = new multiparty.Form();

      form.parse(req, function(err, fields, files) {
        //check for errors
        if (err) {
          res.writeHead(400, {'content-type': 'text/plain'});
          res.end("invalid request: " + err.message);
          return;
        }
        //start read info from choosen file
        fs.readFile(files.game_result_file[0].originalFilename, function(err,data){
          if (err) {
             return console.error(err);
          }
          var game_obj = dataToObject(data);
          var output_result = '';

          if (fields.game_params[0] === 'norm'){
            normalizeNumbers(game_obj);
            output_result = outputResult(game_obj);
          }

          if(fields.game_params[0] === 'sort' && fields.game_params_sort[0] === 'desc'){
            sortGamesByNormalizeNumbers(game_obj,'desc');
            output_result = outputResult(game_obj);
          }

          if(fields.game_params[0] === 'sort' && fields.game_params_sort[0] === 'asc'){
            sortGamesByNormalizeNumbers(game_obj,'asc');
            output_result = outputResult(game_obj);
          }

          if(fields.game_params[0] === 'sum' && fields.game_params_sum[0] === 'max'){
            var game_with_max_sum = maxSumArrayElements(game_obj);
            output_result = outputResult(game_with_max_sum);
            output_result += '<br><p>The game '+ game_with_max_sum[1].game_num + ' has the max sum of balls ' + max_sum + '</p>';
          }

          if(fields.game_params[0] === 'sum' && fields.game_params_sum[0] === 'min'){
            var game_with_min_sum = minSumArrayElements(game_obj);
            output_result = outputResult(game_with_min_sum);
            output_result += '<br><p>The game '+ game_with_min_sum[1].game_num + ' has the min sum of balls ' + min_sum + '</p>';
          }

          if(fields.game_params[0] === 'stat'){
            var row_count = parseInt(fields.stat_rows[0]);
            var count_game_obj = countRepeatNumbersInRows(game_obj, row_count);
            output_result = outputResult(count_game_obj);
            output_result += '<br><p>NUMBER REPEATS</p><br>';
            output_result += '<table>'
            for (num in num_counts)
            {
              var repeat_counts = num_counts[num];
              var repeat_counts_symbols = '';

              for (var i = 0; i < repeat_counts; i++) {
                  repeat_counts_symbols+= '#';
              }
              output_result+= '<tr><td>'.concat(num).concat('</td><td>')
                                 .concat(repeat_counts).concat('</td><td>')
                                 .concat(repeat_counts_symbols).concat('</td></tr>');
            }
          }

          res.writeHead(200, {'content-type': 'text/html;charset=utf-8'});
          res.write(output_result);
          res.end();
        });
      });
    }
    else{
      res.writeHead(404, {'content-type': 'text/plain'});
      res.end('404');
    }
}).listen(8080);

console.log('listen 8080...');

function dataToObject(data){
  var game_obj = [];
  var game_arr = data.toString().split(/\n/);

  game_arr.forEach(function(elem){

    var game_item = elem.split(';',20);
        game_obj.push({
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
  return game_obj;
};

function normalizeNumbers(game_obj){
    for (game_item of game_obj){
        game_item.game_balls = game_item.game_balls.sort(function(a,b){
           return parseInt(a) - parseInt(b);
        });
    }
    return game_obj;
  };

function sortGamesByNormalizeNumbers(game_obj, sort_type){

  var sort_game_obj = normalizeNumbers(game_obj);
  sort_game_obj = sort_game_obj.sort(function(a,b){
        for (var i = 0; i < a.game_balls.length; i++) {
            if (parseInt(a.game_balls[i]) < parseInt(b.game_balls[i])){
              return sort_type === 'desc'? 1 : -1;
            }
            if (parseInt(a.game_balls[i]) > parseInt(b.game_balls[i])){
              return sort_type === 'desc'? -1 : 1;
            }
          }
    });
  return sort_game_obj;
};

function maxSumArrayElements(game_obj){
  var game_obj_max_sum = [];
  game_obj_max_sum.push(game_obj[0]);
  for (game_item of game_obj){
          var game_balls_sum = sumArrElements(game_item.game_balls);
          if (game_balls_sum > max_sum){
            max_sum = game_balls_sum;
            var game_item_with_max_sum = game_item;
          }
        }
  game_obj_max_sum.push(game_item_with_max_sum);
  return game_obj_max_sum;
};

function minSumArrayElements(game_obj){
  var game_obj_min_sum = [];
  game_obj_min_sum.push(game_obj[0]);
  for (game_item of game_obj){
          var game_balls_sum = sumArrElements(game_item.game_balls);
          if (game_balls_sum < min_sum){
            min_sum = game_balls_sum;
            var game_item_with_min_sum = game_item;
          }
        }
  game_obj_min_sum.push(game_item_with_min_sum);
  return game_obj_min_sum;
};

function sumArrElements(arr){
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    sum+= parseInt(arr[i]);
  }
  return sum;
};

function countRepeatNumbersInRows(game_obj, num_of_rows){
        var count_game_obj = game_obj.slice(-num_of_rows);
        for (game_item of count_game_obj){
          for (var i=0; i<game_item.game_balls.length; i++){
            var num = game_item.game_balls[i];
            num_counts[num] = num_counts[num] ? num_counts[num] + 1 : 1;
          }
        }
    return count_game_obj;
};

function outputResult(game_obj){
  var output = '';
    for (game_item of game_obj){
        output+= '<tr><td>'.concat(game_item.game_num).concat('</td><td>')
                            .concat(game_item.game_date).concat('</td><td>')
                            .concat(game_item.gambler).concat('</td><td>')
                            .concat(game_item.game_set).concat('</td><td>')
                            .concat(game_item.game_balls.join(" ")).concat('</td><td>')
                            .concat(game_item.win_two_numbers).concat('</td><td>')
                            .concat(game_item.prize_three_numbers).concat('</td><td>')
                            .concat(game_item.win_three_numbers).concat('</td><td>')
                            .concat(game_item.prize_three_numbers).concat('</td><td>')
                            .concat(game_item.win_four_numbers).concat('</td><td>')
                            .concat(game_item.prize_four_numbers).concat('</td><td>')
                            .concat(game_item.win_five_numbers).concat('</td><td>')
                            .concat(game_item.prize_five_numbers).concat('</td><td>')
                            .concat(game_item.win_six_numbers).concat('</td><td>')
                            .concat(game_item.prize_six_numbers).concat('</td></tr>');
    }
  return '<table>'+output+'</table>';
};
