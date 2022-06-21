<template>
  <div class="app-container">
    <el-row id="main" type="flex" justify="start" align="top" :style="{height:ctxHeight+'px'}">
      <!-- 左边菜单 -->
      <el-col id="layout-left" :span="isCollapse?4:0">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="热门分类" name="1" :style="{'max-height':ctxHeight-290+'px'}">
            <template slot="title">
              <svg-icon icon-class="hot" class-name="tag-icon pdr-3" />热门分类
            </template>
            <div class="flex-wrap hgt-400 txt-overflow-y">
              <el-tag
                v-for="tag in tags"
                :key="tag.name"
                :type="tag.type"
                class="wdt-100 mg-5 my-tag txt-ellipsis"
                @click="onSelected(tag)"
              >
                {{ tag.name }}
              </el-tag>
            </div>
          </el-collapse-item>
          <el-collapse-item title="价格区间" name="2">
            <template slot="title">
              <svg-icon icon-class="rmb" class-name="tag-icon  pdr-3" />价格区间
            </template>
            <el-row type="flex" justify="center" :gutter="10">
              <el-col :span="8">
                <el-input v-model="minPrice" maxlength="9" @blur="onChagePrice(1)" />
              </el-col>
              <el-col :span="1" class="flex-row flex-hvc">
                —
              </el-col>
              <el-col :span="8">
                <el-input v-model="maxPrice" maxlength="9" @blur="onChagePrice(2)" />
              </el-col>
            </el-row>
            <el-row type="flex" justify="center">
              <el-col :span="20">
                <el-slider
                  v-if="false"
                  v-model="priceRange"
                  range
                  show-stops
                  :min="Number(minPrice)"
                  :max="Number(maxPrice)"
                  @change="priceChange"
                />
              </el-col>
            </el-row>

          </el-collapse-item>
          <el-collapse-item title="市场等级" name="3">
            <template slot="title">
              <svg-icon icon-class="rank" class-name="tag-icon pdr-3" />市场等级
            </template>
            <div class="flex-row flex-sb flex-vc flex-wrap">
              <el-tag type="info" class="my-tag" @click="onRank(1)">I级</el-tag>
              <el-tag type="info" class="my-tag" @click="onRank(2)">II级</el-tag>
              <el-tag type="info" class="my-tag" @click="onRank(3)">III级</el-tag>
            </div>

          </el-collapse-item>
        </el-collapse>
      </el-col>
      <!-- 展开折叠开关 -->
      <div id="layout-collapse" class="flex-column flex-hvc wdt-20 mgr-10">
        <i v-if="isCollapse" class="el-icon-d-arrow-left my-collaps" @click="handleOpen" />
        <i v-else class="el-icon-d-arrow-right my-collaps" @click="handleOpen" />
      </div>
      <!-- 右边内容区 -->
      <el-col id="layout-right" :span="isCollapse?20:24">
        <el-card class="box-card">
          <div slot="header" class="head">
            <div class="flex-row flex-hs flex-wrap flex-vc wdt-800">
              <el-tag
                v-for="tag in seletTags"
                :key="tag.name"
                :type="tag.type"
                class="wdt-100 mg-5 txt-ellipsis"
                closable
                @close="onClosed(tag)"
              >
                {{ tag.name }}
              </el-tag>
            </div>
            <div>
              <el-select v-model="sortType" placeholder="请选择" @change="handleChange">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <i class="el-icon-refresh" @click.stop="onFresh" />
            </div>
          </div>
          <div class="main" :style="{height:ctxHeight-120+'px'}">
            <NftCard v-for="(item,index) in marketNFTs" :key="index" :data="item" />
          </div>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import NftCard from '@/views/components/NftCard'
import { getNFTs, getLabel } from '@/api/market'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'Market',
  components: {
    NftCard
  },
  data() {
    return {
      isCollapse: true,
      selectChain: true,
      ethTags: [],
      marketNFTs: [],
      keyword: '',
      activeNames: ['1', '2', '3', '4'],
      priceRange: [0, 0],
      maxPrice: '',
      minPrice: '',
      showSlider: false,
      sortType: undefined,
      options: [{ value: undefined, label: '排序方式' },
        { value: 'priceAsc', label: '价格升序' },
        { value: 'priceDesc', label: '价格降序' },
        { value: 'time', label: '按时间排序' }],
      tags: [],
      seletTags: [],
      ctxHeight: 560,
      creater: ''
    }
  },
  computed: {
    ...mapGetters(['account', 'userLevel'])
  },
  created() {
    const { address } = this.$route.query
    this.creater = address
    this.init()
    // 获取热门标签
    getLabel({ address: '' }).then(res => {
      const { data, errCode, message } = res
      if (errCode === 0) {
        const { label } = data
        this.tags = label.map((e, i) => {
          return { id: i + 1, name: e.name, address: e.address, type: 'info' }
        })
        console.log('标签', data)
      } else {
        this.$message.error(message)
      }
    }).catch(err => {
      this.$message.error(err)
    })
  },
  mounted() {
    this.$nextTick(() => {
      const hgt = document.body.clientHeight
      this.ctxHeight = hgt
    })
  },
  methods: {
    // 价格筛选
    priceChange() {
      const [minPrice, maxPrice] = this.priceRange
      this.minPrice = minPrice
      this.maxPrice = maxPrice
      this.getData()
    },
    // 排序方式
    handleChange() {
      this.init(
        this.seletTags.filter(e => e.id > -1).map(e => e.name),
        this.seletTags.filter(e => e.id === -1).map(e => {
          if (e.name === 'I级') {
            return 1
          } else if (e.name === 'II级') {
            return 2
          } else {
            return 3
          }
        })[0]
      )
    },
    // 数据初始化
    init(labels = [], level) {
      const that = this
      // 艺术作品 , price: this.priceRange
      const creater = this.creater
      // 'HotTravel' 'ArtProduct'

      getNFTs({ status: { sold: true, labels: [this.creater ? '' : 'ArtProduct', ...labels], level, creater }, minPrice: this.minPrice, maxPrice: this.maxPrice, sort: this.sortType }).then(res => {
        const { data, errCode, message } = res
        if (errCode === 0) {
          const { nfts } = data
          that.marketNFTs = nfts
          console.log('市场艺术品', that.marketNFTs)
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    onFresh() {
      this.init()
    },
    // 选择tag
    onSelected(tag) {
      const obj = this.seletTags.filter(e => e.id === tag.id)[0]
      if (!obj) {
        this.seletTags.push(tag)
      } else {
        obj.name = tag.name
      }
      this.getData()
    },
    // 删除tag
    onClosed(tag) {
      this.seletTags = this.seletTags.filter(e => e.id !== tag.id)
      this.getData()
    },
    // 获取数据公共方法
    getData() {
      this.init(
        this.seletTags.filter(e => e.id > -1).map(e => e.name),
        this.seletTags.filter(e => e.id === -1).map(e => {
          if (e.name === 'I级') {
            return 1
          } else if (e.name === 'II级') {
            return 2
          } else {
            return 3
          }
        })[0]
      )
    },
    // 等级筛选
    onRank(index) {
      if (index === 1) {
        this.priceRange = [0, 100]
        this.maxPrice = 100
        this.minPrice = 0
        this.onSelected({ id: -1, name: 'I级', type: 'info' })
        this.showSlider = true
      } else if (index === 2) {
        this.priceRange = [101, 1000]
        this.maxPrice = 1000
        this.minPrice = 101
        this.onSelected({ id: -1, name: 'II级', type: 'info' })
        this.showSlider = true
      } else if (index === 3) {
        // this.$message.warning('暂未开通')
        this.maxPrice = ''
        this.minPrice = ''
        this.showSlider = false
        this.onSelected({ id: -1, name: 'III级', type: 'info' })
      }
    },
    onChagePrice(type) {
      const regex = new RegExp('-[0-9]+(\\.[0-9]+)?|[0-9]+(\\.[0-9]+)?')
      if (type === 1) {
        console.log(regex.test(this.minPrice), 1)
        if (!regex.test(this.minPrice)) {
          this.minPrice = ''
          this.$message.error('请输入数值！')
        }
      } else if (type === 2) {
        console.log(regex.test(this.maxPrice), 2)
        if (!regex.test(this.maxPrice)) {
          this.maxPrice = ''
          this.$message.error('请输入数值！')
        }
      }
      this.getData()
    },
    // 菜单展开折叠
    handleOpen() {
      this.isCollapse = !this.isCollapse
    }

  }

}
</script>

<style lang="scss" scoped>
.my-collaps{
  &:hover{
    cursor: pointer;
    color:#409EFF;
  }
}
.tag-icon{
  width: 20px;
  height: 20px;
}
.my-tag{
  &:hover{
    cursor: pointer;
  }
}
.list-item{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:flex-start;
}
.app-container{
  width: 100%;
  padding:0px;
  margin: 0;
  overflow: auto;
  font-family: Proxima Nova,sans-serif;
}
#main{
  width: 100%;
  padding: 0px;
  margin: 0px;
  // border:1px solid green;
}
#layout-left,#layout-collapse{
  min-height: 560px;
 // margin-right: 20px;
}
#layout-right{
  min-height: 560px;
  .head{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
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
    align-content:flex-start;
    flex-direction: row;
    overflow-y: auto;
  }
}
.box-card{
  height: 100%;
}
</style>
