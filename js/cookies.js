(function(window){
    window.hCookie = {
        setCookie(name,value,expires) {
           let time = Date.now();
           let date = '';
           if(time > 0) {
              time = time + expires*24*60*60*1000  //expires is day
              date = new Date(time).toUTCString(); // UTC时间格式字符串
           }
           document.cookie = [
               name + '=' + value ,
               expires ? 'expires' + '=' + date :'' ,
               'path=/'
           ].join(';');
        },
        getCookie(name) {
           let cookies = document.cookie;
           let value = '';
           if(cookies.indexOf(name) < 0) {
             return null;
           }else {
             (cookies.split(';') || []).map((item) => {
                 let res = item.split('=');
                 if(res[0].replace(/\s*/g,'') === name) {
                    value = res[1];
                 }
             })
           }  
           return value;
        },
        removeCookie(name) {
          this.setCookie(name,'',-1);
        }
    }
})(window);

