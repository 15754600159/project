/**
 * Created by 盛夏 on 2016/7/20.
 */
window.onload = function(){
    function $(id){
        return document.getElementById(id);
    }

//获取元素
    var warp = $('warp');
    //var warp = document.getElementById('warp');
    //console.log(warp);
    var menuGame = $('menuGame');
    var start = $('start');
    var content = $('content');
//var li = $('li');
    var bird = $('bird');
    var score = $('score');
    var pipeUl = $('pipes');
    var grass = $('grass');
    var musicGame = $('musicGame');
    var musicBullet = $('musicBullet');
    var musicOver = $('musicOver');
    var menuOver = $('menuOver');
    var nowScore = $('nowScore');
    var bestScore = $('bestScore');

    start.onclick = function(){
        //1.开始菜单消失
        menuGame.style.display = 'none';
        //2.小鸟和分数出现
        bird.style.display = 'block';
        score.style.display = 'block';
        //3.循环播放背景音乐
        musicGame.play();
        musicGame.loop = true;
        //4.草地移动
        setInterval(grassMove,30);
        //5.小鸟下落
        flyTime = setInterval(birdFly,30);
        //6.点击屏幕，让小鸟飞
        content.onclick = function(){
            speed = -8;
            //添加音乐
            musicBullet.play();
        }
        //7.生成管道
        creatPipesTimer = setInterval(creatPipes, 3500);
        //8.判断小鸟和管道是否碰撞
        setInterval(function (){
            //获取li数组
            var lis = pipeUl.getElementsByClassName('pipe');
            var leftB = bird.offsetLeft;
            var rightB = bird.offsetLeft + bird.offsetWidth;
            var topB = bird.offsetTop;
            var bottomB = bird.offsetTop + bird.offsetHeight;
            for(var i=0; i<lis.length; i++){
                var leftL = lis[i].offsetLeft;
                var rightL = lis[i].offsetLeft + lis[i].offsetWidth;
                var topL = lis[i].offsetTop;
                var bottomL = lis[i].offsetTop + lis[i].offsetHeight;
                //上管道的长度（高）
                var topLiUp = parseInt(lis[i].firstElementChild.style.height);
                //判断是否碰撞
                if(rightB > leftL && leftB < rightL){
                    if(topB > topLiUp && bottomB < (topLiUp+120)){

                    }else{
                        //console.log(topB);
                        //console.log(bottomB);
                        //console.log(topLiUp);
                        //console.log('aaaa');
                        gameOver();
                    }
                }
            }
        },15)
    }

    //草地移动
    var grassLeft = 0;
    function grassMove(){
        grassLeft -= 2;
        grass.style.left = grassLeft + 'px';
        if(grassLeft < -343){
            grassLeft = 0;
        }
    }

    //小鸟位置改变
    var speed = 0;
    var pres = 0;
    var flyTime;
    function birdFly(){
        speed += 0.5;
        //设置最大速度
        if(speed > 8){
            speed = 8;
        }
        //birdTop位鸟到顶部的距离
        var birdTop = bird.offsetTop + speed;
        //小鸟上升和下降分别赋予不同的图片
        if (pres > birdTop){
            bird.src = 'img/up_bird.png';
        }else{
            bird.src = 'img/down_bird.png';
        }
        //当小鸟落地时
        if (birdTop > warp.clientHeight - bird.offsetHeight - 100){
            birdTop = warp.clientHeight - bird.offsetHeight - 100;
            //clearInterval(flyTime);
        }
        //当小鸟到顶时
        if (birdTop < 0){
            birdTop = 0;
            //clearInterval(flyTime);
        }
        //修改小鸟的位置
        bird.style.top = birdTop + 'px';
        pres = birdTop;
    }

    //随机函数
    function randomNum(m,n){
        return Math.floor(Math.random()*(n-m+1)+m);
    }
    //生成管道
    var creatPipesTimer;
    function creatPipes(){
        //创建单个管道
        var li = document.createElement('li');
        li.className = 'pipe';
        li.style.left = pipeUl.offsetWidth + 'px';
        pipeUl.appendChild(li);
        //随机上下管道高度
        var topHeight = randomNum(50,250);
        var downHeight = li.offsetHeight - topHeight - 150;
        //创建上下管道
        var top_pipe = document.createElement('div');
        var down_pipe = document.createElement('div');
        top_pipe.className = 'up_pipe';
        down_pipe.className = 'down_pipe';
        top_pipe.style.height = topHeight + 'px';
        down_pipe.style.height = downHeight + 'px';
        li.appendChild(top_pipe);
        li.appendChild(down_pipe);
        //管道移动
        var distance = pipeUl.clientWidth;
        var pipeMoveTimer = setInterval(function (){
            distance--;
            li.style.left = distance + 'px';
            //当管道移除屏幕时，去除管道元素，并停止相关计时器
            if (distance < -li.offsetWidth){
                clearInterval(pipeMoveTimer);
                pipeUl.removeChild(li);
            }
            //管道移除屏幕，即得1分
            if(distance == 0){
                changeScore();
            }
        },15)
    }

    //得分
    var num = 0;
    function changeScore(){
        num++;
        //清楚图片
        score.innerHTML = '';
        //添加图片
        if (num<10){
            var img = document.createElement('img');
            img.src = 'img/'+ num + '.jpg';
            score.appendChild(img);
        }else{
            //两位数的分数
            //十位数
            score.style.left = '160px';
            var img1 = document.createElement('img');
            img1.src = 'img/' + Math.floor(num/10) + '.jpg';
            score.appendChild(img1);
            //个位数
            var img2 = document.createElement('img');
            img2.src = 'img/' + (num%10) + '.jpg';
            score.appendChild(img2);
        }
    }

    //结束游戏
    function gameOver(){
        //结束界面
        menuOver.style.display = 'block';
        $('restart').style.display = 'block';
        menuOver.style.zIndex = '3';
        //背景音乐消失
        musicGame.pause();
        //结束音乐播放
        musicOver.play();
        //停止所有计时器
        var end = setInterval(function (){},1);
        for (var i=1; i<=end; i++){
            clearInterval(i);
        }
        //console.log(num);
        //显示得分
        nowScore.innerHTML = num;
        //获取最后成绩
        if(localStorage.bestScore){
            var a = localStorage.bestScore > num ? localStorage.bestScore : num;
            bestScore.innerHTML = num;
            localStorage.bestScore = num;
        }else{
            localStorage.bestScore = num;
        }
    }

    //刷新页面
    var btn = document.getElementById("restart");
    btn.addEventListener("click", function() {
        window.location.reload();
    });



}
