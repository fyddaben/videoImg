var fs = require('fs');
var async = require('async');
var path = require('path');
var _ = require('lodash');
var Canvas = require('canvas')
  , Image = Canvas.Image;

var readMultipleFiles = require('read-multiple-files');
var frameObj = require('./dist/frame.json');
var videoObj = {};
var videoWid = frameObj.w;
var videoHei = frameObj.h;
var backColor = "245,245,245,255";

// 因为组合图片的宽高都是videoWid
// 计算一个组合图片，可以放多少8x8格子
var rectAmountLine = videoWid / 8;

// 组合图片，每个的左边的距离
var leftX = 0;
var topY = 0;

// 组合图片的序号
var pieceImgIndex = 1;
console.log('frame len', frameObj.v.length);

frameObj.v.forEach(function(e, i) {
  var frameindex = e.slice(2);
  var rectIndex = parseInt(e[0]);
  var ty = parseInt(rectIndex / rectAmountLine) * 8;
  var tx = rectIndex % rectAmountLine * 8;
  var w = e[1] * 8;
  var h = 8;
  var x = leftX;
  var y = topY;
  frameindex.forEach(function(f) {
    if (!videoObj[f]) {
      videoObj[f] = [];
    }
    var curObj = {
      x: x,
      y: y,
      w: w,
      h: h,
      tx: tx,
      ty: ty,
      curImg: pieceImgIndex
    }

    videoObj[f].push(curObj);
  });
  leftX += w;
  if (leftX == videoWid) {
    leftX = 0;
    topY+= 8;
  }
  // 组合图片宽高都是videoWid
  if (topY == videoWid) {
    topY = 0;
    pieceImgIndex++;
  }

});
loadAllPieceImgs();
var imgCache = [];

function loadAllPieceImgs() {
  var pathArr = [];
  for (var i = 1;i <= pieceImgIndex; i++) {
     pathArr.push('./dist/flow_' + i + '.jpg');
  }

  // 声明每个帧的数组
  var frameArr = [];
  var frameLength = 0;
  var taskArr = [];
  readMultipleFiles(pathArr, function(err, bufs){
    if (err) {
      throw err;
    }

    frameLength = bufs.length;

    for (var i = 0;i < bufs.length; i++) {
      var img = new Image;
      img.src = bufs[i];
      imgCache.push(img);
      console.log('raw data done ', parseInt((i+1) / frameLength * 100) + '%');
    }
    _.forIn(videoObj, function(value, key) {
      function genImg(callback) {
        readFileAndGenerImgs(key, callback);
      }
      taskArr.push(genImg);
    });

    async.parallel(taskArr, function (err, results) {
      console.log('gen img succ...' + results.length, allLength);
    });
  });
}



var allLength = 0;
function readFileAndGenerImgs(j, callback) {
  var curObj = videoObj[j];
  allLength+= curObj.length;

  var canvas = new Canvas(videoWid, videoHei);
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, videoWid, videoHei);
  ctx.fillStyle = 'rgba(' + backColor + ')';
  ctx.fillRect(0, 0, videoWid, videoHei);
  curObj.forEach(function(e) {
    var curImg = imgCache[e.curImg - 1];
    ctx.drawImage(curImg, e.x, e.y, e.w, e.h, e.tx, e.ty, e.w, e.h);
  });
  canvas.createJPEGStream().pipe(fs.createWriteStream(path.join(__dirname, 'flash/src_'+ j +'.jpg')));
  callback(null, {});
}



