/*
 * acquiring source data from localStorage and sessionStorage
 */

//getting 'this file' from sessionStorage
const thisFile = sessionStorage.getItem('thisFile')

//getting file data from localStorage('fileData')
const fileData = JSON.parse(localStorage.getItem(thisFile))

//acquiring the name of the file
const fileName = fileData['fileName']

//acquiring the pass of the file
const filePass = fileData['filePass']

//showing the file name in #fileName
$('#fileName').html(fileName)

var imgSrc = [] //prepared for the img URL

var totalPageNumber

connectPhpGet()


/*
 *   connecting to fileGet.php
 */

function connectPhpGet() {

    var array = { fileName: fileName, filePass: filePass }

    var json = JSON.stringify(array)

    //type GET だとJSONが遅れない
    $.ajax({
        type: "POST",
        url: "../php/fileGet.php",
        data: json,
        crossDomain: false,
        dataType: "json",
        scriptCharset: 'utf-8'

    }).done(function(data) {

        totalPageNumber = data.pageNumber

        for (var i = 0; i < totalPageNumber; i++) {
            imgSrc[i] = data['imgData' + i]
        }

        showImg()

    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {

        console.log(errorThrown)

    })
}

//executing calcScrollHeight() 100ms after ajax loaded
$(document).ajaxStop(function() {
    setTimeout(function() {
        calcScrollHeight()


    }, 100)

})

/*
 *   showing img
 */
function showImg() {
    for (let i = 0; i < totalPageNumber; i++) {

        //creating img tag with imgSrc[i]
        /*
         *   in case of i = 0
         *      <img id="scrollImg0" class="scrollImg" src="imgSrc[0]" alt="img1">
         *      <span class="scrollImgPageNumber">1/(totalPageNumber)</span>
         */
        var imgAppend1 = "<img id=\"scrollImg" + i + "\" class=\"scrollImg\" src=\"" + imgSrc[i] + "\" alt=\"img" + (i + 1) + "\">"
        var imgAppend2 = "<span class=\"scrollImgPageNumber\">" + (i + 1) + "/" + totalPageNumber + "</span>"
        var imgAppends = imgAppend1 + imgAppend2
        $('#sheetArea').append(imgAppends)

    }
}

$('#scrollArea').on('selectstart', function() {
    return false
})


/*
 *
 *  calculating circle thumb position
 *
 */

//the value of the CENTER of the object
let thumbY = null
let thumbX = null

//the value of the top left of the object(for the css valiables)
let thumbTop = null
let thumbLeft = null
const thumbWidth = getComputedStyle(document.documentElement).getPropertyValue('--scrollBtn-thumb-width').split("px")[0]
const thumbHeight = getComputedStyle(document.documentElement).getPropertyValue('--scrollBtn-thumb-height').split("px")[0]

const circleSize = getComputedStyle(document.documentElement).getPropertyValue('--scrollBtn-size').split("px")[0] //acquiring circle size from :root
var circleCenterX = decimalPlace($('#scrollBtn').offset().left + circleSize / 2, 1) //absolute pos of thumb x
var circleCenterY = decimalPlace($('#scrollBtn').offset().top + circleSize / 2, 1) //absolute pos of thumb y

$(window).resize(function() {
    circleCenterX = decimalPlace($('#scrollBtn').offset().left + circleSize / 2, 1)
    circleCenterY = decimalPlace($('#scrollBtn').offset().top + circleSize / 2, 1)
})

/*
 * dragging the scrollBtn thumb
 */
$(function() {

    var active = false,
        scrollBtnThumbCursorX,
        scrollBtnThumbCursorY

    //when start clicking #scrollBtnThumb
    $('#scrollBtnThumb').on('mousedown', function() {
        active = true
    })

    //when dragging #scrollBtnThumb
    //-->acqCursorPos, calcThumbAngle
    $(document).on('mousemove', function(event) {
        if (!active) return
        acqCursorPos(event)
        calcThumbAngle()

        //saving the dragging condition in sessionStorage
        //sessionStorage.setItem('isDraggingThumb', "on")
        isDraggingThumb = true
    })

    //when finish dragging #scrollBtnThumb
    $(document).on('mouseup', function() {
        active = false

        //saving the dragging condition in sessionStorage
        //sessionStorage.setItem('isDraggingThumb', "off")
        isDraggingThumb = false

    })

    //getting the cursor position
    function acqCursorPos(event) {
        scrollBtnThumbCursorX = decimalPlace((event.pageX), 0)
        scrollBtnThumbCursorY = decimalPlace((event.pageY), 0)
    }

    //calculating thumb the angle of inclining
    //-->calcThumbPos, calcThumbDeg
    function calcThumbAngle() {
        //getting window Y position
        var windowY = window.scrollY

        //the displacement from the center of the circle
        var dX = scrollBtnThumbCursorX - circleCenterX
        var dY = scrollBtnThumbCursorY - circleCenterY - windowY

        //the degree of cursor and the center of the circle
        var thumbPosDegree = Math.atan2(dY, dX) / (Math.PI / 180)
        if (thumbPosDegree <= 0) thumbPosDegree = thumbPosDegree + 360 //making negative value  positive
        if (thumbPosDegree >= 90) thumbPosDegree = thumbPosDegree - 90
        else if (thumbPosDegree < 90) thumbPosDegree = thumbPosDegree + 270
        if (thumbPosDegree > 360) thumbPosDegree = thumbPosDegree - 360 //maximum : 360
        if (thumbPosDegree < 1) thumbPosDegree = 360 //making the value of 0 to 136

        thumbDegPercent = decimalPlace(thumbPosDegree / 3.6, 1) //making it percentage value

        calcThumbPos(thumbDegPercent) //applying degrees
        calcThumbDeg(thumbDegPercent) //applying position

        //setting thumbDegreeShowing to sessionStorage 'thumbDegree'
        //sessionStorage.setItem('thumbDegPercent', thumbPosDegPercent)
    }

    //calculating thumb position based on "thumbPosDegPercent"
    function calcThumbPos(val) {
        thumbY = decimalPlace(circleSize * (Math.cos(Math.PI * val / 50) + 1) * 0.5, 2) //relative pos of thumb x center
        thumbX = decimalPlace(circleSize * ((-1) * Math.sin(Math.PI * val / 50) + 1) * 0.5, 2) //relative pos of thumb y center

        thumbTop = thumbY - thumbHeight / 2
        thumbLeft = thumbX - thumbWidth / 2
        $('#scrollBtnThumb').css('top', thumbTop)
        $('#scrollBtnThumb').css('left', thumbLeft)
    }

    var thumbDegree = null

    //calculating thumb degree based on "thumbPosDegPercent"
    function calcThumbDeg(val) {
        thumbDegree = decimalPlace((3.6 * val), 1) + "deg"
        $('#scrollBtnThumb').css('transform', 'rotate(' + thumbDegree + ')')
        var thumbDegreeShowing = decimalPlace(thumbDegree.split("deg")[0] / 3.6, 0)
        $('#scrollBtnValueShow').html(thumbDegreeShowing + "%")
    }


    // つまみを操作中はテキスト選択できないようにする
    $(document).on('selectstart', function() {
        if (active) return false
    })
})

//scrollBtn scroll repeat img
$('#scrollBtnImg').on('click', function() {
    if (isScrollRepeating) {
        $('#scrollBtnRepeatImg').css('display', 'none')
        isScrollRepeating = false
        console.log("no repeat")
    } else {
        $('#scrollBtnRepeatImg').css('display', 'block')
        isScrollRepeating = true
        console.log("repeat")
    }
})



/*
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *   from animation.js
 *
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*
 *
 * scroll animation basic functions
 *
 */

//if it is scrolling or not
var isScrolling = false

//for deleting the animation
var scrollAnimeElem


//if #sheetArea clicked, scrollChange()
$(function() {
    $('#sheetArea').on('click', function() {
        scrollChange()
    })
})

//switching scroll on off
//-->scrollOff, scrollOn
function scrollChange() {
    if (isScrolling) {
        scrollOff()
    } else {
        scrollOn()
    }
}

//turning scroll On
//-->calcScroll, setScroll
function scrollOn() {
    console.log("SCROLL ON")

    isScrolling = true

    scrollPosition = decimalPlace(windowScrollSpace * scrollTotalProgress, 0)

    scrollAnime()
}

//turning scroll Off
function scrollOff() {
    console.log("SCROLL OFF")
    isScrolling = false
    clearTimeout(scrollAnimeElem)
}

//when scroll finished
function scrollFinish() {
    clearTimeout(scrollAnimeElem)

    scrollPosition = decimalPlace(windowScrollSpace * scrollStartPosition, 0)

    scrollTotalProgress = scrollStartPosition

    setWindowScroll(scrollPosition)

    //when scroll repeat is off
    if (!isScrollRepeating) {
        console.log("finish")
        isScrolling = false
    }

    //when scroll repeat is on
    if (isScrollRepeating) {
        console.log("scroll again")
        scrollOn()
    }
}

//check if the scroll has finished
function scrollFinishCheck() {

    if (scrollTotalProgress >= scrollFinishPosition) {
        scrollFinish()
    }
}


/*
 *
 * scroll animation speed control
 *
 */
/*
 * setting initial values
 */


//the constant for scrollspeed
const multiplyingScrollSpeed = 0.06

//initial value of scroll speed
var scrollSpeed = thumbDegPercent * multiplyingScrollSpeed * multiplyingSettingScrollSpeed

//the start position of scroll (0 ~ 1)
//used when the scroll finished
var scrollStartPosition = 0

//acquiring scroll finish position (0 ~ 1)
var scrollFinishPosition = 1

//the progress of scroll (scrollStartPosition ~ finish position) (0 ~ 1)
//using in case of changing scrollStartPosition and scrollFinishPosition
var scrollRangedProgress = 0

//the progress of scroll (0 ~ 1)
var scrollTotalProgress = 0


const scrollAnime = () => {

    window.scroll(0, scrollPosition)
    scrollPosition = scrollPosition + scrollSpeed
    scrollAnimeElem = setTimeout(scrollAnime, 33)
}

/*
 * calculating the scroll progress
 */


//getting scroll speed from scrollBtnValueShow and setting it
//-->getCurrentPosition, calcScrollDurationTime
setInterval(function() {

    scrollSpeed = decimalPlace(thumbDegPercent * multiplyingScrollSpeed * multiplyingSettingScrollSpeed, 2)

    //acquiring isDraggingThumb from sessionStorage ("on" or "off")
    var hasBeenDraggingThumb = isDraggingThumb

    //recalculating the scroll duration time if isDraggingThumb turn to "off"
    if (hasBeenDraggingThumb) {
        setTimeout(function() {

            //acquiring isDraggingThumb from sessionStorage ("on" or "off")
            var isBeenDraggingThumb = isDraggingThumb

            if (!isBeenDraggingThumb) {
                console.log("changed (" + thumbDegPercent + "%)")
                if (!isScrolling) return
                scrollOff()
                scrollOn()
            }
        }, 33)
    }

    if (isScrolling) {

        scrollFinishCheck()

        if (!isDraggingScrollbarThumb) {
            getAnimationScrollProgress()
            calcScrollbarThumbPosition()
        }
    }



    checkScrollTotalProgress()

}, 33)

//getting scrollTotalProgress from animation scroll
function getAnimationScrollProgress() {
    scrollTotalProgress = decimalPlace(window.scrollY / windowScrollSpace, 3)
}

//setting scroll in a certain position
function setWindowScroll(val) {
    window.scroll(0, val)
}

//checking if scrollTotalProgress is between scrollStartPosition and scrollFinishPosition
function checkScrollTotalProgress() {
    if (scrollTotalProgress < scrollStartPosition) {
        scrollTotalProgress = scrollStartPosition
    } else if (scrollTotalProgress > scrollFinishPosition) {
        scrollTotalProgress = scrollFinishPosition
    }
}

var hasBeenScrolling = false

//detecting wheel scroll and stop scrolling
$(document).ready(function() {
    $('body').bind('mousewheel', function(e) {

        hasBeenScrolling = isScrolling

        if (isScrolling) {
            scrollOff()
            isScrolling = true
        }

    })
})

//restart scroll after detecting wheel scroll
setInterval(function() {
    if (hasBeenScrolling) {
        scrollOn()
        hasBeenScrolling = false
        console.log("restart")
    }

    //this time determines how long it takes to restart scrolling
}, 450)


/*
 *
 *   scroll bar
 *
 */

/*
 *   getting values
 */
//the height of #scrollArea
var scrollAreaHeight

//the height of the shown window
var shownWindowHeight

//the height of #scrollbar
var scrollbarHeight

//the height of scrollbarThumb
var scrollbarThumbHeight

//the height of scrollbar without scrollbarThumb
var scrollbarSpace

//calculating window scroll space
var windowScrollSpace

//the height of #scrollflag
var flagHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--flag-height').split('px')[0])

//the height of flag curve
var curveHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--curve-height').split('px')[0])

//#scrollflag1 top position
var scrollflag1Top = 0

//#scrollflag2 top position
var scrollflag2Top

//the top position of scrollbarThumb for applying
var scrollbarThumbTop = flagHeight

/*
 *   controlling the scroll of the scrollbar and the window
 */

var isDraggingScrollbarThumb = false


//when the size of window changed
$(window).resize(function() {
    calcScrollHeight()

    calcScrollbarFlagPosition()

})

/*
 *   scrolling the window
 */
//when scrolling the window

$(window).on('scroll', function() {
    if (!isDraggingScrollbarThumb) {
        getAnimationScrollProgress()
        calcScrollbarThumbPosition()
    }

})

/*
 *   dragging the scrollbarThumb
 */

//the activity of clicking the scrollbarThumb
var thumbActive = false

//the distanst of dragging position from scrollbarThumb top
var scrollbarThumbCursorY

var hasBeenScrolling = false

//when clicking the scrollbarThumb
$('#scrollbarThumb').on('mousedown', function(event) {
    thumbActive = true

    hasBeenScrolling = isScrolling
    if (isScrolling) scrollOff()

    //the distanst of dragging position from scrollbarThumb top (event data)
    scrollbarThumbCursorY = decimalPlace((event.pageY - $(this).offset().top), 2)

})

//when finish dragging scrollbarThumb
$(document).on('mouseup', function() {
    thumbActive = false
    isDraggingScrollbarThumb = false

    if (hasBeenScrolling) {
        scrollOn()
        hasBeenScrolling = false
    }
})

//when dragging scrollbarThumb
$(document).on('mousemove', function(event) {
    if (!thumbActive) return

    isDraggingScrollbarThumb = true


    //the position of scrollbarThumb top (event data)
    var scrollbarThumbY = decimalPlace(event.pageY - scrollbarThumbCursorY - window.scrollY, 2)

    //setting scrollbarThumbTop wont exceed the range of scrollbar height
    if (scrollbarThumbY < flagHeight) {

        scrollbarThumbY = flagHeight

    } else if (scrollbarThumbY > scrollbarSpace + flagHeight) {

        scrollbarThumbY = scrollbarSpace + flagHeight
    }

    //applying the dragging scrollbar thumb position
    document.documentElement.style.setProperty('--thumb-top', scrollbarThumbY + "px")

    scrollTotalProgress = decimalPlace((scrollbarThumbY - flagHeight) / scrollbarSpace, 3)

    scrollPosition = decimalPlace(windowScrollSpace * scrollTotalProgress, 0)

    //scroll to the dragging position
    setWindowScroll(scrollPosition)

})

/*
 *  dragging scrollbar flag1 (upper one) and flag2 (lower one)
 */

//activity of dragging flags
var flag1Active = false
var flag2Active = false

//the distanst of dragging position from scrollflag1 top
var scrollflag1CursorY

//the distanst of dragging position from scrollflag2 top
var scrollflag2CursorY


//when clicking the scrollflag1
$('#scrollflag1').on('mousedown', function(event) {
    flag1Active = true

    //the distanst of dragging position from scrollflag1 top (event data)
    scrollflag1CursorY = decimalPlace((event.pageY - $(this).offset().top), 2)

})

//when clicking the scrollflag2
$('#scrollflag2').on('mousedown', function(event) {
    flag2Active = true

    //the distanst of dragging position from scrollflag2 top (event data)
    scrollflag2CursorY = decimalPlace((event.pageY - $(this).offset().top), 2)

})

//when finish dragging scrollflags
$(document).on('mouseup', function() {
    flag1Active = false
    flag2Active = false
})

//when dragging scrollbarFlag1
$(document).on('mousemove', function(event) {
    if (!flag1Active) return

    //the position of scrollflag1 top (event data)
    scrollflag1Top = decimalPlace(event.pageY - scrollflag1CursorY - window.scrollY, 2)

    //setting scrollflag1Top in the appropriate range
    if (scrollflag1Top < 0) {

        scrollflag1Top = 0

    } else if (scrollflag1Top > scrollbarThumbTop - flagHeight) {

        scrollflag1Top = scrollbarThumbTop - flagHeight
    }

    //applying the dragging scrollbar flag1 position
    document.documentElement.style.setProperty('--flag1-top', scrollflag1Top + "px")

    scrollStartPosition = decimalPlace(scrollflag1Top / scrollbarSpace, 3)

    console.log("scrollStartPosition:" + scrollStartPosition)
})

//when dragging scrollbarFlag2
$(document).on('mousemove', function(event) {
    if (!flag2Active) return

    //the position of scrollflag2 top (event data)
    scrollflag2Top = decimalPlace(event.pageY - scrollflag2CursorY - window.scrollY, 2)

    //setting scrollflag2Top in the appropriate range
    if (scrollflag2Top < scrollbarThumbTop + scrollbarThumbHeight) {

        scrollflag2Top = scrollbarThumbTop + scrollbarThumbHeight

    } else if (scrollflag2Top > shownWindowHeight - flagHeight) {

        scrollflag2Top = shownWindowHeight - flagHeight
    }

    //applying the dragging scrollbar flag2 position
    document.documentElement.style.setProperty('--flag2-top', scrollflag2Top + "px")

    scrollFinishPosition = decimalPlace(1 - (shownWindowHeight - scrollflag2Top - flagHeight) / scrollbarSpace, 3)

    console.log("scrollFinishPosition:" + scrollFinishPosition)

})

//setting it wont select text while dragging scrollbarThumb
$(document).on('selectstart', function() {
    if (thumbActive || flag1Active || flag2Active) return false
})




/*
 *  calculating scrollTop and scrollthumbTop[px]
 */
//scrWinTop, thumbTop[px]


//calculating windowScrollSpace
function calcScrollHeight() {
    /*
     *   acquiring values
     */
    //the height of the shown window
    shownWindowHeight = $(window).height()

    //the height of #scrollArea
    scrollAreaHeight = $('#scrollArea').height()

    //calculating window scroll space
    windowScrollSpace = scrollAreaHeight - shownWindowHeight

    //the height of #scrollbar
    scrollbarHeight = shownWindowHeight - flagHeight * 2

    //calculating and applying the height of scrollbarThumb
    scrollbarThumbHeight = decimalPlace(scrollbarHeight * (shownWindowHeight / scrollAreaHeight), 0)

    document.documentElement.style.setProperty('--thumb-height', scrollbarThumbHeight + "px")

    //the height of scrollbar without scrollbarThumb
    scrollbarSpace = decimalPlace(scrollbarHeight - scrollbarThumbHeight, 2)
}

//calculating scrollbar thumb position
function calcScrollbarThumbPosition() {
    scrollbarThumbTop = decimalPlace(scrollbarSpace * scrollTotalProgress + flagHeight, 0)

    if (scrollbarThumbTop < scrollflag1Top + flagHeight) {

        scrollbarThumbTop = scrollflag1Top + flagHeight

    } else if (scrollbarThumbTop > scrollflag2Top + scrollbarThumbHeight) {
        scrollbarThumbTop = scrollflag2Top + scrollbarThumbHeight
    }

    document.documentElement.style.setProperty('--thumb-top', scrollbarThumbTop + "px")
}

//calculating scrollbar flag position
function calcScrollbarFlagPosition() {

    console.log("1flagtop : " + scrollflag1Top + ", " + scrollflag2Top)

    scrollflag1Top = decimalPlace(scrollbarSpace * scrollStartPosition, 0)
    scrollflag2Top = decimalPlace(scrollbarSpace * scrollFinishPosition + scrollbarThumbHeight + flagHeight, 0)

    console.log("2flagtop : " + scrollflag1Top + ", " + scrollflag2Top)

    document.documentElement.style.setProperty('--flag1-top', scrollflag1Top + "px")
    document.documentElement.style.setProperty('--flag2-top', scrollflag2Top + "px")
}







/*
 * useful functions
 */


//小数点n位で四捨五入
function decimalPlace(a, n) {
    var ans = Math.floor(a * Math.pow(10, n)) / Math.pow(10, n)
    return ans
}