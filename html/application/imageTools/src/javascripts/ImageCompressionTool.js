const compressQualitySlider = document.getElementById('compressQualitySlider');
const compressQualityValue = document.getElementById('compressQualityValue');
const qualityPanel = document.getElementById('qualityPanel');
const sizePanel = document.getElementById('sizePanel');

let compressedImageUrl = null;

// 压缩模式选择
const compressionOptions = document.querySelectorAll('.compression-option');

compressionOptions.forEach(option => {
    option.addEventListener('click', () => {
        compressionOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        const mode = option.dataset.mode;
        // 隐藏所有自定义面板
        qualityPanel.style.display = 'none';
        sizePanel.style.display = 'none';

        // 按质量调整：显示质量面板
        if (mode === 'by-quality') {
            qualityPanel.style.display = 'block';
        }
        // 按大小调整：显示大小面板
        else if (mode === 'by-size') {
            sizePanel.style.display = 'block';
        }
        // 缩小优先 / 清晰优先 为预设方案，无需显示面板
    });
});

// 质量滑块联动
compressQualitySlider.addEventListener('input', () => {
    compressQualityValue.textContent = compressQualitySlider.value + '%';
});

// 计算 dataURL 的字节数
function getDataUrlSizeBytes(dataUrl) {
    if (!dataUrl) return 0;
    const base64 = dataUrl.split(',')[1] || '';
    const padding = base64.endsWith('==') ? 2 : (base64.endsWith('=') ? 1 : 0);
    return Math.max(0, Math.floor(base64.length * 3 / 4) - padding);
}

// 按目标大小二分查找最佳质量
// 注意：PNG 是无损格式，toDataURL('image/png', quality) 会忽略 quality 参数。
// 因此压缩始终输出 JPEG（有损），才能真正利用质量参数控制文件大小。
function findBestQualityBySize(img, targetKB) {
    const targetBytes = targetKB * 1024;
    let low = 0.1;
    let high = 1;
    let bestDataUrl = null;
    let bestSize = Infinity;

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // 二分搜索：最多 8 次迭代
    for (let i = 0; i < 8; i++) {
        const mid = (low + high) / 2;
        const dataUrl = canvas.toDataURL('image/jpeg', mid);
        const size = getDataUrlSizeBytes(dataUrl);

        if (size <= targetBytes) {
            bestDataUrl = dataUrl;
            bestSize = size;
            low = mid;
        } else {
            high = mid;
        }
    }

    // 若仍超出目标，使用最低质量结果作为兜底
    if (!bestDataUrl) {
        bestDataUrl = canvas.toDataURL('image/jpeg', low);
        bestSize = getDataUrlSizeBytes(bestDataUrl);
    }

    return {
        dataUrl: bestDataUrl,
        quality: low,
        size: bestSize,
        met: bestSize <= targetBytes
    };
}

// 压缩图片
function compressImage() {
    if (!originalFile) return;

    const activeMode = document.querySelector('.compression-option.active').dataset.mode;

    try {
        const img = new Image();
        img.onload = () => {
            // 压缩始终输出 JPEG：PNG 等无损格式会忽略 quality 参数，
            // 导致无论怎么设置质量，压缩结果都一样。
            const outputMime = 'image/jpeg';

            // 按大小调整：二分搜索最佳质量
            if (activeMode === 'by-size') {
                const targetKB = parseInt(document.getElementById('maxSize').value, 10) || 1024;
                const originalSize = Math.round(originalFile.size / 1024);

                // 原图已小于目标值：无需压缩，直接使用原图
                if (originalSize <= targetKB) {
                    const originalDataUrl = URL.createObjectURL(originalFile);
                    preview.src = originalDataUrl;
                    compressedImageUrl = originalDataUrl;
                    downloadBtns.forEach(btn => { btn.disabled = false; });

                    imageInfo.innerHTML = `
                        ${t('info.original_size')}：${originalSize} ${t('info.unit_kb')}<br>
                        ${t('info.target_size')}：${targetKB} ${t('info.unit_kb')}<br>
                        ${t('info.status')}：${t('info.status_no_need')}<br>
                        ${t('info.dimensions')}：${img.width} × ${img.height} ${t('info.unit_px')}
                    `;

                    methodSpan.textContent = 'compressed';
                    showNotification(t('compress.already_small', { original: originalSize, target: targetKB }), 'success', 4000);
                    return;
                }

                const result = findBestQualityBySize(img, targetKB);
                const compressedDataUrl = result.dataUrl;
                preview.src = compressedDataUrl;
                compressedImageUrl = compressedDataUrl;
                downloadBtns.forEach(btn => { btn.disabled = false; });

                const compressedSize = Math.round(result.size / 1024);
                const compressionRatio = Math.round((1 - compressedSize / originalSize) * 100);

                imageInfo.innerHTML = `
                    ${t('info.original_size')}：${originalSize} ${t('info.unit_kb')}<br>
                    ${t('info.compressed_size')}：${compressedSize} ${t('info.unit_kb')}<br>
                    ${t('info.target_size')}：${targetKB} ${t('info.unit_kb')}<br>
                    ${t('info.compression_ratio')}：${compressionRatio}%<br>
                    ${t('info.quality_param')}：${Math.round(result.quality * 100)}%<br>
                    ${t('info.dimensions')}：${img.width} × ${img.height} ${t('info.unit_px')}
                `;

                methodSpan.textContent = 'compressed';

                if (result.met) {
                    showNotification(t('compress.success_target_met', { original: originalSize, compressed: compressedSize, target: targetKB }), 'success', 4000);
                } else {
                    showNotification(t('compress.target_not_met', { compressed: compressedSize, target: targetKB }), 'error', 5000);
                }
                return;
            }

            // 其他模式：按质量参数压缩
            let quality;
            let width = img.width;
            let height = img.height;

            if (activeMode === 'size') {
                quality = 0.6;
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
            } else if (activeMode === 'quality') {
                quality = 0.9;
            } else { // by-quality
                quality = compressQualitySlider.value / 100;
            }

            const canvas = document.createElement('canvas');
            canvas.width = Math.round(width);
            canvas.height = Math.round(height);
            const ctx = canvas.getContext('2d');
            // JPEG 不支持透明通道，先用白底填充避免透明区域变黑
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const compressedDataUrl = canvas.toDataURL(outputMime, quality);
            preview.src = compressedDataUrl;
            compressedImageUrl = compressedDataUrl;
            downloadBtns.forEach(btn => { btn.disabled = false; });

            const compressedSize = Math.round(getDataUrlSizeBytes(compressedDataUrl) / 1024);
            const originalSize = Math.round(originalFile.size / 1024);
            const compressionRatio = Math.round((1 - compressedSize / originalSize) * 100);

            imageInfo.innerHTML = `
                ${t('info.original_size')}：${originalSize} ${t('info.unit_kb')}<br>
                ${t('info.compressed_size')}：${compressedSize} ${t('info.unit_kb')}<br>
                ${t('info.compression_ratio')}：${compressionRatio}%<br>
                ${t('info.quality_param')}：${Math.round(quality * 100)}%<br>
                ${t('info.dimensions')}：${canvas.width} × ${canvas.height} ${t('info.unit_px')}
            `;

            methodSpan.textContent = 'compressed';

            // 压缩后反而变大：原图可能已是高压缩格式（如 JPEG），重新编码引入额外开销
            if (compressedSize >= originalSize) {
                showNotification(t('compress.invalid', {
                    original: originalSize,
                    compressed: compressedSize,
                    ratio: Math.abs(compressionRatio)
                }), 'error', 5000);
            } else {
                showNotification(t('compress.success', {
                    original: originalSize,
                    compressed: compressedSize,
                    ratio: compressionRatio
                }), 'success', 4000);
            }
        };
        img.src = URL.createObjectURL(originalFile);
    } catch (error) {
        console.error('压缩图片时发生错误:', error);
        showNotification(t('compress.failed'), 'error');
    }
}
