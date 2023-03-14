const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
    autoplay: false,
    theme: '#00897B',
    loop: 'all',
    order: 'list',
    preload: 'auto',
    volume: 0.7,
    mutex: true,
    listFolded: false,
    listMaxHeight: '200px',
    lrcType: 3,
    audio: 
	[
		{
            name: '夢の続き~Dreams Of Light~',
            artist: 'Night Tempo',
            url: '/playlist/music/夢の続き~Dreams Of Light~.mp3',
            cover: 'http://p2.music.126.net/jwcRCDsVaOBny4gF2Dxd5g==/109951163551198739.jpg',
			lrc: ''
		},
		{
            name: 'バニラと美里BIG CITY NIGHTS',
            artist: 'マクロスMACROSS 82-99',
            url: '/playlist/music/バニラと美里BIG CITY NIGHTS.mp3',
            cover: 'http://p1.music.126.net/YCXlA4HABRN5QIuayJSpUw==/1351299790597565.jpg',
			lrc: ''
		},		
		{
            name: '夏 日 舞 池 Say so',
            artist: 'G H C / Reirei',
            url: '/playlist/music/夏 日 舞 池 Say so.mp3',
            cover: 'http://p2.music.126.net/3jvksqLTTyvCT-QZY6ts6w==/109951165007436862.jpg',
			lrc: ''
		},		
		{
            name: 'Miki',
            artist: 'Night Tempo',
            url: '/playlist/music/Miki.mp3',
            cover: 'http://p2.music.126.net/KfkIAVlV7_qiyCacZeh8uw==/109951165123076643.jpg',
			lrc: ''
		},		
		{
            name: 'Give Me Up',
            artist: 'LINBi / Chypy。 / BaBe',
            url: '/playlist/music/Give Me Up.mp3',
            cover: 'http://p1.music.126.net/Nniw3L6aGh5UIWjIo9Q5SQ==/109951164247132165.jpg',
			lrc: ''
		},		
		{
            name: 'Horsey (feat. Sarah Bonito)',
            artist: 'LINBi / Chypy。 / BaBe',
            url: '/playlist/music/Horsey (feat. Sarah Bonito).mp3',
            cover: 'http://p1.music.126.net/jMrPVK8cTsivlBlT0LsbLg==/6029721767076144.jpg',
			lrc: ''
		}
	]
});