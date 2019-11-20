        import basicObj from '../baseTool/prop_ball';
        let oCanvas = document.querySelector('canvas');
        let redraw = document.querySelector('#redraw');
        let begin = document.querySelector('#begin');
        let joinPath = document.querySelector('#joinPath');
        let ctx = oCanvas.getContext('2d');
        oCanvas.width = window.innerWidth;;
        oCanvas.height = window.innerHeight;
        ctx.font = '14px Courier';
        oCanvas.onmousemove = function () {
            var ev = ev || window.event;
            mousePositionX = ev.clientX;
            mousePositionY = ev.clientY;
        }
        window.addEventListener('keydown', doKeyDown, true);
        function doKeyDown(event) {
            let e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 81 && pointsArr.length == 0) { // 按 q
                points[0].x = Math.floor(mousePositionX);
                points[0].y = Math.floor(mousePositionY);
            }
            if (e && e.keyCode == 87) { // 按 w 
                points[1].x = Math.floor(mousePositionX);
                points[1].y = Math.floor(mousePositionY);
            }
            if (e && e.keyCode == 69) { // 按 e
                points[2].x = Math.floor(mousePositionX);
                points[2].y = Math.floor(mousePositionY);
            }
            if (e && e.keyCode == 82) { // 按 r
                points[3].x = Math.floor(mousePositionX);
                points[3].y = Math.floor(mousePositionY);
            }
        };
        window.requesetAnimFrame = function () {
            return window.requesetAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (fn) {
                    window.setTimeout(fn, 1000 / 60);
                };
        }();
        //重绘监听器
        redraw.onclick = function () {
            points = ([{ x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 }
            ])
            loopIndex = 0;
            pointsArr = [];
            t = 0;
            motionState = false;
        }
        //加入路径监听器
        joinPath.onclick = function () {
            if (points[0].x != 0 && points[1].x != 0 && points[2].x != 0 && points[3].x != 0) {
                pointsArr.push(points);
            } else {
                return;
            }
            motionState = false;
            begin.innerHTML = motionState ? '停下' : '开始动画';
            points = ([{ x: pointsArr[pointsArr.length - 1][3].x, y: pointsArr[pointsArr.length - 1][3].y },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 }
            ])
            t = 0;
        }
        begin.onclick = function () {
            motionState = !motionState;
            begin.innerHTML = motionState ? '停下' : '开始动画';
        }
        export default class Main {
        constructor(){
            this.motionState = false,//动画状态
            this.mousePositionX = 0,
            this.mousePositionY = 0,
            this.loopIndex = 0,
            this.pointsArr = [],
            this.t = 0,
            this.tSpeed = 0
            }
            init(params) {
            if (pointsArr.length != 0) {
                var points = [{ x: pointsArr[pointsArr.length - 1][3].x, y: pointsArr[pointsArr.length - 1][3].y },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 }
                ]
            } else {
                var points = [{ x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 }
                ]
            }
            let option  = {
                x:0,
                y:0,
                radius:10
            }
            let ball = new basicObj(option,'ball');
        }
        
        
        
        //获取鼠标位置
        
        //监听键盘事件
        
        
        draw() {
            ctx.clearRect(0, 0, oCanvas.width, oCanvas.height)
            //描点函数(路径数组，当前画的未加入路径的路径点)
            drawPoints(pointsArr, points)
            //画曲线函数(路径数组，当前画的未加入路径的路径点)
            drawCurve(pointsArr, points)
            //画路径中点的动画
            if (motionState && pointsArr.length != 0) {//运动状态为true,路径点数组长度不为0
                drawAnimation(pointsArr)
            }
            requestAnimationFrame(draw);
        }
        drawPoints(pointsArr, points) {
            if (pointsArr.length !== 0) {
                //画开始点
                var { x, y } = pointsArr[0][0];
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI, false)
                ctx.fillText('start', x + 10, y + 10)
                ctx.fill();
                //画结束点
                var { x, y } = pointsArr[pointsArr.length - 1][3];
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI, false)
                ctx.fillText('end', x + 10, y + 10)
                ctx.fill();
            }
            //画当前路径操作点
            points.forEach(function (point, index) {
                var { x, y } = point;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI, false)
                if (index != 0) {
                    ctx.fillText('P' + index, x + 10, y + 10)
                }
                ctx.fill();
            })
        }
        //画曲线函数
        drawCurve(pointsArr, points) {
            if (pointsArr.length !== 0) {
                for (let item of pointsArr) {
                    ctx.beginPath();
                    ctx.moveTo(item[0].x, item[0].y);
                    ctx.bezierCurveTo(
                        item[1].x, item[1].y,
                        item[2].x, item[2].y,
                        item[3].x, item[3].y
                    )
                    ctx.strokeStyle = '#50E3C2';
                    ctx.stroke();
                }
            }
            if (points[0].x != 0 && points[1].x != 0 && points[2].x != 0 && points[3].x != 0) {//如果画的路径需求的4个点都存在
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                ctx.bezierCurveTo(
                    points[1].x, points[1].y,
                    points[2].x, points[2].y,
                    points[3].x, points[3].y
                )
                ctx.strokeStyle = '#50E3C2';
                ctx.stroke();
            }
        }
        //画路径点的动画函数
        drawAnimation(pointsArr) {
            ctx.beginPath();
            //计算下一帧小球的x,y坐标
            let x_next = getBezierCoord(pointsArr[loopIndex][0].x, pointsArr[loopIndex][1].x, pointsArr[loopIndex][2].x, pointsArr[loopIndex][3].x)
            let y_next = getBezierCoord(pointsArr[loopIndex][0].y, pointsArr[loopIndex][1].y, pointsArr[loopIndex][2].y, pointsArr[loopIndex][3].y)
            //这个地方的判断逻辑有问题,但我尽力了求大神简化
            if ((Math.floor(x_next) + 1 == Math.floor(pointsArr[loopIndex][3].x) || Math.floor(x_next) == Math.floor(pointsArr[loopIndex][3].x) || Math.floor(x_next) - 1 == Math.floor(pointsArr[loopIndex][3].x)) && (Math.floor(y_next) + 1 == Math.floor(pointsArr[loopIndex][3].y) || Math.floor(y_next) == Math.floor(pointsArr[loopIndex][3].y) || Math.floor(y_next) - 1 == Math.floor(pointsArr[loopIndex][3].y))) {
                motionState = true;
                t = 0;
                loopIndex++;
            }
            //这个地方的判断逻辑有问题,但我尽力了求大神简化
            if (((Math.floor(x_next) + 1 == Math.floor(pointsArr[pointsArr.length - 1][3].x) || Math.floor(x_next) == Math.floor(pointsArr[pointsArr.length - 1][3].x) || Math.floor(x_next) - 1 == Math.floor(pointsArr[pointsArr.length - 1][3].x)) && (Math.floor(y_next) + 1 == Math.floor(pointsArr[pointsArr.length - 1][3].y) || Math.floor(y_next) == Math.floor(pointsArr[pointsArr.length - 1][3].y) || Math.floor(y_next) - 1 == Math.floor(pointsArr[pointsArr.length - 1][3].y)))) {
                motionState = true;
                t = 0;
                loopIndex = 0;
            }
            ball.x = x_next;
            ball.x = y_next;
            ball.drawTo(ctx);
            // ctx.arc(x_next, y_next, 4, 0, 2 * Math.PI, false);
            // ctx.fill();
            t += tSpeed;
        }
        
        rnd(n, m) {
            return parseInt(Math.random() * (m - n) + n);
        }
        getBezierCoord(p1, p2, p3, p4) {
            // B(t) = P0(1-t)³ + 3P1t(1-t)² + 3P2t²(1-t) + P3t³
            return (
                p1 * Math.pow(1 - t, 3) +
                3 * p2 * t * Math.pow(1 - t, 2) +
                3 * p3 * Math.pow(t, 2) * (1 - t) +
                p4 * Math.pow(t, 3)
            )
        }
    }