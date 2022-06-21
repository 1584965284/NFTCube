<template>
  <div class="app-container">
    <el-card id="ctx">
      <div slot="header" class="head">
        <el-input
          v-model="keyWord"
          placeholder="搜索"
          prefix-icon="el-icon-search"
          style="margin-right:20px;"
          @keyup.enter="onSearch"
        />
        <el-select v-model="sortType" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <i class="el-icon-refresh" @click="onSearch" />
      </div>
      <div class="main" :style="{height:height+'px'}">
        <MyNftCard v-for="(item,index) in marketNFTs" :key="index" :data="item" @delNft="onDelNft" />
      </div>
    </el-card>
  </div>
</template>

<script>
import MyNftCard from '@/views/components/MyNftCard'
import { getNFTOwn } from '@/api/nft'
export default {
  name: 'Market',
  components: {
    MyNftCard
  },
  data() {
    return {
      keyWord: '',
      height: 200,
      marketNFTs: [
        {
          name: 'ttttt',
          url_cos: require('@/assets/test/nft08.jpg'),
          autor: 'uuuu',
          description: 'jjjjjj'
        }
      ],
      sortType: 1,
      options: [{ value: 1, label: '最近上市' },
        { value: 2, label: '最近创建的' },
        { value: 3, label: '最近售出' },
        { value: 4, label: '价格（从最低到最高）' },
        { value: 5, label: '价格（从最高到最低）' },
        { value: 6, label: '最高成交价' }]
    }
  },
  created() {
    // this.init()
  },
  mounted() {
    this.$nextTick(() => {
      this.height = document.body.clientHeight - 200
    })
  },
  methods: {
    /**
     * 页面数据初始化加载
     */
    init() {
      const that = this
      getNFTOwn().then(res => {
        const { nfts } = res
        if (nfts) {
          that.marketNFTs = nfts
        } else {
          that.marketNFTs.length = []
        }
      }).catch(_ => {
        that.$message.error('数据加载失败!')
      })
    },
    /**
     * 搜索
     */
    onSearch() {
      const params = { labels: this.keyWord, name: this.keyWord, description: this.keyWord }
      const that = this
      getNFTOwn(params).then(res => {
        const { nfts } = res
        if (nfts) {
          that.marketNFTs = nfts
        } else {
          that.marketNFTs.length = []
        }
      }).catch(_ => {
        that.$message.error('数据加载失败!')
      })
    },
    onDelNft(tokenId) {
      this.marketNFTs = this.marketNFTs.map(e => e.tokenId !== tokenId)
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

#ctx{
  width: 100%;
  padding: 10px;
  margin: 10px 0px 0px 0px;
  height: 100%;
  .head{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    i{
      font-size: 20px;
      padding: 2px 5px 2px 10px;
      font-weight: 500;
      &:hover{
        cursor: pointer;
        color: #409EFF;
      }
    }
  }
  .main{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: flex-start;
    flex-direction: row;
    overflow-y: auto;
    padding-bottom: 10px;
  }
}
#ctx ::v-deep .el-card__body{
  padding: 0px !important;

}

</style>
