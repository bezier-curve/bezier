//判断是否达到下一段起点
// function _isNextPoint(x, y, pointsArr, loopIndex) {
//     if ((Math.floor(x) + 1 == Math.floor(pointsArr[loopIndex][3].x) ||
//         Math.floor(x) == Math.floor(pointsArr[loopIndex][3].x) ||
//         Math.floor(x) - 1 == Math.floor(pointsArr[loopIndex][3].x)) &&
//         (Math.floor(y) + 1 == Math.floor(pointsArr[loopIndex][3].y) ||
//             Math.floor(y) == Math.floor(pointsArr[loopIndex][3].y) ||
//             Math.floor(y) - 1 == Math.floor(pointsArr[loopIndex][3].y))) {
//         return true;
//     } else {
//         return false;
//     }
// }
//判断是否达到终点
function _isLastPoint(t, loopIndex, length) {
  if (Math.floor(t) == 1 && loopIndex == length - 1) {
    return true;
  } else {
    return false;
  }
  // if (
  //     (Math.floor(x) + 1 ==
  //         Math.floor(pointsArr[pointsArr.length - 1][3].x) ||
  //         Math.floor(x) ==
  //         Math.floor(pointsArr[pointsArr.length - 1][3].x) ||
  //         Math.floor(x) - 1 ==
  //         Math.floor(pointsArr[pointsArr.length - 1][3].x)) &&
  //     (Math.floor(y) + 1 ==
  //         Math.floor(pointsArr[pointsArr.length - 1][3].y) ||
  //         Math.floor(y) ==
  //         Math.floor(pointsArr[pointsArr.length - 1][3].y) ||
  //         Math.floor(y) - 1 ==
  //         Math.floor(pointsArr[pointsArr.length - 1][3].y))
  // ) {
  //     return true
  // } else {
  //     return false;
  // }
}
//获取贝塞尔运动球的x,y值
function _getMoveXY(pointsArr, loopIndex, t) {
  let x = getBezierCoord(
    pointsArr[loopIndex].points.start.x,
    pointsArr[loopIndex].points.c1.x,
    pointsArr[loopIndex].points.c2.x,
    pointsArr[loopIndex].points.end.x,
    t
  );
  let y = getBezierCoord(
    pointsArr[loopIndex].points.start.y,
    pointsArr[loopIndex].points.c1.y,
    pointsArr[loopIndex].points.c2.y,
    pointsArr[loopIndex].points.end.y,
    t
  );
  return [x, y]
}
//贝塞尔运动函数
function getBezierCoord(p1, p2, p3, p4, t) {
  // B(t) = P0(1-t)³ + 3P1t(1-t)² + 3P2t²(1-t) + P3t³
  return (
    p1 * Math.pow(1 - t, 3) +
    3 * p2 * t * Math.pow(1 - t, 2) +
    3 * p3 * Math.pow(t, 2) * (1 - t) +
    p4 * Math.pow(t, 3)
  );
}

function _getRotateXY(pointsArr, loopIndex, t) {
  let x = getBezierRotate(
    pointsArr[loopIndex].points.start.x,
    pointsArr[loopIndex].points.c1.x,
    pointsArr[loopIndex].points.c2.x,
    pointsArr[loopIndex].points.end.x,
    t
  );
  let y = getBezierRotate(
    pointsArr[loopIndex].points.start.y,
    pointsArr[loopIndex].points.c1.y,
    pointsArr[loopIndex].points.c2.y,
    pointsArr[loopIndex].points.end.y,
    t
  );
  return [x, y]
}
//获取夹角向量
function getBezierRotate(p1, p2, p3, p4, t) {
  // B(t) = P0(1-t)³ + 3P1t(1-t)² + 3P2t²(1-t) + P3t³
  return (
    p1 * Math.pow(1 - t, 2) * (-3) +
    3 * p2 * (Math.pow(1 - t, 2) + t * 2 * (t - 1)) +
    3 * p3 * (2 * t * (1 - t) - Math.pow(t, 2)) +
    3 * p4 * Math.pow(t, 2)
  );
}
function _getrotate(x, y) {
  return Math.Atan2(x, y) * 180 / 3.14
}
function beze_speed_x(t, xa, xb, xc, xd) {
  let it = 1 - t;
  return -3 * xa * it * it + 3 * xb * it * it - 6 * xb * it * t + 6 * xc * it * t - 3 * xc * t * t + 3 * xd * t * t;
}
//y坐标速度方程-------------------------------------------------------------------------------------
function beze_speed_y(t, ya, yb, yc, yd) {
  let it = 1 - t;
  return -3 * ya * it * it + 3 * yb * it * it - 6 * yb * it * t + 6 * yc * it * t - 3 * yc * t * t + 3 * yd * t * t;
}
function beze_speed(t, xa, xb, xc, xd, ya, yb, yc, yd) {
  let sx = beze_speed_x(t, xa, xb, xc, xd);
  let sy = beze_speed_y(t, ya, yb, yc, yd);
  return Math.sqrt(sx * sx + sy * sy);
}
function beze_length(t, xa, xb, xc, xd, ya, yb, yc, yd) {
  //在总长度范围内，使用simpson算法的分割数
  const TOTAL_SIMPSON_STEP = 10000;
  let stepCounts = TOTAL_SIMPSON_STEP * t;
  if (stepCounts & 1) stepCounts++;
  if (stepCounts == 0) return 0.0;
  let halfCounts = stepCounts / 2;
  let sum1 = 0.0;
  let sum2 = 0.0;
  let dStep = t / stepCounts;
  for (let i = 0; i < halfCounts; i++) {
    sum1 += beze_speed((2 * i + 1) * dStep, xa, xb, xc, xd, ya, yb, yc, yd);
  }
  for (let i = 1; i < halfCounts; i++) {
    sum2 += beze_speed((2 * i) * dStep, xa, xb, xc, xd, ya, yb, yc, yd);
  }
  return (beze_speed(0.0, xa, xb, xc, xd, ya, yb, yc, yd) + beze_speed(1.0, xa, xb, xc, xd, ya, yb, yc, yd) + 2 * sum2 + 4 * sum1) * dStep / 3.0;
}
function _beze_even(t, xa, xb, xc, xd, ya, yb, yc, yd) {
  let len = t; //如果按照匀速增长,此时对应的曲线长度
  let t1 = t, t2;
  do {
    t2 = t1 - (beze_length(t1, xa, xb, xc, xd, ya, yb, yc, yd) - len) / beze_speed(t1, xa, xb, xc, xd, ya, yb, yc, yd);
    t1 = t2;
  } while (Math.abs(t1 - t2) < 0.01);
  return t2;
}
function MathSpeed(xa, xb, xc, xd, ya, yb, yc, yd, W, H) {
  let max = 4*W+4*H;
  // let variance = Math.abs(3 * xa - xb - xc - xd + 3 * ya - yb - yc - yd) + Math.abs(3 * xb - xa - xc - xd + 3 * yb - ya - yc - yd)/2 + Math.abs(3 * xc - xa - xb - xd + 3 * yc - ya - yb - yd)/2 + Math.abs(3 * xd - xa - xc - xb + 3 * yd - ya - yc - yb);
  let variance = Math.abs(xa-xd)+Math.abs(xc-xb)/2+Math.abs(ya-yd)+Math.abs(yc-yb)/2+(Math.abs(ya-yb)+Math.abs(ya-yc)+Math.abs(yd-yc)+Math.abs(yd-yb)+Math.abs(xa-xb)+Math.abs(xa-xc)+Math.abs(xd-xc)+Math.abs(xd-xb))/2
  let proportionSpeed = variance / max;
  return proportionSpeed;
}
function _getSpeed(bezierCurve, W, H) {
  console.log(bezierCurve)
  let _t = MathSpeed(
    bezierCurve.points.start.x,
    bezierCurve.points.c1.x,
    bezierCurve.points.c2.x,
    bezierCurve.points.end.x,
    bezierCurve.points.start.y,
    bezierCurve.points.c1.y,
    bezierCurve.points.c2.y,
    bezierCurve.points.end.y,
    W,
    H
  );
  return _t
}
export {
  // _isNextPoint,
  _isLastPoint,
  _getMoveXY,
  _getrotate,
  _getRotateXY,
  _getSpeed,
  _beze_even
} 
