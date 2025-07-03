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
let originalFile = null;

let originalWidth = 0;
let originalHeight = 0;
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');

// 拖放处理
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

// 点击上传
dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

// 处理文件
function handleFile(file) {
    originalFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        previewContainer.style.display = 'block';
        resizeBtn.disabled = false;
        convertBtn.disabled = false;
        compressBtn.disabled = false;
        clearBtn.disabled = false;
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
        const info = `
                <div class="zh-text">
                    文件名：${file.name}<br>
                    原始大小：${fileSizeMB} MB<br>
                    尺寸：${img.width} × ${img.height} 像素<br>
                    类型：${file.type}
                </div>
                <div class="en-text" style="display: none;">
                    Filename: ${file.name}<br>
                    Original size: ${fileSizeMB} MB<br>
                    Dimensions: ${img.width} × ${img.height} pixels<br>
                    Type: ${file.type}
                </div>
            `;
        imageInfo.innerHTML = info;
    };
    img.src = dataUrl;
}

// 通用下载图片函数
function downloadImage() {
    // 获取当前操作方法
    const method = methodSpan.innerText;
    let imageUrl;
    let imagePrefix = '';

    // 根据 id = method 元素的内容判断下载的图片类型
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
            // 如果method为空，尝试使用任何可用的URL
            imageUrl = resizedImageUrl || compressedImageUrl || convertedImageUrl;
            if (!imageUrl) {
                showNotification('没有可用的图片', 'error');
                return;
            }
            break;
    }

    // 检查图片URL是否可用
    if (!imageUrl) {
        showNotification(`${method}图片不可用`, 'error');
        return;
    }

    // 创建下载链接并触发下载
    const link = document.createElement('a');
    link.download = `${imagePrefix}${originalFile.name}`;
    link.href = imageUrl;
    link.click();
    showNotification('开始下载');
}

// 下载按钮事件监听
downloadBtn.addEventListener('click', () => {
    downloadImage();
});

// 清除
clearBtn.addEventListener('click', () => {
    originalFile = null;
    compressedImageUrl = null;
    fileInput.value = '';
    preview.src = '';
    previewContainer.style.display = 'none';
    compressBtn.disabled = true;
    downloadBtn.disabled = true;
    clearBtn.disabled = true;
    imageInfo.innerHTML = '';
    showNotification('已清除');
});

// 页面加载后默认设置 data-mode="custom"，将其选中
addEventListener('DOMContentLoaded', () => {
    // 设置调整尺寸的默认选项
    const defaultResizeOption = document.querySelector('.resize-option[data-mode="percentage"]');
    if (defaultResizeOption) {
        defaultResizeOption.click();
    }

    // 设置压缩的默认选项
    const defaultCompressionOption = document.querySelector('.compression-option[data-mode="size"]');
    if (defaultCompressionOption) {
        defaultCompressionOption.click();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // ...现有代码...

    // 帮助模态框逻辑
    const helpBtn = document.getElementById('help-btn');
    const modal = document.getElementById('help-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalBody = document.querySelector('.modal-body');

    // 显示帮助模态框
    helpBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // 获取当前活动页面
        const activePage = document.querySelector('.page.active').id;
        let helpContent = '';

        // 根据当前页面选择对应的帮助内容
        switch (activePage) {
            case 'page1':
                helpContent = document.getElementById('resize-help').innerHTML;
                document.getElementById('modal-title').textContent = '图像裁剪帮助';
                break;
            case 'page2':
                helpContent = document.getElementById('compress-help').innerHTML;
                document.getElementById('modal-title').textContent = '图像压缩帮助';
                break;
            case 'page3':
                helpContent = document.getElementById('convert-help').innerHTML;
                document.getElementById('modal-title').textContent = '图像转换帮助';
                break;
        }

        // 设置模态框内容
        modalBody.innerHTML = helpContent;

        // 显示模态框
        modal.style.display = 'block';
    });

    // 关闭模态框
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
