<template>
  <div class="app-container" :style="{height:height+'px'}">
    <el-tabs id="main" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="活动" name="first">
        <span style="color:#ccc;">没有活动</span>
      </el-tab-pane>
      <el-tab-pane label="我的交易" name="second">
        <span style="color:#ccc;">暂无交易</span>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
export default {
  name: 'Account',
  components: {
  },
  data() {
    return {
      activeName: 'first',
      height: 600
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.height = document.body.clientHeight
    })
  },
  methods: {
    handleClick() {}
  }

}
</script>

<style lang="scss" scoped>
.app-container{
  width: 100%;
  padding:0px;
  margin: 0;
  overflow: auto;
  font-family: Proxima Nova,sans-serif;
}
#main{
  width: 100%;
  padding: 0px 30px;
  // border:1px solid green;
}
</style>
