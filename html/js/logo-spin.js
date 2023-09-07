// 当鼠标移动到header上时，logo会旋转，当鼠标移开时，logo会停止旋转。
// 并且点击logo时，logo会旋转一周。

// path: js\logo-spin.js

// 0. 启用严格模式
'use strict';
// 1. 获取logo元素
let logo = document.querySelector('.logo');
// 2. 为header元素绑定鼠标进入事件
document.querySelector('.header').onmouseenter = function () {
    // 2.1 让logo旋转
    logo.style.transform = 'rotate(360deg)';
    // 2.2 让logo旋转一周
    logo.style.transition = 'transform 0.3s';
}
// 3. 为header元素绑定鼠标离开事件
document.querySelector('.header').onmouseleave = function () {
    // 3.1 让logo停止旋转
    logo.style.transform = 'rotate(0deg)';
    // 3.2 让logo停止旋转
    logo.style.transition = 'transform 0s';
}
// 4. 为logo元素绑定鼠标点击事件
logo.onclick = function () {
    // 4.1 让logo旋转一周
    logo.style.transform = 'rotate(360deg)';
    // 4.2 让logo旋转一周
    logo.style.transition = 'transform 0.3s';
}
