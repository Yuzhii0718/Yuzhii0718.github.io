(function () {
    'use strict';

    var STORAGE_KEY = 'theme';
    var MODES = ['auto', 'light', 'dark'];

    var root = document.documentElement;
    var mql = null;

    try {
        if (window.matchMedia) {
            mql = window.matchMedia('(prefers-color-scheme: light)');
        }
    } catch (e) {
        mql = null;
    }

    function systemThemeName() {
        if (!mql) return 'dark';
        return mql.matches ? 'light' : 'dark';
    }

    function getSavedMode() {
        try {
            var v = localStorage.getItem(STORAGE_KEY);
            if (v === 'light' || v === 'dark') return v;
        } catch (e) {
            // ignore
        }
        return 'auto';
    }

    function saveMode(mode) {
        try {
            if (mode === 'auto') {
                localStorage.removeItem(STORAGE_KEY);
            } else {
                localStorage.setItem(STORAGE_KEY, mode);
            }
        } catch (e) {
            // ignore
        }
    }

    function applyMode(mode) {
        if (mode === 'light' || mode === 'dark') {
            root.setAttribute('data-theme', mode);
        } else {
            root.removeAttribute('data-theme');
        }

        updateToggle(mode);
    }

    function modeLabel(mode) {
        if (mode === 'light') return '浅色';
        if (mode === 'dark') return '深色';
        return '自动';
    }

    function updateToggle(mode) {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;

        var label = modeLabel(mode);
        var extra = '';

        if (mode === 'auto') {
            extra = '（跟随系统：' + modeLabel(systemThemeName()) + '）';
        }

        btn.textContent = '主题：' + label;
        btn.setAttribute('title', '主题：' + label + extra);
        btn.setAttribute('aria-label', '主题：' + label + extra);
    }

    function nextMode(current) {
        var idx = MODES.indexOf(current);
        if (idx === -1) return 'auto';
        return MODES[(idx + 1) % MODES.length];
    }

    function init() {
        var mode = getSavedMode();
        applyMode(mode);

        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', function () {
                mode = nextMode(mode);
                saveMode(mode);
                applyMode(mode);
            });
        }

        if (mql) {
            var handler = function () {
                if (getSavedMode() === 'auto') {
                    updateToggle('auto');
                }
            };

            if (mql.addEventListener) {
                mql.addEventListener('change', handler);
            } else if (mql.addListener) {
                // Safari/old Chromium
                mql.addListener(handler);
            }
        }
    }

    // Run ASAP (defer/DOMContentLoaded-safe)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
