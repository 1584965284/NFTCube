<template>
  <div class="app-container flex-row flex-hc flex-vs">
    <!-- <el-row type="flex" justify="center" align="middle" class="mgt-10" :style="{height:ctxHeight+'px'}"></el-row> -->
    <div id="main" class="flex-row flex-wrap flex-hs txt-overflow-y">
      <GropuCard v-for="(item,index) in grouptLst" :key="index" width="260px" :style="{'margin-left':parseInt(Math.random() * 150)+'px','margin-right':parseInt(Math.random() * 100)+'px'}" :data="item" />
    </div>
  </div>
</template>

<script>
import GropuCard from '@/views/components/GropuCard'
import { getAgencies } from '@/api/group'
export default {
  name: 'Market',
  components: {
    GropuCard
  },
  data() {
    return {
      grouptLst: [],
      ctxHeight: 560
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      this.ctxHeight = document.body.clientHeight
    })
  },
  methods: {
    handleChange() {

    },
    // 数据初始化
    init() {
      const that = this
      getAgencies().then(res => {
        const { data, errCode, message } = res
        if (errCode !== 0) {
          this.$message.error(message)
        } else {
          const { res } = data
          that.grouptLst = res
        }
      })
    }

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
  width: 1480px;
  padding: 10px 30px;
  margin: 10px;

  // border:1px solid green;
}
</style>
