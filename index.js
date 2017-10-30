'use strict';

// This is an example of using p2pspider, you can change the code to make it do something else.
var fs = require('fs');
var path = require('path');

var bencode = require('bencode');
var P2PSpider = require('./lib');

var p2p = P2PSpider({
    nodesMaxSize: 400,
    maxConnections: 800,
    timeout: 10000
});

p2p.ignore(function (infohash, rinfo, callback) {
    var torrentFilePathSaveTo = path.join(__dirname, "torrents", infohash + ".torrent");
    fs.exists(torrentFilePathSaveTo, function(exists) {
        callback(exists); //if is not exists, download the metadata.
    });
});

p2p.on('metadata', function (metadata) {
    var torrentFilePathSaveTo = path.join(__dirname, "torrents", metadata.info.name.toString() + ".torrent");
    fs.writeFile(torrentFilePathSaveTo, bencode.encode({'info': metadata.info}), function(err) {
        if (err) {
            return console.error(err);
        }
        console.log('-----------------------------------------------------------')
        console.log(metadata.info.name.toString() + ".torrent has saved.");
        // for (var key in metadata.info.files) {
        //     if (metadata.info.files.hasOwnProperty(key)) {
        //         var ele = metadata.info.files[key];
        //         // console.log(ele)
        //         console.log('==>' + ele.path.toString())
        //     }
        // }
    });
});

p2p.listen(6881, '0.0.0.0');
