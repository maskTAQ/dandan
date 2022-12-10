const iconArrayData = [
    require("./flowers/1.png"),
    require("./flowers/2.png"),
    require("./flowers/3.png"),
    require("./flowers/4.png"),
    require("./flowers/5.png"),
];
export default function injectLikeEffect(config = {}) {
    // 送心特效算法
    !(function (t, e) {
        "object" == typeof exports && "undefined" != typeof module
            ? (module.exports = e())
            : "function" == typeof define && define.amd
                ? define(e)
                : (t.BubbleHearts = e());
    })(window, function () {
        "use strict";

        function t(t, n, r) {
            var i = e.uniformDiscrete(89, 91) / 100,
                o = 1 - i,
                u = (e.uniformDiscrete(45, 60) + e.uniformDiscrete(45, 60)) / 100,
                a = function (t) {
                    return t > i ? Math.max(((1 - t) / o).toFixed(2), 0.1) * u : u;
                },
                c = e.uniformDiscrete(-30, 30),
                f = function (t) {
                    return c;
                },
                h = 10,
                s = n.width / 2 + e.uniformDiscrete(-h, h),
                d =
                    (n.width -
                        Math.sqrt(Math.pow(t.width, 2) + Math.pow(t.height, 2))) /
                    2 -
                    h,
                l =
                    e.uniformDiscrete(0.8 * d, d) *
                    (e.uniformDiscrete(0, 1) ? 1 : -1),
                m = e.uniformDiscrete(250, 400),
                w = function (t) {
                    return t > i
                        ? s
                        : s + l * Math.sin((m * (i - t) * Math.PI) / 180);
                },
                v = function (e) {
                    return t.height / 2 + (n.height - t.height / 2) * e;
                },
                p = e.uniformDiscrete(14, 18) / 100,
                g = function (t) {
                    return t > p ? 1 : 1 - ((p - t) / p).toFixed(2);
                };
            return function (e) {
                if (!(e >= 0)) return !0;
                r.save();
                var n = a(e),
                    i = f(e),
                    o = w(e),
                    u = v(e);
                r.translate(o, u),
                    r.scale(n, n),
                    r.rotate((i * Math.PI) / 180),
                    (r.globalAlpha = g(e)),
                    r.drawImage(t, -t.width / 2, -t.height / 2, t.width, t.height),
                    r.restore();
            };
        }
        var e = (function (t) {
            var e = t,
                n = Math.floor,
                r = Math.random;
            return (
                (t.uniform = function (t, e) {
                    return t + (e - t) * r();
                }),
                (t.uniformDiscrete = function (t, r) {
                    return t + n((r - t + 1) * e.uniform(0, 1));
                }),
                t
            );
        })({}),
            n = function (t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function");
            },
            r = (function () {
                function t(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        (r.enumerable = r.enumerable || !1),
                            (r.configurable = !0),
                            "value" in r && (r.writable = !0),
                            Object.defineProperty(t, r.key, r);
                    }
                }
                return function (e, n, r) {
                    return n && t(e.prototype, n), r && t(e, r), e;
                };
            })(),
            i =
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                function (t) {
                    return setTimeout(t, 16);
                },
            o = (function () {
                function o() {
                    n(this, o);
                    var t = (this.canvas = document.createElement("canvas")),
                        e = (this.context = t.getContext("2d")),
                        r = (this._children = []);
                    this.context.scale(2, 2);
                    var u = function n() {
                        i(n), e.clearRect(0, 0, t.width, t.height);
                        for (var o = 0, u = r.length; o < u;) {
                            var a = r[o];
                            a.render.call(
                                null,
                                (a.timestamp + a.duration - new Date()) / a.duration
                            )
                                ? (r.splice(o, 1), u--)
                                : o++;
                        }
                    };
                    i(u);
                }
                return (
                    r(o, [
                        {
                            key: "bubble",
                            value: function (n) {
                                var r =
                                    arguments.length > 1 && void 0 !== arguments[1]
                                        ? arguments[1]
                                        : e.uniformDiscrete(2400, 3600),
                                    i =
                                        arguments.length > 2 && void 0 !== arguments[2]
                                            ? arguments[2]
                                            : t(n, this.canvas, this.context);
                                return (
                                    this._children.push({
                                        render: i,
                                        duration: r,
                                        timestamp: +new Date(),
                                    }),
                                    this
                                );
                            },
                        },
                    ]),
                    o
                );
            })();
        return o;
    });

    // 自定义送心效果对象
    function SendFlow(params) {
        // 对象所需参数
        this.options = {
            iconArray: [],
            jqDomID: "",
            canvasWidth: 170,
            canvasHeight: 300,
            bubbleHearts: null,
            initDomFinish: function () { },
            click: function () { },
        };
        this.emit = params.emit;
        Object.assign(this.options, params)
        //   $.extend(this.options, params);
        // 初始化送花
        this.initImg();
        // 初始化画布
        this.initCanvas();
        // 添加点击事件
        this.addEvent();
    }
    SendFlow.prototype.initImg = function () {
        var _this = this;
        this.options.iconArray.forEach(function (iconUrl, index) {
            _this.options.iconArray[index] = new Promise(function (resolve) {
                var img = new Image();
                img.onload = resolve.bind(null, img);
                img.src = iconUrl;
            });
        });
    };
    SendFlow.prototype.initRandomRule = function (min, max) {
        return min + (max - min) * Math.random();
    };
    SendFlow.prototype.initRule = function (i, j) {
        // return i + Math.floor((j - i + 1) * this.initRandomRule(0, 1));
        return Math.floor(Math.random() * this.options.iconArray.length);
    };
    SendFlow.prototype.initCanvas = function () {
        var _this = this;
        Promise.all(this.options.iconArray).then(function (icon) {
            _this.options.bubbleHearts = new BubbleHearts();
            var canvas = _this.options.bubbleHearts.canvas;
            canvas.width = _this.options.canvasWidth * 2;
            canvas.height = _this.options.canvasHeight * 2;
            canvas.style["width"] = _this.options.canvasWidth + "px";
            canvas.style["height"] = _this.options.canvasHeight + "px";
            // canvas.style.border = '1px solid red'
            canvas.className = config.className;
            _this.canvas = canvas;
            (config.container || document.body).appendChild(canvas);
            // DOM元素初始化完成
            _this.options.initDomFinish.call(
                _this,
                _this.options.bubbleHearts,
                icon
            );
        });
    };
    SendFlow.prototype.addEvent = function () {
        var _this = this;
        // Promise.all(this.options.iconArray).then(function (icon) {
        //     const dom = document.getElementById(_this.options.jqDomID);
        //     if (dom) {
        //         dom.onclick = function () {
        //             _this.options.click.call(_this, _this.options.bubbleHearts, icon);
        //         };
        //     }
        // });
    };
    /**
     * 实现效果：
     * 每隔10s请求一次点赞总数，请求回来后，每200ms飘一个心，5s内未飘完的话，5s处自动飘一个心，不计入总数；飘不完的话，5s内不飘心
     */

    // 当前点击数
    var sendFlowData = {
        sendNum: 0, // 点赞总数
        intervalObj: null,
        iconArrayData: iconArrayData,
        probability: [6, 3, 1, 1, 1], // 对应图片出现的概率
        percentIconArrayData: [], // 根据概率重新组合图标数组
    };

    // 初始化送花特效
    function sendFLowEvent() {
        // 初始化对象

        return new SendFlow({
            iconArray: sendFlowData.percentIconArrayData,
            jqDomID: config.jqDomID || "nc-815c_83799",
            canvasWidth: 140,
            canvasHeight: 300,
            initDomFinish: function (bubbleHeart, currentIcon) {
                // DOM(画布、图片)初始化完成
                // 每隔十秒请求一次
                // sendFlowNum(bubbleHeart, currentIcon);
                // setInterval(function () {
                //   // 请求接口获取点赞数
                //   sendFlowNum(bubbleHeart, currentIcon);
                // }, 10000);
            },
            click: function (bubbleHeart, currentIcon) {
                // 送花特效
                console.log(this, 'this');
                this.canvas.style.zIndex = 99;
                bubbleHeart.bubble(currentIcon[getIconArrayRandom()]);
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.canvas.style.zIndex = -1;
                }, 3000);

            },
            emit: function () {
                this.canvas.style.zIndex = 99;
                Promise.all(this.options.iconArray).then((icon) => {
                    this.options.bubbleHearts.bubble(icon[getIconArrayRandom()]);
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        this.canvas.style.zIndex = -1;
                    }, 3000);
                });

            }
        });
    }

    // 请求后台接口获取点赞数
    function getSendFlowNum() {
        return new Promise(function (resolve) {
            resolve(sendFlowData.sendNum + 10);
        });
    }
    function sendFlowNum(sendFlowObj, currentIcon) {
        getSendFlowNum().then(function (num) {
            if (parseInt(num) - parseInt(sendFlowData.sendNum) > 0) {
                // 新增了点赞数
                var allNum = parseInt(num) - parseInt(sendFlowData.sendNum);
                sendFlowObj.intervalObj = setInterval(function () {
                    if (parseInt(allNum) > 0) {
                        sendFlowObj.bubble(currentIcon[getIconArrayRandom()]);
                        allNum--;
                    } else {
                        clearInterval(sendFlowObj.intervalObj);
                    }
                }, 200);
                // 小于25， 5s后送
                if (Number(num) - Number(sendFlowData.sendNum) < 25) {
                    setTimeout(function () {
                        sendFlowObj.bubble(currentIcon[getIconArrayRandom()]);
                    }, 5000);
                }
            } else {
                sendFlowObj.intervalObj && clearInterval(sendFlowObj.intervalObj);
            }
            sendFlowData.sendNum = num;
        });
    }

    // 初始化概率数组
    function initPercentData() {
        var iconData = [];
        sendFlowData.probability.forEach(function (value, index, array) {
            var newAry = new Array(parseInt(value)).fill(
                sendFlowData.iconArrayData[index]
            );
            iconData = iconData.concat(newAry);
        });
        sendFlowData.percentIconArrayData =
            sendFlowData.percentIconArrayData.concat(iconData);
    }

    // 获取数组随机数
    function getIconArrayRandom() {
        return Math.floor(
            Math.random() * sendFlowData.percentIconArrayData.length
        );
    }

    // $(function () {
    // 初始化概率数组；
    initPercentData();

    // 初始化送花特效
    return sendFLowEvent();

    // });
}