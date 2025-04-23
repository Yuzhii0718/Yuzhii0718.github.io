document.addEventListener('DOMContentLoaded', function() {
    // 初始化轮播图
    initBanner();
});

function getXML(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const xml = xhr.responseXML;
                if (xml) {
                    callback(xml);
                } else {
                    console.error('XML解析失败');
                    callback(null);
                }
            } else {
                console.error('请求失败，状态码：' + xhr.status);
                callback(null);
            }
        }
    };
    xhr.onerror = function() {
        console.error('请求发生错误');
        callback(null);
    };
    xhr.send();
}

function initBanner() {
    // 获取XML数据
    getXML('common/banners.xml', function(xml) {
        if (xml) {
            // 解析XML并生成轮播图
            createBanner(xml);
        } else {
            console.error('无法加载轮播图数据');
        }
    });
}

function createBanner(xml) {
    const banners = xml.getElementsByTagName('banner');
    if (!banners || banners.length === 0) return;

    const bannerWrapper = document.querySelector('.banner-wrapper');
    const paginationContainer = document.querySelector('.banner-pagination');
    
    // 清空容器
    bannerWrapper.innerHTML = '';
    paginationContainer.innerHTML = '';
    
    // 创建轮播图项目和分页指示器
    for (let i = 0; i < banners.length; i++) {
        const banner = banners[i];
        const image = banner.getElementsByTagName('image')[0].textContent;
        const title = banner.getElementsByTagName('title')[0].textContent;
        
        // 读取是否显示标题的设置
        let showTitle = false;
        const showTitleElements = banner.getElementsByTagName('showtitle');
        if (showTitleElements.length > 0) {
            showTitle = showTitleElements[0].textContent.toLowerCase() === 'true';
        }
        
        // 创建轮播图项
        const bannerItem = document.createElement('div');
        bannerItem.className = 'banner-item';
        
        // 根据showTitle决定是否包含标题元素
        bannerItem.innerHTML = `
            <img src="${image}" alt="${title}">
            ${showTitle ? `<div class="banner-title">${title}</div>` : ''}
        `;
        
        bannerWrapper.appendChild(bannerItem);
        
        // 创建分页指示器
        const paginationDot = document.createElement('div');
        paginationDot.className = 'banner-pagination-bullet';
        if (i === 0) paginationDot.classList.add('active');
        paginationDot.setAttribute('data-index', i);
        paginationContainer.appendChild(paginationDot);
    }
    
    // 初始化显示第一个轮播项
    bannerWrapper.style.transform = 'translateX(0)';
    
    // 设置轮播逻辑
    setupBannerLogic(banners.length);
}

function setupBannerLogic(totalBanners) {
    let currentIndex = 0;
    let autoPlayInterval;
    let buttonsHideTimeout;
    
    const bannerItems = document.querySelectorAll('.banner-item');
    const paginationBullets = document.querySelectorAll('.banner-pagination-bullet');
    const prevButton = document.querySelector('.banner-button-prev');
    const nextButton = document.querySelector('.banner-button-next');
    const buttonsContainer = document.querySelector('.banner-buttons');
    const bannerContainer = document.querySelector('.banner-container');
    
    // 显示指定索引的轮播图
    function showBanner(index) {
        // 边界检查
        if (index < 0) index = totalBanners - 1;
        if (index >= totalBanners) index = 0;
        
        // 更新当前索引
        currentIndex = index;
        
        // 更新轮播图显示 - 使用transform进行滑动
        const bannerWrapper = document.querySelector('.banner-wrapper');
        bannerWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // 更新分页指示器
        paginationBullets.forEach((bullet, i) => {
            bullet.classList.toggle('active', i === currentIndex);
        });
    }
    
    // 下一张
    function nextBanner() {
        showBanner(currentIndex + 1);
    }
    
    // 上一张
    function prevBanner() {
        showBanner(currentIndex - 1);
    }
    
    // 显示按钮
    function showButtons() {
        // 清除之前的隐藏计时器
        if (buttonsHideTimeout) {
            clearTimeout(buttonsHideTimeout);
            buttonsHideTimeout = null;
        }
        
        // 立即显示按钮
        buttonsContainer.classList.add('visible');
    }
    
    // 隐藏按钮
    function hideButtons() {
        // 设置延迟隐藏
        buttonsHideTimeout = setTimeout(() => {
            buttonsContainer.classList.remove('visible');
        }, 1000); // 3秒后隐藏
    }
    
    // 开始自动播放
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextBanner, 5000); // 5秒切换一次
    }
    
    // 停止自动播放
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // 事件监听：点击分页指示器
    paginationBullets.forEach((bullet) => {
        bullet.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showBanner(index);
            stopAutoPlay();
            startAutoPlay();
        });
    });
    
    // 事件监听：点击前进/后退按钮
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            prevBanner();
            stopAutoPlay();
            startAutoPlay();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            nextBanner();
            stopAutoPlay();
            startAutoPlay();
        });
    }
    
    // 鼠标悬停相关事件
    if (bannerContainer) {
        // 鼠标进入显示按钮，暂停自动播放
        bannerContainer.addEventListener('mouseenter', function() {
            showButtons();
            stopAutoPlay();
        });
        
        // 鼠标离开延迟隐藏按钮，恢复自动播放
        bannerContainer.addEventListener('mouseleave', function() {
            hideButtons();
            startAutoPlay();
        });
    }
    
    // 初始启动自动播放
    startAutoPlay();
}