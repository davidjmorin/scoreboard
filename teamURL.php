<?php
/**
 * @Author: David Morin
 * @Date:   2021-04-03 13:10:10
 * @Last Modified by:   David Morin
 * @Last Modified time: 2021-04-03 13:11:29
 */

if(isset($_POST['url'])) {
    $data = $_POST['url'];
    $ret = file_put_contents('dataUrl.txt', $data, FILE_APPEND | LOCK_EX);
    
    if($ret === false) {
        die('There was an error writing this file');
    }
    else {
        echo "$ret bytes written to file";
    }
}
else {
   die('no post data to process');
}