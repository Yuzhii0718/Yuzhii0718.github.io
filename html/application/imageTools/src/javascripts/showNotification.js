// 显示通知
function showNotification(message, type = 'success', duration = 3000) {
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.background = type === 'success' ? 'rgba(40, 167, 69, 0.9)' : 'rgba(220, 53, 69, 0.9)';
    notification.style.whiteSpace = 'pre-line';
    notification.style.textAlign = 'center';
    notification.style.padding = '20px';
    notification.style.fontSize = '16px';
    notification.style.lineHeight = '1.5';

    setTimeout(() => {
        notification.style.display = 'none';
    }, duration);
}