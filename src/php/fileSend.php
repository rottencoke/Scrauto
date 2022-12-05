<?php

    /*
    *   getting posted data from javascript
    */

    $json = file_get_contents("php://input");

    $fileData = array();
    $fileData = json_decode($json, true);

    $fileName = $fileData['fileName'];

    $imgSrc = array();
    $imgSrc = $fileData['imgSrc'];

    /*
    *   making filePass number
    */

    $filePass = substr(str_shuffle("abcdefghijkmnpqrstuvwxyz0123456789"), 0, 6);

    /*
    *   leaving access log
    */

    $date = date("Y/m/d H:i:s");

    $message = "[fileSend.php] (" . $date . ") name:" . $fileName . ", length:" . count($imgSrc) .", filePass:" . $filePass;
    
    error_log($message . "\n", 3, "../logs/access.log");
    
    /*
    *   making directory
    */
    $dirName = "../download/" . $fileName . "_" . $filePass;
    mkdir($dirName, 0777);

    /*
    *   downloading img in the made directory
    *   ./download / $fileName_$filePass / $fileName_0 ~ n-1.jpg
    */
    $imgData = array();

    for($i = 0; $i < count($imgSrc); $i++) {
        $imgData[$i] = file_get_contents($imgSrc[$i]);

        $dirFileName = $dirName . "/" . $fileName . "_" . $i . ".jpg";

        file_put_contents($dirFileName ,$imgData[$i]);
    }

    /*
    *   sending $filePass to indexMain.js
    */

    $sendFileData['filePass'] = $filePass;

    $sendFileData['fileName'] = $fileName;

    header('Context-type: application/json; charset=utf-8');

    echo json_encode($sendFileData);
    
    exit;
?>

