// ==UserScript==
// @name                  RARBG Helper
// @name:zh-CN            RARBG 助手
// @namespace             https://peratx.net
// @version               1.6.1
// @description           Powerful Toolbox for RARBG.
// @description:zh-cn     为 RARBG 定制的强力工具箱。
// @author                PeratX
// @license               Apache License 2.0
// @match                 *://rarbg.to/*
// @match                 *://rarbg2018.org/*    
// @match                 *://rarbg2019.org/*    
// @match                 *://rarbg2020.org/*    
// @match                 *://rarbg2021.org/*    
// @match                 *://rarbgaccess.org/*  
// @match                 *://rarbgaccessed.org/*
// @match                 *://rarbgcdn.org/*     
// @match                 *://rarbgcore.org/*    
// @match                 *://rarbgdata.org/*    
// @match                 *://rarbgenter.org/*   
// @match                 *://rarbgget.org/*     
// @match                 *://rarbggo.org/*      
// @match                 *://rarbgindex.org/*
// @match                 *://rarbgmirror.org/*
// @match                 *://rarbgmirrored.org/*
// @match                 *://rarbgp2p.org/*
// @match                 *://rarbgproxied.org/*
// @match                 *://rarbgproxies.org/*
// @match                 *://rarbgproxy.org/*
// @match                 *://rarbgprx.org/*
// @match                 *://rarbgto.org/*
// @match                 *://rarbgtor.org/*
// @match                 *://rarbgtorrents.org/*
// @match                 *://rarbgunblock.org/*
// @match                 *://rarbgunblocked.org/*
// @match                 *://rarbgway.org/*
// @match                 *://rarbgweb.org/*
// @match                 *://proxyrarbg.org/*
// @match                 *://unblockedrarbg.org/*
// @match                 *://rarbg.com/*
// @match                 *://rarbgmirror.com/*
// @match                 *://rarbgproxy.com/*
// @match                 *://rarbgunblock.com/*
// @connect               *
// @supportURL            https://github.com/PeratX/RARBGHelper
// @updateURL             https://raw.githubusercontent.com/PeratX/RARBGHelper/master/helper.js
// @grant                 GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    const githubStar = '<iframe src="https://ghbtns.com/github-btn.html?user=PeratX&repo=RARBGHelper&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 120px;padding: 0 5px;box-sizing: border-box;margin-top: 5px;"></iframe>';
    const magnetImg  = '<img src="https://dyncdn2.com/static/20/img/magnet.gif"        style="height: 12px; width: 12px; margin-bottom:-2px;" border="0">';
    const downloadImg = '<img src="https://dyncdn.me/static/20/img/16x16/download.png" style="height: 12px; width: 12px; margin-bottom:-2px;" border="0" "="">';
    const starEmoji   = '&#x2B50';

    function getStringBetween(str, begin, end) {
        if (str.indexOf(begin) >= 0) {
            let index = str.indexOf(begin);
            return str.substring(index + begin.length + 1, str.indexOf(end, index));
        }
        return false;
    }

    function shouldEnable() {
        let list = ["torrents.php", "top10"];
        for (let page in list) {
            if (window.location.href.indexOf(list[page]) >= 0) {
                return true;
            }
        }
        return false;
    }

    if (shouldEnable()) {
        let cache = [];

        function addRating(a) {
            let page = a.getAttribute("href")
            if (!cache[page]) {
                cache[page] = true;
                fetch(page).then(body => body.text()).then(b => {
                    let parser = new DOMParser().parseFromString(b, "text/html");
                    let dl = parser.querySelector("td.lista a[id]");
                    let ratingElem = parser.querySelector("li.current-rating");

                    let ratingText = ratingElem?.innerHTML ?? "Not found: Try opening a torrent page to see if rate limited";
                    ratingText = ratingText.replace("Currently ", "").trim().replace(/(\d\.\d)\d/, "$1");

                    let dlLink = dl?.getAttribute("href") ?? "javascript:void(0)";
                    let magnetLink = dl?.nextElementSibling.getAttribute("href") ?? "javascript:void(0)";

                    a.parentNode.innerHTML += "<span>" + starEmoji +": " + ratingText + "     </span>" +
                        '<a href="' + dlLink + '">' + downloadImg + '</a><span>     </span><a href="' + magnetLink + '">' + magnetImg + '</a>';
                })
            }
        }

        document.onmousemove = function (k) {
            let xoff = k.pageX + xoffset;
            let yoff = k.pageY + yoffset;
            el = k.target || k.srcElement

            if (pop.children[0]) {
                let top = document.scrollingElement.scrollTop + document.scrollingElement.clientHeight - pop.children[0].height - 10
                if (yoff > top) {
                    yoff = top
                }
            }
            pop.style.top = yoff + "px";
            pop.style.left = xoff + "px"
        };

        let td = document.querySelectorAll('tr[class="lista2"] > td:nth-child(2)')
        for (let i = 0; i < td.length; i++) {
            td[i].innerHTML += '<a href="https://github.com/PeratX/RARBGHelper" target="_blank"><img src="https://github.githubassets.com/favicon.ico" border="0" style="width: 12px;"></a><span>     </span>'
        }
        let a = document.querySelectorAll('tr[class="lista2"] > td:nth-child(2) >a:nth-child(1)')
        for (let i = 0; i < a.length; i++) {
            let ev = a[i].attributes.onmouseover
            if (ev === false) {
                continue
            }
            a[i].addEventListener('mouseover', function (e) {
                addRating(a[i])
            })
            // process image
            let parts = ev.value.split('/')
            switch (parts[3]) {
                case 'static':
                    switch (parts[4]) {
                        case 'over': //18+
                            ev.value = ev.value.replace('static/over', 'posters2/' + parts[5].substr(0, 1))
                            break;
                        case '20': //TVdb
                            ev.value = ev.value.replace('_small', '_banner_optimized')
                            break;
                    }
                    break;
                case 'mimages': //movie
                    ev.value = ev.value.replace('over_opt', 'poster_opt')
                    break;
            }
        }

        document.getElementById("divadvsearch").innerHTML += "<span>RARBG Helper</span>" + githubStar
    } else {
        function setImage(a, img) {
            a.setAttribute("href", img);
            a.getElementsByTagName("img")[0].setAttribute("src", img);
        }

        function getDomain(url) {
            let d = url.split("/");
            if (d[2]) {
                return d[2];
            }
            return "";
        }

        let desc = document.getElementById("description");
        desc.innerHTML = '<a href="https://github.com/PeratX/RARBGHelper">RARBG Helper</a> Enabled</br>Made by <a href="mailto:peratx@itxtech.org">PeratX@iTXTech.org</a>   ' + githubStar + '<br></br></br>' + desc.innerHTML;
        let a = desc.getElementsByTagName("a");
        for (let i in a) {
            if (typeof a[i] == "object") {
                let url = a[i].getAttribute("href");
                switch (getDomain(url)) {
                    /*case "22pixx.xyz":
                        setImage(a[i], url.replace("ia-o", "o").replace(".html", ""));
                        break;*/
                    case "imagecurl.com":
                        setImage(a[i], url.replace("imagecurl.com", "cdn.imagecurl.com").replace("_thumb", "").replace("viewer.php?file=", "images/"));
                        break;
                    default:
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: a[i].getAttribute("href"),
                            onload: function (response) {
                                // imgprime, imgking
                                let img = getStringBetween(response.responseText, "var linkid=", ".html");
                                if (img === false) {
                                    img = getStringBetween(response.responseText, "<div id='continuetoimage'>", '.html');
                                }
                                if (img !== false) {
                                    img = img.trim().replace("<a href=\"", "") + ".html";
                                    GM_xmlhttpRequest({
                                        method: "GET",
                                        url: img,
                                        onload: function (response) {
                                            let img = getStringBetween(response.responseText, "<center><a href=", "' ");
                                            setImage(a[i], img);
                                        }
                                    });
                                } else {
                                    // imagecurl
                                    img = getStringBetween(response.responseText, ".html('<br/><a href=", '">');
                                    if (img === false) {
                                        // other sites like imagefruit
                                        img = getStringBetween(response.responseText, "<span id=imagecode ><img src=", '" ');
                                    }
                                    if (img !== false) {
                                        setImage(a[i], img);
                                    }
                                }
                            }
                        });
                }
            }
        }
    }

    const listed = JSON.parse(localStorage.getItem("listed") || "[]");
    const opened = JSON.parse(localStorage.getItem("opened") || "[]");
  
    for (const element of document.querySelectorAll(
      '.lista2t td:nth-child(2) > a[onmouseover^="return overlib"]'
    ) || []) {
      if (-1 < listed.indexOf(element.href))
        element.closest("tr").style.borderLeft = "2px solid yellow";
      else listed.push(element.href);
  
      if (-1 < opened.indexOf(element.href))
        element.closest("tr").style.borderLeft = "2px solid red";
    }
  
    if (
      location.href.match(
        /https?:\/\/(proxy|unblocked)?rarbg[0-9a-z]*?\.[a-z]{2,4}\/torrent\/[^\/\?]+/
      ) &&
      opened.indexOf(location.href) === -1
    )
      opened.push(location.href);
  
    localStorage.setItem("listed", JSON.stringify(listed));
    localStorage.setItem("opened", JSON.stringify(opened));
})();
