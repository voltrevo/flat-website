function Clamp(lower, x, upper)
{
    if (x < lower)
        x = lower;
    else if (x > upper)
        x = upper;
    
    return x;
}

function AbsClamp(x, limit)
{
    return Clamp(-limit, x, limit);
}

function PointInsideRect(p, width, height, pos, rotation)
{
    p = RotateAround(p, -rotation, pos);
    
    return (
        Math.abs(p.x - pos.x) < width / 2 &&
        Math.abs(p.y - pos.y) < height / 2);
}

function RectInsideRect(w1, h1, p1, r1, w2, h2, p2, r2)
{
    var frontLeft = Rotate(new Point(-w1 / 2, h1 / 2), r1).Plus(p1);
    var frontRight = Rotate(new Point(w1 / 2, h1 / 2), r1).Plus(p1);
    var backLeft = Rotate(new Point(-w1 / 2, -h1 / 2), r1).Plus(p1);
    var backRight = Rotate(new Point(w1 / 2, -h1 / 2), r1).Plus(p1);
    
    return (
        PointInsideRect(frontLeft, w2, h2, p2, r2) &&
        PointInsideRect(frontRight, w2, h2, p2, r2) &&
        PointInsideRect(backLeft, w2, h2, p2, r2) &&
        PointInsideRect(backRight, w2, h2, p2, r2));
}

function RectAnyCornerIntersection(w1, h1, p1, r1, w2, h2, p2, r2)
{
    var frontLeft1 = Rotate(new Point(-w1 / 2, h1 / 2), r1).Plus(p1);
    var frontRight1 = Rotate(new Point(w1 / 2, h1 / 2), r1).Plus(p1);
    var backLeft1 = Rotate(new Point(-w1 / 2, -h1 / 2), r1).Plus(p1);
    var backRight1 = Rotate(new Point(w1 / 2, -h1 / 2), r1).Plus(p1);
    
    var frontLeft2 = Rotate(new Point(-w2 / 2, h2 / 2), r2).Plus(p2);
    var frontRight2 = Rotate(new Point(w2 / 2, h2 / 2), r2).Plus(p2);
    var backLeft2 = Rotate(new Point(-w2 / 2, -h2 / 2), r2).Plus(p2);
    var backRight2 = Rotate(new Point(w2 / 2, -h2 / 2), r2).Plus(p2);
    
    return (
        PointInsideRect(frontLeft1, w2, h2, p2, r2) ||
        PointInsideRect(frontRight1, w2, h2, p2, r2) ||
        PointInsideRect(backLeft1, w2, h2, p2, r2) ||
        PointInsideRect(backRight1, w2, h2, p2, r2) ||
        PointInsideRect(frontLeft2, w1, h1, p1, r1) ||
        PointInsideRect(frontRight2, w1, h1, p1, r1) ||
        PointInsideRect(backLeft2, w1, h1, p1, r1) ||
        PointInsideRect(backRight2, w1, h1, p1, r1));
}
