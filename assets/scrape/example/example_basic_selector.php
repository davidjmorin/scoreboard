<?php
/**
 * @Author: David Morin
 * @Date:   2021-03-20 22:07:29
 * @Last Modified by:   David Morin
 * @Last Modified time: 2021-03-20 22:18:12
 */
 
include('../simple_html_dom.php');

$html = file_get_html('https://www.foxsports.com/college-basketball/boxscore?id=227334');


foreach($html->find('span.score-1') as $ul) {
    foreach($ul->find('span.score-main') as $li)
        echo "Team 1: " . $li->innertext . '<br>';
}

foreach($html->find('span.score-2') as $ul) {
    foreach($ul->find('span.score-main') as $li)
        echo "Team 2: " . $li->innertext . '<br>';
}
?>