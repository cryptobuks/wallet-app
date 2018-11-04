$(function () {
    const upload_img = {
        init() {
            this.uploadImg();
        },
        uploadImg() {
            let _self = this;
            $('#file').change(function (e) {
                let file;
                let files = e.target.files;
                if (files !== null && files.length > 0) {
                    // file = URL.createObjectURL(files[0]);
                    //upload to server
                    let up_file = files[0];
                    _self.upFile(up_file);
                }
            })
        },
        upFile(file) { // upload to server
            let _self = this;
            let f_size = file.size; 
            if(f_size < 3*1024*1024 ) {
                layer.loading();
                let formData = new FormData();
                let camel_data = JSON.stringify(signData()) ;
                formData.append('img_avatar', file);
                formData.append('camel_data',camel_data);
                $.ajax({
                    type: 'post',
                    url: api + '/v1/users/avatar',
                    data: formData,
                    cache: false,
                    processData: false, // 不处理数据
                    contentType: false,
                    success: function (data) {
                        if(data && data.url.length>0) {
                            $('#hd-pic').attr('src',data.url);
                            $('#hd-img').attr('src',data.url);  
                            setTimeout(() => {
                                layer.closeLoading();
                            }, 500);  
                        }
                    }
                })
            }else {
                layer.open({
                   content:'上传图片尺寸超出限制!',
                   time:1.5
                });
            }
            
        },
        dataURLtoBlob(dataurl) { // 将base64格式图片转换为文件形式
            let arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = window.atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            console.log(arr);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {
                type: mime
            })
        }
    };
    upload_img.init();
})