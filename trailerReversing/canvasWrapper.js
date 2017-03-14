var CanvasWrapperShared =
{
    loadTime: new Date()
};

function Point(x, y)
{
    this.x = x;
    this.y = y;
    
    this.ToString = function() { return "(" + Math.round(1000 * this.x) / 1000 + ", " + Math.round(1000 * this.y) / 1000 + ")"; }
    
    this.Plus = function(p)
    {
        return new Point(this.x + p.x, this.y + p.y);
    }
    
    this.Minus = function(p)
    {
        return new Point(this.x - p.x, this.y - p.y);
    }
    
    this.Multiply = function(m)
    {
        return new Point(this.x * m, this.y * m);
    }
}

function CanvasWrapper(context)
{
    var mContext = context;
    var mItems = new Array();
    
    this.time = (new Date() - CanvasWrapperShared.loadTime) / 1000;
    this.center = new Point(0, 0);
    this.width = 2.4;
    
    var ToCanvasPos = function(localP)
    {
        var canvasP = localP
            .Minus(this.center)
            .Multiply(GetDimensions.call(this).x / this.width);
        
        canvasP.y *= -1;
        
        canvasP = canvasP.Plus(GetDimensions.call(this).Multiply(0.5));
        
        return canvasP;
    }
    
    var ToLocalX = function(canvasX)
    {
        var localX = canvasX - GetDimensions.call(this).x / 2; // Canvas distance from canvas center
        localX = ToLocalScale.call(this, localX); // Local distance from canvas center
        localX += this.center.x; // Local x
        
        return localX;
    }
    
    var ToCanvasScale = function(x) { return x * GetDimensions.call(this).x / this.width; }
    var ToLocalScale = function(x) { return x * this.width / GetDimensions.call(this).x; }
    
    var GetDimensions = function() { return new Point(mContext.canvas.clientWidth, mContext.canvas.clientHeight); }
    
    var GetAspectRatio = function() { return mContext.canvas.clientWidth / mContext.canvas.clientHeight; }
    var GetHeight = function() { return this.width / GetAspectRatio.call(this); }
    
    this.GetLeft = function() { return this.center.x - this.width / 2; }
    this.GetRight = function() { return this.center.x + this.width / 2; }
    
    this.GetTop = function() { return this.center.y + GetHeight.call(this) / 2; }
    this.GetBottom = function() { return this.center.y - GetHeight.call(this) / 2; }
    
    this.DrawCircle = function(pos, radius)
    {
        var canvasPos = ToCanvasPos.call(this, pos);
        
        mContext.beginPath();
        mContext.arc(canvasPos.x, canvasPos.y, ToCanvasScale.call(this, radius), 0, 2 * Math.PI, false);
        mContext.lineWidth = 1;
        mContext.strokeStyle = "black";
        mContext.stroke();
    }
    
    this.DrawRect = function(pos, width, height, color)
    {
        var topLeft = new Point(pos.x - width / 2, pos.y + height / 2);
        var topRight = new Point(pos.x + width / 2, pos.y + height / 2);
        var bottomLeft = new Point(pos.x - width / 2, pos.y - height / 2);
        var bottomRight = new Point(pos.x + width / 2, pos.y - height / 2);
        
        // To canvas coordinates
        topLeft = ToCanvasPos.call(this, topLeft);
        topRight = ToCanvasPos.call(this, topRight);
        bottomLeft = ToCanvasPos.call(this, bottomLeft);
        bottomRight = ToCanvasPos.call(this, bottomRight);
        
        mContext.beginPath();
        mContext.moveTo(topLeft.x, topLeft.y);
        mContext.lineTo(topRight.x, topRight.y);
        mContext.lineTo(bottomRight.x, bottomRight.y);
        mContext.lineTo(bottomLeft.x, bottomLeft.y);
        mContext.lineTo(topLeft.x, topLeft.y);
        
        mContext.fillStyle = color;
        mContext.fill();
        mContext.lineWidth = 1;
        mContext.strokeStyle = "black";
        mContext.stroke();
    }
    
    this.DrawRotatedRect = function(pos, width, height, angle, color)
    {
        var topLeft = RotateAround(new Point(pos.x - width / 2, pos.y + height / 2), angle, pos);
        var topRight = RotateAround(new Point(pos.x + width / 2, pos.y + height / 2), angle, pos);
        var bottomLeft = RotateAround(new Point(pos.x - width / 2, pos.y - height / 2), angle, pos);
        var bottomRight = RotateAround(new Point(pos.x + width / 2, pos.y - height / 2), angle, pos);
        
        // To canvas coordinates
        topLeft = ToCanvasPos.call(this, topLeft);
        topRight = ToCanvasPos.call(this, topRight);
        bottomLeft = ToCanvasPos.call(this, bottomLeft);
        bottomRight = ToCanvasPos.call(this, bottomRight);
        
        mContext.beginPath();
        mContext.moveTo(topLeft.x, topLeft.y);
        mContext.lineTo(topRight.x, topRight.y);
        mContext.lineTo(bottomRight.x, bottomRight.y);
        mContext.lineTo(bottomLeft.x, bottomLeft.y);
        mContext.lineTo(topLeft.x, topLeft.y);
        
        mContext.fillStyle = color;
        mContext.fill();
        mContext.lineWidth = 1;
        mContext.strokeStyle = "black";
        mContext.stroke();
    }
    
    this.DrawLine = function(pos1, pos2)
    {
        pos1 = ToCanvasPos.call(this, pos1);
        pos2 = ToCanvasPos.call(this, pos2);
        
        mContext.beginPath();
        mContext.moveTo(pos1.x, pos1.y);
        mContext.lineTo(pos2.x, pos2.y);
        mContext.lineWidth = 1;
        mContext.strokeStyle = "black";
        mContext.stroke();
    }
    
    this.DrawText = function(pos, text)
    {
        var canvasPos = ToCanvasPos.call(this, pos);
        mContext.font = "30px Arial";
        mContext.fillText(text, canvasPos.x, canvasPos.y);
    }
    
    this.SetItem = function(id, item)
    {
        if (item == null)
            delete mItems[id];
        else
            mItems[id] = item;
    }
    
    this.GetItem = function(id)
    {
        return mItems[id];
    }
    
    this.Update = function()
    {
        this.time = (new Date() - CanvasWrapperShared.loadTime) / 1000;
        
        for (var key in mItems)
        {
            if (mItems[key].Update)
                mItems[key].Update(this);
        }
    }
    
    this.Draw = function()
    {
        for (var key in mItems)
        {
            if (mItems[key].Draw)
                mItems[key].Draw(this);
        }
    }
}

function Rotate(p, angle)
{
    return new Point(
        Math.cos(angle) * p.x - Math.sin(angle) * p.y,
        Math.sin(angle) * p.x + Math.cos(angle) * p.y);
}

function RotateAround(p, angle, refP)
{
    return Rotate(p.Minus(refP), angle).Plus(refP);
}
