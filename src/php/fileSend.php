<?php

if($_POST['mode'] === 'upload_pdf') {
    
    /*
    *   getting content
    */
    $fileParam = array();

    $fileContent = $_FILES['file'];

    /*
    *   getting filename
    */

    $fileName = $_FILES['file']['name'];

    $arrayFileName = explode(".", $fileName);

    $fileParam["fileName"] = $arrayFileName[0];

    error_log($fileParam["fileName"] . "\n", 3, "../logs/debug.log");

    /*
    *   making filePass number
    */

    $fileParam["filePass"] = substr(str_shuffle("abcdefghijkmnpqrstuvwxyz0123456789"), 0, 6);

    /*
    *   leaving access log
    */

    $fileParam["fileDate"] = date("Y/m/d H:i:s");

    $message = "[fileSend.php] (" . $fileParam["fileDate"] . ") name:" . $fileParam["fileName"] . ", filePass:" . $fileParam["filePass"];

   error_log($message . "\n", 3, "../logs/access.log");

    /*
    *   making directory
    */

    $fileParam["directoryName"] = "../downloadPdf/" . $fileParam["fileName"] . "_" . $fileParam["filePass"];

    mkdir($fileParam["directoryName"], 0777);

    /*
    *   saving pdf file in the directory
    */

    $fileParam["directoryName"] = $fileParam["directoryName"] . "/" . $fileParam["fileName"] . ".pdf";

    Storage::put($fileParam["directoryName"], $fileContent);
    

    /*
    *   converting pdf to jpg
    */

    $imagick = new Imagick();

    $imagick->readImage($fileParam["fileName"] . '.pdf');

    $imagick->writeImages('converted.jpg', false);

    /*
    *   sending $filePass to indexMain.js
    */

    $sendFileData['filePass'] = $fileParam["filePass"];

    $sendFileData['fileName'] = $fileParam["fileName"];

    $sendFileData['fileDate'] = $fileParam["fileDate"];

    header('Context-type: application/json; charset=utf-8');

    echo json_encode($sendFileData);


    exit;
}
