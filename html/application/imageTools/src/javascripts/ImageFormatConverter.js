const convertQualitySlider = document.getElementById('convertQualitySlider');
const convertQualityValue = document.getElementById('convertQualityValue');
const convertQualityPanel = document.querySelector('#page3 .panel.settings-panel');

let convertedImageUrl = null;

// 各格式元数据：MIME、扩展名、是否支持质量参数、浏览器是否支持 toDataURL
const FORMAT_META = {
    jpeg: { mime: 'image/jpeg',  ext: 'jpg',  lossy: true,  supported: true },
    png:  { mime: 'image/png',   ext: 'png',  lossy: false, supported: true },
    webp: { mime: 'image/webp',  ext: 'webp', lossy: true,  supported: true },
    bmp:  { mime: 'image/bmp',   ext: 'bmp',  lossy: false, supported: false }, // 浏览器通常不支持，会回退为 PNG
    gif:  { mime: 'image/gif',   ext: 'gif',  lossy: false, supported: false }, // 浏览器通常不支持动态图，静态 GIF 可生成
    tiff: { mime: 'image/tiff',  ext: 'tiff', lossy: false, supported: false }, // 浏览器不支持，会抛错或回退
    ico:  { mime: 'image/x-icon', ext: 'ico', lossy: false, supported: false }  // 浏览器不支持
};

// 格式选择
const formatOptions = document.querySelectorAll('.format-option');
formatOptions.forEach(option => {
    option.addEventListener('click', () => {
        formatOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // 仅在质量参数有效的格式（JPEG / WebP）时显示滑块
        const fmt = option.dataset.format;
        const meta = FORMAT_META[fmt];
        if (meta && meta.lossy && convertQualityPanel) {
            convertQualityPanel.style.display = 'block';
        } else if (convertQualityPanel) {
            convertQualityPanel.style.display = 'none';
        }
    });
});

// 初始化：根据默认选中格式（JPEG）显示滑块
(function initConvertPanelVisibility() {
    const activeFmt = document.querySelector('.format-option.active');
    if (activeFmt && convertQualityPanel) {
        const meta = FORMAT_META[activeFmt.dataset.format];
        convertQualityPanel.style.display = (meta && meta.lossy) ? 'block' : 'none';
    }
})();

// 质量滑块
convertQualitySlider.addEventListener('input', () => {
    convertQualityValue.textContent = convertQualitySlider.value + '%';
});

// 计算 dataURL 字节数
function getConvertedSizeBytes(dataUrl) {
    if (!dataUrl) return 0;
    const base64 = dataUrl.split(',')[1] || '';
    const padding = base64.endsWith('==') ? 2 : (base64.endsWith('=') ? 1 : 0);
    return Math.max(0, Math.floor(base64.length * 3 / 4) - padding);
}

// 转换图片格式
async function convertImage() {
    if (!originalFile) return;

    const targetFormat = document.querySelector('.format-option.active').dataset.format;
    const meta = FORMAT_META[targetFormat];
    if (!meta) {
        showNotification(t('convert.unknown_format'), 'error');
        return;
    }

    // 浏览器不支持的格式：明确告知
    if (!meta.supported) {
        showNotification(t('convert.unsupported_fallback', { format: targetFormat.toUpperCase() }), 'error', 5000);
    }

    const quality = meta.lossy ? (convertQualitySlider.value / 100) : undefined;

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

        // JPEG / WebP 不支持透明通道，用白底填充避免透明区域变黑
        if (targetFormat === 'jpeg' || targetFormat === 'webp') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        let convertedDataUrl;
        try {
            convertedDataUrl = canvas.toDataURL(meta.mime, quality);
        } catch (e) {
            // 浏览器抛错：回退为 PNG
            convertedDataUrl = canvas.toDataURL('image/png');
            showNotification(t('convert.fallback_to_png', { format: targetFormat.toUpperCase() }), 'error', 4000);
        }

        // 检测是否被静默回退（dataURL 的 MIME 与预期不符）
        const actualMime = convertedDataUrl.match(/^data:([^;]+)/);
        const actualType = actualMime ? actualMime[1] : '';
        let fallbackNote = '';
        if (meta.supported && actualType && actualType !== meta.mime) {
            fallbackNote = t('convert.fallback_note', { format: actualType.split('/')[1].toUpperCase() });
        }

        preview.src = convertedDataUrl;
        convertedImageUrl = convertedDataUrl;
        downloadBtns.forEach(btn => { btn.disabled = false; });

        const convertedSize = Math.round(getConvertedSizeBytes(convertedDataUrl) / 1024);
        const originalSize = Math.round(originalFile.size / 1024);
        const sizeChange = Math.round((1 - convertedSize / originalSize) * 100);
        const sizeChangeText = sizeChange >= 0
            ? t('convert.size_decrease', { percent: sizeChange })
            : t('convert.size_increase', { percent: Math.abs(sizeChange) });

        imageInfo.innerHTML = `
            ${t('info.original_size')}：${originalSize} ${t('info.unit_kb')}<br>
            ${t('info.converted_size')}：${convertedSize} ${t('info.unit_kb')}<br>
            ${t('info.size_change')}：${sizeChangeText}<br>
            ${t('info.target_format')}：${targetFormat.toUpperCase()}${actualType && actualType !== meta.mime ? ` (${t('info.actual_format')}: ${actualType.split('/')[1].toUpperCase()})` : ''}
        `;

        const successMessage = t('convert.success', {
            original_format: (originalFile.type.split('/')[1] || '').toUpperCase(),
            target_format: targetFormat.toUpperCase(),
            original: originalSize,
            converted: convertedSize,
            change: sizeChangeText,
            fallback: fallbackNote
        });

        methodSpan.textContent = 'converted';
        showNotification(successMessage, 'success', 4000);
    } catch (error) {
        console.error('Conversion error:', error);
        showNotification(t('convert.failed'), 'error');
    } finally {
        convertBtn.classList.remove('btn-loading');
        convertBtn.disabled = false;
    }
}
