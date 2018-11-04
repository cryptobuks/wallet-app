<?php

session_start();

$_SESSION["uid"] = 2;
 
if(! $_SESSION["uid"]) 
{
    header("location: ./login.php");
}
 
$uid = $_SESSION["uid"];

$version = time();//"1.01";

?>
<!DOCTYPE html>
<html lang="en"> 
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
  <!-- 忽略页面中的数字识别为电话，忽略email识别 -->
  <meta name="format-detection" content="telphone=no, email=no">
  <!-- 禁止页面缓存 -->
  <meta http-equiv="Pragma" content="no-cache">
  <script src="./js/cookies.js"></script>
  <script>
  function redirect() {
    let token = hCookie.getCookie('tk');
    if(token === '' || token === undefined || token === null) {
       alert('检测到您的账号登录时间已过期,请您重新登录!');
       location.href = './html/login.html';
    }
  };
  redirect();
  </script>
  <title>骆驼钱包</title>
  <script src="js/flexible.js"></script>
  <script src="./js/vconsole.min.js"></script>
  <link rel="stylesheet" href="css/reset.css?v1">
  <link rel="stylesheet" href="css/index.css?v3">
  <link rel="stylesheet" href="css/footer.css">
  <link rel="stylesheet" href="css/login_shade.css?v1">
  <link rel="stylesheet" href="css/setting_shade.css">
  <link rel="stylesheet" href="./css/layer.css">
  <link rel="stylesheet" href="./css/guide_info.css">
  <!-- <script>
  let vConsole = new VConsole();
  </script> -->
</head>

<body>
<input class="info" type="hidden" value="<?php echo $uid;?>" />
  <div id="app">
    <!-- header -->
    <div class="header">
      <div class="header-top clearfix">
        <div class="header-pic">
          <img id="hd-pic" src="./images/header.jpg" alt="">
        </div>
        <p class="dialog-btn"></p>
      </div>
      <div class="total">
        <div>
          <p>
            <span>账户总资产</span>
          </p>
          <p class="clearfix">
            <span>￥</span>
            <span class="t_balance">0.00</span>
          </p>
        </div>
      </div>
    </div>
    <!-- main -->
    <div class="main">
      <div class="content">
        <!-- digital coin -->
        <div class="digital-coin">
          <p class="clearfix">
            <i></i>
            <span>数字资产</span>
          </p>
          <ul class="coin-info dgt-cn">
            <!-- <li>
              <div class="asset-info clearfix">
                <div class="info-left">
                  <i></i>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="info-right">
                  <b></b>
                  <i></i>
                  <span></span>
                </div>
              </div>
              <div class="subset-ads hide">
                  <ul class="ads-con">
                      <li>
                        <div class="ads-info clearfix">
                           <p class="ads-left">
                             <i></i><span>3218762309***443</span>
                           </p>
                           <p class="ads-right">
                             <span>0.8</span>
                             <span>/32000</span>
                           </p>
                        </div>
                      </li>
                  </ul>
              </div>
            </li> -->
          </ul>
        </div>
        <!-- legal coin -->
        <div class="legal-coin">
          <p class="clearfix">
            <i></i>
            <span>法币资产</span>
          </p>
          <ul class="clearfix leg-cn">
            <!-- <li v-for="(item,idx) in leg_coin" :key="idx">
              <div class="legal-info">
                <div>
                  <i></i>
                  <span>{{item.coin}}</span>
                  <span>{{item.num}}</span>
                  <span>/32000</span>
                </div>
              </div>
            </li> -->
          </ul>
        </div>
      </div>
    </div>
    <!-- footer -->
    <div class="footer"></div>
  </div>
  <!-- login shade -->
  <div class="login-shade hide clearfix">
    <div class="user-settings">
      <div>
        <div class="user-info clearfix">
          <p class="user-pic">
            <input type="file" id="file">           
            <img id="hd-img" src="./images/header.jpg">
          </p>
          <p class="user-name"><input class="user-opt-name" type="text" maxlength="10" disabled placeholder="未设置昵称"></p>
          <p class="user-opt"></p>
        </div>
      </div>
      <div class="oprate-list">
        <ul>
          <li>
            <div class="opt-item clearfix">
              <i></i>
              <span>修改密码</span>
            </div>
          </li>
          <li>
            <div class="opt-item clearfix">
              <i></i>
              <span class="logout">退出登录</span>
            </div>
          </li>
          <li>
            <div class="opt-item clearfix">
              <i></i>
              <span>清空缓存</span>
            </div>
          </li>
          <!-- <li>
            <div class="opt-item clearfix">
              <i></i>
              <span>在线客服</span>
            </div>
          </li> -->
        </ul>
      </div>
    </div>
    <div class="hide-core"></div>
  </div>
  <!-- setting shade-->
  <div class="setting-shade hide">
    <p class="set-title">
      <b>设置</b>
    </p>
    <div class="choose-lang">
      <p>
        <b>语言选择</b>
      </p>
      <ul class="lang-list clearfix">
        <li data-id="4">
          <div class="lang-item jp">
            <i></i>
            <b class="lang-k" data-txt="jp">日文</b>
          </div>
        </li>
        <li data-id="5">
          <div class="lang-item cnf">
            <i></i>
            <b class="lang-k" data-txt="cnf">繁体中文</b>
          </div>
        </li>
        <li data-id="1">
          <div class="lang-item en">
            <i></i>
            <b class="lang-k" data-txt="en">英文</b>
          </div>
        </li>
        <li data-id="3">
          <div class="lang-item cnj">
            <i></i>
            <b class="lang-k" data-txt="cnj">简体中文</b>
          </div>
        </li>
      </ul>
    </div>
    <div class="choose-coin">
      <p>
        <b>单位选择</b>
      </p>
      <ul class="coin-list clearfix">
        <li data-id="4">
          <div class="coin-item">
            <i></i>
            <b class="coin-k">人民币</b>
          </div>
        </li>
        <li data-id="2">
          <div class="coin-item">
            <i></i>
            <b class="coin-k">美元</b>
          </div>
        </li>
        <li data-id="12">
          <div class="coin-item">
            <i></i>
            <b class="coin-k">新台币</b>
          </div>
        </li>
        <li data-id="11">
          <div class="coin-item">
            <i></i>
            <b class="coin-k">港币</b>
          </div>
        </li>
        <li data-id="9">
          <div class="coin-item">
            <i></i>
            <b class="coin-k">日元</b>
          </div>
        </li>
        <li data-id="3">
          <div class="coin-item">
            <i></i>
            <b class="coin-k">欧元</b>
          </div>
        </li>
      </ul>
    </div>
    <div class="btn-next">
      <b class="ensure">确定</b>
      <p><i class="close"></i></p>
   </div>
  </div>
</body>
<script src="./js/jquery.min.js"></script>
<script src="./js/layer.js"></script>
<script src="./js/common.js?<?php echo $version; ?>"></script>
<script src="./js/sha1.js"></script>
<script src="./js/make_sign.js?<?php echo $version; ?>"></script>
<script src="./js/utils.js"></script>
<script src="./js/slider.js?<?php echo $version; ?>"></script>
<script src="./js/index.js?<?php echo $version; ?>"></script>
<script src="./js/upload_img.js"></script>
</html>
