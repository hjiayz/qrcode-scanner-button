import { QRCodeReader, HTMLCanvasElementLuminanceSource, BinaryBitmap, HybridBinarizer } from '@zxing/library';

var screen = document.createElement("div");
screen.style.display = "none";
screen.style.width = "100%";
screen.style.height = "100%";
screen.style.justifyContent = "center";
screen.style.alignItems = "center";

var timer;

let video = document.createElement("Video");
video.style.width = 0;
video.style.height = 0;
video.style.position = "absolute";
video.style.zIndex = 0;
video.style.objectFit = "fill";

let mask = document.createElement("div");
mask.style.zIndex = 20;
mask.style.position = "absolute";
mask.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
mask.style.overflow = "hidden";
mask.style.height = "100%";
mask.style.width = "100%";

let canvas = document.createElement("canvas");
canvas.style.width = "30%";
canvas.style.height = "30%";
canvas.style.zIndex = 40;
canvas.style.position = "absolute";
canvas.style.backgroundColor = "white";
canvas.style.border = "1px solid green";

function close() {
    window.clearInterval(timer);
    video.srcObject = null;
    screen.style.display = "none";
    (document.exitFullscreen ||
        document.msExitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen).call(document);
}

screen.appendChild(video);
screen.appendChild(mask);
screen.appendChild(canvas);
screen.addEventListener("click", close, false);
const codeReader = new QRCodeReader();

function click() {
    let rfs = (screen.requestFullscreen
        || screen.webkitRequestFullScreen
        || screen.mozRequestFullScreen
        || screen.msRequestFullscreen)
    if (rfs !== undefined) {
        rfs.call(screen)
    }
    screen.style.display = "flex";
    return new Promise((res, err) => {
        var ctx = canvas.getContext("2d");
        let computeFrame = () => {
            if (video.videoWidth <= 0) return;
            video.style.width = screen.clientWidth;
            canvas.width = video.videoWidth * 0.3;
            if (video.videoHeight <= 0) return;
            video.style.height = screen.clientHeight;
            canvas.height = video.videoHeight * 0.3;
            ctx.drawImage(video, video.videoWidth * 0.35, video.videoHeight * 0.35, video.videoWidth * 0.3, video.videoHeight * 0.3, 0, 0, video.videoWidth * 0.3, video.videoHeight * 0.3);
            const luminanceSource = new HTMLCanvasElementLuminanceSource(canvas);
            const binaryBitmap = new BinaryBitmap(
                new HybridBinarizer(luminanceSource)
            );
            let result = codeReader.decode(binaryBitmap);
            if (!!result.text) {
                close();
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