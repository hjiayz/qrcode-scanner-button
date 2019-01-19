import { QRCodeReader, HTMLCanvasElementLuminanceSource, BinaryBitmap, HybridBinarizer } from '@zxing/library';
import 'fullscreen-polyfill';

function close() {
    document.exitFullscreen();
}

var screen = document.createElement("div");

let video = document.createElement("Video");

let canvas = document.createElement("canvas");

screen.appendChild(video);
screen.appendChild(canvas);
screen.addEventListener("click", close, false);

function click() {
    return new Promise((res, err) => {
        var timer;
        var ctx = canvas.getContext("2d");
        let computeFrame = () => {
            canvas.width = myvideo.videoWidth * 0.3;
            canvas.height = myvideo.videoHeight * 0.2;
            ctx.drawImage(video, video.videoWidth * 0.3, video.videoHeight * 0.2, video.videoWidth * 0.3, video.videoHeight * 0.2, 0, 0, video.videoWidth * 0.3, video.videoHeight * 0.2);
            var image = ctx.getImageData(0, 0, myvideo.videoWidth * 0.3, myvideo.videoHeight * 0.2);
            const luminanceSource = new HTMLCanvasElementLuminanceSource(canvas);
            const binaryBitmap = new BinaryBitmap(
                new HybridBinarizer(luminanceSource)
            );
            let result = codeReader.decode(binaryBitmap);
            if (!!result.text) {
                window.clearInterval(timer);
                close();
                res(result.text);
            }
        }
        navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } })
            .then(vsrc => {
                video.srcObject = vsrc;
                video.play();
                timer = window.window.setInterval(computeFrame, 100);
                screen.requestFullscreen();
            })
            .catch(e => { close(); err(e) });
    })
}

export { click };