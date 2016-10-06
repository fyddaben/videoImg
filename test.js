var fs = require('fs');
var Canvas = require('canvas')
  , Image = Canvas.Image;

var frameObj = require('./dist/frame.json');
var videoObj = {};
var videoWid = frameObj.r;
var videoHei = frameObj.h;
frameObj.v.forEach(function(e) {
  var frameindex = e.slice(2);
  frameindex.forEach(function(i) {
    var rectIndex = e[0];
    videoObj[i] = true;
  });
});

