(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict"

module.exports = {
    host: window.location.hostname,
    port: 21354,
    quoter: {
        maxOffsetTicks: 3,
        refreshInterval: 3000
    }
}

},{}],2:[function(require,module,exports){
"use strict"

var dbl = exports

dbl.setDecimalPlaces = function(decimalPlaces) {
    dbl.tolerance = 0.5 * Math.pow(0.1, decimalPlaces)
    dbl.decimalPlaces = decimalPlaces
}

dbl.setDecimalPlaces(9)

dbl.equal = function(x, y) {
    return (Math.abs(x - y) < dbl.tolerance)
}

dbl.notEqual = function(x, y) {
    return (Math.abs(x - y) >= dbl.tolerance)
}

dbl.less = function(x, y) {
    return (x - y < -dbl.tolerance)
}

dbl.greater = function(x, y) {
    return (x - y > dbl.tolerance)
}

dbl.lessOrEqual = function(x, y) {
    return (x - y < dbl.tolerance)
}

dbl.greaterOrEqual = function(x, y) {
    return (x - y > -dbl.tolerance)
}

dbl.floor = function(x) {
    return Math.floor(x + dbl.tolerance)
}

dbl.ceil = function(x) {
    return Math.ceil(x - dbl.tolerance)
}

dbl.toString = function(x) {
    if (x !== x) {
        return "NaN"
    }
    
    var str = x.toFixed(dbl.decimalPlaces)
    
    var i = 0

    for (; i < str.length; i++) {
        if (str[i] === ".") {
            break
        }
    }

    var end = i
    i++

    for (; i < str.length; i++) {
        if (str[i] !== "0") {
            end = i + 1
        }
    }

    str = str.substr(0, end)

    if (str === "-0") {
        str = "0"
    }

    return str
}

dbl.map = function() {
    var self = this
    
    this.data = []
    
    this.get = function(key) {
        return self.data[dbl.toString(key)]
    }
    
    this.set = function(key, value) {
        return (self.data[dbl.toString(key)] = value)
    }
}

dbl.decimalsUsed = function(x) {
    var dp = 0
    
    while (Math.abs(Math.round(x) - x) > dbl.tolerance) {
        x *= 10
        dp++
    }
    
    return dp
}

},{}],3:[function(require,module,exports){
"use strict"

var timestamp = require("./timestamp") // TODO: just do this inline

var levels = ["spam", "debug", "info", "warn", "error", "fatal"]

var spamLevel = 0
var debugLevel = 1
var infoLevel = 2
var warnLevel = 3
var errorLevel = 4
var fatalLevel = 5

module.exports = function logger(levelStr) {
    this.level = levels.indexOf(levelStr)
    
    if (this.level === -1) {
        this.level = infoLevel
    }
    
    this.log = function(levelStr, msg) {
        console.log(timestamp() + " [" + levelStr + "] " + msg)
    }
    
    this.spam = function(msg) {
        if (spamLevel >= this.level) {
            this.log("spam", msg)
        }
    }
    
    this.debug = function(msg) {
        if (debugLevel >= this.level) {
            this.log("debug", msg)
        }
    }
    
    this.info = function(msg) {
        if (infoLevel >= this.level) {
            this.log("info", msg)
        }
    }
    
    this.warn = function(msg) {
        if (warnLevel >= this.level) {
            this.log("warn", msg)
        }
    }
    
    this.error = function(msg) {
        if (errorLevel >= this.level) {
            this.log("error", msg)
        }
    }
    
    this.fatal = function(msg) {
        if (fatalLevel >= this.level) {
            this.log("fatal", msg)
        }
    }
    
    this.info("Logging initialised")
}

},{"./timestamp":8}],4:[function(require,module,exports){
"use strict"

// TODO: Non-chrome testing

var alertify = require("alertifyjs")
window.alertify = alertify
var sockception = require("sockception")

var config = require("./config")
var dbl = require("./dbl")
var hexSha256 = require("./sha2")
var logger = require("./logger")
var observable = require("./observable")
var quoter = require("./quoter")
var utils = require("../utils") // TODO: misnaming: this comes from util.js

// TODO: put this in impl?
var insertAfter = function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}

// TODO: fix global area pollution
var app = {}
app.log = new logger("debug")
var log = app.log
exports.log = log

var randHex = utils.randHex
var clamp = utils.clamp

var username
var chat = null

var tradeElements = []

var ldr

// TODO: fix magic numbers
var theo = new (function() {
    var self = this

    this.observableValue = new observable(0)

    this.set = this.observableValue.set
    this.get = this.observableValue.get
    this.listen = this.observableValue.listen

    this.change = function(dt) {
        if (ldr.bottomPrice !== null && ldr.topPrice !== null) {
            var newValue = clamp(ldr.bottomPrice, self.get() + dt, ldr.topPrice)
            self.set(newValue)
        }
    }
})

exports.theo = theo

var keyHandlers = []

var isMarketOpen = new observable(false)
exports.isMarketOpen = isMarketOpen

var sock = null

var position = 0
var cash = 0
var instrumentCash = 0

var orders = {}

var lotSizes = [1, 2, 5, 10, 20, 50, 100, 200]
exports.lotSizes = lotSizes
var lotIndex = 0

function bindHotkeys() { // TODO: use jwerty or similar
    // d
    keyHandlers[68] = function() { massDelete() }

    // Left
    keyHandlers[37] = function() { if (isMarketOpen.get()) qr.changeOffset(-ldr.tickSize) }

    // Up
    keyHandlers[38] = function() { if (isMarketOpen.get()) theo.change(ldr.tickSize) }

    // Right
    keyHandlers[39] = function() { if (isMarketOpen.get()) qr.changeOffset(ldr.tickSize) }

    // Down
    keyHandlers[40] = function() { if (isMarketOpen.get()) theo.change(-ldr.tickSize) }

    // q
    keyHandlers[81] = function() { if (isMarketOpen.get()) qr.toggle() }

    // r
    keyHandlers[82] = function() { if (isMarketOpen.get()) qr.refresh() }

    // a
    keyHandlers[65] = function() { qr.changeSize(1) }

    // z
    keyHandlers[90] = function() { qr.changeSize(-1) }

    // s
    keyHandlers[83] = function() { increaseLotSize() }

    // x
    keyHandlers[88] = function() { decreaseLotSize() }

    // h
    keyHandlers[72] = function() { showHotkeys() }
}

function unbindHotkeys() {
    keyHandlers = []
}

function formatCash(x) {
    if (dbl.equal(x, 0)) {
        x = 0 // Avoids -0.00
    }

    return "$" + x.toFixed(2)
}

function getSelectorValue(id) {
    var selector = document.getElementById(id)
    return selector.options[selector.selectedIndex].value
}

function removeElement(node) {
    node.parentNode.removeChild(node)
}

function removeChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild)
    }
}

function addMessage(msg) {
    var msgDiv = document.createElement("div")
    msgDiv.appendChild(document.createTextNode(msg))
    msgDiv.style.margin = "10px"
    msgDiv.style.wordWrap = "break-word"

    var cc = document.getElementById("chatDisplay")
    cc.appendChild(msgDiv)
    cc.scrollTop = cc.scrollHeight
}

function addErrorMessage(msg) {
    var msgDiv = document.createElement("div")
    msgDiv.appendChild(document.createTextNode(msg))
    msgDiv.style.margin = "10px"
    msgDiv.style.wordWrap = "break-word"
    msgDiv.style.color = "red"

    var cc = document.getElementById("chatDisplay")
    cc.appendChild(msgDiv)
    cc.scrollTop = cc.scrollHeight
}

// TODO: this is horrible
function showHotkeys() {
    alertify.alert(
        "d: delete all orders<br>" +
        "s: increment click lot size<br>" +
        "x: decrement lot size<br>" +
        "up arrow: increment theo<br>" +
        "down arrow: decrement theo<br>" +
        "q: toggle quoter<br>" +
        "left arrow: tighten quoter<br>" +
        "right arrow: widen quoter<br>" +
        "a: increment quoter size<br>" +
        "z: decrement quoter size<br>" +
        "r: refill quotes<br>" +
        "h: show hotkeys")
}

document.onkeydown = function(e) {
    if (keyHandlers[e.keyCode]) {
        e.preventDefault()
        keyHandlers[e.keyCode]()
    }
}

var sendOrderInsert = function(side, price, volume, tradeCb) {
    price = ldr.normalizePrice(price)

    var order = {
        instrumentName: "testInstrument",
        price: price,
        volume: volume,
        side: side,
        expiry: null
    }

    order.sock = sock.route("orderInsert").send(order)

    order.sock.route("tag").receiveOne(function(tag) { // TODO: still interested in removing the tag concept... but not sure anymore
        order.tag = tag.value
        orders[tag.value] = order

        order.orderStatus = "active"
        order.webElements.statusCell.innerHTML = "active"
    })

    order.sock.route("trade").receiveMany(function(tradeSock, stop) {
        var trade = tradeSock.value

        position += (order.side === "buy" ? 1 : -1) * trade.volume
        cash += (order.side === "buy" ? -1 : 1) * trade.price * trade.volume

        document.getElementById("posDisplay").innerHTML = position
        document.getElementById("posDisplay").style.backgroundColor = (order.side === "buy" ? "#88FF88" : "FF8888")

        // TODO: Need to clear timeout if a new pos change comes in
        setTimeout(
            function()
            {
                document.getElementById("posDisplay").style.backgroundColor = ""
            },
            500)

        document.getElementById("cashDisplay").innerHTML = formatCash(cash + instrumentCash)
        updateValuation() // Takes care of valuation change. TODO: Do this better.

        createTrade(
            order.side,
            trade.price,
            trade.volume)

        order.volume -= trade.volume
        order.webElements.volumeCell.innerHTML = order.volume

        if (order.volume === 0) {
            order.orderStatus = "fully traded"
            order.webElements.statusCell.innerHTML = order.orderStatus

            stop()

            setTimeout(
                function()
                {
                    removeElement(order.webElements.row)
                    delete orders[order.tag]
                },
                500)
        }

        // TODO: do this better
        if (tradeCb) {
            tradeCb()
        }
    })

    order.sock.route("deleted").receiveOne(function() {
        handleOrderDeleted(order)
    })

    order.sock.route("error").receiveMany(function(error) {
        order.orderStatus = "rejected"
        order.webElements.statusCell.innerHTML = "rejected"

        alertify.error(error.value)

        setTimeout(
            function()
            {
                removeElement(order.webElements.row) // TODO: is this ok to call multiple times?
                delete orders[order.tag]
            },
            500)
    })

    order.tag = null

    createOrder(order)

    return order
}
exports.sendOrderInsert = sendOrderInsert

function createOrder(order) {
    order.orderStatus = "pending"
    order.isFinished = function() {
        return (order.orderStatus !== "active" && order.orderStatus !== "pending")
    }

    order.webElements = {}
    order.webElements.row = document.createElement("tr")
    order.webElements.sideCell = document.createElement("td")
    order.webElements.priceCell = document.createElement("td")
    order.webElements.volumeCell = document.createElement("td")
    order.webElements.statusCell = document.createElement("td")
    order.webElements.removeCell = document.createElement("td")

    order.webElements.row.appendChild(order.webElements.sideCell)
    order.webElements.row.appendChild(order.webElements.priceCell)
    order.webElements.row.appendChild(order.webElements.volumeCell)
    order.webElements.row.appendChild(order.webElements.statusCell)
    order.webElements.row.appendChild(order.webElements.removeCell)

    order.webElements.sideCell.innerHTML = order.side
    order.webElements.priceCell.innerHTML = dbl.toString(order.price)
    order.webElements.volumeCell.innerHTML = order.volume
    order.webElements.statusCell.innerHTML = order.orderStatus
    order.webElements.removeCell.innerHTML = "x"

    order.webElements.removeCell.onclick = function() {
        sendDelete(order, false)
    }

    for (var key in order.webElements) {
        if (key !== "row") {
            order.webElements[key].align = "center"
            order.webElements[key].style.padding = 2
        }
    }

    insertAfter(document.getElementById("orderHeadings"), order.webElements.row)
}

function createTrade(side, price, volume) {
    price = Math.round(100 * price) / 100

    var elements = {}
    elements.row = document.createElement("tr")
    elements.sideCell = document.createElement("td")
    elements.priceCell = document.createElement("td")
    elements.volumeCell = document.createElement("td")

    elements.row.appendChild(elements.sideCell)
    elements.row.appendChild(elements.priceCell)
    elements.row.appendChild(elements.volumeCell)

    elements.sideCell.innerHTML = side
    elements.priceCell.innerHTML = dbl.toString(price)
    elements.volumeCell.innerHTML = volume

    for (var key in elements) {
        if (key !== "row") {
            elements[key].align = "center"
            elements[key].style.padding = 2
        }
    }

    insertAfter(document.getElementById("tradeHeadings"), elements.row)

    tradeElements.push(elements)
}

function clearTrades() {
    for (var i in tradeElements) {
        removeElement(tradeElements[i].row)
    }

    tradeElements = []
}

var sendDelete = function(order, fromQuoter) {
    // TODO: make better
    if (!fromQuoter) {
        if (order === qr.bidOrder || order === qr.offerOrder) {
            return
        }
    }

    if (order && order.orderStatus !== "deleting" && order.orderStatus !== "deleted") {
        //console.log("actually sendDelete(\"" + tag + "\"), status: " + orders[tag].orderStatus)

        order.orderStatus = "deleting"
        order.webElements.statusCell.innerHTML = "deleting"

        // TODO: argh why sock and not order.sock?
        var del = order.sock.route("delete").send()

        del.route("success").receiveOne(function() {
            handleOrderDeleted(order)
        })

        del.route("failure").receiveOne(function() {
            log.info("Tried to delete order not found at exchange (maybe traded)")
        })
    }
}
exports.sendDelete = sendDelete

function handleOrderDeleted(order) {
    if (order.orderStatus === "deleted") {
        return
    }

    order.orderStatus = "deleted"
    order.webElements.statusCell.innerHTML = "deleted"

    setTimeout(
        function()
        {
            removeElement(order.webElements.row)
            delete orders[order.tag]
        },
        500)
}

function ladder(tableNode) {
    var self = this

    this.tableNode = tableNode

    this.decimalPlaces = null

    this.bottomPrice = null
    this.tickSize = null
    this.topPrice = null

    this.bidCells = null
    this.priceCells = null
    this.offerCells = null

    this.description = "<font color=\"grey\">[Closed]</font>"
    this.descriptionCell = null

    this.setDescription = function(description) {
        self.description = description
        self.descriptionCell.innerHTML = description
    }

    this.build = function(bottomPrice, tickSize, topPrice) {
        log.debug("Building ladder")

        self.cleanup()
        self.buildHeader()

        self.decimalPlaces = dbl.decimalsUsed(tickSize)

        self.bottomPrice = bottomPrice
        self.tickSize = tickSize
        self.topPrice = topPrice

        self.bidCells = new dbl.map()
        self.priceCells = new dbl.map()
        self.offerCells = new dbl.map()

        for (var price = self.topPrice; price >= self.bottomPrice - 0.5 * tickSize; price -= tickSize) {
            self.buildLevel(price, tickSize)
        }

        self.priceCells.get(theo.get()).style.backgroundColor = "#88bbff"

        theo.listen(function(theo, oldTheo) {
            // TODO: assumes theo is on a tick (need nearest tick)
            self.priceCells.get(oldTheo).style.backgroundColor = "#ffffff"
            self.priceCells.get(theo).style.backgroundColor = "#88bbff"
        })
    }

    this.buildHeader = function() {
        self.tableNode.innerHTML = [
            "<tr>",
            "    <th width=210 colspan=3 align=\"center\" id=\"descriptionDisplay\"></th>",
            "</tr>",
            "<tr>",
            "    <td width=70 align=\"center\">Bid</td>",
            "    <td width=70 align=\"center\">Price</td>",
            "    <td width=70 align=\"center\">Offer</td>",
            "</tr>"
        ].join("\n")

        self.descriptionCell = document.getElementById("descriptionDisplay")
        self.descriptionCell.innerHTML = self.description
    }

    this.buildLevel = function(price, tickSize) {
        if (dbl.equal(price, 0)) {
            price = 0 // Avoids printing prices like "-0.00"
        }

        var row = document.createElement("tr")
        var bidCell = document.createElement("td")
        var priceCell = document.createElement("td")
        var offerCell = document.createElement("td")

        bidCell.align = "center"
        priceCell.align = "center"
        offerCell.align = "center"

        priceCell.innerHTML = price.toFixed(self.decimalPlaces)

        row.appendChild(bidCell)
        row.appendChild(priceCell)
        row.appendChild(offerCell)

        self.tableNode.appendChild(row)

        self.bidCells.set(price, bidCell)
        self.priceCells.set(price, priceCell)
        self.offerCells.set(price, offerCell)

        bidCell.onclick = function() {
            sendOrderInsert("buy", price, lotSizes[lotIndex])
        }

        offerCell.onclick = function() {
            sendOrderInsert("sell", price, lotSizes[lotIndex])
        }
    }

    this.normalizePrice = function(price) {
        var priceStr = price.toFixed(self.decimalPlaces)
        return parseFloat(priceStr)
    }

    this.cleanup = function() {
        self.bidCells = null
        self.priceCells = null
        self.offerCells = null
        removeChildren(self.tableNode)
        self.buildHeader()
    }

    this.buildHeader()
}

ldr = null
var qr = null

window.onload = function() {
    ldr = new ladder(document.getElementById("ladderTable"))
    exports.ldr = ldr

    qr = new quoter()

    document.getElementById("startupTable").onkeydown = function(e) {
        if (e.keyCode === 13) {
            switch (getSelectorValue("startupSelector")) {
                case "login":
                    login()
                    break

                case "register":
                    register()
                    break

                case "changePassword":
                    changePassword()
                    break
            }
        }
    }

    document.getElementById("usernameInput").focus()

    qr.updateDisplay()

    var chatInput = document.getElementById("chatInput")
    chatInput.onkeydown = function(e) {
        if (e.keyCode === 13) {
            if (chat === null) {
                addErrorMessage("Chat not connected")
            } else {
                chat.send(chatInput.value)
            }

            chatInput.value = ""

            return false
        }

        return true
    }
}

function increaseLotSize() {
    lotIndex++
    if (lotIndex >= lotSizes.length) {
        lotIndex = lotSizes.length - 1
    }

    document.getElementById("lotSizeDisplay").innerHTML = lotSizes[lotIndex]
}

function decreaseLotSize() {
    lotIndex--
    if (lotIndex < 0) {
        lotIndex = 0
    }

    document.getElementById("lotSizeDisplay").innerHTML = lotSizes[lotIndex]
}

function updateValuation() {
    document.getElementById("valuationDisplay").innerHTML = formatCash(cash + instrumentCash + theo.get() * position)
}

theo.listen(updateValuation)

function massDelete() {
    //peer.get("massDelete", null, {}) // Currently ignoring ack
    for (var tag in orders) {
        sendDelete(orders[tag], false)
    }
}

function login() {
    username = document.getElementById("usernameInput").value

    var sockConnectedAtStart = !!sock

    if (!sock) {
        sock = sockception.connect("ws://" + config.host + ":" + config.port + "/", log)
    }

    var run = function() {
        sock.route("clueRequest").send(username).receiveOne(function(clue) {
            var startupType = getSelectorValue("startupSelector")

            var passwd = document.getElementById(
                startupType === "login" ?
                "loginPasswordInput" :
                "changePasswordOldPasswordInput").value

            var newPasswd = document.getElementById(
                startupType === "login" ?
                "loginPasswordInput" :
                "changePasswordNewPasswordInput").value

            var hash = hexSha256(clue.value + passwd)
            var nextClue = randHex()

            var loginRequest = sock.route("loginRequest").send({
                uname: username,
                hash: hash,
                nextClue: nextClue,
                nextDoubleHash: hexSha256(hexSha256(nextClue + newPasswd))
            })

            loginRequest.route("success").receiveOne(handleLogin)

            loginRequest.route("failure").receiveOne(function() {
                var failureElement = (
                    getSelectorValue("startupSelector") === "login" ?
                    document.getElementById("loginPasswordInput") :
                    document.getElementById("changePasswordOldPasswordInput"))

                failureElement.value = "login failure"
                failureElement.type = "text"

                setTimeout(
                    function()
                    {
                        failureElement.value = ""
                        failureElement.type = "password"
                    },
                    500)
            })

            loginRequest.route("alreadyLoggedIn").receiveOne(function() {
                var failureElement = document.getElementById("usernameInput")
                failureElement.value = "already logged in"

                setTimeout(
                    function()
                    {
                        failureElement.value = ""
                    },
                    500)
            })
        })
    }

    if (sockConnectedAtStart) {
        run()
    } else {
        sock.receiveOne(run)
    }
}

function handleLogin(newSocket) {
    sock = newSocket // TODO: oh dear, this needs to be done in a better way

    switch(getSelectorValue("startupSelector")) {
        case "login":
            document.getElementById("loginPasswordInput").value = "login success!"
            document.getElementById("loginPasswordInput").type = "text"
            break

        case "register":
            document.getElementById("registerRegistrationKeyInput").value = "login success!"
            break

        case "changePassword":
            document.getElementById("changePasswordOldPasswordInput").value = "login success!"
            document.getElementById("changePasswordOldPasswordInput").type = "text"

            document.getElementById("changePasswordNewPasswordInput").value = "login success!"
            document.getElementById("changePasswordNewPasswordInput").type = "text"

            document.getElementById("changePasswordConfirmNewPasswordInput").value = "login success!"
            document.getElementById("changePasswordConfirmNewPasswordInput").type = "text"
            break
    }

    if (username === "andrew.morris") { // TODO: configure this lol
        var openInstrumentButton = document.createElement("input")
        openInstrumentButton.value = "Open"
        openInstrumentButton.type = "button"

        openInstrumentButton.onclick = function() {
            unbindHotkeys()

            var alertifyPrompt = function(text, defaultValue, cb) {
                alertify.prompt(text, defaultValue, function(evt, value) {
                    setTimeout(function() {
                        cb(evt, value)
                    }, 0)
                })
            }

            // TODO: I need to outlaw this technique
            alertifyPrompt("Enter description", "", function(e, desc) {
            alertifyPrompt("Enter bottom price", "", function(e, bottomPrice) {
            alertifyPrompt("Enter tick size", "", function(e, tickSize) {
            alertifyPrompt("Enter top price", "", function(e, topPrice) {

                bindHotkeys()

                bottomPrice = parseFloat(bottomPrice)
                tickSize = parseFloat(tickSize)
                topPrice = parseFloat(topPrice)

                var openInstrument = sock.route("openInstrument").send({
                    instrumentName: "testInstrument",
                    description: desc,
                    tickTable: {
                        bottomPrice: bottomPrice,
                        tickSize: tickSize,
                        topPrice: topPrice
                    }
                })

                openInstrument.route("error").receiveMany(function(s) {
                    alertify.error(s.value)
                })

                openInstrument.route("success").receiveOne(function() {
                    // TODO: should something go here?
                })

            })})})})
        }

        document.getElementById("adminDisplay").appendChild(openInstrumentButton)

        var closeInstrumentButton = document.createElement("input")
        closeInstrumentButton.value = "Close"
        closeInstrumentButton.type = "button"

        closeInstrumentButton.onclick = function() {
            unbindHotkeys()

            alertify.prompt("Enter settlement price", "", function(e, price) {
                bindHotkeys()

                var closeInstrument = sock.route("closeInstrument").send({
                    instrumentName: "testInstrument",
                    value: parseFloat(price)
                })

                closeInstrument.route("error").receiveMany(function(err) {
                    alertify.error(err.value)
                })

                closeInstrument.route("success").receiveOne(function() {
                    // TODO: do something here?
                })
            })
        }

        document.getElementById("adminDisplay").appendChild(closeInstrumentButton)

        var regoKeyButton = document.createElement("input")
        regoKeyButton.value = "Request Registration Key"
        regoKeyButton.type = "button"

        regoKeyButton.onclick = function() {
            sock.route("clueRequest").send(username).receiveOne(function(clue) {
                unbindHotkeys()

                alertify.prompt("Password", "", function(e, passwd) {
                alertify.prompt("New username", "", function(e, newUser) {
                    bindHotkeys()

                    var nextClue = utils.randHex()

                    var rkr = sock.route("registrationKeyRequest").send({
                        hash: hexSha256(clue + passwd),
                        nextClue: nextClue,
                        nextDoubleHash: hexSha256(hexSha256(nextClue + passwd)),
                        newUser: newUser
                    })

                    rkr.route("registrationKey").receiveOne(function(key) {
                        alertify.alert(key.value)
                    })

                    rkr.route("failure").receiveOne(function() {
                        alertify.error("Wrong password")
                    })
                })})
            })
        }

        document.getElementById("adminDisplay").appendChild(regoKeyButton)

        var forceQuotersButton = document.createElement("input")
        forceQuotersButton.value = "Turn Quoters On"
        forceQuotersButton.type = "button"

        forceQuotersButton.onclick = function() {
            sock.route("forceQuotersOn").send("testInstrument")
        }

        document.getElementById("adminDisplay").appendChild(forceQuotersButton)
        document.getElementById("adminDisplay").appendChild(document.createElement("br"))
    }

    setTimeout(
        function() {
            bindHotkeys()

            // TODO: (Random thought) What does the server do if you insert a 0.5 lot?

            removeElement(document.getElementById("startupTable"))
            document.getElementById("innerLayoutTable").style.visibility = "visible"

            createLoginRequests()
        },
        500)

    var pingInterval = setInterval(
        function() {
            var sendTime = new Date()

            sock.route("ping").send().receiveOne(function() {
                log.info("Ping time: " + (new Date() - sendTime) + "ms")
            })
        },
        10000)

    sock.onclose(function() {
        clearInterval(pingInterval)
    })
}

function createLoginRequests()
{
    sock.route("cash").send().receiveOne(function(cashUpdate) {
        cash = cashUpdate.value
        document.getElementById("cashDisplay").innerHTML = formatCash(cash + instrumentCash)
        updateValuation()
    })

    chat = sock.route("chat").send()

    chat.receiveMany(function(msgInfo) {
        addMessage(msgInfo.value.uname + ": " + msgInfo.value.msg)
    })

    var instrumentSubscription = sock.route("instrumentSubscription").send("testInstrument")

    instrumentSubscription.route("positionUpdate").receiveMany(function(positionUpdate) {
        instrumentCash = positionUpdate.value.cash
        document.getElementById("cashDisplay").innerHTML = formatCash(cash + instrumentCash)

        position = positionUpdate.value.instrument
        document.getElementById("posDisplay").innerHTML = position

        updateValuation()
    })

    instrumentSubscription.route("priceUpdate").receiveMany(function(priceUpdate) {
        var pu = priceUpdate.value

        if (pu.volume > 0) {
            ldr.bidCells.get(pu.price).innerHTML = pu.volume
        } else if (pu.volume < 0) {
            ldr.offerCells.get(pu.price).innerHTML = -pu.volume
        } else {
            ldr.bidCells.get(pu.price).innerHTML = ""
            ldr.offerCells.get(pu.price).innerHTML = ""
        }
    })

    instrumentSubscription.route("status").receiveMany(function(status) {
        var is = status.value

        var isMarketOpenBefore = isMarketOpen.get()
        isMarketOpen.set(is.instrumentStatus === "open")

        if (!isMarketOpenBefore && isMarketOpen.get()) {
            ldr.build(
                is.tickTable.bottomPrice,
                is.tickTable.tickSize,
                is.tickTable.topPrice)

            qr.setup()

            document.getElementById("descriptionDisplay").innerHTML = is.description
        }
    })

    // TODO: I just changed this from receiveOne to receiveMany to fix a bug but I think what I had
    // in mind when I wrote receiveOne was that each session should be a separate socket, which is
    // probably a better design.
    instrumentSubscription.route("open").receiveMany(function(open) {
        var op = open.value

        clearTrades()

        ldr.build(
            op.tickTable.bottomPrice,
            op.tickTable.tickSize,
            op.tickTable.topPrice)

        theo.set(0.5 * (op.tickTable.bottomPrice + op.tickTable.topPrice))
        isMarketOpen.set(true)

        qr.setup()

        document.getElementById("descriptionDisplay").innerHTML = op.description
    })

    instrumentSubscription.route("close").receiveMany(function(close) {
        isMarketOpen.set(false)
        theo.set(0)
        document.getElementById("descriptionDisplay").innerHTML = "<font color=\"grey\">[Closed]</font>"

        cash += instrumentCash
        instrumentCash = 0

        cash += position * close.value // TODO: cash is an observable
        position = 0
        updateValuation()
        document.getElementById("posDisplay").innerHTML = position
        document.getElementById("cashDisplay").innerHTML = formatCash(cash + instrumentCash)

        ldr.cleanup()
    })

    instrumentSubscription.route("error").receiveMany(function(error) {
        alertify.alert(error.value)
    })

    instrumentSubscription.route("forceQuoterOn").receiveMany(function() {
        qr.toggle()
    })
}

function register() {
    var confirmField = document.getElementById("registerConfirmPasswordInput")

    if (
        document.getElementById("registerPasswordInput").value !==
        confirmField.value
    ) {
        confirmField.value = "doesn\"t match"
        confirmField.type = "text"

        setTimeout(
            function() {
                confirmField.value = ""
                confirmField.type = "password"
            },
            500)

        return
    }

    var uname = document.getElementById("usernameInput").value

    sock.route("clueRequest").send(uname).receiveOne(function(clue) {
        var regoKeyField = document.getElementById("registerRegistrationKeyInput")
        var nextClue = randHex()

        var registrationRequest = sock.route("registrationRequest").send({
            doubleHash: hexSha256(regoKeyField.value + clue.value),
            nextClue: nextClue,
            nextDoubleHash: hexSha256(hexSha256(nextClue + document.getElementById("registerPasswordInput").value))
        })

        registrationRequest.route("success").receiveOne(handleLogin)

        registrationRequest.route("failure").receiveOne(function() {
            regoKeyField.value = "failure"

            setTimeout(
                function() {
                    regoKeyField.value = ""
                },
                500) // TODO: config
        })
    })
}

function changePassword() {
    var newPasswordInput = document.getElementById("changePasswordNewPasswordInput")
    var confirmNewPasswordInput = document.getElementById("changePasswordConfirmNewPasswordInput")

    if (newPasswordInput.value !== confirmNewPasswordInput.value) {
        confirmNewPasswordInput.value = "doesn\"t match"
        confirmNewPasswordInput.type = "text"

        setTimeout(
            function() {
                confirmNewPasswordInput.value = ""
                confirmNewPasswordInput.type = "password"
            },
            500)

        return
    }

    login()
}

function updateStartupTable() {
    alertify.alert("updateStartupTable is actually used")
    var rowIds = {
        login: ["loginRow1"],
        register: ["registerRow1", "registerRow2", "registerRow3"],
        changePassword: ["changePasswordRow1", "changePasswordRow2", "changePasswordRow3"]
    }

    for (var displayType in rowIds) {
        var displayValue = (displayType === getSelectorValue("startupSelector") ? "" : "none")

        for (var i in rowIds[displayType]) {
            document.getElementById(rowIds[displayType][i]).style.display = displayValue
        }
    }
}
},{"../utils":9,"./config":1,"./dbl":2,"./logger":3,"./observable":5,"./quoter":6,"./sha2":7,"alertifyjs":10,"sockception":13}],5:[function(require,module,exports){
"use strict"

module.exports = function observable(value) {
    var self = this
    
    this.value = value
    this.listeners = []

    this.get = function() { return self.value }
    
    this.set = function(newValue) {
        var oldValue = self.value
        self.value = newValue

        for (var i in self.listeners) {
            self.listeners[i](self.value, oldValue)
        }
    }

    this.listen = function(listener) { self.listeners.push(listener) }
}

},{}],6:[function(require,module,exports){
"use strict"

// TODO: logging
// TODO: quotes not amending when theo changes

var clamp = require("../utils").clamp
var config = require("./config")
var dbl = require("./dbl")
var main = require("./main")
var observable = require("./observable")

module.exports = function quoter()
{
    var self = this

    var log = main.log
    var lotSizes = main.lotSizes
    var sendDelete = main.sendDelete
    var sendOrderInsert = main.sendOrderInsert
    var theo = main.theo
    var ldr = main.ldr
    var isMarketOpen = main.isMarketOpen

    this.offset = new observable(1)
    this.on = false
    this.sizeIndex = 0

    this.bidOrder = null
    this.offerOrder = null

    this.bidPrice = null
    this.offerPrice = null

    this.toggle = function() {
        if (self.on && isMarketOpen.get()) {
            return
        }

        self.on = !self.on && isMarketOpen.get()
        document.getElementById("quoterOnDisplay").innerHTML = self.on
        self.refresh()
    }

    this.setup = function() {
        self.offset.set(config.quoter.maxOffsetTicks * ldr.tickSize)

        self.bidPrice = self.calculateBidPrice()
        self.offerPrice = self.calculateOfferPrice()

        self.refreshBid()
        self.refreshOffer()

        ldr.bidCells.get(self.bidPrice).style.backgroundColor = "#ccddff"
        ldr.offerCells.get(self.offerPrice).style.backgroundColor = "#ccddff"
    }

    this.refresh = function() {
        ldr.bidCells.get(self.bidPrice).style.backgroundColor = ""
        ldr.offerCells.get(self.offerPrice).style.backgroundColor = ""

        self.refreshBid()
        self.refreshOffer()

        ldr.bidCells.get(self.bidPrice).style.backgroundColor = "#ccddff"
        ldr.offerCells.get(self.offerPrice).style.backgroundColor = "#ccddff"
    }

    theo.listen(function() {
        if (self.bidPrice === null || self.offerPrice === null) {
            return
        }

        ldr.bidCells.get(self.bidPrice).style.backgroundColor = ""
        ldr.offerCells.get(self.offerPrice).style.backgroundColor = ""

        if (self.bidOrder && !self.bidOrder.isFinished()) {
            self.refreshBid()
        } else {
            self.bidPrice = self.calculateBidPrice(); // TODO: this is dodgy, it"s for highlighting
        }

        if (self.offerOrder && !self.offerOrder.isFinished()) {
            self.refreshOffer()
        } else {
            self.offerPrice = self.calculateOfferPrice() // TODO: this is dodgy, it"s for highlighting
        }

        ldr.bidCells.get(self.bidPrice).style.backgroundColor = "#ccddff"
        ldr.offerCells.get(self.offerPrice).style.backgroundColor = "#ccddff"
    })

    isMarketOpen.listen(function(isOpen) {
        if (!isOpen && self.on) {
            self.toggle()
        }
    })

    this.changeOffset = function(offsetDiff) {
        if (!isMarketOpen.get()) {
            log.error("Can\"t change offset while market is closed")
            return
        }

        ldr.bidCells.get(self.bidPrice).style.backgroundColor = ""
        ldr.offerCells.get(self.offerPrice).style.backgroundColor = ""

        var offset = self.offset.get() + offsetDiff
        offset = clamp(ldr.tickSize, offset, config.quoter.maxOffsetTicks * ldr.tickSize)
        self.offset.set(offset)

        self.bidPrice = self.calculateBidPrice()
        self.offerPrice = self.calculateOfferPrice()

        ldr.bidCells.get(self.bidPrice).style.backgroundColor = "#ccddff"
        ldr.offerCells.get(self.offerPrice).style.backgroundColor = "#ccddff"

        document.getElementById("quoterOffsetDisplay").innerHTML = dbl.toString(self.offset.get())

        self.refresh()
    }

    this.calculateBidPrice = function() {
        var bidPrice = clamp(ldr.bottomPrice, theo.get() - self.offset.get(), ldr.topPrice)
        var level = dbl.floor((bidPrice - ldr.bottomPrice) / ldr.tickSize)
        bidPrice = ldr.bottomPrice + level * ldr.tickSize

        if (bidPrice !== bidPrice) {
            bidPrice = null
        }

        return bidPrice
    }

    this.calculateOfferPrice = function() {
        var offerPrice = clamp(ldr.bottomPrice, theo.get() + self.offset.get(), ldr.topPrice)
        var level = dbl.ceil((offerPrice - ldr.bottomPrice) / ldr.tickSize)
        offerPrice = ldr.bottomPrice + level * ldr.tickSize

        if (offerPrice !== offerPrice) {
            offerPrice = null
        }

        return offerPrice
    }

    this.refreshBid = function() {
        var order

        self.bidPrice = self.calculateBidPrice()

        if (self.on) {
            if (!self.bidOrder || self.bidOrder.isFinished()) {
                order = sendOrderInsert(
                    "buy",
                    self.bidPrice,
                    lotSizes[self.sizeIndex],
                    function() {
                        log.info("quoter bid trade")
                        setTimeout(self.refreshBid, config.quoter.refreshInterval)
                    })

                self.bidOrder = order

                /* TODO
                self.bidOrder.sub.addHandler("trade", function() {
                    log.info("quoter bid trade")
                    setTimeout(self.refreshBid, config.quoter.refreshInterval)
                })
                */
            } else {
                // Need float comparison functions
                if (!dbl.equal(self.bidOrder.price, self.bidPrice) || self.bidOrder.volume !== lotSizes[self.sizeIndex]) {
                    sendDelete(self.bidOrder, true)

                    order = sendOrderInsert(
                        "buy",
                        self.bidPrice,
                        lotSizes[self.sizeIndex],
                        function() {
                            log.info("quoter bid trade")
                            setTimeout(self.refreshBid, config.quoter.refreshInterval)
                        })

                    self.bidOrder = order
                }
            }
        } else {
            if (self.bidOrder && !self.bidOrder.isFinished()) {
                // TODO: Really need to keep track of the orders that are actually still in the market
                sendDelete(self.bidOrder, true)
            }
        }
    }

    this.refreshOffer = function() {
        var order

        self.offerPrice = self.calculateOfferPrice()

        if (self.on) {
            if (!self.offerOrder || self.offerOrder.isFinished()) {
                //self.offerOrder = sendOrderInsert("sell", self.offerPrice, lotSizes[self.sizeIndex])
                order = sendOrderInsert(
                    "sell",
                    self.offerPrice,
                    lotSizes[self.sizeIndex],
                    function() {
                        log.info("quoter offer trade")
                        setTimeout(self.refreshOffer, config.quoter.refreshInterval)
                    })

                self.offerOrder = order
            } else {
                if (!dbl.equal(self.offerOrder.price, self.offerPrice) || self.offerOrder.volume !== lotSizes[self.sizeIndex]) {
                    sendDelete(self.offerOrder, true)
                    //self.offerOrder = sendOrderInsert("sell", self.offerPrice, lotSizes[self.sizeIndex])
                    order = sendOrderInsert(
                        "sell",
                        self.offerPrice,
                        lotSizes[self.sizeIndex],
                        function() {
                            log.info("quoter offer trade")
                            setTimeout(self.refreshOffer, config.quoter.refreshInterval)
                        })

                    self.offerOrder = order
                }
            }
        } else {
            if (self.offerOrder && !self.offerOrder.isFinished()) {
                // TODO: Really need to keep track of the orders that are actually still in the market
                sendDelete(self.offerOrder, true)
            }
        }
    }

    this.changeSize = function(ds) {
        self.sizeIndex = clamp(0, self.sizeIndex + ds, lotSizes.length - 1)
        document.getElementById("quoterSizeDisplay").innerHTML = lotSizes[self.sizeIndex]
        self.refresh()
    }

    this.updateDisplay = function() {
        document.getElementById("quoterOnDisplay").innerHTML = self.on
        document.getElementById("quoterOffsetDisplay").innerHTML = dbl.toString(self.offset.get())
        document.getElementById("quoterSizeDisplay").innerHTML = lotSizes[self.sizeIndex]
    }

    this.bidPrice = this.calculateBidPrice()
    this.offerPrice = this.calculateOfferPrice()
}

},{"../utils":9,"./config":1,"./dbl":2,"./main":4,"./observable":5}],7:[function(require,module,exports){
/* A JavaScript implementation of the Secure Hash Standard
 * Version 0.3 Copyright Angel Marin 2003-2004 - http://anmar.eu.org/
 * Distributed under the BSD License
 * Some bits taken from Paul Johnston's SHA-1 implementation
 */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */
var hexcase = 0;/* hex output format. 0 - lowercase; 1 - uppercase        */

function safe_add (x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

function S (X, n) {return ( X >>> n ) | (X << (32 - n));}

function R (X, n) {return ( X >>> n );}

function Ch(x, y, z) {return ((x & y) ^ ((~x) & z));}

function Maj(x, y, z) {return ((x & y) ^ (x & z) ^ (y & z));}

function Sigma0256(x) {return (S(x, 2) ^ S(x, 13) ^ S(x, 22));}

function Sigma1256(x) {return (S(x, 6) ^ S(x, 11) ^ S(x, 25));}

function Gamma0256(x) {return (S(x, 7) ^ S(x, 18) ^ R(x, 3));}

function Gamma1256(x) {return (S(x, 17) ^ S(x, 19) ^ R(x, 10));}

function Sigma0512(x) {return (S(x, 28) ^ S(x, 34) ^ S(x, 39));}

function Sigma1512(x) {return (S(x, 14) ^ S(x, 18) ^ S(x, 41));}

function Gamma0512(x) {return (S(x, 1) ^ S(x, 8) ^ R(x, 7));}

function Gamma1512(x) {return (S(x, 19) ^ S(x, 61) ^ R(x, 6));}

function core_sha256 (m, l) {
    var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);
    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;

    /* append padding */
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;

    for ( var i = 0; i<m.length; i+=16 ) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        f = HASH[5];
        g = HASH[6];
        h = HASH[7];

        for ( var j = 0; j<64; j++) {
            if (j < 16) W[j] = m[j + i];
            else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

            T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
            T2 = safe_add(Sigma0256(a), Maj(a, b, c));

            h = g;
            g = f;
            f = e;
            e = safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add(T1, T2);
        }
        
        HASH[0] = safe_add(a, HASH[0]);
        HASH[1] = safe_add(b, HASH[1]);
        HASH[2] = safe_add(c, HASH[2]);
        HASH[3] = safe_add(d, HASH[3]);
        HASH[4] = safe_add(e, HASH[4]);
        HASH[5] = safe_add(f, HASH[5]);
        HASH[6] = safe_add(g, HASH[6]);
        HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
}

function core_sha512 (m, l) {
    var K = new Array(0x428a2f98d728ae22, 0x7137449123ef65cd, 0xb5c0fbcfec4d3b2f, 0xe9b5dba58189dbbc, 0x3956c25bf348b538, 0x59f111f1b605d019, 0x923f82a4af194f9b, 0xab1c5ed5da6d8118, 0xd807aa98a3030242, 0x12835b0145706fbe, 0x243185be4ee4b28c, 0x550c7dc3d5ffb4e2, 0x72be5d74f27b896f, 0x80deb1fe3b1696b1, 0x9bdc06a725c71235, 0xc19bf174cf692694, 0xe49b69c19ef14ad2, 0xefbe4786384f25e3, 0x0fc19dc68b8cd5b5, 0x240ca1cc77ac9c65, 0x2de92c6f592b0275, 0x4a7484aa6ea6e483, 0x5cb0a9dcbd41fbd4, 0x76f988da831153b5, 0x983e5152ee66dfab, 0xa831c66d2db43210, 0xb00327c898fb213f, 0xbf597fc7beef0ee4, 0xc6e00bf33da88fc2, 0xd5a79147930aa725, 0x06ca6351e003826f, 0x142929670a0e6e70, 0x27b70a8546d22ffc, 0x2e1b21385c26c926, 0x4d2c6dfc5ac42aed, 0x53380d139d95b3df, 0x650a73548baf63de, 0x766a0abb3c77b2a8, 0x81c2c92e47edaee6, 0x92722c851482353b, 0xa2bfe8a14cf10364, 0xa81a664bbc423001, 0xc24b8b70d0f89791, 0xc76c51a30654be30, 0xd192e819d6ef5218, 0xd69906245565a910, 0xf40e35855771202a, 0x106aa07032bbd1b8, 0x19a4c116b8d2d0c8, 0x1e376c085141ab53, 0x2748774cdf8eeb99, 0x34b0bcb5e19b48a8, 0x391c0cb3c5c95a63, 0x4ed8aa4ae3418acb, 0x5b9cca4f7763e373, 0x682e6ff3d6b2b8a3, 0x748f82ee5defb2fc, 0x78a5636f43172f60, 0x84c87814a1f0ab72, 0x8cc702081a6439ec, 0x90befffa23631e28, 0xa4506cebde82bde9, 0xbef9a3f7b2c67915, 0xc67178f2e372532b, 0xca273eceea26619c, 0xd186b8c721c0c207, 0xeada7dd6cde0eb1e, 0xf57d4f7fee6ed178, 0x06f067aa72176fba, 0x0a637dc5a2c898a6, 0x113f9804bef90dae, 0x1b710b35131c471b, 0x28db77f523047d84, 0x32caab7b40c72493, 0x3c9ebe0a15c9bebc, 0x431d67c49c100d4c, 0x4cc5d4becb3e42b6, 0x597f299cfc657e2a, 0x5fcb6fab3ad6faec, 0x6c44198c4a475817);
    var HASH = new Array(0x6a09e667f3bcc908, 0xbb67ae8584caa73b, 0x3c6ef372fe94f82b, 0xa54ff53a5f1d36f1, 0x510e527fade682d1, 0x9b05688c2b3e6c1f, 0x1f83d9abfb41bd6b, 0x5be0cd19137e2179);
    var W = new Array(80);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;

}

function str2binb (str) {
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
  return bin;
}

function binb2str (bin) {
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (24 - i%32)) & mask);
  return str;
}

function binb2hex (binarray) {
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
  }
  return str;
}

function binb2b64 (binarray) {
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

function hex_sha256(s){return binb2hex(core_sha256(str2binb(s),s.length * chrsz));}
function b64_sha256(s){return binb2b64(core_sha256(str2binb(s),s.length * chrsz));}
function str_sha256(s){return binb2str(core_sha256(str2binb(s),s.length * chrsz));}

module.exports = hex_sha256
},{}],8:[function(require,module,exports){
"use strict"

var moment = require("moment")

// TODO: stop this substandard node mimicry
module.exports = function(time) {
    return moment(time).format("YYYY-MM-DD HH:mm:ss.SSS Z")
}

},{"moment":11}],9:[function(require,module,exports){
"use strict"

// TODO: better browser support

exports.randHex = function() {
    var digits = "0123456789abcdef"
    var result = ""
    
    for (var i = 0; i !== 64; i++) {
        result += digits[Math.floor(Math.random() * digits.length)]
    }
    
    return result
}

exports.accumulatorMap = function() {
    var self = this

    this.values = {}

    this.add = function(key, amount) {
        if (!self.values[key]) {
            self.values[key] = amount
        } else {
            self.values[key] += amount
            
            if (self.values[key] === 0) {
                delete self.values[key]
            }
        }
    }

    this.get = function(key) {
        return self.values[key] || 0
    }

    this.pop = function(key) {
        var ret = self.get()
        delete self.values[key]
        
        return ret
    }
}

// TODO: test
exports.clone = function(obj) {
    if (typeof obj === "object") {
        if (Array.isArray(obj)) {
            var arr = []

            for (var i in obj) {
                arr.push(exports.clone(obj[i]))
            }

            return arr
        }
        
        if (obj === null) {
            return null
        }

        var result = {}

        for (var key in result) {
            result[key] = exports.clone(obj[key])
        }
    }
    
    return obj
}

exports.clamp = function(min, x, max) {
    if (x < min) {
        return min
    }
    
    if (x > max) {
        return max
    }
    
    return x
}

},{}],10:[function(require,module,exports){
/**
 * alertifyjs 1.4.1 http://alertifyjs.com
 * AlertifyJS is a javascript framework for developing pretty browser dialogs and notifications.
 * Copyright 2015 Mohammad Younes <Mohammad@alertifyjs.com> (http://alertifyjs.com) 
 * Licensed under MIT <http://opensource.org/licenses/mit-license.php>*/
( function ( window ) {
    'use strict';
    
    /**
     * Keys enum
     * @type {Object}
     */
    var keys = {
        ENTER: 13,
        ESC: 27,
        F1: 112,
        F12: 123,
        LEFT: 37,
        RIGHT: 39
    };
    /**
     * Default options 
     * @type {Object}
     */
    var defaults = {
        modal:true,
        basic:false,
        frameless:false,
        movable:true,
        resizable:true,
        closable:true,
        closableByDimmer:true,
        maximizable:true,
        startMaximized:false,
        pinnable:true,
        pinned:true,
        padding: true,
        overflow:true,
        maintainFocus:true,
        transition:'pulse',
        autoReset:true,
        notifier:{
            delay:5,
            position:'bottom-right'
        },
        glossary:{
            title:'AlertifyJS',
            ok: 'OK',
            cancel: 'Cancel',
            acccpt: 'Accept',
            deny: 'Deny',
            confirm: 'Confirm',
            decline: 'Decline',
            close: 'Close',
            maximize: 'Maximize',
            restore: 'Restore',
        },
        theme:{
            input:'ajs-input',
            ok:'ajs-ok',
            cancel:'ajs-cancel',
        }
    };
    
    //holds open dialogs instances
    var openDialogs = [];

    /**
     * [Helper]  Adds the specified class(es) to the element.
     *
     * @element {node}      The element
     * @className {string}  One or more space-separated classes to be added to the class attribute of the element.
     * 
     * @return {undefined}
     */
    function addClass(element,classNames){
        element.className += ' ' + classNames;
    }
    
    /**
     * [Helper]  Removes the specified class(es) from the element.
     *
     * @element {node}      The element
     * @className {string}  One or more space-separated classes to be removed from the class attribute of the element.
     * 
     * @return {undefined}
     */
    function removeClass(element,classNames){
        var classes = classNames.split(' ');
        for(var x=0;x<classes.length;x+=1){
            element.className = element.className.replace(' ' + classes[x], '');
        }
    }

    /**
     * [Helper]  Checks if the document is RTL
     *
     * @return {Boolean} True if the document is RTL, false otherwise.
     */
    function isRightToLeft(){
        return window.getComputedStyle(document.body).direction === 'rtl';
    }
    /**
     * [Helper]  Get the document current scrollTop
     *
     * @return {Number} current document scrollTop value
     */
    function getScrollTop(){
        return ((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop);
    }

    /**
     * [Helper]  Get the document current scrollLeft
     *
     * @return {Number} current document scrollLeft value
     */
    function getScrollLeft(){
        return ((document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft);
    }

    /**
    * Helper: clear contents
    *
    */
    function clearContents(element){
        while (element.lastChild) {
            element.removeChild(element.lastChild);
        }
    }
        

    /**
     * Use a closure to return proper event listener method. Try to use
     * `addEventListener` by default but fallback to `attachEvent` for
     * unsupported browser. The closure simply ensures that the test doesn't
     * happen every time the method is called.
     *
     * @param    {Node}     el    Node element
     * @param    {String}   event Event type
     * @param    {Function} fn    Callback of event
     * @return   {Function}
     */
    var on = (function () {
        if (document.addEventListener) {
            return function (el, event, fn, useCapture) {
                el.addEventListener(event, fn, useCapture === true);
            };
        } else if (document.attachEvent) {
            return function (el, event, fn) {
                el.attachEvent('on' + event, fn);
            };
        }
    }());

    /**
     * Use a closure to return proper event listener method. Try to use
     * `removeEventListener` by default but fallback to `detachEvent` for
     * unsupported browser. The closure simply ensures that the test doesn't
     * happen every time the method is called.
     *
     * @param    {Node}     el    Node element
     * @param    {String}   event Event type
     * @param    {Function} fn    Callback of event
     * @return   {Function}
     */
    var off = (function () {
        if (document.removeEventListener) {
            return function (el, event, fn, useCapture) {
                el.removeEventListener(event, fn, useCapture === true);
            };
        } else if (document.detachEvent) {
            return function (el, event, fn) {
                el.detachEvent('on' + event, fn);
            };
        }
    }());

    /**
     * Prevent default event from firing
     *
     * @param  {Event} event Event object
     * @return {undefined}

    function prevent ( event ) {
        if ( event ) {
            if ( event.preventDefault ) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
    }
    */
    var transition = (function () {
        var t, type;
        var supported = false;
        var transitions = {
            'animation'        : 'animationend',
            'OAnimation'       : 'oAnimationEnd oanimationend',
            'msAnimation'      : 'MSAnimationEnd',
            'MozAnimation'     : 'animationend',
            'WebkitAnimation'  : 'webkitAnimationEnd'
        };

        for (t in transitions) {
            if (document.documentElement.style[t] !== undefined) {
                type = transitions[t];
                supported = true;
                break;
            }
        }

        return {
            type: type,
            supported: supported
        };
    }());

    /**
    * Creates event handler delegate that sends the instance as last argument.
    * 
    * @return {Function}    a function wrapper which sends the instance as last argument.
    */
    function delegate(context, method) {
        return function () {
            if (arguments.length > 0) {
                var args = [];
                for (var x = 0; x < arguments.length; x += 1) {
                    args.push(arguments[x]);
                }
                args.push(context);
                return method.apply(context, args);
            }
            return method.apply(context, [null, context]);
        };
    }
    /**
    * Helper for creating a dialog close event.
    * 
    * @return {object}
    */
    function createCloseEvent(index, button) {
        return {
            index: index,
            button: button,
            cancel: false
        };
    }


    /**
     * Super class for all dialogs
     *
     * @return {Object}		base dialog prototype
     */
    var dialog = (function () {
        var //holds the list of used keys.
            usedKeys = [],
            //dummy variable, used to trigger dom reflow.
            reflow = null,
            //condition for detecting safari
            isSafari = window.navigator.userAgent.indexOf('Safari') > -1 && window.navigator.userAgent.indexOf('Chrome') < 0,
            //dialog building blocks
            templates = {
                dimmer:'<div class="ajs-dimmer"></div>',
                /*tab index required to fire click event before body focus*/
                modal: '<div class="ajs-modal" tabindex="0"></div>',
                dialog: '<div class="ajs-dialog" tabindex="0"></div>',
                reset: '<button class="ajs-reset"></button>',
                commands: '<div class="ajs-commands"><button class="ajs-pin"></button><button class="ajs-maximize"></button><button class="ajs-close"></button></div>',
                header: '<div class="ajs-header"></div>',
                body: '<div class="ajs-body"></div>',
                content: '<div class="ajs-content"></div>',
                footer: '<div class="ajs-footer"></div>',
                buttons: { primary: '<div class="ajs-primary ajs-buttons"></div>', auxiliary: '<div class="ajs-auxiliary ajs-buttons"></div>' },
                button: '<button class="ajs-button"></button>',
                resizeHandle: '<div class="ajs-handle"></div>',
            },
            //common class names
            classes = {
                base: 'alertify',
                prefix: 'ajs-',
                hidden: 'ajs-hidden',
                noSelection: 'ajs-no-selection',
                noOverflow: 'ajs-no-overflow',
                noPadding:'ajs-no-padding',
                modeless: 'ajs-modeless',
                movable: 'ajs-movable',
                resizable: 'ajs-resizable',
                capture: 'ajs-capture',
                fixed: 'ajs-fixed',
                closable:'ajs-closable',
                maximizable:'ajs-maximizable',
                maximize: 'ajs-maximize',
                restore: 'ajs-restore',
                pinnable:'ajs-pinnable',
                unpinned:'ajs-unpinned',
                pin:'ajs-pin',
                maximized: 'ajs-maximized',
                animationIn: 'ajs-in',
                animationOut: 'ajs-out',
                shake:'ajs-shake',
                basic:'ajs-basic',
                frameless:'ajs-frameless'
            };
			
        /**
         * Helper: initializes the dialog instance
         * 
         * @return	{Number}	The total count of currently open modals.
         */
        function initialize(instance){
            
            if(!instance.__internal){
				
                //no need to expose init after this.
                delete instance.__init;
				
                //in case the script was included before body.
                //after first dialog gets initialized, it won't be null anymore!				
                if(null === reflow){
                    // set tabindex attribute on body element this allows script to give it
                    // focus after the dialog is closed
                    document.body.setAttribute( 'tabindex', '0' );
                }
				
                //get dialog buttons/focus setup
                var setup;
                if(typeof instance.setup === 'function'){
                    setup = instance.setup();
                    setup.options = setup.options  || {};
                    setup.focus = setup.focus  || {};
                }else{
                    setup = {
                        buttons:[],
                        focus:{
                            element:null,
                            select:false
                        },
                        options:{
                        }
                    };
                }
                
                //initialize hooks object.
                if(typeof instance.hooks !== 'object'){
                    instance.hooks = {};
                }

                //copy buttons defintion
                var buttonsDefinition = [];
                if(Array.isArray(setup.buttons)){
                    for(var b=0;b<setup.buttons.length;b+=1){
                        var ref  = setup.buttons[b],
                            copy = {};
                        for (var i in ref) {
                            if (ref.hasOwnProperty(i)) {
                                copy[i] = ref[i];
                            }
                        }
                        buttonsDefinition.push(copy);
                    }
                }

                var internal = instance.__internal = {
                    /**
                     * Flag holding the open state of the dialog
                     * 
                     * @type {Boolean}
                     */
                    isOpen:false,
                    /**
                     * Active element is the element that will receive focus after
                     * closing the dialog. It defaults as the body tag, but gets updated
                     * to the last focused element before the dialog was opened.
                     *
                     * @type {Node}
                     */
                    activeElement:document.body,
                    timerIn:undefined,
                    timerOut:undefined,
                    buttons: buttonsDefinition,
                    focus: setup.focus,
                    options: {
                        title: undefined,
                        modal: undefined,
                        basic:undefined,
                        frameless:undefined,
                        pinned: undefined,
                        movable: undefined,
                        resizable: undefined,
                        autoReset: undefined,
                        closable: undefined,
                        closableByDimmer: undefined,
                        maximizable: undefined,
                        startMaximized: undefined,
                        pinnable: undefined,
                        transition: undefined,
                        padding:undefined,
                        overflow:undefined,
                        onshow:undefined,
                        onclose:undefined,
                        onfocus:undefined,
                    },
                    resetHandler:undefined,
                    beginMoveHandler:undefined,
                    beginResizeHandler:undefined,
                    bringToFrontHandler:undefined,
                    modalClickHandler:undefined,
                    buttonsClickHandler:undefined,
                    commandsClickHandler:undefined,
                    transitionInHandler:undefined,
                    transitionOutHandler:undefined
                };
				
                                
                var elements = {};
                //root node
                elements.root = document.createElement('div');
                
                elements.root.className = classes.base + ' ' + classes.hidden + ' ';
				
                elements.root.innerHTML = templates.dimmer + templates.modal;
                
                //dimmer
                elements.dimmer = elements.root.firstChild;
				
                //dialog
                elements.modal = elements.root.lastChild;
                elements.modal.innerHTML = templates.dialog;
                elements.dialog = elements.modal.firstChild;
                elements.dialog.innerHTML = templates.reset + templates.commands + templates.header + templates.body + templates.footer + templates.resizeHandle + templates.reset;

                //reset links
                elements.reset = [];
                elements.reset.push(elements.dialog.firstChild);
                elements.reset.push(elements.dialog.lastChild);
                
                //commands
                elements.commands = {};
                elements.commands.container = elements.reset[0].nextSibling;
                elements.commands.pin = elements.commands.container.firstChild;
                elements.commands.maximize = elements.commands.pin.nextSibling;
                elements.commands.close = elements.commands.maximize.nextSibling;
                
                //header
                elements.header = elements.commands.container.nextSibling;

                //body
                elements.body = elements.header.nextSibling;
                elements.body.innerHTML = templates.content;
                elements.content = elements.body.firstChild;

                //footer
                elements.footer = elements.body.nextSibling;
                elements.footer.innerHTML = templates.buttons.auxiliary + templates.buttons.primary;
                
                //resize handle
                elements.resizeHandle = elements.footer.nextSibling;

                //buttons
                elements.buttons = {};
                elements.buttons.auxiliary = elements.footer.firstChild;
                elements.buttons.primary = elements.buttons.auxiliary.nextSibling;
                elements.buttons.primary.innerHTML = templates.button;
                elements.buttonTemplate = elements.buttons.primary.firstChild;
                //remove button template
                elements.buttons.primary.removeChild(elements.buttonTemplate);
                               
                for(var x=0; x < instance.__internal.buttons.length; x+=1) {
                    var button = instance.__internal.buttons[x];
                    
                    // add to the list of used keys.
                    if(usedKeys.indexOf(button.key) < 0){
                        usedKeys.push(button.key);
                    }

                    button.element = elements.buttonTemplate.cloneNode();
                    button.element.innerHTML = button.text;
                    if(typeof button.className === 'string' &&  button.className !== ''){
                        addClass(button.element, button.className);
                    }
                    for(var key in button.attrs){
                        if(key !== 'className' && button.attrs.hasOwnProperty(key)){
                            button.element.setAttribute(key, button.attrs[key]);
                        }
                    }
                    if(button.scope === 'auxiliary'){
                        elements.buttons.auxiliary.appendChild(button.element);
                    }else{
                        elements.buttons.primary.appendChild(button.element);
                    }
                }
                //make elements pubic
                instance.elements = elements;
                
                //save event handlers delegates
                internal.resetHandler = delegate(instance, onReset);
                internal.beginMoveHandler = delegate(instance, beginMove);
                internal.beginResizeHandler = delegate(instance, beginResize);
                internal.bringToFrontHandler = delegate(instance, bringToFront);
                internal.modalClickHandler = delegate(instance, modalClickHandler);
                internal.buttonsClickHandler = delegate(instance, buttonsClickHandler);
                internal.commandsClickHandler = delegate(instance, commandsClickHandler);
                internal.transitionInHandler = delegate(instance, handleTransitionInEvent);
                internal.transitionOutHandler = delegate(instance, handleTransitionOutEvent);

                
                //settings
                instance.set('title', setup.options.title === undefined ? alertify.defaults.glossary.title : setup.options.title);
				
                instance.set('modal', setup.options.modal === undefined ? alertify.defaults.modal : setup.options.modal);
                instance.set('basic', setup.options.basic === undefined ? alertify.defaults.basic : setup.options.basic);
                instance.set('frameless', setup.options.frameless === undefined ? alertify.defaults.frameless : setup.options.frameless);
							
                instance.set('movable', setup.options.movable === undefined ? alertify.defaults.movable : setup.options.movable);
                instance.set('resizable', setup.options.resizable === undefined ? alertify.defaults.resizable : setup.options.resizable);
                instance.set('autoReset', setup.options.autoReset === undefined ? alertify.defaults.autoReset : setup.options.autoReset);
				
                instance.set('closable', setup.options.closable === undefined ? alertify.defaults.closable : setup.options.closable);
                instance.set('closableByDimmer', setup.options.closableByDimmer === undefined ? alertify.defaults.closableByDimmer : setup.options.closableByDimmer);
                instance.set('maximizable', setup.options.maximizable === undefined ? alertify.defaults.maximizable : setup.options.maximizable);
                instance.set('startMaximized', setup.options.startMaximized === undefined ? alertify.defaults.startMaximized : setup.options.startMaximized);
				
                instance.set('pinnable', setup.options.pinnable === undefined ? alertify.defaults.pinnable : setup.options.pinnable);
                instance.set('pinned', setup.options.pinned === undefined ? alertify.defaults.pinned : setup.options.pinned);
				
                instance.set('transition', setup.options.transition === undefined ? alertify.defaults.transition : setup.options.transition);

                instance.set('padding', setup.options.padding === undefined ? alertify.defaults.padding : setup.options.padding);
                instance.set('overflow', setup.options.overflow === undefined ? alertify.defaults.overflow : setup.options.overflow);
				

                // allow dom customization
                if(typeof instance.build === 'function'){
                    instance.build();
                }
            }
            
            //add to the end of the DOM tree.
            document.body.appendChild(instance.elements.root);
        }

        /**
         * Helper: maintains scroll position
         *
         */
        var scrollX, scrollY;
        function saveScrollPosition(){
            scrollX = window.scrollX;
            scrollY = window.scrollY;
        }
        function restoreScrollPosition(){
            window.scrollTo(scrollX, scrollY);
        }

        /**
         * Helper: adds/removes no-overflow class from body
         *
         */
        function ensureNoOverflow(){
            var requiresNoOverflow = 0;
            for(var x=0;x<openDialogs.length;x+=1){
                var instance = openDialogs[x];
                if(instance.isModal() || instance.isMaximized()){
                    requiresNoOverflow+=1;
                }
            }
            if(requiresNoOverflow === 0){
                //last open modal or last maximized one
                removeClass(document.body, classes.noOverflow);
            }else if(requiresNoOverflow > 0 && document.body.className.indexOf(classes.noOverflow) < 0){
                //first open modal or first maximized one
                addClass(document.body, classes.noOverflow);
            }
        }
		
        /**
         * Sets the name of the transition used to show/hide the dialog
         * 
         * @param {Object} instance The dilog instance.
         *
         */
        function updateTransition(instance, value, oldValue){
            if(typeof oldValue === 'string'){
                removeClass(instance.elements.root,classes.prefix +  oldValue);
            }
            addClass(instance.elements.root, classes.prefix + value);
            reflow = instance.elements.root.offsetWidth;
        }
		
        /**
         * Toggles the dialog display mode
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function updateDisplayMode(instance){
            if(instance.get('modal')){

                //make modal
                removeClass(instance.elements.root, classes.modeless);
				
                //only if open
                if(instance.isOpen()){
                    unbindModelessEvents(instance);
					
                    //in case a pinned modless dialog was made modal while open.
                    updateAbsPositionFix(instance);
					
                    ensureNoOverflow();
                }
            }else{
                //make modelss
                addClass(instance.elements.root, classes.modeless);
								
                //only if open
                if(instance.isOpen()){
                    bindModelessEvents(instance);
					
                    //in case pin/unpin was called while a modal is open
                    updateAbsPositionFix(instance);
										
                    ensureNoOverflow();
                }
            }
        }

        /**
         * Toggles the dialog basic view mode 
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function updateBasicMode(instance){
            if (instance.get('basic')) {
                // add class
                addClass(instance.elements.root, classes.basic);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.basic);
            }
        }

        /**
         * Toggles the dialog frameless view mode 
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function updateFramelessMode(instance){
            if (instance.get('frameless')) {
                // add class
                addClass(instance.elements.root, classes.frameless);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.frameless);
            }
        }
		
        /**
         * Helper: Brings the modeless dialog to front, attached to modeless dialogs.
         *
         * @param {Event} event Focus event
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bringToFront(event, instance){
            
            // Do not bring to front if preceeded by an open modal
            var index = openDialogs.indexOf(instance);
            for(var x=index+1;x<openDialogs.length;x+=1){
                if(openDialogs[x].isModal()){
                    return;
                }
            }
			
            // Bring to front by making it the last child.
            if(document.body.lastChild !== instance.elements.root){
                document.body.appendChild(instance.elements.root);
                //also make sure its at the end of the list
                openDialogs.splice(openDialogs.indexOf(instance),1);
                openDialogs.push(instance);
                setFocus(instance);
            }
			
            return false;
        }
		
        /**
         * Helper: reflects dialogs options updates
         *
         * @param {Object} instance The dilog instance.
         * @param {String} option The updated option name.
         *
         * @return	{undefined}	
         */
        function optionUpdated(instance, option, oldValue, newValue){
            switch(option){
            case 'title':
                instance.setHeader(newValue);
                break;
            case 'modal':
                updateDisplayMode(instance);
                break;
            case 'basic':
                updateBasicMode(instance);
                break;
            case 'frameless':
                updateFramelessMode(instance);
                break;
            case 'pinned':
                updatePinned(instance);
                break;
            case 'closable':
                updateClosable(instance);
                break;
            case 'maximizable':
                updateMaximizable(instance);
                break;
            case 'pinnable':
                updatePinnable(instance);
                break;
            case 'movable':
                updateMovable(instance);
                break;
            case 'resizable':
                updateResizable(instance);
                break;
            case 'transition':
                updateTransition(instance,newValue, oldValue);
                break;
            case 'padding':
                if(newValue){
                    removeClass(instance.elements.root, classes.noPadding);
                }else if(instance.elements.root.className.indexOf(classes.noPadding) < 0){
                    addClass(instance.elements.root, classes.noPadding);
                }
                break;
            case 'overflow':
                if(newValue){
                    removeClass(instance.elements.root, classes.noOverflow);
                }else if(instance.elements.root.className.indexOf(classes.noOverflow) < 0){
                    addClass(instance.elements.root, classes.noOverflow);
                }
                break;
            case 'transition':
                updateTransition(instance,newValue, oldValue);
                break;
            }

            // internal on option updated event
            if(typeof instance.hooks.onupdate === 'function'){
                instance.hooks.onupdate.call(instance, option, oldValue, newValue);
            }
        }
		
        /**
         * Helper: reflects dialogs options updates
         *
         * @param {Object} instance The dilog instance.
         * @param {Object} obj The object to set/get a value on/from.
         * @param {Function} callback The callback function to call if the key was found.
         * @param {String|Object} key A string specifying a propery name or a collection of key value pairs.
         * @param {Object} value Optional, the value associated with the key (in case it was a string).
         * @param {String} option The updated option name.
         *
         * @return	{Object} result object 
         *	The result objects has an 'op' property, indicating of this is a SET or GET operation.
         *		GET: 
         *		- found: a flag indicating if the key was found or not.
         *		- value: the property value.
         *		SET:
         *		- items: a list of key value pairs of the properties being set.
         *				each contains:
         *					- found: a flag indicating if the key was found or not.
         *					- key: the property key.
         *					- value: the property value.
         */
        function update(instance, obj, callback, key, value){
            var result = {op:undefined, items: [] };
            if(typeof value === 'undefined' && typeof key === 'string') {
                //get
                result.op = 'get';
                if(obj.hasOwnProperty(key)){
                    result.found = true;
                    result.value = obj[key];
                }else{
                    result.found = false;
                    result.value = undefined;
                }
            }
            else
            {
                var old;
                //set
                result.op = 'set';
                if(typeof key === 'object'){
                    //set multiple
                    var args = key;
                    for (var prop in args) {
                        if (obj.hasOwnProperty(prop)) {
                            if(obj[prop] !== args[prop]){
                                old = obj[prop];
                                obj[prop] = args[prop];
                                callback.call(instance,prop, old, args[prop]);
                            }
                            result.items.push({ 'key': prop, 'value': args[prop], 'found':true});
                        }else{
                            result.items.push({ 'key': prop, 'value': args[prop], 'found':false});
                        }
                    }
                } else if (typeof key === 'string'){
                    //set single
                    if (obj.hasOwnProperty(key)) {
                        if(obj[key] !== value){
                            old  = obj[key];
                            obj[key] = value;
                            callback.call(instance,key, old, value);
                        }
                        result.items.push({'key': key, 'value': value , 'found':true});
						
                    }else{
                        result.items.push({'key': key, 'value': value , 'found':false});
                    }
                } else {
                    //invalid params
                    throw new Error('args must be a string or object');
                }
            }
            return result;
        }
		

        /**
         * Triggers a close event.
         *
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function triggerClose(instance) {
            var found;
            triggerCallback(instance, function (button) {
                return found = (button.invokeOnClose === true);
            });
            //none of the buttons registered as onclose callback
            //close the dialog
            if (!found && instance.isOpen()) {
                instance.close();
            }
        }

        /**
         * Dialogs commands event handler, attached to the dialog commands element.
         *
         * @param {Event} event	DOM event object.
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function commandsClickHandler(event, instance) {
            var target = event.srcElement || event.target;
            switch (target) {
            case instance.elements.commands.pin:
                if (!instance.isPinned()) {
                    pin(instance);
                } else {
                    unpin(instance);
                }
                break;
            case instance.elements.commands.maximize:
                if (!instance.isMaximized()) {
                    maximize(instance);
                } else {
                    restore(instance);
                }
                break;
            case instance.elements.commands.close:
                triggerClose(instance);
                break;
            }
            return false;
        }

        /**
         * Helper: pins the modeless dialog.
         *
         * @param {Object} instance	The dialog instance.
         * 
         * @return {undefined}
         */
        function pin(instance) {
            //pin the dialog
            instance.set('pinned', true);
        }

        /**
         * Helper: unpins the modeless dialog.
         *
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function unpin(instance) {
            //unpin the dialog 
            instance.set('pinned', false);
        }


        /**
         * Helper: enlarges the dialog to fill the entire screen.
         *
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function maximize(instance) {
            //maximize the dialog 
            addClass(instance.elements.root, classes.maximized);
            if (instance.isOpen()) {
                ensureNoOverflow();
            }
        }

        /**
         * Helper: returns the dialog to its former size.
         *
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function restore(instance) {
            //maximize the dialog 
            removeClass(instance.elements.root, classes.maximized);
            if (instance.isOpen()) {
                ensureNoOverflow();
            }
        }

        /**
         * Show or hide the maximize box.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updatePinnable(instance) {
            if (instance.get('pinnable')) {
                // add class
                addClass(instance.elements.root, classes.pinnable);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.pinnable);
            }
        }

        /**
         * Helper: Fixes the absolutly positioned modal div position.
         *
         * @param {Object} instance The dialog instance.
         *
         * @return {undefined}
         */
        function addAbsPositionFix(instance) {
            var scrollLeft = getScrollLeft();
            instance.elements.modal.style.marginTop = getScrollTop() + 'px';
            instance.elements.modal.style.marginLeft = scrollLeft + 'px';
            instance.elements.modal.style.marginRight = (-scrollLeft) + 'px';
        }

        /**
         * Helper: Removes the absolutly positioned modal div position fix.
         *
         * @param {Object} instance The dialog instance.
         *
         * @return {undefined}
         */
        function removeAbsPositionFix(instance) {
            var marginTop = parseInt(instance.elements.modal.style.marginTop, 10);
            var marginLeft = parseInt(instance.elements.modal.style.marginLeft, 10);
            instance.elements.modal.style.marginTop = '';
            instance.elements.modal.style.marginLeft = '';
            instance.elements.modal.style.marginRight = '';

            if (instance.isOpen()) {
                var top = 0,
                    left = 0
                ;
                if (instance.elements.dialog.style.top !== '') {
                    top = parseInt(instance.elements.dialog.style.top, 10);
                }
                instance.elements.dialog.style.top = (top + (marginTop - getScrollTop())) + 'px';

                if (instance.elements.dialog.style.left !== '') {
                    left = parseInt(instance.elements.dialog.style.left, 10);
                }
                instance.elements.dialog.style.left = (left + (marginLeft - getScrollLeft())) + 'px';
            }
        }
        /**
         * Helper: Adds/Removes the absolutly positioned modal div position fix based on its pinned setting.
         *
         * @param {Object} instance The dialog instance.
         *
         * @return {undefined}
         */
        function updateAbsPositionFix(instance) {
            // if modeless and unpinned add fix
            if (!instance.get('modal') && !instance.get('pinned')) {
                addAbsPositionFix(instance);
            } else {
                removeAbsPositionFix(instance);
            }
        }
        /**
         * Toggles the dialog position lock | modeless only.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to make it modal, false otherwise.
         *
         * @return {undefined}
         */
        function updatePinned(instance) {
            if (instance.get('pinned')) {
                removeClass(instance.elements.root, classes.unpinned);
                if (instance.isOpen()) {
                    removeAbsPositionFix(instance);
                }
            } else {
                addClass(instance.elements.root, classes.unpinned);
                if (instance.isOpen() && !instance.isModal()) {
                    addAbsPositionFix(instance);
                }
            }
        }

        /**
         * Show or hide the maximize box.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updateMaximizable(instance) {
            if (instance.get('maximizable')) {
                // add class
                addClass(instance.elements.root, classes.maximizable);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.maximizable);
            }
        }

        /**
         * Show or hide the close box.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updateClosable(instance) {
            if (instance.get('closable')) {
                // add class
                addClass(instance.elements.root, classes.closable);
                bindClosableEvents(instance);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.closable);
                unbindClosableEvents(instance);
            }
        }

        // flag to cancel click event if already handled by end resize event (the mousedown, mousemove, mouseup sequence fires a click event.).
        var cancelClick = false;

        /**
         * Helper: closes the modal dialog when clicking the modal
         *
         * @param {Event} event	DOM event object.
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function modalClickHandler(event, instance) {
            var target = event.srcElement || event.target;
            if (!cancelClick && target === instance.elements.modal && instance.get('closableByDimmer') === true) {
                triggerClose(instance);
            }
            cancelClick = false;
            return false;
        }

        // flag to cancel keyup event if already handled by click event (pressing Enter on a focusted button).
        var cancelKeyup = false;
        /** 
         * Helper: triggers a button callback
         *
         * @param {Object}		The dilog instance.
         * @param {Function}	Callback to check which button triggered the event.
         *
         * @return {undefined}
         */
        function triggerCallback(instance, check) {
            for (var idx = 0; idx < instance.__internal.buttons.length; idx += 1) {
                var button = instance.__internal.buttons[idx];
                if (!button.element.disabled && check(button)) {
                    var closeEvent = createCloseEvent(idx, button);
                    if (typeof instance.callback === 'function') {
                        instance.callback.apply(instance, [closeEvent]);
                    }
                    //close the dialog only if not canceled.
                    if (closeEvent.cancel === false) {
                        instance.close();
                    }
                    break;
                }
            }
        }

        /**
         * Clicks event handler, attached to the dialog footer.
         *
         * @param {Event}		DOM event object.
         * @param {Object}		The dilog instance.
         * 
         * @return {undefined}
         */
        function buttonsClickHandler(event, instance) {
            var target = event.srcElement || event.target;
            triggerCallback(instance, function (button) {
                // if this button caused the click, cancel keyup event
                return button.element === target && (cancelKeyup = true);
            });
        }

        /**
         * Keyup event handler, attached to the document.body
         *
         * @param {Event}		DOM event object.
         * @param {Object}		The dilog instance.
         * 
         * @return {undefined}
         */
        function keyupHandler(event) {
            //hitting enter while button has focus will trigger keyup too.
            //ignore if handled by clickHandler
            if (cancelKeyup) {
                cancelKeyup = false;
                return;
            }
            var instance = openDialogs[openDialogs.length - 1];
            var keyCode = event.keyCode;
            if (instance.__internal.buttons.length === 0 && keyCode === keys.ESC && instance.get('closable') === true) {
                triggerClose(instance);
                return false;
            }else if (usedKeys.indexOf(keyCode) > -1) {
                triggerCallback(instance, function (button) {
                    return button.key === keyCode;
                });
                return false;
            }
        }
        /**
        * Keydown event handler, attached to the document.body
        *
        * @param {Event}		DOM event object.
        * @param {Object}		The dilog instance.
        * 
        * @return {undefined}
        */
        function keydownHandler(event) {
            var instance = openDialogs[openDialogs.length - 1];
            var keyCode = event.keyCode;
            if (keyCode === keys.LEFT || keyCode === keys.RIGHT) {
                var buttons = instance.__internal.buttons;
                for (var x = 0; x < buttons.length; x += 1) {
                    if (document.activeElement === buttons[x].element) {
                        switch (keyCode) {
                        case keys.LEFT:
                            buttons[(x || buttons.length) - 1].element.focus();
                            return;
                        case keys.RIGHT:
                            buttons[(x + 1) % buttons.length].element.focus();
                            return;
                        }
                    }
                }
            }else if (keyCode < keys.F12 + 1 && keyCode > keys.F1 - 1 && usedKeys.indexOf(keyCode) > -1) {
                event.preventDefault();
                event.stopPropagation();
                triggerCallback(instance, function (button) {
                    return button.key === keyCode;
                });
                return false;
            }
        }


        /**
         * Sets focus to proper dialog element
         *
         * @param {Object} instance The dilog instance.
         * @param {Node} [resetTarget=undefined] DOM element to reset focus to.
         *
         * @return {undefined}
         */
        function setFocus(instance, resetTarget) {
            // reset target has already been determined.
            if (resetTarget) {
                resetTarget.focus();
            } else {
                // current instance focus settings
                var focus = instance.__internal.focus;
                // the focus element.
                var element = focus.element;

                switch (typeof focus.element) {
                // a number means a button index
                case 'number':
                    if (instance.__internal.buttons.length > focus.element) {
                        //in basic view, skip focusing the buttons.
                        if (instance.get('basic') === true) {
                            element = instance.elements.reset[0];
                        } else {
                            element = instance.__internal.buttons[focus.element].element;
                        }
                    }
                    break;
                // a string means querySelector to select from dialog body contents.
                case 'string':
                    element = instance.elements.body.querySelector(focus.element);
                    break;
                // a function should return the focus element.
                case 'function':
                    element = focus.element.call(instance);
                    break;
                }
                
                // if no focus element, default to first reset element.
                if ((typeof element === 'undefined' || element === null) && instance.__internal.buttons.length === 0) {
                    element = instance.elements.reset[0];
                }
                // focus
                if (element && element.focus) {
                    element.focus();
                    // if selectable
                    if (focus.select && element.select) {
                        element.select();
                    }
                }
            }
        }

        /**
         * Focus event handler, attached to document.body and dialogs own reset links.
         * handles the focus for modal dialogs only.
         *
         * @param {Event} event DOM focus event object.
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function onReset(event, instance) {

            // should work on last modal if triggered from document.body 
            if (!instance) {
                for (var x = openDialogs.length - 1; x > -1; x -= 1) {
                    if (openDialogs[x].isModal()) {
                        instance = openDialogs[x];
                        break;
                    }
                }
            }
            // if modal
            if (instance && instance.isModal()) {
                // determine reset target to enable forward/backward tab cycle.
                var resetTarget, target = event.srcElement || event.target;
                var lastResetElement = target === instance.elements.reset[1] || (instance.__internal.buttons.length === 0 && target === document.body);

                // if last reset link, then go to maximize or close
                if (lastResetElement) {
                    if (instance.get('maximizable')) {
                        resetTarget = instance.elements.commands.maximize;
                    } else if (instance.get('closable')) {
                        resetTarget = instance.elements.commands.close;
                    }
                }
                // if no reset target found, try finding the best button
                if (resetTarget === undefined) {
                    if (typeof instance.__internal.focus.element === 'number') {
                        // button focus element, go to first available button
                        if (target === instance.elements.reset[0]) {
                            resetTarget = instance.elements.buttons.auxiliary.firstChild || instance.elements.buttons.primary.firstChild;
                        } else if (lastResetElement) {
                            //restart the cycle by going to first reset link
                            resetTarget = instance.elements.reset[0];
                        }
                    } else {
                        // will reach here when tapping backwards, so go to last child
                        // The focus element SHOULD NOT be a button (logically!).
                        if (target === instance.elements.reset[0]) {
                            resetTarget = instance.elements.buttons.primary.lastChild || instance.elements.buttons.auxiliary.lastChild;
                        }
                    }
                }
                // focus
                setFocus(instance, resetTarget);
            }
        }
        /**
         * Transition in transitionend event handler. 
         *
         * @param {Event}		TransitionEnd event object.
         * @param {Object}		The dilog instance.
         *
         * @return {undefined}
         */
        function handleTransitionInEvent(event, instance) {
            // clear the timer
            clearTimeout(instance.__internal.timerIn);

            // once transition is complete, set focus
            setFocus(instance);

            //restore scroll to prevent document jump
            restoreScrollPosition();

            // allow handling key up after transition ended.
            cancelKeyup = false;

            // allow custom `onfocus` method
            if (typeof instance.get('onfocus') === 'function') {
                instance.get('onfocus').call(instance);
            }

            // unbind the event
            off(instance.elements.dialog, transition.type, instance.__internal.transitionInHandler);

            removeClass(instance.elements.root, classes.animationIn);
        }

        /**
         * Transition out transitionend event handler. 
         *
         * @param {Event}		TransitionEnd event object.
         * @param {Object}		The dilog instance.
         *
         * @return {undefined}
         */
        function handleTransitionOutEvent(event, instance) {
            // clear the timer
            clearTimeout(instance.__internal.timerOut);
            // unbind the event
            off(instance.elements.dialog, transition.type, instance.__internal.transitionOutHandler);

            // reset move updates
            resetMove(instance);
            // reset resize updates
            resetResize(instance);

            // restore if maximized
            if (instance.isMaximized() && !instance.get('startMaximized')) {
                restore(instance);
            }

            // return focus to the last active element
            if (alertify.defaults.maintainFocus && instance.__internal.activeElement) {
                instance.__internal.activeElement.focus();
                instance.__internal.activeElement = null;
            }
        }
        /* Controls moving a dialog around */
        //holde the current moving instance
        var movable = null,
            //holds the current X offset when move starts
            offsetX = 0,
            //holds the current Y offset when move starts
            offsetY = 0,
            xProp = 'pageX',
            yProp = 'pageY'
        ;

        /**
         * Helper: sets the element top/left coordinates
         *
         * @param {Event} event	DOM event object.
         * @param {Node} element The element being moved.
         * 
         * @return {undefined}
         */
        function moveElement(event, element) {
            element.style.left = (event[xProp] - offsetX) + 'px';
            element.style.top = (event[yProp] - offsetY) + 'px';
        }

        /**
         * Triggers the start of a move event, attached to the header element mouse down event.
         * Adds no-selection class to the body, disabling selection while moving.
         *
         * @param {Event} event	DOM event object.
         * @param {Object} instance The dilog instance.
         * 
         * @return {Boolean} false
         */
        function beginMove(event, instance) {
            if (resizable === null && !instance.isMaximized() && instance.get('movable')) {
                var eventSrc;
                if (event.type === 'touchstart') {
                    event.preventDefault();
                    eventSrc = event.targetTouches[0];
                    xProp = 'clientX';
                    yProp = 'clientY';
                } else if (event.button === 0) {
                    eventSrc = event;
                }

                if (eventSrc) {

                    movable = instance;
                    offsetX = eventSrc[xProp];
                    offsetY = eventSrc[yProp];

                    var element = instance.elements.dialog;
                    addClass(element, classes.capture);

                    if (element.style.left) {
                        offsetX -= parseInt(element.style.left, 10);
                    }

                    if (element.style.top) {
                        offsetY -= parseInt(element.style.top, 10);
                    }
                    moveElement(eventSrc, element);

                    addClass(document.body, classes.noSelection);
                    return false;
                }
            }
        }

        /**
         * The actual move handler,  attached to document.body mousemove event.
         *
         * @param {Event} event	DOM event object.
         * 
         * @return {undefined}
         */
        function move(event) {
            if (movable) {
                var eventSrc;
                if (event.type === 'touchmove') {
                    event.preventDefault();
                    eventSrc = event.targetTouches[0];
                } else if (event.button === 0) {
                    eventSrc = event;
                }
                if (eventSrc) {
                    moveElement(eventSrc, movable.elements.dialog);
                }
            }
        }

        /**
         * Triggers the end of a move event,  attached to document.body mouseup event.
         * Removes no-selection class from document.body, allowing selection.
         *
         * @return {undefined}
         */
        function endMove() {
            if (movable) {
                var element = movable.elements.dialog;
                movable = null;
                removeClass(document.body, classes.noSelection);
                removeClass(element, classes.capture);
            }
        }

        /**
         * Resets any changes made by moving the element to its original state,
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function resetMove(instance) {
            movable = null;
            var element = instance.elements.dialog;
            element.style.left = element.style.top = '';
        }

        /**
         * Updates the dialog move behavior.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updateMovable(instance) {
            if (instance.get('movable')) {
                // add class
                addClass(instance.elements.root, classes.movable);
                if (instance.isOpen()) {
                    bindMovableEvents(instance);
                }
            } else {

                //reset
                resetMove(instance);
                // remove class
                removeClass(instance.elements.root, classes.movable);
                if (instance.isOpen()) {
                    unbindMovableEvents(instance);
                }
            }
        }

        /* Controls moving a dialog around */
        //holde the current instance being resized		
        var resizable = null,
            //holds the staring left offset when resize starts.
            startingLeft = Number.Nan,
            //holds the staring width when resize starts.
            startingWidth = 0,
            //holds the initial width when resized for the first time.
            minWidth = 0,
            //holds the offset of the resize handle.
            handleOffset = 0
        ;

        /**
         * Helper: sets the element width/height and updates left coordinate if neccessary.
         *
         * @param {Event} event	DOM mousemove event object.
         * @param {Node} element The element being moved.
         * @param {Boolean} pinned A flag indicating if the element being resized is pinned to the screen.
         * 
         * @return {undefined}
         */
        function resizeElement(event, element, pageRelative) {

            //calculate offsets from 0,0
            var current = element;
            var offsetLeft = 0;
            var offsetTop = 0;
            do {
                offsetLeft += current.offsetLeft;
                offsetTop += current.offsetTop;
            } while (current = current.offsetParent);

            // determine X,Y coordinates.
            var X, Y;
            if (pageRelative === true) {
                X = event.pageX;
                Y = event.pageY;
            } else {
                X = event.clientX;
                Y = event.clientY;
            }
            // rtl handling
            var isRTL = isRightToLeft();
            if (isRTL) {
                // reverse X 
                X = document.body.offsetWidth - X;
                // if has a starting left, calculate offsetRight
                if (!isNaN(startingLeft)) {
                    offsetLeft = document.body.offsetWidth - offsetLeft - element.offsetWidth;
                }
            }

            // set width/height
            element.style.height = (Y - offsetTop + handleOffset) + 'px';
            element.style.width = (X - offsetLeft + handleOffset) + 'px';

            // if the element being resized has a starting left, maintain it.
            // the dialog is centered, divide by half the offset to maintain the margins.
            if (!isNaN(startingLeft)) {
                var diff = Math.abs(element.offsetWidth - startingWidth) * 0.5;
                if (isRTL) {
                    //negate the diff, why?
                    //when growing it should decrease left
                    //when shrinking it should increase left
                    diff *= -1;
                }
                if (element.offsetWidth > startingWidth) {
                    //growing
                    element.style.left = (startingLeft + diff) + 'px';
                } else if (element.offsetWidth >= minWidth) {
                    //shrinking
                    element.style.left = (startingLeft - diff) + 'px';
                }
            }
        }

        /**
         * Triggers the start of a resize event, attached to the resize handle element mouse down event.
         * Adds no-selection class to the body, disabling selection while moving.
         *
         * @param {Event} event	DOM event object.
         * @param {Object} instance The dilog instance.
         * 
         * @return {Boolean} false
         */
        function beginResize(event, instance) {
            if (!instance.isMaximized()) {
                var eventSrc;
                if (event.type === 'touchstart') {
                    event.preventDefault();
                    eventSrc = event.targetTouches[0];
                } else if (event.button === 0) {
                    eventSrc = event;
                }
                if (eventSrc) {
                    resizable = instance;
                    handleOffset = instance.elements.resizeHandle.offsetHeight / 2;
                    var element = instance.elements.dialog;
                    addClass(element, classes.capture);
                    startingLeft = parseInt(element.style.left, 10);
                    element.style.height = element.offsetHeight + 'px';
                    element.style.minHeight = instance.elements.header.offsetHeight + instance.elements.footer.offsetHeight + 'px';
                    element.style.width = (startingWidth = element.offsetWidth) + 'px';

                    if (element.style.maxWidth !== 'none') {
                        element.style.minWidth = (minWidth = element.offsetWidth) + 'px';
                    }
                    element.style.maxWidth = 'none';
                    addClass(document.body, classes.noSelection);
                    return false;
                }
            }
        }

        /**
         * The actual resize handler,  attached to document.body mousemove event.
         *
         * @param {Event} event	DOM event object.
         * 
         * @return {undefined}
         */
        function resize(event) {
            if (resizable) {
                var eventSrc;
                if (event.type === 'touchmove') {
                    event.preventDefault();
                    eventSrc = event.targetTouches[0];
                } else if (event.button === 0) {
                    eventSrc = event;
                }
                if (eventSrc) {
                    resizeElement(eventSrc, resizable.elements.dialog, !resizable.get('modal') && !resizable.get('pinned'));
                }
            }
        }

        /**
         * Triggers the end of a resize event,  attached to document.body mouseup event.
         * Removes no-selection class from document.body, allowing selection.
         *
         * @return {undefined}
         */
        function endResize() {
            if (resizable) {
                var element = resizable.elements.dialog;
                resizable = null;
                removeClass(document.body, classes.noSelection);
                removeClass(element, classes.capture);
                cancelClick = true;
            }
        }

        /**
         * Resets any changes made by resizing the element to its original state.
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function resetResize(instance) {
            resizable = null;
            var element = instance.elements.dialog;
            if (element.style.maxWidth === 'none') {
                //clear inline styles.
                element.style.maxWidth = element.style.minWidth = element.style.width = element.style.height = element.style.minHeight = element.style.left = '';
                //reset variables.
                startingLeft = Number.Nan;
                startingWidth = minWidth = handleOffset = 0;
            }
        }


        /**
         * Updates the dialog move behavior.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updateResizable(instance) {
            if (instance.get('resizable')) {
                // add class
                addClass(instance.elements.root, classes.resizable);
                if (instance.isOpen()) {
                    bindResizableEvents(instance);
                }
            } else {
                //reset
                resetResize(instance);
                // remove class
                removeClass(instance.elements.root, classes.resizable);
                if (instance.isOpen()) {
                    unbindResizableEvents(instance);
                }
            }
        }

        /**
         * Reset move/resize on window resize.
         *
         * @param {Event} event	window resize event object.
         *
         * @return {undefined}
         */
        function windowResize(/*event*/) {
            for (var x = 0; x < openDialogs.length; x += 1) {
                var instance = openDialogs[x];
                if (instance.get('autoReset')) {
                    resetMove(instance);
                    resetResize(instance);
                }
            }
        }
        /**
         * Bind dialogs events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindEvents(instance) {
            // if first dialog, hook global handlers
            if (openDialogs.length === 1) {
                //global
                on(window, 'resize', windowResize);
                on(document.body, 'keyup', keyupHandler);
                on(document.body, 'keydown', keydownHandler);
                on(document.body, 'focus', onReset);

                //move
                on(document.documentElement, 'mousemove', move);
                on(document.documentElement, 'touchmove', move);
                on(document.documentElement, 'mouseup', endMove);
                on(document.documentElement, 'touchend', endMove);
                //resize
                on(document.documentElement, 'mousemove', resize);
                on(document.documentElement, 'touchmove', resize);
                on(document.documentElement, 'mouseup', endResize);
                on(document.documentElement, 'touchend', endResize);
            }

            // common events
            on(instance.elements.commands.container, 'click', instance.__internal.commandsClickHandler);
            on(instance.elements.footer, 'click', instance.__internal.buttonsClickHandler);
            on(instance.elements.reset[0], 'focus', instance.__internal.resetHandler);
            on(instance.elements.reset[1], 'focus', instance.__internal.resetHandler);

            //prevent handling key up when dialog is being opened by a key stroke.
            cancelKeyup = true;
            // hook in transition handler
            on(instance.elements.dialog, transition.type, instance.__internal.transitionInHandler);

            // modelss only events
            if (!instance.get('modal')) {
                bindModelessEvents(instance);
            }

            // resizable
            if (instance.get('resizable')) {
                bindResizableEvents(instance);
            }

            // movable
            if (instance.get('movable')) {
                bindMovableEvents(instance);
            }
        }

        /**
         * Unbind dialogs events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindEvents(instance) {
            // if last dialog, remove global handlers
            if (openDialogs.length === 1) {
                //global
                off(window, 'resize', windowResize);
                off(document.body, 'keyup', keyupHandler);
                off(document.body, 'keydown', keydownHandler);
                off(document.body, 'focus', onReset);
                //move
                off(document.documentElement, 'mousemove', move);
                off(document.documentElement, 'mouseup', endMove);
                //resize
                off(document.documentElement, 'mousemove', resize);
                off(document.documentElement, 'mouseup', endResize);
            }

            // common events
            off(instance.elements.commands.container, 'click', instance.__internal.commandsClickHandler);
            off(instance.elements.footer, 'click', instance.__internal.buttonsClickHandler);
            off(instance.elements.reset[0], 'focus', instance.__internal.resetHandler);
            off(instance.elements.reset[1], 'focus', instance.__internal.resetHandler);

            // hook out transition handler
            on(instance.elements.dialog, transition.type, instance.__internal.transitionOutHandler);

            // modelss only events
            if (!instance.get('modal')) {
                unbindModelessEvents(instance);
            }

            // movable
            if (instance.get('movable')) {
                unbindMovableEvents(instance);
            }

            // resizable
            if (instance.get('resizable')) {
                unbindResizableEvents(instance);
            }

        }

        /**
         * Bind modeless specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindModelessEvents(instance) {
            on(instance.elements.dialog, 'focus', instance.__internal.bringToFrontHandler, true);
        }

        /**
         * Unbind modeless specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindModelessEvents(instance) {
            off(instance.elements.dialog, 'focus', instance.__internal.bringToFrontHandler, true);
        }



        /**
         * Bind movable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindMovableEvents(instance) {
            on(instance.elements.header, 'mousedown', instance.__internal.beginMoveHandler);
            on(instance.elements.header, 'touchstart', instance.__internal.beginMoveHandler);
        }

        /**
         * Unbind movable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindMovableEvents(instance) {
            off(instance.elements.header, 'mousedown', instance.__internal.beginMoveHandler);
            off(instance.elements.header, 'touchstart', instance.__internal.beginMoveHandler);
        }



        /**
         * Bind resizable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindResizableEvents(instance) {
            on(instance.elements.resizeHandle, 'mousedown', instance.__internal.beginResizeHandler);
            on(instance.elements.resizeHandle, 'touchstart', instance.__internal.beginResizeHandler);
        }

        /**
         * Unbind resizable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindResizableEvents(instance) {
            off(instance.elements.resizeHandle, 'mousedown', instance.__internal.beginResizeHandler);
            off(instance.elements.resizeHandle, 'touchstart', instance.__internal.beginResizeHandler);
        }

        /**
         * Bind closable events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindClosableEvents(instance) {
            on(instance.elements.modal, 'click', instance.__internal.modalClickHandler);
        }

        /**
         * Unbind closable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindClosableEvents(instance) {
            off(instance.elements.modal, 'click', instance.__internal.modalClickHandler);
        }
        // dialog API
        return {
            __init:initialize,
            /**
             * Check if dialog is currently open
             *
             * @return {Boolean}
             */
            isOpen: function () {
                return this.__internal.isOpen;
            },
            isModal: function (){
                return this.elements.root.className.indexOf(classes.modeless) < 0;
            },
            isMaximized:function(){
                return this.elements.root.className.indexOf(classes.maximized) > -1;
            },
            isPinned:function(){
                return this.elements.root.className.indexOf(classes.unpinned) < 0;
            },
            maximize:function(){
                if(!this.isMaximized()){
                    maximize(this);
                }
                return this;
            },
            restore:function(){
                if(this.isMaximized()){
                    restore(this);
                }
                return this;
            },
            pin:function(){
                if(!this.isPinned()){
                    pin(this);
                }
                return this;
            },
            unpin:function(){
                if(this.isPinned()){
                    unpin(this);
                }
                return this;
            },
            /**
             * Move the dialog to a specific x/y coordinates
             *
             * @param {Number} x    The new dialog x coordinate in pixels.
             * @param {Number} y    The new dialog y coordinate in pixels.
             *
             * @return {Object} The dialog instance.
             */
            moveTo:function(x,y){
                if(!isNaN(x) && !isNaN(y)){
                    var element = this.elements.dialog,
                        current = element,
                        offsetLeft = 0,
                        offsetTop = 0;
                    
                    //subtract existing left,top
                    if (element.style.left) {
                        offsetLeft -= parseInt(element.style.left, 10);
                    }
                    if (element.style.top) {
                        offsetTop -= parseInt(element.style.top, 10);
                    }
                    //calc offset
                    do {
                        offsetLeft += current.offsetLeft;
                        offsetTop += current.offsetTop;
                    } while (current = current.offsetParent);

                    //calc left, top
                    var left = (x - offsetLeft);
                    var top  = (y - offsetTop);

                    //// rtl handling
                    if (isRightToLeft()) {
                        left *= -1;
                    }

                    element.style.left = left + 'px';
                    element.style.top = top + 'px';
                }
                return this;
            },
            /**
             * Resize the dialog to a specific width/height (the dialog must be 'resizable').
             * The dialog can be resized to:
             *  A minimum width equal to the initial display width
             *  A minimum height equal to the sum of header/footer heights.
             *
             *
             * @param {Number or String} width    The new dialog width in pixels or in percent.
             * @param {Number or String} height   The new dialog height in pixels or in percent.
             *
             * @return {Object} The dialog instance.
             */
            resizeTo:function(width,height){
                var w = parseFloat(width),
                    h = parseFloat(height),
                    regex = /(\d*\.\d+|\d+)%/
                ;

                if(!isNaN(w) && !isNaN(h) && this.get('resizable') === true){

                    if(('' + width).match(regex)){
                        w = w / 100 * document.documentElement.clientWidth ;
                    }

                    if(('' + height).match(regex)){
                        h = h / 100 * document.documentElement.clientHeight;
                    }

                    var element = this.elements.dialog;
                    if (element.style.maxWidth !== 'none') {
                        element.style.minWidth = (minWidth = element.offsetWidth) + 'px';
                    }
                    element.style.maxWidth = 'none';
                    element.style.minHeight = this.elements.header.offsetHeight + this.elements.footer.offsetHeight + 'px';
                    element.style.width = w + 'px';
                    element.style.height = h + 'px';
                }
                return this;
            },
            /**
             * Gets or Sets dialog settings/options 
             *
             * @param {String|Object} key A string specifying a propery name or a collection of key/value pairs.
             * @param {Object} value Optional, the value associated with the key (in case it was a string).
             *
             * @return {undefined}
             */
            setting : function (key, value) {
                var self = this;
                var result = update(this, this.__internal.options, function(k,o,n){ optionUpdated(self,k,o,n); }, key, value);
                if(result.op === 'get'){
                    if(result.found){
                        return result.value;
                    }else if(typeof this.settings !== 'undefined'){
                        return update(this, this.settings, this.settingUpdated || function(){}, key, value).value;
                    }else{
                        return undefined;
                    }
                }else if(result.op === 'set'){
                    if(result.items.length > 0){
                        var callback = this.settingUpdated || function(){};
                        for(var x=0;x<result.items.length;x+=1){
                            var item = result.items[x];
                            if(!item.found && typeof this.settings !== 'undefined'){
                                update(this, this.settings, callback, item.key, item.value);
                            }
                        }
                    }
                    return this;
                }
            },
            /**
             * [Alias] Sets dialog settings/options 
             */
            set:function(key, value){
                this.setting(key,value);
                return this;
            },
            /**
             * [Alias] Gets dialog settings/options 
             */
            get:function(key){
                return this.setting(key);
            },
            /**
            * Sets dialog header
            * @content {string or element}
            *
            * @return {undefined}
            */
            setHeader:function(content){
                if(typeof content === 'string'){
                    clearContents(this.elements.header);
                    this.elements.header.innerHTML = content;
                }else if (content instanceof window.HTMLElement && this.elements.header.firstChild !== content){
                    clearContents(this.elements.header);
                    this.elements.header.appendChild(content);
                }
                return this;
            },
            /**
            * Sets dialog contents
            * @content {string or element}
            *
            * @return {undefined}
            */
            setContent:function(content){
                if(typeof content === 'string'){
                    clearContents(this.elements.content);
                    this.elements.content.innerHTML = content;
                }else if (content instanceof window.HTMLElement && this.elements.content.firstChild !== content){
                    clearContents(this.elements.content);
                    this.elements.content.appendChild(content);
                }
                return this;
            },
            /**
             * Show the dialog as modal
             *
             * @return {Object} the dialog instance.
             */
            showModal: function(className){
                return this.show(true, className);
            },
            /**
             * Show the dialog
             *
             * @return {Object} the dialog instance.
             */
            show: function (modal, className) {
                
                // ensure initialization
                initialize(this);
								
                if ( !this.__internal.isOpen ) {
					
                    // add to open dialogs
                    this.__internal.isOpen = true;
                    openDialogs.push(this);

                    // save last focused element
                    if(alertify.defaults.maintainFocus){
                        this.__internal.activeElement = document.activeElement;
                    }

                    //allow custom dom manipulation updates before showing the dialog.
                    if(typeof this.prepare === 'function'){
                        this.prepare();
                    }

                    bindEvents(this);

                    if(modal !== undefined){
                        this.set('modal', modal);
                    }
					
                    //save scroll to prevent document jump
                    saveScrollPosition();

                    ensureNoOverflow();
					
                    // allow custom dialog class on show
                    if(typeof className === 'string' && className !== ''){
                        this.__internal.className = className;
                        addClass(this.elements.root, className);
                    }

                    // maximize if start maximized
                    if ( this.get('startMaximized')) {
                        this.maximize();
                    }else if(this.isMaximized()){
                        restore(this);
                    }
					
                    updateAbsPositionFix(this);

                    removeClass(this.elements.root, classes.animationOut);
                    addClass(this.elements.root, classes.animationIn);

                    // set 1s fallback in case transition event doesn't fire
                    clearTimeout( this.__internal.timerIn);
                    this.__internal.timerIn = setTimeout( this.__internal.transitionInHandler, transition.supported ? 1000 : 100 );

                    if(isSafari){
                        // force desktop safari reflow
                        var root = this.elements.root;
                        root.style.display  = 'none';
                        setTimeout(function(){root.style.display  = 'block';}, 0);
                    }

                    //reflow
                    reflow = this.elements.root.offsetWidth;
                  
                    // show dialog
                    removeClass(this.elements.root, classes.hidden);

                    // internal on show event
                    if(typeof this.hooks.onshow === 'function'){
                        this.hooks.onshow.call(this);
                    }

                    // allow custom `onshow` method
                    if ( typeof this.get('onshow') === 'function' ) {
                        this.get('onshow').call(this);
                    }

                }else{
                    // reset move updates
                    resetMove(this);
                    // reset resize updates
                    resetResize(this);
                    // shake the dialog to indicate its already open
                    addClass(this.elements.dialog, classes.shake);
                    var self = this;
                    setTimeout(function(){
                        removeClass(self.elements.dialog, classes.shake);
                    },200);
                }
                return this;
            },
            /**
             * Close the dialog
             *
             * @return {Object} The dialog instance
             */
            close: function () {
                if (this.__internal.isOpen ) {
					
                    unbindEvents(this);
					
                    removeClass(this.elements.root, classes.animationIn);
                    addClass(this.elements.root, classes.animationOut);

                    // set 1s fallback in case transition event doesn't fire
                    clearTimeout( this.__internal.timerOut );
                    this.__internal.timerOut = setTimeout( this.__internal.transitionOutHandler, transition.supported ? 1000 : 100 );
                    // hide dialog
                    addClass(this.elements.root, classes.hidden);
                    //reflow
                    reflow = this.elements.modal.offsetWidth;

                    // remove custom dialog class on hide
                    if (typeof this.__internal.className !== 'undefined' && this.__internal.className !== '') {
                        removeClass(this.elements.root, this.__internal.className);
                    }

                    // internal on close event
                    if(typeof this.hooks.onclose === 'function'){
                        this.hooks.onclose.call(this);
                    }

                    // allow custom `onclose` method
                    if ( typeof this.get('onclose') === 'function' ) {
                        this.get('onclose').call(this);
                    }
					
                    //remove from open dialogs               
                    openDialogs.splice(openDialogs.indexOf(this),1);
                    this.__internal.isOpen = false;
					
                    ensureNoOverflow();
					
                }
                return this;
            },
            /**
             * Close all open dialogs except this.
             *
             * @return {undefined}
             */
            closeOthers:function(){
                alertify.closeAll(this);
                return this;
            }
        };
	} () );
    var notifier = (function () {
        var reflow,
            element,
            openInstances = [],
            classes = {
                base: 'alertify-notifier',
                message: 'ajs-message',
                top: 'ajs-top',
                right: 'ajs-right',
                bottom: 'ajs-bottom',
                left: 'ajs-left',
                visible: 'ajs-visible',
                hidden: 'ajs-hidden'
            };
        /**
         * Helper: initializes the notifier instance
         * 
         */
        function initialize(instance) {

            if (!instance.__internal) {
                instance.__internal = {
                    position: alertify.defaults.notifier.position,
                    delay: alertify.defaults.notifier.delay,
                };

                element = document.createElement('DIV');

                updatePosition(instance);
            }

            //add to DOM tree.
            if (element.parentNode !== document.body) {
                document.body.appendChild(element);
            }
        }
        
        function pushInstance(instance) {
            instance.__internal.pushed = true;
            openInstances.push(instance);
        }
        function popInstance(instance) {
            openInstances.splice(openInstances.indexOf(instance), 1);
            instance.__internal.pushed = false;
        }
        /**
         * Helper: update the notifier instance position
         * 
         */
        function updatePosition(instance) {
            element.className = classes.base;
            switch (instance.__internal.position) {
            case 'top-right':
                addClass(element, classes.top + ' ' + classes.right);
                break;
            case 'top-left':
                addClass(element, classes.top + ' ' + classes.left);
                break;
            case 'bottom-left':
                addClass(element, classes.bottom + ' ' + classes.left);
                break;

            default:
            case 'bottom-right':
                addClass(element, classes.bottom + ' ' + classes.right);
                break;
            }
        }

        /**
        * creates a new notification message
        *
        * @param  {DOMElement} message	The notifier message element
        * @param  {Number} wait   Time (in ms) to wait before the message is dismissed, a value of 0 means keep open till clicked.
        * @param  {Function} callback A callback function to be invoked when the message is dismissed.
        *
        * @return {undefined}
        */
        function create(div, callback) {

            function clickDelegate(event, instance) {
                instance.dismiss(true);
            }

            function transitionDone(event, instance) {
                // unbind event
                off(instance.element, transition.type, transitionDone);
                // remove the message
                element.removeChild(instance.element);
            }

            function initialize(instance) {
                if (!instance.__internal) {
                    instance.__internal = {
                        pushed: false,
                        delay : undefined,
                        timer: undefined,
                        clickHandler: undefined,
                        transitionEndHandler: undefined,
                        transitionTimeout: undefined
                    };
                    instance.__internal.clickHandler = delegate(instance, clickDelegate);
                    instance.__internal.transitionEndHandler = delegate(instance, transitionDone);
                }
                return instance;
            }
            function clearTimers(instance) {
                clearTimeout(instance.__internal.timer);
                clearTimeout(instance.__internal.transitionTimeout);
            }
            return initialize({
                /* notification DOM element*/
                element: div,
                /*
                 * Pushes a notification message 
                 * @param {string or DOMElement} content The notification message content
                 * @param {Number} wait The time (in seconds) to wait before the message is dismissed, a value of 0 means keep open till clicked.
                 * 
                 */
                push: function (_content, _wait) {
                    if (!this.__internal.pushed) {

                        pushInstance(this);
                        clearTimers(this);

                        var content, wait;
                        switch (arguments.length) {
                        case 0:
                            wait = this.__internal.delay;
                            break;
                        case 1:
                            if (typeof (_content) === 'number') {
                                wait = _content;
                            } else {
                                content = _content;
                                wait = this.__internal.delay;
                            }
                            break;
                        case 2:
                            content = _content;
                            wait = _wait;
                            break;
                        }
                        // set contents
                        if (typeof content !== 'undefined') {
                            this.setContent(content);
                        }
                        // append or insert
                        if (notifier.__internal.position.indexOf('top') < 0) {
                            element.appendChild(this.element);
                        } else {
                            element.insertBefore(this.element, element.firstChild);
                        }
                        reflow = this.element.offsetWidth;
                        addClass(this.element, classes.visible);
                        // attach click event
                        on(this.element, 'click', this.__internal.clickHandler);
                        return this.delay(wait);
                    }
                    return this;
                },
                /*
                 * {Function} callback function to be invoked before dismissing the notification message.
                 * Remarks: A return value === 'false' will cancel the dismissal
                 * 
                 */
                ondismiss: function () { },
                /*
                 * {Function} callback function to be invoked when the message is dismissed.
                 * 
                 */
                callback: callback,
                /*
                 * Dismisses the notification message 
                 * @param {Boolean} clicked A flag indicating if the dismissal was caused by a click.
                 * 
                 */
                dismiss: function (clicked) {
                    if (this.__internal.pushed) {
                        clearTimers(this);
                        if (!(typeof this.ondismiss === 'function' && this.ondismiss.call(this) === false)) {
                            //detach click event
                            off(this.element, 'click', this.__internal.clickHandler);
                            // ensure element exists
                            if (typeof this.element !== 'undefined' && this.element.parentNode === element) {
                                //transition end or fallback
                                this.__internal.transitionTimeout = setTimeout(this.__internal.transitionEndHandler, transition.supported ? 1000 : 100);
                                removeClass(this.element, classes.visible);

                                // custom callback on dismiss
                                if (typeof this.callback === 'function') {
                                    this.callback.call(this, clicked);
                                }
                            }
                            popInstance(this);
                        }
                    }
                    return this;
                },
                /*
                 * Delays the notification message dismissal
                 * @param {Number} wait The time (in seconds) to wait before the message is dismissed, a value of 0 means keep open till clicked.
                 * 
                 */
                delay: function (wait) {
                    clearTimers(this);
                    this.__internal.delay = typeof wait !== 'undefined' && !isNaN(+wait) ? +wait : notifier.__internal.delay;
                    if (this.__internal.delay > 0) {
                        var  self = this;
                        this.__internal.timer = setTimeout(function () { self.dismiss(); }, this.__internal.delay * 1000);
                    }
                    return this;
                },
                /*
                 * Sets the notification message contents
                 * @param {string or DOMElement} content The notification message content
                 * 
                 */
                setContent: function (content) {
                    if (typeof content === 'string') {
                        clearContents(this.element);
                        this.element.innerHTML = content;
                    } else if (content instanceof window.HTMLElement && this.element.firstChild !== content) {
                        clearContents(this.element);
                        this.element.appendChild(content);
                    }
                    return this;
                },
                /*
                 * Dismisses all open notifications except this.
                 * 
                 */
                dismissOthers: function () {
                    notifier.dismissAll(this);
                    return this;
                }
            });
        }

        //notifier api
        return {
            /**
             * Gets or Sets notifier settings. 
             *
             * @param {string} key The setting name
             * @param {Variant} value The setting value.
             *
             * @return {Object}	if the called as a setter, return the notifier instance.
             */
            setting: function (key, value) {
                //ensure init
                initialize(this);

                if (typeof value === 'undefined') {
                    //get
                    return this.__internal[key];
                } else {
                    //set
                    switch (key) {
                    case 'position':
                        this.__internal.position = value;
                        updatePosition(this);
                        break;
                    case 'delay':
                        this.__internal.delay = value;
                        break;
                    }
                }
                return this;
            },
            /**
             * [Alias] Sets dialog settings/options 
             */
            set:function(key,value){
                this.setting(key,value);
                return this;
            },
            /**
             * [Alias] Gets dialog settings/options 
             */
            get:function(key){
                return this.setting(key);
            },
            /**
             * Creates a new notification message
             *
             * @param {string} type The type of notification message (simply a CSS class name 'ajs-{type}' to be added).
             * @param {Function} callback  A callback function to be invoked when the message is dismissed.
             *
             * @return {undefined}
             */
            create: function (type, callback) {
                //ensure notifier init
                initialize(this);
                //create new notification message
                var div = document.createElement('div');
                div.className = classes.message + ((typeof type === 'string' && type !== '') ? ' ajs-' + type : '');
                return create(div, callback);
            },
            /**
             * Dismisses all open notifications.
             *
             * @param {Object} excpet [optional] The notification object to exclude from dismissal.
             *
             */
            dismissAll: function (except) {
                var clone = openInstances.slice(0);
                for (var x = 0; x < clone.length; x += 1) {
                    var  instance = clone[x];
                    if (except === undefined || except !== instance) {
                        instance.dismiss();
                    }
                }
            }
        };
    })();
    /**
     * Alertify public API
     * This contains everything that is exposed through the alertify object.
     *
     * @return {Object}
     */
    function Alertify() {

        // holds a references of created dialogs
        var dialogs = {};

        /**
         * Extends a given prototype by merging properties from base into sub.
         *
         * @sub {Object} sub The prototype being overwritten.
         * @base {Object} base The prototype being written.
         *
         * @return {Object} The extended prototype.
         */
        function extend(sub, base) {
            // copy dialog pototype over definition.
            for (var prop in base) {
                if (base.hasOwnProperty(prop)) {
                    sub[prop] = base[prop];
                }
            }
            return sub;
        }


        /**
        * Helper: returns a dialog instance from saved dialogs.
        * and initializes the dialog if its not already initialized.
        *
        * @name {String} name The dialog name.
        *
        * @return {Object} The dialog instance.
        */
        function get_dialog(name) {
            var dialog = dialogs[name].dialog;
            //initialize the dialog if its not already initialized.
            if (dialog && typeof dialog.__init === 'function') {
                dialog.__init(dialog);
            }
            return dialog;
        }

        /**
         * Helper:  registers a new dialog definition.
         *
         * @name {String} name The dialog name.
         * @Factory {Function} Factory a function resposible for creating dialog prototype.
         * @transient {Boolean} transient True to create a new dialog instance each time the dialog is invoked, false otherwise.
         * @base {String} base the name of another dialog to inherit from.
         *
         * @return {Object} The dialog definition.
         */
        function register(name, Factory, transient, base) {
            var definition = {
                dialog: null,
                factory: Factory
            };

            //if this is based on an existing dialog, create a new definition
            //by applying the new protoype over the existing one.
            if (base !== undefined) {
                definition.factory = function () {
                    return extend(new dialogs[base].factory(), new Factory());
                };
            }

            if (!transient) {
                //create a new definition based on dialog
                definition.dialog = extend(new definition.factory(), dialog);
            }
            return dialogs[name] = definition;
        }

        return {
            /**
             * Alertify defaults
             * 
             * @type {Object}
             */
            defaults: defaults,
            /**
             * Dialogs factory 
             *
             * @param {string}      Dialog name.
             * @param {Function}    A Dialog factory function.
             * @param {Boolean}     Indicates whether to create a singleton or transient dialog.
             * @param {String}      The name of the base type to inherit from.
             */
            dialog: function (name, Factory, transient, base) {

                // get request, create a new instance and return it.
                if (typeof Factory !== 'function') {
                    return get_dialog(name);
                }

                if (this.hasOwnProperty(name)) {
                    throw new Error('alertify.dialog: name already exists');
                }

                // register the dialog
                var definition = register(name, Factory, transient, base);

                if (transient) {

                    // make it public
                    this[name] = function () {
                        //if passed with no params, consider it a get request
                        if (arguments.length === 0) {
                            return definition.dialog;
                        } else {
                            var instance = extend(new definition.factory(), dialog);
                            //ensure init
                            if (instance && typeof instance.__init === 'function') {
                                instance.__init(instance);
                            }
                            instance['main'].apply(instance, arguments);
                            return instance['show'].apply(instance);
                        }
                    };
                } else {
                    // make it public
                    this[name] = function () {
                        //ensure init
                        if (definition.dialog && typeof definition.dialog.__init === 'function') {
                            definition.dialog.__init(definition.dialog);
                        }
                        //if passed with no params, consider it a get request
                        if (arguments.length === 0) {
                            return definition.dialog;
                        } else {
                            var dialog = definition.dialog;
                            dialog['main'].apply(definition.dialog, arguments);
                            return dialog['show'].apply(definition.dialog);
                        }
                    };
                }
            },
            /**
             * Close all open dialogs.
             *
             * @param {Object} excpet [optional] The dialog object to exclude from closing.
             *
             * @return {undefined}
             */
            closeAll: function (except) {
                var clone = openDialogs.slice(0);
                for (var x = 0; x < clone.length; x += 1) {
                    var instance = clone[x];
                    if (except === undefined || except !== instance) {
                        instance.close();
                    }
                }
            },
            /**
             * Gets or Sets dialog settings/options. if the dialog is transient, this call does nothing.
             *
             * @param {string} name The dialog name.
             * @param {String|Object} key A string specifying a propery name or a collection of key/value pairs.
             * @param {Variant} value Optional, the value associated with the key (in case it was a string).
             *
             * @return {undefined}
             */
            setting: function (name, key, value) {

                if (name === 'notifier') {
                    return notifier.setting(key, value);
                }

                var dialog = get_dialog(name);
                if (dialog) {
                    return dialog.setting(key, value);
                }
            },
            /**
             * [Alias] Sets dialog settings/options 
             */
            set: function(name,key,value){
                return this.setting(name, key,value);
            },
            /**
             * [Alias] Gets dialog settings/options 
             */
            get: function(name, key){
                return this.setting(name, key);
            },
            /**
             * Creates a new notification message.
             * If a type is passed, a class name "ajs-{type}" will be added.
             * This allows for custom look and feel for various types of notifications.
             *
             * @param  {String | DOMElement}    [message=undefined]		Message text
             * @param  {String}                 [type='']				Type of log message
             * @param  {String}                 [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}               [callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            notify: function (message, type, wait, callback) {
                return notifier.create(type, callback).push(message, wait);
            },
            /**
             * Creates a new notification message.
             *
             * @param  {String}		[message=undefined]		Message text
             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            message: function (message, wait, callback) {
                return notifier.create(null, callback).push(message, wait);
            },
            /**
             * Creates a new notification message of type 'success'.
             *
             * @param  {String}		[message=undefined]		Message text
             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            success: function (message, wait, callback) {
                return notifier.create('success', callback).push(message, wait);
            },
            /**
             * Creates a new notification message of type 'error'.
             *
             * @param  {String}		[message=undefined]		Message text
             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            error: function (message, wait, callback) {
                return notifier.create('error', callback).push(message, wait);
            },
            /**
             * Creates a new notification message of type 'warning'.
             *
             * @param  {String}		[message=undefined]		Message text
             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            warning: function (message, wait, callback) {
                return notifier.create('warning', callback).push(message, wait);
            },
            /**
             * Dismisses all open notifications
             *
             * @return {undefined}
             */
            dismissAll: function () {
                notifier.dismissAll();
            }
        };
    }
    var alertify = new Alertify();

    /**
    * Alert dialog definition
    *
    * invoked by:
    *	alertify.alert(message);
    *	alertify.alert(title, message);
    *	alertify.alert(message, onok);
    *	alertify.alert(title, message, onok);
     */
    alertify.dialog('alert', function () {
        return {
            main: function (_title, _message, _onok) {
                var title, message, onok;
                switch (arguments.length) {
                case 1:
                    message = _title;
                    break;
                case 2:
                    if (typeof _message === 'function') {
                        message = _title;
                        onok = _message;
                    } else {
                        title = _title;
                        message = _message;
                    }
                    break;
                case 3:
                    title = _title;
                    message = _message;
                    onok = _onok;
                    break;
                }
                this.set('title', title);
                this.set('message', message);
                this.set('onok', onok);
                return this;
            },
            setup: function () {
                return {
                    buttons: [
                        {
                            text: alertify.defaults.glossary.ok,
                            key: keys.ESC,
                            invokeOnClose: true,
                            className: alertify.defaults.theme.ok,
                        }
                    ],
                    focus: {
                        element: 0,
                        select: false
                    },
                    options: {
                        maximizable: false,
                        resizable: false
                    }
                };
            },
            build: function () {
                // nothing
            },
            prepare: function () {
                //nothing
            },
            setMessage: function (message) {
                this.setContent(message);
            },
            settings: {
                message: undefined,
                onok: undefined,
                label: undefined,
            },
            settingUpdated: function (key, oldValue, newValue) {
                switch (key) {
                case 'message':
                    this.setMessage(newValue);
                    break;
                case 'label':
                    if (this.__internal.buttons[0].element) {
                        this.__internal.buttons[0].element.innerHTML = newValue;
                    }
                    break;
                }
            },
            callback: function (closeEvent) {
                if (typeof this.get('onok') === 'function') {
                    var returnValue = this.get('onok').call(this, closeEvent);
                    if (typeof returnValue !== 'undefined') {
                        closeEvent.cancel = !returnValue;
                    }
                }
            }
        };
    });
    /**
     * Confirm dialog object
     *
     *	alertify.confirm(message);
     *	alertify.confirm(message, onok);
     *	alertify.confirm(message, onok, oncancel);
     *	alertify.confirm(title, message, onok, oncancel);
     */
    alertify.dialog('confirm', function () {

        var autoConfirm = {
            timer: null,
            index: null,
            text: null,
            duration: null,
            task: function (event, self) {
                if (self.isOpen()) {
                    self.__internal.buttons[autoConfirm.index].element.innerHTML = autoConfirm.text + ' (&#8207;' + autoConfirm.duration + '&#8207;) ';
                    autoConfirm.duration -= 1;
                    if (autoConfirm.duration === -1) {
                        clearAutoConfirm(self);
                        var button = self.__internal.buttons[autoConfirm.index];
                        var closeEvent = createCloseEvent(autoConfirm.index, button);

                        if (typeof self.callback === 'function') {
                            self.callback.apply(self, [closeEvent]);
                        }
                        //close the dialog.
                        if (closeEvent.close !== false) {
                            self.close();
                        }
                    }
                } else {
                    clearAutoConfirm(self);
                }
            }
        };

        function clearAutoConfirm(self) {
            if (autoConfirm.timer !== null) {
                clearInterval(autoConfirm.timer);
                autoConfirm.timer = null;
                self.__internal.buttons[autoConfirm.index].element.innerHTML = autoConfirm.text;
            }
        }

        function startAutoConfirm(self, index, duration) {
            clearAutoConfirm(self);
            autoConfirm.duration = duration;
            autoConfirm.index = index;
            autoConfirm.text = self.__internal.buttons[index].element.innerHTML;
            autoConfirm.timer = setInterval(delegate(self, autoConfirm.task), 1000);
            autoConfirm.task(null, self);
        }


        return {
            main: function (_title, _message, _onok, _oncancel) {
                var title, message, onok, oncancel;
                switch (arguments.length) {
                case 1:
                    message = _title;
                    break;
                case 2:
                    message = _title;
                    onok = _message;
                    break;
                case 3:
                    message = _title;
                    onok = _message;
                    oncancel = _onok;
                    break;
                case 4:
                    title = _title;
                    message = _message;
                    onok = _onok;
                    oncancel = _oncancel;
                    break;
                }
                this.set('title', title);
                this.set('message', message);
                this.set('onok', onok);
                this.set('oncancel', oncancel);
                return this;
            },
            setup: function () {
                return {
                    buttons: [
                        {
                            text: alertify.defaults.glossary.ok,
                            key: keys.ENTER,
                            className: alertify.defaults.theme.ok,
                        },
                        {
                            text: alertify.defaults.glossary.cancel,
                            key: keys.ESC,
                            invokeOnClose: true,
                            className: alertify.defaults.theme.cancel,
                        }
                    ],
                    focus: {
                        element: 0,
                        select: false
                    },
                    options: {
                        maximizable: false,
                        resizable: false
                    }
                };
            },
            build: function () {
                //nothing
            },
            prepare: function () {
                //nothing
            },
            setMessage: function (message) {
                this.setContent(message);
            },
            settings: {
                message: null,
                labels: null,
                onok: null,
                oncancel: null,
                defaultFocus: null,
                reverseButtons: null,
            },
            settingUpdated: function (key, oldValue, newValue) {
                switch (key) {
                case 'message':
                    this.setMessage(newValue);
                    break;
                case 'labels':
                    if ('ok' in newValue && this.__internal.buttons[0].element) {
                        this.__internal.buttons[0].text = newValue.ok;
                        this.__internal.buttons[0].element.innerHTML = newValue.ok;
                    }
                    if ('cancel' in newValue && this.__internal.buttons[1].element) {
                        this.__internal.buttons[1].text = newValue.cancel;
                        this.__internal.buttons[1].element.innerHTML = newValue.cancel;
                    }
                    break;
                case 'reverseButtons':
                    if (newValue === true) {
                        this.elements.buttons.primary.appendChild(this.__internal.buttons[0].element);
                    } else {
                        this.elements.buttons.primary.appendChild(this.__internal.buttons[1].element);
                    }
                    break;
                case 'defaultFocus':
                    this.__internal.focus.element = newValue === 'ok' ? 0 : 1;
                    break;
                }
            },
            callback: function (closeEvent) {
                clearAutoConfirm(this);
                var returnValue;
                switch (closeEvent.index) {
                case 0:
                    if (typeof this.get('onok') === 'function') {
                        returnValue = this.get('onok').call(this, closeEvent);
                        if (typeof returnValue !== 'undefined') {
                            closeEvent.cancel = !returnValue;
                        }
                    }
                    break;
                case 1:
                    if (typeof this.get('oncancel') === 'function') {
                        returnValue = this.get('oncancel').call(this, closeEvent);
                        if (typeof returnValue !== 'undefined') {
                            closeEvent.cancel = !returnValue;
                        }
                    }
                    break;
                }
            },
            autoOk: function (duration) {
                startAutoConfirm(this, 0, duration);
                return this;
            },
            autoCancel: function (duration) {
                startAutoConfirm(this, 1, duration);
                return this;
            }
        };
    });
    /**
     * Prompt dialog object
     *
     * invoked by:
     *	alertify.prompt(message);
     *	alertify.prompt(message, value);
     *	alertify.prompt(message, value, onok);
     *	alertify.prompt(message, value, onok, oncancel);
     *	alertify.prompt(title, message, value, onok, oncancel);
     */
    alertify.dialog('prompt', function () {
        var input = document.createElement('INPUT');
        var p = document.createElement('P');
        return {
            main: function (_title, _message, _value, _onok, _oncancel) {
                var title, message, value, onok, oncancel;
                switch (arguments.length) {
                case 1:
                    message = _title;
                    break;
                case 2:
                    message = _title;
                    value = _message;
                    break;
                case 3:
                    message = _title;
                    value = _message;
                    onok = _value;
                    break;
                case 4:
                    message = _title;
                    value = _message;
                    onok = _value;
                    oncancel = _onok;
                    break;
                case 5:
                    title = _title;
                    message = _message;
                    value = _value;
                    onok = _onok;
                    oncancel = _oncancel;
                    break;
                }
                this.set('title', title);
                this.set('message', message);
                this.set('value', value);
                this.set('onok', onok);
                this.set('oncancel', oncancel);
                return this;
            },
            setup: function () {
                return {
                    buttons: [
                        {
                            text: alertify.defaults.glossary.ok,
                            key: keys.ENTER,
                            className: alertify.defaults.theme.ok,
                        },
                        {
                            text: alertify.defaults.glossary.cancel,
                            key: keys.ESC,
                            invokeOnClose: true,
                            className: alertify.defaults.theme.cancel,
                        }
                    ],
                    focus: {
                        element: input,
                        select: true
                    },
                    options: {
                        maximizable: false,
                        resizable: false
                    }
                };
            },
            build: function () {
                input.className = alertify.defaults.theme.input;
                input.setAttribute('type', 'text');
                input.value = this.get('value');
                this.elements.content.appendChild(p);
                this.elements.content.appendChild(input);
            },
            prepare: function () {
                //nothing
            },
            setMessage: function (message) {
                if (typeof message === 'string') {
                    clearContents(p);
                    p.innerHTML = message;
                } else if (message instanceof window.HTMLElement && p.firstChild !== message) {
                    clearContents(p);
                    p.appendChild(message);
                }
            },
            settings: {
                message: undefined,
                labels: undefined,
                onok: undefined,
                oncancel: undefined,
                value: '',
                type:'text',
                reverseButtons: undefined,
            },
            settingUpdated: function (key, oldValue, newValue) {
                switch (key) {
                case 'message':
                    this.setMessage(newValue);
                    break;
                case 'value':
                    input.value = newValue;
                    break;
                case 'type':
                    switch (newValue) {
                    case 'text':
                    case 'color':
                    case 'date':
                    case 'datetime-local':
                    case 'email':
                    case 'month':
                    case 'number':
                    case 'password':
                    case 'search':
                    case 'tel':
                    case 'time':
                    case 'week':
                        input.type = newValue;
                        break;
                    default:
                        input.type = 'text';
                        break;
                    }
                    break;
                case 'labels':
                    if (newValue.ok && this.__internal.buttons[0].element) {
                        this.__internal.buttons[0].element.innerHTML = newValue.ok;
                    }
                    if (newValue.cancel && this.__internal.buttons[1].element) {
                        this.__internal.buttons[1].element.innerHTML = newValue.cancel;
                    }
                    break;
                case 'reverseButtons':
                    if (newValue === true) {
                        this.elements.buttons.primary.appendChild(this.__internal.buttons[0].element);
                    } else {
                        this.elements.buttons.primary.appendChild(this.__internal.buttons[1].element);
                    }
                    break;
                }
            },
            callback: function (closeEvent) {
                var returnValue;
                switch (closeEvent.index) {
                case 0:
                    this.settings.value = input.value;
                    if (typeof this.get('onok') === 'function') {
                        returnValue = this.get('onok').call(this, closeEvent, this.settings.value);
                        if (typeof returnValue !== 'undefined') {
                            closeEvent.cancel = !returnValue;
                        }
                    }
                    break;
                case 1:
                    if (typeof this.get('oncancel') === 'function') {
                        returnValue = this.get('oncancel').call(this, closeEvent);
                        if (typeof returnValue !== 'undefined') {
                            closeEvent.cancel = !returnValue;
                        }
                    }
                    break;
                }
            }
        };
    });

    // CommonJS
    if ( typeof module === 'object' && typeof module.exports === 'object' ) {
        module.exports = alertify;
    // AMD
    } else if ( typeof define === 'function' && define.amd) {
        define( [], function () {
            return alertify;
        } );
    // window
    } else if ( !window.alertify ) {
        window.alertify = alertify;
    }

} ( typeof window !== 'undefined' ? window : this ) );

},{}],11:[function(require,module,exports){
//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function isFunction (sth) {
        // https://github.com/moment/moment/issues/2325
        return typeof sth === 'function' &&
            Object.prototype.toString.call(sth) === '[object Function]';
    }


    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    config._f = isoDates[i][0];
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    // match[6] should be 'T' or space
                    config._f += (match[6] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear, janX = createUTCDate(year, 0, 1 + week1Jan), d = janX.getUTCDay(), dayOfYear;
        if (d < firstDayOfWeek) {
            d += 7;
        }

        weekday = weekday != null ? 1 * weekday : firstDayOfWeek;

        dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             return other < this ? this : other;
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (typeof this._isDSTShifted !== 'undefined') {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        this._weekdaysParse = this._weekdaysParse || [];

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.to           = to;
    momentPrototype__proto.toNow        = toNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toObject     = toObject;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes === 1          && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   === 1          && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    === 1          && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  === 1          && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.6';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}],12:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],13:[function(require,module,exports){
(function (process){
"use strict";

var sockception

;(function(module, require){
    var ws = require("ws")

    sockception = module.exports

    sockception.impl = {}
    var impl = sockception.impl

    impl.idGen = function(prefix) {
        var count = 0
        return function() {
            return prefix + count++
        }
    }

    sockception.impl.initRoute = function(routes, routePath) {
        var ret = routes

        var i = 0
        var next

        while (i < routePath.length) {
            next = ret.children[routePath[i]]
            if (!next) {
                break
            }
            ret = next
            i++
        }

        while (i < routePath.length) {
            next = {children: {}}
            ret.children[routePath[i]] = next
            ret = next
            i++
        }

        ret.value = ret.value || {}
        ret = ret.value

        return ret
    }

    sockception.impl.getRoute = function(routes, routePath) {
        var ret = routes

        var i = 0
        var next

        while (i < routePath.length) {
            next = ret.children[routePath[i]]
            if (!next) {
                return undefined
            }
            ret = next
            i++
        }

        ret = ret.value

        return ret
    }

    sockception.impl.lazyCall = function(f) {
        var set = false
        var value
        return function() {
            if (set) {
                return value
            } else {
                return f()
            }
        }
    }

    sockception.fromPrefixAndTransport = function(prefix, transport, log) {
        log = log || {}
        log.debug = log.debug || function() {}
        log.info = log.info || function() {}
        log.error = log.error || function() {}

        var factory = {
            routes: {
                children: {}
            },
            idGen: impl.idGen(prefix),
            transport: transport,
            closeHandlers: [],
            create: function(routePath, value) {
                var socket = {
                    impl: {
                        factory: factory,
                        routePath: routePath,
                        route: sockception.impl.lazyCall(function() {
                            return sockception.impl.initRoute(factory.routes, routePath)
                        })
                    },
                    value: value,
                    send: function(value) {
                        var impl = socket.impl
                        var factory = impl.factory
                        var subsocket = factory.create([factory.idGen()], null)
                        var sendObj = [impl.routePath, subsocket.impl.routePath, value]
                        var sendStr = JSON.stringify(sendObj)
                        log.debug("Sending: " + sendStr)
                        factory.transport.send(sendStr)

                        return subsocket
                    },
                    receiveOne: function(cb) {
                        socket.impl.route().handler = function(s) {
                            cb(s)
                            delete socket.impl.route().handler // TODO: delete socket.impl.route() too
                        }
                    },
                    receiveMany: function(cb) {
                        socket.impl.route().handler = function(s) {
                            cb(s, function() {
                                delete socket.impl.route().handler // TODO: delete socket.impl.route() too
                            })
                        }
                    },
                    route: function(routeItem) { // TODO: should this be making duplicates of routes like this? should work fine...
                        var impl = socket.impl
                        var newRoutePath = impl.routePath.slice()
                        newRoutePath.push(routeItem)
                        return impl.factory.create(newRoutePath, null)
                    },
                    multiRoute: function(routeReceivers) { // TODO: test, multiRouteOne?
                        for (var routeItem in routeReceivers) {
                            socket.route(routeItem).receiveMany(routeReceivers[routeItem])
                        }
                    },
                    onclose: function(cb) {
                        socket.impl.factory.closeHandlers.push(cb)
                    }
                }

                return socket
            }
        }

        transport.receive(function(str) {
            log.debug("Received: " + str)
            var parsed = JSON.parse(str)

            var route = sockception.impl.getRoute(factory.routes, parsed[0])

            if (!route) {
                log.error("Route not set: " + JSON.stringify(parsed[0])) // TODO: inform other end?
                return
            }

            if (!route || !route.handler) {
                log.error("Route but no handler for: " + JSON.stringify(parsed[0])) // TODO: inform other end?
                return
            }

            route.handler(factory.create(parsed[1], parsed[2]))
        })

        var firstSock = factory.create(["0"], null)

        var closed = false

        firstSock.close = function() {
            if (!closed) {
                transport.close()
            }
        }

        transport.onclose(function() {
            closed = true
            factory.closeHandlers.forEach(function(handler) {
                handler()
            })
        })

        return firstSock
    }

    impl.transportPair = function() {
        var transports = {
            a: {
                impl: {
                    handler: function() {},
                    closeHandler: function() {}
                },
                send: function(msg) {
                    process.nextTick(function() { // TODO: browser compatibility
                        transports.b.impl.handler(msg)
                    })
                },
                close: function() {
                    process.nextTick(function() {
                        transports.a.impl.closeHandler()
                        transports.b.impl.closeHandler()
                    })
                },
                receive: function(handler) {
                    transports.a.impl.handler = handler
                },
                onclose: function(handler) {
                    transports.a.impl.closeHandler = handler
                }
            },
            b: {
                impl: {
                    handler: function() {},
                    closeHandler: function() {}
                },
                send: function(msg) {
                    process.nextTick(function() {
                        transports.a.impl.handler(msg)
                    })
                },
                close: function() {
                    process.nextTick(function() {
                        transports.b.impl.closeHandler()
                        transports.a.impl.closeHandler()
                    })
                },
                receive: function(handler) {
                    transports.b.impl.handler = handler
                },
                onclose: function(handler) {
                    transports.b.impl.closeHandler = handler
                }
            }
        }

        return transports
    }

    sockception.pair = function() {
        var pair = impl.transportPair()

        return {
            a: sockception.fromPrefixAndTransport("a", pair.a),
            b: sockception.fromPrefixAndTransport("b", pair.b)
        }
    }

    sockception.listen = function(opt) {
        if (!ws) {
            throw new Error("Websocket server not supported in this environment")
        }

        var wss = new ws.Server({port: opt.port})

        var sockHandler = function() {}

        wss.on("connection", function(websock) {
            var handler = function() {} // TODO: timeout queues?

            websock.on("message", function(msg) {
                handler(msg.toString())
            })

            sockHandler(sockception.fromPrefixAndTransport(
                "s",
                {
                    send: function(s) {
                        websock.send(s, function(error) {
                            if (error && opt.log && opt.log.error) {
                                opt.log.error("ws: " + error)
                            }
                        })
                    },
                    close: function() { websock.close() }, // TODO: test
                    receive: function(cb) {
                        websock.onmessage = function(msg) {
                            cb(msg.data.toString())
                        }
                    },
                    onclose: function(cb) { websock.onclose = cb } // TODO: test
                },
                opt.log))
        })

        return {
            receiveMany: function(handler) {
                sockHandler = handler
            },
            close: function() { wss.close() }
        }
    }

    impl.clientWebsocketTransport = (
        ws ?
        function(addr, log) {
            var sock = new ws(addr)

            return {
                send: function(msg) {
                    sock.send(msg, function(error) {
                        if (error) {
                            log.error("ws: " + error)
                        }
                    })
                },
                close: function() { sock.close() },
                receive: function(cb) { sock.onmessage = function(msg) {
                    cb(msg.data.toString())
                }},
                onclose: function(cb) { sock.onclose = cb }
            }
        } :
        function(addr) {
            var sock = new WebSocket(addr)

            return {
                send: function(msg) { sock.send(msg) },
                close: function() { sock.close() },
                receive: function(cb) { sock.onmessage = function(msg) { cb(msg.data.toString()) } },
                onclose: function(cb) { sock.onclose = cb }
            }
        }
    )

    sockception.connect = function(address, log) {
        return sockception.fromPrefixAndTransport("c", impl.clientWebsocketTransport(address, log), log)
    }

    sockception.util = require("./util")
})(
    typeof module === "undefined" ? {exports: {}} : module,
    typeof require === "undefined" ? function() {} : require
)
}).call(this,require('_process'))
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9zb2NrY2VwdGlvbi9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzb2NrY2VwdGlvblxuXG47KGZ1bmN0aW9uKG1vZHVsZSwgcmVxdWlyZSl7XG4gICAgdmFyIHdzID0gcmVxdWlyZShcIndzXCIpXG5cbiAgICBzb2NrY2VwdGlvbiA9IG1vZHVsZS5leHBvcnRzXG5cbiAgICBzb2NrY2VwdGlvbi5pbXBsID0ge31cbiAgICB2YXIgaW1wbCA9IHNvY2tjZXB0aW9uLmltcGxcblxuICAgIGltcGwuaWRHZW4gPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICAgICAgdmFyIGNvdW50ID0gMFxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJlZml4ICsgY291bnQrK1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc29ja2NlcHRpb24uaW1wbC5pbml0Um91dGUgPSBmdW5jdGlvbihyb3V0ZXMsIHJvdXRlUGF0aCkge1xuICAgICAgICB2YXIgcmV0ID0gcm91dGVzXG5cbiAgICAgICAgdmFyIGkgPSAwXG4gICAgICAgIHZhciBuZXh0XG5cbiAgICAgICAgd2hpbGUgKGkgPCByb3V0ZVBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgICBuZXh0ID0gcmV0LmNoaWxkcmVuW3JvdXRlUGF0aFtpXV1cbiAgICAgICAgICAgIGlmICghbmV4dCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXQgPSBuZXh0XG4gICAgICAgICAgICBpKytcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChpIDwgcm91dGVQYXRoLmxlbmd0aCkge1xuICAgICAgICAgICAgbmV4dCA9IHtjaGlsZHJlbjoge319XG4gICAgICAgICAgICByZXQuY2hpbGRyZW5bcm91dGVQYXRoW2ldXSA9IG5leHRcbiAgICAgICAgICAgIHJldCA9IG5leHRcbiAgICAgICAgICAgIGkrK1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0LnZhbHVlID0gcmV0LnZhbHVlIHx8IHt9XG4gICAgICAgIHJldCA9IHJldC52YWx1ZVxuXG4gICAgICAgIHJldHVybiByZXRcbiAgICB9XG5cbiAgICBzb2NrY2VwdGlvbi5pbXBsLmdldFJvdXRlID0gZnVuY3Rpb24ocm91dGVzLCByb3V0ZVBhdGgpIHtcbiAgICAgICAgdmFyIHJldCA9IHJvdXRlc1xuXG4gICAgICAgIHZhciBpID0gMFxuICAgICAgICB2YXIgbmV4dFxuXG4gICAgICAgIHdoaWxlIChpIDwgcm91dGVQYXRoLmxlbmd0aCkge1xuICAgICAgICAgICAgbmV4dCA9IHJldC5jaGlsZHJlbltyb3V0ZVBhdGhbaV1dXG4gICAgICAgICAgICBpZiAoIW5leHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXQgPSBuZXh0XG4gICAgICAgICAgICBpKytcbiAgICAgICAgfVxuXG4gICAgICAgIHJldCA9IHJldC52YWx1ZVxuXG4gICAgICAgIHJldHVybiByZXRcbiAgICB9XG5cbiAgICBzb2NrY2VwdGlvbi5pbXBsLmxhenlDYWxsID0gZnVuY3Rpb24oZikge1xuICAgICAgICB2YXIgc2V0ID0gZmFsc2VcbiAgICAgICAgdmFyIHZhbHVlXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGYoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc29ja2NlcHRpb24uZnJvbVByZWZpeEFuZFRyYW5zcG9ydCA9IGZ1bmN0aW9uKHByZWZpeCwgdHJhbnNwb3J0LCBsb2cpIHtcbiAgICAgICAgbG9nID0gbG9nIHx8IHt9XG4gICAgICAgIGxvZy5kZWJ1ZyA9IGxvZy5kZWJ1ZyB8fCBmdW5jdGlvbigpIHt9XG4gICAgICAgIGxvZy5pbmZvID0gbG9nLmluZm8gfHwgZnVuY3Rpb24oKSB7fVxuICAgICAgICBsb2cuZXJyb3IgPSBsb2cuZXJyb3IgfHwgZnVuY3Rpb24oKSB7fVxuXG4gICAgICAgIHZhciBmYWN0b3J5ID0ge1xuICAgICAgICAgICAgcm91dGVzOiB7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IHt9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaWRHZW46IGltcGwuaWRHZW4ocHJlZml4KSxcbiAgICAgICAgICAgIHRyYW5zcG9ydDogdHJhbnNwb3J0LFxuICAgICAgICAgICAgY2xvc2VIYW5kbGVyczogW10sXG4gICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uKHJvdXRlUGF0aCwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc29ja2V0ID0ge1xuICAgICAgICAgICAgICAgICAgICBpbXBsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmYWN0b3J5OiBmYWN0b3J5LFxuICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVQYXRoOiByb3V0ZVBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3V0ZTogc29ja2NlcHRpb24uaW1wbC5sYXp5Q2FsbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc29ja2NlcHRpb24uaW1wbC5pbml0Um91dGUoZmFjdG9yeS5yb3V0ZXMsIHJvdXRlUGF0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgc2VuZDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbXBsID0gc29ja2V0LmltcGxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmYWN0b3J5ID0gaW1wbC5mYWN0b3J5XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3Vic29ja2V0ID0gZmFjdG9yeS5jcmVhdGUoW2ZhY3RvcnkuaWRHZW4oKV0sIG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VuZE9iaiA9IFtpbXBsLnJvdXRlUGF0aCwgc3Vic29ja2V0LmltcGwucm91dGVQYXRoLCB2YWx1ZV1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZW5kU3RyID0gSlNPTi5zdHJpbmdpZnkoc2VuZE9iailcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZyhcIlNlbmRpbmc6IFwiICsgc2VuZFN0cilcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY3RvcnkudHJhbnNwb3J0LnNlbmQoc2VuZFN0cilcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1YnNvY2tldFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZWNlaXZlT25lOiBmdW5jdGlvbihjYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc29ja2V0LmltcGwucm91dGUoKS5oYW5kbGVyID0gZnVuY3Rpb24ocykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiKHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNvY2tldC5pbXBsLnJvdXRlKCkuaGFuZGxlciAvLyBUT0RPOiBkZWxldGUgc29ja2V0LmltcGwucm91dGUoKSB0b29cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZU1hbnk6IGZ1bmN0aW9uKGNiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb2NrZXQuaW1wbC5yb3V0ZSgpLmhhbmRsZXIgPSBmdW5jdGlvbihzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IocywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzb2NrZXQuaW1wbC5yb3V0ZSgpLmhhbmRsZXIgLy8gVE9ETzogZGVsZXRlIHNvY2tldC5pbXBsLnJvdXRlKCkgdG9vXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcm91dGU6IGZ1bmN0aW9uKHJvdXRlSXRlbSkgeyAvLyBUT0RPOiBzaG91bGQgdGhpcyBiZSBtYWtpbmcgZHVwbGljYXRlcyBvZiByb3V0ZXMgbGlrZSB0aGlzPyBzaG91bGQgd29yayBmaW5lLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW1wbCA9IHNvY2tldC5pbXBsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Um91dGVQYXRoID0gaW1wbC5yb3V0ZVBhdGguc2xpY2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Um91dGVQYXRoLnB1c2gocm91dGVJdGVtKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGltcGwuZmFjdG9yeS5jcmVhdGUobmV3Um91dGVQYXRoLCBudWxsKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBtdWx0aVJvdXRlOiBmdW5jdGlvbihyb3V0ZVJlY2VpdmVycykgeyAvLyBUT0RPOiB0ZXN0LCBtdWx0aVJvdXRlT25lP1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcm91dGVJdGVtIGluIHJvdXRlUmVjZWl2ZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc29ja2V0LnJvdXRlKHJvdXRlSXRlbSkucmVjZWl2ZU1hbnkocm91dGVSZWNlaXZlcnNbcm91dGVJdGVtXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgb25jbG9zZTogZnVuY3Rpb24oY2IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvY2tldC5pbXBsLmZhY3RvcnkuY2xvc2VIYW5kbGVycy5wdXNoKGNiKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvY2tldFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdHJhbnNwb3J0LnJlY2VpdmUoZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICBsb2cuZGVidWcoXCJSZWNlaXZlZDogXCIgKyBzdHIpXG4gICAgICAgICAgICB2YXIgcGFyc2VkID0gSlNPTi5wYXJzZShzdHIpXG5cbiAgICAgICAgICAgIHZhciByb3V0ZSA9IHNvY2tjZXB0aW9uLmltcGwuZ2V0Um91dGUoZmFjdG9yeS5yb3V0ZXMsIHBhcnNlZFswXSlcblxuICAgICAgICAgICAgaWYgKCFyb3V0ZSkge1xuICAgICAgICAgICAgICAgIGxvZy5lcnJvcihcIlJvdXRlIG5vdCBzZXQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocGFyc2VkWzBdKSkgLy8gVE9ETzogaW5mb3JtIG90aGVyIGVuZD9cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFyb3V0ZSB8fCAhcm91dGUuaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIGxvZy5lcnJvcihcIlJvdXRlIGJ1dCBubyBoYW5kbGVyIGZvcjogXCIgKyBKU09OLnN0cmluZ2lmeShwYXJzZWRbMF0pKSAvLyBUT0RPOiBpbmZvcm0gb3RoZXIgZW5kP1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByb3V0ZS5oYW5kbGVyKGZhY3RvcnkuY3JlYXRlKHBhcnNlZFsxXSwgcGFyc2VkWzJdKSlcbiAgICAgICAgfSlcblxuICAgICAgICB2YXIgZmlyc3RTb2NrID0gZmFjdG9yeS5jcmVhdGUoW1wiMFwiXSwgbnVsbClcblxuICAgICAgICB2YXIgY2xvc2VkID0gZmFsc2VcblxuICAgICAgICBmaXJzdFNvY2suY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNwb3J0LmNsb3NlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRyYW5zcG9ydC5vbmNsb3NlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2xvc2VkID0gdHJ1ZVxuICAgICAgICAgICAgZmFjdG9yeS5jbG9zZUhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gZmlyc3RTb2NrXG4gICAgfVxuXG4gICAgaW1wbC50cmFuc3BvcnRQYWlyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0cmFuc3BvcnRzID0ge1xuICAgICAgICAgICAgYToge1xuICAgICAgICAgICAgICAgIGltcGw6IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VIYW5kbGVyOiBmdW5jdGlvbigpIHt9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZW5kOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHsgLy8gVE9ETzogYnJvd3NlciBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnRzLmIuaW1wbC5oYW5kbGVyKG1zZylcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zcG9ydHMuYS5pbXBsLmNsb3NlSGFuZGxlcigpXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnRzLmIuaW1wbC5jbG9zZUhhbmRsZXIoKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVjZWl2ZTogZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnRzLmEuaW1wbC5oYW5kbGVyID0gaGFuZGxlclxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25jbG9zZTogZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnRzLmEuaW1wbC5jbG9zZUhhbmRsZXIgPSBoYW5kbGVyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGI6IHtcbiAgICAgICAgICAgICAgICBpbXBsOiB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlSGFuZGxlcjogZnVuY3Rpb24oKSB7fVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2VuZDogZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnRzLmEuaW1wbC5oYW5kbGVyKG1zZylcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zcG9ydHMuYi5pbXBsLmNsb3NlSGFuZGxlcigpXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnRzLmEuaW1wbC5jbG9zZUhhbmRsZXIoKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVjZWl2ZTogZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnRzLmIuaW1wbC5oYW5kbGVyID0gaGFuZGxlclxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25jbG9zZTogZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnRzLmIuaW1wbC5jbG9zZUhhbmRsZXIgPSBoYW5kbGVyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRyYW5zcG9ydHNcbiAgICB9XG5cbiAgICBzb2NrY2VwdGlvbi5wYWlyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwYWlyID0gaW1wbC50cmFuc3BvcnRQYWlyKClcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYTogc29ja2NlcHRpb24uZnJvbVByZWZpeEFuZFRyYW5zcG9ydChcImFcIiwgcGFpci5hKSxcbiAgICAgICAgICAgIGI6IHNvY2tjZXB0aW9uLmZyb21QcmVmaXhBbmRUcmFuc3BvcnQoXCJiXCIsIHBhaXIuYilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvY2tjZXB0aW9uLmxpc3RlbiA9IGZ1bmN0aW9uKG9wdCkge1xuICAgICAgICBpZiAoIXdzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXZWJzb2NrZXQgc2VydmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBlbnZpcm9ubWVudFwiKVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHdzcyA9IG5ldyB3cy5TZXJ2ZXIoe3BvcnQ6IG9wdC5wb3J0fSlcblxuICAgICAgICB2YXIgc29ja0hhbmRsZXIgPSBmdW5jdGlvbigpIHt9XG5cbiAgICAgICAgd3NzLm9uKFwiY29ubmVjdGlvblwiLCBmdW5jdGlvbih3ZWJzb2NrKSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKCkge30gLy8gVE9ETzogdGltZW91dCBxdWV1ZXM/XG5cbiAgICAgICAgICAgIHdlYnNvY2sub24oXCJtZXNzYWdlXCIsIGZ1bmN0aW9uKG1zZykge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIobXNnLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBzb2NrSGFuZGxlcihzb2NrY2VwdGlvbi5mcm9tUHJlZml4QW5kVHJhbnNwb3J0KFxuICAgICAgICAgICAgICAgIFwic1wiLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2VuZDogZnVuY3Rpb24ocykge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2Vic29jay5zZW5kKHMsIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yICYmIG9wdC5sb2cgJiYgb3B0LmxvZy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHQubG9nLmVycm9yKFwid3M6IFwiICsgZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKCkgeyB3ZWJzb2NrLmNsb3NlKCkgfSwgLy8gVE9ETzogdGVzdFxuICAgICAgICAgICAgICAgICAgICByZWNlaXZlOiBmdW5jdGlvbihjYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2Vic29jay5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYihtc2cuZGF0YS50b1N0cmluZygpKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvbmNsb3NlOiBmdW5jdGlvbihjYikgeyB3ZWJzb2NrLm9uY2xvc2UgPSBjYiB9IC8vIFRPRE86IHRlc3RcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9wdC5sb2cpKVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZWNlaXZlTWFueTogZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHNvY2tIYW5kbGVyID0gaGFuZGxlclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbigpIHsgd3NzLmNsb3NlKCkgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW1wbC5jbGllbnRXZWJzb2NrZXRUcmFuc3BvcnQgPSAoXG4gICAgICAgIHdzID9cbiAgICAgICAgZnVuY3Rpb24oYWRkciwgbG9nKSB7XG4gICAgICAgICAgICB2YXIgc29jayA9IG5ldyB3cyhhZGRyKVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNlbmQ6IGZ1bmN0aW9uKG1zZykge1xuICAgICAgICAgICAgICAgICAgICBzb2NrLnNlbmQobXNnLCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nLmVycm9yKFwid3M6IFwiICsgZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7IHNvY2suY2xvc2UoKSB9LFxuICAgICAgICAgICAgICAgIHJlY2VpdmU6IGZ1bmN0aW9uKGNiKSB7IHNvY2sub25tZXNzYWdlID0gZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKG1zZy5kYXRhLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAgICAgfX0sXG4gICAgICAgICAgICAgICAgb25jbG9zZTogZnVuY3Rpb24oY2IpIHsgc29jay5vbmNsb3NlID0gY2IgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IDpcbiAgICAgICAgZnVuY3Rpb24oYWRkcikge1xuICAgICAgICAgICAgdmFyIHNvY2sgPSBuZXcgV2ViU29ja2V0KGFkZHIpXG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc2VuZDogZnVuY3Rpb24obXNnKSB7IHNvY2suc2VuZChtc2cpIH0sXG4gICAgICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKCkgeyBzb2NrLmNsb3NlKCkgfSxcbiAgICAgICAgICAgICAgICByZWNlaXZlOiBmdW5jdGlvbihjYikgeyBzb2NrLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1zZykgeyBjYihtc2cuZGF0YS50b1N0cmluZygpKSB9IH0sXG4gICAgICAgICAgICAgICAgb25jbG9zZTogZnVuY3Rpb24oY2IpIHsgc29jay5vbmNsb3NlID0gY2IgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKVxuXG4gICAgc29ja2NlcHRpb24uY29ubmVjdCA9IGZ1bmN0aW9uKGFkZHJlc3MsIGxvZykge1xuICAgICAgICByZXR1cm4gc29ja2NlcHRpb24uZnJvbVByZWZpeEFuZFRyYW5zcG9ydChcImNcIiwgaW1wbC5jbGllbnRXZWJzb2NrZXRUcmFuc3BvcnQoYWRkcmVzcywgbG9nKSwgbG9nKVxuICAgIH1cblxuICAgIHNvY2tjZXB0aW9uLnV0aWwgPSByZXF1aXJlKFwiLi91dGlsXCIpXG59KShcbiAgICB0eXBlb2YgbW9kdWxlID09PSBcInVuZGVmaW5lZFwiID8ge2V4cG9ydHM6IHt9fSA6IG1vZHVsZSxcbiAgICB0eXBlb2YgcmVxdWlyZSA9PT0gXCJ1bmRlZmluZWRcIiA/IGZ1bmN0aW9uKCkge30gOiByZXF1aXJlXG4pIl19
},{"./util":14,"_process":12,"ws":15}],14:[function(require,module,exports){
"use strict";

;(function(module) {
    var util = module.exports
    var sc = (this.sockception === undefined ? {} : this.sockception)
    sc.util = util

    // DEPRECATED
    util.router = function() {
        var router = function(s) {
            var route = router.impl.transform(s.value)
            var handler = router.impl.routes[route] || router.impl.default
            handler(s)
        }

        router.impl = {
            transform: function(value) { return value },
            routes: {},
            default: function() {}
        }

        router.transform = function(transform) {
            router.impl.transform = transform
            return router
        }

        router.route = function(route, handler) {
            router.impl.routes[route] = handler
            return router
        }

        router.unroute = function(route) {
            delete router.impl.routes[route]
            return router
        }

        router.unrouteAll = function() {
            router.impl.routes = {}
            return router
        }

        router.default = function(handler) {
            router.impl.default = handler
            return router
        }

        return router
    }

    util.chain = function() {
        var chain = function(s) {
            chain.impl.handlers.forEach(function(handler) {
                handler(s)
            })
        }

        chain.impl = {
            handlers: []
        }

        chain.push = function(handler) {
            chain.impl.handlers.push(handler)
            return chain
        }

        chain.pop = function() {
            chain.impl.handlers.pop()
            return chain
        }

        chain.shift = function() {
            chain.impl.handlers.shift()
            return chain
        }

        chain.unshift = function(handler) {
            chain.impl.handlers.unshift(handler)
            return chain
        }

        chain.clear = function() {
            chain.impl.handlers.length = 0
            return chain
        }

        return chain
    }

    util.acker = function(s) { s.send("ack") }
    util.echo = function(s) { s.send(s.value) }

    // DEPRECATED
    util.once = function(f) {
        var called = false

        return function(s) {
            if (called) {
                return
            }

            called = true
            return f(s)
        }
    }
}).call(this, typeof module === "undefined" ? {exports: {}} : module)
},{}],15:[function(require,module,exports){

/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

},{}]},{},[4])
