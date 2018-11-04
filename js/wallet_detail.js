$(function () {
  $.getScript('https://cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js', function () {
     window.addEventListener("load", function () {
       FastClick.attach(document.body);
     }, false)
  });
  const detail = {
    init() {   
      layer.loading();
      this.forbidAdvert();
      this.forbidBack();
      this.back2Index();
      this.getData();
      this.swicher();
      this.exportPrikey();
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
    forbidBack() { // 禁止浏览器回退
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
      });
    },
    getData() {
      let _self = this;
      _self.getCoinRate().then((rate) => {
        let getCoinData = _self.getCoinData;
        return {
          rate,
          getCoinData
        }
      }).then((res) => {
        let rate = res.rate;
        if (rate !== null) {
          res.getCoinData().then((data) => {
            _self.renderData(rate, data);
          })
        }
      })
    },
    getCoinRate() {
      let camel_data = signData();
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'post',
          url: api + '/v1/user/rate',
          data: camel_data,
          dataType: 'json',
          statusCode: {
            401: function () {
              alert('检测到您的账号登录时间已过期,请您重新登录!');
              hCookie.removeCookie('tk');
              hCookie.removeCookie('uid');
              location.href = '../html/login.html';
            }
          },
          success: (data) => {
            if (data !== null) {
              resolve(data);
            } else {
              reject();
            }
          }
        })
      })
    },
    getCoinData() {
      let addr = localStorage.getItem('addr').split('.');
      let _addr = addr.map((item) => {
          return Number(item);
      });
      let camel_data = signData({
        address: utils.decodeUtf8(_addr)
      });
      let _self = this;
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'post',
          url: api + '/v1/user/wallet/address',
          data: camel_data,
          success: function (data) {
            if (data && data.address) {
              resolve(data);
            } else {
              reject();
            }
          }
        })
      })
    },
    renderData(rate, data) {
      let _self = this;
      if (rate && data) {
        let rate_cryp = rate['coin_cryp_rate'];
        let k_coin = data.type.toUpperCase();
        let _rate = parseFloat(rate_cryp[k_coin].CNY);
        let address = data.address;
        let c_num = utils.subFloat(parseFloat(data.balance), 6).num;
        let balance = utils.subFloat(parseFloat(c_num * _rate), 4).num;
        balance = utils.formatNum(balance,'cryp');
        $('.c_num').html(c_num);
        $('.k-coin').html(k_coin);
        $('.c_pri').html(balance);
        //qrcode
        let qrcode = new QRCode(document.querySelector('.qrcode'));
        qrcode.makeCode(address);
        $('.qrcode').prop('title', '');
        $('.addr-title').html('您的'+k_coin+'钱包地址');
        $('.addr-tip').html('禁止向'+k_coin+'地址充值除'+k_coin+'以外的资产,任何充入'+k_coin+'地址的非'+k_coin+'资产将不可找回。');
        $('.address').val(address);
        layer.closeLoading();
        _self.copyAddr();
      }
    },
    back2Index() {
      $('.back-index').click(function () {
        $(this).addClass('back-highlight');
        location.href = '../index.php';
      })
    },
    copyAddr() {
      let reg = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
      const UA = navigator.userAgent;
      if(reg.test(UA)) {
        console.log('移动端');
      }
      // $('.copy').click(function () {
        let clipboard = new ClipboardJS('.copy');
        clipboard.on('success', function (e) {
          alert('复制成功!');
          e.clearSelection();
        });
        clipboard.on('error', function (e) {
          alert('复制失败，请重新复制!');
        });
      // })
    },
    swicher() {
       $('.wallet-switch').click(function(){
          alert('后续功能正在开发，敬请期待!');
       })
    },
    exportPrikey() {
      $('.export-privkey').click(function(){
        alert('后续功能正在开发，敬请期待!');
      })
    }
  };
  detail.init();
})