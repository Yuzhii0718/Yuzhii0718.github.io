const compressQualitySlider = document.getElementById('compressQualitySlider');
const compressQualityValue = document.getElementById('compressQualityValue');

let compressedImageUrl = null;

// 压缩模式选择
const compressionOptions = document.querySelectorAll('.compression-option');
const settingsPanel = document.getElementById('settingsPanel');

compressionOptions.forEach(option => {
    option.addEventListener('click', () => {
        compressionOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        const mode = option.dataset.mode;
        if (mode === 'custom') {
            settingsPanel.style.display = 'block';
        } else {
            settingsPanel.style.display = 'none';
        }
    });
});

// 质量滑块
compressQualitySlider.addEventListener('input', () => {
    compressQualityValue.textContent = compressQualitySlider.value + '%';
});

// 压缩图片
function compressImage() {
    if (!originalFile) return;

    const activeMode = document.querySelector('.compression-option.active').dataset.mode;
    const quality = activeMode === 'custom' ? compressQualitySlider.value / 100 :
        activeMode === 'size' ? 0.6 : 0.9;

    try {

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // 如果是尺寸优先模式，限制最大尺寸
            if (activeMode === 'size') {
                const maxDimension = 1920;
                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = height * (maxDimension / width);
                        width = maxDimension;
                    } else {
                        width = width * (maxDimension / height);
                        height = maxDimension;
                    }
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL(originalFile.type, quality);
            preview.src = compressedDataUrl;
            compressedImageUrl = compressedDataUrl;
            downloadBtn.disabled = false;

            // 计算压缩后大小
            const compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4 / 1024);
            const originalSize = Math.round(originalFile.size / 1024);
            const compressionRatio = Math.round((1 - compressedSize / originalSize) * 100);

            imageInfo.innerHTML = `
                <div class="zh-text">
                    原始大小：${originalSize} KB<br>
                    压缩后大小：${compressedSize} KB<br>
                    压缩率：${compressionRatio}%<br>
                    尺寸：${width} × ${height} 像素
                </div>
                `;

            // 显示更详细的成功通知
            const successMessage = `转换成功！\n原始大小：${originalSize} KB\n压缩后大小：${compressedSize} KB\n压缩率：${compressionRatio}%`;

            // 向 id=method的span替换内容为compressed
            methodSpan.textContent = 'compressed';

            showNotification(successMessage, 'success', 4000);
        };
        img.src = URL.createObjectURL(originalFile);
    } catch (error) {
        console.error('压缩图片时发生错误:', error);
        showNotification('压缩失败，请重试');
    }
};

