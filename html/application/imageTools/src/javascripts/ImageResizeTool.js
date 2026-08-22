const maintainAspect = document.getElementById('maintainAspect');
const percentagePanel = document.getElementById('percentagePanel');
const pixelsPanel = document.getElementById('pixelsPanel');
const customPanel = document.getElementById('customPanel');
const percentageInput = document.getElementById('percentageInput');
const pixelsInput = document.getElementById('pixelsInput');

let resizedImageUrl = null;

// 调整模式选择
const resizeOptions = document.querySelectorAll('.resize-option');

resizeOptions.forEach(option => {
    option.addEventListener('click', () => {
        resizeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        const mode = option.dataset.mode;
        percentagePanel.style.display = 'none';
        pixelsPanel.style.display = 'none';
        customPanel.style.display = 'none';

        if (mode === 'custom') {
            customPanel.style.display = 'block';
        } else if (mode === 'percentage') {
            percentagePanel.style.display = 'block';
        } else if (mode === 'pixels') {
            pixelsPanel.style.display = 'block';
        }
    });
});

// 预设按钮：点击直接填入对应输入框
document.querySelectorAll('.preset-buttons').forEach(group => {
    const targetId = group.dataset.target;
    const target = document.getElementById(targetId);
    if (!target) return;

    group.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            target.value = btn.dataset.value;
            target.focus();
        });
    });
});

// 保持宽高比
maintainAspect.addEventListener('change', () => {
    if (maintainAspect.checked && originalWidth && originalHeight) {
        const ratio = originalWidth / originalHeight;
        heightInput.value = Math.round(widthInput.value / ratio);
    }
});

widthInput.addEventListener('input', () => {
    if (maintainAspect.checked && originalWidth && originalHeight) {
        const ratio = originalWidth / originalHeight;
        heightInput.value = Math.round(widthInput.value / ratio);
    }
});

heightInput.addEventListener('input', () => {
    if (maintainAspect.checked && originalWidth && originalHeight) {
        const ratio = originalWidth / originalHeight;
        widthInput.value = Math.round(heightInput.value * ratio);
    }
});

// 调整图片尺寸
function resizeImage() {
    if (!originalFile) return;

    const activeMode = document.querySelector('.resize-option.active').dataset.mode;
    let targetWidth, targetHeight;

    if (activeMode === 'custom') {
        targetWidth = parseInt(widthInput.value);
        targetHeight = parseInt(heightInput.value);
    } else if (activeMode === 'percentage') {
        let percentage = parseInt(percentageInput.value, 10);
        if (isNaN(percentage) || percentage < 1) percentage = 1;
        if (percentage > 200) percentage = 200;
        percentageInput.value = percentage;
        percentage = percentage / 100;
        targetWidth = Math.round(originalWidth * percentage);
        targetHeight = Math.round(originalHeight * percentage);
    } else { // pixels mode
        let targetWidthInput = parseInt(pixelsInput.value, 10);
        if (isNaN(targetWidthInput) || targetWidthInput < 1) targetWidthInput = 1;
        pixelsInput.value = targetWidthInput;
        targetWidth = targetWidthInput;
        targetHeight = Math.round(originalHeight * (targetWidth / originalWidth));
    }

    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const resizedDataUrl = canvas.toDataURL(originalFile.type);
        preview.src = resizedDataUrl;
        resizedImageUrl = resizedDataUrl;
        downloadBtns.forEach(btn => { btn.disabled = false; });

        const resizedSize = Math.round((resizedDataUrl.length - 22) * 3 / 4 / 1024);
        const originalSize = Math.round(originalFile.size / 1024);
        const sizeChange = Math.round((1 - resizedSize / originalSize) * 100);

        imageInfo.innerHTML = `
            ${t('info.original_size')}：${originalSize} ${t('info.unit_kb')}<br>
            ${t('info.resized_size')}：${resizedSize} ${t('info.unit_kb')}<br>
            ${t('info.size_change')}：${sizeChange}%<br>
            ${t('info.dimensions')}：${targetWidth} × ${targetHeight} ${t('info.unit_px')}
        `;

        const successMessage = t('resize.success', {
            ow: originalWidth, oh: originalHeight,
            tw: targetWidth, th: targetHeight,
            change: sizeChange
        });

        methodSpan.textContent = 'resized';

        showNotification(successMessage, 'success', 4000);
    };
    img.src = URL.createObjectURL(originalFile);
}
