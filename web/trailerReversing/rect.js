function Rect(width, height, pos, angle)
{
    this.width = width;
    this.height = height;
    this.pos = pos;
    this.angle = angle;
    
    this.GetTopLeft = function() { return Rotate(new Point(-this.width / 2, this.height / 2), this.angle).Plus(this.pos); }
    this.GetTopRight = function() { return Rotate(new Point(this.width / 2, this.height / 2), this.angle).Plus(this.pos); }
    this.GetBottomLeft = function() { return Rotate(new Point(-this.width / 2, -this.height / 2), this.angle).Plus(this.pos); }
    this.GetBottomRight = function() { return Rotate(new Point(this.width / 2, -this.height / 2), this.angle).Plus(this.pos); }
    
    this.ContainsPoint = function(p)
    {
        var rp = RotateAround(p, -this.angle, this.pos);
        
        return (
            Math.abs(rp.x - this.pos.x) < this.width / 2 &&
            Math.abs(rp.y - this.pos.y) < this.height / 2);
    }
    
    this.InsideRect = function(r2)
    {
        return (
            r2.ContainsPoint(this.GetTopLeft()) &&
            r2.ContainsPoint(this.GetTopRight()) &&
            r2.ContainsPoint(this.GetBottomLeft()) &&
            r2.ContainsPoint(this.GetBottomRight()));
    }
    
    this.ContainsRect = function(r2) { return r2.InideRect(this); }
    
    this.AnyCornerRectIntersection = function(r2)
    {
        return (
            r2.ContainsPoint(this.GetTopLeft()) ||
            r2.ContainsPoint(this.GetTopRight()) ||
            r2.ContainsPoint(this.GetBottomLeft()) ||
            r2.ContainsPoint(this.GetBottomRight()) ||
            this.ContainsPoint(r2.GetTopLeft()) ||
            this.ContainsPoint(r2.GetTopRight()) ||
            this.ContainsPoint(r2.GetBottomLeft()) ||
            this.ContainsPoint(r2.GetBottomRight()));
    }
    
    this.Draw = function(cw, color)
    {
        cw.DrawRotatedRect(this.pos, this.width, this.height, this.angle, color);
    }
}

function CombinedAnyCornerRectIntersection(rectArr1, rectArr2)
{
    var i, j;
    
    for (i = 0; i < rectArr1.length; i = i + 1)
    {
        for (j = 0; j < rectArr2.length; j = j + 1)
        {
            if (rectArr1[i].AnyCornerRectIntersection(rectArr2[j]))
                return true;
        }
    }
    
    return false;
}

function CombinedInsideRect(rectArr, containingRect)
{
    var i;
    
    for (i = 0; i < rectArr.length; i = i + 1)
    {
        if (!rectArr[i].InsideRect(containingRect))
            return false;
    }
    
    return true;
}
