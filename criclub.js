// Libs
const Nightmare = require('nightmare')
const cheerio = require('cheerio');
const fs = require('fs');

// Consts
const url = 'https://cricclubs.com/MerrimackCricketLeague/viewScorecard.do?matchId=799&clubId=1486';
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

  $('div.row div.col-lg-12 ul.list-inline').each((i, elem) => {      
    if( i === 0 ){
       
      let teamAData  = {...defaultTeamData};
      const teamARunAndWicket = $(elem).find('li:nth-child(1) span.teamName+span').text().split('/');


      teamAData.name = $(elem).find('li:nth-child(1) span.teamName').text();      
      teamAData.runs = teamARunAndWicket[0].trim();
      teamAData.wickets = teamARunAndWicket[1].trim();
      teamAData.overs = $(elem).find('li:nth-child(1) span.teamName+span+br+p').text().split('/')[0];
      if(parseInt(teamAData.runs) > 0){
        teamAData.runRate =  parseFloat(parseInt(teamAData.runs) / parseFloat(teamAData.overs)).toFixed(2).toString();
      }



      let teamBData  = {...defaultTeamData};
      const teamBRunAndWicket = $(elem).find('li:nth-child(4) span.teamName+span').text().split('/');


      teamBData.name = $(elem).find('li:nth-child(4) span.teamName').text();      
      teamBData.runs = teamBRunAndWicket[0].trim();
      teamBData.wickets = teamBRunAndWicket[1].trim();
      teamBData.overs = $(elem).find('li:nth-child(4) span.teamName+span+br+p').text().split('/')[0];

      if(parseInt(teamBData.runs) > 0){
        teamBData.runRate =  parseFloat(parseInt(teamBData.runs) / parseFloat(teamBData.overs)).toFixed(2).toString();
      }

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



function runCricClubsScrapper(){
  console.log('Starting CricClubs scrapping');
  const nightmare = Nightmare({ show: false });
  nightmare
  .goto(url)
  .wait('body')
  .wait('div.container div.match-summary')
  .evaluate(() => document.querySelector('div.container div.match-summary').innerHTML)
  .end()  
  .then(response => {
    getData(response); 
  }).catch(err => {
    console.log(err);
  }).then(()=>{
    console.log('CricClubs scrapping done');
    console.log('/****************************/');        
  }); 
}

setInterval(function(){
  console.log('/****************************/');        
  runCricClubsScrapper();
},interval);
