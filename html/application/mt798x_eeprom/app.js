(function () {
	var MAX_SIZE = 2 * 1024 * 1024;
	var WINDOW_SIZE = 0x1000;
	var LANG_STORAGE_KEY = 'mt798x_eeprom_lang_mode';

	var CHIP_RANGES = {
		mt7976: {
			g5: [
				[0x441, 0x458]
			],
			g24: [
				[0x465, 0x484]
			]
		},
		mt7975: {
			g5: [
				[0x34B, 0x352],
				[0x357, 0x35E],
				[0x363, 0x36A],
				[0x36F, 0x376]
			],
			g24: [
				[0x2FC, 0x2FC],
				[0x2FF, 0x2FF],
				[0x302, 0x302],
				[0x305, 0x305]
			]
		}
	};

	var fileInput = document.getElementById('file-input');
	var dropzone = document.getElementById('dropzone');
	var value5gInput = document.getElementById('value-5g-input');
	var value24gInput = document.getElementById('value-24g-input');
	var applyBtn = document.getElementById('apply-btn');
	var downloadBtn = document.getElementById('download-btn');
	var metaKeywords = document.getElementById('meta-keywords');
	var metaDescription = document.getElementById('meta-description');
	var mainApp = document.getElementById('main-app');
	var mainTitle = document.getElementById('main-title');
	var mainDesc = document.getElementById('main-desc');
	var langSwitchLabel = document.getElementById('lang-switch-label');
	var langButtons = document.querySelectorAll('.lang-btn');
	var chipTitleMt7976 = document.getElementById('chip-title-mt7976');
	var chipInfoMt7976 = document.getElementById('chip-info-mt7976');
	var chipTitleMt7975 = document.getElementById('chip-title-mt7975');
	var chipInfoMt7975 = document.getElementById('chip-info-mt7975');
	var value5gLabel = document.getElementById('value-5g-label');
	var value24gLabel = document.getElementById('value-24g-label');
	var fileLabel = document.getElementById('file-label');
	var dropzoneTitle = document.getElementById('dropzone-title');
	var dropzoneSub = document.getElementById('dropzone-sub');
	var compareHeading = document.getElementById('compare-heading');
	var compareDesc = document.getElementById('compare-desc');
	var beforeTitle = document.getElementById('before-title');
	var afterTitle = document.getElementById('after-title');
	var hint = document.getElementById('hint');
	var beforeView = document.getElementById('before-view');
	var afterView = document.getElementById('after-view');
	var meta = document.getElementById('meta');
	var chipCards = document.querySelectorAll('.chip-card');
	var chipInputs = document.querySelectorAll('input[name="chip"]');

	function normalizeLang(input) {
		var lang = (input || '').toLowerCase();
		if (lang.indexOf('zh') === 0) return 'zh-CN';
		return 'en';
	}

	function loadLangMode() {
		try {
			var saved = localStorage.getItem(LANG_STORAGE_KEY);
			if (saved === 'auto' || saved === 'zh-CN' || saved === 'en') return saved;
		} catch (e) {
			// ignore storage read errors
		}
		return 'auto';
	}

	function resolveLang(mode) {
		if (mode === 'zh-CN' || mode === 'en') return mode;
		var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
		return normalizeLang(nav);
	}

	var state = {
		file: null,
		originalBytes: null,
		modifiedBytes: null,
		filename: '',
		md5: '',
		changedOffsets: [],
		patchValue5g: 0x2B,
		patchValue24g: 0x2B,
		chip: 'mt7976',
		compareStatus: 'waiting',
		langMode: loadLangMode(),
		lang: 'zh-CN',
		hintKey: 'hint_waiting_upload',
		hintParams: null,
		hintType: ''
	};

	state.lang = resolveLang(state.langMode);

	function t(key, params) {
		var dict = I18N[state.lang] || I18N.en;
		var fallback = I18N.en;
		var text = dict[key] || fallback[key] || key;
		if (!params) return text;
		return text.replace(/\{([^}]+)\}/g, function (_, p1) {
			if (Object.prototype.hasOwnProperty.call(params, p1)) {
				return String(params[p1]);
			}
			return _;
		});
	}

	function updateLangButtons() {
		for (var i = 0; i < langButtons.length; i++) {
			var btn = langButtons[i];
			btn.classList.toggle('active', btn.getAttribute('data-lang-mode') === state.langMode);
		}
	}

	function applyI18nToDom() {
		document.documentElement.lang = state.lang;
		document.title = t('page_title');
		metaKeywords.setAttribute('content', t('meta_keywords'));
		metaDescription.setAttribute('content', t('meta_description'));

		mainApp.setAttribute('aria-label', t('app_aria_label'));
		mainTitle.textContent = t('heading_main');
		mainDesc.textContent = t('intro_main');
		langSwitchLabel.textContent = t('lang_label');

		for (var i = 0; i < langButtons.length; i++) {
			var mode = langButtons[i].getAttribute('data-lang-mode');
			if (mode === 'auto') langButtons[i].textContent = t('lang_auto');
			if (mode === 'zh-CN') langButtons[i].textContent = t('lang_zh');
			if (mode === 'en') langButtons[i].textContent = t('lang_en');
		}

		chipTitleMt7976.textContent = t('chip_title_mt7976');
		chipInfoMt7976.textContent = t('chip_info_mt7976');
		chipTitleMt7975.textContent = t('chip_title_mt7975');
		chipInfoMt7975.textContent = t('chip_info_mt7975');

		value5gLabel.textContent = t('label_value_5g');
		value24gLabel.textContent = t('label_value_24g');
		value5gInput.setAttribute('placeholder', t('placeholder_value'));
		value24gInput.setAttribute('placeholder', t('placeholder_value'));
		fileLabel.textContent = t('label_file');
		dropzoneTitle.textContent = t('dropzone_title');
		dropzoneSub.textContent = t('dropzone_sub');
		applyBtn.textContent = t('btn_apply');
		downloadBtn.textContent = t('btn_download');

		compareHeading.textContent = t('compare_heading');
		compareDesc.textContent = t('compare_desc');
		beforeTitle.textContent = t('compare_before_title');
		afterTitle.textContent = t('compare_after_title');

		if (state.hintKey) {
			hint.textContent = t(state.hintKey, state.hintParams || {});
		}

		if (state.compareStatus === 'after-load') {
			beforeView.textContent = t('compare_waiting_after_apply');
			afterView.textContent = t('compare_waiting_after_apply');
		} else if (state.compareStatus === 'waiting') {
			beforeView.textContent = t('compare_waiting');
			afterView.textContent = t('compare_waiting');
		}

		if (state.originalBytes && state.modifiedBytes && state.changedOffsets.length) {
			refreshDiffViews();
		}
	}

	function setLanguageMode(mode) {
		state.langMode = mode;
		state.lang = resolveLang(mode);
		try {
			localStorage.setItem(LANG_STORAGE_KEY, mode);
		} catch (e) {
			// ignore storage write errors
		}
		updateLangButtons();
		applyI18nToDom();
	}

	function setHint(text, type) {
		hint.textContent = text;
		hint.className = 'hint';
		if (type) hint.classList.add(type);
		state.hintType = type || '';
		if (!type) state.hintType = '';
	}

	function setHintByKey(key, type, params) {
		state.hintKey = key;
		state.hintParams = params || null;
		setHint(t(key, params), type);
	}

	function toHex(num, width) {
		var s = Number(num).toString(16).toUpperCase();
		while (s.length < width) s = '0' + s;
		return s;
	}

	function escapeHtml(str) {
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function parseHexValueFromInput(inputEl) {
		var v = (inputEl.value || '').trim().toUpperCase().replace(/^0X/, '');
		if (!/^[0-9A-F]{1,2}$/.test(v)) return null;
		var n = parseInt(v, 16);
		if (n < 0x20 || n > 0x2D) return null;
		return n;
	}

	function parsePatchValues() {
		var v5g = parseHexValueFromInput(value5gInput);
		if (v5g === null) {
			return { errorKey: 'err_invalid_param_5g' };
		}
		var v24g = parseHexValueFromInput(value24gInput);
		if (v24g === null) {
			return { errorKey: 'err_invalid_param_24g' };
		}
		return {
			value5g: v5g,
			value24g: v24g
		};
	}

	function validateFile(file) {
		if (!file) return 'err_no_file_selected';
		var lower = file.name.toLowerCase();
		if (!(lower.endsWith('.bin') || lower.endsWith('.img'))) {
			return 'err_invalid_ext';
		}
		if (file.size > MAX_SIZE) {
			return 'err_file_too_large';
		}
		return '';
	}

	function updateApplyState() {
		var parsed = parsePatchValues();
		var validValue = !parsed.errorKey;
		var validFile = !!state.file;
		applyBtn.disabled = !(validValue && validFile);
	}

	function updateChipCards() {
		for (var i = 0; i < chipCards.length; i++) {
			chipCards[i].classList.toggle('active', chipCards[i].getAttribute('data-chip') === state.chip);
		}
	}

	function getActiveRanges() {
		return CHIP_RANGES[state.chip] || { g5: [], g24: [] };
	}

	function collectOffsetEntries(rangesByBand, value5g, value24g) {
		var offsetValueMap = {};

		function applyRanges(ranges, value) {
			for (var i = 0; i < ranges.length; i++) {
				for (var p = ranges[i][0]; p <= ranges[i][1]; p++) {
					offsetValueMap[p] = value;
				}
			}
		}

		applyRanges(rangesByBand.g5 || [], value5g);
		applyRanges(rangesByBand.g24 || [], value24g);

		var changedOffsets = Object.keys(offsetValueMap).map(function (k) { return parseInt(k, 10); });
		changedOffsets.sort(function (a, b) { return a - b; });

		var entries = [];
		for (var j = 0; j < changedOffsets.length; j++) {
			var offset = changedOffsets[j];
			entries.push({ offset: offset, value: offsetValueMap[offset] });
		}

		return {
			entries: entries,
			changedOffsets: changedOffsets
		};
	}

	function buildWindow(bytesLength, changedOffsets) {
		if (!changedOffsets.length) return [0, Math.min(WINDOW_SIZE, bytesLength)];
		var min = changedOffsets[0];
		var max = changedOffsets[changedOffsets.length - 1];
		var center = Math.floor((min + max) / 2);
		var start = center - Math.floor(WINDOW_SIZE / 2);
		if (start < 0) start = 0;
		var end = start + WINDOW_SIZE;
		if (end > bytesLength) {
			end = bytesLength;
			start = Math.max(0, end - WINDOW_SIZE);
		}
		return [start, end];
	}

	function renderHexDump(bytes, start, end, changedSet, highlight) {
		var lines = [];
		lines.push('ADDR   | 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F');
		lines.push('-------+------------------------------------------------');
		for (var addr = start; addr < end; addr += 16) {
			var row = toHex(addr, 6) + ' | ';
			for (var i = 0; i < 16; i++) {
				var p = addr + i;
				if (p >= end) {
					row += '   ';
					continue;
				}
				var byteHex = toHex(bytes[p], 2);
				if (highlight && changedSet.has(p)) {
					row += '<span class="changed">' + byteHex + '</span>';
				} else {
					row += byteHex;
				}
				row += ' ';
			}
			lines.push(row.trimEnd());
		}
		return lines.join('\n');
	}

	function applyPatchToBytes() {
		var parsed = parsePatchValues();
		if (parsed.errorKey) {
			setHintByKey(parsed.errorKey, 'error');
			return false;
		}
		state.patchValue5g = parsed.value5g;
		state.patchValue24g = parsed.value24g;

		var rangesByBand = getActiveRanges();
		var patchPlan = collectOffsetEntries(rangesByBand, parsed.value5g, parsed.value24g);
		if (!state.originalBytes) {
			setHintByKey('warn_upload_first', 'warn');
			return false;
		}

		var bytes = new Uint8Array(state.originalBytes);
		for (var i = 0; i < patchPlan.entries.length; i++) {
			var offset = patchPlan.entries[i].offset;
			if (offset >= bytes.length) {
				setHintByKey('err_file_too_small_offset', 'error');
				return false;
			}
			bytes[offset] = patchPlan.entries[i].value;
		}

		state.modifiedBytes = bytes;
		state.changedOffsets = patchPlan.changedOffsets;
		return true;
	}

	function formatDateYmd(date) {
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		return String(y) + (m < 10 ? '0' + m : m) + (d < 10 ? '0' + d : d);
	}

	// Minimal MD5 implementation (hex output)
	function md5Hex(arrayBuffer) {
		function rotateLeft(lValue, iShiftBits) {
			return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
		}
		function addUnsigned(lX, lY) {
			var lX4 = lX & 0x40000000;
			var lY4 = lY & 0x40000000;
			var lX8 = lX & 0x80000000;
			var lY8 = lY & 0x80000000;
			var lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
			if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
			if (lX4 | lY4) {
				if (lResult & 0x40000000) return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
				return lResult ^ 0x40000000 ^ lX8 ^ lY8;
			}
			return lResult ^ lX8 ^ lY8;
		}
		function F(x, y, z) { return (x & y) | ((~x) & z); }
		function G(x, y, z) { return (x & z) | (y & (~z)); }
		function H(x, y, z) { return x ^ y ^ z; }
		function I(x, y, z) { return y ^ (x | (~z)); }
		function FF(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		}
		function GG(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		}
		function HH(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		}
		function II(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		}

		var input = new Uint8Array(arrayBuffer);
		var inputLen = input.length;
		var numWordsTemp1 = inputLen + 8;
		var numWordsTemp2 = (numWordsTemp1 - (numWordsTemp1 % 64)) / 64;
		var numWords = (numWordsTemp2 + 1) * 16;
		var wordArray = new Array(numWords - 1);

		var byteCount = 0;
		while (byteCount < inputLen) {
			var wordCount = (byteCount - (byteCount % 4)) / 4;
			var bytePosition = (byteCount % 4) * 8;
			wordArray[wordCount] = (wordArray[wordCount] | (input[byteCount] << bytePosition)) >>> 0;
			byteCount++;
		}

		var wordCountEnd = (byteCount - (byteCount % 4)) / 4;
		var bytePositionEnd = (byteCount % 4) * 8;
		wordArray[wordCountEnd] = (wordArray[wordCountEnd] | (0x80 << bytePositionEnd)) >>> 0;
		wordArray[numWords - 2] = (inputLen << 3) >>> 0;
		wordArray[numWords - 1] = (inputLen >>> 29) >>> 0;

		var a = 0x67452301;
		var b = 0xEFCDAB89;
		var c = 0x98BADCFE;
		var d = 0x10325476;

		var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
		var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
		var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
		var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

		for (var k = 0; k < numWords; k += 16) {
			var AA = a, BB = b, CC = c, DD = d;
			a = FF(a, b, c, d, wordArray[k + 0] || 0, S11, 0xD76AA478);
			d = FF(d, a, b, c, wordArray[k + 1] || 0, S12, 0xE8C7B756);
			c = FF(c, d, a, b, wordArray[k + 2] || 0, S13, 0x242070DB);
			b = FF(b, c, d, a, wordArray[k + 3] || 0, S14, 0xC1BDCEEE);
			a = FF(a, b, c, d, wordArray[k + 4] || 0, S11, 0xF57C0FAF);
			d = FF(d, a, b, c, wordArray[k + 5] || 0, S12, 0x4787C62A);
			c = FF(c, d, a, b, wordArray[k + 6] || 0, S13, 0xA8304613);
			b = FF(b, c, d, a, wordArray[k + 7] || 0, S14, 0xFD469501);
			a = FF(a, b, c, d, wordArray[k + 8] || 0, S11, 0x698098D8);
			d = FF(d, a, b, c, wordArray[k + 9] || 0, S12, 0x8B44F7AF);
			c = FF(c, d, a, b, wordArray[k + 10] || 0, S13, 0xFFFF5BB1);
			b = FF(b, c, d, a, wordArray[k + 11] || 0, S14, 0x895CD7BE);
			a = FF(a, b, c, d, wordArray[k + 12] || 0, S11, 0x6B901122);
			d = FF(d, a, b, c, wordArray[k + 13] || 0, S12, 0xFD987193);
			c = FF(c, d, a, b, wordArray[k + 14] || 0, S13, 0xA679438E);
			b = FF(b, c, d, a, wordArray[k + 15] || 0, S14, 0x49B40821);

			a = GG(a, b, c, d, wordArray[k + 1] || 0, S21, 0xF61E2562);
			d = GG(d, a, b, c, wordArray[k + 6] || 0, S22, 0xC040B340);
			c = GG(c, d, a, b, wordArray[k + 11] || 0, S23, 0x265E5A51);
			b = GG(b, c, d, a, wordArray[k + 0] || 0, S24, 0xE9B6C7AA);
			a = GG(a, b, c, d, wordArray[k + 5] || 0, S21, 0xD62F105D);
			d = GG(d, a, b, c, wordArray[k + 10] || 0, S22, 0x02441453);
			c = GG(c, d, a, b, wordArray[k + 15] || 0, S23, 0xD8A1E681);
			b = GG(b, c, d, a, wordArray[k + 4] || 0, S24, 0xE7D3FBC8);
			a = GG(a, b, c, d, wordArray[k + 9] || 0, S21, 0x21E1CDE6);
			d = GG(d, a, b, c, wordArray[k + 14] || 0, S22, 0xC33707D6);
			c = GG(c, d, a, b, wordArray[k + 3] || 0, S23, 0xF4D50D87);
			b = GG(b, c, d, a, wordArray[k + 8] || 0, S24, 0x455A14ED);
			a = GG(a, b, c, d, wordArray[k + 13] || 0, S21, 0xA9E3E905);
			d = GG(d, a, b, c, wordArray[k + 2] || 0, S22, 0xFCEFA3F8);
			c = GG(c, d, a, b, wordArray[k + 7] || 0, S23, 0x676F02D9);
			b = GG(b, c, d, a, wordArray[k + 12] || 0, S24, 0x8D2A4C8A);

			a = HH(a, b, c, d, wordArray[k + 5] || 0, S31, 0xFFFA3942);
			d = HH(d, a, b, c, wordArray[k + 8] || 0, S32, 0x8771F681);
			c = HH(c, d, a, b, wordArray[k + 11] || 0, S33, 0x6D9D6122);
			b = HH(b, c, d, a, wordArray[k + 14] || 0, S34, 0xFDE5380C);
			a = HH(a, b, c, d, wordArray[k + 1] || 0, S31, 0xA4BEEA44);
			d = HH(d, a, b, c, wordArray[k + 4] || 0, S32, 0x4BDECFA9);
			c = HH(c, d, a, b, wordArray[k + 7] || 0, S33, 0xF6BB4B60);
			b = HH(b, c, d, a, wordArray[k + 10] || 0, S34, 0xBEBFBC70);
			a = HH(a, b, c, d, wordArray[k + 13] || 0, S31, 0x289B7EC6);
			d = HH(d, a, b, c, wordArray[k + 0] || 0, S32, 0xEAA127FA);
			c = HH(c, d, a, b, wordArray[k + 3] || 0, S33, 0xD4EF3085);
			b = HH(b, c, d, a, wordArray[k + 6] || 0, S34, 0x04881D05);
			a = HH(a, b, c, d, wordArray[k + 9] || 0, S31, 0xD9D4D039);
			d = HH(d, a, b, c, wordArray[k + 12] || 0, S32, 0xE6DB99E5);
			c = HH(c, d, a, b, wordArray[k + 15] || 0, S33, 0x1FA27CF8);
			b = HH(b, c, d, a, wordArray[k + 2] || 0, S34, 0xC4AC5665);

			a = II(a, b, c, d, wordArray[k + 0] || 0, S41, 0xF4292244);
			d = II(d, a, b, c, wordArray[k + 7] || 0, S42, 0x432AFF97);
			c = II(c, d, a, b, wordArray[k + 14] || 0, S43, 0xAB9423A7);
			b = II(b, c, d, a, wordArray[k + 5] || 0, S44, 0xFC93A039);
			a = II(a, b, c, d, wordArray[k + 12] || 0, S41, 0x655B59C3);
			d = II(d, a, b, c, wordArray[k + 3] || 0, S42, 0x8F0CCC92);
			c = II(c, d, a, b, wordArray[k + 10] || 0, S43, 0xFFEFF47D);
			b = II(b, c, d, a, wordArray[k + 1] || 0, S44, 0x85845DD1);
			a = II(a, b, c, d, wordArray[k + 8] || 0, S41, 0x6FA87E4F);
			d = II(d, a, b, c, wordArray[k + 15] || 0, S42, 0xFE2CE6E0);
			c = II(c, d, a, b, wordArray[k + 6] || 0, S43, 0xA3014314);
			b = II(b, c, d, a, wordArray[k + 13] || 0, S44, 0x4E0811A1);
			a = II(a, b, c, d, wordArray[k + 4] || 0, S41, 0xF7537E82);
			d = II(d, a, b, c, wordArray[k + 11] || 0, S42, 0xBD3AF235);
			c = II(c, d, a, b, wordArray[k + 2] || 0, S43, 0x2AD7D2BB);
			b = II(b, c, d, a, wordArray[k + 9] || 0, S44, 0xEB86D391);

			a = addUnsigned(a, AA);
			b = addUnsigned(b, BB);
			c = addUnsigned(c, CC);
			d = addUnsigned(d, DD);
		}

		function wordToHex(lValue) {
			var out = '';
			for (var i = 0; i <= 3; i++) {
				var v = (lValue >>> (i * 8)) & 255;
				var h = '0' + v.toString(16);
				out += h.slice(-2);
			}
			return out;
		}

		return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
	}

	function refreshMeta(windowStart, windowEnd) {
		var value5gHex = toHex(state.patchValue5g, 2);
		var value24gHex = toHex(state.patchValue24g, 2);
		var md5Short = state.md5 ? state.md5.slice(0, 8) : '--------';
		var items = [
			{ key: 'meta_chip', val: state.chip },
			{ key: 'meta_value_5g', val: '0x' + value5gHex },
			{ key: 'meta_value_24g', val: '0x' + value24gHex },
			{ key: 'meta_changed_count', val: String(state.changedOffsets.length) },
			{ key: 'meta_window', val: '0x' + toHex(windowStart, 6) + ' ~ 0x' + toHex(windowEnd - 1, 6) },
			{ key: 'meta_md5', val: md5Short + '...' }
		];
		meta.innerHTML = items.map(function (item) {
			return '<span class="meta-item">' + escapeHtml(t(item.key)) + ': <strong>' + escapeHtml(item.val) + '</strong></span>';
		}).join('');
	}

	function refreshDiffViews() {
		if (!state.originalBytes || !state.modifiedBytes || !state.changedOffsets.length) {
			state.compareStatus = 'waiting';
			beforeView.textContent = t('compare_waiting');
			afterView.textContent = t('compare_waiting');
			meta.textContent = '';
			return;
		}
		state.compareStatus = 'patched';

		var changedSet = new Set(state.changedOffsets);
		var windowRange = buildWindow(state.originalBytes.length, state.changedOffsets);
		var start = windowRange[0];
		var end = windowRange[1];

		beforeView.innerHTML = renderHexDump(state.originalBytes, start, end, changedSet, true);
		afterView.innerHTML = renderHexDump(state.modifiedBytes, start, end, changedSet, true);
		refreshMeta(start, end);
	}

	function buildOutputName() {
		var value5gHex = toHex(state.patchValue5g, 2).toLowerCase();
		var value24gHex = toHex(state.patchValue24g, 2).toLowerCase();
		var date = formatDateYmd(new Date());
		var md5Short = (state.md5 || '00000000').slice(0, 8);
		return state.chip + '-5g' + value5gHex + '-24g' + value24gHex + '-factory_md5-' + md5Short + '_' + date + '.bin';
	}

	function doPatchAndPreview() {
		if (!state.file || !state.originalBytes) {
			setHintByKey('warn_upload_first', 'warn');
			return;
		}

		if (!applyPatchToBytes()) {
			downloadBtn.disabled = true;
			return;
		}

		state.md5 = md5Hex(state.modifiedBytes.buffer);
		state.filename = buildOutputName();
		refreshDiffViews();
		downloadBtn.disabled = false;
		setHintByKey('ok_patch_ready', 'ok');
	}

	function loadFile(file) {
		var err = validateFile(file);
		if (err) {
			state.file = null;
			state.originalBytes = null;
			state.modifiedBytes = null;
			state.compareStatus = 'waiting';
			downloadBtn.disabled = true;
			updateApplyState();
			setHintByKey(err, 'error');
			return;
		}

		var reader = new FileReader();
		reader.onload = function (e) {
			state.file = file;
			state.originalBytes = new Uint8Array(e.target.result);
			state.modifiedBytes = null;
			state.filename = '';
			state.md5 = '';
			state.changedOffsets = [];
			state.compareStatus = 'after-load';
			downloadBtn.disabled = true;
			updateApplyState();
			setHintByKey('ok_file_loaded', 'ok', { name: file.name, size: file.size });
			beforeView.textContent = t('compare_waiting_after_apply');
			afterView.textContent = t('compare_waiting_after_apply');
			meta.textContent = '';
		};
		reader.onerror = function () {
			setHintByKey('err_file_read', 'error');
		};
		reader.readAsArrayBuffer(file);
	}

	fileInput.addEventListener('change', function (e) {
		if (e.target.files && e.target.files[0]) {
			loadFile(e.target.files[0]);
		}
	});

	['dragenter', 'dragover'].forEach(function (evtName) {
		dropzone.addEventListener(evtName, function (e) {
			e.preventDefault();
			e.stopPropagation();
			dropzone.classList.add('dragover');
		});
	});

	['dragleave', 'drop'].forEach(function (evtName) {
		dropzone.addEventListener(evtName, function (e) {
			e.preventDefault();
			e.stopPropagation();
			dropzone.classList.remove('dragover');
		});
	});

	dropzone.addEventListener('drop', function (e) {
		var dt = e.dataTransfer;
		if (dt && dt.files && dt.files[0]) {
			loadFile(dt.files[0]);
		}
	});

	function normalizeHexInput(inputEl) {
		var v = (inputEl.value || '').toUpperCase().replace(/[^0-9A-F]/g, '');
		inputEl.value = v.slice(0, 2);
		updateApplyState();
	}

	value5gInput.addEventListener('input', function () {
		normalizeHexInput(value5gInput);
	});

	value24gInput.addEventListener('input', function () {
		normalizeHexInput(value24gInput);
	});

	for (var i = 0; i < chipInputs.length; i++) {
		chipInputs[i].addEventListener('change', function (e) {
			state.chip = e.target.value;
			updateChipCards();
			downloadBtn.disabled = true;
			setHintByKey('warn_chip_switched', 'warn');
			updateApplyState();
		});
	}

	for (var j = 0; j < langButtons.length; j++) {
		langButtons[j].addEventListener('click', function (e) {
			var mode = e.currentTarget.getAttribute('data-lang-mode');
			if (!mode || mode === state.langMode) return;
			setLanguageMode(mode);
		});
	}

	applyBtn.addEventListener('click', doPatchAndPreview);

	downloadBtn.addEventListener('click', function () {
		if (!state.modifiedBytes || !state.filename) return;
		var blob = new Blob([state.modifiedBytes], { type: 'application/octet-stream' });
		var url = URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.href = url;
		a.download = state.filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		setHintByKey('ok_download_triggered', 'ok', { filename: state.filename });
	});

	updateLangButtons();
	applyI18nToDom();
	setHintByKey('hint_waiting_upload');
	updateApplyState();
})();
