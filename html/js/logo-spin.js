// path: js\logo-spin.js
// 1. 获取logo元素
const logo = document.querySelector('.logo');
// 2. 为#logo元素绑定鼠标进入事件
document.querySelector('#logo').onmouseenter = function () {
    // 2.1 让logo旋转
    logo.style.transform = 'rotate(360deg)';
    // 2.2 让logo旋转一周
    logo.style.transition = 'transform 0.3s';
};
// 3. 为#logo元素绑定鼠标离开事件
document.querySelector('#logo').onmouseleave = function () {
    // 3.1 让logo停止旋转
    logo.style.transform = 'rotate(0deg)';
    // 3.2 让logo停止旋转
    logo.style.transition = 'transform 0s';
};
