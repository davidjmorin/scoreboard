// Libs
const Nightmare = require('nightmare')
const cheerio = require('cheerio');
const fs = require('fs');

// Consts
var data = fs.readFileSync('/var/www/html/scoreboard/dataUrl.txt', 'utf8');
//const url = 'https://www.mscl.org/live/scorecard/ed7941919f69b0e11e800fef/mHcehsPR9S86T3zQv';
console.log(data.toString());
const url = data.toString();
const interval = 10*1000; // every 10 second

let getData = html => {  
  const $ = cheerio.load(html);


  let defaultTeamData = {
    name: '',
    runs: '0',
    wickets: '0',
    overs: '0',
    runRate: '0.0'
  };

  $('div.panel.panel-default').each((i, elem) => {      
    if( i === 0 ){

      const teamNames = $(elem).find('div.panel-heading.elegant-color.white-text h3#result').text().trim().split('vs.');

      const firstInning = $(elem).find('div.row div.col-md-6:nth-child(1)').html().trim().split('<hr>')[1].split('</p>')[0].trim().replace('<p>', '') === 'First Innings';

      const scoreTotalArray = $(elem).find('div.row div.col-md-6:nth-child(1)').html().trim().split('<hr>')[1].split('</p>')[1].trim();      

      /**TEAM-A Data Extraction */

      const teamAFullScore = scoreTotalArray.replace('<p>', '');

      const teamANameAndScore = (teamAFullScore.split('(')[0]);
      const teamAOverAndRR = (teamAFullScore.split('(')[1]);

      let teamAData  = {...defaultTeamData};

      /**TEAM-A Data Extraction */

      if(firstInning){
        teamAData.name = teamANameAndScore.split('-')[0].replace('<b>', '').replace('</b>', '').trim();
        const teamAScore = teamANameAndScore.split('-')[1].replace('<b>', '').replace('</b>', '').trim();
        teamAData.runs = teamAScore.split('/')[0];
        teamAData.wickets = teamAScore.split('/')[1];
        teamAData.overs = teamAOverAndRR.split('|')[0].split('</b>')[1].replace('<b>', '').replace('</b>', '').replace('(', '').replace(')', '').trim();
        teamAData.runRate = teamAOverAndRR.split('|')[1].split('</b>')[1].replace('<b>', '').replace('</b>', '').replace('(', '').replace(')', '').trim();
      }
      else{
        const scoreTotalArrayWhenSecondInning = $(elem).find('div.row div.col-md-6:nth-child(1)').html().trim().split('<hr>')[1].split('</p>');      
        const teamAFullScoreWhenSecondInning = scoreTotalArrayWhenSecondInning[0].replace('<p>', '');
  
        const teamANameAndScoreWhenSecondInning = (teamAFullScoreWhenSecondInning.split('(')[0]);
        const teamAOverAndRRWhenSecondInning = (teamAFullScoreWhenSecondInning.split('(')[1]);
  
        teamAData.name = teamANameAndScoreWhenSecondInning.split('-')[0].replace('<b>', '').replace('</b>', '').trim();
        const teamAScoreWhenSecondInning = teamANameAndScoreWhenSecondInning.split('-')[1].replace('<b>', '').replace('</b>', '').trim();
        teamAData.runs = teamAScoreWhenSecondInning.split('/')[0];
        teamAData.wickets = teamAScoreWhenSecondInning.split('/')[1];
        teamAData.overs = teamAOverAndRRWhenSecondInning.split('|')[0].split('</b>')[1].replace('<b>', '').replace('</b>', '').replace('(', '').replace(')', '').trim();
        teamAData.runRate = teamAOverAndRRWhenSecondInning.split('|')[1].split('</b>')[1].replace('<b>', '').replace('</b>', '').replace('(', '').replace(')', '').trim();
  
        teamAData.name = teamNames[0].trim();
      }
      /**TEAM-A Data Extraction */

      /**TEAM-B Data Extraction */

      let teamBData  = {...defaultTeamData};

      if(!firstInning){
        const teamBFullScore = scoreTotalArray.replace('<p>', '');

        const teamBNameAndScore = (teamBFullScore.split('(')[0]);
        const teamBOverAndRR = (teamBFullScore.split('(')[1]);
  
        teamBData.name = teamBNameAndScore.split('-')[0].replace('<b>', '').replace('</b>', '').trim();
        const teamBScore = teamBNameAndScore.split('-')[1].replace('<b>', '').replace('</b>', '').trim();
        teamBData.runs = teamBScore.split('/')[0];
        teamBData.wickets = teamBScore.split('/')[1];
        teamBData.overs = teamBOverAndRR.split('|')[0].split('</b>')[1].replace('<b>', '').replace('</b>', '').replace('(', '').replace(')', '').trim();
        teamBData.runRate = teamBOverAndRR.split('|')[1].split('</b>')[1].replace('<b>', '').replace('</b>', '').replace('(', '').replace(')', '').trim();  
      }
      else {
        teamBData.name = teamNames[0].toLowerCase() === teamAData.name.replace('XI','').toLowerCase() ? teamNames[1].replace('XI','').trim(): teamNames[0].replace('XI','').trim();
      }
      /**TEAM-B Data Extraction */



      mvccLiveScore ={
        teamA: teamAData, 
        teamB: teamBData,
        lastUpdated: new Date().toLocaleString(),
      };
      console.log(mvccLiveScore);
      fs.writeFileSync('mvccLiveScore.json', JSON.stringify(mvccLiveScore, null, 2), );
    }     
  });

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
