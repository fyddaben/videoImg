var fs = require('fs');
var path = require('path');
var Canvas = require('canvas')
  , Image = Canvas.Image;
var _ = require('lodash');
var glob = require('glob');
var backColorArr = [];
var backColor = "245,245,245,255";
for (var i = 0; i< 64; i++) {
  backColorArr.push(backColor);
}
var imgWid = 1400;
var imgHei = 1080;
var canvas = new Canvas(imgWid, imgHei);
var ctx = canvas.getContext('2d');
var readMultipleFiles = require('read-multiple-files');

// 存储所有图像buffer image对象的缓存
var imgCache = [];

getAllFiles();

function getAllFiles() {
  glob('./img/*.jpg', function(er, files) {
    if (er) {
      console.log(er);
    }

    // 声明每个帧的数组
    var frameArr = [];
    var frameLength = 0;
    readMultipleFiles(files, function(err, bufs){
      if (err) {
        throw err;
      }

      frameLength = bufs.length;

      for (var i = 0;i < bufs.length; i++) {
        var arr = readFileAndGetAxis(bufs[i], i + 1);
        frameArr.push(arr);
        console.log('done', parseInt((i+1) / frameLength * 100) + '%');
      }

      LoopCompareImg(frameArr);
      //fs.writeFile('./frame.json', JSON.stringify(frameArr), function(err){
      //  if(err) throw err;
      //  console.log('write success');
      //});
    });
  });
}

// 循环对比每个图片的坐标位置的
function LoopCompareImg(frameArr) {
  var _frameLength = frameArr.length;
  var cpArr = _.clone(frameArr);

  //组装所有坐标的容器
  var bigArr = [];

  //while(_frameLength > 1) {
    // 两两进行比较，得到的数组
    var unitTwoArr = [];
    for (var i = 0;i < _frameLength; i = i + 2) {

      if (i == (_frameLength - 1)) {
        unitTwoArr.push(frameArr[i]);
      } else {
        compareTwoImg(cpArr, i);
      }
    }
    //_frameLength = unitTwoArr.length;
  //}
}

// 对比两个图片的所有坐标，像素是否相同，并返回合并后的数组
function compareTwoImg(frameArr, i) {
  var leftObj = frameArr[i];
  var rightObj = frameArr[i + 1];
  var leftImg = imgCache[i];
  var rightImg = imgCache[i + 1];
  var newArr = [];
  var leftFrameIndex = leftObj[0].frameindex;
  var rightFrameIndex = rightObj[0].frameindex;
  leftObj.forEach(function(e) {
    var newE = {
      x:e.x,
      y:e.y,
      w:e.w,
      h:e.h
    };
    var lastIndex = _.findLastIndex(rightObj, newE);

    // 如果两张图片，存在同一个坐标,并且截取面积也相同
    if (lastIndex != -1) {
      // 再进行像素级对比
      ctx.clearRect(0, 0, imgWid, imgHei);
      ctx.drawImage(leftImg, 0, 0, imgWid, imgHei);
      var leftImgData = ctx.getImageData(e.x, e.y, e.w, e.h);
      ctx.clearRect(0, 0, imgWid, imgHei);
      ctx.drawImage(rightImg, 0, 0, imgWid, imgHei);
      var rightImgData = ctx.getImageData(e.x, e.y, e.w, e.h);
      if (!newE.frameindex) {
        newE.frameindex = [];
      }
      var cp_e = _.clone(newE);
      if (_.isEqual(leftImgData, rightImgData)) {
        console.log('frameindex', i, e.x, e.y, e.w, e.h);
        cp_e.frameindex.push(leftFrameIndex);
        cp_e.frameindex.push(rightFrameIndex);
        newArr.push(cp_e);
      } else {
        var cp_ea  = _.clone(newE);
        var cp_eb  = _.clone(newE);
        cp_ea.frameindex.push(leftFrameIndex);
        cp_eb.frameindex.push(rightFrameIndex);
        newArr.push(cp_ea);
        newArr.push(cp_eb);
      }
    }
  });
}

// 读取每个图片，并且获取这个图片中所有的方格的坐标。
function readFileAndGetAxis(squid, frameindex) {
  var img = new Image;
  img.src = squid;
  imgCache.push(img);
  ctx.clearRect(0, 0, imgWid, imgHei);
  ctx.drawImage(img, 0, 0, imgWid, imgHei);
  var widAmount = imgWid / 8;
  var HeiAmount = imgHei / 8;
  var axisArry = [];
  for (var k = 0; k< HeiAmount; k++ ) {
    for (var l = 0; l < widAmount; l++) {
      var imgData = ctx.getImageData(l * 8, k * 8, 8, 8);
      var pxIsexist = checkImg(imgData.data);
      if (pxIsexist) {
        axisArry.push({
          x: l * 8,
          y: k * 8,
          w: 8,
          h: 8
        });
      }
    }
  }
  //ctx.clearRect(0, 0, imgWid, imgHei);
  //ctx.fillStyle = 'rgba(245, 245, 245, 255)';
  //ctx.fillRect(0, 0, imgWid, imgHei);

  // 合并附近坐标连续的方格
  var mergeAxisArray = [];
  axisArry.forEach(function(e,i) {
    var x = e.x;
    var y = e.y;
    var w = e.w;
    var h = e.h;
    if (i != 0) {
      var _length = mergeAxisArray.length;
      var before = mergeAxisArray[_length-1];
      var beforeX = before.x;
      var beforeY = before.y;
      var beforeW = before.w;

      if ((x - beforeX) == beforeW && y == beforeY) {
        mergeAxisArray.splice(_length-1, 1);
        x = beforeX;
        w = beforeW + w;
      }
    }
    mergeAxisArray.push({
      x: x,
      y: y,
      w: w,
      h: h,
      frameindex:frameindex
    });
  });
  return mergeAxisArray;
}


function checkImg(imgData) {
  var pxArr = [];
  for (var j = 0; j < 256;j = j + 4) {
    var str = imgData[j] + ","
      + imgData[j + 1] + ","
      + imgData[j + 2] + ","
      + imgData[j + 3];
    pxArr.push(str);
  }
  if (_.isEqual(backColorArr, pxArr)) {
    return false;
  } else {
    return true;
  }
}






