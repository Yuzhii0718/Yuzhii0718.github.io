// 显示通知
function showNotification(message, type = 'success', duration = 3000) {
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.background = type === 'success'
        ? 'rgba(22, 163, 74, .95)'
        : 'rgba(220, 38, 38, .95)';
    // 触发动画重置
    notification.style.animation = 'none';
    void notification.offsetWidth;
    notification.style.animation = 'fadeInOut ' + duration + 'ms ease';

    setTimeout(() => {
        notification.style.display = 'none';
    }, duration);
}
