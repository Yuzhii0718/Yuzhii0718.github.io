// live2d_path 参数建议使用绝对路径
//const live2d_path = "https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/";
const live2d_path = "/live2d-widget/";

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
	return new Promise((resolve, reject) => {
		let tag;

		if (type === "css") {
			tag = document.createElement("link");
			tag.rel = "stylesheet";
			tag.href = url;
		}
		else if (type === "js") {
			tag = document.createElement("script");
			tag.src = url;
		}
		if (tag) {
			tag.onload = () => resolve(url);
			tag.onerror = () => reject(url);
			document.head.appendChild(tag);
		}
	});
}

// 加载 waifu.css live2d.min.js waifu-tips.js
if (screen.width >= 768) {
	Promise.all([
		loadExternalResource(live2d_path + "waifu.css", "css"),
		loadExternalResource(live2d_path + "live2d.min.js", "js"),
		loadExternalResource(live2d_path + "waifu-tips.js", "js")
	]).then(() => {
		// 配置选项的具体用法见 README.md
		initWidget({
			waifuPath: live2d_path + "waifu-tips.json",
			//apiPath: "https://live2d.fghrsh.net/api/",
			cdnPath: "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/",
			// tools: ["hitokoto", "asteroids", "switch-model", "switch-texture", "photo", "info", "quit"]
			tools: ["hitokoto", "asteroids", "switch-model", "photo", "quit"]
		});
	});
}

/*
console.log(`
  く__,.ヘヽ.        /  ,ー､ 〉
		   ＼ ', !-─‐-i  /  /´
		   ／｀ｰ'       L/／｀ヽ､
		 /   ／,   /|   ,   ,       ',
	   ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
		ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
		  !,/7 '0'     ´0iソ|    |
		  |.从"    _     ,,,, / |./    |
		  ﾚ'| i＞.､,,__  _,.イ /   .i   |
			ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
			  | |/i 〈|/   i  ,.ﾍ |  i  |
			 .|/ /  ｉ：    ﾍ!    ＼  |
			  kヽ>､ﾊ    _,.ﾍ､    /､!
			  !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
			  ﾚ'ヽL__|___i,___,ンﾚ|ノ
				  ﾄ-,/  |___./
				  'ｰ'    !_,.:
`);
*/

const imageDoge = [
	'░░░░░░░█▐▓▓░████▄▄▄█▀▄▓▓▓▌█░░░',
	'░░░░░▄█▌▀▄▓▓▄▄▄▄▀▀▀▄▓▓▓▓▓▌█░░░',
	'░░░▄█▀▀▄▓█▓▓▓▓▓▓▓▓▓▓▓▓▀░▓▌█░░░',
	'░░█▀▄▓▓▓███▓▓▓███▓▓▓▄░░▄▓▐█▌░░',
	'░█▌▓▓▓▀▀▓▓▓▓███▓▓▓▓▓▓▓▄▀▓▓▐█░░',
	'▐█▐██▐░▄▓▓▓▓▓▀▄░▀▓▓▓▓▓▓▓▓▓▌█░░',
	'█▌███▓▓▓▓▓▓▓▓▐░░▄▓▓███▓▓▓▄▀▐█░',
	'█▐█▓▀░░▀▓▓▓▓▓▓▓▓▓██████▓▓▓▓▐█░',
	'▌▓▄▌▀░▀░▐▀█▄▓▓██████████▓▓▓▌█▌',
	'▌▓▓▓▄▄▀▀▓▓▓▀▓▓▓▓▓▓▓▓█▓█▓█▓▓▌█▌',
	'█▐▓▓▓▓▓▓▄▄▄▓▓▓▓▓▓█▓█▓█▓█▓▓▓▐█░',
];

console.log('%c' + '\n' + imageDoge.join('\n') + '\n', 'color: #FFCA28; background: #030307;');

const imageCiallo = [
	'	 ██████╗██╗ █████╗ ██╗     ██╗      ██████╗     ██╗    ',
	'	██╔════╝██║██╔══██╗██║     ██║     ██╔═══██╗    ██║    ',
	'	██║     ██║███████║██║     ██║     ██║   ██║    ██║    ',
	'	██║     ██║██╔══██║██║     ██║     ██║   ██║    ╚═╝    ',
	'	╚██████╗██║██║  ██║███████╗███████╗╚██████╔╝    ██╗    ',
	'	 ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝     ╚═╝    ',
	'                     Ciallo~(∠・ω< )⌒★ !                  ',
	'					 欢迎来到 Yuzhii 的博客					 ',
];

console.log(imageCiallo.join('\n'));

const Yuzhii_VERSION = '3.0.0';
const Yuzhii_UPDATE = '240210';
console.log('\n' + ' %c Yuzhii v' + Yuzhii_VERSION + '-' + Yuzhii_UPDATE + ' %c https://yuzhii0718.github.io ' + '\n', 'color: #fadfa3; background: #030307; padding:5px 0;', 'background: #fadfa3; padding:5px 0;');

const CoreVersion = [
	' [HEXO_VERSION] = 6.3.0',
	' [NEXT_THEME_VERSION] = 8.19.1',
]

console.log(CoreVersion.join('\n'));