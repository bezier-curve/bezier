//判断是否达到下一段起点
function _isNextPoint(x, y, pointsArr, loopIndex) {
    if ((Math.floor(x) + 1 == Math.floor(pointsArr[loopIndex][3].x) ||
        Math.floor(x) == Math.floor(pointsArr[loopIndex][3].x) ||
        Math.floor(x) - 1 == Math.floor(pointsArr[loopIndex][3].x)) &&
        (Math.floor(y) + 1 == Math.floor(pointsArr[loopIndex][3].y) ||
            Math.floor(y) == Math.floor(pointsArr[loopIndex][3].y) ||
            Math.floor(y) - 1 == Math.floor(pointsArr[loopIndex][3].y))) {
        return true;
    } else {
        return false;
    }
}
//判断是否达到终点
function _isLastPoint(x, y, pointsArr) {
    if (
        (Math.floor(x) + 1 ==
            Math.floor(pointsArr[pointsArr.length - 1][3].x) ||
            Math.floor(x) ==
            Math.floor(pointsArr[pointsArr.length - 1][3].x) ||
            Math.floor(x) - 1 ==
            Math.floor(pointsArr[pointsArr.length - 1][3].x)) &&
        (Math.floor(y) + 1 ==
            Math.floor(pointsArr[pointsArr.length - 1][3].y) ||
            Math.floor(y) ==
            Math.floor(pointsArr[pointsArr.length - 1][3].y) ||
            Math.floor(y) - 1 ==
            Math.floor(pointsArr[pointsArr.length - 1][3].y))
    ) {
        return true
    } else {
        return false;
    }
}
//获取贝塞尔运动球的x,y值
function _getMoveXY(pointsArr, loopIndex, t) {
    let x = getBezierCoord(
        pointsArr[loopIndex][0].x,
        pointsArr[loopIndex][1].x,
        pointsArr[loopIndex][2].x,
        pointsArr[loopIndex][3].x,
        t
    );
    let y = getBezierCoord(
        pointsArr[loopIndex][0].y,
        pointsArr[loopIndex][1].y,
        pointsArr[loopIndex][2].y,
        pointsArr[loopIndex][3].y,
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
function _getrotate(x,y){
    return Math.Atan2(x, y) * 180 / 3.14
}
export {
    _isNextPoint,
    _isLastPoint,
    _getMoveXY,
    _getrotate
} 
