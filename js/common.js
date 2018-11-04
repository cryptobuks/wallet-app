$(function () {
  //去除click延迟
  $.getScript('https://cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js', function () {
    window.addEventListener("load", function () {
      FastClick.attach(document.body);
    }, false)
  });
  const common = {
    init() {
      let _self = this;
      _self.forbidAdvert();
      _self.forbidCopy();
      _self.getTabNav().then((data) => {
        if (data.length > 0) {
          _self.renderTabNav(data);
        }
      })
    },
    forbidAdvert() { // 禁用动态加载恶意脚本
      let createElement = document.createElement;
      document.createElement = function (tag) {
        switch (tag) {
          case 'script':
            console.info('禁用动态添加脚本，防止广告加载');
            break;
          default:
            return createElement.apply(this, arguments);
        }
      }
    },
    forbidCopy() {
      //禁止复制页面内容
      $(document).on("contextmenu copy selectstart", function () {
        return false;
      });
      $(document).keydown(function (e) {
        if (e.ctrlKey && (e.keyCode == 65 || e.keyCode == 67)) {
          return false;
        }
      });
    },
    tabNav() { // change tab status
      let ul_node = document.querySelector('.tab-con');
      let href = window.location.pathname;
      let n_href = '';
      if (href.length > 1) {
        let s_index = href.indexOf('/') + 1;
        let e_index = href.indexOf('.');
        n_href = href.substring(s_index, e_index);
      } else {
        n_href = href;
      }
      // console.log(n_href);
      switch (n_href) {
        case '\/':
          ul_node.childNodes[0].firstChild.firstChild.firstChild.classList.add('checked-wallet');
          ul_node.childNodes[0].firstChild.firstChild.lastChild.style.color = '#00d7e0';
          break;
        case 'index':
          ul_node.childNodes[0].firstChild.firstChild.firstChild.classList.add('checked-wallet');
          ul_node.childNodes[0].firstChild.firstChild.lastChild.style.color = '#00d7e0';
          break;
        case 'html/transfer_record':
          ul_node.childNodes[1].firstChild.firstChild.firstChild.classList.add('checked-account');
          ul_node.childNodes[1].firstChild.firstChild.lastChild.style.color = '#00d7e0';
          break;
        case 'market':
          ul_node.childNodes[2].firstChild.firstChild.firstChild.classList.add('checked-market');
          ul_node.childNodes[2].firstChild.firstChild.lastChild.style.color = '#00d7e0';
          break;
      }
    },
    getTabNav() {
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'get',
          url: '../mock/tab_nav.json?v1',
          dataType: 'json',
          success: (data) => {
            if (data.length > 0) {
              resolve(data);
            } else {
              reject();
            }
          },
          error: (err) => {
            console.log(err);
          }
        })
      })
    },
    renderTabNav(data) { // render footer tab
      let _self = this;
      let html = '<ul class="tab-con clearfix">';
      let class_n = "";
      data.forEach(item => {
        if (item.hasOwnProperty('class_name')) {
          class_n = item['class_name'];
        }
        html += '<li class="' + class_n + '"><a href="' + item.href + '"><div>';
        html += '<p class="tab-icon"></p>';
        html += '<p class="tab-name"><span>' + item.name + '</span></p>';
        html += '</div></a></li>';
      });
      html += '</ul>';
      $('.footer').html(html);
      _self.tabNav();
      //to market
      $('.market').click(function () {
        let id = hCookie.getCookie('uid');
        let token = hCookie.getCookie('tk');
        let url = 'http://camelcoin.cn/html/index_wallet.php?tk=' + id + ':' + token;
        window.open(url);
      })
    }
  };
  common.init();

})
