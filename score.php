<?php
/**
 * @Author: David Morin
 * @Date:   2021-03-20 22:07:29
 * @Last Modified by:   David Morin
 * @Last Modified time: 2021-03-24 19:59:53
 */

$url = $_COOKIE['url'];

include ('assets/scrape/simple_html_dom.php');
    
$html = file_get_html($url);
(strstr($html,'<p>')) ? print("found") : print("not found");
?>


