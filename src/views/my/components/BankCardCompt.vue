<template>
  <div class="app-container" :style="{width:width,height:height}">
    <div class="wdtp-100 box-border pd-10">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>我的钱包</el-breadcrumb-item>
        <el-breadcrumb-item>银行卡绑定</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="ctx" class="flex-row flex-sb flex-vc pdtb-20 pdlr-8">
      <div class="wdt-200 flex-row flex-hs flex-vc wdtp-20">
        <el-image class="wdt-40 hgt-40 mgr-10" fit="contain" :src="require('@/assets/images/ylk.png')" />
        <span>银行卡</span>
      </div>
      <div class="flex-row flex-sb flex-vc wdtp-70">
        <p>暂无设置 或 姓名:小李</p>
        <p>身份证号:111111111111111</p>
        <p>开户行:工商银行</p>
        <p>银行卡号:22222222222222222</p>
      </div>
      <div class="wdtp-10 txt-algin-r bind" style="color:#0E7AC3">绑定</div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'BankCardCompt',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      keyWord: ''
    }
  }

}
</script>

<style lang="scss" scoped>
#ctx{
  width: 100%;
  border: 1px dashed #ccc;
}
.bind{
  &:hover{
    cursor: pointer;
    transform: scale(1.1);
    font-weight: 550;
  }
}
</style>
