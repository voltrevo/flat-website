var puzzle

var shiftPressed = false // TODO: do this better
var debug

;(function()
{
    'use strict';

    function sudokuInterface()
    {
        var self = this;

        self.boxes = []
        for (var i = 0; i !== 9; i++)
        {
            self.boxes[i] = []
        }

        self.render = function(container)
        {
            var mainTable = $('<table class="sudokuTable"></table>')

            for (var i = 0; i !== 3; i++)
            {
                var row = $('<tr></tr>')
                for (var j = 0; j !== 3; j++)
                {
                    var cell = $('<td></td>')
                    var midtable = $('<table></table>')
                    cell.append(midtable)
                    for (var ii = 0; ii !== 3; ii++)
                    {
                        var innerRow = $('<tr></tr>')

                        for (var jj = 0; jj !== 3; jj++)
                        {
                            var box = {}
                            self.boxes[3 * i + ii][3 * j + jj] = box
                            box.cell = $('<td></td>')
                            box.numbers = []
                            box.count = 9

                            for (var k = 0; k !== 9; k++)
                            {
                                ;(function()
                                {
                                    var icon = $('<div class="numIcon">' + (k + 1) + '</div>')
                                    var n = {
                                        i: 3 * i + ii,
                                	    j: 3 * j + jj,
                                	    num: k,
                                        icon: icon,
                                        box: box,
                                        active: true,
                                        activate: function()
                                        {
                                        	if (!n.active)
                                        	{
	                                            n.active = true
	                                            n.icon.css('visibility', 'visible')
	                                            n.box.count++
	                                        }
                                        },
                                        deactivate: function()
                                        {
                                        	if (n.active)
                                        	{
	                                            n.active = false
	                                            n.icon.css('visibility', 'hidden')
	                                            n.box.count--
                                        	}
                                        }
                                    }

                                    icon.click(function()
                                    {
                                    	if (shiftPressed)
                                    		self.deactivateOtherIcons(n)
                                    	else
                                    		self.deactivateIcon(n)
                                    })

                                    box.numbers.push(n)
                                    box.cell.append(icon)
                                })()
                            }

                            box.getLastNumber = function(box) { return function()
                            {
                            	if (box.count !== 1)
                            		return null

                            	for (var i = 0; i !== 9; i++)
                            	{
                            		if (box.numbers[i].active)
                            			return box.numbers[i]
                            	}

                            	throw new Error("bad box.count")
                            } }(box)

                            innerRow.append(box.cell)
                        }

                        midtable.append(innerRow)
                    }

                    row.append(cell)
                }

                mainTable.append(row)
            }

            $(container).append(mainTable)
        }

        self.deactivateIcon = function(n)
        {
        	if (!n.active)
        		return

        	n.deactivate()

        	var lastNum = n.box.getLastNumber()
        	if (lastNum)
        	{
        		self.autoRemoveNeighbours(lastNum)
        		n.box.cell.css('background-color', '#048')
        		lastNum.icon.addClass('numIconRevealed')
        	}
        }

        self.deactivateOtherIcons = function(n)
        {
        	for (var key in n.box.numbers)
        	{
        		var otherNum = n.box.numbers[key]

        		if (otherNum !== n)
        			self.deactivateIcon(n.box.numbers[key])
        	}
        }

        self.autoRemoveNeighbours = function(n)
        {
        	var process = function(box)
        	{
        		if (box !== n.box)
        			self.deactivateIcon(box.numbers[n.num])
        	}

        	for (var k = 0; k !== 9; k++)
        	{
        		process(self.boxes[n.i][k])
        		process(self.boxes[k][n.j])
        		process(self.boxes[3 * Math.floor(n.i / 3) + Math.floor(k / 3)][3 * Math.floor(n.j / 3) + k % 3])
        	}
        }
    }

    $(document).ready(function()
    {
        puzzle = new sudokuInterface()
        puzzle.render($('#sudokuContainer'))

        document.onkeydown = function(e)
        {
        	if (e.keyCode === 16)
        		shiftPressed = true
        }

        document.onkeyup = function(e)
        {
        	if (e.keyCode === 16)
        		shiftPressed = false
        }
    })
})()