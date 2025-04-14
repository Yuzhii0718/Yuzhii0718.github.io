const convertQualitySlider = document.getElementById('convertQualitySlider');
const convertQualityValue = document.getElementById('convertQualityValue');

let convertedImageUrl = null;

// 格式选择
const formatOptions = document.querySelectorAll('.format-option');
formatOptions.forEach(option => {
    option.addEventListener('click', () => {
        formatOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
    });
});

// 质量滑块
convertQualitySlider.addEventListener('input', () => {
    convertQualityValue.textContent = convertQualitySlider.value + '%';
});

// 转换图片格式
async function convertImage() {
    if (!originalFile) return;

    const targetFormat = document.querySelector('.format-option.active').dataset.format;
    const quality = convertQualitySlider.value / 100;

    // 添加加载状态
    convertBtn.classList.add('btn-loading');
    convertBtn.disabled = true;

    try {
        const img = new Image();
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = URL.createObjectURL(originalFile);
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        let mimeType;
        switch (targetFormat) {
            case 'jpeg':
                mimeType = 'image/jpeg';
                break;
            case 'png':
                mimeType = 'image/png';
                break;
            case 'webp':
                mimeType = 'image/webp';
                break;
            case 'bmp':
                mimeType = 'image/bmp';
                break;
            case 'gif':
                mimeType = 'image/gif';
                break;
            case 'tiff':
                mimeType = 'image/tiff';
                break;
            case 'ico':
                mimeType = 'image/x-icon';
                break;
        }

        // 模拟处理延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        const convertedDataUrl = canvas.toDataURL(mimeType, quality);
        preview.src = convertedDataUrl;
        convertedImageUrl = convertedDataUrl;
        downloadBtn.disabled = false;

        // 计算转换后大小
        const convertedSize = Math.round((convertedDataUrl.length - 22) * 3 / 4 / 1024);
        const originalSize = Math.round(originalFile.size / 1024);
        const sizeChange = Math.round((1 - convertedSize / originalSize) * 100);

        imageInfo.innerHTML = `
    <div class="zh-text">
        原始大小：${originalSize} KB<br>
        转换后大小：${convertedSize} KB<br>
        大小变化：${sizeChange}%<br>
        目标格式：${targetFormat.toUpperCase()}
    </div>
`;

        // 显示更详细的成功通知
        const successMessage = `转换成功！\n原始格式：${originalFile.type}\n目标格式：${targetFormat.toUpperCase()}\n大小变化：${sizeChange}%`;

        // 向 id=method的span替换内容为converted
        methodSpan.textContent = 'converted';

        showNotification(successMessage, 'success', 4000);
    } catch (error) {
        console.error('Conversion error:', error);
        showNotification(
            '转换失败，请重试'
        );
    } finally {
        // 移除加载状态
        convertBtn.classList.remove('btn-loading');
        convertBtn.disabled = false;
    }
};
