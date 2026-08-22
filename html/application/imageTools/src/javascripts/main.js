const methodSpan = document.getElementById('method');

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const compressBtn = document.getElementById('compressBtn');
const convertBtn = document.getElementById('convertBtn');
const resizeBtn = document.getElementById('resizeBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
// 每个工具页面独立的下载/清除按钮，与全局按钮共用同一行为
const downloadBtns = [downloadBtn, document.getElementById('downloadBtn2'), document.getElementById('downloadBtn3')].filter(Boolean);
const clearBtns = [clearBtn, document.getElementById('clearBtn2'), document.getElementById('clearBtn3')].filter(Boolean);
const previewContainer = document.getElementById('previewContainer');
const preview = document.getElementById('preview');
const notification = document.getElementById('notification');
const imageInfo = document.getElementById('imageInfo');

const batchFileInput = document.getElementById('batchFileInput');
const batchProcessBtn = document.getElementById('batchProcessBtn');
const batchCancelBtn = document.getElementById('batchCancelBtn');
const batchClearBtn = document.getElementById('batchClearBtn');
const batchList = document.getElementById('batchList');
const batchProgressWrap = document.getElementById('batchProgressWrap');
const batchProgressBar = document.getElementById('batchProgressBar');
const batchProgressText = document.getElementById('batchProgressText');

let batchQueue = [];
let batchProcessing = false;
let batchCancelRequested = false;

let originalFile = null;
let originalWidth = 0;
let originalHeight = 0;
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');

function getDataUrlSizeKB(dataUrl) {
    return Math.round((dataUrl.length - 22) * 3 / 4 / 1024);
}

function getFileBaseName(filename) {
    const idx = filename.lastIndexOf('.');
    return idx > 0 ? filename.slice(0, idx) : filename;
}

function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error(t('upload.image_load_failed')));
        };
        img.src = url;
    });
}

function dataUrlToDownload(dataUrl, fileName) {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
}

function dataUrlToBlob(dataUrl) {
    const parts = dataUrl.split(',');
    const match = parts[0].match(/:(.*?);/);
    const mime = match ? match[1] : 'application/octet-stream';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function downloadBlob(blob, fileName) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
}

function getActivePageId() {
    const active = document.querySelector('.page.active');
    return active ? active.id : 'page1';
}

function getActiveModeName() {
    const pageId = getActivePageId();
    if (pageId === 'page1') return 'resize';
    if (pageId === 'page2') return 'compress';
    if (pageId === 'page3') return 'convert';
    return 'unknown';
}

function getResizeTargetByCurrentUI(width, height) {
    const activeMode = document.querySelector('.resize-option.active').dataset.mode;

    if (activeMode === 'custom') {
        return {
            width: parseInt(widthInput.value, 10) || width,
            height: parseInt(heightInput.value, 10) || height
        };
    }

    if (activeMode === 'percentage') {
        let percentage = parseInt(document.getElementById('percentageInput').value, 10);
        if (isNaN(percentage) || percentage < 1) percentage = 1;
        if (percentage > 200) percentage = 200;
        percentage = percentage / 100;
        return {
            width: Math.max(1, Math.round(width * percentage)),
            height: Math.max(1, Math.round(height * percentage))
        };
    }

    const targetWidth = parseInt(document.getElementById('pixelsInput').value, 10) || width;
    return {
        width: Math.max(1, targetWidth),
        height: Math.max(1, Math.round(height * (targetWidth / width)))
    };
}

function renderImageToDataUrl(img, width, height, mimeType, quality) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL(mimeType, quality);
}

async function processFileByActiveTool(file) {
    const pageId = getActivePageId();
    const img = await loadImageFromFile(file);

    if (pageId === 'page1') {
        const size = getResizeTargetByCurrentUI(img.width, img.height);
        const mime = file.type || 'image/png';
        const dataUrl = renderImageToDataUrl(img, size.width, size.height, mime);
        return {
            dataUrl,
            fileName: `resized_${getFileBaseName(file.name)}.png`,
            summary: `${file.name} -> ${size.width}x${size.height}`
        };
    }

    if (pageId === 'page2') {
        const activeMode = document.querySelector('.compression-option.active').dataset.mode;
        // 压缩始终输出 JPEG：PNG 等无损格式会忽略 quality 参数，导致压缩无效
        const mime = 'image/jpeg';

        // 按大小调整：二分搜索最佳质量
        if (activeMode === 'by-size') {
            const targetKB = parseInt(document.getElementById('maxSize').value, 10) || 1024;
            const targetBytes = targetKB * 1024;
            let low = 0.1, high = 1, bestDataUrl = null;

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, img.width, img.height);

            for (let i = 0; i < 8; i++) {
                const mid = (low + high) / 2;
                const dataUrl = canvas.toDataURL(mime, mid);
                const size = Math.round((dataUrl.length - 22) * 3 / 4);
                if (size <= targetBytes) {
                    bestDataUrl = dataUrl;
                    low = mid;
                } else {
                    high = mid;
                }
            }
            if (!bestDataUrl) bestDataUrl = canvas.toDataURL(mime, low);
            return {
                dataUrl: bestDataUrl,
                fileName: `compressed_${getFileBaseName(file.name)}.jpg`,
                summary: `${file.name} -> 压缩 ${getDataUrlSizeKB(bestDataUrl)}KB (目标${targetKB}KB)`
            };
        }

        // 其他模式：按质量参数压缩
        let quality;
        if (activeMode === 'by-quality') {
            quality = Number(document.getElementById('compressQualitySlider').value) / 100;
        } else if (activeMode === 'size') {
            quality = 0.6;
        } else {
            quality = 0.9;
        }

        let width = img.width;
        let height = img.height;
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

        // renderImageToDataUrl 不做白底填充，批量压缩场景需自行处理透明
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL(mime, quality);
        return {
            dataUrl,
            fileName: `compressed_${getFileBaseName(file.name)}.jpg`,
            summary: `${file.name} -> 压缩 ${getDataUrlSizeKB(dataUrl)}KB`
        };
    }

    const format = document.querySelector('.format-option.active').dataset.format;
    const mimeMap = {
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        bmp: 'image/bmp',
        gif: 'image/gif',
        tiff: 'image/tiff',
        ico: 'image/x-icon'
    };
    const extMap = {
        jpeg: 'jpg',
        png: 'png',
        webp: 'webp',
        bmp: 'bmp',
        gif: 'gif',
        tiff: 'tiff',
        ico: 'ico'
    };
    // 仅 JPEG / WebP 支持质量参数；无损格式忽略 quality
    const lossyFormats = ['jpeg', 'webp'];
    const quality = lossyFormats.includes(format)
        ? Number(document.getElementById('convertQualitySlider').value) / 100
        : undefined;

    const mime = mimeMap[format] || 'image/png';
    // JPEG / WebP 需白底填充以避免透明区域变黑
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (format === 'jpeg' || format === 'webp') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let dataUrl;
    try {
        dataUrl = canvas.toDataURL(mime, quality);
    } catch (e) {
        dataUrl = canvas.toDataURL('image/png');
    }
    return {
        dataUrl,
        fileName: `converted_${getFileBaseName(file.name)}.${extMap[format] || 'png'}`,
        summary: `${file.name} -> ${format.toUpperCase()}`
    };
}

function setActionButtonsEnabled(enabled) {
    resizeBtn.disabled = !enabled;
    convertBtn.disabled = !enabled;
    compressBtn.disabled = !enabled;
    clearBtns.forEach(btn => { btn.disabled = !enabled; });
}

function updateBatchState() {
    const hasFiles = batchQueue.length > 0;
    batchProcessBtn.disabled = !hasFiles || batchProcessing;
    batchCancelBtn.disabled = !batchProcessing;
    batchClearBtn.disabled = !hasFiles || batchProcessing;
    batchFileInput.disabled = batchProcessing;
}

function updateBatchProgress(done, total, text) {
    if (!batchProcessing || total <= 0) {
        batchProgressWrap.hidden = true;
        batchProgressBar.style.width = '0%';
        batchProgressText.textContent = '';
        return;
    }

    const percent = Math.max(0, Math.min(100, Math.round((done / total) * 100)));
    batchProgressWrap.hidden = false;
    batchProgressBar.style.width = `${percent}%`;
    batchProgressText.textContent = text || t('batch.progress', { done, total, percent });
}

function renderBatchQueue() {
    batchList.innerHTML = '';

    if (!batchQueue.length) {
        const li = document.createElement('li');
        li.textContent = t('preview.empty');
        batchList.appendChild(li);
        return;
    }

    batchQueue.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('batch-row');
        if (item.status === 'success') li.classList.add('success');
        if (item.status === 'error') li.classList.add('error');

        const text = document.createElement('span');
        text.className = 'batch-row-text';

        if (item.status === 'processing') {
            text.textContent = t('batch.row_processing', { name: item.file.name });
        } else if (item.status === 'success') {
            text.textContent = t('batch.row_success', { message: item.message });
        } else if (item.status === 'error') {
            text.textContent = t('batch.row_error', { name: item.file.name, message: item.message });
        } else {
            text.textContent = t('batch.row_queued', { name: item.file.name });
        }

        li.appendChild(text);

        if (!batchProcessing) {
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'batch-remove-btn';
            removeBtn.textContent = t('batch.remove');
            removeBtn.dataset.index = String(index);
            li.appendChild(removeBtn);
        }

        batchList.appendChild(li);
    });
}

function appendBatchFiles(files) {
    const incoming = Array.from(files || []);
    if (!incoming.length) return;

    let added = 0;
    incoming.forEach(file => {
        if (!file.type || !file.type.startsWith('image/')) return;

        const exists = batchQueue.some(item =>
            item.file.name === file.name &&
            item.file.size === file.size &&
            item.file.lastModified === file.lastModified
        );
        if (exists) return;

        batchQueue.push({
            file,
            status: 'queued',
            message: ''
        });
        added++;
    });

    if (added === 0) {
        showNotification(t('batch.no_new'), 'error');
    } else {
        showNotification(t('batch.added', { count: added }), 'success');
    }

    renderBatchQueue();
    updateBatchState();
}

function removeBatchItem(index) {
    if (batchProcessing) return;
    if (index < 0 || index >= batchQueue.length) return;
    batchQueue.splice(index, 1);
    renderBatchQueue();
    updateBatchState();
}

async function runBatchProcess() {
    if (!batchQueue.length) {
        showNotification(t('batch.select_first'), 'error');
        return;
    }

    if (!window.JSZip) {
        showNotification(t('batch.no_zip'), 'error');
        return;
    }

    batchProcessing = true;
    batchCancelRequested = false;
    batchQueue = batchQueue.map(item => ({
        file: item.file,
        status: 'queued',
        message: ''
    }));

    const zip = new JSZip();
    const total = batchQueue.length;
    let successCount = 0;
    let failureCount = 0;

    updateBatchState();
    renderBatchQueue();
    updateBatchProgress(0, total, t('batch.start', { total }));

    for (let i = 0; i < batchQueue.length; i++) {
        if (batchCancelRequested) {
            break;
        }

        const current = batchQueue[i];
        const file = current.file;
        current.status = 'processing';
        renderBatchQueue();
        updateBatchProgress(i, total, t('batch.processing', { name: file.name, done: i + 1, total }));

        try {
            const result = await processFileByActiveTool(file);
            zip.file(result.fileName, dataUrlToBlob(result.dataUrl));
            current.status = 'success';
            current.message = result.summary;
            successCount++;
        } catch (error) {
            current.status = 'error';
            current.message = error.message;
            failureCount++;
        }

        renderBatchQueue();
        updateBatchProgress(i + 1, total, t('batch.done', { done: i + 1, total }));
        await new Promise(resolve => setTimeout(resolve, 120));
    }

    if (!batchCancelRequested && successCount > 0) {
        updateBatchProgress(total, total, t('batch.zipping'));
        const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
        const now = new Date();
        const mode = getActiveModeName();
        const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        downloadBlob(zipBlob, `image-batch-${mode}-${ts}.zip`);
    }

    batchProcessing = false;
    updateBatchState();

    if (batchCancelRequested) {
        showNotification(t('batch.cancelled', { success: successCount, failure: failureCount }), 'error');
    } else {
        showNotification(t('batch.completed', { success: successCount, failure: failureCount }), 'success');
    }

    updateBatchProgress(0, 0, '');
}

function clearBatchQueue() {
    if (batchProcessing) return;
    batchQueue = [];
    batchFileInput.value = '';
    renderBatchQueue();
    updateBatchState();
    updateBatchProgress(0, 0, '');
}

function cancelBatchProcess() {
    if (!batchProcessing) return;
    batchCancelRequested = true;
    batchProgressText.textContent = t('batch.canceling');
}

// 拖放处理
function bindDropZone() {
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        } else {
            showNotification(t('upload.invalid'), 'error');
        }
    });

    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        }
    });
}

// 处理文件
function handleFile(file) {
    originalFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        previewContainer.style.display = 'flex';
        setActionButtonsEnabled(true);
        updateImageInfo(file, e.target.result);
        showNotification(t('upload.image_loaded'));
    };
    reader.readAsDataURL(file);
}

// 更新图片信息
function updateImageInfo(file, dataUrl) {
    const img = new Image();
    img.onload = () => {
        originalWidth = img.width;
        originalHeight = img.height;
        widthInput.value = img.width;
        heightInput.value = img.height;

        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        imageInfo.innerHTML = `
            <div class="zh-text">
                ${t('info.filename')}：${file.name}<br>
                ${t('info.original_size')}：${fileSizeMB} ${t('info.unit_mb')}<br>
                ${t('info.dimensions')}：${img.width} × ${img.height} ${t('info.unit_px')}<br>
                ${t('info.type')}：${file.type}
            </div>
        `;
    };
    img.src = dataUrl;
}

// 通用下载图片函数
function downloadImage() {
    // 注意：methodSpan 带有 hidden / display:none，必须用 textContent，
    // innerText 对不可见元素返回空字符串会导致分支判断失效
    const method = methodSpan.textContent;
    let imageUrl;
    let imagePrefix = '';
    let targetExt = '';

    switch (method) {
        case 'resized':
            imageUrl = resizedImageUrl;
            imagePrefix = t('prefix.resized');
            break;
        case 'compressed':
            imageUrl = compressedImageUrl;
            imagePrefix = t('prefix.compressed');
            break;
        case 'converted':
            imageUrl = convertedImageUrl;
            imagePrefix = t('prefix.converted');
            {
                const format = document.querySelector('.format-option.active').dataset.format;
                const extMap = {
                    jpeg: 'jpg', png: 'png', webp: 'webp', bmp: 'bmp',
                    gif: 'gif', tiff: 'tiff', ico: 'ico'
                };
                targetExt = extMap[format] || 'png';
            }
            break;
        default:
            imageUrl = resizedImageUrl || compressedImageUrl || convertedImageUrl;
            if (!imageUrl) {
                showNotification(t('upload.no_image_available'), 'error');
                return;
            }
            break;
    }

    if (!imageUrl) {
        showNotification(t('resize.method_unavailable', { method }), 'error');
        return;
    }

    const baseName = getFileBaseName(originalFile.name);
    const ext = targetExt || originalFile.name.split('.').pop() || 'png';
    const link = document.createElement('a');
    link.download = `${imagePrefix}${baseName}.${ext}`;
    link.href = imageUrl;
    link.click();
    showNotification(t('preview.start_download'));
}

function clearSingleState() {
    originalFile = null;
    compressedImageUrl = null;
    resizedImageUrl = null;
    convertedImageUrl = null;
    fileInput.value = '';
    preview.src = '';
    previewContainer.style.display = 'none';
    compressBtn.disabled = true;
    resizeBtn.disabled = true;
    convertBtn.disabled = true;
    downloadBtns.forEach(btn => { btn.disabled = true; });
    clearBtns.forEach(btn => { btn.disabled = true; });
    imageInfo.innerHTML = '';
    methodSpan.textContent = '';
    showNotification(t('preview.cleared'));
}

function bindHelpModal() {
    const helpBtn = document.getElementById('help-btn');
    const modal = document.getElementById('help-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalBody = document.querySelector('.modal-body');
    const modalTitle = document.getElementById('modal-title');

    helpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const activePage = getActivePageId();
        let helpContent = '';

        switch (activePage) {
            case 'page1':
                helpContent = document.getElementById('resize-help').innerHTML;
                modalTitle.textContent = t('help.title_resize');
                break;
            case 'page2':
                helpContent = document.getElementById('compress-help').innerHTML;
                modalTitle.textContent = t('help.title_compress');
                break;
            default:
                helpContent = document.getElementById('convert-help').innerHTML;
                modalTitle.textContent = t('help.title_convert');
                break;
        }

        modalBody.innerHTML = helpContent;
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function bindNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
            const pageId = link.getAttribute('data-page');
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
        });
    });
}

function bindBatch() {
    batchFileInput.addEventListener('change', () => {
        appendBatchFiles(batchFileInput.files);
        batchFileInput.value = '';
    });

    batchList.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('batch-remove-btn')) {
            const index = Number(target.dataset.index);
            removeBatchItem(index);
        }
    });

    batchProcessBtn.addEventListener('click', runBatchProcess);
    batchCancelBtn.addEventListener('click', cancelBatchProcess);
    batchClearBtn.addEventListener('click', clearBatchQueue);
}

// 下载按钮事件监听
downloadBtns.forEach(btn => btn.addEventListener('click', downloadImage));
clearBtns.forEach(btn => btn.addEventListener('click', clearSingleState));

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    bindNavigation();
    bindDropZone();
    bindHelpModal();
    bindBatch();

    // 语言切换按钮
    const langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleLang();
        });
    }
    // 应用初始语言（从 localStorage 或浏览器检测）
    applyI18n();

    const defaultResizeOption = document.querySelector('.resize-option[data-mode="percentage"]');
    if (defaultResizeOption) {
        defaultResizeOption.click();
    }

    const defaultCompressionOption = document.querySelector('.compression-option[data-mode="size"]');
    if (defaultCompressionOption) {
        defaultCompressionOption.click();
    }

    updateBatchState();
    renderBatchQueue();
});