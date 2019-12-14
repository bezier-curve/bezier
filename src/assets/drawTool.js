import { _getMoveXY, _getRotateXY } from "./baseTool";
function _drawCurveALL(pointsArr, contextBuffer,editState,pIndex,gIndex) {
  if (pointsArr.length !== 0) {
    for (let item of pointsArr) {
      item.drawCurve(contextBuffer,editState,pIndex,gIndex);
      // contextBuffer.beginPath();
      // contextBuffer.moveTo(item.points.start.x, item.points.start.y);
      // contextBuffer.bezierCurveTo(
      //   item.points.c1.x,
      //   item.points.c1.y,
      //   item.points.c2.x,
      //   item.points.c2.y,
      //   item.points.end.x,
      //   item.points.end.y
      // );
      // contextBuffer.strokeStyle = "#50E3C2";
      // contextBuffer.stroke();
    }
  }
}
function _drawPointsALL(pointsArr, contextBuffer, editState) {
  if (pointsArr.length !== 0) {
    //画开始点
    if (!editState) {
      pointsArr[0].points.start.draw(contextBuffer);
      pointsArr[pointsArr.length - 1].points.end.draw(contextBuffer);
    } else {
      for (let item of pointsArr) {
        // item.points.start.color = '#590325';
        // item.points.end.color = '#236589';
        // item.points.start.draw(contextBuffer);
        item.points.end.draw(contextBuffer);
      }
    }
  }
}
//画路径点的动画函数
// function _drawAnimationALL(pointsArr, index, allBalls, contextBuffer, img) {
function _drawAnimationALL(pointsArr, index, allBalls, contextBuffer,img) { 
  contextBuffer.beginPath();
  //计算下一帧小球的x,y坐标

  allBalls[index].forEach(item => {
    [item.x, item.y] = _getMoveXY(pointsArr, item.loopIndex, item.t);
    let [xRoto, yRoto] = _getRotateXY(pointsArr, item.loopIndex, item.t);
    item.angle = Math.atan2(xRoto, yRoto) - Math.atan2(item.x, 0);
    // if (_isLastPoint(item.t, item.loopIndex, pointsArr.length)) {
    //   item.t = 0;
    //   // item.loopIndex = item.oldLoopIndex;
    //   item.loopIndex = 0;
    // }
    //判断是否到最后一个点
    item.drawBall(contextBuffer, img);
    if (Math.floor(item.t) == 1) {
      item.t = 0;
      // item.loopIndex++;
    }

    // item.drawImg(contextBuffer)
    // item.drawBall(contextBuffer, img);
    // item.t += pointsArr[item.loopIndex].tSpeed;
    item.t += 0.005;
  });
  contextBuffer.fill();
}

function _drawPoints(pointsArr, bezierCurve, contextBuffer, motionState, allMotionState,editState) {
  if (pointsArr.length !== 0) {
    //画开始点
    pointsArr[0].points.start.draw(contextBuffer);
    //画结束点
    pointsArr[pointsArr.length - 1].points.end.draw(contextBuffer);
  }
  //画当前路径操作点
  if (!motionState && !allMotionState&&!editState) {
    for (var type in bezierCurve.points) {
      if (type != 'start' || pointsArr.length == 0) {
        bezierCurve.points[type].draw(contextBuffer);
      }
    }
  }
}
//画曲线函数
function _drawCurve(pointsArr, bezierCurve, contextBuffer, motionState, allMotionState,editState) {
  if (pointsArr.length !== 0) {
    for (let item of pointsArr) {
      // console.log(item)
      item.drawCurve(contextBuffer);
      // contextBuffer.beginPath();
      // contextBuffer.moveTo(item.points.start.x, item.points.start.y);
      // contextBuffer.bezierCurveTo(
      //   item.points.c1.x,
      //   item.points.c1.y,
      //   item.points.c2.x,
      //   item.points.c2.y,
      //   item.points.end.x,
      //   item.points.end.y
      // );
      // contextBuffer.strokeStyle = "#50E3C2";
      // contextBuffer.stroke();
    }
  }
  if (!motionState && !allMotionState&&!editState) {
    //如果画的路径需求的4个点都存在
    bezierCurve.draw(contextBuffer);

    // contextBuffer.beginPath();
    // contextBuffer.moveTo(bezierCurve.points.start.x, bezierCurve.points.start.y);
    // contextBuffer.bezierCurveTo(
    //   bezierCurve.points.c1.x,
    //   bezierCurve.points.c1.y,
    //   bezierCurve.points.c2.x,
    //   bezierCurve.points.c2.y,
    //   bezierCurve.points.end.x,
    //   bezierCurve.points.end.y
    // );
    // contextBuffer.strokeStyle = "#50E3C2";
    // contextBuffer.stroke();
  }
}
//画路径点的动画函数
function _drawAnimation(pointsArr, balls, contextBuffer,img) {
  contextBuffer.beginPath();
  //计算下一帧小球的x,y坐标
  // let img = new Image();
  // img.src = "../../../static/airplane.png";
  balls.forEach(item => {
    [item.x, item.y] = _getMoveXY(pointsArr, item.loopIndex, item.t);
    let [xRoto, yRoto] = _getRotateXY(pointsArr, item.loopIndex, item.t);
    // 计算旋转角
    item.angle = Math.atan2(xRoto, yRoto) - Math.atan2(item.x, 0);
    // if (
    //   _isLastPoint(
    //     item.t,
    //     item.loopIndex,
    //     pointsArr.length
    //   )
    // ) {
    //   item.t = 0;
    //   item.loopIndex = 0;
    // }
    //判断是否到最后一个点
    if (Math.floor(item.t) == 1) {
      item.t = 0;
      // item.loopIndex++;
    }
    // item.drawImg(contextBuffer)
    item.drawBall(contextBuffer, img);
    item.t += 0.005;
  });
  contextBuffer.fill();
}
/* 
param(全曲线数据数组，属性，属性值)
*/
function _changCurveStyle(allBezierData, type, value, index) {
  if (arguments.length == 4) {
    allBezierData[index].bezierCurve.forEach(curveItem => {
      curveItem[type] = value;
    })
  } else if (arguments.length == 3) {
    allBezierData.forEach(bezierItem => {
      bezierItem.bezierCurve.forEach(curveItem => {
        curveItem[type] = value;
      })
    });
  } else {
    console.log('参数错误')
  }
}
/* 
@param(所有贝塞尔曲线，改变的属性，属性值，爷索引，父索引，4个点里的哪一个点)
传3个值 修改所有小球属性
传4个值 修改一条大线上的所有小球属性
传5个值 修改一条小线上所有小球属性
传6个值 修改一个小球属性
*/
function _changPointsStyle(allBezierData, type, value, GIndex, PIndex, Ptype) {
  if (arguments.length == 6) {
    allBezierData[GIndex].bezierCurve[PIndex].points[Ptype][type] = value
  } else if (arguments.length == 5) {
    let points = allBezierData[GIndex].bezierCurve[PIndex].points;
    for (let point in points) {
      points[point][type] = value
    }
  } else if (arguments.length == 4) {
    allBezierData[GIndex].bezierCurve.forEach(curveItem => {
      for (let point in curveItem.points) {
        curveItem.points[point][type] = value
      }
    })
  } else if (arguments.length == 3) {
    allBezierData.forEach(bezierItem => {
      bezierItem.bezierCurve.forEach(curveItem => {
        for (let point in curveItem.points) {
          curveItem.points[point][type] = value
        }
      })
    });
  } else {
    console.log('参数错误')
    return;
  }
}
function delCurve(allBezierData,gIndex){
allBezierData.splice(gIndex,1)
}
export {
  _drawCurveALL,
  _drawPointsALL,
  _drawAnimationALL,
  _drawAnimation,
  _drawPoints,
  _drawCurve,
  _changCurveStyle,
  _changPointsStyle,
  delCurve
}
