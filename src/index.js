import { QRCodeReader, HTMLCanvasElementLuminanceSource, BinaryBitmap, HybridBinarizer } from '@zxing/library';

var screen = document.createElement("div");

function close() {
    (document.exitFullscreen ||
        document.msExitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen).call(document);
}


let video = document.createElement("Video");

let canvas = document.createElement("canvas");

screen.appendChild(video);
screen.appendChild(canvas);
screen.addEventListener("click", close, false);
const codeReader = new QRCodeReader();

function click() {
    return new Promise((res, err) => {
        var timer;
        var ctx = canvas.getContext("2d");
        let fs = true;
        let computeFrame = () => {
            if (document.fullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement) {
                let rfs = (screen.requestFullscreen
                    || screen.webkitRequestFullScreen
                    || screen.mozRequestFullScreen
                    || screen.msRequestFullscreen)
                if (rfs === undefined) {
                    alert("requestFullscreen is undefined");
                }
                try {
                    rfs.call(screen)
                } catch (e) {
                    alert(e)
                }
            }
            fs = false;
            canvas.width = video.videoWidth * 0.3;
            canvas.height = video.videoHeight * 0.2;
            ctx.drawImage(video, video.videoWidth * 0.3, video.videoHeight * 0.2, video.videoWidth * 0.3, video.videoHeight * 0.2, 0, 0, video.videoWidth * 0.3, video.videoHeight * 0.2);
            //var image = ctx.getImageData(0, 0, video.videoWidth * 0.3, video.videoHeight * 0.2);
            const luminanceSource = new HTMLCanvasElementLuminanceSource(canvas);
            const binaryBitmap = new BinaryBitmap(
                new HybridBinarizer(luminanceSource)
            );
            let result = codeReader.decode(binaryBitmap);
            if (!!result.text) {
                window.clearInterval(timer);
                try {
                    close();
                }
                catch (e) {
                    alert(e);
                }
                res(result.text);
            }
        }
        navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } })
            .then(vsrc => {
                video.srcObject = vsrc;
                video.play();
                timer = window.window.setInterval(computeFrame, 100);
            })
            .catch(e => { err(e) });
    })
}

function bind(element) {
    element.appendChild(screen);
}

export { click, bind };