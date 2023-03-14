const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
    autoplay: false,
    theme: '#b7daff',
    loop: 'all',
    order: 'list',
    preload: 'auto',
    volume: 0.7,
    mutex: true,
    listFolded: true,
    listMaxHeight: '200px',
    lrcType: 3,
    audio: 
	[
		{
            name: 'Plastic Love (TARA Bootleg)',
            artist: 'TARA',
            url: 'http://m10.music.126.net/20230314215022/83f7f9fdf0fe76006647f17aa8f3c3cb/ymusic/da73/ab3e/8e80/e1faa1baba5c22092c76bcc43a91d30f.mp3',
            cover: 'http://p1.music.126.net/Kg5_jhvDWx24dtrELHCXGA==/1394180748278530.jpg',
			lrc: ''
		}
	]
});