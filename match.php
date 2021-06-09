
<?php 
/**
 * @Author: David Morin
 * @Date:   2021-03-21 01:02:27
 * @Last Modified by:   David Morin
 * @Last Modified time: 2021-04-04 00:29:58
 */

session_start();
if(isset($_POST['url'])) {
    $url = $_POST['url'];

    setcookie("url", $url, time()+43200, "/", "", false, false);

        $ret = file_put_contents('dataUrl.txt', $url);
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

header('Location: index.php');

