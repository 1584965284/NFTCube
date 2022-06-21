<template>
  <div class="ctx" :style="{width:width,height:height}">
    <div id="main">
      <svg t="1646448071266" class="icon common-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13368" width="64" height="64" @click="onPrevItem"><path d="M765.952 124.928l0 81.92 0 129.024 0 156.672 0 159.744q0 76.8 0.512 141.312t0.512 100.352q0 24.576-11.776 40.96t-29.696 22.016-39.424 0-39.936-24.064q-37.888-38.912-81.92-81.408t-90.624-85.504-94.208-86.016-91.648-82.944q-19.456-17.408-29.184-43.008t-8.704-53.248 11.776-54.272 32.256-45.056q39.936-34.816 79.36-70.144t80.896-72.704 87.04-78.336 96.768-87.04q22.528-20.48 45.568-27.136t41.472-2.048 29.696 20.48 11.264 40.448z" p-id="13369" fill="#007AFF" /></svg>
      <div id="content">
        <div v-for="(item,index) in lstData" :key="'nft'+index" class="nft-item" @click="onBuy(item.tokenId)">
          <el-image class="nft-image" fit="fill" :src="'https://'+item.s3" />
          <span class="txt-ellipsis dispaly-block wdtp-100 font-20">{{ item.name }}</span>
          <span class="txt-ellipsis dispaly-block wdtp-100 txt-algin-l">{{ item.author }}</span>
        </div>
      </div>
      <svg t="1646448162564" class="icon common-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15056" width="64" height="64" @click="onNextItem"><path d="M385.536 102.4l398.848 364.544c12.288 10.752 19.456 26.624 19.456 43.008s-7.168 32.256-19.456 43.008l-398.848 364.544c-18.944 17.92-46.08 23.552-70.656 14.336s-40.96-31.232-43.52-57.344V145.408c2.048-26.112 18.944-48.128 43.52-57.344 24.064-9.216 51.712-3.584 70.656 14.336z" fill="#007AFF" p-id="15057" /></svg>
    </div>
    <ul class="dots">
      <li v-for="index in dotSize" :key="'dot'+index" :class="{'dotted':index==currentIndex}" @click="onDotted(index)" />
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SwiperCompt',
  props: {
    width: {
      type: String,
      default: '1200px'
    },
    height: {
      type: String,
      default: '280px'
    },
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      soruceData: [],
      lstData: [],
      dotSize: 1,
      pageSize: 5,
      currentIndex: 1
    }
  },
  watch: {
    list: {
      handler(lst) {
        if (lst) {
          this.soruceData = lst
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  },

  created() {
    this.soruceData = this.list
    this.init()
  },
  methods: {
    init() {
      this.currentIndex = 1
      if (this.soruceData.length) {
        if (this.soruceData.length >= this.pageSize) {
          this.lstData = this.soruceData.slice(0, this.pageSize)
          this.dotSize = Math.ceil(this.soruceData.length / this.pageSize)
        } else {
          this.lstData = this.soruceData
          this.dotSize = 1
        }
      } else {
        this.lstData = []
        this.dotSize = 0
      }
    },

    // 前一组
    onPrevItem() {
      if (this.dotSize === 1 || this.currentIndex === 1) {
        return
      }
      const previndex = this.currentIndex - 1
      if (previndex === 1) {
        this.lstData = this.soruceData.slice(0, this.pageSize)
      } else {
        this.lstData = this.soruceData.slice(this.pageSize * (previndex - 1), this.pageSize * previndex)
      }
      --this.currentIndex
    },
    // 后一组
    onNextItem() {
      if (this.dotSize === 1 || this.currentIndex === this.dotSize) {
        return
      }
      const nextindex = this.currentIndex + 1
      if (nextindex === this.dotSize) {
        this.lstData = this.soruceData.slice(this.pageSize * (nextindex - 1), this.soruceData.length)
      } else {
        this.lstData = this.soruceData.slice(this.pageSize * (nextindex - 1), this.pageSize * nextindex)
      }
      ++this.currentIndex
    },
    onBuy(tokenId) {
      this.$router.push({ path: `/buy?tokenId=${tokenId}` })
    },
    onDotted(index) {
      if (this.dotSize === 1) {
        return
      }
      this.currentIndex = index
      if (this.currentIndex === 1) {
        this.lstData = this.soruceData.slice(0, this.pageSize)
      } else if (this.currentIndex === this.dotSize) {
        this.lstData = this.soruceData.slice(this.pageSize * (this.currentIndex - 1), this.soruceData.length)
      } else {
        this.lstData = this.soruceData.slice(this.pageSize * (this.currentIndex - 1), this.pageSize * this.currentIndex)
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.ctx{
  padding: 5px 10px;
}
#main{
  display: flex;
  justify-content: space-between;
  align-items: center;
  #content{
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .nft-item{
    width: 210px;
    height: 250px;
    background: #fff;
    margin: 0px 15px;
    border-radius: 12px;
    padding: 2px;
    border: 1px solid #ccc;
    &:hover{
      border: 1px solid #007AFF;
      cursor: pointer;
    }
    span{
      text-align: center;
      display: block;
    }
  }
  .nft-image{
    width: 100%;
    height: 180px;

  }
}

.dots{
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  li{
    display: inline;
    margin: 2px 10px;
    background: #E0E0E0;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    box-shadow: 0px 0px 8px #007AFF;
    &:hover{
      cursor: pointer;
      transform: scale(1.2);
    }
  }
  .dotted{
    background: #007AFF;
  }

}
.common-svg{
  &:hover{
    cursor: pointer;
    transform: scale(1.5);
  }
}
</style>>

