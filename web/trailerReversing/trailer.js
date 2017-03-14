function Trailer(car, width, height, color)
{
    var mCar = car;
    
    var mRect = new Rect(width, height, car.GetRect().pos.Minus(Rotate(new Point(0, 1.25 * height), 0)).Minus(Rotate(new Point(0, 0.6 * car.GetRect().height), car.GetRect().angle)), 0);
    
    var mLeftWheel = new Rect(width / 10, height / 10, 0, 0);
    var mRightWheel = new Rect(width / 10, height / 10, 0, 0);
    
    UpdateWheels();
    
    var mColor = color;
    
    var mLastCarPos = car.GetRect().pos;
    
    var mMaxRotationDifference = Math.PI / 2;
    
    this.GetRect = function() { return mRect; }
    
    this.GetLeftWheel = function() { return mLeftWheel; }
    this.GetRightWheel = function() { return mRightWheel; }
    
    this.Reset = function()
    {
        mRect.angle = 0;
        mLastCarPos = car.GetRect().pos;
    }
    
    this.Update = function(cw)
    {
        mRect.pos = car.GetRect().pos.Minus(Rotate(new Point(0, 1.25 * height), mRect.angle)).Minus(Rotate(new Point(0, 0.6 * car.GetRect().height), car.GetRect().angle));
        
        var carMotion = car.GetRect().pos.Minus(mLastCarPos);
        
        var left = Rotate(new Point(-1, 0), mRect.angle);
        var proj = carMotion.x * left.x + carMotion.y * left.y;
        
        mRect.angle += proj / (1.25 * mRect.height);
        
        mLastCarPos = car.GetRect().pos;
        
        if (Math.abs(mRect.angle - car.GetRect().angle) > mMaxRotationDifference)
            HandleJackknife();
        
        UpdateWheels();
    }
    
    this.Draw = function(cw)
    {
        mRect.Draw(cw, mColor);
        
        mLeftWheel.Draw(cw, "black");
        mRightWheel.Draw(cw, "black");
        
        // Connection to car
        var backOfCar = mCar.GetRect().pos.Minus(Rotate(new Point(0, 0.5 * mCar.GetRect().height), car.GetRect().angle));
        var downABit = Rotate(new Point(0, -mCar.GetRect().height / 10), car.GetRect().angle);
        
        var topOfTrailer = mRect.pos.Plus(Rotate(new Point(0, 0.5 * mRect.height), mRect.angle));
        var leftABit = Rotate(new Point(-mRect.width / 2 * 0.7, 0), mRect.angle);
        
        cw.DrawLine(backOfCar, backOfCar.Plus(downABit));
        cw.DrawLine(backOfCar.Plus(downABit), topOfTrailer.Plus(leftABit));
        cw.DrawLine(backOfCar.Plus(downABit), topOfTrailer.Minus(leftABit));
    }
    
    function UpdateWheels()
    {
        mLeftWheel.pos = RotateAround(
            //mRect.pos.Plus(new Point(-mRect.width / 2 - mRect.width / 10, -mRect.height * 0.35)),
            mRect.pos.Plus(new Point(-mRect.width / 2 - mRect.width / 10, 0)),
            mRect.angle,
            mRect.pos);
        
        mRightWheel.pos = RotateAround(
            //mRect.pos.Plus(new Point(mRect.width / 2 + mRect.width / 10, -mRect.height * 0.35)),
            mRect.pos.Plus(new Point(mRect.width / 2 + mRect.width / 10, 0)),
            mRect.angle,
            mRect.pos);
        
        mLeftWheel.angle = mRect.angle;
        mRightWheel.angle = mRect.angle;
    }
}
