/*
 *  showing modal window
 */


$(function() {
    //the modal shown now
    var currentModal

    //when click the #settingBtn
    $('#settingBtn').on('click', function() {
        $('body').append('<div id="modalBackground"></div>')
        modalResize()

        //showing modal window
        $('#modalBackground, #modalWindow').fadeIn("fast")

        //closing modal window when click #modalBackground
        $('#modalBackground').click(function() {
            $('#modalWindow, #modalBackground').fadeOut("fast", function() {

                //deleting the <div id="modalBackground"></div>
                $('#modalBackground').remove()
            })
            console.log("modal window off")
            console.log("")
        })
        $(window).resize(modalResize)

        function modalResize() {
            var w = $(window).width()
            var h = $(window).height()
            var cw = $('#modalWindow').outerWidth()
            var ch = $('#modalWindow').outerHeight()

            //apply the acquired variable
            $('#modalWindow').css({
                "left": ((w - cw) / 2) + "px",
                "top": ((h - ch) / 2) + "px"
            })
        }
    })
})


/*
 *   jumping to the second level items
 */
$(function() {
    //when click the #basicSettingBtn
    $('#smBasicSetting').on('click', function() {
        currentModal = '#settingMenuModal'
        switchModal('#basicSettingModal')
    })

    //when click the #scrollSettingBtn
    $('#smScrollSetting').on('click', function() {
        currentModal = '#settingMenuModal'
        switchModal('#scrollSettingModal')
    })

    //when click the #showSettingBtn
    $('#smShowSetting').on('click', function() {
        currentModal = '#settingMenuModal'
        switchModal('#showSettingModal')
    })

    //when click the #advancedSettingBtn
    $('#smAdvancedSetting').on('click', function() {
        currentModal = '#settingMenuModal'
        switchModal('#advancedSettingModal')
    })

    /*
     *   jumping to the third level items
     */

    //when click the #smSheetCut
    $('#smSheetCutSetting').on('click', function() {
        switchModal('#sheetCutSettingModal')
    })

    //when click the #smZoom
    $('#smZoomSetting').on('click', function() {
        switchModal('#zoomSettingModal')
    })

    //when click the #smScrollSpeed
    $('#smScrollSpeedSetting').on('click', function() {
        switchModal('#scrollSpeedSettingModal')
    })

    /*
     *   arrow back icon
     */

    //when click the .smPageBack (go back to Menu modal)
    $('.smPageBack').on('click', function() {
        jumpPreviousModal()
    })

    /*
     *   jumping to the parent page when click smArrowBack
     */

    //saving modals
    var previousModals = []

    //if the arrowBack is used
    var isPageBack = false

    function jumpPreviousModal() {
        isPageBack = true

        //getting the parent modal
        var parentModal = previousModals[previousModals.length - 1]

        //deleting the last element of previousModals[]
        previousModals.pop()

        console.log("parentModal : " + parentModal)
        switchModal(parentModal)
    }

    //switch the modal display ('#---')
    function switchModal(nextModal) {
        $(currentModal).css('display', 'none')
        $(nextModal).css('display', 'block')

        //changing the color of the arrowBack icon
        if (nextModal == '#settingMenuModal') {
            //color gets thinner
            $('.smArrowBack').css('filter', 'invert(0.7)')
        } else {
            //color gets thicker
            $('.smArrowBack').css('filter', 'invert(0.3)')
        }
        console.log("switch modal : " + currentModal + " -> " + nextModal)

        //saving previous modals in an array only if not return to previous page
        if (!isPageBack) {
            previousModals.push(currentModal)
            console.log("previousModals[] : " + previousModals)
        }
        isPageBack = false

        currentModal = nextModal
        console.log("currentModal : " + currentModal)
        console.log("")
    }

})

/*
 *   getting config in localStorage
 */

//for saving each config
var config = {}

//for the config of "sheetCut"
var configSheetCut

$(function() {
    if (localStorage.getItem('fileData-config') === null) return
    config = JSON.parse(localStorage.getItem('fileData-config'))

    if ("sheetCut" in config) {
        configSheetCut = config['sheetCut']
        setSheetCut()
    }
})


/*
 *   #sheetCutSettingModal
 */

//for sheetCutNum checkbox
var isSheetCutNumTopChecked = false,
    isSheetCutNumBottomChecked = false,
    isSheetCutNumFirstChecked = false,
    isSheetCutNumLastChecked = false

//for shettCutNum
var sheetCutNumTop, sheetCutNumBottom, sheetCutNumLast

//defining the sheetCutPreviewImg height (px)
const sheetCutPreviewImgInitialHeight = 226

//getting the scrollImg height (px)
var scrollImgInitialHeight

function setSheetCut() {

    if (configSheetCut['top'] != false) {
        isSheetCutNumTopChecked = true
        $('#sheetCutCheckTop').prop('checked', true)
        $('#sheetCutShowTop').css('display', 'block')
        sheetCutNumTop = configSheetCut['top'].split("%")[0]
        $('#sheetCutNumTop').val(sheetCutNumTop)
    }

    if (configSheetCut['bottom'] != false) {
        isSheetCutNumBottomChecked = true
        $('#sheetCutCheckBottom').prop('checked', true)
        $('#sheetCutShowBottom').css('display', 'block')
        sheetCutNumBottom = configSheetCut['bottom'].split("%")[0]
        $('#sheetCutNumBottom').val(sheetCutNumBottom)
    }

    if (configSheetCut['first']) {
        isSheetCutNumFirstChecked = true
        $('#sheetCutCheckFirst').prop('checked', true)
    }

    if (configSheetCut['last'] != false) {
        isSheetCutNumLastChecked = true
        $('#sheetCutCheckLast').prop('checked', true)
        $('#sheetCutShowLast').css('display', 'block')
        sheetCutNumLast = configSheetCut['last'].split("%")[0]
        $('#sheetCutNumLast').val(sheetCutNumLast)
    }

    sheetCutPreviewImgCut()

    scrollImgCut()
}

//#sheetCut checkbox
$(window).on('load', function() {
    //the object of focus()
    var focusObject = null

    $('#sheetCutCheckTop').change(function() {



        //if checkbox clicked, showing element
        //#sheetCutShowTop
        if ($('#sheetCutCheckTop').prop('checked')) {
            $('#sheetCutShowTop').css('display', 'block')
            focusObject = '#sheetCutNumTop'
            focus()
        } else {
            $('#sheetCutShowTop').css('display', 'none')
            focusObject = null
            blur()
        }
    })

    $('#sheetCutCheckBottom').change(function() {
        //#sheetCutShowBottom
        if ($('#sheetCutCheckBottom').prop('checked')) {
            $('#sheetCutShowBottom').css('display', 'block')
            focusObject = '#sheetCutNumBottom'
            focus()
        } else {
            $('#sheetCutShowBottom').css('display', 'none')
            focusObject = null
            blur()
        }
    })

    $('#sheetCutCheckLast').change(function() {

        //#sheetCutShowLast
        if ($('#sheetCutCheckLast').prop('checked')) {
            $('#sheetCutShowLast').css('display', 'block')
            focusObject = '#sheetCutNumLast'
            focus()
        } else {
            $('#sheetCutShowLast').css('display', 'none')
            focusObject = null
            blur()
        }


    })

    //selecting sheetCutNum (focus(), blur())
    function focus() {
        $(focusObject).focus()
    }

    function blur() {
        $('#sheetCutNumTop').blur()
        $('#sheetCutNumBottom').blur()
        $('#sheetCutNumLast').blur()
    }

    /*
     *  .sheetCutNumBox is inputted only with number
     */
    //disabling event function
    const disableEvent = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    //disabling drop
    $('.sheetCutNumBox').on('drop', disableEvent)

    //disabling paste
    $('.sheetCutNumBox').bind('paste', disableEvent)

    //disabling input text except for numbers
    $('.sheetCutNumBox').keyup(function(e) {
        let tmp = []

        this.value.split("").forEach(function(item, i) {
            if (item.match(/[0-9]/gi)) {
                tmp.push(item)
            }
        })

        if (tmp.length > 0) {
            this.value = tmp.join("")
        } else {
            this.value = ""
        }
    })



    scrollImgInitialHeight = $('#scrollImg0').height()
    document.documentElement.style.setProperty('--scrollImg-height', scrollImgInitialHeight + 'px')

    sheetCutPreviewImgCut()

    scrollImgCut()

    //acquiring the img height(%) when "enter" key pressed
    $(document).on('keypress', function(e) {
        if (e.which == 13) {
            sheetCutNumTop = parseInt($('#sheetCutNumTop').val())
            sheetCutNumBottom = parseInt($('#sheetCutNumBottom').val())
            sheetCutNumLast = parseInt($('#sheetCutNumLast').val())

            isSheetCutNumTopChecked = $('#sheetCutCheckTop').prop('checked')
            isSheetCutNumBottomChecked = $('#sheetCutCheckBottom').prop('checked')
            isSheetCutNumFirstChecked = $('#sheetCutCheckFirst').prop('checked')
            isSheetCutNumLastChecked = $('#sheetCutCheckLast').prop('checked')

            if (sheetCutNumTop > 0 || sheetCutNumBottom > 0 || sheetCutNumLast > 0) {
                sheetCutPreviewImgCut()

                scrollImgCut()

                saveSheetCut()
            }
        }
    })



    function saveSheetCut() {
        var sheetCut = {}
        sheetCut['top'] = isSheetCutNumTopChecked ? sheetCutNumTop + "%" : isSheetCutNumTopChecked
        sheetCut['bottom'] = isSheetCutNumBottomChecked ? sheetCutNumBottom + "%" : isSheetCutNumBottomChecked
        sheetCut['first'] = isSheetCutNumFirstChecked
        sheetCut['last'] = isSheetCutNumLastChecked ? sheetCutNumLast + "%" : isSheetCutNumLastChecked

        config['sheetCut'] = sheetCut

        localStorage.setItem('config', JSON.stringify(config))
    }

})

//calculating and setting .sheetCutPreviewImg height and object-position y value
function sheetCutPreviewImgCut() {
    var sheetCutPreviewImgCalcHeight = decimalPlace(sheetCutPreviewImgInitialHeight * (100 - sheetCutNumTop - sheetCutNumBottom) / 100, 0)

    document.documentElement.style.setProperty('--sheetCutPreviewImg-height', sheetCutPreviewImgCalcHeight + 'px')

    var sheetCutPreviewImgObjectPositionY = (sheetCutNumTop / (sheetCutNumTop + sheetCutNumBottom)) * 100

    $('.sheetCutPreviewImg').css('object-position', '50% ' + sheetCutPreviewImgObjectPositionY + "%")

    if (isSheetCutNumFirstChecked) {
        var sheetCutPreviewImg1CalcHeight = decimalPlace(sheetCutPreviewImgInitialHeight * (100 - sheetCutNumBottom) / 100, 0)

        $('.sheetCutPreviewImg:first').css('height', sheetCutPreviewImg1CalcHeight + "px")

        $('.sheetCutPreviewImg:first').css('object-position', '50% 0%')
    }

    if (isSheetCutNumLastChecked) {
        var sheetCutPreviewLastImgCalcHeight = decimalPlace(sheetCutPreviewImgInitialHeight * (100 - sheetCutNumTop - sheetCutNumLast) / 100, 0)

        $('.sheetCutPreviewImg:last').css('height', sheetCutPreviewLastImgCalcHeight + "px")

        var sheetCutPreviewLastImgObjectPositionY = (sheetCutNumTop / (sheetCutNumTop + sheetCutNumLast)) * 100

        $('.sheetCutPreviewImg:last').css('object-position', '50% ' + sheetCutPreviewLastImgObjectPositionY + "%")

    }
}

//calculating and setting .scrollImg height and object-position y value
function scrollImgCut() {
    var scrollImgCalcHeight = decimalPlace(scrollImgInitialHeight * (100 - sheetCutNumTop - sheetCutNumBottom) / 100, 0)

    document.documentElement.style.setProperty('--scrollImg-height', scrollImgCalcHeight + 'px')

    var scrollImgObjectPositionY = (sheetCutNumTop / (sheetCutNumTop + sheetCutNumBottom)) * 100

    $('.scrollImg').css('object-position', '50% ' + scrollImgObjectPositionY + "%")

    if (isSheetCutNumFirstChecked) {
        var scrollImg1CalcHeight = decimalPlace(scrollImgInitialHeight * (100 - sheetCutNumBottom) / 100, 0)

        $('.scrollImg:first').css('height', scrollImg1CalcHeight + "px")

        $('.scrollImg:first').css('object-position', '50% 0%')
    }

    if (isSheetCutNumLastChecked) {
        var scrollLastImgCalcHeight = decimalPlace(scrollImgInitialHeight * (100 - sheetCutNumTop - sheetCutNumLast) / 100, 0)

        $('.scrollImg:last').css('height', scrollLastImgCalcHeight + "px")

        var scrollLastImgObjectPositionY = (sheetCutNumTop / (sheetCutNumTop + sheetCutNumLast)) * 100

        $('.scrollImg:last').css('object-position', '50% ' + scrollLastImgObjectPositionY + "%")

    }
}

//showing the sheetCutPreviewImg
for (let i = 0; i < totalPageNumber; i++) {

    //substituting the img URL
    imgSrc[i] = fileData['imgSrc' + i]

    //creating img tag with imgSrc[i]
    /*
     *   in case of i = 0
     *   <img id="sheetCutPreviewImg0" class="sheetCutPreviewImg" src="imgSrc[0]" alt="img1">
     *   <div class="sheetCutPreviewImgLine"></div> //added if i < totalPageNumber - 1
     */
    var sheetCutPreviewCodes

    var sheetCutPreviewCode1 = "<img id=\"sheetCutPreviewImg" + i + "\" class=\"sheetCutPreviewImg\" src=" + imgSrc[i] + " alt=\"img" + (i + 1) + "\">"
    if (i < totalPageNumber - 1) {
        var sheetCutPreviewCode2 = "<div class=\"sheetCutPreviewImgLine\"></div>"
        sheetCutPreviewCodes = sheetCutPreviewCode1 + sheetCutPreviewCode2
    } else {
        sheetCutPreviewCodes = sheetCutPreviewCode1
    }
    $('#sheetCutPreview').append(sheetCutPreviewCodes)
}

/* 
 *   #scrollSpeedSetting
 */

$(window).on('load', function() {
    $('#scrollSpeedSettingRange').on('change', function() {
        multiplyingSettingScrollSpeed = $('#scrollSpeedSettingRange').val()
        console.log("value : " + multiplyingSettingScrollSpeed)
        $('#scrollSpeedSettingRangeValue').html(multiplyingSettingScrollSpeed)

        saveScrollSpeed()
    })
})

function saveScrollSpeed() {
    var scrollSpeed = {}
    scrollSpeed['multiplyingValue'] = multiplyingSettingScrollSpeed

    config['scrollSpeed'] = multiplyingSettingScrollSpeed

    localStorage.setItem('config', JSON.stringify(config))

}

/*
 *   #zoomSetting
 */
var zoomSettingSheetWidth = 80

$(window).on('load', function() {

    zoomSettingSheetWidth = config['zoomSetting']
    document.documentElement.style.setProperty('--scrollImg-width', '80%')

    $('#zoomSettingRange').on('change', function() {
        zoomSettingSheetWidth = $('#zoomSettingRange').val()
        console.log("value : " + zoomSettingSheetWidth)

        setZoomSetting()

        saveZoomSetting()
    })
})

function saveZoomSetting() {
    var zoomSetting = {}
    zoomSetting['multiplyingValue'] = zoomSettingSheetWidth

    config['zoomSetting'] = zoomSettingSheetWidth

    localStorage.setItem('config', JSON.stringify(config))

}

function setZoomSetting() {
    console.log("zoom set")

    var zoomSettingSheetWidthShow = decimalPlace(zoomSettingSheetWidth * 1.25, 0)
    $('#zoomSettingRangeValue').html(zoomSettingSheetWidthShow + "%")

    document.documentElement.style.setProperty('--scrollImg-width', zoomSettingSheetWidth + '%')
}


/*
 * useful functions
 */

//小数点n位で四捨五入
function decimalPlace(a, n) {
    var ans = Math.floor(a * Math.pow(10, n)) / Math.pow(10, n)
    return ans
}