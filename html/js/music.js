const ap = new APlayer({
    container: document.getElementById('aplayer'),
    loop: 'all',
    /*    listMaxHeight: '200px',*/
    fixed: false,                //是否附着页面底部，否为false
    mini: true,                 //是否默认最小化，否为false
    autoplay: false,             //是否自动播放，否为false,移动端不能生效
    volume: 0.6,                //初始音量（0~1）
    lrcType: 3,                 //歌词模式（1、HTML模式 2、js模式 3、lrc文件模式）
    mutex: true,                //互斥模式：阻止多个播放器同时播放，当前播放器播放时暂停其他播放器
    order: 'random',            //音频循环顺序（'list'：顺序, 'random'：随机）
    preload: 'none',            //预加载（'none'：不预加载, 'metadata'：元数据, 'auto'：自动）
    listFolded: false,          //列表默认折叠，开启为true
    theme: '#ee8243',           //主题颜色
    audio: [
        {
            name: '夢の続き~Dreams Of Light~',
            artist: 'Night Tempo',
            url: '../playlist/music/夢の続き~Dreams Of Light~.mp3',
            cover: 'https://p2.music.126.net/jwcRCDsVaOBny4gF2Dxd5g==/109951163551198739.jpg',
            lrc: ''
        },
        {
            name: 'バニラと美里BIG CITY NIGHTS',
            artist: 'MACROSS 82-99',
            url: '../playlist/music/バニラと美里BIG CITY NIGHTS.mp3',
            cover: 'https://p1.music.126.net/YCXlA4HABRN5QIuayJSpUw==/1351299790597565.jpg',
            lrc: ''
        },
        {
            name: '夏 日 舞 池 Say so',
            artist: 'G H C / Reirei',
            url: '../playlist/music/夏 日 舞 池 Say so.mp3',
            cover: 'https://p2.music.126.net/3jvksqLTTyvCT-QZY6ts6w==/109951165007436862.jpg',
            lrc: ''
        },
        {
            name: 'Miki',
            artist: 'Night Tempo',
            url: '../playlist/music/Miki.mp3',
            cover: 'https://p2.music.126.net/KfkIAVlV7_qiyCacZeh8uw==/109951165123076643.jpg',
            lrc: ''
        },
        {
            name: 'Give Me Up',
            artist: 'LINBi / Chypy。 / BaBe',
            url: '../playlist/music/Give Me Up.mp3',
            cover: 'https://p1.music.126.net/Nniw3L6aGh5UIWjIo9Q5SQ==/109951164247132165.jpg',
            lrc: ''
        },
        {
            name: 'Horsey (feat. Sarah Bonito)',
            artist: 'LINBi / Chypy。 / BaBe',
            url: '../playlist/music/Horsey (feat. Sarah Bonito).mp3',
            cover: 'https://p1.music.126.net/jMrPVK8cTsivlBlT0LsbLg==/6029721767076144.jpg',
            lrc: ''
        }
    ]
});

// 判断页面高度，小于700px时隐藏播放器,大于700px时显示播放器
setInterval(function () {
    let bodyheight = document.documentElement.clientHeight
    let bodywidth = document.documentElement.clientWidth
    let aplayer = document.getElementById("aplayer");
    let footer = document.getElementsByClassName("footer");
    let third = document.getElementsByClassName("third");
    let thirdlength = third.length;
    if (bodyheight < 700 || bodywidth < 1000) {
        aplayer.style.display = footer[0].style.display = "none";
        for (let i = 0; i < thirdlength; i++) {
            third[i].style.display = "none";
        }

    } else {
        aplayer.style.display = footer[0].style.display = "block";
        for (let i = 0; i < thirdlength; i++) {
            third[i].style.display = "block";
        }
    }
}, 500);

// const meting_api = 'https://api.injahow.cn/meting/?server=:server&type=:type&id=:id&auth=:auth&r=:r';

