<?php

$list = "rarbg.to, rarbg2018.org, rarbg2019.org, rarbg2020.org, rarbg2021.org, rarbgaccess.org, rarbgaccessed.org, rarbgcdn.org, rarbgcore.org, rarbgdata.org, rarbgenter.org, rarbgget.org, rarbggo.org, rarbgindex.org, rarbgmirror.org, rarbgmirrored.org, rarbgp2p.org, rarbgproxied.org, rarbgproxies.org, rarbgproxy.org, rarbgprx.org, rarbgto.org, rarbgtor.org, rarbgtorrents.org, rarbgunblock.org, rarbgunblocked.org, rarbgway.org, rarbgweb.org, proxyrarbg.org, unblockedrarbg.org, rarbg.com, rarbgmirror.com, rarbgproxy.com, rarbgunblock.com";

foreach(explode(", ", $list) as $domain){
    echo "// @match                 *://$domain/*" . PHP_EOL;
}
