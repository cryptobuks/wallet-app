$(function () {
  //去除click延迟
  $.getScript('https://cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js', function () {
    window.addEventListener("load", function () {
      FastClick.attach(document.body);
    }, false)
  });
  const render = {
    init() {
      let _self = this;
      _self.getAreaList().then((data) => {
        if (data !== null) {
          _self.renderList(data);
          _self.posArea();
          _self.toRegist();
          _self.loadImg();
          _self.search(data);
        }
      })
    },
    getAreaList() {  
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'get',
          url: '../mock/phone_code.json',
          dataType: 'json',
          success: function (data) {
            if (data !== null) {
              resolve(data);
            }
          }
        })
      })
    },
    renderList(data) {
      let area_arr = Object.keys(data).sort();
      let html = '<ul class="content">';
      area_arr.forEach((item) => {
        html += '<li>';
        html += '<div class="c-outer">';
        html += '<p class="o-index">' + item.toUpperCase() + '</p>';
        html += '<ul class="o-inner">';
        let area_info = data[item];
        area_info.forEach((ele) => {
          html += '<li>';
          html += '<div class="area-info clearfix">';
          html += '<p class="info-name">' + ele[0] + '</p>';
          html += '<p class="info-num"><span>+</span><span class="area-num">' + ele[1] + '</span></p>';
          html += '</div>';
          html += '</li>';
        })
        html += '</ul>';
        html += '</div>';
        html += '</li>';
      });
      html += '</ul>';
      html += '<div class="pos-bar">';
      html += '<ul class="bar-info">';
      area_arr.forEach((idx) => {
        html += '<li>' + idx.toUpperCase() + '</li>';
      })
      html += '</ul>';
      html += '</div>';
      $('.main').html(html);
    },
    posArea() {
      let area_node = Array.from($('.content>li'));
      $('.bar-info').on('click', 'li', function () {
        let cli_wd = $(this).html().toUpperCase();
        area_node.forEach((item) => {
          let pos_wd = $(item).children().children('.o-index').html().toUpperCase();
          if (cli_wd === pos_wd) { //获取指定位置的top值
            let top = Math.round($(item).offset().top);
            $('body,html').animate({
              scrollTop: top
            }, 1000);
          }
        })
      })
    },
    toRegist() {
      $('.close-area').click(function () {
        location.href = './regist.html';
      })
      $('.o-inner').on('click', 'li', function () {
        let a_num = $(this).children('.area-info').find('.area-num').html();
        location.href = './regist.html?a_num=' + a_num;
      })
    },
    loadImg() {
      let _self = this;
      let img_arr = ['../images/search_area_1.png', '../images/search_area_2.png'];
      img_arr.forEach((item) => {
        let img = new Image();
        img.src = item;
        img.classList.add('hide');
        $('.choose-area').append(img);
      });
      _self.changeFocus();
    },
    changeFocus() {
      $('.search-input').focus(function () {
        $('.search-area-btn').css({
          'background': 'url(../images/search_area_1.png) 0 0 no-repeat',
          'background-size': '.506667rem .506667rem'
        })
      });
      $('.search-input').blur(function () {
        let val = $(this).val();
        if (val !== '' && val !== undefined) {
          $('.search-area-btn').css({
            'background': 'url(../images/search_area_2.png) 0 0 no-repeat',
            'background-size': '.506667rem .506667rem'
          })
        } else {
          $('.search-area-btn').css({
            'background': 'url(../images/search_area_0.png) 0 0 no-repeat',
            'background-size': '.506667rem .506667rem'
          })
        }
      })
    },
    search(data) { // like search
      let _self = this;
      $('.search-input').on('input', function () {
        let val = $(this).val();
        if (val !== '' && val !== undefined) {
          let reg = new RegExp(val, 'g');
          let s_html = '<ul class="search-ul">';
          let area_arr = Object.keys(data).sort();
          area_arr.forEach((item) => {
            let area_info = data[item];
            area_info.forEach((ele) => {
              if (ele[0].match(reg)) {
                 s_html += '<li class="search-li"><div class="area-info clearfix">';
                 s_html += '<p class="info-name">'+ele[0]+'</p>';
                 s_html += '<p class="info-num"><span>+</span><span class="area-num">'+ele[1]+'</span></p>';
                 s_html += '</div></li>';
              }
            })
          });
          s_html += '</ul>';
          $('.main').html(s_html);
          $('.search-ul').on('click','li',function(){
              let a_num = $(this).children('.area-info').find('.area-num').html();
              location.href = './regist.html?a_num=' + a_num ;
          })
        }else {
           _self.renderList(data);
           _self.posArea();
        }

      })
    }
  };
  render.init();
})