$(function () {
  const transfer_record = {
    init() {
      let _self = this;
      layer.loading();
      _self.selectKeyword();
      _self.chooseTransferInfo();
      _self.clickTab();
    },
    selectKeyword() {
      let _self = this;
      $('.select-kw').click(function () {
        if ($(this).hasClass('kw-selecting')) {
          _self.toggleSelectShade('hide');
        } else {
          _self.toggleSelectShade('show');
        }
      });
      $('.kw-list').on('click', 'li', function () {
        let selected_kw = $(this).html();
        $(this).html($('.selected-keyword').html());
        $('.selected-keyword').html(selected_kw);
        _self.toggleSelectShade('hide');
      })
    },
    toggleSelectShade(flag) {
      if (flag === 'show') {
        $('.trs-record-top').addClass('select-status');
        $('.select-shade').show();
        $('.kw-list').show('normal');
        $('.top-balance').hide();
        $('.trs-record-main').addClass('main-shade');
        $('.select-kw').addClass('kw-selecting');
      } else if (flag === 'hide') {
        $('.trs-record-top').removeClass('select-status');
        $('.select-shade').hide();
        $('.kw-list').hide('normal');
        $('.top-balance').show();
        $('.trs-record-main').removeClass('main-shade');
        $('.select-kw').removeClass('kw-selecting');
      }
    },
    chooseTransferInfo() {
      let _self = this;
      $('.main-tablist').on('click', 'p', function () {
        layer.loading();
        let type = $(this).html();
        switch (type) {
          case '全部':
            _self.clickTab();
            break;
          case '转出':
            _self.clickTab();
            break;
          case '转入':
            _self.clickTab();
            break;
        }
        $(this).addClass('tab-selected').siblings('p').removeClass('tab-selected');
      })
    },
    clickTab() {
      let _self = this;
      _self.getTransferList().then((res) => {
        _self.renderList(res);
      });
    },
    getTransferList() {
      let _self = this;
      let camel_data = signData({
        type: '',
        page: 1,
        count: 20
      });
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'post',
          url: api + '/v1/transfer/list',
          data: camel_data,
          success: function (data) {
            if (data) {
              resolve(data);
            }
          },
          error: function (err) {
            reject(err);
          }
        })
      })
    },
    renderList(data) {
      layer.closeLoading();
    }
  };
  transfer_record.init();
})