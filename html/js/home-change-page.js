function setupClickHandler(elementId, title, iframeSrc) {
    let element = document.getElementById(elementId);
    let elementAs = element.getElementsByTagName('a');
    for (let i = 0; i < elementAs.length; i++) {
        let elementA = elementAs[i];
        elementA.onclick = function () {
            let href = this.getAttribute('href');
            if (href === '#') {
                return false
            } else {
                document.title = title;
                content.innerHTML = `<iframe src="${iframeSrc}"></iframe>`;
                let iframe = document.getElementsByTagName('iframe')[0];
                iframe.style.height = '100%';
                iframe.style.width = '100%';
                iframe.style.border = 'none';
                return false
            }
        }
    }
}

let content = document.getElementById('content');
setupClickHandler('info', '资讯', './source/information.html');
setupClickHandler('about', '关于', './source/about.html');

let home = document.getElementById('home');
if (home) {
    let homeA = home.getElementsByTagName('a')[0];
    if (homeA) {
        homeA.onclick = function () {
            document.title = '应用中心';
            content.innerHTML = '        <div id="content-top"><h1>应用中心</h1></div>\n        <div id="content-box-1">\n            <div class="content-app" id="app1">\n            </div>\n            <div class="content-app" id="app2">\n            </div>\n            <div class="content-app" id="app3">\n            </div>\n            <div class="content-app" id="app4">\n            </div>\n        </div>\n        <div id="content-box-2">\n            <div class="content-app" id="app5">\n            </div>\n            <div class="content-app" id="app6">\n            </div>\n            <div class="content-app" id="app7">\n            </div>\n            <div class="content-app" id="app8">\n            </div>\n        </div>'
            // 定义当appdata.xml请求的状态改变时执行的函数
            xhttpApp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    // 当请求成功完成时，调用displayAppInfo函数
                    displayAppInfo(this);
                }
            };
            // 初始化一个GET请求来获取appdata.xml文件
            xhttpApp.open("GET", "./common/appdata.xml", true);
            // 发送请求
            xhttpApp.send();

            // 定义一个函数来处理XML文件并显示应用信息
            function displayAppInfo(xml) {
                let i;
                let xmlDoc = xml.responseXML;
                let apps = xmlDoc.getElementsByTagName("app");
                for (i = 0; i < apps.length; i++) {
                    let id = apps[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
                    let url = apps[i].getElementsByTagName("url")[0].childNodes[0].nodeValue;
                    let name = apps[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
                    let tag = apps[i].getElementsByTagName("tag")[0].childNodes[0].nodeValue;
                    let newpage = apps[i].getElementsByTagName("newpage")[0].childNodes[0].nodeValue;
                    let target = newpage === "1" ? 'target="_blank"' : '';
                    let appInfo = `
                <a href="${url}" ${target} class="app-title" id="${id}">${name}</a>
                <p class="app-tag">${tag}</p>`;
                    document.getElementById(id).insertAdjacentHTML('beforeend', appInfo);
                }
            }
            return false

        }
    } else {
        console.error('No <a> elements found in #home');
    }
} else {
    console.error('Element with id "home" not found');
}

