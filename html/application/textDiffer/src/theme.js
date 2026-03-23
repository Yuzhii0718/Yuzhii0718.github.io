/**
 * 主题管理脚本 - 在页面渲染前处理主题
 * 必须在<head>中以普通脚本形式加载，以避免闪烁
 */

// 立即执行函数，避免污染全局作用域
(function() {
  // 初始化主题设置
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // 应用系统主题
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }

  // 监听系统主题变化
  function listenForSystemThemeChanges() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(event) {
      if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light');
        document.dispatchEvent(new CustomEvent('themeChanged', { 
          detail: { theme: event.matches ? 'dark' : 'light' } 
        }));
      }
    });
  }

  // 切换主题
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // 触发主题变更事件
    document.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: newTheme }
    }));
    
    return newTheme === 'dark';
  }

  // 获取当前主题状态
  function isDarkTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }
  
  // 应用系统主题
  function applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    
    // 触发主题变更事件
    document.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: prefersDark ? 'dark' : 'light' }
    }));
    
    return prefersDark;
  }
  
  // 设置为系统主题
  function setSystemTheme() {
    localStorage.removeItem('theme');
    applySystemTheme();
    return isDarkTheme();
  }

  // 在页面加载前设置主题
  initTheme();
  
  // 为了支持后期可能的主题变化，监听系统主题切换
  if (window.matchMedia) {
    listenForSystemThemeChanges();
  }

  // 暴露到全局对象，以便其他脚本使用
  window.themeManager = {
    toggle: toggleTheme,
    isDark: isDarkTheme,
    setSystemTheme: setSystemTheme,
    applySystemTheme: applySystemTheme
  };
})();

// 删除这里的DOMContentLoaded事件处理器
// 避免与header.js中的处理冲突 