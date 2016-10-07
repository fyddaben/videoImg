var fs = require('fs');
var async = require('async');
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
var rectWid = imgWid;
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
      var bigArr = [];
      for (var i = 0;i < bufs.length; i++) {
        var arr = readFileAndGetAxis(bufs[i], i + 1);
        frameArr[i] = arr;
        bigArr = bigArr.concat(arr);
        console.log('raw data done ', parseInt((i+1) / frameLength * 100) + '%');
      }
      LoopCompareImg(frameArr);
    });
  });
}
// 循环对比每个图片的坐标位置的
function LoopCompareImg(frameArr) {
  var cpArr = _.clone(frameArr);
  var _frameLength = cpArr.length;

  //组装所有坐标的容器
  var bigArr = [];

  var loopMakeGroup = function() {
    var unitTwoArr = [];
    // 两两进行比较，得到的数组
    var taskArr = [];
    cpArr.forEach(function(e, i) {
      if (i % 2 == 0) {
        if (i == (_frameLength - 1)) {
          unitTwoArr.push(cpArr[i]);
        } else {
          var index = _.clone(i);
          taskArr.push(function(callback) {
            compareTwoImg(cpArr, index, callback)
          });
        }
      }
    });
    async.parallel(taskArr, function (err, results) {
      console.log(results.length, 'length...');
      unitTwoArr = unitTwoArr.concat(results);
      cpArr = unitTwoArr;
      _frameLength = cpArr.length;
      if (_frameLength == 1) {
        bigArr = cpArr[0];
        console.log(bigArr.length, 'big arr');
        redrawByOrder(bigArr);

      } else {
        loopMakeGroup();
      }
    });

  }
  loopMakeGroup();
}

// 对比两个图片的所有坐标，像素是否相同，并返回合并后的数组
//var testi = 0;
function compareTwoImg(frameArr, i, callback) {
  var leftObj = _.clone(frameArr[i]);
  var rightObj = _.clone(frameArr[i + 1]);
  console.log(leftObj.length, rightObj.length, 'com leng', i);
  var newArr = [];
  var testi = 0;
  leftObj.forEach(function(e, j) {
    var newE = {
      x:e.x,
      y:e.y,
      w:e.w,
      h:e.h
    };
    var leftFrameIndex = e.frameindex;
    var lastIndex = _.findLastIndex(rightObj, newE);

    newE.frameindex = [];

    // 如果两张图片，存在同一个坐标,并且截取面积也相同
    if (lastIndex != -1) {
      var rightFrameIndex = rightObj[lastIndex].frameindex;
      rightObj.splice(lastIndex, 1);
      var leftImg = imgCache[leftFrameIndex[0] - 1];
      var rightImg = imgCache[rightFrameIndex[0] - 1];

      // 再进行像素级对比
      ctx.clearRect(0, 0, imgWid, imgHei);
      ctx.drawImage(leftImg, 0, 0, imgWid, imgHei);
      var leftImgData = ctx.getImageData(e.x, e.y, e.w, e.h);
      ctx.clearRect(0, 0, imgWid, imgHei);
      ctx.drawImage(rightImg, 0, 0, imgWid, imgHei);
      var rightImgData = ctx.getImageData(e.x, e.y, e.w, e.h);

      var cp_e = _.clone(newE);
      if (_.isEqual(leftImgData.data, rightImgData.data)) {

        cp_e.frameindex = cp_e.frameindex.concat(leftFrameIndex);
        cp_e.frameindex = cp_e.frameindex.concat(rightFrameIndex);
        newArr.push(cp_e);
      } else {
        var cp_ea = _.clone(newE);
        var cp_eb = _.clone(newE);

        cp_ea.frameindex = cp_ea.frameindex.concat(leftFrameIndex);
        cp_eb.frameindex = cp_eb.frameindex.concat(rightFrameIndex);
        newArr.push(cp_ea);
        newArr.push(cp_eb);
      }
    } else {
      var cp_ea = _.clone(newE);
      cp_ea.frameindex = cp_ea.frameindex.concat(leftFrameIndex);
      newArr.push(cp_ea);
    }
  });
  if (rightObj.length > 0) {
    rightObj.forEach(function(e) {
      var cp_ea = _.clone(e);
      newArr.push(cp_ea);
    });
  }
  callback(null, newArr);
}


// 对数组进行排序,按照截取宽度,并且进行绘图重组
function redrawByOrder(frameArr) {
  var orderFrame = {};

  frameArr.forEach(function(e) {

    if (!orderFrame[e.w]) {
      orderFrame[e.w] = [];
    }
    orderFrame[e.w].push(e);
  });
  var orderFrameArray = [];
  for(var i in orderFrame) {
    var newObj = {
      w: i,
      arr: orderFrame[i]
    }
    orderFrameArray.push(newObj);
  }
  orderFrameArray.sort(function(a, b) {
    return b.w - a.w;
  });

  // 获的截图面积从大到小的排序的数组

  var lineWid = 0;
  var leftWid = rectWid;

  // 记录当前坐标轴x的位置
  var curX = 0;
  var curY = 0;

  // 一共要画多少行
  var lineAmount = 0;

  // 每个页面有几行
  var unitLine = rectWid / 8;

  // 判断当前第几个图片
  var curImgIndex = 0;

  // 用于存储数据的对象
  var storeDataArr = [];

  // 所有对象的数量
  function loopCheckNext() {
    var bigestNum = _.findIndex(orderFrameArray, function(e) {
      var arr = e.arr;
      var flag = false;
      arr.forEach(function(unit) {
        if (!unit.hasCheck) {
          flag = true;
        }
      });
      return e.w <= leftWid && flag;
    });
    if (bigestNum == -1) {
      startDrawMergePic(orderFrameArray);
      storeCreateFile(storeDataArr);
      return false;
    }
    // 包含最大数的集合
    var bigestObj = orderFrameArray[bigestNum];

    // 填满这行，需要几个最大的数
    var num_a = parseInt(leftWid / bigestObj.w);
    var num_b = 0;
    bigestObj.arr.forEach(function(unit) {
      if (!unit.hasCheck) {
        num_b++;
      }
    });

    var num_x = _.min([num_a, num_b]);

    // 把已知用过的这几个，全部重置为，已检查
    var hasCheckedNum = 0;
    var hasOver = false;
    for (var i in bigestObj.arr) {
      var curBig = bigestObj.arr[i];
      if (!curBig.hasCheck && !hasOver) {
        curBig.hasCheck = true;

        // 记录重组后的值，从0,0 开始.
        curBig.tarx = curX;
        curBig.tary = curY;
        curBig.curImgIndex = curImgIndex;
        storeDataArr.push(curBig);

        curX+= parseInt(curBig.w);

        hasCheckedNum++;
        if (hasCheckedNum == num_x) {
          hasOver = true;
        }
      }
    }
    var cutLeftWid = leftWid - num_x * bigestObj.w

    if (cutLeftWid > 0) {
      leftWid = cutLeftWid;
      loopCheckNext();
    } else {
      lineAmount++;
      curY+= 8;
      curX = 0;
      leftWid = rectWid;
      if (lineAmount == unitLine * (curImgIndex + 1)) {
        curY = 0;
        curImgIndex++;
      }
      loopCheckNext();
    }
  }
  loopCheckNext();

}

// 开始生成组合图片
function startDrawMergePic(orderFrameArray) {

  // 先判断要画几个图片
  var picAmount = 0;
  // 每个页面有几行
  var unitLine = rectWid / 8;
  var orderframe = [];
  orderFrameArray.forEach(function(e) {
    e.arr.forEach(function(unit) {
      var curPageNum = unit.curImgIndex;
      if (!orderframe[curPageNum]) {
        orderframe[curPageNum] = [];
      }
      orderframe[curPageNum].push(unit);
    });
  });

  // 拼装图片
  orderframe.forEach(function(e, index) {
    var canvas = new Canvas(rectWid, rectWid);
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, rectWid, rectWid);
    ctx.fillStyle = 'rgba(' + backColor + ')';
    ctx.fillRect(0, 0, rectWid, rectWid);
    e.forEach(function(unit) {
      var curImg = imgCache[unit.frameindex[0] - 1];

      ctx.drawImage(curImg, unit.x, unit.y, unit.w, unit.h, unit.tarx, unit.tary, unit.w, unit.h);
    });
    var frameIndex = index + 1;
    canvas.createJPEGStream({
    }).pipe(fs.createWriteStream(path.join(__dirname, 'dist/flow_'+ frameIndex +'.jpg')));
    console.log('draw ' + index + ' done');
  });

}

//存储要读取的数据
function storeCreateFile(frameArray) {

  // 这个数组按照拼图的画画顺序排列的，
  var newFrameArr = [];
  frameArray.forEach(function(e, i) {

    // 因为8 x 8个元素一个格子,所以可以按照序号。表示坐标
    var rectIndex = (rectWid / 8 * (e.y / 8)) + (e.x / 8);
    var w = e.w / 8;
    var child = [];
    child.push(rectIndex);
    child.push(w);
    child = child.concat(e.frameindex);
    newFrameArr.push(child);
  });

  fs.writeFile('./dist/frame.json', JSON.stringify({w: rectWid, h: imgHei, v:newFrameArr}), function(err){
    if(err) throw err;
    console.log('write success');
  });
}


// 读取每个图片，并且获取这个图片中所有的方格的坐标。
function readFileAndGetAxis(squid, frameindex) {
  //var canvas = new Canvas(imgWid, imgHei);
  //var ctx = canvas.getContext('2d');
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
  //console.log(axisArry[0]);

  // 合并附近坐标连续的方格
  var mergeAxisArray = [];
  axisArry.forEach(function(e,i) {
    var x = e.x;
    var y = e.y;
    var w = e.w;
    var h = e.h;
    ctx.drawImage(img, e.x, e.y, e.w, e.h);
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
    var frindexArr = [];
    frindexArr.push(frameindex);
    mergeAxisArray.push({
      x: x,
      y: y,
      w: w,
      h: h,
      frameindex:frindexArr
    });
  });
  //mergeAxisArray.forEach(function(e) {
  //  ctx.drawImage(img, e.x, e.y, e.w, e.h, e.x, e.y, e.w, e.h);
  //});
  //canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, 'dist/lw_'+frameindex+'.png')));
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






