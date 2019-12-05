<template>
  <div v-show=isVisible :style=bezierStyle>
    <canvas 
    id="bubble" 
    ref="bubble" 
    class="bezier-curve"

    ></canvas>
    <br />
    <button id="begin" @click="beginMotion">{{beginText}}</button>
    <br />
    <button id="begin" @click="beginMotionA">{{allBeginText}}</button>
    <br />
    <button id="redraw" @click="redraw">重绘</button>
    <br />
    <button id="joinPath" @click="joinPath">加入路径</button>
    <br />
    <button id="Path" @click="anotherPath">加入新路径</button>
    <br />
    <button id="code" @click="generateCode">生成代码</button>
  </div>
</template>
<script>
// import basicObj from "../../assets/prop_ball";
import { _isLastPoint, _getMoveXY, _getRotateXY,_getSpeed} from "../../assets/baseTool";
import {cloneDeep} from 'lodash'
import animationBall from "../../assets/animationBall";
import BezierBall from "../../assets/bezierBall";
import BezierCurve from "../../assets/bezierCurve";
import JointBezier from "../../assets/jointBezier";
let oCanvas;
let ctx;
let canvasBuffer;
let contextBuffer;
export default {
  props: {
    bezierStyle: {
      type: Object,
      default: function () {
        return {
          width: 0,
          height: 0,
          top: 0,
          left: 0
        }
      }
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      motionState: false, //动画状态
      allMotionState: false, //动画状态
      mousePositionX: 0, //鼠标坐标x
      mousePositionY: 0, //鼠标坐标y
      bezierCurve: {},
      pointsArr: {},
      positionXDown: 0,
      positionYDown: 0,
      tSpeed: 0.001,
      beginText: "开始当前操作路径动画",
      allBeginText: "开始全路径动画",
      balls: [],
      allBalls: [],
      bezierPoint: [],
      allBezierData: [],
      clickPositionX: 0,
      clickPositionY: 0
    };
  },
  watch: {
    isVisible (newVal, oldVal) {
      console.log(oldVal, newVal)
      if (newVal) {
        this.initData();
        this.initCanvas();
      }
    }
  },
  created() {},
  mounted() {
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
      if (e && e.keyCode == 81 && _self.pointsArr.bezierCurve.length == 0) {
        // 按 q
        _self.delKeyDown('start');
      }
      if (e && e.keyCode == 87) {
        // 按 w
        _self.delKeyDown('c1');
      }
      if (e && e.keyCode == 69) {
        // 按 e
        _self.delKeyDown('c2');
      }
      if (e && e.keyCode == 82) {
        // 按 r
        _self.delKeyDown('end');
      }
    };
    document.onmousedown = function(e) {
      let ev = ev || window.event;
      _self.clickPositionX =
        e.clientX - _self.$refs["bubble"].getBoundingClientRect().x;
      _self.clickPositionY =
        e.clientY - _self.$refs["bubble"].getBoundingClientRect().y;

      if(_self.bezierCurve.points && _self.bezierCurve.points.length != 0 ) {
        for(var type in _self.bezierCurve.points) {
          if(_self.bezierCurve.points[type].selectable && !_self.bezierCurve.points[type].isSelect){
            var distance = Math.sqrt( 
              (_self.bezierCurve.points[type].x-_self.clickPositionX)*
              (_self.bezierCurve.points[type].x-_self.clickPositionX) + 
              (_self.bezierCurve.points[type].y-_self.clickPositionY)*
              (_self.bezierCurve.points[type].y-_self.clickPositionY)
            )
            if(distance < _self.bezierCurve.points[type].radius + 8) {
              _self.bezierCurve.points[type].isSelect = true;
              return
            }
          }
        }
      }

    }
    document.onmouseup = function() {
      for(var type in _self.bezierCurve.points) {
        if(_self.bezierCurve.points[type].isSelect){
          _self.bezierCurve.points[type].isSelect = false;
          _self.bezierCurve.points[type].x = _self.mousePositionX;
          _self.bezierCurve.points[type].y = _self.mousePositionY;
          contextBuffer.clearRect(0, 0, canvasBuffer.width, canvasBuffer.height);
          ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
          _self.bezierCurve.points[type].draw(contextBuffer);
        }
      }
    }
  },
  methods: {
    //数据初始化
    initData() {
      let option = {
        x: 0,
        y: 0,
        radius:20
      };
      //初始化运动小球对象
      for (let i = 0; i < this.allBezierData.length; i++) {
        let itemBall = [];
        for (let i = 0; i < 2; i++) {
          let ball = new animationBall(option);
          if (i > 100) {
            ball.loopIndex = 1;
            ball.oldLoopIndex = 1;
            ball.t = 0.01 * (i - 100);
          }
          ball.t = 0.01 * i;
          itemBall.push(ball);
        }
        this.allBalls.push(itemBall);
      }
      for (let i = 0; i < 2; i++) {
        let ball = new animationBall(option);
        if (i > 100) {
          ball.loopIndex = 1;
          ball.oldLoopIndex = 1;
          ball.t = 0.01 * (i - 100);
        }
        ball.t = 0.01 * i;
        this.balls.push(ball);
      }
      //初始化运动小球，初始化贝塞尔大曲线


      let points = {
        'start': new BezierBall(option),
        'c1': new BezierBall(option),
        'c2': new BezierBall(option),
        'end': new BezierBall(option)
      };
      this.bezierCurve = new BezierCurve({ points: points });
      this.pointsArr = new JointBezier({});
    },
    initCanvas() {
      // oCanvas = document.querySelector("canvas");
      oCanvas = document.getElementsByClassName('bezier-curve')[0];
      canvasBuffer = document.createElement("canvas");
      // debugger
      // oCanvas.width = window.innerWidth;
      // oCanvas.height = window.innerHeight;
      oCanvas.width = parseFloat(this.bezierStyle.width) || window.innerWidth;
      oCanvas.height = parseFloat(this.bezierStyle.width) || window.innerHeight;
      canvasBuffer.width = oCanvas.width;
      canvasBuffer.height = oCanvas.height;
      ctx = oCanvas.getContext("2d");
      contextBuffer = canvasBuffer.getContext("2d");
      ctx.font = "14px Courier";
      ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
      contextBuffer.clearRect(0, 0, canvasBuffer.width, canvasBuffer.height);
      oCanvas.onmousedown = function() {
        let ev = ev || window.event;
        this.positionXDown = ev.clientX;
        this.positionYDown = ev.clientY;
      };
      //   oCanvas.addEventListener("keydown", this.doKeyDown, true);
      oCanvas.width = parseFloat(this.bezierStyle.width) || window.innerWidth;
      oCanvas.height = parseFloat(this.bezierStyle.height) || window.innerHeight;
      window.requestAnimationFrame(this.render.bind(this));
    },
    delKeyDown(type) {
      this.bezierCurve.points[type].type = type;
      this.bezierCurve.points[type].selectable = true;
      this.bezierCurve.points[type].x = Math.floor(this.mousePositionX);
      this.bezierCurve.points[type].y = Math.floor(this.mousePositionY);
    },
    beginMotion() {
      this.motionState = !this.motionState;
      if(this.motionState) this.allMotionState = false;
      this.beginText = this.motionState ? "停下" : "开始当前操作路径动画";
    },
    beginMotionA() {
      this.allMotionState = !this.allMotionState;
      this.allBeginText = this.allMotionState ? "停下" : "开始全路径动画";
    },
    redraw() {
      this.bezierCurve = [
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
        this.bezierCurve.points.start.x != 0 &&
        this.bezierCurve.points.c1.x != 0 &&
        this.bezierCurve.points.c2.x != 0 &&
        this.bezierCurve.points.end.x != 0
      ) {
        this.bezierCurve.tSpeed = 1/_getSpeed(this.bezierCurve,oCanvas.width,oCanvas.height)/400;
        this.pointsArr.bezierCurve.push(cloneDeep(this.bezierCurve));
      } else {
        return;
      }
      this.motionState = false;
      this.allMotionState = false;
      this.beginText = this.motionState ? "停下" : "开始当前操作路径动画";
      this.beginText = this.allMotionState ? "停下" : "开始全路径动画";
      // this.bezierCurve.points.start = Object.assign({}, this.pointsArr.bezierCurve[this.pointsArr.bezierCurve.length - 1].points.end);
      this.bezierCurve.points.start.x = this.pointsArr.bezierCurve[this.pointsArr.bezierCurve.length - 1].points.end.x;
      this.bezierCurve.points.start.y = this.pointsArr.bezierCurve[this.pointsArr.bezierCurve.length - 1].points.end.y;
      this.bezierCurve.points.c1.x = 0;
      this.bezierCurve.points.c1.y = 0;
      this.bezierCurve.points.c2.x = 0;
      this.bezierCurve.points.c2.y = 0;
      this.bezierCurve.points.end.x = 0;
      this.bezierCurve.points.end.y = 0;
    },
    anotherPath() {
      if (this.pointsArr.bezierCurve.length > 0) {
        this.allBezierData.push(cloneDeep(this.pointsArr));
        this.initData();
      } else {
        alert("不能加入空路径");
        return;
      }
    },
    generateCode() {
      let curve = JSON.parse(JSON.stringify(this.allBezierData))[0]
      debugger
      console.log(curve)
      console.log(new JointBezier(curve))
      console.log(new BezierCurve(curve.bezierCurve[0]))
      console.log(new BezierBall(curve.bezierCurve[0].points.start))
      // BezierCurve
      // this
    },
    draw() {
      contextBuffer.clearRect(0, 0, oCanvas.width, oCanvas.height);
      this.movePoint();
      if(this.allBezierData.length>0){
        this.allBezierData.forEach((item, index) => {
        this.drawPointsA(item.bezierCurve);
        this.drawCurveA(item.bezierCurve);
        if (this.allMotionState) {
          this.drawAnimationA(item.bezierCurve, index);
        }
      });
      }
      this.drawPoints(this.pointsArr.bezierCurve, this.bezierCurve);
      //画曲线函数(路径数组，当前画的未加入路径的路径点)
      this.drawCurve(this.pointsArr.bezierCurve, this.bezierCurve);
      //画路径中点的动画
      if (this.motionState && this.pointsArr.bezierCurve.length != 0) {
        //运动状态为true,路径点数组长度不为0
        this.drawAnimation(this.pointsArr.bezierCurve);
      }
      //描点函数(路径数组，当前画的未加入路径的路径点)
      ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
      ctx.drawImage(canvasBuffer, 0, 0);
      // ctx.fill();
    },
    drawPointsA(pointsArr) {
      if (pointsArr.length !== 0) {
        //画开始点
        // let { x, y } = pointsArr[0].points[0];
        pointsArr[0].points.start.draw(contextBuffer);
        pointsArr[pointsArr.length - 1].points.end.draw(contextBuffer); 
      }
    },
    //画曲线函数
    drawCurveA(pointsArr) {
      if (pointsArr.length !== 0) {
        for (let item of pointsArr) {
          contextBuffer.beginPath();
          contextBuffer.moveTo(item.points.start.x, item.points.start.y);
          contextBuffer.bezierCurveTo(
            item.points.c1.x,
            item.points.c1.y,
            item.points.c2.x,
            item.points.c2.y,
            item.points.end.x,
            item.points.end.y
          );
          contextBuffer.strokeStyle = "#50E3C2";
          contextBuffer.stroke();
        }
      }
    },
    //画路径点的动画函数
    drawAnimationA(pointsArr, index) {
      contextBuffer.beginPath();
      //计算下一帧小球的x,y坐标
      let img = new Image();
      img.src = "../../../static/airplane.png";
      this.allBalls[index].forEach(item => {
        // console.log(pointsArr);
        [item.x, item.y] = _getMoveXY(pointsArr, item.loopIndex, item.t);
        let [xRoto, yRoto] = _getRotateXY(pointsArr, item.loopIndex, item.t);
        item.angle = Math.atan2(xRoto, yRoto)-Math.atan2(item.x, 0);
        if (_isLastPoint(item.t, item.loopIndex, pointsArr.length)) {
          item.t = 0;
          // item.loopIndex = item.oldLoopIndex;
          item.loopIndex = 0;
        }
        //判断是否到最后一个点
        if (Math.floor(item.t) == 1) {
          item.t = 0;
          item.loopIndex++;
        }
        // item.drawImg(contextBuffer)
        item.drawBall(contextBuffer, img);
        item.t += this.tSpeed;
      });
      contextBuffer.fill();
    },
    drawPoints(pointsArr, bezierCurve) {
      if (pointsArr && pointsArr.length !== 0) {
        //画开始点
        pointsArr[0].points.start.draw(contextBuffer);
        //画结束点
        pointsArr[pointsArr.length - 1].points.end.draw(contextBuffer);
      }
      //画当前路径操作点
      for(var type in bezierCurve.points) {
         /* let { x, y } = bezierCurve.points[type];
        contextBuffer.beginPath();
        contextBuffer.arc(x, y, 4, 0, 2 * Math.PI, false);
        contextBuffer.fillText(type, x + 10, y + 10);
        contextBuffer.fill(); */
        if(type != 'start' || pointsArr.length == 0) {
          bezierCurve.points[type].draw(contextBuffer);
        } 
        /*  if(bezierCurve.points[type].isSelect){
            bezierCurve.points[type].x = this.clickPositionX;
            bezierCurve.points[type].y = this.clickPositionY;
            bezierCurve.points[type].draw(contextBuffer);
        } */
      }
    },
    //画曲线函数
    drawCurve(pointsArr, bezierCurve) {
      if (pointsArr.length !== 0) {
        for (let item of pointsArr) {
          contextBuffer.beginPath();
          contextBuffer.moveTo(item.points.start.x, item.points.start.y);
          contextBuffer.bezierCurveTo(
            item.points.c1.x,
            item.points.c1.y,
            item.points.c2.x,
            item.points.c2.y,
            item.points.end.x,
            item.points.end.y
          );
          contextBuffer.strokeStyle = "#50E3C2";
          contextBuffer.stroke();
        }
      }
      if (
        bezierCurve.points.start.x != 0 &&
        bezierCurve.points.c1.x != 0 &&
        bezierCurve.points.c2.x != 0 &&
        bezierCurve.points.end.x != 0
      ) {
        //如果画的路径需求的4个点都存在
        contextBuffer.beginPath();
        contextBuffer.moveTo(bezierCurve.points.start.x, bezierCurve.points.start.y);
        contextBuffer.bezierCurveTo(
          bezierCurve.points.c1.x,
          bezierCurve.points.c1.y,
          bezierCurve.points.c2.x,
          bezierCurve.points.c2.y,
          bezierCurve.points.end.x,
          bezierCurve.points.end.y
        );
        contextBuffer.strokeStyle = "#50E3C2";
        contextBuffer.stroke();
      }
    },
    //画路径点的动画函数
    drawAnimation(pointsArr) {
      contextBuffer.beginPath();
      //计算下一帧小球的x,y坐标
      let img = new Image();
      img.src = "../../../static/airplane.png";
      this.balls.forEach(item => {
        [item.x, item.y] = _getMoveXY(pointsArr, item.loopIndex, item.t);
        let [xRoto, yRoto] = _getRotateXY(pointsArr, item.loopIndex, item.t);
        // 计算旋转角
        item.angle = Math.atan2(xRoto, yRoto)-Math.atan2(item.x, 0);
        if (
          _isLastPoint(
            item.t,
            item.loopIndex,
            this.pointsArr.bezierCurve.length
          )
        ) {
          item.t = 0;
          item.loopIndex = 0;
        }
        //判断是否到最后一个点
        if (Math.floor(item.t) == 1) {
          item.t = 0;
          item.loopIndex++;
        }
        // item.drawImg(contextBuffer)
        item.drawBall(contextBuffer, img);
        item.t += pointsArr[item.loopIndex].tSpeed;
      });
      contextBuffer.fill();
    },
     movePoint(){
      for(var type in this.bezierCurve.points) {
        if(this.bezierCurve.points[type].isSelect){
          this.bezierCurve.points[type].x = this.mousePositionX;
          this.bezierCurve.points[type].y = this.mousePositionY;
          contextBuffer.clearRect(0, 0, canvasBuffer.width, canvasBuffer.height);
          ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
          this.bezierCurve.points[type].draw(contextBuffer);
        }
      }
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
