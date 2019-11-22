<template>
  <div>
    <canvas id="bubble" ref="bubble"></canvas>
    <br />
    <button id="begin" @click="beginMotion">{{beginText}}</button>
    <br />
    <button id="redraw" @click="redraw">重绘</button>
    <br />
    <button id="joinPath" @click="joinPath">加入路径</button>
    <br />
  </div>
</template>
<script>
// import basicObj from "../../assets/prop_ball";
import { _isLastPoint, _getMoveXY} from "../../assets/baseTool";
import animationBall from "../../assets/animationBall";
let oCanvas;
let ctx;

export default {
  data() {
    return {
      motionState: false, //动画状态
      mousePositionX: 0, //鼠标坐标x
      mousePositionY: 0, //鼠标坐标y
      pointsArr: [
        [
          { x: 0, y: 0 },
          { x: 100, y: 100 },
          { x: 200, y: 500 },
          { x: 400, y: 400 }
        ],
        [
          { x: 400, y: 400 },
          { x: 100, y: 300 },
          { x: 200, y: 100 },
          { x: 600, y: 300 }
        ]
      ], //路径数组
      positionXDown: 0,
      positionYDown: 0,
      tSpeed: 0.005,
      beginText: "开始",
      balls: [],
      bezierPoint: []
    };
  },
  created() {},
  mounted() {
    this.initData();
    this.initCanvas();
    // 当调整窗口大小时重绘canvas
    window.onresize = () => {
      this.initCanvas();
    };
    let option = {
      x: 0,
      y: 0,
      radius: 10
    };
    //初始化运动小球对象
    for (let i = 0; i < 100; i++) {
      let ball = new animationBall(option);
      if(i > 50){
      ball.loopIndex = 1;
      ball.oldLoopIndex = 1
      }
      ball.t = 0.02 * i;
      this.balls.push(ball);
    }
    let _self = this;
    //鼠标移动坐标
    document.onmousemove = function() {
      let ev = ev || window.event;
      _self.mousePositionX =
        ev.clientX - _self.$refs["bubble"].getBoundingClientRect().x;
      _self.mousePositionY =
        ev.clientY - _self.$refs["bubble"].getBoundingClientRect().y;
    };
    //键盘事件
    document.onkeydown = function() {
      let e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode == 81 && _self.pointsArr.length == 0) {
        // 按 q
        _self.delKeyDown(0);
      }
      if (e && e.keyCode == 87) {
        // 按 w
        _self.delKeyDown(1);
      }
      if (e && e.keyCode == 69) {
        // 按 e
        _self.delKeyDown(2);
      }
      if (e && e.keyCode == 82) {
        // 按 r
        _self.delKeyDown(3);
      }
    };
  },
  methods: {
    //数据初始化
    initData() {
      if (this.pointsArr.length != 0) {
        this.points = [
          {
            x: this.pointsArr[this.pointsArr.length - 1][3].x,
            y: this.pointsArr[this.pointsArr.length - 1][3].y
          },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 }
        ];
      } else {
        this.points = [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 }
        ];
      }
    },
    initCanvas() {
      oCanvas = document.querySelector("canvas");
      oCanvas.width = window.innerWidth;
      oCanvas.height = window.innerHeight;
      ctx = oCanvas.getContext("2d");
      ctx.font = "14px Courier";
      oCanvas.onmousedown = function() {
        let ev = ev || window.event;
        this.positionXDown = ev.clientX;
        this.positionYDown = ev.clientY;
      };
      //   oCanvas.addEventListener("keydown", this.doKeyDown, true);
      oCanvas.width = window.innerWidth;
      oCanvas.height = window.innerHeight;
      window.requestAnimationFrame(this.render.bind(this));
    },
    delKeyDown(index) {
      this.points[index].x = Math.floor(this.mousePositionX);
      this.points[index].y = Math.floor(this.mousePositionY);
    },
    beginMotion() {
      this.motionState = !this.motionState;
      this.beginText = this.motionState ? "停下" : "开始动画";
    },
    redraw() {
      this.points = [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ];
      this.loopIndex = 0;
      this.pointsArr = [];
      this.motionState = false;
    },
    joinPath() {
      if (
        this.points[0].x != 0 &&
        this.points[1].x != 0 &&
        this.points[2].x != 0 &&
        this.points[3].x != 0
      ) {
        this.pointsArr.push(this.points);
      } else {
        return;
      }
      this.motionState = false;
      this.beginText = this.motionState ? "停下" : "开始动画";
      this.points = [
        {
          x: this.pointsArr[this.pointsArr.length - 1][3].x,
          y: this.pointsArr[this.pointsArr.length - 1][3].y
        },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ];
    },
    draw() {
      ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
      //描点函数(路径数组，当前画的未加入路径的路径点)
      this.drawPoints(this.pointsArr, this.points);
      //画曲线函数(路径数组，当前画的未加入路径的路径点)
      this.drawCurve(this.pointsArr, this.points);
      //画路径中点的动画
      if (this.motionState && this.pointsArr.length != 0) {
        //运动状态为true,路径点数组长度不为0
        this.drawAnimation(this.pointsArr);
      }
    },
    drawPoints(pointsArr, points) {
      if (pointsArr.length !== 0) {
        //画开始点
        var { x, y } = pointsArr[0][0];
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI, false);
        ctx.fillText("start", x + 10, y + 10);
        ctx.fill();
        //画结束点
        var { x3, y3 } = pointsArr[pointsArr.length - 1][3];
        ctx.beginPath();
        ctx.arc(x3, y3, 4, 0, 2 * Math.PI, false);
        ctx.fillText("end", x3 + 10, y3 + 10);
        ctx.fill();
      }
      //画当前路径操作点
      points.forEach(function(point, index) {
        var { x, y } = point;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI, false);
        if (index != 0) {
          ctx.fillText("P" + index, x + 10, y + 10);
        }
        ctx.fill();
      });
    },
    //画曲线函数
    drawCurve(pointsArr, points) {
      if (pointsArr.length !== 0) {
        for (let item of pointsArr) {
          ctx.beginPath();
          ctx.moveTo(item[0].x, item[0].y);
          ctx.bezierCurveTo(
            item[1].x,
            item[1].y,
            item[2].x,
            item[2].y,
            item[3].x,
            item[3].y
          );
          ctx.strokeStyle = "#50E3C2";
          ctx.stroke();
        }
      }
      if (
        points[0].x != 0 &&
        points[1].x != 0 &&
        points[2].x != 0 &&
        points[3].x != 0
      ) {
        //如果画的路径需求的4个点都存在
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.bezierCurveTo(
          points[1].x,
          points[1].y,
          points[2].x,
          points[2].y,
          points[3].x,
          points[3].y
        );
        ctx.strokeStyle = "#50E3C2";
        ctx.stroke();
      }
    },
    //画路径点的动画函数
    drawAnimation(pointsArr) {
      ctx.beginPath();
      //计算下一帧小球的x,y坐标
      let img = new Image();
      img.src = '../../../static/lst.jpg';
      this.balls.forEach(item => {
        [item.x, item.y] = _getMoveXY(pointsArr, item.loopIndex, item.t);
        // [item.x, item.y] = _getRotoXY(pointsArr, item.loopIndex, item.t);
        item.angle =1-Math.atan2(item.x, item.y)
        if (_isLastPoint(item.t,item.loopIndex,this.pointsArr.length)) {
          item.t = 0;
          // item.loopIndex = item.oldLoopIndex;
          item.loopIndex = 0;
        }
        if(Math.floor(item.t) == 1){
            item.t = 0;
          item.loopIndex++;
        }
        // if (_isNextPoint(item.x, item.y, this.pointsArr, item.loopIndex)) {
        //   item.t = 0;
        //   // item.loopIndex = item.oldLoopIndex;
        //   item.loopIndex++;
        // }
        // //这个地方的判断逻辑有问题,但我尽力了求大神简化
        
        item.drawBall(ctx,img);
        item.t += this.tSpeed;
      });
      ctx.fill();
    },
    render() {
      this.draw();
      window.requestAnimationFrame(this.render.bind(this));
    }
  }
};
</script>
<style>
/* body {
  margin: 0;
  text-align: center;
  font-family: "Courier";
  overflow: hidden;
} */
/* #bubble {
  top: -60px;
  left: -11px;
  width: 100%;
  height: auto;
  display: inline-block;
  vertical-align: baseline;
  position: relative;
  z-index: -1;
} */
#begin {
  position: relative;
  top: -170px;
  z-index: 2;
}
#redraw {
  position: relative;
  top: -140px;
  z-index: 2;
}
#joinPath {
  position: relative;
  top: -110px;
  z-index: 2;
}
</style>
