var lotteryChart = (function() {
    var lotteryChart = {};
    lotteryChart.init = function(options) {
            //运动时间,以秒为单位
            this.times = options.times || 3;
            //转盘的图片数组
            this.imageArray = options.imageArray;
            //获取像素信息
            this.imageDataArray = [];
            this.newImageDataArray = [];
            //实际的位置
            this.imagePosArray = [];
            //转盘的运动方式
            this.movePatt = options.movePatt;
            this.ctx = options.canvas.getContext('2d');


            options.canvas.addEventListener();
            this.len = this.imageArray.length;
            this.start = options.start;
            this.end = options.end;
            this.success = 1;
            this.newEnd = 0;
            this.drawStatic();
        }
        //必须等图片都加载完之后再move
    lotteryChart.move = function() {
            //获取图片
            var self = this;
            var ctx = this.ctx;
            var time_inteval = [250];
            var sum_time = 0;
            var Time_terminal = this.times * 1000;
            //important var
            var i = 0;
            var start = this.start;
            var end = this.end;
            var frequency = 60;
            var timeOut1, timeOut2;
            // var len = Time_terminal / frequency;
            // var moveMount = this.len * Math.floor(len / this.len) + end - 1;
            while (sum_time < Time_terminal) {
                if (time_inteval[0] > 30) {
                    time_inteval.unshift(time_inteval[0] - 30);
                } else {
                    time_inteval.unshift(60);
                }
                // time_inteval[time_inteval.length] = time_inteval[time_inteval.length - 1] + 2;
                sum_time += time_inteval[0];
            }
            moveMount = this.len * Math.floor(time_inteval.length / this.len) + end;
            // moveMount =1;
            console.log(moveMount);

            function switchImage(i) {
                var pre = (i + self.len - 1) % (self.len);
                var cur = i % (self.len);
                ctx.putImageData(self.imageDataArray[pre], self.imagePosArray[pre].x, self.imagePosArray[pre].y);
                ctx.putImageData(self.newImageDataArray[cur], self.imagePosArray[cur].x, self.imagePosArray[cur].y);
            }
            switch (self.movePatt) {
                case 'line-move':
                    moveFunc_line();
                    break;
                case 'fastToSlow':
                    self.startTime = Number(new Date());
                    moveFunc_fastToSlow();
                    break;
                default:
                    break;
            }

            function moveFunc_line() {

                if (i <= moveMount) {
                    i++;
                    switchImage(i);
                    setTimeout(function() {
                        moveFunc_line();
                    }, frequency);
                }

            }

            function moveFunc_fastToSlow() {
                console.log(i,moveMount);
                if (i <= moveMount) {

                    switchImage(i);
                    if (i % 4 == 0) {
                        var curTime = Number(new Date());
                        if (curTime - self.startTime > 2000 && self.success == 1) {
                            clearTimeout(timeOut1);
                            console.log(self.newEnd, self.end);
                            var tempId = self.newEnd - self.end;
                            if (tempId >= 0) {
                                moveMount -= self.len - tempId;
                            } else {
                                moveMount += tempId;
                            }
                            moveFunc_fastToSlow_1();

                        } else {
                            timeOut1 = setTimeout(function() {
                                moveFunc_fastToSlow();
                            }, time_inteval[i]);
                            i++;
                        }
                    } else {
                        timeOut1 = setTimeout(function() {
                            moveFunc_fastToSlow();
                        }, time_inteval[i]);
                        i++;
                    }

                }
            }

            function moveFunc_fastToSlow_1() {
                console.log(i, moveMount);
                i++;
                if (i <= moveMount) {

                    switchImage(i);
                    setTimeout(function() {
                        moveFunc_fastToSlow_1();
                    }, time_inteval[i]);

                }
               
            }
        }
        //把图像放在canvas上
    lotteryChart.drawStatic = function() {
        var imageArray = this.imageArray;
        var ctx = this.ctx;
        var self = this;
        //坐标
        var x = 0,
            y = 0;
        var tempImage;
        //绘制图片
        for (var i = 0; i < self.len; i++) {
            tempImage = new Image();
            tempImage.src = imageArray[i];
            (function(a, x, y, i) {
                a.addEventListener("load", function() {
                    ctx.drawImage(a, 0, 0, 100, 100, x, y, 100, 100);
                    self.imageDataArray.push(ctx.getImageData(x, y, 100, 100));
                    self.newImageDataArray.push(ctx.getImageData(x, y, 100, 100));
                    self.imagePosArray.push({
                        x: x,
                        y: y
                    });
                    for (var j = 3; j < self.imageDataArray[i].data.length; j += 4) {
                        self.newImageDataArray[i]['data'][j - 3] -= 100;
                        self.newImageDataArray[i]['data'][j - 2] -= 100;
                        self.newImageDataArray[i]['data'][j - 1] -= 100;
                        self.newImageDataArray[i]['data'][j] -= 100;
                    }
                    ctx.putImageData(self.imageDataArray[i], x, y);
                }, false);
            })(tempImage, x, y, i);

            // x += 100;
            // y += 100;
            switch (i) {
                case 0:
                    x += 100;
                    break;
                case 1:
                    y += 100;
                    break;
                case 2:
                    x -= 100;
                    break;
                    break;
                    // case 0:x+=100;break;
            }
        }

        //绘制开始
        ctx.font = "48px serif";
        ctx.fillText("点我开始", 200, 50);
    }
    return lotteryChart;
})();
lotteryChart.init({
    canvas: document.querySelector('#js-canvas'),
    imageArray: ['1.jpg', '2.jpg', '3.jpg', '4.jpg'],
    times: 4,
    waitTime: 2,
    start: 0,
    end: 3,
    //运动方式 line-move,fastToSlow-简单的,
    movePatt: 'fastToSlow',
});
// lotteryChart.drawStatic();



// setTimeout(function() {
//     lotteryChart.move();
// }, 2000);
document.getElementById('js-canvas').onclick = function() {

    lotteryChart.move();
}
