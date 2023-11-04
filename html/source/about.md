<script>
    if (screen.width > 1000) {
        document.write(decodeURI('%3Cscript src="../js/click-boom.min.js"%3E%3C/script%3E'));
    }
</script>

# 关于:heart:

<input type="image" src="../images/logo.png" onclick="alert('Hello , Welcome to my site .😊')" alt="avatar" text-align=“center” vertical-align=“middle”>
<p><a href="../application/bootstrap-dev/index.html">yuzhii</a></p>

## 这是什么？:smile:

`应用中心` 是我学习前端基础知识时后想出的点子。:)
右侧 `banner` 使用的图片素材来音乐专辑封面。
`应用中心` 中的部分网页程序来自外部。
遵循 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">BY-NC-SA协议</a>

## 给我留言/建议/反馈:yum:

使用Email给我留言/建议/反馈  <button type="button" id="mail">📧</button>

<script>
    let mail = document.getElementById("mail");
    mail.onclick = function() {
        window.location.href = "mailto:lizongchen0718@gmail.com"
    }
</script>

---

## 将 `应用中心` 下载至本地

<style>
# box1 {
    width: 80%;
    height: 100px;
    background-color: white;
    border: 5px solid #00bcd4;
    border-radius: 50px;
    padding: 8px 12px;
    text-align: center;
    line-height: 30px;
    margin: 0 auto;
    text-decoration: none;
}
# box2 {
    width: 20%;
    height: 20%;
    background-color: #f5f5f5;
    border: 2px solid #000000;
    border-radius: 50px;
    padding: 8px 12px;
    text-align: center;
    line-height: 50px;
    margin: 0 auto;
    position: relative;
    text-decoration: none;
}
# box2 a {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 35px;
    text-decoration: none;
}
# box2 a:hover {
    background-color: #ff4081;
    color: white;
    border: 0 solid #000000;
    border-radius: 50px;
    text-align: center;
    text-decoration: none;
}
/*给按钮美化 */
button {
    background-color: #f5f5f5;
    border: 2px solid #000000;
    border-radius: 50px;
    text-align: center;
    position: relative;
    text-decoration: none;
}
button:hover {
    background-color: #ff4081;
    color: white;
    border: 2px solid #000000;
    border-radius: 50px;
    text-align: center;
    text-decoration: none;
}
/* 给选择框美化*/
select {
    background-color: #f5f5f5;
    border: 2px solid #000000;
    border-radius: 50px;
    text-align: center;
    position: relative;
    text-decoration: none;
}
select:hover {
    background-color: #ff4081;
    color: white;
    border: 2px solid #000000;
    border-radius: 50px;
    text-align: center;
    text-decoration: none;
}
</style>

<!-- 编写表单，提供两种方式下载 `应用中心` 的源码。 -->
<form method="get">
    <span style="text-align: center;">选择下载方式：</span>
        <label for="download1"></label><select name="download" id="download1">
            <option value="html">html</option>
            <option value="git">git</option>
        </select>&nbsp;&nbsp;
    <button type='button' id='dlbtn'>下载</button>
</form>

<div id="show"></div>

<!-- <div id=downloadhtml>
<hr><div id='box1'><span style='text-align: center; color:black;'>html.zip</span><br><span style='text-align: center; color:black;'>4.70 MB (4,938,404 字节)</span><br><div id='box2'><a href='./src/html.zip' data-pjax-state='load' download='html.zip'>点击下载</a></div></div>
</div> -->

<div id=downloadhtml>
<hr><div id='box1'><span style='text-align: center; color:black;'>html.zip</span><br><span style='text-align: center; color:black;'>4.70 MB (4,938,404 字节)</span><br><div id='box2'><a href='' data-pjax-state='load' download='html.zip'>点击下载</a></div></div>
</div>

<div id=downloadgit>
<hr><p>不仅是 <code>应用中心</code> 的源码，Blog 的页面也已经上传至 <code>github</code>，你可以通过 git 命令获取。</p><p><code id='git'>git clone git@github.com:Yuzhii0718/Yuzhii0718.github.io.git</code>&nbsp;&nbsp;<button type="button" id='copybtn' value="📋">📋</button></p>
</div>

<script>
    // 默认隐藏下载内容
    const downloadhtml = document.getElementById("downloadhtml");
    const downloadgit = document.getElementById("downloadgit");
    downloadhtml.style.display = "none";
    downloadgit.style.display = "none";

    // 当点击下载按钮时，根据选择的下载方式，显示不同的下载内容
    const download = document.getElementById("download1");
    let show = document.getElementById("show");
    let dlbtn = document.getElementById("dlbtn");
    dlbtn.onclick = function() {
        if (download.value === "html") {
            downloadhtml.style.display = "block";
            downloadgit.style.display = "none";
        } else if (download.value === "git") {
            downloadhtml.style.display = "none";
            downloadgit.style.display = "block";
        }
    }

    // 复制按钮, 用于复制git命令
    let copybtn = document.getElementById("copybtn");
    let git = document.getElementById("git");
    copybtn.onclick = function() {
        // 获取 code 元素的内容
        let text = git.innerText;
        // 复制到剪贴板
        let input = document.createElement("input");
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        // 提示复制成功
        alert("复制成功");
    }
</script>

---
> "In Return, It gives to everyone of us the highest satisfaction: the consciousness that the building of a better future, that one carries on his shoulders a particle of the fate of mankind, and then one's life will not have been lived in vain."
> Лев Давидович Троцкий, 1938.10, Mexico, The Fourth International
