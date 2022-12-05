<?php

    $json = file_get_contents("php://input");

    $fileData = array();
    $fileData = json_decode($json, true);

    $fileName = $fileData['fileName'];
    $filePass = $fileData['filePass'];


    //for directory name
    $dirName = "../download/".$fileName."_".$filePass;

    //for img data from a directory
    $imgData = array();
    
    //for the number of the files
    $pageNumber = 0;

    //counting the number of files in the directory (* : the type of files)
    $file = glob(($dirName."/*"));
    if($file != false) {
        $pageNumber = count($file);
    }

    $dirName = "../download/" . $fileName . "_" . $filePass;

    //encoding img data in the directory

    for ($i = 0; $i < $pageNumber; $i++) {

        $dirFileName = $dirName . "/" . $fileName . "_" . $i . ".jpg";

        //base64 encoding 
        $imgData_src = base64_encode(file_get_contents($dirFileName));

        $imgData[$i] = 'data:img/jpeg;base64,' . $imgData_src;

    }


    /*
    *   making json to send to a client
    *   "fileName": $fileName, "fileNumber": $fileNumber, "imgData0":$imgData0 ...
    */
    $sendFileData = array('fileName' => $fileName, 'pageNumber'=> $pageNumber);
    
    for($i = 0; $i < $pageNumber; $i++) {

        $key = "imgData" . $i;

        //adding fileData to rawSendFileData
        $sendFileData[$key] = $imgData[$i];

    }

    header('Context-type: application/json; charset=utf-8');

    echo json_encode($sendFileData);



?>