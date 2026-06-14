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

    // Minimal icons characters for each theme
    var icons = {
        auto: '\u25D0',    // half-filled circle
        light: '\u2600',   // sun
        dark: '\u263E'     // moon
    };

    function modeLabel(mode) {
        if (mode === 'light') return 'Light';
        if (mode === 'dark') return 'Dark';
        return 'Auto';
    }

    function updateToggle(mode) {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;

        var icon = icons[mode] || icons.auto;
        var label = modeLabel(mode);

        btn.innerHTML = '<span style="font-size:14px;line-height:1">' + icon + '</span> ' + label;
        btn.setAttribute('title', label + (mode === 'auto' ? ' (' + modeLabel(systemThemeName()) + ')' : ''));
        btn.setAttribute('aria-label', 'Theme: ' + label);
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
                mql.addListener(handler);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
