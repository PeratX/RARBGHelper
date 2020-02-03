// ==UserScript==
// @name         Rarbg Image Helper
// @namespace    https://peratx.net
// @version      1.0.0
// @description  22pixx
// @author       PeratX
// @match        https://rarbgprx.org/torrent/*
// @license      Apache License 2.0
// ==/UserScript==

(function () {
    'use strict';
    function getStringBetween(str, begin, end) {
        if (str.indexOf(begin) >= 0) {
            let index = str.indexOf(begin);
            return str.substring(index + begin.length + 1, str.indexOf(end, index));
        }
        return false;
    }

    function setImage(a, img) {
        console.log(img);
        a.setAttribute("href", img);
        a.getElementsByTagName("img")[0].setAttribute("src", img);
    }

    let a = document.getElementById("description").getElementsByTagName("a")
    for (let i in a) {
        if (typeof a[i] == "object") {
            let href = a[i].getAttribute("href");
            if (href.indexOf("22pixx") >= 0) {
                fetch(href).then(body => body.text()).then(content => {
                    let link = getStringBetween(content, "linkid=", '";');
                    if (link !== false) {
                        fetch(link).then(body => body.text()).then(body => {
                            let img = getStringBetween(body, "<center><a href=", '" ');
                            setImage(a[i], img);
                        });
                    }
                })
            } else if (href.indexOf("imgcarry") >= 0) {
                fetch(href).then(body => body.text()).then(content => {
                    let img = getStringBetween(content, "<span id=imagecode ><img src=", '" ');
                    if (img !== false) {
                        setImage(a[i], img);
                    }
                })
            } else if (href.indexOf("imagecurl") >= 0) {
                fetch(href).then(body => body.text()).then(content => {
                    let img = getStringBetween(content, ".html('<br/><a href=", '">');
                    if (img !== false) {
                        setImage(a[i], img);
                    }
                })
            }
        }
    }
})();
