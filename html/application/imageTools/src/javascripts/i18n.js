// i18n.js — 中英双语字典 + 翻译函数 + DOM 渲染
// 用法：
//   静态文本：HTML 元素加 data-i18n="key"，启动时自动渲染
//   动态文本：t('key') 或 t('key', { name: 'foo' })
//   带属性：data-i18n-attr="placeholder:key"
//   切换语言：setLang('en') / setLang('zh')

const I18N_DICT = {
    zh: {
        // 通用
        'app.title': '图像工具',
        'app.keywords': '图像工具, 图像裁剪, 图像压缩, 图像转换',
        'app.description': '一套功能强大的图像工具，提供图像裁剪、图像压缩和图像格式转换等功能，满足各种图像处理需求。',

        // 导航
        'nav.logo': '图像工具',
        'nav.resize': '图像裁剪',
        'nav.compress': '图像压缩',
        'nav.convert': '图像转换',
        'nav.help': '帮助',
        'nav.lang': 'EN',

        // 上传与预览
        'upload.hint': '拖放图片到这里或点击选择文件',
        'upload.invalid': '请上传图片文件',
        'upload.image_load_failed': '图片加载失败',
        'upload.image_loaded': '图片已加载',
        'upload.no_image_available': '没有可用的图片',
        'preview.title': '预览',
        'preview.alt': '预览',
        'preview.empty': '队列为空：请先添加图片',
        'preview.start_download': '开始下载',
        'preview.cleared': '已清除',

        // 图像信息
        'info.filename': '文件名',
        'info.original_size': '原始大小',
        'info.resized_size': '调整后大小',
        'info.compressed_size': '压缩后大小',
        'info.converted_size': '转换后大小',
        'info.target_size': '目标大小',
        'info.size_change': '大小变化',
        'info.compression_ratio': '压缩率',
        'info.quality_param': '质量参数',
        'info.dimensions': '尺寸',
        'info.unit_px': '像素',
        'info.unit_kb': 'KB',
        'info.unit_mb': 'MB',
        'info.type': '类型',
        'info.status': '状态',
        'info.target_format': '目标格式',
        'info.actual_format': '实际',
        'info.status_no_need': '原图已小于目标值，无需压缩',

        // 裁剪工具
        'resize.mode_percentage': '百分比调整',
        'resize.mode_pixels': '像素调整',
        'resize.mode_custom': '自定义',
        'resize.scale_ratio': '缩放比例：',
        'resize.target_width': '目标宽度：',
        'resize.width': '宽度：',
        'resize.height': '高度：',
        'resize.maintain_aspect': '保持比例：',
        'resize.btn_resize': '调整尺寸',
        'resize.btn_download': '下载图片',
        'resize.btn_clear': '清除',
        'resize.success': '调整成功！\n原始尺寸：{ow}×{oh}\n调整后：{tw}×{th}\n大小变化：{change}%',
        'resize.method_unavailable': '{method}图片不可用',

        // 压缩工具
        'compress.mode_size': '缩小优先',
        'compress.mode_quality': '清晰优先',
        'compress.mode_by_quality': '按质量调整',
        'compress.mode_by_size': '按大小调整',
        'compress.quality': '压缩质量：',
        'compress.target_size': '目标大小：',
        'compress.size_hint': '将自动调整压缩质量，使文件大小接近目标值。',
        'compress.btn_compress': '压缩图片',
        'compress.btn_download': '下载图片',
        'compress.btn_clear': '清除',
        'compress.already_small': '原图 {original} KB 已小于目标 {target} KB\n无需压缩，已使用原图',
        'compress.success_target_met': '压缩成功！\n原始：{original} KB → 压缩后：{compressed} KB\n目标：{target} KB 已达成',
        'compress.success': '压缩成功！\n原始：{original} KB → 压缩后：{compressed} KB\n压缩率：{ratio}%',
        'compress.target_not_met': '已尽力压缩至 {compressed} KB\n未达到目标 {target} KB，请尝试调大目标值或缩小尺寸',
        'compress.invalid': '压缩无效\n原始：{original} KB → 压缩后：{compressed} KB (+{ratio}%)\n原图可能已是高压缩格式，建议降低质量参数或先用「调整尺寸」缩小',
        'compress.failed': '压缩失败，请重试',

        // 转换工具
        'convert.quality': '图片质量：',
        'convert.btn_convert': '转换格式',
        'convert.btn_download': '下载图片',
        'convert.btn_clear': '清除',
        'convert.unknown_format': '未知的输出格式',
        'convert.unsupported_fallback': '浏览器不支持直接导出 {format} 格式\n将回退为 PNG 下载',
        'convert.fallback_to_png': '目标格式 {format} 不被支持，已回退为 PNG',
        'convert.fallback_note': '\n(浏览器回退为 {format})',
        'convert.success': '转换完成！\n原始格式：{original_format}\n目标格式：{target_format}\n大小：{original} KB → {converted} KB ({change}){fallback}',
        'convert.failed': '转换失败，请重试',
        'convert.size_decrease': '减小 {percent}%',
        'convert.size_increase': '增大 {percent}%',

        // 批量处理
        'batch.title': '批量处理',
        'batch.subtitle': '按当前页签与当前参数对多张图片连续处理并下载。',
        'batch.select': '选择多张图片',
        'batch.process': '批量处理并下载 ZIP',
        'batch.cancel': '取消',
        'batch.clear': '清空队列',
        'batch.no_new': '没有新增可用图片（可能重复或格式不支持）',
        'batch.added': '已加入队列：{count} 张',
        'batch.select_first': '请先选择批量图片',
        'batch.no_zip': '缺少 ZIP 组件，无法打包下载',
        'batch.start': '开始处理：0/{total}',
        'batch.processing': '处理中：{name} ({done}/{total})',
        'batch.done': '已完成：{done}/{total}',
        'batch.zipping': '正在打包 ZIP...',
        'batch.cancelled': '批量处理已取消（成功 {success}，失败 {failure}）',
        'batch.completed': '批量处理完成（成功 {success}，失败 {failure}）',
        'batch.canceling': '正在取消...（当前项结束后停止）',
        'batch.row_queued': '待处理：{name}',
        'batch.row_processing': '处理中：{name}',
        'batch.row_success': '完成：{message}',
        'batch.row_error': '失败：{name}（{message}）',
        'batch.remove': '删除',
        'batch.progress': '进度：{done}/{total} ({percent}%)',

        // 帮助
        'help.title_resize': '图像裁剪帮助',
        'help.title_compress': '图像压缩帮助',
        'help.title_convert': '图像转换帮助',

        // 文件名前缀
        'prefix.resized': 'resized_',
        'prefix.compressed': 'compressed_',
        'prefix.converted': 'converted_'
    },

    en: {
        // 通用
        'app.title': 'Image Tools',
        'app.keywords': 'image tools, image resizer, image compressor, image converter',
        'app.description': 'A powerful image toolkit: resize, compress, and convert image formats to meet various image processing needs.',

        // 导航
        'nav.logo': 'Image Tools',
        'nav.resize': 'Resize',
        'nav.compress': 'Compress',
        'nav.convert': 'Convert',
        'nav.help': 'Help',
        'nav.lang': '中文',

        // 上传与预览
        'upload.hint': 'Drop image here or click to select a file',
        'upload.invalid': 'Please upload an image file',
        'upload.image_load_failed': 'Image load failed',
        'upload.image_loaded': 'Image loaded',
        'upload.no_image_available': 'No image available',
        'preview.title': 'Preview',
        'preview.alt': 'Preview',
        'preview.empty': 'Queue is empty: add images first',
        'preview.start_download': 'Downloading',
        'preview.cleared': 'Cleared',
        'preview.batch_queued': 'Queued: {name}',
        'preview.batch_processing': 'Processing: {name}',
        'preview.batch_success': 'Done: {message}',
        'preview.batch_error': 'Failed: {name} ({message})',
        'preview.batch_remove': 'Remove',

        // 图像信息
        'info.original_size': 'Original size',
        'info.resized_size': 'Resized size',
        'info.compressed_size': 'Compressed size',
        'info.converted_size': 'Converted size',
        'info.target_size': 'Target size',
        'info.size_change': 'Size change',
        'info.compression_ratio': 'Compression ratio',
        'info.quality_param': 'Quality',
        'info.dimensions': 'Dimensions',
        'info.unit_px': 'px',
        'info.unit_kb': 'KB',
        'info.unit_mb': 'MB',
        'info.status': 'Status',
        'info.target_format': 'Target format',
        'info.actual_format': 'Actual',
        'info.status_no_need': 'Original already smaller than target, no compression needed',

        // 裁剪工具
        'resize.mode_percentage': 'Percentage',
        'resize.mode_pixels': 'Pixels',
        'resize.mode_custom': 'Custom',
        'resize.scale_ratio': 'Scale ratio:',
        'resize.target_width': 'Target width:',
        'resize.width': 'Width:',
        'resize.height': 'Height:',
        'resize.maintain_aspect': 'Maintain aspect ratio:',
        'resize.btn_resize': 'Resize',
        'resize.btn_download': 'Download',
        'resize.btn_clear': 'Clear',
        'resize.success': 'Resized!\nOriginal: {ow}×{oh}\nResized: {tw}×{th}\nSize change: {change}%',
        'resize.method_unavailable': '{method} image unavailable',

        // 压缩工具
        'compress.mode_size': 'Smaller first',
        'compress.mode_quality': 'Clearer first',
        'compress.mode_by_quality': 'By quality',
        'compress.mode_by_size': 'By size',
        'compress.quality': 'Quality:',
        'compress.target_size': 'Target size:',
        'compress.size_hint': 'Quality will be auto-adjusted to approach the target size.',
        'compress.btn_compress': 'Compress',
        'compress.btn_download': 'Download',
        'compress.btn_clear': 'Clear',
        'compress.already_small': 'Original {original} KB is smaller than target {target} KB\nNo compression needed, using original',
        'compress.success_target_met': 'Compressed!\nOriginal: {original} KB → Compressed: {compressed} KB\nTarget {target} KB met',
        'compress.success': 'Compressed!\nOriginal: {original} KB → Compressed: {compressed} KB\nRatio: {ratio}%',
        'compress.target_not_met': 'Best effort: compressed to {compressed} KB\nDid not reach target {target} KB. Try a larger target or resize first.',
        'compress.invalid': 'Compression ineffective\nOriginal: {original} KB → Compressed: {compressed} KB (+{ratio}%)\nOriginal may already be highly compressed. Try lower quality or resize first.',
        'compress.failed': 'Compression failed, please retry',

        // 转换工具
        'convert.quality': 'Quality:',
        'convert.btn_convert': 'Convert',
        'convert.btn_download': 'Download',
        'convert.btn_clear': 'Clear',
        'convert.unknown_format': 'Unknown output format',
        'convert.unsupported_fallback': 'Browser cannot export {format} directly\nWill fall back to PNG',
        'convert.fallback_to_png': '{format} not supported, fell back to PNG',
        'convert.fallback_note': '\n(Browser fell back to {format})',
        'convert.success': 'Converted!\nOriginal: {original_format}\nTarget: {target_format}\nSize: {original} KB → {converted} KB ({change}){fallback}',
        'convert.failed': 'Conversion failed, please retry',
        'convert.size_decrease': 'decreased {percent}%',
        'convert.size_increase': 'increased {percent}%',

        // 批量处理
        'batch.title': 'Batch Processing',
        'batch.subtitle': 'Process multiple images continuously with current tab & parameters, then download.',
        'batch.select': 'Select multiple images',
        'batch.process': 'Batch process & download ZIP',
        'batch.cancel': 'Cancel',
        'batch.clear': 'Clear queue',
        'batch.no_new': 'No new images added (duplicates or unsupported format)',
        'batch.added': 'Added {count} image(s) to queue',
        'batch.select_first': 'Please select batch images first',
        'batch.no_zip': 'ZIP component missing, cannot package download',
        'batch.start': 'Starting: 0/{total}',
        'batch.processing': 'Processing: {name} ({done}/{total})',
        'batch.done': 'Done: {done}/{total}',
        'batch.zipping': 'Zipping...',
        'batch.cancelled': 'Batch cancelled (success {success}, failure {failure})',
        'batch.completed': 'Batch completed (success {success}, failure {failure})',
        'batch.canceling': 'Canceling... (stops after current item)',
        'batch.row_queued': 'Queued: {name}',
        'batch.row_processing': 'Processing: {name}',
        'batch.row_success': 'Done: {message}',
        'batch.row_error': 'Failed: {name} ({message})',
        'batch.remove': 'Remove',
        'batch.progress': 'Progress: {done}/{total} ({percent}%)',

        // 帮助
        'help.title_resize': 'Image Resize Help',
        'help.title_compress': 'Image Compression Help',
        'help.title_convert': 'Image Format Conversion Help',

        // 文件名前缀
        'prefix.resized': 'resized_',
        'prefix.compressed': 'compressed_',
        'prefix.converted': 'converted_'
    }
};

let currentLang = 'zh';

// 获取翻译
function t(key, params) {
    const dict = I18N_DICT[currentLang] || I18N_DICT.zh;
    let text = dict[key];
    if (text === undefined) {
        // 回退到中文
        text = I18N_DICT.zh[key];
    }
    if (text === undefined) {
        return key;
    }
    if (params) {
        Object.keys(params).forEach(k => {
            text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), String(params[k]));
        });
    }
    return text;
}

// 获取当前语言
function getLang() {
    return currentLang;
}

// 切换语言
function setLang(lang) {
    if (!I18N_DICT[lang]) return;
    currentLang = lang;
    localStorage.setItem('imagetools-lang', lang);
    applyI18n();
    document.documentElement.lang = lang === 'zh' ? 'zh' : 'en';
    // 触发自定义事件，便于 JS 重新渲染动态文本
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

// 切换语言（toggle）
function toggleLang() {
    setLang(currentLang === 'zh' ? 'en' : 'zh');
}

// 扫描 DOM 应用翻译
// 元素标记方式：
//   data-i18n="key"                       → textContent
//   data-i18n-attr="placeholder:key"     → 属性
//   data-i18n-attr="placeholder:key1,title:key2" → 多属性
function applyI18n() {
    // textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (key) el.textContent = t(key);
    });
    // 属性
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
        const spec = el.dataset.i18nAttr;
        spec.split(',').forEach(pair => {
            const idx = pair.indexOf(':');
            if (idx < 0) return;
            const attr = pair.slice(0, idx).trim();
            const key = pair.slice(idx + 1).trim();
            if (attr && key) el.setAttribute(attr, t(key));
        });
    });
}

// 初始化：从 localStorage 读取上次语言
(function initLang() {
    const saved = localStorage.getItem('imagetools-lang');
    if (saved && I18N_DICT[saved]) {
        currentLang = saved;
    } else {
        // 浏览器语言检测
        const navLang = (navigator.language || 'zh').toLowerCase();
        currentLang = navLang.startsWith('zh') ? 'zh' : 'en';
    }
    document.documentElement.lang = currentLang === 'zh' ? 'zh' : 'en';
})();
