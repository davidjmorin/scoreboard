<?php
session_start();
$_SESSION['test'] = "Test";
$_COOKIE['test'] = "Tst";

/**
 * @Author: David Morin
 * @Date:   2021-03-20 18:15:02
 * @Last Modified by:   David Morin
 * @Last Modified time: 2021-04-04 00:27:34
 */
?>
<html>
<head>
<title> Scoreboard </title>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<link rel="stylesheet" href="assets/style.css?v=1.68">


<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>


</head>
<body>

<!--
<?php //if(empty($_COOKIE['url'])){ ?>
<div class="container-fluid">
	<div class="divForm">
		<form class="form1" method="post" action="match.php" id="form1">

				<img src="assets/images/cricketLogo.png" width="300px">
				<span><input type="text" class="form-control" id="url" aria-describedby="urlEntry" name="url" placeholder="Enter Live Scoreboard URL Here"></span>
					<br />
					<p><input  class="btn-lg btn-primary url-btn border" id="urlButton" value="Submit" type="submit" name="Submit"/> </p>

		</form>
	</div>
</div>
<?php //}else { ?>
-->




<div id="carouselFad" class="carousel" >
  <div class="carousel-inner">
    <div class="carousel-item active">
    <div class="row">
		<div class="col-12 title">
			<span id="team1">Team 1</span>
			 VS.
			 <span id="team2">Team 2</span>

		</div>
	</div>
	<div class="row">
		<div class="col-4 text" id="teamname1">
			 <div id="batt1">BAT</div>
		</div>
		<div class="col-4 text">
			 TOTAL
		</div>
		<div class="col-4 text" id="teamname2">
			<div id="batt2">  BAT </div>
		</div>
	</div>
	<div class="row">
		<div class="col-4 bat1" id="bat1">
			 -
		</div>
		<div class="col-4 total bat1" id="total">
			 N/A
		</div>
		<div class="col-4 bat2" id="bat2">
			-
		</div>
	</div>
	<div class="bottom">
		<div class="row line2">
			<div class="col-4 text">
				OVERS
			</div>
			<div class="col-4 text">
				 WKTS
			</div>
			<div class="col-4 text">
				 TARGET
			</div>
		</div>
		<div class="row">
			<div class="col-4 bat1" id="overs">
				 -
			</div>
			<div class="col-4 bat1" id="wick">
				 -
			</div>
			<div class="col-4 bat2" id="target">
				 -
			</div>
		</div>
	</div>
	<!-- close Bottom Class -->
    </div>
    <div class="carousel-item">
		<div class="row line2">
			<div class="col-12 text">
				Add More Content Here
			</div>
		</div>
        <div class="row line2">
			<div class="col-12 text">
				Thank you to our sponsors: <br /> Some Company <br /> Some Company 2
			</div>
		</div>
    </div>
  </div>
</div>

<!-- Scroll
<script>
    $('.carousel').carousel({
  interval: 10000,
  pause: "None"
})
</script>
-->


<div id='demo'></div>

<script>
function score(str) {
    var xmlhttp = new XMLHttpRequest();
	xmlhttp.responseType = 'text';
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
			x = this.responseText
            var data = jQuery.parseJSON(x);
			console.log(data);

			document.getElementById("team1").innerHTML = data.teamA.name;
      			document.getElementById("team2").innerHTML = data.teamB.name;
			//document.getElementById("bat1").innerHTML = data.teamA.runs;

        }
    };
    xmlhttp.open("GET", "mvccLiveScore.json?v=" + Date.now(), true);
    xmlhttp.send();

}
function score2(str) {
    var xmlhttp = new XMLHttpRequest();
	xmlhttp.responseType = 'text';
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
			x = this.responseText
            var data = jQuery.parseJSON(x);
			console.log(data);
			//document.getElementById("total").innerHTML = data.score;
			document.getElementById("target").innerHTML = data.target;
      			document.getElementById("total").innerHTML = data.score;
			document.getElementById("wick").innerHTML = data.wickets;
			document.getElementById("overs").innerHTML = data.overs;
			document.getElementById("bat2").innerHTML = data.batsman2.Runs;
			document.getElementById("bat1").innerHTML = data.batsman1.Runs;
			var onstrike1 = data.batsman1.currentlyOnStrike;
			var onstrike2 = data.batsman2.currentlyOnStrike;
			if(onstrike1 === true){
				document.getElementById("batt1").style.textDecoration = "overline";
			}else{document.getElementById("onstrike1").innerHTML = "";}

			if(onstrike2 === true){
				document.getElementById("batt1").style.textDecoration = "overline";
			}else{document.getElementById("onstrike2").innerHTML = "";}

        }
    };
    xmlhttp.open("GET", "scoreboard.json?v=" + Date.now(), true);
    xmlhttp.send();

}
score();
score2();
setInterval(function() {
    score();
    score2();

    console.log("Teams Updated");

}, 8000)
</script>




</body>
</html>
