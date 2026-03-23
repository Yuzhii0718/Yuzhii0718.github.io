document.addEventListener('DOMContentLoaded', function() {
  // 初始化变量
  let mergely;
  const alignmentWidgets = { lhs: [], rhs: [] };
  
  // DOM元素
  const compareBtn = document.getElementById('compare-btn');
  const clearBtn = document.getElementById('clear-btn');
  const swapBtn = document.getElementById('swap-btn');
  const loadSampleBtn = document.getElementById('load-sample-btn');
  const uploadLeftBtn = document.getElementById('upload-left-btn');
  const uploadRightBtn = document.getElementById('upload-right-btn');
  const fileInputLeft = document.getElementById('file-input-left');
  const fileInputRight = document.getElementById('file-input-right');
  const wrapLinesCheckbox = document.getElementById('wrap-lines');
  const lineNumbersCheckbox = document.getElementById('line-numbers');
  const smartAlignCheckbox = document.getElementById('smart-align');
  const normalizeIndentBtn = document.getElementById('normalize-indent-btn');
  const copyLeftBtn = document.getElementById('copy-left-btn');
  const copyRightBtn = document.getElementById('copy-right-btn');
  const prevChangeBtn = document.getElementById('prev-change-btn');
  const nextChangeBtn = document.getElementById('next-change-btn');
  const mergeLeftBtn = document.getElementById('merge-left-btn');
  const mergeRightBtn = document.getElementById('merge-right-btn');
  const statusMessage = document.getElementById('status-message');
  const diffStats = document.getElementById('diff-stats');
  const errorContainer = document.getElementById('error-container');
  const errorMessage = document.getElementById('error-message');
  const closeErrorBtn = document.getElementById('close-error');
  
  // 初始化Mergely
  initMergely();
  
  // 绑定事件处理程序
  bindEventHandlers();
  
  // 函数定义
  /**
   * 检测文本的缩进大小（空格数）
   * @param {string} text - 原始文本
   * @returns {number} - 缩进空格数（2 或 4，默认 4）
   */
  function detectIndentSize(text) {
    if (!text) return 4;
    
    const lines = text.split('\n');
    const indents = [];
    
    // 收集所有使用空格缩进的行
    for (const line of lines) {
      const match = line.match(/^( +)\S/);
      if (match) {
        indents.push(match[1].length);
      }
    }
    
    if (indents.length === 0) return 4;
    
    // 找出最小的非零缩进
    const minIndent = Math.min(...indents.filter(n => n > 0));
    
    // 判断是 2 空格还是 4 空格（优先判断为 2 或 4）
    if (minIndent === 2 || minIndent % 2 === 0 && minIndent < 4) {
      return 2;
    }
    return 4;
  }
  
  /**
   * 标准化缩进：将行首的 tab 转换为空格
   * @param {string} text - 原始文本
   * @param {number} spaceCount - 每个 tab 转换为多少个空格
   * @returns {string} - 标准化后的文本
   */
  function normalizeIndentation(text, spaceCount) {
    if (!text) return text;
    
    const spaces = ' '.repeat(spaceCount);
    
    // 只替换行首的 tab，不替换行中间的 tab
    return text.split('\n').map(line => {
      return line.replace(/^\t+/, match => spaces.repeat(match.length));
    }).join('\n');
  }
  
  function initMergely() {
    // 检测当前主题
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // 设置初始化选项
    const options = {
      autoupdate: true,
      sidebar: true,
      lcs: true,
      wrap_lines: wrapLinesCheckbox.checked,
      line_numbers: lineNumbersCheckbox.checked,
      ignorews: smartAlignCheckbox ? smartAlignCheckbox.checked : true,
      license: 'lgpl-separate-notice',
      
      cmsettings: {
        lineWrapping: wrapLinesCheckbox.checked,
        lineNumbers: lineNumbersCheckbox.checked,
        theme: isDarkTheme ? 'monokai' : 'eclipse',
        readOnly: false,
        mode: 'text/plain'
      },
      lhs_cmsettings: {
        readOnly: false
      },
      rhs_cmsettings: {
        readOnly: false
      }
    };
    
    // 初始化Mergely编辑器
    mergely = new Mergely('#mergely-editor', options);
    
    // 监听更新事件：刷新统计并执行块级可视对齐
    mergely.on('updated', handleMergelyUpdated);
  }
  
  function bindEventHandlers() {
    // 按钮事件
    compareBtn.addEventListener('click', compareDiff);
    clearBtn.addEventListener('click', clearEditors);
    swapBtn.addEventListener('click', swapEditors);
    loadSampleBtn.addEventListener('click', loadSampleData);
    uploadLeftBtn.addEventListener('click', () => fileInputLeft.click());
    uploadRightBtn.addEventListener('click', () => fileInputRight.click());
    copyLeftBtn.addEventListener('click', () => copyText('lhs'));
    copyRightBtn.addEventListener('click', () => copyText('rhs'));
    nextChangeBtn.addEventListener('click', () => mergely.scrollToDiff('next'));
    prevChangeBtn.addEventListener('click', () => mergely.scrollToDiff('prev'));
    mergeLeftBtn.addEventListener('click', () => mergely.merge('lhs'));
    mergeRightBtn.addEventListener('click', () => mergely.merge('rhs'));
    closeErrorBtn.addEventListener('click', hideError);
    
    // 文件上传处理
    fileInputLeft.addEventListener('change', e => handleFileUpload(e, 'lhs'));
    fileInputRight.addEventListener('change', e => handleFileUpload(e, 'rhs'));
    
    // 选项变更处理
    wrapLinesCheckbox.addEventListener('change', updateOptions);
    lineNumbersCheckbox.addEventListener('change', updateOptions);
    if (smartAlignCheckbox) {
      smartAlignCheckbox.addEventListener('change', updateOptions);
    }
    
    // 统一缩进按钮
    normalizeIndentBtn.addEventListener('click', normalizeIndentationClick);
    
    // 添加主题变更监听
    document.addEventListener('themeChanged', handleThemeChange);
    
    // 窗口大小变化时调整编辑器大小
    window.addEventListener('resize', resizeMergely);
  }
  
  function compareDiff() {
    try {
      mergely.update();
      updateStatus('已比较两侧的文本');
    } catch (error) {
      showError('比较失败: ' + error.message);
    }
  }
  
  function clearEditors() {
    mergely.lhs('');
    mergely.rhs('');
    clearVisualAlignment();
    updateStatus('编辑器已清空');
    updateDiffStats();
  }
  
  function swapEditors() {
    const lhsContent = mergely.get('lhs');
    const rhsContent = mergely.get('rhs');
    
    mergely.lhs(rhsContent);
    mergely.rhs(lhsContent);
    
    updateStatus('左右文本已交换');
    updateDiffStats();
  }
  
  function loadSampleData() {
    const leftSample = '这是左侧示例文本。\n\n这一行没有任何变化。\n这一行将会被修改。\n这一行会从右侧文本中删除。\n\n这是示例的最后一行。';
    const rightSample = '这是右侧示例文本。\n\n这一行没有任何变化。\n这一行已经被修改了！\n\n这是示例的最后一行。\n这是右侧新增的一行。';
    
    mergely.lhs(leftSample);
    mergely.rhs(rightSample);
    
    updateStatus('已加载示例文本');
    updateDiffStats();
  }
  
  function handleFileUpload(event, side) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      mergely[side](e.target.result);
      updateStatus(`已加载文件到${side === 'lhs' ? '左侧' : '右侧'}: ${file.name}`);
      updateDiffStats();
    };
    reader.onerror = function() {
      showError('读取文件失败');
    };
    reader.readAsText(file);
    
    // 重置文件输入，以便于下次选择同一文件也能触发事件
    event.target.value = '';
  }
  
  function copyText(side) {
    const text = mergely.get(side);
    navigator.clipboard.writeText(text)
      .then(() => {
        updateStatus(`已复制${side === 'lhs' ? '左侧' : '右侧'}文本到剪贴板`);
      })
      .catch(err => {
        showError('复制失败: ' + err.message);
      });
  }
  
  function updateOptions() {
    const options = {
      wrap_lines: wrapLinesCheckbox.checked,
      line_numbers: lineNumbersCheckbox.checked,
      ignorews: smartAlignCheckbox ? smartAlignCheckbox.checked : true,
      cmsettings: {
        lineWrapping: wrapLinesCheckbox.checked,
        lineNumbers: lineNumbersCheckbox.checked
      }
    };
    
    mergely.options(options);
    if (smartAlignCheckbox && !smartAlignCheckbox.checked) {
      clearVisualAlignment();
    }
    mergely.update();
    updateDiffStats();
    updateStatus('已更新显示选项');
  }

  function handleMergelyUpdated() {
    updateDiffStats();
    applyVisualAlignment();
  }

  function clearVisualAlignment() {
    ['lhs', 'rhs'].forEach(side => {
      const widgets = alignmentWidgets[side];
      while (widgets.length) {
        const widget = widgets.pop();
        try {
          widget.clear();
        } catch (_) {
          // ignore
        }
      }
    });
  }

  function getChangeLineCount(change, side) {
    const from = change[`${side}-line-from`];
    const to = change[`${side}-line-to`];
    if (typeof from !== 'number' || typeof to !== 'number' || from < 0 || to < 0) {
      return 0;
    }
    return Math.max(0, to - from + 1);
  }

  function createAlignmentSpacer(heightPx) {
    const spacer = document.createElement('div');
    spacer.className = 'diff-align-spacer';
    spacer.style.height = `${heightPx}px`;
    return spacer;
  }

  function addAlignmentSpacer(side, line, above, heightPx) {
    if (heightPx <= 0) return;

    const cm = mergely.cm(side);
    if (!cm) return;

    const lineCount = cm.lineCount();
    if (lineCount <= 0) return;

    const targetLine = Math.max(0, Math.min(line, lineCount - 1));
    const spacer = createAlignmentSpacer(heightPx);
    const widget = cm.addLineWidget(targetLine, spacer, {
      above,
      noHScroll: true,
      coverGutter: false,
      handleMouseEvents: false
    });

    alignmentWidgets[side].push(widget);
  }

  function applyVisualAlignment() {
    clearVisualAlignment();

    if (!smartAlignCheckbox || !smartAlignCheckbox.checked) return;
    if (!mergely || !Array.isArray(mergely._changes) || mergely._changes.length === 0) return;

    const cmLhs = mergely.cm('lhs');
    const cmRhs = mergely.cm('rhs');
    if (!cmLhs || !cmRhs) return;

    const lhsLineHeight = typeof cmLhs.defaultTextHeight === 'function' ? cmLhs.defaultTextHeight() : 18;
    const rhsLineHeight = typeof cmRhs.defaultTextHeight === 'function' ? cmRhs.defaultTextHeight() : 18;

    mergely._changes.forEach(change => {
      const lhsCount = getChangeLineCount(change, 'lhs');
      const rhsCount = getChangeLineCount(change, 'rhs');

      if (lhsCount === rhsCount) return;

      if (lhsCount > rhsCount) {
        const gapLines = lhsCount - rhsCount;
        const height = gapLines * rhsLineHeight;
        const rhsFrom = change['rhs-line-from'];
        const rhsTo = change['rhs-line-to'];
        if (rhsFrom < 0 && rhsTo < 0) {
          addAlignmentSpacer('rhs', 0, true, height);
        } else {
          addAlignmentSpacer('rhs', Math.max(0, rhsTo), false, height);
        }
      } else {
        const gapLines = rhsCount - lhsCount;
        const height = gapLines * lhsLineHeight;
        const lhsFrom = change['lhs-line-from'];
        const lhsTo = change['lhs-line-to'];
        if (lhsFrom < 0 && lhsTo < 0) {
          addAlignmentSpacer('lhs', 0, true, height);
        } else {
          addAlignmentSpacer('lhs', Math.max(0, lhsTo), false, height);
        }
      }
    });
  }
  
  /**
   * 统一缩进：将两侧内容中行首的 tab 转换为空格
   */
  function normalizeIndentationClick() {
    const lhsContent = mergely.get('lhs');
    const rhsContent = mergely.get('rhs');
    
    if (!lhsContent && !rhsContent) {
      showError('编辑器内容为空');
      return;
    }
    
    // 检测两侧的缩进大小，使用较小的那个（更常见）
    const lhsIndent = detectIndentSize(lhsContent);
    const rhsIndent = detectIndentSize(rhsContent);
    const indentSize = Math.min(lhsIndent, rhsIndent);
    
    // 标准化缩进（只替换行首的 tab）
    const normalizedLhs = normalizeIndentation(lhsContent, indentSize);
    const normalizedRhs = normalizeIndentation(rhsContent, indentSize);
    
    // 检查是否有内容发生变化
    const hasChanged = normalizedLhs !== lhsContent || normalizedRhs !== rhsContent;
    
    if (hasChanged) {
      mergely.lhs(normalizedLhs);
      mergely.rhs(normalizedRhs);
      updateDiffStats();
      updateStatus(`已将行首 Tab 转换为 ${indentSize} 个空格`);
    } else {
      updateStatus('内容行首没有 Tab 字符，无需转换');
    }
  }
  
  function handleThemeChange(e) {
    if (!mergely) return;
    
    // 获取当前主题 - 直接从DOM读取，确保获取到最新值
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    const theme = isDarkTheme ? 'monokai' : 'eclipse';
    
    // 更新CodeMirror主题
    try {
      // 获取当前选项
      const options = mergely.options();
      
      // 更新主题设置
      options.cmsettings.theme = theme;
      
      // 应用新选项
      mergely.options(options);
      
      // 确保编辑器应用了新样式
      const cmLhs = mergely.cm('lhs');
      const cmRhs = mergely.cm('rhs');
      
      if (cmLhs) cmLhs.setOption('theme', theme);
      if (cmRhs) cmRhs.setOption('theme', theme);
      
      // 触发重绘
      mergely.resize();
      
      console.log(`Mergely主题已更新为: ${theme}`);
    } catch (error) {
      console.error('更新Mergely主题时出错:', error);
    }
  }
  
  function resizeMergely() {
    if (mergely) {
      mergely.resize();
      applyVisualAlignment();
    }
  }
  
  function updateDiffStats() {
    if (!mergely) return;
    
    try {
      const summary = mergely.summary();
      const totalChanges = summary.a + summary.c + summary.d;
      diffStats.textContent = `${totalChanges} 处更改 (添加: ${summary.a}, 修改: ${summary.c}, 删除: ${summary.d})`;
    } catch (error) {
      diffStats.textContent = '无法计算差异';
    }
  }
  
  function updateStatus(message) {
    statusMessage.textContent = message;
    // 状态消息会在3秒后恢复
    setTimeout(() => {
      statusMessage.textContent = '准备就绪';
    }, 3000);
  }
  
  function showError(message) {
    errorMessage.textContent = message;
    errorContainer.style.display = 'block';
  }
  
  function hideError() {
    errorContainer.style.display = 'none';
  }
  
  // 页面加载完成后的初始设置
  updateStatus('文本对比工具已准备就绪');
  // 自动调整大小
  setTimeout(resizeMergely, 100);
  
  // 确保初始主题正确
  setTimeout(() => {
    handleThemeChange();
  }, 200);
}); 