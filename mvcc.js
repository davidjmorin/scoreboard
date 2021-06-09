// Libs
const Nightmare = require('nightmare')
const cheerio = require('cheerio');
const fs = require('fs');

// Consts
//const url = 'https://www.mscl.org/live/scorecard/ed7941919f69b0e11e800fef/mHcehsPR9S86T3zQv';
//const interval = 10*1000; // every 10 second

var data = fs.readFileSync('/var/www/html/scoreboard/dataUrl.txt', 'utf8');
//const url = 'https://www.mscl.org/live/scorecard/ed7941919f69b0e11e800fef/mHcehsPR9S86T3zQv';
console.log(data.toString());
const url = data.toString();

const interval = 10*1000; // every 10 second

// console.log('/++++++++++++++++++++++++++++/');
// console.log(i + '----' +$(elem).html());
// console.log('/++++++++++++++++++++++++++++/');

let getData = html => {
  const $ = cheerio.load(html);

  let defaultBatsman = {
    Name: '',
    Runs: '0',
    Balls: '0',
    StrikeRate: '0.0',
    currentlyOnStrike: false,
  };

  let defaultBowler = {
    Name: '',
    CurrentOverBalls: '',
    CurrentOverGivenRuns: '',
    Wickets: '',
    EconomyRate: '',
  };

  let mvccLiveScore = {
    batsman1: {...defaultBatsman},
    batsman2: {...defaultBatsman},
    bowler: {...defaultBowler},
    battingOrder: '',
    battingTeam: '',
    lastEightBalls: [],
    lastUpdated: '0',
    overs: '0',
    requiredRunRate: '0',
    requiredToWin: 'TBD',
    runRate: '0',
    score: '0',
    target: '0',
    wickets: '0'
  };

  $('div.panel.panel-default').each((i, elem) => {
    if( i === 0 ){
      const scoreTotalArray = $(elem).find('div.row div.col-md-6:nth-child(1)').html().trim().split('<hr>')[1].split('</p>');

      /**TEAM-A Data Extraction */

      const teamAFullScore = scoreTotalArray[0].replace('<p>', '');

      const teamANameAndScore = (teamAFullScore.split('(')[0]);
      const teamAOverAndRR = (teamAFullScore.split('(')[1]);

      const teamAName = teamANameAndScore.split('-')[0].replace('<b>', '').replace('</b>', '').trim();
      const teamAScore = teamANameAndScore.split('-')[1].replace('<b>', '').replace('</b>', '').trim();
      const teamARuns = teamAScore.split('/')[0];
      const teamAWickets = teamAScore.split('/')[1];
      const teamAOvers = teamAOverAndRR.split('|')[0].split('</b>')[1].replace('<b>', '').replace('</b>', '').replace('(', '').replace(')', '').trim();
      const teamARR = teamAOverAndRR.split('|')[1].split('</b>')[1].replace('<b>', '').replace('</b>', '').replace('(', '').replace(')', '').trim();

      /**TEAM-B Data Extraction */

      const teamBFullScore = scoreTotalArray[1].replace('<p>', '');

      const teamBNameAndScore = (teamBFullScore.split('(')[0]);
      const teamBOverAndRR = (teamBFullScore.split('(')[1]);

      const teamBName = teamBNameAndScore.split('-')[0].replace('<b>', '').replace('</b>', '').trim();
      const teamBScore = teamBNameAndScore.split('-')[1].replace('<b>', '').replace('</b>', '').trim();
      const teamBRuns = teamBScore.split('/')[0];
      const teamBWickets = teamBScore.split('/')[1];
      const teamBOvers = teamBOverAndRR.split('|')[0].split('</b>')[1].replace('<b>', '').replace('</b>', '').replace('(', '').replace(')', '').trim();
      const teamBRR = teamBOverAndRR.split('|')[1].split('</b>')[1].replace('<b>', '').replace('</b>', '').replace('(', '').replace(')', '').trim();

      mvccLiveScore ={
        teamA: {
          name:teamAName,
          runs: teamARuns,
          wickets: teamAWickets,
          overs: teamAOvers,
          runRate: teamARR
        },
        teamB:{
          name:teamBName,
          runs: teamBRuns,
          wickets: teamBWickets,
          overs: teamBOvers,
          runRate: teamBRR
        },
        lastUpdated: new Date().toLocaleString(),
      };
      console.log(mvccLiveScore);
      fs.writeFileSync('mvccLiveScore.json', JSON.stringify(mvccLiveScore, null, 2), );
    }
  });

  // $('div.container-fluid.liveMatchSummaryTab div.row div.col-md-6 div.container-fluid div.row').each((i, elem) => {
  //   if( i === 0 ){
  //     mvccLiveScore.battingTeam = $(elem).find('div.row:nth-child(1) div:nth-child(1) h5').html();
  //     mvccLiveScore.score = $(elem).find('div.row:nth-child(1) div:nth-child(2) h5').text().split('/')[0];
  //     mvccLiveScore.wickets = $(elem).find('div.row:nth-child(1) div:nth-child(2) h5').text().split('/')[1];
  //   }
  //   else if (i===1){
  //     let targetOrTotal = $(elem).find('div.col-xs-8.text-left b').html();
  //     if(targetOrTotal && targetOrTotal.split(':')[0] === 'Target'){
  //       mvccLiveScore.battingOrder = 2;
  //       mvccLiveScore.target = targetOrTotal.split(':')[1].trim();
  //       mvccLiveScore.requiredToWin = $(elem).find('div+div.col-xs-4.text-right b').html();
  //       mvccLiveScore.requiredRunRate = $(elem).find('div+div.col-xs-4.text-right').text().split('\n')[4].split(':')[1].trim();
  //     }
  //     else{
  //       mvccLiveScore.battingOrder = 1;
  //     }
  //     mvccLiveScore.overs = $(elem).find('div.col-xs-8.text-left').text().split('\n')[5].split('|')[0].split(':')[1].trim();
  //     mvccLiveScore.runRate = $(elem).find('div.col-xs-8.text-left').text().split('\n')[5].split('|')[1].split(':')[1].trim();
  //   }
  //   else if(i === 3){
  //     $(elem).find('div.row:nth-child(4) div:nth-child(1) h4 span').each(function(index){
  //         mvccLiveScore.lastEightBalls.push($( this ).text().trim());
  //     });
  //   }
  // });

  // $('div.col-md-6+div.col-md-6 div.container-fluid div.row').each((i, elem) => {
  //   if( i === 0 ){
  //     mvccLiveScore.batsman1.Name = $(elem).find('div.col-xs-9.capitalized').text().trim();
  //     mvccLiveScore.batsman1.currentlyOnStrike = mvccLiveScore.batsman1.Name.indexOf('*') > -1;
  //     mvccLiveScore.batsman1.Runs = $(elem).find('div+div.col-xs-3.text-right').text().trim();
  //   }
  //   else if( i === 1 ){
  //       mvccLiveScore.batsman1.Balls = $(elem).find('div.col-xs-12').text().trim().split('|')[0].split(':')[1].trim();
  //       mvccLiveScore.batsman1.StrikeRate = $(elem).find('div.col-xs-12').text().trim().split('|')[1].split(':')[1].trim();
  //   }
  //   else if( i === 2 ){
  //       mvccLiveScore.batsman2.Name = $(elem).find('div.col-xs-9.capitalized').text().trim();
  //       mvccLiveScore.batsman2.currentlyOnStrike = mvccLiveScore.batsman2.Name.indexOf('*') > -1;
  //       mvccLiveScore.batsman2.Runs = $(elem).find('div+div.col-xs-3.text-right').text().trim();

  //   }
  //   else if( i === 3 ){
  //     mvccLiveScore.batsman2.Balls = $(elem).find('div.col-xs-12').text().trim().split('|')[0].split(':')[1].trim();
  //     mvccLiveScore.batsman2.StrikeRate = $(elem).find('div.col-xs-12').text().trim().split('|')[1].split(':')[1].trim();
  //   }
  //   else if( i === 4 ){
  //     mvccLiveScore.bowler.Name = $(elem).find('div.col-xs-9.capitalized').text().trim();
  //     mvccLiveScore.bowler.CurrentOverBalls = $(elem).find('div+div.col-xs-3.text-right').text().trim();
  //   }
  //   else if( i === 5 ){
  //     mvccLiveScore.bowler.CurrentOverGivenRuns = $(elem).find('div.col-xs-12').text().trim().split('|')[0].split(':')[1].trim();
  //     mvccLiveScore.bowler.Wickets = $(elem).find('div.col-xs-12').text().trim().split('|')[1].split(':')[1].trim();
  //     mvccLiveScore.bowler.EconomyRate = $(elem).find('div.col-xs-12').text().trim().split('|')[2].split(':')[1].trim();
  //   }
  // });


  // if(mvccLiveScore.battingOrder === 2){
  //   $('div.container-fluid.liveMatchSummaryTab+div div.container-fluid.liveMatchSummaryTab ul.collection.with-header li:nth-child(2).collection-item.avatar.grey.lighten-3').each((i, elem) => {
  //     //div.row div+ul+div.tab-content div.firstInningsCommentary ul li i+small+span
  //     if( i === 0 ){
  //       let firstInningTeam = $(elem).find('li.collection-item.avatar.grey.lighten-3 i+small+span+p').html();
  //       let firstInningTeamNameArray = firstInningTeam.split('/')[0].split(' ');

  //       mvccLiveScore.firstBattingTeamName = '';
  //       firstInningTeamNameArray.forEach((arrayElement,index) => {
  //         if( index !== firstInningTeamNameArray.length-1){

  //           if( index === 0 ){
  //             mvccLiveScore.firstBattingTeamName = arrayElement;
  //           }
  //           else{
  //             mvccLiveScore.firstBattingTeamName = mvccLiveScore.firstBattingTeamName + ' ' + arrayElement;
  //           }
  //         }
  //       });
  //     }
  //   });
  // }

  // $('div.main-content.container ul li+a#scorecardTabAnchor').
  // mvccLiveScore.lastUpdated = new Date().toLocaleString();
  // console.log(mvccLiveScore);



  // let data = '<html><head><script>setTimeout(function(){window.location.reload(1);}, 5000)</script></head><body>'
  //             + 'Battimg Team: '+ mvccLiveScore.battingTeam + '</br>'
  //             + 'Score: ' + mvccLiveScore.score + '</br>'
  //             + 'Last Updated on: '+mvccLiveScore.lastChecked
  //             +'</body></html>';
  // fs.writeFileSync('mvccLiveScore.html', data);
  // fs.writeFileSync('mvccLiveScore.json', JSON.stringify(mvccLiveScore, null, 2), );
}



function runMvccScrapper(){
  console.log('Starting the scrapping');
  const nightmare = Nightmare({ show: false });
  nightmare
  .goto(url)
  .wait('body')
  .wait('div#summaryTab.tab-pane.fade.in.table-responsive.borderless.active')
  .click('li a#scorecardTabAnchor')
  .evaluate(() => document.querySelector('div#summaryTab.tab-pane.fade.in.table-responsive.borderless.active').innerHTML)
  .end()
  .then(response => {
    getData(response);
  }).catch(err => {
    console.log(err);
  }).then(()=>{
    console.log('Scrapping is done');
    console.log('/****************************/');
  });
}

setInterval(function(){
  console.log('/****************************/');
  runMvccScrapper();
},interval);
