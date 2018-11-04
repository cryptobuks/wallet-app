!function() {
  function DragBar(ele) {
    this.flag = false;
    this.init_x = 0; // 初始值
    this.slide_x = 0; // 滑动值
    this.oft_x = 0; // 偏移量
    this.x = 0; // 位移
    this.ele = ele; // htmlElement
    this._poundage = 0; // 进度比例
    this.init();
  };
  DragBar.prototype = {
    constructor: DragBar,
    init() {
      let _self = this;
      let ele = _self.ele;
      let wrapper = document.querySelector('.poundage-progress'); // 进度条容器
      let fill = document.querySelector('#progress-fill'); // 背景填充
      ele.style.left = '15px';
      fill.style.width = '15px';
      // slide
      ele.addEventListener('mousedown', () => {
        _self.down();
      });
      ele.addEventListener('touchstart', () => {
        _self.down();
      })
      ele.addEventListener('touchmove', () => {
        _self.move(wrapper, fill);
      })
      ele.addEventListener('mousemove', (e) => {
        _self.move(wrapper, fill);
      });
      ele.addEventListener('touchend', () => {
        _self.drop();
      })
      ele.addEventListener('mouseup', (e) => {
        _self.drop();
      });
      _self.clickProgressBar(wrapper,fill);
    },
    clickProgressBar(wrapper,fill) {
      let ele = this.ele;
      wrapper.addEventListener('click', () => {
        let touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.x = touch.clientX - 15 - ele.offsetWidth;
        if (this.x <= 0) {
          this.x = 0;
        } else if (this.x >= wrapper.offsetWidth) {
          this.x = wrapper.offsetWidth;
        }
        ele.style.left = this.x + 'px';
        fill.style.width = this.x + 'px';
        this._poundage = utils.subFloat(this.x / 100000, 5).num;
        $('.poundage-input').val(this._poundage);
      })
    },
    down() {
      this.flag = true;
      let ele = this.ele;
      let touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.init_x = touch.clientX;
      this.oft_x = ele.offsetLeft;
    },
    move(wrapper, fill) {
      let touch;
      let ele = this.ele;
      let b_width = wrapper.offsetWidth - ele.offsetWidth;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      if (this.flag) {
        this.slide_x = touch.clientX;
        this.x = this.slide_x - this.init_x + this.oft_x;
        if (this.x <= 0) {
          this.x = 0;
        } else {
          if (this.x >= b_width) {
            this.x = b_width;
          }
        }
        ele.style.left = this.x + 'px';
        fill.style.width = this.x + 'px';
        this._poundage = utils.subFloat(this.x / 100000, 5).num;
        $('.poundage-input').val(this._poundage);
      }
    },
    drop() {
      this.flag = false;
    }
  }
  window.DragBar = DragBar;
}();
