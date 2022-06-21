<template>
  <!-- <div class="copy">&copy;2022版权所有归NFTCube</div> -->
  <div class="ctx">

    <div class="body">
      <div v-if="false" class="logo">
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
          <h3>合作伙伴</h3>
          <span>汶鼎网络</span>
        </div>
      </div>
      <div class="flex-row flex-sb">
        <div class="qr">
          <h3 class="txt-algin-c">专属社群</h3>
          <el-image class="img" style="height:100px" fit="contain" :src="require('@/assets/images/qq.png')" />
        </div>
        <div style="border-left:2px solid  #fff;height:150px;width:1px" />
        <div class="qr">
          <el-image class="img" fit="contain" :src="require('@/assets/images/QR.jpg')" />
          <span>微信扫码关注公众号</span>
        </div>
      </div>

    </div>
    <div class="foot">
      <el-image style="height:80px;" fit="contain" :src="require('@/assets/images/CUBE.png')" />
      <span><a href="https://beian.miit.gov.cn/" target="_blank">鲁ICP备2022011859号</a> | Copyright  2022-2025 The Project by cube All Reserved</span>
    </div>
    <div v-if="false" class="foot"><a href="https://beian.miit.gov.cn/">鲁ICP备2022011859号</a> | Copyright  2022-2025 The Project by cube All Reserved</div>
  </div>
</template>
<script>
export default {
  name: 'Footbar'
}
</script>

<style lang="scss" scoped>
.ctx{
  width: 100%;
  padding: 20px;
  background: #006E7B;
  color: #fff;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
  font-family: 'HappyZcool-2016';
  .foot{
    margin-top: 20px;
    width: 100%;
    text-align: center;
    line-height: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
  }
  .body{
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    height: 100px;
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
      width: 1000px;
      display: flex;
      justify-content: space-between;
      align-content: center;
      div{
        width: 200px;
        text-align: center;
      }
      span{
        &:hover{
          cursor: pointer;
          font-size: 18px;
        }
      }
    }
    .qr{
      height: 150px;
      width: 260px;
      .img{
        width: 260px;
        height: 150px;
      }
      span{
        display: block;
        width: 260px;
        text-align: center;
        border:1px;
      }
    }
  }

}
</style>
