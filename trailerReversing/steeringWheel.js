function SteeringWheel(pos, radius, car)
{
    var mPos = pos;
    var mRadius = radius;
    var mCar = car;
    
    var mMaxRotation = 3 * Math.PI;
    
    this.Draw = function(cw)
    {
        cw.DrawCircle(mPos, mRadius);
        cw.DrawCircle(mPos, mRadius / 3);
        
        var bottomSpokeA = new Point(mPos.x, mPos.y - mRadius / 3);
        var bottomSpokeB = new Point(mPos.x, mPos.y - mRadius);
        
        var bottomToTopAngle = 0.55 * Math.PI;
        
        var rotation = mMaxRotation * mCar.GetWheelRotation() / mCar.GetMaxWheelRotation();
        
        cw.DrawLine(RotateAround(bottomSpokeA, rotation, mPos), RotateAround(bottomSpokeB, rotation, mPos));
        cw.DrawLine(RotateAround(bottomSpokeA, rotation + bottomToTopAngle, mPos), RotateAround(bottomSpokeB, rotation + bottomToTopAngle, mPos));
        cw.DrawLine(RotateAround(bottomSpokeA, rotation - bottomToTopAngle, mPos), RotateAround(bottomSpokeB, rotation - bottomToTopAngle, mPos));
        
        cw.DrawRect(mPos.Plus(new Point(0, 1.3 * mRadius)), 2 * mRadius, 0.15 * mRadius, "white");
        
        cw.DrawRect(
            mPos.Plus(new Point(-0.5 * mRadius * mCar.GetWheelRotation() / mCar.GetMaxWheelRotation(), 1.3 * mRadius)),
            mRadius * mCar.GetWheelRotation() / mCar.GetMaxWheelRotation(),
            0.15 * mRadius,
            "black");
    }
}
