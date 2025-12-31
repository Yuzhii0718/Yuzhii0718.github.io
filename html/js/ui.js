(function () {
    'use strict';

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var toggle = document.getElementById('nav-toggle');
        var nav = document.getElementById('site-nav');
        if (!toggle || !nav) return;

        function isOpen() {
            return nav.classList.contains('is-open');
        }

        function setOpen(open) {
            nav.classList.toggle('is-open', open);
            document.documentElement.classList.toggle('nav-open', open);
            toggle.setAttribute('aria-expanded', String(open));
        }

        toggle.addEventListener('click', function () {
            setOpen(!isOpen());
        });

        // 点击导航项后自动收起（移动端）
        nav.addEventListener('click', function (e) {
            var target = e.target;
            if (!target) return;
            // getxml.js 会往 li 里插入 <a>
            if (target.tagName && target.tagName.toLowerCase() === 'a') {
                setOpen(false);
            }
        });

        // 点击空白处收起
        document.addEventListener('click', function (e) {
            if (!isOpen()) return;
            var target = e.target;
            if (!target) return;
            if (target === toggle || toggle.contains(target)) return;
            if (target === nav || nav.contains(target)) return;
            setOpen(false);
        });

        // Esc 收起
        document.addEventListener('keydown', function (e) {
            if (!isOpen()) return;
            if (e.key === 'Escape') setOpen(false);
        });

        // 宽度变化时，如果切回桌面，强制关闭抽屉状态
        window.addEventListener('resize', function () {
            if (window.matchMedia('(min-width: 1080px)').matches) {
                setOpen(false);
            }
        });
    });
})();
