$(function () {
  const forgotable = {
    init() {
      this.load();
      this.sendRequest();
      this.focus();
      this.blur();
    },
    load() {
      //preload img
      let img_arr = ['../images/reg_passw_1.png', '../images/reg_passw_2.png', '../images/reg_code_1.png', '../images/reg_code_2.png'];
      img_arr.forEach((item) => {
        let img = new Image();
        img.src = item;
        img.classList.add('hide');
        $('.forgot_passw').append(img);
      });
      //load pre_num
      let a_num = localStorage.getItem('a_num') || '86';
      $('.area-num').html(a_num);
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
      $('.forgot-code-input').on('input', function () {
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
    blur() {
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
      $('.forgot-code-input').blur(function () { //  code
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
    getCode() {
      let pre_num = localStorage.getItem('a_num') || '86';
      let params = {
        pre_num: pre_num,
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
    resetPassw() {
      let params = {
        pre_num: $('.area-num').html(),
        phone: $('.phone-num-input').val(),
        pass_word: $('.passw-input').val(),
        code: $('.forgot-code-input').val()
      };
      let camel_data = signData(params);
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'post',
          url: api + '/v1/user/reset/password',
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
    lightLogin() {
      if ($('.phone-num-input').hasClass('complete') && $('.passw-input').hasClass('complete') && $('.conf-passw-input').hasClass('complete') && $('.forgot-code-input').hasClass('complete')) {
        $('.forgot-outer').addClass('forgot-hightlight');
      } else {
        $('.forgot-outer').removeClass('forgot-hightlight');
      }
    },
    sendRequest() {
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
            confirm('验证码为: 0000');
        })
      });
      $('.forgot-btn').click(function () {
        if ($('.forgot-outer').hasClass('forgot-hightlight')) {
          $('.forgot-outer').removeClass('forgot-hightlight');
          layer.open({
            content:'正在重置密码 ...'
          });
          _self.resetPassw().then((res) => {
            if (res.isworked) {  
              alert('成功重置密码!');
              location.href = './login.html';
            }else if(res.status == 281) {
              alert('您的手机号还没注册');
            }else if(res.status == 291) {
              alert('新旧密码不能一样!');
            }
            layer.close();
          }).catch((err) => {
            console.error(err);
          })
        }
      });
      //back to login
      $('.to-back').click(function () {
        $(this).addClass('back-login');
        location.href = '../html/login.html';
      })
    }
  };
  forgotable.init();
})