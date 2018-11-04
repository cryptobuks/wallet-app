(function (window) {
    'use strict';
    window.layer = {
        f_doc(tag) {
            return document.querySelector(tag);
        },
        open(options = {}) {
            let _body = this.f_doc('body');
            let _main = document.createElement('div');
            _main.classList.add('layer-main');
            setTimeout(() => {
                _main.style.left = '50%';
                _main.style.marginLeft = '-' + _main.offsetWidth / 2 + 'px';
                _main.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            }, 10)
            _body.appendChild(_main);
            if (options !== null) {
                _main.innerHTML = options.content || '';
                if (options.hasOwnProperty('time')) {
                    let time = options.time;
                    setTimeout(() => {
                        _body.removeChild(this.f_doc('.layer-main'));
                    }, time * 1000)
                }
            }
        },
        close() {
            let _body = this.f_doc('body');
            let _layer = this.f_doc('.layer-main');
            _body.removeChild(_layer);
        },
        loading() {
            let _body = this.f_doc('body');
            let loading_node = document.createElement('div');
            loading_node.classList.add('loading-pic');
            let img_node = document.createElement('img');
            img_node.src = '../images/loading.gif';
            loading_node.appendChild(img_node);
            _body.appendChild(loading_node);
        },
        closeLoading() {
            let _body = this.f_doc('body');
            if(this.f_doc('.loading-pic')) {
                _body.removeChild(this.f_doc('.loading-pic'));
            }
        }
    }
})(window)