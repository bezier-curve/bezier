class JointBezier {
    constructor(o, type) {
        this.bezierCurve = o.bezierCurve || [],
            this.color = o.color || '#0F0',
            this.visible = o.visible || true,
            this.type = type || 'ball'
    }
    drawBall() {
        if (!this.visible) { return }  // 不可见
    }
    update(m_x, m_y) {
        if (this.isSelect) {
            this.x = m_x;
            this.y = m_y;
        }
    }
}
export default JointBezier