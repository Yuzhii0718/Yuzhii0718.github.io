// FunnyTitle
var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        $('[rel="icon"]').attr('href', "/images/icon/favicon.svg");
        document.title = ' Ciallo~(∠・ω< )⌒★ ! ' + OriginTitle;
        clearTimeout(titleTime);
    }
    else {
        $('[rel="icon"]').attr('href', "/images/icon/favicon.svg");
        document.title = 'ヾ(Ő∀Ő3)ノ欢迎回来！' + OriginTitle;
        titleTime = setTimeout(function () {
            document.title = OriginTitle;
        }, 2000);
    }
});