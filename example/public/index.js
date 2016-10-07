
$(function() {
  var frameObj = null;
  $.get('src/frame.json', function(data) {
    frameObj = data;
    afterloadFrame();
  });
  // 组合图片的序号
  var pieceImgIndex = 1;
  var videoObj = {};
  var videoWid = 0;
  var videoHei = 0;
  var fps = 25;
  var frameCount = 0;
  var frameSeconds = 1000 / fps;
  var backColor = "245,245,245,255";
  var canvas = document.getElementById("J_panel");;
  var ctx = canvas.getContext('2d');
  function afterloadFrame() {
    videoWid = frameObj.w;
    videoHei = frameObj.h;

    // 因为组合图片的宽高都是videoWid
    // 计算一个组合图片，可以放多少8x8格子
    var rectAmountLine = videoWid / 8;

    // 组合图片，每个的左边的距离
    var leftX = 0;
    var topY = 0;

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
          frameCount++;
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
  }
  var imgCache = {};
  var imgLoadAmount = 0;
  function loadAllPieceImgs() {
    var pathArr = [];
    var loadFn = function(e, i){
      imgCache[i] = e;
      imgLoadAmount++ ;
      if (imgLoadAmount == pieceImgIndex) {
        drawFrameImg(1);
      }
    }
    var loadAllImg = function(imgPath, i) {
      var img = new Image(); //创建一个Image对象，实现图片的预下载
      img.src = imgPath;
      if(img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
        loadFn(img, i);
        return; // 直接返回，不用再处理onload事件
      }
      img.onload = function () { //图片下载完毕时异步调用callback函数。
        loadFn(img, i);
      };
    }
    for (var i = 1;i <= pieceImgIndex; i++) {
      var imgPath = './src/flow_' + i + '.jpg';
      loadAllImg(imgPath, i);
    }
  }
  function drawFrameImg(j) {
    ctx.clearRect(0, 0, videoWid, videoHei);
    ctx.fillStyle = 'rgba(' + backColor + ')';
    ctx.fillRect(0, 0, videoWid, videoHei);
    var curObj = videoObj[j];
    curObj.forEach(function(e) {
      var curImg = imgCache[e.curImg];
      ctx.drawImage(curImg, e.x, e.y, e.w, e.h, e.tx, e.ty, e.w, e.h);
    });
  }
  var currentFrameIndex = 1;
  var currentTime = 0;
  var playFlag = false;
  function v_load() {
    currentFrameIndex = 1;
    currentTime = 0;
    playFlag = false;
    pauseFlag = true;
    drawFrameImg(currentFrameIndex);
    $('.J_now').find('span').html((currentTime / 1000).toFixed(2));
  }
  function v_play() {
    pauseFlag = false;
    if (playFlag) {
      return false;
    }
    playFlag = true;
    var loopPlay = function() {
      if (pauseFlag) {
        return false;
      }
      currentFrameIndex++;
      drawFrameImg(currentFrameIndex);
      currentTime = currentTime + frameSeconds;
      $('.J_now').find('span').html((currentTime / 1000).toFixed(2));
      if (currentFrameIndex == frameCount) {
        playFlag = false;
      } else {
        setTimeout(loopPlay, frameSeconds);
      }
    }
    setTimeout(loopPlay, frameSeconds);
  }

  var pauseFlag = false;
  function v_pause() {
    pauseFlag = true;
    playFlag = false;
  }

  function v_for() {
    pauseFlag = true;
    playFlag = false;

    currentFrameIndex = currentFrameIndex + parseInt(100/frameSeconds);
    if (currentFrameIndex > frameCount) {
       currentFrameIndex = frameCount;
       return false;
    }
    currentTime = currentTime + 100;
    drawFrameImg(currentFrameIndex);
    $('.J_now').find('span').html((currentTime / 1000).toFixed(2));
  }
  function v_back() {
    pauseFlag = true;
    playFlag = false;
    currentFrameIndex = currentFrameIndex - parseInt(100/frameSeconds);
    if (currentFrameIndex < 0) {
       currentFrameIndex = 0;
       return false;
    }
    currentTime = currentTime - 100;
    drawFrameImg(currentFrameIndex);
    $('.J_now').find('span').html((currentTime / 1000).toFixed(2));
  }
  function v_reverse() {
    if (playFlag) {
      return false;
    }
    playFlag = true;
    var loopPlay = function() {
      if (pauseFlag) {
        return false;
      }
      currentFrameIndex--;
      if (currentFrameIndex < 0) {
        return false;
      }
      drawFrameImg(currentFrameIndex);
      currentTime = currentTime - frameSeconds;
      $('.J_now').find('span').html((currentTime / 1000).toFixed(2));
      if (currentFrameIndex <= 1) {
        playFlag = false;
      } else {
        setTimeout(loopPlay, frameSeconds);
      }
    }
    setTimeout(loopPlay, frameSeconds);
  }
  $('.J_load').on('click', v_load);
  $('.J_play').on('click', v_play);
  $('.J_pause').on('click', v_pause);
  $('.J_foward').on('click', v_for);
  $('.J_backward').on('click', v_back);
  $('.J_reverse').on('click', v_reverse);
});

