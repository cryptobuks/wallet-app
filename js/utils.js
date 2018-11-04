/*
   ABOUT: formatter float&time
   AUTHOR: LiuJL
   DATE: 2018/7/27
*/
(function (window) {
  window.utils = {
    _fonts: {
      "0": "\ue47c",
      "1": "\uf79d",
      "2": "\uf55c",
      "3": "\uf056",
      "4": "\ue6ee",
      "5": "\ue7cd",
      "6": "\ue4f2",
      "7": "\uea5a",
      "8": "\uf18b",
      "9": "\uf16e"
    },
    subFloat(number, index = 2) {
      // 保留小数（四舍五入）
      let mulpire = Math.pow(10, Number(index));
      let num = Math.round(number * mulpire) / mulpire;

      //分割整数和小数
      let f_index = num.toString().indexOf('.') + 1;
      if (f_index > 0) {
        f_index = f_index; //参数为小数
      } else {
        f_index = num.toString().length; //参数不为小数
      }
      let num_Int = num.toString().substring(0, f_index);
      let num_Flo = num.toString().substring(f_index);

      if (Number(num) % 1 === 0) { //整数补零
        num = num + '.00';
      }
      if (num_Flo.length === 1) { //一位小数补零
        num = num + '0';
        num_Flo = num_Flo + '0';
      }
      return {
        "num": num,
        "int": num_Int,
        "float": num_Flo
      }
    },
    tranlDate(ts) {
      if (ts > 0) {
        let time = new Date(ts * 1000); //单位ms
        let Y = time.getFullYear() + '/';
        let M = this.toDoub(time.getMonth() + 1) + '/';
        let D = this.toDoub(time.getDate()) + ' ';
        let h = this.toDoub(time.getHours()) + ':';
        let m = this.toDoub(time.getMinutes()) + ' ';
        return {
          single: {
            "y": Y.replace('\/', ''),
            "M": M.replace('\/', ''),
            "d": D,
            "h": h.replace('\:', ''),
            "m": m
          },
          "date": Y + M + D + h + m,
          "ymd": Y + M + D,
          "hm": h + m
        };
      }
    },
    toDoub(n) {
      return n < 10 ? '0' + n : '' + n;
    },
    //获取地址栏参数
    subUrl() {
      let obj = new Object();
      let search = location.search;
      let para = search.substring(search.indexOf('?') + 1);
      if (para !== '') {
        if (para.indexOf('=') && para.indexOf('&')) {
          let p_list = para.split('&');
          p_list.forEach((item) => {
            let p_arr = item.split('=');
            obj[p_arr[0]] = p_arr[1];
          })
        } else {
          let p_arr = para.split('=');
          obj[p_arr[0]] = p_arr[1];
        }
      }
      return obj;
    },
    toUcode(str) {
      let _self = this;
      let _arr = str.split('').reverse();
      let code = '';
      for (let i in _arr) {
        if (_self._fonts.hasOwnProperty(_arr[i])) {
          code += _self._fonts[_arr[i]];
        } else {
          code += _arr[i];
        }

      }
      // console.log(code);
      return code;
    },
    formatNum(num, type) {
      let _self = this;
      let number = parseFloat(num);
      let _num;
      if (type === 'cryp') {
        if (number >= 1e4) {
          let l_str = number.toString().substring(0, 3);
          let r_str = number.toString().substring(3);
          _num = l_str + ',' + r_str;
          if (number >= 1e5) {
            _num = _self.subFloat((number / 1e4), 3).num + '万';
          }
        } else {
          _num = _self.subFloat(number).num;
        }
      } else if (type === 'real') {
        if (number >= 1e3) {
          _num = _self.subFloat((number / 1e4), 2).num + '万';
        } else {
          _num = _self.subFloat(number).num;
        }
      }

      return _num;
    },
    encodeUtf8: function (text) {
      let code = encodeURIComponent(text);
      const bytes = [];
      for (let i = 0; i < code.length; i++) {
        let c = code.charAt(i);
        if (c === '%') {
          let hex = code.charAt(i + 1) + code.charAt(i + 2);
          let hexVal = parseInt(hex, 16);
          bytes.push(hexVal);
          i += 2;
        } else {
          bytes.push(c.charCodeAt(0));
        }
      }
      return bytes;
    },
    decodeUtf8: function (bytes) {
      let encoded = "";
      for (let i = 0; i < bytes.length; i++) {
        encoded += '%' + bytes[i].toString(16);
      }
      return decodeURIComponent(encoded);
    }
  }
})(window);
