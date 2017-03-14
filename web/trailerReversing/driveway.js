function Driveway(pos, width, height, rotation, thickness, greenHeight, car, trailer)
{
    var mPos = pos;
    var mWidth = width;
    var mHeight = height;
    var mRotation = rotation;
    var mThickness = thickness;
    var mGreenHeight = greenHeight;
    
    var mLeftSide;
    var mRightSide;
    var mBottomSide;
    var mGreenZone;
    
    this.GetGreenZone = function() { return mGreenZone; };
    
    (function()
    {
        var left = Rotate(new Point(-mWidth / 2, 0), mRotation);
        var down = Rotate(new Point(0, -mHeight / 2), mRotation);
        
        mGreenZone = new Rect(
            mWidth,
            mGreenHeight,
            mPos.Plus(Rotate(new Point(0, -0.5 * (mHeight - mGreenHeight)), mRotation)),
            mRotation);
        
        mLeftSide = new Rect(mThickness, mHeight, mPos.Plus(left), mRotation);
        mRightSide = new Rect(mThickness, mHeight, mPos.Minus(left), mRotation);
        mBottomSide = new Rect(mWidth, mThickness, mPos.Plus(down), mRotation);
    })();
    
    var mCar = car;
    var mTrailer = trailer;
    
    this.Update = function(cw)
    {
        if (
            CombinedAnyCornerRectIntersection(
                [mTrailer.GetRect(), mTrailer.GetLeftWheel(), mTrailer.GetRightWheel()],
                [mLeftSide, mRightSide, mBottomSide]) ||
            CombinedAnyCornerRectIntersection(
                [mCar.GetRect(), mCar.GetFrontLeftWheel(), mCar.GetFrontRightWheel(), mCar.GetBackLeftWheel(), mCar.GetBackRightWheel()],
                [mLeftSide, mRightSide, mBottomSide]))
        {
            HandleCrash();
        }
        else if (
            CombinedInsideRect(
                [mTrailer.GetRect(), mTrailer.GetLeftWheel(), mTrailer.GetRightWheel()],
                mGreenZone))
        {
            HandleVictory();
        }
    }
    
    this.Draw = function(cw)
    {
        mGreenZone.Draw(cw, "#CCFFCC");
        mLeftSide.Draw(cw, "black");
        mRightSide.Draw(cw, "black");
        mBottomSide.Draw(cw, "black");
    }
}
