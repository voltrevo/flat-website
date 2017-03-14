function Timer()
{
    var mPos = new Point(0, 0);
    
    var mExtraSeconds = 0;
    var mCurrentSeconds = 0;
    var mDisplayText = "";
    var mStartTime;
    
    this.Update = function(cw)
    {
        mPos.x = cw.GetLeft() + 0.1;
        mPos.y = cw.GetBottom() + 0.1;
        
        if (mStartTime)
            mCurrentSeconds = mExtraSeconds + ((new Date()) - mStartTime) / 1000;
        
        var seconds = Math.floor(mCurrentSeconds);
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        var hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        
        mDisplayText = (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }
    
    this.Start = function()
    {
        mStartTime = new Date();
    }
    
    this.Stop = function()
    {
        if (mStartTime)
        {
            mExtraSeconds = mExtraSeconds + ((new Date()) - mStartTime) / 1000;
            mStartTime = null;
        }
    }
    
    this.Reset = function()
    {
        mExtraSeconds = 0;
        
        if (mStartTime)
            mStartTime = new Date();
    }
    
    this.Draw = function(cw)
    {
        cw.DrawText(mPos, mDisplayText);
    }
}
