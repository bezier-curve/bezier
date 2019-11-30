import { _isLastPoint, _getMoveXY, _getRotateXY} from "./baseTool";
  function _drawCurveALL(pointsArr,contextBuffer) {
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
  }
  function _drawPointsALL(pointsArr,contextBuffer) {
    if (pointsArr.length !== 0) {
      //画开始点
      pointsArr[0].points.start.draw(contextBuffer);
      pointsArr[pointsArr.length - 1].points.end.draw(contextBuffer); 
    }
  }
  //画路径点的动画函数
  function _drawAnimationALL(pointsArr, index,allBalls,contextBuffer,img) {
    contextBuffer.beginPath();
    //计算下一帧小球的x,y坐标
    
    allBalls[index].forEach(item => {
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
      item.t += pointsArr[item.loopIndex].tSpeed;
    });
    contextBuffer.fill();
  }

  function _drawPoints(pointsArr, bezierCurve, contextBuffer) {
    if (pointsArr.length !== 0) {
      //画开始点
      pointsArr[0].points.start.draw(contextBuffer);
      //画结束点
      pointsArr[pointsArr.length - 1].points.end.draw(contextBuffer);
    }
    //画当前路径操作点
    for(var type in bezierCurve.points) {
      if(type != 'start' || pointsArr.length == 0) {
        bezierCurve.points[type].draw(contextBuffer);
      } 
    }
  }
  //画曲线函数
  function _drawCurve(pointsArr, bezierCurve,contextBuffer) {
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
  }
  //画路径点的动画函数
  function _drawAnimation(pointsArr, balls, contextBuffer) {
    contextBuffer.beginPath();
    //计算下一帧小球的x,y坐标
    let img = new Image();
    img.src = "../../../static/airplane.png";
    balls.forEach(item => {
      [item.x, item.y] = _getMoveXY(pointsArr, item.loopIndex, item.t);
      let [xRoto, yRoto] = _getRotateXY(pointsArr, item.loopIndex, item.t);
      // 计算旋转角
      item.angle = Math.atan2(xRoto, yRoto)-Math.atan2(item.x, 0);
      if (
        _isLastPoint(
          item.t,
          item.loopIndex,
          pointsArr.length
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
  }
  export {
    _drawCurveALL,
    _drawPointsALL,
    _drawAnimationALL,
    _drawAnimation,
    _drawPoints,
    _drawCurve
  } 
  