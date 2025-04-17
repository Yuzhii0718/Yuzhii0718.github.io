// 从config.json中获取配置

// 注意，这需要异步加载，否则将显示 undefined
fetch('/html/common/config.json')
    .then(response => response.json())
    .then(data => {
        // 从配置中获取需要的信息
        window.Version = data.Version;
        window.Year = data.Year;
        window.author = data.author;
        window.email = data.email;
        window.copyright = {
            text: data.copyright.text,
            url: data.copyright.url
        };
        window.beian = {
            text: data.beian.text,
            url: data.beian.url
        };
        // 更新标题
        window.maintitle = data.maintitle;
        // 图标
        window.icon16 = data.icon16;
        window.icon32 = data.icon32;
        window.maskicon = data.maskicon;
        // 社交链接
        window.github = {
            text: data.github.text,
            url: data.github.url
        };
        window.twitter = {
            text: data.twitter.text,
            url: data.twitter.url
        };
        window.v2ex = {
            text: data.v2ex.text,
            url: data.v2ex.url
        };
        window.facebook = {
            text: data.facebook.text,
            url: data.facebook.url
        };
        // 点击email
        window.clickemail = {
            text: data.email,
            url: data.click_email.url
        };
        // 文字内容
        window.sbp1 = data.sbp1.text;
        window.sbp2 = data.sbp2.text;
        window.sbs1 = data.sbs1.text;
        window.sbs2 = data.sbs2.text;
        window.sbs3 = data.sbs3.text;
        window.sbs4 = data.sbs4.text;

        // 其他
        window.easteregg = {
            value: data.easteregg.value,
            js: data.easteregg.js,
            css: data.easteregg.css,
            text: data.easteregg.text
        };

        console.log('Version:', window.Version);

        // 触发自定义事件
        let event = new Event('configLoaded');
        document.dispatchEvent(event);
    })
    .catch(error => console.error('Error:', error));

// 监听自定义事件
document.addEventListener('configLoaded', function () {

    // 更新文字内容
    function updateInnerHTML(id, content) {
        let element = document.getElementById(id);
        if (element) {
            element.innerHTML += content;
        }
    }

    updateInnerHTML('version', window.Version);
    updateInnerHTML('year', window.Year);
    updateInnerHTML('author', window.author);
    // updateInnerHTML('email', window.email);
    updateInnerHTML('sbp1', window.sbp1);
    updateInnerHTML('sbp2', window.sbp2);
    updateInnerHTML('sbs1', window.sbs1);
    updateInnerHTML('sbs2', window.sbs2);
    updateInnerHTML('sbs3', window.sbs3);
    updateInnerHTML('sbs4', window.sbs4);

    // 更新链接
    function updateLink(id, text, url) {
        let element = document.getElementById(id);
        if (element) {
            element.innerHTML += `
            <a style="text-decoration:none" href="${url}" target="_blank">${text}</a>
        `;
        }
    }

    updateLink('copyright', window.copyright.text, window.copyright.url);
    updateLink('beian', window.beian.text, window.beian.url);
    updateLink('github', window.github.text, window.github.url);
    updateLink('twitter', window.twitter.text, window.twitter.url);
    updateLink('v2ex', window.v2ex.text, window.v2ex.url);
    updateLink('facebook', window.facebook.text, window.facebook.url);
    updateLink('email', window.clickemail.text, window.clickemail.url);

    // 更新标题
    if (document.getElementsByTagName('title')[0]) {
        document.getElementsByTagName('title')[0].innerHTML = window.maintitle;
        document.title = window.maintitle;
        document.getElementById('appcenter').innerHTML = window.maintitle;
    }

    // 更新链接函数
    function updateLinkHref(id, href) {
        let element = document.querySelector(id);
        if (element) {
            element.href = href;
        }
    }

    // 监听自定义事件
    document.addEventListener('configLoaded', function () {
        // 更新彩蛋
        if (document.getElementById('easteregg')) {
            // <button type="button" ${value} ${js}>text</button>
            let element = document.getElementById('easteregg');
            element.innerHTML += `
            <button type="button" ${window.easteregg.value} ${window.easteregg.js}>${window.easteregg.text}</button>
        `;
        }

        console.log('configLoaded event dispatched');
    });
});