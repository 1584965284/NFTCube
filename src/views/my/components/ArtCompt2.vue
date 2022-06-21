<template>
  <div class="app-container" :style="{width:width,height:height}">

    <div class="wdtp-100 box-border pd-10">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>我的作品</el-breadcrumb-item>
        <el-breadcrumb-item>我拥有的</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card id="ctx">
      <div slot="header" class="head">
        <el-input
          v-model="keyWord"
          placeholder="搜索"
          prefix-icon="el-icon-search"
          style="margin:0 20px;"
          @keyup.enter.native="onSearch"
        />
        <el-select v-model="visibleType" placeholder="请选择可见权限" class="mgr-20" @change="handleChange">
          <el-option
            v-for="item in $visibleOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="sortType" placeholder="请选择排序方式" @change="handleChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <i class="el-icon-refresh" @click="onSearch" />
      </div>
      <div class="main">
        <MyNftCard v-for="(item,index) in marketNFTs" :key="index" :data="item" @delNft="onDelNft" />
      </div>
    </el-card>
  </div>
</template>

<script>
import MyNftCard from '@/views/components/MyNftCard'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { getNFTs } from '@/api/user'
export default {
  name: 'ArtCompt2',
  components: {
    MyNftCard
  },
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
      keyWord: '',
      marketNFTs: [],
      sortType: undefined,
      visibleType: 2,
      options: [{ value: undefined, label: '排序方式' },
        { value: 'priceAsc', label: '价格升序' },
        { value: 'priceDesc', label: '价格降序' },
        { value: 'time', label: '按时间排序' }]
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  created() {
    this.onSearch()
  },
  methods: {
    handleChange() {
      this.onSearch()
    },
    // 搜索NFT
    onSearch() {
      const that = this
      getNFTs({ status: { owner: this.account, delete: this.visibleType }, minPrice: '', maxPrice: '', sort: this.sortType, name: this.keyWord }).then(res => {
        that.marketNFTs = []
        const { data, errCode, message } = res
        if (errCode !== 0) {
          that.$$message.error(message)
        } else {
          const { nfts } = data
          that.marketNFTs = nfts
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 删除NFT
    onDelNft(tokenId) {
      this.getNFTs()
    }
  }

}
</script>

<style lang="scss" scoped>
#ctx{
  width: 100%;
  margin: 0px 0px 0px 0px;
  height:calc(100% - 41px);
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
    height: 600px;
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
