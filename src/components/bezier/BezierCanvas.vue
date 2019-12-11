<template>
  <div v-show="isVisible" :style="bezierStyle">
    <canvas id="bubble" ref="bubble" class="bezier-curve"></canvas>
    <br />
    <div style="position:fixed;right:0; top:300px">
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
      <button id="back" @click="back">回退</button>
      <br />
      <button id="forward" @click="forward">前进</button>
      <br />
      <button id="edit" @click="edit">修改</button>
      <br />
      <button id="code" @click="generateCode">加入路径</button>
    </div>
  </div>
</template>
<script>
// import basicObj from "../../assets/prop_ball";
import { _getSpeed, _getDistance } from "../../assets/baseTool";
import {
  _drawCurveALL,
  _drawPointsALL,
  _drawAnimationALL,
  _drawAnimation,
  _drawPoints,
  _drawCurve,
  _changCurveStyle,
  _changPointsStyle
} from "../../assets/drawTool";
import { cloneDeep } from "lodash";
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
      default: function() {
        return {
          width: 0,
          height: 0,
          top: 0,
          left: 0
        };
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
      editState: false, //编辑状态
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
      clickPositionY: 0,
      img: "",
      dataStack: { data: [], index: 0 },
      changingCurve: [],
      editChange: false,
      movingBallNum:0,
      movingBallSpeed:0,
      movingBallType:'a'
    };
  },
  watch: {
    isVisible(newVal, oldVal) {
      console.log(oldVal, newVal);
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
        _self.delKeyDown("start", _self.bezierCurve.points);
      }
      if (e && e.keyCode == 87) {
        // 按 w
        _self.delKeyDown("c1", _self.bezierCurve.points);
      }
      if (e && e.keyCode == 69) {
        // 按 e
        _self.delKeyDown("c2", _self.bezierCurve.points);
      }
      if (e && e.keyCode == 82) {
        // 按 r
        _self.delKeyDown("end", _self.bezierCurve.points);
      }
    };
    document.onmousedown = function(e) {
      let ev = ev || window.event;
      _self.clickPositionX =
        e.clientX - _self.$refs["bubble"].getBoundingClientRect().x;
      _self.clickPositionY =
        e.clientY - _self.$refs["bubble"].getBoundingClientRect().y;
      if (!_self.editState) {
        if (_self.bezierCurve.points && _self.bezierCurve.points.length != 0) {
          for (let type in _self.bezierCurve.points) {
            if (
              _self.bezierCurve.points[type].selectable &&
              !_self.bezierCurve.points[type].isSelect
            ) {
              //计算小球与鼠标距离是否大于小球半径
              let distanceALL = _getDistance(
                _self.bezierCurve.points[type].x,
                _self.bezierCurve.points[type].y,
                _self.clickPositionX,
                _self.clickPositionY
              );
              if (distanceALL < _self.bezierCurve.points[type].radius + 8) {
                _self.bezierCurve.points[type].isSelect = true;
                return;
              }
            }
          }
        }
      } else {
        if (_self.allBezierData && _self.allBezierData.length != 0) {
          let distance = 0;
          let pIndex = 0;
          let gIndex = 0;
          let selectFlag = false;
          _self.allBezierData.forEach(bezierCurve => {
            for (let curve in bezierCurve.bezierCurve) {
              if (bezierCurve.bezierCurve[curve].points.end.selectable) {
                distance = _getDistance(
                  bezierCurve.bezierCurve[curve].points.end.x,
                  bezierCurve.bezierCurve[curve].points.end.y,
                  _self.clickPositionX,
                  _self.clickPositionY
                );
                if (
                  distance <
                  bezierCurve.bezierCurve[curve].points.end.radius + 8
                ) {
                  if (!selectFlag) {
                    selectFlag = true;
                    _self.editChange = true;
                    _self.changingCurve = [];
                    bezierCurve.bezierCurve[curve].points.end.isSelect = true;
                    bezierCurve.bezierCurve[curve].points.end.color = "#040090";
                    pIndex =
                      bezierCurve.bezierCurve[curve].points.end.parentIndex;
                    gIndex =
                      bezierCurve.bezierCurve[curve].points.end
                        .grandParentIndex;
                    if (bezierCurve.bezierCurve[Number(curve) + 1]) {
                      _self.changingCurve.push(bezierCurve.bezierCurve[curve]);
                      _self.changingCurve.push(
                        bezierCurve.bezierCurve[Number(curve) + 1]
                      );
                    } else {
                      _self.changingCurve.push(bezierCurve.bezierCurve[curve]);
                    }
                    console.log(_self.changingCurve);
                    console.log(pIndex);
                    bezierCurve.bezierCurve[curve].isSelected = true;
                  }
                } else {
                  bezierCurve.bezierCurve[curve].points.end.isSelect = false;
                  bezierCurve.bezierCurve[curve].isSelected = false;
                  bezierCurve.bezierCurve[curve].points.end.color = "#740090";
                }
              }
            }
          });
          _changCurveStyle(_self.allBezierData, "color", "#249193");
          _changCurveStyle(_self.allBezierData, "color", "#FF0", gIndex);
        }
        if (_self.changingCurve.length > 0) {
          for (let changingItem in _self.changingCurve[0].points) {
            let distanceChanging = _getDistance(
              _self.changingCurve[0].points[changingItem].x,
              _self.changingCurve[0].points[changingItem].y,
              _self.clickPositionX,
              _self.clickPositionY
            );
            if (
              distanceChanging <
              _self.changingCurve[0].points[changingItem].radius + 8
            ) {
              _self.changingCurve[0].points[changingItem].isSelect = true;
            } else {
              _self.changingCurve[0].points[changingItem].isSelect = false;
            }
          }
        }
      }
    };
    document.onmouseup = function() {
      if (!_self.editChange) {
        for (let type in _self.bezierCurve.points) {
          if (_self.bezierCurve.points[type].isSelect) {
            _self.bezierCurve.points[type].isSelect = false;
          }
        }
      } else {
        for (let type in _self.changingCurve[0].points) {
          if (_self.changingCurve[0].points[type].isSelect) {
            _self.changingCurve[0].points[type].isSelect = false;
          }
        }
      }
    };
    this.img = new Image();
    this.img.src = "../../../static/airplane.png";
  },
  methods: {
    //数据初始化
    initData() {
      // let option = {
      //   x: 100,
      //   y: 100,
      //   color: "#FF24FF",
      //   radius: 10
      // };
      let optionStart = {
        x: 100,
        y: 100,
        color: "#FE2400",
        radius: 14
      };
      let optionC1 = {
        x: 100,
        y: 200,
        color: "#236B8E",
        radius: 20
      };
      let optionC2 = {
        x: 200,
        y: 100,
        color: "#236B8E",
        radius: 20
      };
      let optionEnd = {
        x: 200,
        y: 200,
        color: "#FE2400",
        radius: 14
      };
      //初始化运动小球，初始化贝塞尔大曲线
      let points = {
        start: new BezierBall(optionStart),
        c1: new BezierBall(optionC1),
        c2: new BezierBall(optionC2),
        end: new BezierBall(optionEnd)
      };
      this.bezierCurve = new BezierCurve({ points: points });
      this.bezierCurve.points.start.selectable = true;
      this.bezierCurve.points.c1.selectable = true;
      this.bezierCurve.points.c2.selectable = true;
      this.bezierCurve.points.end.selectable = true;
      this.pointsArr = new JointBezier({});
    },
    initCanvas() {
      // oCanvas = document.querySelector("canvas");
      oCanvas = document.getElementsByClassName("bezier-curve")[0];
      canvasBuffer = document.createElement("canvas");
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
      oCanvas.width = parseFloat(this.bezierStyle.width) || window.innerWidth;
      oCanvas.height =
        parseFloat(this.bezierStyle.height) || window.innerHeight;
      window.requestAnimationFrame(this.render.bind(this));
    },
    /* 
    type:按键类型
     */
    delKeyDown(type, usingPoint) {
      usingPoint[type].type = type;
      usingPoint[type].selectable = true;
      usingPoint[type].x = Math.floor(this.mousePositionX);
      this.bezierCurve.points[type].y = Math.floor(this.mousePositionY);
    },
    beginMotion() {
      this.motionState = !this.motionState;
      if (this.motionState) this.allMotionState = false;
      this.beginText = this.motionState ? "停下" : "开始当前操作路径动画";
    },
    beginMotionA() {
      this.allMotionState = !this.allMotionState;
      this.allBeginText = this.allMotionState ? "停下" : "开始全路径动画";
    },
    back() {
      if (this.dataStack.index > 1) {
        this.dataStack.index--;
        this.allBezierData = cloneDeep(
          this.dataStack.data[this.dataStack.index - 1][0]
        );
        this.pointsArr = cloneDeep(
          this.dataStack.data[this.dataStack.index - 1][1]
        );
        this.bezierCurve.points.start.x = this.pointsArr.bezierCurve[
          this.pointsArr.bezierCurve.length - 1
        ].points.end.x;
        this.bezierCurve.points.start.y = this.pointsArr.bezierCurve[
          this.pointsArr.bezierCurve.length - 1
        ].points.end.y;
      } else {
        alert("这是末尾了");
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
      //初始化运动小球对象
      for (let i = 0; i < allBezierData.length; i++) {
        let itemBall = [];
        let bigLength = allBezierData[i].bezierCurve.length * 20;
        for (let j = 0; j < bigLength; j++) {
          let ball = new animationBall(option);
          let index = Math.floor(j / 20);
          let speedNum = j % 20+1;
          ball.loopIndex = index;
          // ball.oldLoopIndex = 1;
          ball.t = 0.05 * speedNum;
          itemBall.push(ball);
        }
        this.allBalls.push(itemBall);
      }
    },
    //当前路径小球动画
    initMoveBall(pointsArr) {
      this.balls = [];
      let option = {
        x: 100,
        y: 100,
        color: "#FF24FF",
        radius: 10
      };
      let smallLenght = pointsArr.bezierCurve.length*20;
      for (let x = 0; x < smallLenght; x++) {
        let sIndex = Math.floor(x / 20);
        let sSpeedNum = x % 20+1;
        let ball = new animationBall(option);
        ball.loopIndex = sIndex;
        ball.t = 0.05 * sSpeedNum;
        this.balls.push(ball);
      }
    },
    forward() {
      if (this.dataStack.index < this.dataStack.data.length) {
        this.dataStack.index++;
        this.allBezierData = this.dataStack.data[this.dataStack.index - 1][0];
        this.pointsArr = this.dataStack.data[this.dataStack.index - 1][1];
        this.bezierCurve.points.start.x = this.pointsArr.bezierCurve[
          this.pointsArr.bezierCurve.length - 1
        ].points.end.x;
        this.bezierCurve.points.start.y = this.pointsArr.bezierCurve[
          this.pointsArr.bezierCurve.length - 1
        ].points.end.y;
      } else {
        alert("这已是最新修改");
        _changPointsStyle(this.allBezierData, "color", "#00F", 1);
      }
    },
    edit() {
      this.editState = !this.editState;
      if (!this.editState) {
        this.editChange = false;
      }
      // console.log(this.allBezierData);
      _changCurveStyle(this.allBezierData, "color", "#F00", 1);
      this.allBezierData.forEach(bezierItem => {
        bezierItem.bezierCurve.forEach(curveItem => {
          curveItem.points.end.selectable = true;
        });
      });
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
      // if (
      //   this.bezierCurve.points.start.x != 0 &&
      //   this.bezierCurve.points.c1.x != 0 &&
      //   this.bezierCurve.points.c2.x != 0 &&
      //   this.bezierCurve.points.end.x != 0
      // ) {
      // 计算当前小球速度
      this.bezierCurve.tSpeed =
        1 / _getSpeed(this.bezierCurve, oCanvas.width, oCanvas.height) / 400;
      //end小球存入当前的父曲线索引
      this.bezierCurve.points.end.parentIndex = this.pointsArr.bezierCurve.length;
      //当前曲线加入数组
      this.pointsArr.bezierCurve.push(cloneDeep(this.bezierCurve));
      // } else {
      //   return;
      // }
      //判断加入时是否位于栈顶，否则移除当前index后的所有数据
      if (this.dataStack.data.length > this.dataStack.index) {
        this.dataStack.data.splice(
          this.dataStack.index,
          this.dataStack.data.length - this.dataStack.index
        );
      }
      //加入路径操作入栈
      if (this.allBezierData.length > 0) {
        this.dataStack.data.push([
          cloneDeep(this.allBezierData),
          cloneDeep(this.pointsArr)
        ]);
      } else {
        this.dataStack.data.push([[], cloneDeep(this.pointsArr)]);
      }
      this.initMoveBall(this.pointsArr)
      this.dataStack.index++;
      this.motionState = false;
      this.allMotionState = false;
      this.beginText = this.motionState ? "停下" : "开始当前操作路径动画";
      this.beginTextA = this.allMotionState ? "停下" : "开始全路径动画";
      // this.bezierCurve.points.start = Object.assign({}, this.pointsArr.bezierCurve[this.pointsArr.bezierCurve.length - 1].points.end);
      //
      this.bezierCurve.points.start.x = this.pointsArr.bezierCurve[
        this.pointsArr.bezierCurve.length - 1
      ].points.end.x;
      this.bezierCurve.points.start.y = this.pointsArr.bezierCurve[
        this.pointsArr.bezierCurve.length - 1
      ].points.end.y;
      this.bezierCurve.points.start.selectable = false;
      this.bezierCurve.points.c1.x =
        this.pointsArr.bezierCurve[this.pointsArr.bezierCurve.length - 1].points
          .end.x + 100;
      this.bezierCurve.points.c1.y = this.pointsArr.bezierCurve[
        this.pointsArr.bezierCurve.length - 1
      ].points.end.y;
      this.bezierCurve.points.c2.x = this.pointsArr.bezierCurve[
        this.pointsArr.bezierCurve.length - 1
      ].points.end.x;
      this.bezierCurve.points.c2.y =
        this.pointsArr.bezierCurve[this.pointsArr.bezierCurve.length - 1].points
          .end.y + 100;
      this.bezierCurve.points.end.x =
        this.pointsArr.bezierCurve[this.pointsArr.bezierCurve.length - 1].points
          .end.x + 100;
      this.bezierCurve.points.end.y =
        this.pointsArr.bezierCurve[this.pointsArr.bezierCurve.length - 1].points
          .end.y + 100;
    },
    anotherPath() {
      //判断加入时是否位于栈顶，否则移除当前index后的所有数据
      if (this.dataStack.data.length > this.dataStack.index) {
        this.dataStack.data.splice(
          this.dataStack.index,
          this.dataStack.data.length - this.dataStack.index
        );
      }
      if (this.pointsArr.bezierCurve.length > 0) {
        this.pointsArr.bezierCurve.forEach(item => {
          item.points.end.grandParentIndex = this.allBezierData.length;
        });
        this.allBezierData.push(cloneDeep(this.pointsArr));
        this.dataStack.data.push([
          cloneDeep(this.allBezierData),
          cloneDeep(this.pointsArr)
        ]);
        this.dataStack.index++;
        this.initData();
        this.initMoveAllBall(this.allBezierData)
      } else {
        alert("不能加入空路径");
        return;
      }
    },
    generateCode() {
      // this
    },
    draw() {
      contextBuffer.clearRect(0, 0, oCanvas.width, oCanvas.height);
      this.movePoint(this.bezierCurve.points);
      if (this.allBezierData.length > 0) {
        this.allBezierData.forEach((item, index) => {
          _drawPointsALL(item.bezierCurve, contextBuffer, this.editState);
          _drawCurveALL(item.bezierCurve, contextBuffer);
          if (this.allMotionState) {
            _drawAnimationALL(
              item.bezierCurve,
              index,
              this.allBalls,
              contextBuffer,
              this.img
            );
          }
        });
      }
      if (this.editChange && this.changingCurve.length > 0) {
        for (let changingItem in this.changingCurve[0].points) {
          this.changingCurve[0].points[changingItem].drawBall(contextBuffer);
        }
      }
      _drawPoints(this.pointsArr.bezierCurve, this.bezierCurve, contextBuffer);
      //画曲线函数(路径数组，当前画的未加入路径的路径点)
      _drawCurve(this.pointsArr.bezierCurve, this.bezierCurve, contextBuffer);
      //画路径中点的动画
      if (this.motionState && this.pointsArr.bezierCurve.length != 0) {
        //运动状态为true,路径点数组长度不为0
        _drawAnimation(
          this.pointsArr.bezierCurve,
          this.balls,
          contextBuffer,
          this.img
        );
      }
      //描点函数(路径数组，当前画的未加入路径的路径点)
      ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
      ctx.drawImage(canvasBuffer, 0, 0);
      // ctx.fill();
    },

    movePoint(usingPoint) {
      if (!this.editChange) {
        for (let type in usingPoint) {
          if (usingPoint[type].isSelect) {
            usingPoint[type].MoveBall(this.mousePositionX, this.mousePositionY);
            this.checkBorder(usingPoint[type]);
            // usingPoint[type].draw(contextBuffer);
          }
        }
      } else {
        this.changingCurve[0].draw(contextBuffer);
        for (let type in this.changingCurve[0].points) {
          if (this.changingCurve[0].points[type].isSelect) {
            this.changingCurve[0].points[type].MoveBall(
              this.mousePositionX,
              this.mousePositionY
            );
            if (this.changingCurve.length == 2 && type == "end") {
              this.changingCurve[1].points.start.x = this.changingCurve[0].points[
                type
              ].x;
              this.changingCurve[1].points.start.y = this.changingCurve[0].points[
                type
              ].y;
            }
            this.checkBorder(this.changingCurve[0].points[type]);
          }
        }
      }
    },
    checkBorder(ball) {
      if (ball.x < ball.radius) {
        //碰到左边界
        ball.x = ball.radius;
      } else if (ball.x > oCanvas.width - ball.radius) {
        //右边界
        ball.x = oCanvas.width - ball.radius;
      }
      if (ball.y < ball.radius) {
        //上边界
        ball.y = ball.radius;
      } else if (ball.y > oCanvas.height - ball.radius) {
        //下边界
        ball.y = oCanvas.height - ball.radius;
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
