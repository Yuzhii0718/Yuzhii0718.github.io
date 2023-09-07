// 0.开启严格模式
'use strict';

// 获取content元素
let content = document.getElementById('content');

// 1. 获取资讯导航栏元素
let info = document.getElementById('info');
// 2. 获取资讯导航栏中的所有a标签
let infoAs = info.getElementsByTagName('a');

// 实现点击顶部资讯导航栏，替换content为资讯的内容
// 4. 为每个a标签绑定点击事件
for (let i = 0; i < infoAs.length; i++) {
    // 4.1 获取当前遍历到的a标签
    let infoA = infoAs[i];
    // 4.2 为当前遍历到的a标签绑定点击事件
    infoA.onclick = function () {
        // 4.2.1 获取当前点击的a标签的href属性值
        let href = this.getAttribute('href');
        // 4.2.2 判断href的值是否为#
        if (href === '#') {
            // 为#，则不跳转
            return false;
        } else {
            // // 不为#，则跳转
            // 将页面标题设置为 资讯
            document.title = '资讯';
            // 4.2.3 将content的内容替换为iframe
            content.innerHTML = '<iframe src="./source/information.html"></iframe>';
            // 调整iframe的大小
            let iframe = document.getElementsByTagName('iframe')[0];
            iframe.style.height = '100%';
            iframe.style.width = '100%';
            // 除去iframe的边框
            iframe.style.border = 'none';
            // 4.2.4 阻止默认行为
            return false;
        }
    }
}


// 实现点击顶部资讯导航栏，替换content为关于的内容
// 1. 获取资讯导航栏元素
let about = document.getElementById('about');
// 2. 获取资讯导航栏中的所有a标签
let aboutAs = about.getElementsByTagName('a');

// 4. 为每个a标签绑定点击事件
for (let i = 0; i < aboutAs.length; i++) {
    // 4.1 获取当前遍历到的a标签
    let aboutA = aboutAs[i];
    // 4.2 为当前遍历到的a标签绑定点击事件
    aboutA.onclick = function () {
        // 4.2.1 获取当前点击的a标签的href属性值
        let href = this.getAttribute('href');
        // 4.2.2 判断href的值是否为#
        if (href === '#') {
            // 为#，则不跳转
            return false;
        } else {
            // // 不为#，则跳转
            // 将页面标题设置为 关于
            document.title = '关于';
            // 4.2.3 将content的内容替换为iframe
            content.innerHTML = '<iframe src="./source/about.html"></iframe>';
            // 调整iframe的大小
            let iframe = document.getElementsByTagName('iframe')[0];
            iframe.style.height = '100%';
            iframe.style.width = '100%';
            // 除去iframe的边框
            iframe.style.border = 'none';
            // 4.2.4 阻止默认行为
            return false;
        }
    }
}


// 点击首页后，清除iframe，加载页面原来的内容
// 1. 获取首页元素
let home = document.getElementById('home');
// 2. 获取首页中的a标签
let homeA = home.getElementsByTagName('a')[0];
// 3. 为a标签绑定点击事件
homeA.onclick = function () {
    // 3.1 将页面标题设置为 应用中心
    document.title = '应用中心';

    content.innerHTML =
        '        <div id="content-top"><h1>应用中心</h1></div>\n' +
        '        <div id="content-box-1">\n' +
        '            <div class="content-app">\n' +
        '                <a href="application/Matrix/Matrix.html" target="_blank" class="app-title" id="app1">屏幕测试</a>\n' +
        '                <p class="app-tag">工具</p>\n' +
        '            </div>\n' +
        '            <div class="content-app">\n' +
        '                <a href="application/FlexAlbum/FlexAlbum.html" target="_blank" class="app-title" id="app2">相册</a>\n' +
        '                <p class="app-tag">媒体</p>\n' +
        '            </div>\n' +
        '            <div class="content-app">\n' +
        '                <a href="application/Video/Video.html" target="_blank" class="app-title" id="app3">视频</a>\n' +
        '                <p class="app-tag">媒体</p>\n' +
        '            </div>\n' +
        '            <div class="content-app">\n' +
        '                <a href="application/Playlist/Playlist.html" target="_blank" class="app-title" id="app4">歌单</a>\n' +
        '                <p class="app-tag">媒体</p>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div id="content-box-2">\n' +
        '            <div class="content-app">\n' +
        '                <a href="application/ShuangPin/index.html" target="_blank" class="app-title" id="app5">双拼</a>\n' +
        '                <p class="app-tag">工具</p>\n' +
        '            </div>\n' +
        '            <div class="content-app">\n' +
        '                <a href="https://www.chaip.org/" target="_blank" class="app-title"\n' +
        '                   id="app6">IP检查<p style="color: #fff;line-height: 5px" class="third">第三方</p></a>\n' +
        '                <p class="app-tag">工具</p>\n' +
        '            </div>\n' +
        '            <div class="content-app">\n' +
        '                <a href="https://c.runoob.com/" target="_blank" class="app-title"\n' +
        '                   id="app7">菜鸟工具<p style="color: #fff;line-height: 5px" class="third">第三方</p></a>\n' +
        '                <p class="app-tag">工具</p>\n' +
        '            </div>\n' +
        '            <div class="content-app">\n' +
        '                <a href="/404" target="_blank" class="app-title"\n' +
        '                   id="app8">敬请期待</a>\n' +
        '                <p class="app-tag">暂未开放</p>\n' +
        '            </div>\n' +
        '        </div>'
}
