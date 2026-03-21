const methodSpan = document.getElementById('method');

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const compressBtn = document.getElementById('compressBtn');
const convertBtn = document.getElementById('convertBtn');
const resizeBtn = document.getElementById('resizeBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
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
            reject(new Error('图片加载失败'));
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
        const percentage = parseInt(document.getElementById('percentageSelect').value, 10) / 100;
        return {
            width: Math.max(1, Math.round(width * percentage)),
            height: Math.max(1, Math.round(height * percentage))
        };
    }

    const targetWidth = parseInt(document.getElementById('pixelsSelect').value, 10) || width;
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
        const quality = activeMode === 'custom'
            ? Number(document.getElementById('compressQualitySlider').value) / 100
            : activeMode === 'size' ? 0.6 : 0.9;

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

        const mime = file.type && file.type.startsWith('image/') ? file.type : 'image/jpeg';
        const dataUrl = renderImageToDataUrl(img, Math.round(width), Math.round(height), mime, quality);
        return {
            dataUrl,
            fileName: `compressed_${getFileBaseName(file.name)}.jpg`,
            summary: `${file.name} -> 压缩 ${getDataUrlSizeKB(dataUrl)}KB`
        };
    }

    const format = document.querySelector('.format-option.active').dataset.format;
    const quality = Number(document.getElementById('convertQualitySlider').value) / 100;
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

    const mime = mimeMap[format] || 'image/png';
    const dataUrl = renderImageToDataUrl(img, img.width, img.height, mime, quality);
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
    clearBtn.disabled = !enabled;
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
    batchProgressText.textContent = text || `进度：${done}/${total} (${percent}%)`;
}

function renderBatchQueue() {
    batchList.innerHTML = '';

    if (!batchQueue.length) {
        const li = document.createElement('li');
        li.textContent = '队列为空：请先添加图片';
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
            text.textContent = `处理中：${item.file.name}`;
        } else if (item.status === 'success') {
            text.textContent = `完成：${item.message}`;
        } else if (item.status === 'error') {
            text.textContent = `失败：${item.file.name}（${item.message}）`;
        } else {
            text.textContent = `待处理：${item.file.name}`;
        }

        li.appendChild(text);

        if (!batchProcessing) {
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'batch-remove-btn';
            removeBtn.textContent = '删除';
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
        showNotification('没有新增可用图片（可能重复或格式不支持）', 'error');
    } else {
        showNotification(`已加入队列：${added} 张`, 'success');
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
        showNotification('请先选择批量图片', 'error');
        return;
    }

    if (!window.JSZip) {
        showNotification('缺少 ZIP 组件，无法打包下载', 'error');
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
    updateBatchProgress(0, total, `开始处理：0/${total}`);

    for (let i = 0; i < batchQueue.length; i++) {
        if (batchCancelRequested) {
            break;
        }

        const current = batchQueue[i];
        const file = current.file;
        current.status = 'processing';
        renderBatchQueue();
        updateBatchProgress(i, total, `处理中：${file.name} (${i + 1}/${total})`);

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
        updateBatchProgress(i + 1, total, `已完成：${i + 1}/${total}`);
        await new Promise(resolve => setTimeout(resolve, 120));
    }

    if (!batchCancelRequested && successCount > 0) {
        updateBatchProgress(total, total, '正在打包 ZIP...');
        const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
        const now = new Date();
        const mode = getActiveModeName();
        const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        downloadBlob(zipBlob, `image-batch-${mode}-${ts}.zip`);
    }

    batchProcessing = false;
    updateBatchState();

    if (batchCancelRequested) {
        showNotification(`批量处理已取消（成功 ${successCount}，失败 ${failureCount}）`, 'error');
    } else {
        showNotification(`批量处理完成（成功 ${successCount}，失败 ${failureCount}）`, 'success');
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
    batchProgressText.textContent = '正在取消...（当前项结束后停止）';
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
            showNotification('请上传图片文件', 'error');
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
        previewContainer.style.display = 'block';
        setActionButtonsEnabled(true);
        updateImageInfo(file, e.target.result);
        showNotification('图片已加载');
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
                文件名：${file.name}<br>
                原始大小：${fileSizeMB} MB<br>
                尺寸：${img.width} × ${img.height} 像素<br>
                类型：${file.type}
            </div>
        `;
    };
    img.src = dataUrl;
}

// 通用下载图片函数
function downloadImage() {
    const method = methodSpan.innerText;
    let imageUrl;
    let imagePrefix = '';

    switch (method) {
        case 'resized':
            imageUrl = resizedImageUrl;
            imagePrefix = 'resized_';
            break;
        case 'compressed':
            imageUrl = compressedImageUrl;
            imagePrefix = 'compressed_';
            break;
        case 'converted':
            imageUrl = convertedImageUrl;
            imagePrefix = 'converted_';
            break;
        default:
            imageUrl = resizedImageUrl || compressedImageUrl || convertedImageUrl;
            if (!imageUrl) {
                showNotification('没有可用的图片', 'error');
                return;
            }
            break;
    }

    if (!imageUrl) {
        showNotification(`${method}图片不可用`, 'error');
        return;
    }

    const link = document.createElement('a');
    link.download = `${imagePrefix}${originalFile.name}`;
    link.href = imageUrl;
    link.click();
    showNotification('开始下载');
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
    downloadBtn.disabled = true;
    clearBtn.disabled = true;
    imageInfo.innerHTML = '';
    methodSpan.textContent = '';
    showNotification('已清除');
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
                modalTitle.textContent = '图像裁剪帮助';
                break;
            case 'page2':
                helpContent = document.getElementById('compress-help').innerHTML;
                modalTitle.textContent = '图像压缩帮助';
                break;
            default:
                helpContent = document.getElementById('convert-help').innerHTML;
                modalTitle.textContent = '图像转换帮助';
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
downloadBtn.addEventListener('click', downloadImage);
clearBtn.addEventListener('click', clearSingleState);

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    bindNavigation();
    bindDropZone();
    bindHelpModal();
    bindBatch();

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