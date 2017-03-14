function Car(pos, width, height, color)
{
    var mRect = new Rect(width, height, pos, 0);
    
    var mFrontLeftWheel = new Rect(width / 10, height / 10, 0, 0);
    var mFrontRightWheel = new Rect(width / 10, height / 10, 0, 0);
    var mBackLeftWheel = new Rect(width / 10, height / 10, 0, 0);
    var mBackRightWheel = new Rect(width / 10, height / 10, 0, 0);
    
    UpdateWheels();
    
    var mWheelRotation = 0;
    var mWheelRotationSpeed = 0.01;
    var mMaxWheelRotation = 0.5;
    
    var mColor = color;
    
    var mSpeed = 0;
    var mAcceleration = 0.0003;
    var mPassiveFriction = 0.02;
    var mBrakingFriction = 0.08;
    
    this.GetRect = function() { return mRect; }
    
    this.GetFrontLeftWheel = function() { return mFrontLeftWheel; }
    this.GetFrontRightWheel = function() { return mFrontRightWheel; }
    this.GetBackLeftWheel = function() { return mBackLeftWheel; }
    this.GetBackRightWheel = function() { return mBackRightWheel; }
    
    this.GetWheelRotation = function() { return mWheelRotation; }
    this.GetMaxWheelRotation = function() { return mMaxWheelRotation; }
    
    this.Reset = function(pos)
    {
        mRect.pos = pos;
        mRect.angle = 0;
        mWheelRotation = 0;
        mSpeed = 0;
    }
    
    this.Draw = function(cw)
    {
        mRect.Draw(cw, mColor);
        
        var frontLeftWheelPos = RotateAround(
            mRect.pos.Plus(new Point(-mRect.width / 2 - mRect.width / 10, mRect.height / 2 - mRect.height / 10)),
            mRect.angle,
            mRect.pos);
        
        var frontRightWheelPos = RotateAround(
            mRect.pos.Plus(new Point(mRect.width / 2 + mRect.width / 10, mRect.height / 2 - mRect.height / 10)),
            mRect.angle,
            mRect.pos);
        
        var backLeftWheelPos = RotateAround(
            mRect.pos.Plus(new Point(-mRect.width / 2 - mRect.width / 10, -mRect.height / 2 + mRect.height / 10)),
            mRect.angle,
            mRect.pos);
        
        var backRightWheelPos = RotateAround(
            mRect.pos.Plus(new Point(mRect.width / 2 + mRect.width / 10, -mRect.height / 2 + mRect.height / 10)),
            mRect.angle,
            mRect.pos);
        
        mFrontLeftWheel.Draw(cw, "black");
        mFrontRightWheel.Draw(cw, "black");
        mBackLeftWheel.Draw(cw, "black");
        mBackRightWheel.Draw(cw, "black");
    }
    
    this.Update = function(cw)
    {
        if (pressedKeys.up)
            mSpeed += mAcceleration;
        
        if (pressedKeys.down)
            mSpeed -= mAcceleration;
        
        var wheelRotationChange = (pressedKeys.s ? 0.2 : 1) * mWheelRotationSpeed;
        
        if (pressedKeys.left)
            mWheelRotation += wheelRotationChange;
        
        if (pressedKeys.right)
            mWheelRotation -= wheelRotationChange;
        
        mWheelRotation = AbsClamp(mWheelRotation, mMaxWheelRotation);
        
        var v = Rotate(new Point(0, Math.cos(mWheelRotation) * mSpeed), mRect.angle);
        mRect.pos = mRect.pos.Plus(v);
        mSpeed *= (1 - mPassiveFriction);
        
        if (pressedKeys.b)
            mSpeed *= (1 - mBrakingFriction);
        
        mRect.angle += Math.sin(mWheelRotation) * mSpeed / (mRect.height / 2);
        
        UpdateWheels();
    }
    
    function UpdateWheels()
    {
        mFrontLeftWheel.pos = RotateAround(
            mRect.pos.Plus(new Point(-mRect.width / 2 - mRect.width / 10, mRect.height / 2 - mRect.height / 10)),
            mRect.angle,
            mRect.pos);
        
        mFrontRightWheel.pos = RotateAround(
            mRect.pos.Plus(new Point(mRect.width / 2 + mRect.width / 10, mRect.height / 2 - mRect.height / 10)),
            mRect.angle,
            mRect.pos);
        
        mBackLeftWheel.pos = RotateAround(
            mRect.pos.Plus(new Point(-mRect.width / 2 - mRect.width / 10, -mRect.height / 2 + mRect.height / 10)),
            mRect.angle,
            mRect.pos);
        
        mBackRightWheel.pos = RotateAround(
            mRect.pos.Plus(new Point(mRect.width / 2 + mRect.width / 10, -mRect.height / 2 + mRect.height / 10)),
            mRect.angle,
            mRect.pos);
        
        mFrontLeftWheel.angle = mRect.angle + mWheelRotation;
        mFrontRightWheel.angle = mRect.angle + mWheelRotation;
        mBackLeftWheel.angle = mRect.angle;
        mBackRightWheel.angle = mRect.angle;
    }
}
