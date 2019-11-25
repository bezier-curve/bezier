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
const Dclone = (obj) => {
    var o;
    // 如果  他是对象object的话  , 因为null,object,array  也是'object';
    if (typeof obj === 'object') {
      // 如果  他是空的话
      if (obj === null) {
        o = null;
      }
      else {
        // 如果  他是数组arr的话
        if (obj instanceof Array) {
          o = [];
          for (var i = 0, len = obj.length; i < len; i++) {
            o.push(Dclone(obj[ i ]));
          }
        }
        // 如果  他是对象object的话
        else {
          o = {};
          for (var j in obj) {
            o[ j ] = Dclone(obj[ j ]);
          }
        }
        
      }
    }
    else {
      o = obj;
    }
    return o;
  };
//判断是否达到终点
function _isLastPoint(t, loopIndex, length) {
    if(Math.floor(t) == 1&&loopIndex == length-1){
        return true;
    }else{
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
        pointsArr[loopIndex].points[0].x,
        pointsArr[loopIndex].points[1].x,
        pointsArr[loopIndex].points[2].x,
        pointsArr[loopIndex].points[3].x,
        t
    );
    let y = getBezierCoord(
        pointsArr[loopIndex].points[0].y,
        pointsArr[loopIndex].points[1].y,
        pointsArr[loopIndex].points[2].y,
        pointsArr[loopIndex].points[3].y,
        t
    );
    return [x,y]
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
      pointsArr[loopIndex].points[0].x,
      pointsArr[loopIndex].points[1].x,
      pointsArr[loopIndex].points[2].x,
      pointsArr[loopIndex].points[3].x,
      t
    );
    let y = getBezierRotate(
      pointsArr[loopIndex].points[0].y,
      pointsArr[loopIndex].points[1].y,
      pointsArr[loopIndex].points[2].y,
      pointsArr[loopIndex].points[3].y,
      t
    );
    return [x,y]
}
//获取夹角向量
function getBezierRotate(p1, p2, p3, p4, t) {
    // B(t) = P0(1-t)³ + 3P1t(1-t)² + 3P2t²(1-t) + P3t³
    return (
        p1 * Math.pow(1 - t, 2)*(-3) +
        3 * p2 * (Math.pow(1 - t, 2)+t*2*(t-1)) +
        3 * p3 *(2*t*(1-t)-Math.pow(t, 2)) +
        3*p4 * Math.pow(t, 2)
    );
}
function _getrotate(x,y){
    return Math.Atan2(x, y) * 180 / 3.14
}
export {
    // _isNextPoint,
    _isLastPoint,
    _getMoveXY,
    _getrotate,
    _getRotateXY,
    Dclone
} 
