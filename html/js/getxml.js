// 创建两个新的XMLHttpRequest对象
let xhttpApp = new XMLHttpRequest();

// 定义当appdata.xml请求的状态改变时执行的函数
xhttpApp.onreadystatechange = function () {
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
        let target = newpage === "1" ? 'target="_blank" rel="noopener noreferrer"' : '';
        let appInfo = `
            <a href="${url}" ${target} class="app-title">${name}</a>
            <p class="app-tag">${tag}</p>`;
        document.getElementById(id).insertAdjacentHTML('beforeend', appInfo);
    }
}

let xhttpHeader = new XMLHttpRequest();

// 定义当headerdata.xml请求的状态改变时执行的函数
xhttpHeader.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        // 当请求成功完成时，调用displayHeaderInfo函数
        displayHeaderInfo(this);
    }
};

// 初始化一个GET请求来获取headerdata.xml文件
xhttpHeader.open("GET", "./common/headerdata.xml", true);

xhttpHeader.send();

// 定义一个函数来处理XML文件并显示头部信息
function displayHeaderInfo(xml) {
    let xmlDoc = xml.responseXML;
    let fns = xmlDoc.getElementsByTagName("fn");
    for (let i = 0; i < fns.length; i++) {
        let id = fns[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
        let url = fns[i].getElementsByTagName("url")[0].childNodes[0].nodeValue;

        let name = fns[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
        let js = fns[i].getElementsByTagName("js")[0].childNodes[0].nodeValue;
        let jsoperate = js !== "0" ? `${js}` : '';
        let newpage = fns[i].getElementsByTagName("newpage")[0].childNodes[0].nodeValue;
        let target = newpage === "1" ? 'target="_blank"' : '';
        let openurl = url !== "0" ? `href="${url}"` : '';
        let linkHTML = `
    <a ${openurl} ${target} ${jsoperate}>${name}</a>`;
        let element = document.getElementById(id);
        if (element) {
            element.innerHTML = linkHTML;
        } else {
            console.error(`Element with id ${id} not found`);
        }
    }
}