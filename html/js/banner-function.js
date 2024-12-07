// 使用js实现自动切换banner
// 模拟点击事件，实现自动切换

// path: js\banner-function.js

// 0.开启严格模式
'use strict';
// 1. 获取input元素
let inputs = document.getElementsByTagName('input');
// 2. 获取label元素
// let labels = document.getElementsByTagName('label');
// 3. 定义一个变量，用于记录当前显示的图片的索引
let index = 0;
// 4. 定义一个变量，用于记录定时器的id
let timerId = null;

// 5. 定义一个函数，用于切换图片
function switchImg() {
    // 5.1 让index自增
    index++;
    // 5.2 判断index的值
    if (index >= inputs.length) {
        index = 0;
    }
    // 5.3 模拟点击事件
    inputs[index].checked = true;
}

// 6. 启动定时器
timerId = setInterval(switchImg, 3000);
// 7. 为main元素绑定鼠标进入事件
document.getElementById('main').onmouseenter = function () {
    // 7.1 清除定时器
    clearInterval(timerId);
}
// 8. 为main元素绑定鼠标离开事件
document.getElementById('main').onmouseleave = function () {
    // 8.1 启动定时器
    timerId = setInterval(switchImg, 3000);
}
