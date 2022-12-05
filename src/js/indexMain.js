/*
 *
 *   defining variables
 * 
 */

//convertAPI secret
const convertApi = ConvertApi.auth({ secret: 'reaetZymZrmjGXL0' })

var fileNumber = 0

/*
 *   variables to save in localStorage
 *   allFileData = {
 *      fileData0:{
 *          fileName:fileName[i], filePass:filePass[i]
 *      },
 *      fileData1:{
 *      },...
 *   }
 */
var allFileData = {}

var fileData = {}

var fileName = []
var filePass = []

//getting the number of allFileData elements
var fileDataNum = 0

/*
 *
 *   window on load
 * 
 */
$(function() {

    var isFileDataExists = localStorage.hasOwnProperty('fileData0')

    if (isFileDataExists) {


        //getting the number of allFileData elements
        var localstorageElem = []
        for (var i = 0; i < localStorage.length; i++) {
            localstorageElem[i] = localStorage.key(i)

            if (localstorageElem[i].match(/fileData/)) {
                fileDataNum++
            }
        }

        console.log("fileDataNum:" + fileDataNum)

        for (var i = 0; i < fileDataNum; i++) {


            //getting fileName, filePage, filePass of each file
            fileData[i] = JSON.parse(localStorage.getItem(('fileData' + i)))
            fileName[i] = fileData[i]['fileName']
            filePass[i] = fileData[i]['filepass']



            //adding a fileArchive if the file is in the server
            addFileArchive(i)

            //controlling the #archiveArea display
            $('#archiveArea').css('display', 'block')


        }

    }

})

/*
 *
 *   converting a new file 
 *
 */

//getting element of fileInput
var fileInput = document.getElementById('fileInput')

// On file input change, start conversion
$('#fileInput').on('change', async e => {

    //making cursor waiting
    document.documentElement.style.cursor = 'wait'

    try {
        //getting the file name
        var newFileName = fileInput.value.split("\\")[2].split(".pdf")[0]

        //if this file has not saved in localStorage
        console.log("convert start")

        // converting PDF to jpg file
        var params = convertApi.createParams()
        params.add('file', e.currentTarget.files[fileNumber])
        var result = await convertApi.convert('pdf', 'jpg', params)

        console.log("convert finish")


        //acquiring the number of total page
        newFilePage = result.files.length

        /*
         *   an array to make json
         *   rawNewFileData = {
         *       fileName : newFileName,
         *       imgSrc : newImgSrc[]       
         *   }
         */

        var rawNewFileData = {}

        //an array to save in json
        var newImgSrc = []

        //saving img src into newFileSrc[i]
        for (var i = 0; i < newFilePage; i++) {

            newImgSrc[i] = result.files[i].Url

        }


        rawNewFileData['fileName'] = newFileName
        rawNewFileData['imgSrc'] = newImgSrc


        //a json to send to the fileControl.php ("send")
        var jsonNewFileData = JSON.stringify(rawNewFileData)

        //sending json to fileSend.php
        connectPhpSend(jsonNewFileData)


    } finally {
        document.documentElement.style.cursor = 'default'
        fileNumber++

    }
})

/*
 *
 *   selecting an archive file
 *
 */


$(function() {
    $('.archives').click(function() {
        var clickedArchive = $(this).attr('id')

        var clickedArchiveNum = parseInt(clickedArchive.split("archiveFile")[1]) - 1

        var thisFile = "fileData" + clickedArchiveNum

        sessionStorage.setItem('thisFile', thisFile)

        console.log("fileData:" + thisFile)

        window.location.href = 'scroll.html'
    })
})



/*
 *
 *   functions
 *
 */

/*
 *   adding a fileArchive
 */

//for counting the number of the existing files
var fileArchiveNum = 1

function addFileArchive(i) {


    //creating div tag with fileName[i]
    /*
     *  in case of i = 1
     *
     *  <div id="archiveFile1" class="archives">
     *      <div id="selectArchiveFileArea1" class="selectArchiveFileArea">
     *          <div class="archiveNumber"> 1 </div>
     *          <div class="archiveFileName">(fileName[1])</div>
     *      </div>
     *      <div id="clearFile1" class="deleteIcon clearFile">×</div>
     *  </div>
     */

    var archiveCode1 = "<div id=\"archiveFile" + fileArchiveNum + "\" class=\"archives\" >"
    var archiveCode2 = "<div id=\"selectArchiveFile" + fileArchiveNum + "\" class=\"selectArchiveFileArea\">"
    var archiveCode3 = "<div class=\"archiveNumber\">" + fileArchiveNum + "</div>"
    var archiveCode4 = "<div class=\"archiveFileName\">" + fileName[i] + "</div>"
    var archiveCode5 = "</div>"
    var archiveCode6 = "<div id=\"clearFile" + fileArchiveNum + "\" class=\"deleteIcon clearFile\">x</div>"
    var archiveCode7 = "</div>"
    var archiveAppend = archiveCode1 + archiveCode2 + archiveCode3 + archiveCode4 + archiveCode5 + archiveCode6 + archiveCode7
    $('#archiveArea').append(archiveAppend)

    fileArchiveNum++
}




/*
 *   saving fileData in localStorage
 *        fileData1:{
 *            fileName: ~~~~,
 *            filePass: ~~~~
 *        },
 *        fileData2:{
 *        },...
 */

function saveFileData(newFileName, newFilePass) {

    var newFileData = {}

    //saving file data in localStorage("fileData[fileDataNum]")
    newFileData['fileName'] = newFileName
    newFileData['filePass'] = newFilePass

    //this file (key)
    var thisFile = "fileData" + fileDataNum

    //saving allFileData in localStorage
    localStorage.setItem(thisFile, JSON.stringify(newFileData))


    //saving which fileData to use in sessionStorage
    sessionStorage.setItem('thisFile', thisFile)
}


/*
 *   connecting to fileSend.php
 */

function connectPhpSend(json) {

    //type GET だとJSONが遅れない
    $.ajax({
        type: "POST",
        url: "../php/fileSend.php",
        data: json,
        crossDomain: false,
        dataType: "json",
        scriptCharset: 'utf-8'

    }).done(function(data) {

        var sentFilePass = data.filePass
        var sentFileName = data.fileName

        saveFileData(sentFileName, sentFilePass)

        console.log("finished (filePass:" + sentFilePass + ")")

        window.location.href = 'scroll.html'

    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {

        console.log(errorThrown)

    })

}