<template>
  <div class="app-container" :style="{width:width,height:height}">
    <div class="wdtp-100 box-border pd-10">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>我的作品</el-breadcrumb-item>
        <el-breadcrumb-item>已售出</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

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
      <div class="main">
        <MyNftCard v-for="(item,index) in marketNFTs" :key="index" :data="item" @delNft="onDelNft" />
      </div>
    </el-card>
  </div>
</template>

<script>
import MyNftCard from '@/views/components/MyNftCard'
export default {
  name: 'ArtCompt3',
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
      marketNFTs: [
        {
          name: 'ttttt',
          url_cos: require('@/assets/test/nft08.jpg'),
          autor: 'uuuu',
          description: 'jjjjjj'
        },
        {
          name: 'ttttt',
          url_cos: require('@/assets/test/nft08.jpg'),
          autor: 'uuuu',
          description: 'jjjjjj'
        },
        {
          name: 'ttttt',
          url_cos: require('@/assets/test/nft08.jpg'),
          autor: 'uuuu',
          description: 'jjjjjj'
        },
        {
          name: 'ttttt',
          url_cos: require('@/assets/test/nft08.jpg'),
          autor: 'uuuu',
          description: 'jjjjjj'
        },
        {
          name: 'ttttt',
          url_cos: require('@/assets/test/nft08.jpg'),
          autor: 'uuuu',
          description: 'jjjjjj'
        },
        {
          name: 'ttttt',
          url_cos: require('@/assets/test/nft08.jpg'),
          autor: 'uuuu',
          description: 'jjjjjj'
        },
        {
          name: 'ttttt',
          url_cos: require('@/assets/test/nft08.jpg'),
          autor: 'uuuu',
          description: 'jjjjjj'
        },
        {
          name: 'ttttt',
          url_cos: require('@/assets/test/nft08.jpg'),
          autor: 'uuuu',
          description: 'jjjjjj'
        },
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
  }

}
</script>

<style lang="scss" scoped>
#ctx{
  width: 100%;
  padding: 10px;
  margin: 0px 0px 0px 0px;
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
