$(function () {
  $.getScript('https://cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js', function () {
    window.addEventListener("load", function () {
      FastClick.attach(document.body);
    }, false)
  });
  const transfer = {
    init() {
      this.back2Index();
      layer.loading();
      this.renderData();
      this.forbidBack();
    },
    forbidBack() { // 禁止浏览器回退
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
      });
    },
    back2Index() {
      $('.back-index').click(function () {
        location.href = '../index.php';
      })
    },
    getAddress() {
      let addr = localStorage.getItem('addr').split('.');
      let _addr = addr.map((item) => {
        return Number(item);
      });
      let camel_data = signData({
        address: utils.decodeUtf8(_addr)
      });
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'post',
          url: api + '/v1/user/wallet/address',
          data: camel_data,
          statusCode: {
            401: function () {
              alert('检测到您的账号登录时间已过期,请您重新登录!');
              hCookie.removeCookie('tk');
              hCookie.removeCookie('uid');
              location.href = '../html/login.html';
            }
          },
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
    renderData() {
      let _self = this;
      _self.getAddress().then((data) => {
        let balance = utils.subFloat(data.balance, 6).num;
        let coin_kind = data.type.toLocaleUpperCase();
        let address = data.address.substring(0, 10) + '****' + data.address.substring(30);
        let _address = utils.toUcode(address);
        $('.coin-kind>i').html(balance);
        $('.coin-kind>span').html(coin_kind);
        $('.coin-address').html(_address);
        $('.transfer-coin').html(coin_kind);
        _self.getTransferFee(coin_kind);
        layer.closeLoading();
        _self.toTransfer(data);
        _self.validateAddress(coin_kind);
      }).catch((err) => {
        console.error(err);
      })
    },
    selectTime() {
      const time_area = new MobileSelect({
        trigger: '#time-area',
        title: '',
        wheels: [{
            data: ['2018', '2019', '2020', '2021', '2022']
          },
          {
            data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
          },
          {
            data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
          },
          {
            data: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
          },
          {
            data: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
          }
        ],
        position: [0, 10, 20, 10, 20, 30],
        bgColor: '#0E0E16',
        textColor: '#ffffff',
        titleBgColor: '#0E0E16',
        triggerDisplayData: false,
        ensureBtnColor: '#ffffff',
        cancelBtnColor: '#ffffff',
        callback: function (index_arr, data) {
          // console.log(data);
          $('.transfer-time-y').html(data[0]);
          $('.transfer-time-M').html(data[1]);
          $('.transfer-time-d').html(data[2]);
          $('.transfer-time-h').html(data[3]);
          $('.transfer-time-m').html(data[4]);
        }
      })
    },
    toTransfer(data) {
      $('.next-btn').click(function () {
        if (!$(this).hasClass('transfer-pend')) {
          $(this).addClass('transfer-pend');
          let to_amount = $('.transfer-amount').val().trim();
          let to_address = $('.transfer-to-address').val().trim();
          let to_poundage = $('.poundage-input').val().trim();
          if (Number(to_amount) > 0 && to_address) {
            let plan_time = $('.transfer-time-y').html() + '-' + $('.transfer-time-M').html() + '-' + $('.transfer-time-d').html() + ' ' + $('.transfer-time-h').html() + ':' + $('.transfer-time-m').html();
            let camel_data = signData({
              from: data.address,
              to: to_address,
              type: data.type,
              amount: to_amount,
              fee: to_poundage,
              mark: 'first test transfer',
              plan_time: plan_time
            });
            $.ajax({
              type: 'post',
              url: api + '/v1/transfer/to',
              data: camel_data,
              statusCode: {
                200: function () {
                  alert('转账成功!')
                },
                281: function () {
                  alert('您的钱包地址不存在!')
                },
                282: function () {
                  alert('您的钱包余额不足!')
                },
                291: function () {
                  alert('转账失败!')
                }
              },
              success: function (data) {
                if(data) {
                  $('.next-btn').removeClass('transfer-pend');
                  $('.transfer-to-address').val('');
                }
              },
              error: function (err) {
                console.error(err);
              }
            })
          } else {
            alert('请输入转账金额及收款方地址!');
            $('.next-btn').removeClass('transfer-pend');
          }
        }
      })
    },
    validateAddress(type) { // 验证地址
      $('.transfer-to-address').blur(function () {
        let val = $(this).val();
        if (val !== '') {
          if (type === 'BTC') {
            let reg = /^(1|3)[a-zA-Z0-9]{33}/g;
            if (!reg.test(val)) {
              layer.open({
                content: '请输入合法的地址!',
                time: 1.5
              });
              $(this).val('');
            }
          } else {
            let reg = /^(0x|0X)[a-z0-9]{40}/ig;
            if (!reg.test(val)) {
              layer.open({
                content: '请输入合法的地址!',
                time: 1.5
              });
              $(this).val('');
            }
          }
        }
      })
    },
    getTransferFee(type) {
      let camel_data = signData({
        type: type
      });
      $.ajax({
        type: 'post',
        url: api + '/v1/sys/transfer/fee',
        data: camel_data,
        success: function (data) {
          if (data) {
            let _fee = utils.subFloat(data.fee, 2).num;
            if (data.fee > 0) {
              _fee = utils.subFloat(data.fee, 5).num;
            }
            $('.poundage-input').val(_fee);
          }
        }
      })
    }
  };
  transfer.init();
})