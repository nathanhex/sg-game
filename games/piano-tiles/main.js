window.onload = function() {
    // 绘图
    function draw(){
        gd.clearRect(0, 0, width, height);
        for(let r = 0; r < data.length; ++r){
            for(let c = 0; c < data[r].length; ++c){
                if(data[r][c] === 0)
                    gd.fillStyle='#fff';
                else
                    gd.fillStyle='#000';
                gd.fillRect(c*block_w, top+r*block_h, block_w, block_h);

                gd.strokeStyle='#aaa';  // 轮廓
                gd.strokeRect(c*block_w, top+r*block_h, block_w, block_h);
            }
        }
    }

    // 产生一行
    function createLine(){
        let tmp = [];
        for(let i = 0; i < C; ++i){
            tmp[i] = 0;
        }
        tmp[Math.floor(Math.random()*C)] = 1;
        return tmp;
    }

    // 初始化游戏
    function initGame(){
        // 初始化数据
        top = -block_h;
        speed = 1.0;
        data = [];
        for(let i = 0; i < R+1; ++i){
            data.push(createLine());
        }
        // 画图
        draw();
        // 打开定时器
        timer = setInterval(function(){
            top += speed;
            draw();
            if(top >= 0){
                let row = data.pop();       // 删一行
                if(row.includes(1)){
                    clearInterval(timer);
                    alert(`得分:${Math.round((speed-1.0)*5)}游戏结束！`);
                    oDiv.style.display = 'block';
                }
                data.unshift(createLine()); // 新生成一行
                top = -block_h;
            }
        }, 16);
    }
  
    window.onresize = function() {
        let w = document.documentElement.clientWidth,
            h = document.documentElement.clientHeight;
        if(w > h){  // 防止横屏时太丑
            w=h;
        }
        oC.width = w;
        oC.height = h;
        oC.style.width = w+'px';
        oC.style.height = h+'px';
        oDiv.style.width = w+'px';
        oDiv.style.height = h+'px';
    }

    // 准备阶段
    let oC = document.getElementById('c1');
    let gd = oC.getContext('2d');
    let oDiv = document.getElementById('div1');
    let oBtn = document.getElementById('btn1');

    window.onresize();

    const {width, height} = oC;
    const R=4, C=4;
    const block_w = width/C, block_h = height/R;
    let timer;
    let data = [];
    let top;
    let speed;

    initGame();

    // 消除白块
    oC.addEventListener('touchstart', function(ev){
        let x = ev.targetTouches[0].clientX,
            y = ev.targetTouches[0].clientY;
        let r = Math.floor((y-top) / block_h),
            c = Math.floor(x / block_w);
        if(data[r][c] === 0){
            clearInterval(timer);   // 关闭定时器
            alert(`得分:${Math.round((speed-1.0)*5)}游戏结束！`);
            oDiv.style.display='block';
        }else{
            data[r][c] = 0;     // 黑块置白
            draw();             // 重绘
            speed += 0.2;       // 增加速度
        }
    }, false);
    // 再来一局
    oBtn.onclick = function(){
        oDiv.style.display='none';
        initGame();
    }
};
