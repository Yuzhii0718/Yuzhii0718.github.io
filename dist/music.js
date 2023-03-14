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
            url: 'http://m10.music.126.net/20230314232356/12eecbd6634d92cac8563920bdbaec14/ymusic/00ab/e705/fd75/51e25f76ef4f067ecae6e5b3000105df.mp3',
            cover: 'http://p2.music.126.net/jwcRCDsVaOBny4gF2Dxd5g==/109951163551198739.jpg',
			lrc: ''
		},
		{
            name: 'バニラと美里BIG CITY NIGHTS',
            artist: 'マクロスMACROSS 82-99',
            url: 'http://m701.music.126.net/20230314232830/2af48f1674b47bd02ec71f7ad3fd6486/jdymusic/obj/w5zDlMODwrDDiGjCn8Ky/2118742646/bd05/d629/1677/d7f758a99bea99f900903bc1c0645a3b.mp3',
            cover: 'http://p1.music.126.net/YCXlA4HABRN5QIuayJSpUw==/1351299790597565.jpg',
			lrc: ''
		},		
		{
            name: '夏 日 舞 池 Say so',
            artist: 'G H C / Reirei',
            url: 'http://m10.music.126.net/20230314233025/2e326e7127e8d1e7b2e929fa9840ebad/ymusic/obj/w5zDlMODwrDDiGjCn8Ky/2618358268/1511/d257/073d/153df6b2b1e4d557dd37096d6568c95c.mp3',
            cover: 'http://p2.music.126.net/3jvksqLTTyvCT-QZY6ts6w==/109951165007436862.jpg',
			lrc: ''
		},		
		{
            name: 'Miki',
            artist: 'Night Tempo',
            url: 'http://m10.music.126.net/20230314233219/3319fab374707fd0394bb0b669ab289d/ymusic/obj/w5zDlMODwrDDiGjCn8Ky/3288327938/722b/a29d/5137/79e751b01aa973b59f69b4fc1fa506bd.mp3',
            cover: 'http://p2.music.126.net/KfkIAVlV7_qiyCacZeh8uw==/109951165123076643.jpg',
			lrc: ''
		},		
		{
            name: 'Give Me Up',
            artist: 'LINBi / Chypy。 / BaBe',
            url: 'http://m10.music.126.net/20230314233451/b5c6152c23baeaf025a09f76885ad1de/ymusic/0709/0453/070b/0c17f194db39b758816a0a582562f4f5.mp3',
            cover: 'http://p1.music.126.net/Nniw3L6aGh5UIWjIo9Q5SQ==/109951164247132165.jpg',
			lrc: ''
		},		
		{
            name: 'Horsey (feat. Sarah Bonito)',
            artist: 'LINBi / Chypy。 / BaBe',
            url: 'http://m10.music.126.net/20230314233616/681edbb8287d2a3d8adc73a9bcab59f1/ymusic/3426/7a9f/bedb/2c24d4a89a3e38d342d2dd6b8798940a.mp3',
            cover: 'http://p1.music.126.net/jMrPVK8cTsivlBlT0LsbLg==/6029721767076144.jpg',
			lrc: ''
		}
	]
});