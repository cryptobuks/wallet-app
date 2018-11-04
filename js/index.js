$(function () { 
  // $('.login-shade').height(window.screen.height);
  // $('body').height(window.screen.height);
  const render = {
    init() {
      let _self = this;
      layer.loading();
      _self.guideInfo();
      _self.getData();
      _self.logout();
      _self.chooseLang(); 
      _self.loginShade();
      _self.setShade();
      _self.toggleSub();
      _self.chooseCoin();
      _self.getUserInfo();
      _self.setUserInfo();
      _self.setLangCoin();
      setInterval(() => {
        _self.getData();
      }, 60 * 1000);
    },
    guideInfo() {
      let _self = this;
      let new_visitor = _self.isNewVisitor();
      if(new_visitor) {
        layer.closeLoading();
        alert('亲爱的用户,请您仔细阅读功能引导!');
        _self.createGuide();
        hCookie.setCookie('visited_note','true',30);
      }
    },
    createGuide() {
      let _self = this;
      let _body = document.querySelector('body');
      let g_html = '';
      g_html += '<div class="guide-info">';
      g_html += '<div class="guide-info-first">';
      g_html += '<div class="guide-info-first-coin">';
      g_html += '<div class="guide-coin-info clearfix">';
      g_html += '<div class="info-left"><i></i><span>BTC</span><span>0.00</span><span>≈￥<b>0.00</b></span></div>';
      g_html += '<div class="info-right"><b></b><i></i><span>1</span></div>';
      g_html += '</div>';
      g_html += '</div>';
      g_html += '<div class="guide-info-first-tips">';
      g_html += '<h3>数字资产</h3><p>点击展开各币种的资产情况</p><p>每个币种均可支持多个地址</p><div class="guide-next">下一步</div>';
      g_html += '</div>';
      g_html += '</div>';
      g_html += '</div>';
      $('body').append(g_html);
      let guide_info = document.querySelector('.guide-info');
      let guide_info_first = document.querySelector('.guide-info-first');
      $('.guide-next').click(function() {
        guide_info.removeChild(guide_info_first);
        let c_html = '';
        c_html += '<div class="guide-info-second">';
        c_html += '<div class="info-second-address clearfix">';
        c_html += '<div class="info-second-address-left clearfix">';
        c_html += '<span>0hadG</span>';
        c_html += '<span>0.8/32000</span>';
        c_html += '</div>';
        c_html += '<div class="info-second-address-right">转账</div>';
        c_html += '</div>';
        c_html += '<div class="info-second-tips">';
        c_html += '<div class="info-second-tips-pointer"><p></p></div>';
        c_html += '<p>左滑进入转账</p><p>点击进入资产详情</p>';
        c_html += '</div>';
        c_html += '<div class="info-second-complete">完成</div>';
        c_html += '</div>';
        $('.guide-info').append(c_html);
        $('.info-second-complete').click(function() {
          _body.removeChild(guide_info);
          layer.loading();
          _self.getData();
        })
      });
      
    },
    isNewVisitor() {
      let flag = hCookie.getCookie('visited_note');
      if(flag === '' || flag === null ) {
         return true;
      }else {
         return false;
      }
    },
    slide() {
      const slide_arr = document.getElementsByClassName('slide');
      Array.from(slide_arr).forEach((item) => {
        let slider = new Slider(item);
        slider.init();
      })
    },
    getData() { // rate and coin_data ajax
      let _self = this;
      _self.getCoinRate().then((rate) => {
        let getCoinList = _self.getCoinList;
        return {
          getCoinList,
          rate
        };
      }).then((res) => {
        let rate = res.rate;
        if (rate !== null) {
          res.getCoinList().then((data) => {
            _self.renderCoin(rate, data);
          });
        }
      });
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
    getCoinList() {
      let camel_data = signData();
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'post',
          url: api + '/v1/user/wallets',
          data: camel_data,
          dataType: 'json',
          statusCode: {
            401: function () {
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
    renderCoin(rate, data) { // render html element
      let _self = this;
      try {
        if (rate !== null && data !== null) {
          //crypto coin
          let rate_cryp = rate['coin_cryp_rate'];
          let coin_cryp = data['coin_cryp'];
          // let cryp_sort = [];
          let d_html = '';
          let aco_balance = 0;
          Object.keys(coin_cryp).forEach((item) => {
            let t_addr = coin_cryp[item];
            let _addr = Object.keys(t_addr);
            let total = 0;
            _addr.forEach((ar) => {
              total += parseFloat(t_addr[ar]);
            })
            total = utils.subFloat(parseFloat(total), 5).num;
            let t_pri = utils.subFloat(parseFloat(total * rate_cryp[item].CNY)).num;
            aco_balance += parseFloat(t_pri);
            // t_pri = utils.formatNum(t_pri);
            let w_num = _addr.length;
            d_html += '<li>';
            d_html += '<div class="asset-info clearfix">';
            d_html += '<div class="info-left">';
            d_html += '<i></i>';
            d_html += '<span>' + item + '</span><span>' + total + '</span>';
            d_html += '<span>≈￥<b>' + utils.formatNum(t_pri, 'cryp') + '</b></span></div>';
            d_html += '<div class="info-right">';
            d_html += '<b></b><i></i>';
            d_html += '<span>' + w_num + '</span></div>';
            d_html += '</div>';
            d_html += '<div class="subset-ads hide">';
            d_html += '<ul class="ads-con">';
            _addr.forEach((ele) => {
              let adr_num = utils.subFloat(parseFloat(t_addr[ele]), 5).num;
              let adr_pri = utils.subFloat(parseFloat(adr_num * rate_cryp[item].CNY)).num;
              // adr_pri = utils.formatNum(adr_pri,'cryp');
              let _ele = utils.toUcode(ele);
              let hide_ele = utils.encodeUtf8(ele).toString().replace(/\,/g,'.');
              d_html += '<li>';
              d_html += '<div class="ads-info clearfix slide"><div>';
              d_html += '<p class="ads-left">';
              d_html += '<span class="opt_ft">' + _ele + '</span>';
              d_html += '</p>';
              d_html += '<p class="ads-right">';
              d_html += '<span class="ads-right-num">' + adr_num + '</span><span class="ads-right-cny">≈￥<b>' + utils.formatNum(adr_pri, 'cryp') + '</b></span>';
              d_html += '<input type="hidden" class="adr" value="' + hide_ele + '"/></p>';
              d_html += '</div></div>';
              d_html += '<div class="transfer">转账</div>';
              d_html += '</li>';
            })
            d_html += '</ul></div>';
            d_html += '</li>';
          })
          $('.dgt-cn').html(d_html);
          //real coin
          if (JSON.stringify(data['coin_real']) !== '{}' ) {
            let rate_real = rate['coin_real_rate'];
            let coin_real = data['coin_real'];
            let l_html = '';
            let real_sort = ['XAU', 'USD', 'EUR', 'CNY'];
            real_sort.forEach((item) => {
              let r_num = 0;
              let r_pri = 0;
              for (let i in coin_real[item]) {
                if (item === 'XAU') {
                  r_num = utils.subFloat(parseFloat(coin_real[item][i])).num;
                } else {
                  r_num = (utils.subFloat(parseFloat(coin_real[item][i])).int).toString().replace(/\./, '');
                }
              }
              r_pri = utils.subFloat(parseFloat(r_num * rate_real[item].CNY)).num;
              aco_balance += parseFloat(r_pri);
              l_html += '<li>';
              l_html += '<div class="legal-info">';
              l_html += '<div>';
              l_html += '<i></i>';
              if (item === 'CNY') {
                l_html += '<span>' + item + '</span><span>' + utils.formatNum(r_num, 'real') + '</span>';
                l_html += '<span><b></b></span>';
              } else {
                l_html += '<span>' + item + '</span><span>' + r_num + '</span>';
                l_html += '<span>≈￥<b>' + utils.formatNum(r_pri, 'real') + '</b></span>';
              }
              l_html += '</div></div>';
              l_html += '</li>';
            })
            $('.leg-cn').html(l_html);
          }else {
            $('.legal-coin').addClass('hide');
          }
          //account balance
          aco_balance = utils.formatNum(aco_balance, 'cryp');
          $('.t_balance').html(aco_balance);
          layer.closeLoading();
          _self.sendAddr();
          _self.slide();
        }
      } catch (err) {
        alert(err.message);
      }

    },
    sendAddr() { //send coin address
      localStorage.removeItem('addr');
      $('.ads-con').on('click', 'li', function () {
        let addr = $(this).children('.ads-info').find('.ads-right').find('.adr').val();
        localStorage.setItem('addr', addr);
        location.href = '../html/wallet_detail.html';
      })
    },
    logout() { // logout
      $('.logout').click(function () {
        let status = confirm('确定退出登录吗?');
        if (status) {
          let camel_data = signData();
          $.ajax({
            type: 'post',
            url: api + '/v1/user/logout',
            data: camel_data,
            success: function (data) {
              hCookie.removeCookie('tk');
              hCookie.removeCookie('uid');
              location.href = '../html/login.html';
            }
          })
        } else {
          return;
        }
      });
    },
    chooseLang() { // choose lang
      let _self = this;
      $('.lang-list').on('click', 'li .lang-k', function () {
        $(this).css({
          'color': '#00E1DB'
        });
        $(this).parent('.lang-item').parent().addClass('checked-lang');
        $(this).parent('.lang-item').parent().siblings().removeClass('checked-lang');
        $(this).parent('.lang-item').parent().siblings().children().find('.lang-k').css({
          'color': '#fff'
        });
        //get img url
        let img_arr = document.querySelectorAll('.preload');
        let true_img = new Array();
        Array.from(img_arr).forEach((item) => {
          let src = $(item)[0].src;
          true_img.push(src);
        })
        // console.log(true_img[0]);
        let txt = $(this).attr('data-txt');
        switch (txt) {
          case 'jp':
            _self.removeBg();
            $(this).siblings('i').css({
              "background": "url(" + true_img[0] + ") 0 0 no-repeat",
              "background-size": ".88rem .813333rem"
            });
            break;
          case 'cnf':
            _self.removeBg();
            $(this).siblings('i').css({
              "background": "url(" + true_img[1] + ") 0 0 no-repeat",
              "background-size": ".88rem .813333rem"
            });
            break;
          case 'en':
            _self.removeBg();
            $(this).siblings('i').css({
              "background": "url(" + true_img[2] + ") 0 0 no-repeat",
              "background-size": ".88rem .813333rem"
            });
            break;
          case 'cnj':
            _self.removeBg();
            $(this).siblings('i').css({
              "background": "url(" + true_img[3] + ") 0 0 no-repeat",
              "background-size": ".88rem .813333rem"
            });
            break;
        }
      });
    },
    checkedLang(lang_id) { // save user setting lang info
      switch (lang_id) {
        case 4:
          $('.jp').children('i').css({
            "background": "url(../images/jp_icon_1.png) 0 0 no-repeat",
            "background-size": ".88rem .813333rem"
          });
          $('.jp').children('.lang-k').css({
            'color': '#00E1DB'
          });
          break;
        case 5:
          $('.cnf').children('i').css({
            "background": "url(../images/cnf_icon_1.png) 0 0 no-repeat",
            "background-size": ".88rem .813333rem"
          });
          $('.cnf').children('.lang-k').css({
            'color': '#00E1DB'
          });
          break;
        case 1:
          $('.en').children('i').css({
            "background": "url(../images/en_icon_1.png) 0 0 no-repeat",
            "background-size": ".88rem .813333rem"
          });
          $('.en').children('.lang-k').css({
            'color': '#00E1DB'
          });
          break;
        case 3:
          $('.cnj').children('i').css({
            "background": "url(../images/cnj_icon_1.png) 0 0 no-repeat",
            "background-size": ".88rem .813333rem"
          });
          $('.cnj').children('.lang-k').css({
            'color': '#00E1DB'
          });
          break;
      }
    },
    removeBg() { // remove all lang css-bg
      $($('.lang-list').children('li')[0]).children('div').find('i').css({
        "background": "url(../images/jp_icon_0.png) 0 0 no-repeat",
        "background-size": ".88rem .813333rem"
      });
      $($('.lang-list').children('li')[1]).children('div').find('i').css({
        "background": "url(../images/cnf_icon_0.png) 0 0 no-repeat",
        "background-size": ".88rem .813333rem"
      });
      $($('.lang-list').children('li')[2]).children('div').find('i').css({
        "background": "url(../images/en_icon_0.png) 0 0 no-repeat",
        "background-size": ".88rem .813333rem"
      });
      $($('.lang-list').children('li')[3]).children('div').find('i').css({
        "background": "url(../images/cnj_icon_0.png) 0 0 no-repeat",
        "background-size": ".88rem .813333rem"
      });
    },
    loginShade() { // login shade
      let _self = this;
      $('.header-pic').click(function () {
        $('.login-shade').show('normal');
        $('body,html').css({
          'height': '100%',
          'overflow': 'hidden'
        })
      })
      $('.hide-core').click(function () {
        $('.user-opt-name').attr('disabled', true);
        $('.login-shade').hide('normal');
        $('body').css('overflow', 'auto');
      });
    },
    getUserInfo() { // get user setting info
      let _self = this;
      let camel_data = signData();
      $.ajax({
        type: 'post',
        data: camel_data,
        url: api + '/v1/users',
        statusCode: {
          401: function () {
            alert('检测到您的账号登录时间已过期,请您重新登录!');
            hCookie.removeCookie('tk');
            hCookie.removeCookie('uid');
            location.href = '../html/login.html';
          }
        },
        success: function (data) {
          if (data !== null) {
            if (data.uid) {
              let head_pic = data.img_avatar;
              head_pic = head_pic ? head_pic : '../images/header.jpg';
              $('#hd-img').attr('src', head_pic);
              $('#hd-pic').attr('src', head_pic);
              $('.user-opt-name').val(data.scrn_name);
              if (data.default_lang !== null) {
                let lang_id = parseInt(data.default_lang);
                _self.checkedLang(lang_id);
              }
              if (data.default_currency !== null) {
                let coin_id = parseInt(data.default_currency);
                _self.checkedCoin(coin_id);
              }
            }
          }
        }
      })
    },
    setUserInfo() { // user option 
      let _self = this;
      $('.user-opt').click(function () {
        $('.user-opt-name').attr('disabled', false).focus();
      });
      $('.user-opt-name').blur(function () {
        $('.user-opt-name').attr('disabled', true);
        let val = $(this).val();
        if (val !== '') {
          _self.updateUserInfo(val);
        } else {
          $(this).val('');
        }
      })
    },
    updateUserInfo(name = '', lang = 0, coin = 0) {
      let _self = this;
      let camel_data = signData({
        scrn_name: name,
        default_lang: lang,
        default_currency: coin
      });
      $.ajax({
        type: 'post',
        data: camel_data,
        url: api + '/v1/users/update',
        success: function (data) {
          if (data !== null && data.isworked) {
            _self.getUserInfo();
          }
        },
        error: function () {
          alert('网络错误!');
          _self.getUserInfo();
        }
      })
    },
    setShade() { // setting shade
      $('.dialog-btn').click(function () {
        $('.setting-shade').show('normal');
        $('body,html').css({
           'overflow':'hidden'
        });
        //img preload
        let img_arr = ['../images/jp_icon_1.png', '../images/cnf_icon_1.png', '../images/en_icon_1.png', '../images/cnj_icon_1.png'];
        img_arr.forEach((item) => {
          let img = new Image();
          img.src = item;
          img.classList.add('preload');
          img.classList.add('hide');
          $('.setting-shade').append(img);
        });
      });
      $('.close').click(function () {
        $('.setting-shade').hide('normal');
        $('body,html').css({
          'overflow':'auto'
        });
      })
    },
    setLangCoin() { // update lang and coin
      let _self = this;
      $('.ensure').click(function () {
        let scrn_name = $('.user-opt-name').val();
        let lang_id = _self.getSelectId('.lang-list');
        let coin_id = _self.getSelectId('.coin-list');
        _self.updateUserInfo(scrn_name, lang_id, coin_id);
        $('.setting-shade').hide('normal');
        $('body,html').css('overflow', 'auto');
      })
    },
    toggleSub() { // toggle wallet subsetsubset
      $('.dgt-cn').on('click', 'li', function () {
        $(this).children('.subset-ads').toggle('normal');
        $(this).siblings().children('.subset-ads').hide('normal');
      });
    },
    chooseCoin() { // choose coin
      $('.coin-list').on('click', 'li .coin-k', function () {
        $(this).css({
          'color': '#00E1DB'
        });
        $(this).parent('.coin-item').parent().addClass('checked-coin');
        $(this).parent('.coin-item').parent().siblings().removeClass('checked-coin');
        $(this).parent('.coin-item').parent().siblings().children().find('.coin-k').css({
          'color': '#fff'
        })
      })
    },
    checkedCoin(coin_id) { // save user setting coin info
      let li_node = $('.coin-list>li');
      Array.from(li_node).forEach((item) => {
        let li_id = parseInt($(item).attr('data-id'));
        if (coin_id === li_id) {
          $(item).children().children('.coin-k').css({
            'color': '#00E1DB'
          });
        }
      })
    },
    getSelectId(selector) { // return checked lang and coin id
      let li_node = $('' + selector + '>li');
      let s_id = 0;
      Array.from(li_node).forEach((item) => {
        if ($(item).hasClass('checked-lang') || $(item).hasClass('checked-coin')) {
          s_id = parseInt($(item).attr('data-id'));
        }
      });
      return s_id;
    }
  };
  render.init();
})