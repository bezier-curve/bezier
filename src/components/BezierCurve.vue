<template>
  <canvas class="bezier-curve"></canvas>
</template>

<script>
import {
  _drawCurveALL,
  _drawPointsALL,
  _drawAnimationALL,
  // _drawAnimation,
  // _drawPoints,
  // _drawCurve
} from "../assets/drawTool.js";
import animationBall from "../assets/animationBall";
import BezierBall from "../assets/bezierBall";
import BezierCurve from "../assets/bezierCurve";
import JointBezier from "../assets/jointBezier";
let oCanvas;
let ctx;
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {}
      }
    },
  },
  data() {
    return {
      allBezierData: [],
      allBalls: [],
      scale: 1
    }
  },
  created() {
    // let optionsArr = JSON.parse(this.options)
    // this.allBezierData = this.genJointBezier(optionsArr)
    // this.allBezierData = this.genJointBezier(this.options)
    // debugger
  },
  mounted() {
    
    this.initCanvas()
    this.allBezierData = this.genJointBezier(this.options.bezierData)
    this.initMoveAllBall(this.allBezierData)
  },
  methods: {
    initCanvas() {
      // oCanvas = document.querySelector("canvas");
      oCanvas = document.getElementsByClassName("bezier-curve")[0];
      // debugger
      // oCanvas.width = parseFloat(this.bezierStyle.width) || window.innerWidth;
      // oCanvas.height = parseFloat(this.bezierStyle.width) || window.innerHeight;
      oCanvas.width = oCanvas.parentNode.offsetWidth
      oCanvas.height = oCanvas.parentNode.offsetHeight

      this.scale = oCanvas.width / this.options.width
      // debugger
      // oCanvas.width = window.innerWidth;
      // oCanvas.height = window.innerHeight;
      ctx = oCanvas.getContext("2d");
      ctx.font = "14px Courier";
      ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
      // oCanvas.width = parseFloat(this.bezierStyle.width) || window.innerWidth;
      // oCanvas.height =
      //   parseFloat(this.bezierStyle.height) || window.innerHeight;
      window.requestAnimationFrame(this.render.bind(this));
    },
    genJointBezier(options) {
      if (options) {
        let jointBezierObj = options.map(item => {
          item.bezierCurve = this.genBezierCurve(item.bezierCurve)
          return new JointBezier(item)
        })
        return jointBezierObj
      }
    },
    genBezierCurve (curves) {
      if (curves) {
        let curveObjs = curves.map(item => {
          item.points = this.genBezierBall(item.points)
          return new BezierCurve(item, this.scale)
        })
        return curveObjs
      }
    },
    genBezierBall (balls) {
      if (balls) {
        // for (let item in balls) {
        //   new BezierBall(item)
        // }
        return {
          'c1': new BezierBall(balls.c1, this.scale),
          'c2': new BezierBall(balls.c2, this.scale),
          'end': new BezierBall(balls.end, this.scale),
          'start': new BezierBall(balls.start, this.scale),
        }
      }
    },
    initMoveAllBall(allBezierData) {
      this.allBalls = [];
      let option = {
        x: 100,
        y: 100,
        color: "#FF24FF",
        radius: 10
      };
      let NumBall = 5
      let interval = 1/NumBall
      //初始化运动小球对象
      for (let i = 0; i < allBezierData.length; i++) {
        let itemBall = [];
        let bigLength = allBezierData[i].bezierCurve.length * NumBall;
        for (let j = 0; j < bigLength; j++) {
          let ball = new animationBall(option, this.scale);
          let index = Math.floor(j / NumBall);
          let speedNum = j % NumBall+1;
          ball.loopIndex = index;
          // ball.oldLoopIndex = 1;
          ball.t = interval * speedNum;
          itemBall.push(ball);
        }
        this.allBalls.push(itemBall);
      }
    },
    draw() {
      ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
      // this.movePoint();
      if (this.allBezierData.length > 0) {
        // this.allBezierData.forEach((item, index) => {
        this.allBezierData.forEach((item, index) => {
          // console.log(item.bezierCurve)
          // contextBuffer.clearRect(0, 0, oCanvas.width, oCanvas.height);
          _drawPointsALL(item.bezierCurve, ctx);
          _drawCurveALL(item.bezierCurve, ctx);
          // if (this.allMotionState) {
            _drawAnimationALL(
              item.bezierCurve,
              index,
              this.allBalls,
              ctx,
            );
          // }
        });
      }
      // _drawPoints(this.pointsArr.bezierCurve, this.bezierCurve, ctx);
      // //画曲线函数(路径数组，当前画的未加入路径的路径点)
      // _drawCurve(this.pointsArr.bezierCurve, this.bezierCurve, ctx);
      // //画路径中点的动画
      // if (this.motionState && this.pointsArr.bezierCurve.length != 0) {
      //   //运动状态为true,路径点数组长度不为0
      //   _drawAnimation(
      //     this.pointsArr.bezierCurve,
      //     this.balls,
      //     ctx,
      //     this.img
      //   );
      // }
      //描点函数(路径数组，当前画的未加入路径的路径点)
      // ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
      // ctx.drawImage(canvasBuffer, 0, 0);
      // ctx.fill();
    },
    render() {
      this.draw();
      window.requestAnimationFrame(this.render.bind(this));
    }
  }
}
</script>

<style>

</style>