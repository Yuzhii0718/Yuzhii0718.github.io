// 从config.json中获取配置

// 注意，这需要异步加载，否则将显示 undefined
fetch('/html/common/config.json')
    .then(response => response.json())
    .then(data => {
        // 从配置中获取需要的信息
        window.Version = data.Version;
        window.Year = data.Year;
        window.author = data.author;
        window.email = data.email;
        window.copyright = {
            text: data.copyright.text,
            url: data.copyright.url
        };
        window.beian = {
            text: data.beian.text,
            url: data.beian.url
        };
        console.log('Version:', window.Version);

        // 触发自定义事件
        var event = new Event('configLoaded');
        document.dispatchEvent(event);
    })
    .catch(error => console.error('Error:', error));

// 监听自定义事件
document.addEventListener('configLoaded', function () {
    if(document.getElementById('version')) {
        document.getElementById('version').innerHTML += window.Version;
    }
    if(document.getElementById('year')) {
        document.getElementById('year').innerHTML += window.Year;
    }
    if(document.getElementById('author')) {
        document.getElementById('author').innerHTML += window.author;
    }
    if(document.getElementById('email')) {
        document.getElementById('email').innerHTML += window.email;
    }
    if(document.getElementById('copyright')) {
        document.getElementById('copyright').innerHTML += `
            <a style="text-decoration:none" href="${window.copyright.url}" target="_blank">${window.copyright.text}</a>
        `;
    }
    if(document.getElementById('beian')) {
        document.getElementById('beian').innerHTML += `
            <a style="text-decoration:none" href="${window.beian.url}" target="_blank">${window.beian.text}</a>
        `;
    }
});