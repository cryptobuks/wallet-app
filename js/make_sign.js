$(function () {
  window.api = 'http://api.camelcoin.cn';
  // 随机字符串
  function randomStr(len = 32) {
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let max_length = chars.length;
    let str = '';
    for (let i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * max_length));
    }
    return str;
  }
  window.signData = function (params = {}) {
    let token = hCookie.getCookie('tk');
    let uid = hCookie.getCookie('uid');
    let secret = 'iwppqc6mnvsdnfdjigrgnq4pqiweizmc';
    let camel_data = {
      user: {
        id: uid ? uid : 0,
        token: token ? token : ''
      },
      common: {
        time: Date.now(),
        randstr: randomStr(),
        key: 'jskdlf2fkliie9ngoi',
        device: 2,
        device_id: 123,
        ver: 1.0,
        sign: ''
      }
    };
    if (camel_data !== null) {
      let origin = {
        time: camel_data.common.time,
        randstr: camel_data.common.randstr,
        token: camel_data.user.token,
        device_id: camel_data.common.device_id,
      };
      camel_data.params = params;
      if (params !== null) {
        Object.keys(params).forEach((item) => {
          origin[item] = params[item];
        })
      }
      let sort = Object.keys(origin).sort();
      let str_arr = [];
      sort.forEach((item, idx) => {
        let str = '';
        if (idx < (sort.length - 1)) {
          str = item + '=' + origin[item] + '&';
        } else {
          str = item + '=' + origin[item];
        }
        str_arr.push(str);
      });
      let o_str = str_arr.join('');
      let sign_str = hex_sha1(hex_sha1(encodeURIComponent(o_str)) + secret);
      camel_data.common.sign = sign_str;
      return camel_data;
    }
  }
})