$(function () {
  const registable = {
    init() {
      this.getAreaNum();
      this.loadImg();
      this.focus();
      this.blur();
      this.initRequest();
    },
    getAreaNum() { // 获取区
      let a_num = utils.subUrl().a_num;
      if (a_num !== '' && a_num !== undefined) {
        $('.area-num').html(a_num);
        localStorage.setItem('a_num', a_num);
      } else {
        let o_num = localStorage.getItem('a_num') || '86';
        $('.area-num').html(o_num);
      }
    },
    loadImg() {
      let img_arr = ['../images/reg_passw_1.png', '../images/reg_passw_2.png', '../images/reg_code_1.png', '../images/reg_code_2.png'];
      img_arr.forEach((item) => {
        let img = new Image();
        img.src = item;
        img.classList.add('hide');
        $('.regist').append(img);
      })
    },
    focus() {
      let _self = this;
      // input focus
      $('.passw-input').focus(function () {
        $(this).siblings('i').css({
          'background': 'url(../images/reg_passw_1.png) 0 0 no-repeat',
          'background-size': '.426667rem .453333rem'
        });
        $(this).removeClass('complete');
      });
      $('.conf-passw-input').focus(function () {
        $(this).siblings('i').css({
          'background': 'url(../images/reg_passw_1.png) 0 0 no-repeat',
          'background-size': '.426667rem .453333rem'
        });
        $(this).removeClass('complete');
      });
      $('.reg-code-input').on('input', function () {
        $(this).siblings('i').css({
          'background': 'url(../images/reg_code_1.png) 0 0 no-repeat',
          'background-size': '.426667rem .453333rem'
        });
        $(this).removeClass('complete');
        if ($(this).val() !== '' && $(this).val().length === 4) {
          $(this).blur();
        };
        _self.lightLogin();
      })
    },
    blur() { //input blur
      let _self = this;
      $('.phone-num-input').blur(function () { // phone
        let val = $(this).val();
        if (val !== '') {
          let reg = /^1[345789]\d{9}$/g;
          if (reg.test(val)) {
            $(this).addClass('complete');
          } else {
            layer.open({
              content: '请输入有效的手机号!',
              time: 2
            })
          }
        } else {
          $(this).removeClass('complete');
        }
        _self.lightLogin();
      });
      $('.passw-input').blur(function () { // passw
        $('.conf-passw-input').val('');
        let val = $(this).val();
        if (val !== '') {
          let reg = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{6,18}$/g;
          if (reg.test(val)) {
            $(this).siblings('i').css({
              'background': 'url(../images/passw_2.png) 0 0 no-repeat',
              'background-size': '.426667rem .453333rem'
            });
            $(this).addClass('complete');
          } else {
            layer.open({
              content: '请输入正确格式的密码!',
              time: 2
            })
          }

        } else {
          $(this).siblings('i').css({
            'background': 'url(../images/passw_0.png) 0 0 no-repeat',
            'background-size': '.426667rem .453333rem'
          });
          $(this).removeClass('complete');
        }
        _self.lightLogin();
      });
      $('.conf-passw-input').blur(function () { //confirm passw
        let val = $(this).val();
        let o_passw = $('.passw-input').val();
        if (val !== '') {
          if (val === o_passw) {
            $(this).siblings('i').css({
              'background': 'url(../images/passw_2.png) 0 0 no-repeat',
              'background-size': '.426667rem .453333rem'
            });
            $(this).addClass('complete');
          } else {
            layer.open({
              content: '请确认密码!',
              time: 2
            })
          }
        } else {
          $(this).siblings('i').css({
            'background': 'url(../images/passw_0.png) 0 0 no-repeat',
            'background-size': '.426667rem .453333rem'
          });
          $(this).removeClass('complete');
        }
        _self.lightLogin();
      });
      $('.reg-code-input').blur(function () { //  code
        if ($(this).val() !== '') {
          $(this).siblings('i').css({
            'background': 'url(../images/reg_code_2.png) 0 0 no-repeat',
            'background-size': '.426667rem .453333rem'
          });
          $(this).addClass('complete');
        } else {
          $(this).siblings('i').css({
            'background': 'url(../images/reg_code_0.png) 0 0 no-repeat',
            'background-size': '.426667rem .453333rem'
          });
          $(this).removeClass('complete');
        }
        _self.lightLogin();
      })
    },
    regist() {
      let params = {
        pre_num: $('.area-num').html(),
        phone: $('.phone-num-input').val(),
        pass_word: $('.passw-input').val(),
        code: $('.reg-code-input').val()
      };
      let camel_data = signData(params);
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'post',
          url: api + '/v1/reg/phone',
          dataType: 'json',
          data: camel_data,
          cache: false,
          success: function (data, xhr) {
            if (data !== null) {
              resolve(data);
            }
          }
        })
      })
    },
    getCode() {
      let params = {
        pre_num: '86',
        phone: $('.phone-num-input').val(),
        type: 1
      };
      let camel_data = signData(params);
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'post',
          url: api + '/v1/phone/send',
          data: camel_data,
          success: function (data) {
            resolve(data);
          }
        })
      })
    },
    lightLogin() { // regist-btn hightlight
      if ($('.phone-num-input').hasClass('complete') && $('.passw-input').hasClass('complete') && $('.conf-passw-input').hasClass('complete') && $('.reg-code-input').hasClass('complete')) {
        $('.reg-outer').addClass('reg-hightlight');
      } else {
        $('.reg-outer').removeClass('reg-hightlight');
      }
    },
    initRequest() {
      let _self = this;
      $('.code-status').click(function () {
        if ($(this).hasClass('get-code')) {
          $(this).html('重新获取');
          $(this).addClass('afresh-get').removeClass('get-code');
        } else if ($(this).hasClass('afresh-get')) {
          $(this).html('获取验证码');
          $(this).addClass('get-code').removeClass('afresh-get');
        }
        _self.getCode().then((res) => {
          if (res.status === 282) {
            confirm('手机号已经注册!');
            return;
          } else {
            confirm('验证码为: 0000');
          }
        })
      })
      $('.reg-btn').click(function () {
        if ($('.reg-outer').hasClass('reg-hightlight')) {
          $('.reg-outer').removeClass('reg-hightlight');
          layer.open({
            content:'正在注册 ...'
          });
          _self.regist().then((res) => {
            if (res.isworked) {
              layer.close();
              alert('注册成功!');
              location.href = './login.html';
            } else if (res.status === 284) {
              layer.close();
              confirm('注册失败,您注册的手机号已经存在!');
              return;
            }
          }).catch((err) => {
            console.error(err);
          })
        }
      });
      //choose area
      $('.phone-num-area').click(function () {
        location.href = './choose_area.html';
      })
      //back to login
      $('.to-back').click(function() {
         $(this).addClass('back-login');
         location.href = '../html/login.html';
      })
    }
  };
  registable.init();
})