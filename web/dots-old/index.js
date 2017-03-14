"use strict";

var $

$(document).ready(function()
{
    var spacing = 35
    var decayDist = 150
    var newPosMul = 0.15

    var orbitRadius = 150
    var orbitSeconds = 5

    var dy = 0.5 * Math.sqrt(3) * spacing
    var dx = spacing

    var dots = []

    var pageX = $(window).width()
    var pageY = $(window).height()

    var nudgeX = false;

    for (var y = -0.5 * dy; y < pageY + dy; y += dy)
    {
        for (var x = -0.75 * dx + (nudgeX ? 0.5 * dx : 0); x < pageX + dx; x += dx)
        {
            var elem = $("<div></div>")
                .addClass("dot")
                .offset({top: y, left: x})

            $(document.body).append(elem)

            dots.push({
                elem: elem[0],
                initialPos: {
                    x: x,
                    y: y
                },
                currPos: {
                    x: x,
                    y: y
                }
            })
        }

        nudgeX = !nudgeX
    }

    var mousePos = {x: 0.5 * pageX, y: 0.5 * pageY}

    $(document).mousemove(function(e)
    {
        mousePos.x = e.pageX
        mousePos.y = e.pageY
    })

    var influencers = [{decayMult: 1, pos: mousePos}]
    var orbiters = []

    $(document).click(function()
    {
        var orbiter = {
            moveCount: 0,
            center: {
                x: mousePos.x,
                y: mousePos.y
            },
            influencer: {
                decayMult: 0.3,
                pos: {
                    x: mousePos.x + orbitRadius,
                    y: mousePos.y
                }
            }
        }

        orbiters.push(orbiter)
        influencers.push(orbiter.influencer)
    })

    function moveDots()
    {
        for (var i = 0; i !== dots.length; i++)
        {
            var dot = dots[i]

            var relNewPos = {x: 0, y: 0}

            for (var j = 0; j !== influencers.length; j++)
            {
                var influencer = influencers[j]

                var dx = dot.initialPos.x - influencer.pos.x
                var dy = dot.initialPos.y - influencer.pos.y
                var distSq = dx * dx + dy * dy

                var currDecayDist = influencer.decayMult * decayDist

                var decay = Math.exp(-distSq / (currDecayDist * currDecayDist))

                relNewPos.x += decay * dx
                relNewPos.y += decay * dy
            }

            var newPos = {
                x: dot.initialPos.x + relNewPos.x,
                y: dot.initialPos.y + relNewPos.y
            }

            dot.currPos.x = (1 - newPosMul) * dot.currPos.x + newPosMul * newPos.x
            dot.currPos.y = (1 - newPosMul) * dot.currPos.y + newPosMul * newPos.y

            dot.elem.style.left = dot.currPos.x + "px"
            dot.elem.style.top  = dot.currPos.y + "px"
        }
    }

    function moveOrbiters()
    {
        for (var i = 0; i !== orbiters.length; i++)
        {
            var orbiter = orbiters[i]

            var angle = 2 * Math.PI * orbiter.moveCount / (30 * orbitSeconds)
            orbiter.influencer.pos.x = orbiter.center.x + orbitRadius * Math.cos(angle)
            orbiter.influencer.pos.y = orbiter.center.y - orbitRadius * Math.sin(angle)
            orbiter.moveCount++
        }
    }

    var frameCount = 0

    window.requestAnimationFrame(function draw()
    {
        window.requestAnimationFrame(draw)

        moveOrbiters()
        moveDots()

        frameCount++
    })
})
