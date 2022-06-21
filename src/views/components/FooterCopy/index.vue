<template>
  <!-- <div class="copy">&copy;2022版权所有归NFTCube</div> -->
  <div class="ctx">

    <div class="body">
      <div class="logo">
        <el-image class="img" fit="contain" :src="require('@/assets/images/foot-logo.png')" />
        <div class="link">
          <el-link type="info" style="color:#fff;">数字作品</el-link>
          <el-divider direction="vertical" />
          <el-link type="info" style="color:#fff;">文艺旅游</el-link>
          <el-divider direction="vertical" />
          <el-link type="info" style="color:#fff;">文创文博</el-link>
        </div>
      </div>
      <div class="content">
        <div>
          <h3>联系我们</h3>
          <span>nftcube@163.com</span>
        </div>
        <div>
          <h3>商务合作</h3>
          <span>wendingnts@163.com</span>
        </div>
        <div>
          <h3>关于我们</h3>
          <span>APP下载</span>
        </div>
      </div>
      <div class="qr">
        <el-image class="img" fit="contain" :src="require('@/assets/images/QR.jpg')" />
        <span>微信扫码关注公众号</span>
      </div>

    </div>
    <div class="foot">蜀ICP备2021024588号-1 | Copyright  2021-2025 The Project by cube All Reserved</div>
  </div>
</template>
<script>
export default {
  name: 'FooterCopy'
}
</script>

<style lang="scss" scoped>
.ctx{
  width: 100%;
  padding: 20px;
  background: #0E7AC3;
  color: #fff;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
  .foot{
    margin-top: 20px;
    width: 100%;
    text-align: center;
    line-height: 30px;
  }
  .body{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-content: center;
    height: 150px;
    .logo{
      width:230px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-content: center;
      .img{
        width: 230px;
      }
      .link{
        display: flex;
        justify-content: center;
        align-content: center;
      }
    }
    .content{
      width: 800px;
      display: flex;
      justify-content: space-between;
      align-content: center;
      div{
        width: 200px;
        text-align: center;
      }
    }
    .qr{
      padding: 0 30px;
      border-left:2px solid  #fff;

      width: 280px;
      .img{
        width: 260px;
        height: 150px;
      }
      span{
        display: block;
        width: 260px;
        text-align: center;
        border:1px
      }
    }
  }

}

</style>
