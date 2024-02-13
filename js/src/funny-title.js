// FunnyTitle
// var OriginTitle = document.title;
// 获取原来的网站 title OriginTitle，因为存在pjax，所以这里不能直接获取

let titleTime;
let favicon = document.querySelector('link[rel="icon"]');
let OriginTitle = document.title;

document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        // 恢复原来的 favicon
        favicon.href = favicon.dataset.favicon;
        document.title = ' Ciallo~(≧∇≦)ﾉ' + OriginTitle;
        clearTimeout(titleTime);
    }
    else {
        favicon.href = favicon.dataset.favicon;
        document.title = 'ヾ(Ő∀Ő3)ノ欢迎回来！' + OriginTitle;
        titleTime = setTimeout(function () {
            document.title = OriginTitle;
        }, 2000);
    }
});

// 监控 pjax 完成事件
document.addEventListener('pjax:complete', function () {
    // 重新获取 favicon
    favicon = document.querySelector('link[rel="icon"]');
    OriginTitle = document.title;
});
