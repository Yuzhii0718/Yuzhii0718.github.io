const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: false,
    autoplay: false,
    theme: '#b7daff',
    loop: 'all',
    order: 'list',
    preload: 'auto',
    volume: 0.7,
    mutex: true,
    listFolded: false,
    listMaxHeight: '200px',
    lrcType: 3,
    audio: [
      {
        name: "Plastic Love",
//        artist: '情歌',
        url: 'http://music.163.com/outchain/player?type=2&id=408328190',
//        cover: '/music/cover/兩隻老虎.jpg',
//        lrc: '/music/lyrics/兩隻老虎.lrc',
      },
/*      {
        name: '哥哥爸爸真偉大',
        artist: '兒歌',
        url: 'https://XXX.mp3',
        cover: '/music/cover/哥哥爸爸真偉大.jpg',
        lrc: '/music/lyrics/哥哥爸爸真偉大.lrc'
      }
*/
    ]
});