let video = document.querySelector('video')
let recordBtnCont = document.querySelector('.record-btn-cont')
let recordBtn = document.querySelector('.record-btn')
let captureBtnCont = document.querySelector('.capture-btn-cont')
let captureBtn = document.querySelector('.capture-btn')
let transparentColor = 'transparent'


let recordFlag = false

let constants = {
    audio: true,
    video: true,
}
// navigator is a global obj where this gives info about to browser 

// navigator.mediaDevices.getUserMedia(constants)
// .then((stream) => {
//     video.srcObject = stream;
// })

let recorder;
let chunks = []

navigator.mediaDevices.getUserMedia(constants)
.then((stream) => {
    video.srcObject = stream;

    recorder = new MediaRecorder(stream)
    recorder.addEventListener('start', (e)=>{
        chunks = []
    })
    recorder.addEventListener('dataavailable',(e)=>{
        chunks.push(e.data)

    })
    recorder.addEventListener('stop', (e)=>{
        let blob = new Blob(chunks, {type: 'video/mp4'})
        let videoUrl = URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.href = videoUrl
        a.download = 'stream.mp4'
        a.click()
    })

    recordBtnCont.addEventListener('click',(e)=>{
        if(!recorder) return;

        recordFlag = !recordFlag
        if(recordFlag){
            recorder.start()
            recordBtn.classList.add('scale-record')
            startTimer()
        }else{
            recorder.stop()
            recordBtn.classList.remove('scale-record')
            stopTimer()
        }
    })
})

let timerId ;
let counter = 0
let timer = document.querySelector('.timer')
function startTimer(){
    timer.style.display = 'block'
    function displayTimer(){
        let totalSeconds = counter
        let hours = Number.parseInt(totalSeconds/3600)
        totalSeconds = totalSeconds % 3600
        let minutes = Number.parseInt(totalSeconds/60)
        let seconds = Number.parseInt(totalSeconds%60)
        hours = hours < 10? '0'+hours : hours
        minutes = minutes < 10? '0'+minutes : minutes
        seconds = seconds < 10? '0'+seconds : seconds
        timer.innerText = `${hours}:${minutes}:${seconds}`
        ++counter
    }
    timerId=setInterval(displayTimer, 1000)
}
function stopTimer(){
    clearInterval(timerId)
    timer.style.display = 'none'
    counter = 0
}

captureBtnCont.addEventListener('click', (e)=>{
    captureBtnCont.classList.add('scale-capture')
//     let canvas = document.createElement('canvas')
//     canvas.width = video.videoWidth
//     canvas.height = video.videoHeight
//     let ctx = canvas.getContext('2d')
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
//     let img = canvas.toDataURL('image/png')
//     let a = document.createElement('a')
//     a.href = img
//     a.download = 'image.png'
//     a.click()
//  })
    let canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    let imageURL = canvas.toDataURL('image/jpeg')
    let tool = canvas.getContext('2d')
    tool.drawImage(video, 0, 0, canvas.width, canvas.height)
    tool.fillStyle = transparentColor
    tool.fillRect(0, 0, canvas.width, canvas.height)

    let a = document.createElement('a')
    a.href = imageURL
    a.download = 'image.jpeg'
    a.click()

    setTimeout(() => {
        captureBtnCont.classList.remove('scale-capture')
    }, 500);
})

// filtering logic

let filter = document.querySelector('.filter-layer')

let allFilter = document.querySelectorAll('.filter')
allFilter.forEach(filterElem => {
    filterElem.addEventListener('click' , (e) => {
        //get style
        transparentColor=getComputedStyle(filterElem).getPropertyValue('background-color')
        filter.style.backgroundColor = transparentColor
    })
})