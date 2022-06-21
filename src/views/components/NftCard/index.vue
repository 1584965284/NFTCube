<template>
  <div :style="{width:width,height:height}" class="ntf-container" @click="onBuy(ntfObj)">
    <el-image v-if="ntfObj.s3" class="header" fit="cover" lazy :src="$httpHead+ntfObj.s3" />
    <div v-show="false" class="logo">
      <div class="agree pd-3 font-12">
        <svg-icon icon-class="heart" style="margin-right:2px" />{{ 0 }}
      </div>
    </div>
    <div class="footer flex-column flex-sb">
      <el-row>
        <el-col :span="24" class="txt-ellipsis font-20 pdtb-3">{{ ntfObj.name }}</el-col>
      </el-row>
      <el-row type="flex" justify="space-between" align="middle" class="mgt-10">
        <el-col :span="8" class="txt-ellipsis nft-lbl">艺术家</el-col>
        <el-col :span="16" class="txt-ellipsis wdtp-100 txt-algin-r">
          <svg-icon icon-class="user-filling" class-name="wdt-30 hgt-30" style="width:18px;height:18px" />
          <span class="mgl-5 wdtp-80 txt-ellipsis" @click.stop="onview(ntfObj.autor_id)">{{ ntfObj.author }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between" align="middle" class="mgt-10">
        <el-col :span="8" class="txt-ellipsis nft-lbl">价值</el-col>
        <el-col :span="16" class="nft-price txt-algin-r">
          <svg-icon icon-class="rmb2" />
          {{ ntfObj.price }}
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
export default {
  name: 'NftCard',
  props: {
    width: {
      type: String,
      default: '206px'
    },
    height: {
      type: String,
      default: '245px'
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ntfObj: {}
    }
  },
  watch: {
    data: {
      handler(val) {
        this.ntfObj = val
      },
      deep: true
    }
  },
  created() {
    this.ntfObj = this.data
  },
  methods: {
    // openNft(nft) {
    //   window.open(nft.url_cos, 'target', '')
    // },
    onBuy({ tokenId }) {
      this.$router.push({ path: '/buy', query: { tokenId }})
    },
    onview({ tokenId }) {
      this.$router.push({ path: '/my/intro', query: { tokenId }})
    }
  }
}
</script>

<style lang="scss" scoped>
.ntf-container{
  border: 1px solid #ebebed;
  border-radius: 8px;
  margin: 10px 10px;
  padding: 2px;
  position: relative;
  &:hover{
    cursor: pointer;
    box-shadow: 0 0.1px 0.3px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 20%);
    border: 1px solid #409EFF;
  }
}
.nft-title{
  font-size: 20px;
  font-weight: 600;
}
.nft-lbl{
  color: #ccc;
}
.nft-price{
  color: #ff9900;
}
.header{
  width:100%;
  // height:148px;
  height: 60%;
  display: flex;
  justify-content: center;
  background: #EBEEF5;
}
.logo{
  position: absolute;
  right: 8px;
  top: 8px;
  height: 24px;

}
.agree{
  background: #6c6a82;
  opacity: 0.8;
  border-radius:2px;
  color: #fff;
}
.footer{
    height: 40%;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: #6c6a82;
    background: #fff;
    padding: 9px 12px;
}

</style>
