class JointBezier {
    constructor(o, type) {
        this.bezierCurve = o.bezierCurve || [],
            this.color = o.color || '#0F0',
            this.visible = o.visible || true,
            this.type = type || 'ball'
            this.isSelect = false;
    }
    changCurveStyle(allData,type,value,index) {
        for(let bezierIndex in allData[index].bezierCurve){
            console.log(allData[index].bezierCurve)
            console.log(allData[index].bezierCurve[bezierIndex][type])
            allData[index].bezierCurve[bezierIndex][type] = value;
            console.log(allData[index].bezierCurve[bezierIndex][type])
            // for(let curveIndex in allData[index][bezierIndex]){
            //     console.log(allData[index][bezierIndex].bezierCurve[curveIndex][type])
            //     allData[index][bezierIndex].bezierCurve[curveIndex][type] = value
            //     console.log(allData[index][bezierIndex].bezierCurve[curveIndex][type])
            // }
        }
    }
    update(m_x, m_y) {
        if (this.isSelect) {
            this.x = m_x;
            this.y = m_y;
        }
    }
}
export default JointBezier