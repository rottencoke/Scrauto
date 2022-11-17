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
    showArchiveFile()
})

function showArchiveFile() {

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

    } else {
        //controlling the #archiveArea display
        $('#archiveArea').css('display', 'none')
    }

}

/*
 *
 *   converting a new file
 *
 */

//getting element of fileInput
var fileInput = document.getElementById('fileInput')

// On file input change, start conversion
$(function() {
    $(document).on("change", "[name='file_input']", function() {

        //making cursor waiting
        document.documentElement.style.cursor = 'wait'

        var fileObject = $(this)

        if (fileObject.val() !== '') {

            var files = fileObject.prop("files")

            if (files.length > 1) {

                console.log("Error:ファイルが複数選択されています")

            } else {

                var fd = new FormData()

                fd.append("mode", "upload_pdf")

                fd.append("file", fileObject.prop("files")[0])

                var postData = {
                    type: "POST",
                    dataType: "json",
                    data: fd,
                    processData: false,
                    contentType: false
                }

                $.ajax(
                    'php/fileSend.php',
                    postData

                ).done(function(data) {

                    var sentFilePass = data.filePass
                    var sentFileName = data.fileName
                    var sentFileDate = data.fileDate

                    saveFileData(sentFileName, sentFilePass, sentFileDate)

                    console.log("finished (filePass:" + sentFilePass + ")")

                    document.documentElement.style.cursor = 'auto'

                    window.location.href = 'scroll.html'

                }).fail(function(XMLHttpRequest, textStatus, errorThrown) {

                    console.log(errorThrown)

                })
            }
        }
    })
})

/*
 *
 *   selecting an archive file
 *
 */

//selecting an archive file
$(function() {
    $('.selectArchiveFileArea').click(function() {

        //getting clicked #selectArchiveFile
        var clickedArchive = $(this).attr('id')

        //getting the order of the clicked file
        var clickedArchiveNum = parseInt(clickedArchive.split("selectArchiveFile")[1]) - 1

        var thisFile = "fileData" + clickedArchiveNum

        sessionStorage.setItem('thisFile', thisFile)

        console.log("fileData:" + thisFile)

        window.location.href = 'scroll.html'
    })
})

//deleting an archive file
$(function() {
    $('.clearFile').click(function() {

        //getting clicked #clearFile
        var clickedClearFile = $(this).attr('id')

        //getting the order of the clicked file
        var clickedClearFileNum = parseInt(clickedClearFile.split("clearFile")[1]) - 1

        var thisFile = "fileData" + clickedClearFileNum

        localStorage.removeItem(thisFile)

        console.log(thisFile + " removed")
    })
})

//deleting all archive files
$(function() {
    $('#allArchiveClearBtn').click(function() {
        localStorage.clear()

        console.log("localStorage cleared")

        showArchiveFile()
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
 *            filePass: ~~~~,
 *            fileDate: ~~~~
 *        },
 *        fileData2:{
 *        },...
 */

function saveFileData(fileName, filePass, fileDate) {

    var newFileData = {}

    //saving file data in localStorage("fileData[fileDataNum]")
    newFileData['fileName'] = fileName
    newFileData['filePass'] = filePass
    newFileData['fileDate'] = fileDate

    //this file (key)
    var thisFile = "fileData" + fileDataNum

    //saving allFileData in localStorage
    localStorage.setItem(thisFile, JSON.stringify(newFileData))


    //saving which fileData to use in sessionStorage
    sessionStorage.setItem('thisFile', thisFile)
}