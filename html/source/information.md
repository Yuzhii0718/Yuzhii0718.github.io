# 资讯

<p id="version">Version: </p>
<p id="year">Year: </p>
<p id="author">Author: </p>

---

> "So every bondman in his own hand bears
> The power to cancel his captivity."
William Shakespeare, Julius Cæsar (1599), Act I, scene 3, line 101

<script>
    fetch('/html/common/config.json')
        .then(response => response.json())
        .then(data => {
            // 从配置中获取需要的信息
            window.Version = data.Version;
            window.Year = data.Year;
            window.author = data.author;
            window.email = data.email;
        // 触发自定义事件
        let event = new Event('configLoaded');
        document.dispatchEvent(event);
    })
    .catch(error => console.error('Error:', error));

    // 监听自定义事件
    document.addEventListener('configLoaded', function () {

        // 更新文字内容
        function updateInnerHTML(id, content) {
            let element = document.getElementById(id);
            if (element) {
                element.innerHTML += content;
            }
        }

        updateInnerHTML('version', window.Version);
        updateInnerHTML('year', window.Year);
        updateInnerHTML('author', window.author);
        updateInnerHTML('email', window.email);
        });
</script>
