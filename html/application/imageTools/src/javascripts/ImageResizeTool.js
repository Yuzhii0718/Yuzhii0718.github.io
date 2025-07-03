const maintainAspect = document.getElementById('maintainAspect');
const percentagePanel = document.getElementById('percentagePanel');
const pixelsPanel = document.getElementById('pixelsPanel');
const customPanel = document.getElementById('customPanel');
const percentageSelect = document.getElementById('percentageSelect');
const pixelsSelect = document.getElementById('pixelsSelect');

let resizedImageUrl = null;

// 调整模式选择
const resizeOptions = document.querySelectorAll('.resize-option');

resizeOptions.forEach(option => {
    option.addEventListener('click', () => {
        resizeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        const mode = option.dataset.mode;
        // 隐藏所有面板
        percentagePanel.style.display = 'none';
        pixelsPanel.style.display = 'none';
        customPanel.style.display = 'none';

        // 显示对应模式的面板
        if (mode === 'custom') {
            customPanel.style.display = 'block';
        } else if (mode === 'percentage') {
            percentagePanel.style.display = 'block';
        } else if (mode === 'pixels') {
            pixelsPanel.style.display = 'block';
        }
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
        const percentage = parseInt(percentageSelect.value) / 100;
        targetWidth = Math.round(originalWidth * percentage);
        targetHeight = Math.round(originalHeight * percentage);
    } else { // pixels mode
        targetWidth = parseInt(pixelsSelect.value);
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
        downloadBtn.disabled = false;

        // 计算调整后大小
        const resizedSize = Math.round((resizedDataUrl.length - 22) * 3 / 4 / 1024);
        const originalSize = Math.round(originalFile.size / 1024);
        const sizeChange = Math.round((1 - resizedSize / originalSize) * 100);

        const info = `
                <div class="zh-text">
                    原始大小：${originalSize} KB<br>
                    调整后大小：${resizedSize} KB<br>
                    大小变化：${sizeChange}%<br>
                    尺寸：${targetWidth} × ${targetHeight} 像素
                </div>
                <div class="en-text" style="display: none;">
                    Original size: ${originalSize} KB<br>
                    Resized size: ${resizedSize} KB<br>
                    Size change: ${sizeChange}%<br>
                    Dimensions: ${targetWidth} × ${targetHeight} pixels
                </div>
            `;
        imageInfo.innerHTML = info;

        // 显示更详细的成功通知
        const successMessage = document.querySelector('.zh-text') ?
            `调整成功！\n原始尺寸：${originalWidth}×${originalHeight}\n调整后：${targetWidth}×${targetHeight}\n大小变化：${sizeChange}%` :
            `Resize successful!\nOriginal: ${originalWidth}×${originalHeight}\nResized: ${targetWidth}×${targetHeight}\nSize change: ${sizeChange}%`;

        // 向 id=method的span替换内容为resized
        methodSpan.textContent = 'resized';

        showNotification(successMessage, 'success', 4000);
    };
    img.src = URL.createObjectURL(originalFile);
};

// 百分比选择和输入框联动
document.addEventListener('DOMContentLoaded', () => {
    const percentageSelect = document.getElementById('percentageSelect');
    const percentageInput = document.getElementById('percentageInput');
    
    // 下拉框改变时更新输入框
    percentageSelect.addEventListener('change', () => {
        percentageInput.value = percentageSelect.value;
    });
    
    // 输入框改变时更新下拉框或创建自定义选项
    percentageInput.addEventListener('change', () => {
        // 确保输入的是整数
        let value = parseInt(percentageInput.value);
        
        // 限制在合理范围内
        if (isNaN(value) || value < 1) value = 1;
        if (value > 200) value = 200;
        
        // 更新输入框为整数值
        percentageInput.value = value;
        
        // 检查是否为预设值
        let found = false;
        for (let i = 0; i < percentageSelect.options.length; i++) {
            if (parseInt(percentageSelect.options[i].value) === value) {
                percentageSelect.selectedIndex = i;
                found = true;
                break;
            }
        }
        
        // 如果不是预设值，则添加或更新自定义选项
        if (!found) {
            let customOption = document.querySelector('#percentageSelect option[data-custom="true"]');
            if (!customOption) {
                customOption = document.createElement('option');
                customOption.setAttribute('data-custom', 'true');
                percentageSelect.appendChild(customOption);
            }
            
            customOption.value = value;
            customOption.textContent = `${value}% (自定义)`;
            customOption.selected = true;
        }
    });
    
    // 防止输入非数字字符
    percentageInput.addEventListener('input', () => {
        percentageInput.value = percentageInput.value.replace(/[^0-9]/g, '');
    });
});