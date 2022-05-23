// ==UserScript==
// @name                  RARBG Helper
// @name:zh-CN            RARBG 助手
// @author                PeratX
// @connect               *
// @description           Powerful Toolbox for RARBG
// @description:zh-cn     为 RARBG 定制的强力工具箱
// @grant                 GM_xmlhttpRequest
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
// @namespace             https://peratx.net
// @supportURL            https://github.com/PeratX/RARBGHelper
// @updateURL             https://raw.githubusercontent.com/PeratX/RARBGHelper/master/rarbg-helper.user.js
// @version               1.7.3
// ==/UserScript==

(async () => {
  "use strict";

  const settings = {
    downloadImg: '<img src="//dyncdn.me/static/20/img/16x16/download.png" style="height:12px;margin-bottom:-2px;" />',
    info: `<div style="align-items:center;display:flex;flex-direction:row;justify-content:center;">RARBG Helper&nbsp;<iframe src="//ghbtns.com/github-btn.html?user=PeratX&amp;repo=RARBGHelper&amp;type=star&amp;count=true" frameborder="0" style="height:20px;width:120px;"></iframe><input onchange='javascript:(()=>localStorage.setItem("loadInfoOnHover",this.checked?"1":""))();' type="checkbox" />&nbsp;load torrent info inline on hover</div>`,
    loadInfoOnHover: (typeof localStorage.getItem("loadInfoOnHover") === 'string' ? !!localStorage.getItem("loadInfoOnHover") : true),
    localStorageMaxEntries: 1000,
    magnetImg: '<img src="//dyncdn.me/static/20/img/magnet.gif" style="height:12px;margin-bottom:-2px;" />',
    modifications: [
      {
        ref: '#description img[src*="22pixx.xyz/os/"], #description img[src*="22pixx.xyz/rs/"], #description img[src*="22pixx.xyz/s/"]',
        handler(img) {
          img.src = img.src.replace(new RegExp(/\.xyz\/os\//), ".xyz/o/");
          img.src = img.src.replace(new RegExp(/\.xyz\/rs\//), ".xyz/r/");
          img.src = img.src.replace(new RegExp(/\.xyz\/s\//), ".xyz/i/");

          img.style.maxWidth = "unset";
          img.style.width = "100%";
        },
      },
      {
        ref: '#description img[src*="imagecurl.com/images/"]',
        handler(img) {
          img.src = img.src.replace(new RegExp(/_thumb\./), ".");

          img.style.maxWidth = "unset";
          img.style.width = "100%";
        },
      },
      {
        ref: '#description img[src*="freebunker.com/tn/t"], #description img[src*="imgcarry.com/tn/t"], #description img[src*="imgshots.com/tn/t"], #description img[src*="imagesnake.com/tn/t"], #description img[src*="pornbus.org/tn/t"]',
        handler(img) {
          img.src = img.src.replace(new RegExp(/\/tn\/t/), "tn/i");

          img.style.maxWidth = "unset";
          img.style.width = "100%";
        },
      },
      {
        ref: '#description img[src*="imgprime.com/uploads/"]',
        handler(img) {
          img.src = img.src.replace(new RegExp(/\/small\//), "/big/");

          img.style.maxWidth = "unset";
          img.style.width = "100%";
        },
      },
    ],
  };

  const opened = JSON.parse(localStorage.getItem("opened") || "[]");
  const viewed = JSON.parse(localStorage.getItem("viewed") || "[]");

  document.onmousemove = (e) => {
    let xoff = e.pageX + xoffset;
    let yoff = e.pageY + yoffset;

    if (pop.children[0]) {
      const top = document.scrollingElement.scrollTop + document.scrollingElement.clientHeight - pop.children[0].height - 10;
      if (yoff > top) yoff = top;
    }

    pop.style.left = xoff + "px";
    pop.style.top = yoff + "px";
  };

  const cache = [];
  function addSuffix(element) {
    const url = element?.getAttribute("href");
    if (!cache.includes(url)) {
      cache.push(url);

      fetch(url)
        .then((res) => res.text())
        .then((res) => {
          const $ = new DOMParser().parseFromString(res, "text/html");

          const ratingStars = $.querySelector("#ratingstars p")?.innerText || '';
          const ref = $.querySelector("td.lista a[id]");

          const downloadLink = ref?.getAttribute("href");
          const magnetLink = ref?.nextElementSibling?.getAttribute("href");

          element.parentNode.innerHTML += (downloadLink ? `<a href="${downloadLink}" target="_blank">${settings.downloadImg}</a>&nbsp;` : '') + (magnetLink ? `<a href="${magnetLink}" target="_blank">${settings.magnetImg}</a>&nbsp;` : '') + ratingStars;
        });
    }
  }

  for (let element of document.querySelectorAll('.lista2 > td:nth-child(2) > a[href^="/torrent/"], .lista_related a[href^="/torrent/"]') || []) {
    if (viewed.includes(element.href)) element.parentNode.parentNode.style.borderLeft = "2px solid yellow";
    else viewed.push(element.href);

    if (opened.includes(element.href))
      element.parentNode.parentNode.style.borderLeft = "2px solid red";

    const onMouseOver = element.attributes.onmouseover;
    if (!onMouseOver) continue;

    if (settings.loadInfoOnHover)
      element.addEventListener("mouseover", () => addSuffix(element));

    const parts = onMouseOver.value.split("/");
    switch (parts[3]) {
      case "static": {
        switch (parts[4]) {
          case "over": // 18+
            onMouseOver.value = onMouseOver.value.replace("static/over", "posters2/" + parts[5].substr(0, 1));
            break;

          case "20": // tvdb
            onMouseOver.value = onMouseOver.value.replace("_small", "_banner_optimized");
            break;
        }

        break;
      }

      case "mimages": // movie
        onMouseOver.value = onMouseOver.value.replace("over_opt", "poster_opt");
        break;
    }
  }

  const searchBox = document.querySelector("#searchTorrent");
  if (searchBox) {
    searchBox.innerHTML = settings.info + searchBox.innerHTML;
    searchBox.querySelector('input[type="checkbox"]').checked = settings.loadInfoOnHover;
  } else {
    for (const modification of settings.modifications)
      if (modification.handler)
        for (const ref of document.querySelectorAll(modification.ref) || [])
          modification.handler(ref);
  }

  if (location.href.match(/https?:\/\/[^\/]*rarbg[^\/]*\.[a-z]{2,4}\/torrent\/[^\/\?]+/) && !opened.includes(location.href))
    opened.push(location.href);

  localStorage.setItem("opened", JSON.stringify(opened.slice(~settings.localStorageMaxEntries + 1)));
  localStorage.setItem("viewed", JSON.stringify(viewed.slice(~settings.localStorageMaxEntries + 1)));
})();
