$(function () {
  const loginable = {
    init() {
      this.forbidBack();
      this.loadImg();
      this.focus();
      this.blur();
      this.btnLogin();
      this.linkActive();
    },
    forbidBack() { // 禁止浏览器回退
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
      });
    },
    loadImg() {
      let img_arr = ['../images/user_1.png', '../images/user_2.png', '../images/passw_1.png', '../images/passw_2.png'];
      img_arr.forEach((item) => {
        let img = new Image();
        img.src = item;
        img.classList.add('hide');
        $('.login').append(img);
      })
    },
    focus() {
      // input focus
      $('.user-input').focus(function () {
        $(this).siblings('i').css({
          'background': 'url(../images/user_1.png) 0 0 no-repeat',
          'background-size': '.426667rem .453333rem'
        });
        $(this).parent('.user-name').css({
          'border-bottom-color': '#B263F9'
        });
        $(this).removeClass('complete');
      });
      $('.passw-input').focus(function () {
        $(this).siblings('i').css({
          'background': 'url(../images/passw_1.png) 0 0 no-repeat',
          'background-size': '.426667rem .453333rem'
        });
        $(this).parent('.passw').css({
          'border-bottom-color': '#B263F9'
        });
        $(this).removeClass('complete');
      });
    },
    blur() { // input blur
      let _self = this;
      // user
      $('.user-input').blur(function () {
        let val = $(this).val();
        if (val !== '') {
          let reg1 = /^1[345789]\d{9}$/g;
          let reg2 = /^[a-zA-Z]/g;
          if (reg1.test(val) || reg2.test(val)) {
            $(this).siblings('i').css({
              'background': 'url(../images/user_2.png) 0 0 no-repeat',
              'background-size': '.426667rem .453333rem'
            });
            $(this).addClass('complete');
          } else {
            layer.open({
              content: '请输入有效的用户名或手机号!',
              time: 2
            })
          }
        } else {
          $(this).siblings('i').css({
            'background': 'url(../images/user_0.png) 0 0 no-repeat',
            'background-size': '.426667rem .453333rem'
          });
          $(this).removeClass('complete');
        }
        $(this).parent('.user-name').css({
          'border-bottom-color': '#E6E6E6'
        });
        _self.lightLogin();
      });
      //passw 
      $('.passw-input').on('input',function(){
          let val = $(this).val();
          let reg = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{6,18}$/g;
          if ( val !== '' && reg.test(val)) {
            $(this).addClass('complete');
          }else {
            $(this).removeClass('complete');
          }
          _self.lightLogin();
      });
      $('.passw-input').blur(function () {
        let val = $(this).val();
        if (val !== '') {
          let reg = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{6,18}$/g;
          if (reg.test(val)) {
            $(this).siblings('i').css({
              'background': 'url(../images/passw_2.png) 0 0 no-repeat',
              'background-size': '.426667rem .453333rem'
            });
            $(this).addClass('complete');
          }else {
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
        $(this).parent('.passw').css({
          'border-bottom-color': '#E6E6E6'
        });
        _self.lightLogin();
      })
    },
    login() {
      let params = {
        user_name: $('.user-input').val(),
        pass_word: $('.passw-input').val()
      }
      let camel_data = signData(params);
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'post',
          url: api + '/v1/user/login',
          dataType: 'json',
          data: camel_data,
          cache: false,
          statusCode : {
            500:function() {
               alert('服务器异常!');
               layer.close();
            }
          },
          success: function (data) {
            if (data !== null) {
              resolve(data);
            }
          }
        })
      })
    },
    btnLogin() {
      let _self = this;
      $('.login-btn').click(function () {
        if ($('.login-outer').hasClass('login-hightlight')) {
          $('.login-outer').removeClass('login-hightlight');
          layer.open({
            content: '登录中 ...'
          });
          _self.login().then((res) => {
            if (res.id && res.token) {
              setTimeout(() => {
                layer.close();
                hCookie.setCookie('uid', res.id, 1);
                hCookie.setCookie('tk', res.token, 1);
                location.href = '../index.php';
              }, 1500)
            } else if (res.status === 282) {
              layer.close();
              alert('密码错误,请重新登录！');
            } else if (res.status === 280) {
              layer.close();
              alert('账号不存在,请重新登录！');
            }
          })
        }
      })
    },
    lightLogin() { // login hightlight
      if ($('.user-input').hasClass('complete') && $('.passw-input').hasClass('complete')) {
        $('.login-outer').addClass('login-hightlight');
      } else {
        $('.login-outer').removeClass('login-hightlight');
      }
    },
    linkActive() {
      document.querySelector('.regist>a').addEventListener('touchstart',function(){ this.style.color = 'rgb(178,99,249)' });
      document.querySelector('.forget-passw>a').addEventListener('touchstart',function(){ this.style.color = 'rgb(178,99,249)' });
    }
  };
  loginable.init();

})