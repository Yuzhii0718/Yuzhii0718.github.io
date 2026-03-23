/**
 * 头部组件 - 在所有页面使用相同的导航栏
 */

// 加载头部内容
function loadHeader() {
  const headerContainer = document.getElementById('header-container');

  if (!headerContainer) return; // 确保 headerContainer 存在

  // 获取标题和描述
  const toolTitleElement = headerContainer.querySelector('h1');
  const toolDescElement = headerContainer.querySelector('h2');

  const toolTitle = toolTitleElement ? toolTitleElement.innerText.trim() : '工具标题';
  const toolDesc = toolDescElement ? toolDescElement.innerText.trim() : '工具描述';
  const isToolPage = toolTitle && toolDesc;
  
  // 获取当前主题状态
  const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
  const isSystemTheme = !localStorage.getItem('theme');
  
  // 构建HTML - 移除所有内联样式
  const headerHTML = `
    <header class="full-width-header">
      <div class="header-container">
        
        ${isToolPage ? `
        <div class="tool-info">
          <h1>${toolTitle}</h1>
          <p>${toolDesc}</p>
        </div>
        ` : ''}
        
        <nav class="nav-links">
          <div class="theme-toggle-container">
            <button id="theme-toggle" class="theme-button">
              ${isSystemTheme ? 
                `<span class="theme-icon">⚙️</span> 跟随系统` : 
                `<span class="theme-icon">${isDarkTheme ? '☀️' : '🌙'}</span> ${isDarkTheme ? '深色' : '浅色'}`
              }
              <span class="dropdown-arrow">▼</span>
            </button>
            <div class="theme-dropdown">
              <a href="#" class="theme-option${!isDarkTheme && !isSystemTheme ? ' active' : ''}" data-theme="light">
                <span class="theme-icon">☀️</span> <span class="theme-option-text">浅色模式</span>
              </a>
              <a href="#" class="theme-option${isDarkTheme && !isSystemTheme ? ' active' : ''}" data-theme="dark">
                <span class="theme-icon">🌙</span> <span class="theme-option-text">深色模式</span>
              </a>
              <a href="#" class="theme-option${isSystemTheme ? ' active' : ''}" data-theme="system">
                <span class="theme-icon">⚙️</span> <span class="theme-option-text">跟随系统</span>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  `;
  
  // 注入到容器中
  headerContainer.innerHTML = headerHTML;
  
  // 获取主题元素
  const themeToggle = document.getElementById('theme-toggle');
  const themeDropdown = document.querySelector('.theme-dropdown');
  const themeOptions = document.querySelectorAll('.theme-option');
  
  // 确保下拉菜单初始是隐藏的
  if (themeDropdown) {
    themeDropdown.style.display = 'none';
  }
  
  // 切换下拉菜单
  if (themeToggle && themeDropdown) {
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (themeDropdown.style.display === 'none' || !themeDropdown.style.display) {
        themeDropdown.style.display = 'block';
        // 添加点击监听，点击其他区域关闭下拉菜单
        setTimeout(() => {
          document.addEventListener('click', closeDropdown);
        }, 0);
      } else {
        themeDropdown.style.display = 'none';
        document.removeEventListener('click', closeDropdown);
      }
    });
  }
  
  // 关闭下拉菜单的函数
  function closeDropdown(e) {
    if (!e.target.closest('.theme-toggle-container')) {
      themeDropdown.style.display = 'none';
      document.removeEventListener('click', closeDropdown);
    }
  }
  
  // 主题选项点击事件
  themeOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // 阻止冒泡，防止触发document的点击事件
      
      // 隐藏下拉菜单
      themeDropdown.style.display = 'none';
      
      const theme = this.getAttribute('data-theme');
      
      // 移除所有active类
      themeOptions.forEach(opt => opt.classList.remove('active'));
      // 添加active类到当前选项
      this.classList.add('active');
      
      if (theme === 'system') {
        // 设置为跟随系统
        localStorage.removeItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        document.dispatchEvent(new CustomEvent('themeChanged', { 
          detail: { theme: prefersDark ? 'dark' : 'light' }
        }));
      } else {
        // 设置明确的主题
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        document.dispatchEvent(new CustomEvent('themeChanged', { 
          detail: { theme }
        }));
      }
      
      // 更新按钮文本和图标
      updateThemeButton();
      
      // 移除点击关闭监听器
      document.removeEventListener('click', closeDropdown);
    });
  });
  
  // 更新主题按钮文本和图标
  function updateThemeButton() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const isSystem = !localStorage.getItem('theme');
    
    if (isSystem) {
      themeToggle.innerHTML = `<span class="theme-icon">⚙️</span> 跟随系统<span class="dropdown-arrow">▼</span>`;
    } else {
      themeToggle.innerHTML = `<span class="theme-icon">${isDark ? '☀️' : '🌙'}</span> ${isDark ? '深色' : '浅色'}<span class="dropdown-arrow">▼</span>`;
    }
  }
  
  // 监听主题变更
  document.addEventListener('themeChanged', updateThemeButton);
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadHeader); 