<script>
    if (screen.width > 1000) {
        document.write(decodeURI('%3Cscript src="../js/click-boom.min.js"%3E%3C/script%3E'));
    }
</script>

# 资讯
## 项目介绍
这是一个网页应用，主要用于展示一些资讯，包括图片、视频、音乐等。
## 开发计划
- [x] 基础布局设计&基础 CSS 样式
    - [x] 顶部导航栏
    - [x] 页脚
    - [x] 侧边栏
    - [x] 主体内容
    - [x] Banner 轮播图
- [x] 基础 JS 脚本
    - [x] Banner 轮播图脚本
    - [x] 页面内跳转脚本
    - [x] canvas 画布脚本
    - [x] 点击特效脚本
    - [x] 控制台输出脚本
    - [ ] Banner 点击跳转
- [x] 为每个应用添加一个单独的页面
    - [x] 相册
    - [x] 视频
    - [x] 歌单
- [x] 移动端适配
- [x] 美化页面
    - [x] index
    - [x] FlexAlbum
    - [x] Playlist
    - [x] Video
## 项目结构
```bash
.
├─application
│  ├─bootstrap-dev
│  │  └─assets
│  │      ├─css
│  │      ├─fonts
│  │      ├─images
│  │      │  ├─about
│  │      │  └─portfolio
│  │      └─js
│  ├─FlexAlbum
│  │  └─src
│  ├─Matrix
│  │  └─src
│  ├─Playlist
│  │  └─src
│  └─Video
│      └─src
├─css
├─images
│  └─mouse-arrow
│      └─deepin2-dark
├─js
└─source
    └─src
```
## 依赖
|    依赖     | 版本              |
|:---------:|:----------------|
|  jQuery   | 3.3.1           |
|  APlayer  | v1.10.1 af84efb |
| MetingJS  | v1.2.0          |
| Bootstrap | 3.3.7           |

---
> “Shall I compare thee to a summer’s day? Thou art more lovely and more temperate.”
-- William Shakespeare, Sonnet 18