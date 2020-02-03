// ==UserScript==
// @name         Rarbg Image Helper
// @namespace    https://peratx.net
// @version      1.0.0
// @description  View original image on Rarbg Torrent Page.
// @author       PeratX
// @license      Apache License 2.0
// @match        https://rarbgprx.org/torrent/*
// @supportURL   https://github.com/PeratX/RarbgImageHelper
// @updateURL    https://raw.githubusercontent.com/PeratX/RarbgImageHelper/master/helper.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';
    function getStringBetween(str, begin, end) {
        if (str.indexOf(begin) >= 0) {
            let index = str.indexOf(begin);
            console.log(str.substring(index + begin.length + 1, str.indexOf(end, index)));
            return str.substring(index + begin.length + 1, str.indexOf(end, index));
        }
        return false;
    }

    function setImage(a, img) {
        a.setAttribute("href", img);
        a.getElementsByTagName("img")[0].setAttribute("src", img);
    }

    let desc = document.getElementById("description");
    desc.innerHTML = '<a href="https://github.com/PeratX/RarbgImageHelper">Rarbg Image Helper</a> Enabled</br>Made by <a href="mailto:peratx@itxtech.org">PeratX@iTXTech.org</a>   ' +
        '<iframe src="https://ghbtns.com/github-btn.html?user=PeratX&repo=RarbgImageHelper&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 120px;padding: 0 5px;box-sizing: border-box;margin-top: 5px;"></iframe></br></br></br>' + desc.innerHTML;
    let a = desc.getElementsByTagName("a");
    for (let i in a) {
        if (typeof a[i] == "object") {
            let href = a[i].getAttribute("href");
            if (href.indexOf("22pixx") >= 0) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: href,
                    onload: function (response) {
                        let link = getStringBetween(response.responseText, "linkid=", '";');
                        if (link !== false) {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: link,
                                onload: function (response) {
                                    let img = getStringBetween(response.responseText, "<center><a href=", '" ');
                                    setImage(a[i], img);
                                }
                            });
                        }
                    }
                })
            } else {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: href,
                    onload: function (response) {
                        // imagecurl
                        let img = getStringBetween(response.responseText, ".html('<br/><a href=", '">');
                        if (img === false) {
                            // other sites like imagefruit
                            img = getStringBetween(response.responseText, "<span id=imagecode ><img src=", '" ');
                        }
                        if (img !== false) {
                            setImage(a[i], img);
                        }
                    }
                });
            }
        }
    }
})();
