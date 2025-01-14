Array.prototype.random = function() { return this[Math.floor(Math.random() * this.length)]; }

function ajax(url, data, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.open(data ? 'POST' : 'GET', url, true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            try {
                data = JSON.parse(xhr.responseText);
            } catch($e) {
                data = xhr.responseText;
            }
            if (typeof success == 'function') success(data);
        } else {
            if (typeof error == 'function') error(xhr.status);
        }
    };
    xhr.onerror = function(err) {
        if (typeof error == 'function') error(err);
    };
    if (data) {
        if (typeof data == 'string') xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        if (typeof data == 'object') data = JSON.stringify(data);
        xhr.send(data);
    } else {
        xhr.send();
    }
}

function rules(callback) {
    if (!window.fonapi) window.fonapi = {};
    if (callback) window.fonapi.callback = callback;

    if (!window.fonapi.urls) {
        ajax(
            '/urls.json',
            null,
            function(data) {
                window.fonapi.urls = data.common;
                rules();
            });
        window.fonapi.urls = 'loading';
    }

    if (window.fonapi.urls == 'loading') return;

    if (!window.fonapi.rules) {
        window.fonapi.rules = {};
        var lang = (navigator.language || navigator.userLanguage).match(/(\d+)/);
        lang = lang ? lang[1] : 'ru';
        document.querySelectorAll('[data-alias]').forEach(function(el) {
            if (!el.innerHTML) window.fonapi.rules[el.getAttribute('data-alias') + '/' + (el.getAttribute('data-lang') || el.getAttribute('data-locale') || lang)] = '';
        });
        if (window.fonapi.callback) {
            document.querySelectorAll('[name="gtm_name"]').forEach(function(el) {
                window.fonapi.rules['data_' + el.content + '/' + lang] = '';
            });
        }
    }

    for (var rule in window.fonapi.rules) {
        if (!window.fonapi.rules[rule]) {
            ajax(
                window.fonapi.urls.random() + '/content/getActualContentByAlias',
                {
                    alias: rule.split('/')[0],
                    className: 'Content.UserPage',
                    lang: rule.split('/')[1],
                    lastVersion: '0',
                    sysId: 21
                },
                function(data) {
                    if (data.content && data.content.object && data.content.object.body) {
                        if (rule.indexOf('data_') === 0) {
                            window.fonapi.rules[rule] = data.content.object.body.split("\n").map(function(str) {
                                return str.split('=');
                            }).reduce(function(data, arr) {
                                if (arr.length > 1) {
                                    data.key = arr.shift();
                                    data[data.key] = '';
                                }
                                if (data.key) data[data.key] += arr.join('=') + "\n";
                                return data;
                            }, {});
                            for (var key in window.fonapi.rules[rule]) {
                                window.fonapi.rules[rule][key] = window.fonapi.rules[rule][key].trim();
                                if (window.fonapi.rules[rule][key].indexOf('#') > -1) window.fonapi.rules[rule][key] = marked(window.fonapi.rules[rule][key]);
                            }
                        } else {
                            window.fonapi.rules[rule] = marked(data.content.object.body);
                        }
                    } else {
                        if (rule.indexOf('data_') === 0) {
                            window.fonapi.rules[rule] = {};
                        } else {
                            window.fonapi.rules[rule] = ' ';
                        }
                    }
                    rules();
                });
            window.fonapi.rules[rule] = 'loading';
        }

        if (window.fonapi.rules[rule] == 'loading') return;

        if (rule.indexOf('data_') === 0) {
            for (var key in window.fonapi.rules[rule]) {
                document.querySelectorAll('[data-alias="' + rule.split('/')[0] + '"][data-lang="' + rule.split('/')[1] + '"][data-key="' + key + '"], [data-alias="' + rule.split('/')[0] + '"][data-locale="' + rule.split('/')[1] + '"][data-key="' + key + '"]').forEach(function(el) {
                    if (!el.innerHTML) el.innerHTML = window.fonapi.rules[rule][key];
                });
            }
            if (typeof window.fonapi.callback == 'function') window.fonapi.callback(window.fonapi.rules[rule]);
        } else {
            document.querySelectorAll('[data-alias="' + rule.split('/')[0] + '"][data-lang="' + rule.split('/')[1] + '"], [data-alias="' + rule.split('/')[0] + '"][data-locale="' + rule.split('/')[1] + '"]').forEach(function(el) {
                if (!el.innerHTML) el.innerHTML = window.fonapi.rules[rule];
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', (e)=>{
    rules();
});
