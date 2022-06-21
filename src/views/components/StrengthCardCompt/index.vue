<template>
  <div class="ctx">
    <div class="title">
      <h4>一站式交易服务</h4>
      <h4>艺术品版权保护及溯源</h4>
      <h4>文旅文博再焕新春</h4>
      <h4>更大的包容性</h4>
    </div>
    <div class="serial">
      <h1>01</h1>
      <h1>02</h1>
      <h1>03</h1>
      <h1>04</h1>
    </div>
    <div class="desc">
      <span>CUBE是多品类的数字作品综合交易平台，通过集中流量，为商品带来更多曝光。无论用户想购买或者浏览作品，都能在CUBE上满足相关的业务需求。</span>
      <span>通过区块链技术解决了数字艺术品的版权保护及溯源问题，区块链技术保证了真实的数字资产的传递，保证了艺术品流通的传承有序，更好地展示作品的价值。</span>
      <span>运用区块链技术能够建立旅游市场信任机制，保护游客的信息安全，节约游客成本，推动旅游行业信息化发展。</span>
      <span>平台具有更大的包容性及独创性，支持各类创作者自由创作，且涵盖了音乐、绘画、数码艺术品、门票等多种形式的NFT交易，为客户打造出多元化的线上交易体验。</span>

    </div>
    <div class="icon">
      <svg-icon icon-class="u57" class-name="item-icon" />
      <svg-icon icon-class="u58" class-name="item-icon" />
      <svg-icon icon-class="u59" class-name="item-icon" />
      <svg-icon icon-class="u60" class-name="item-icon" />

    </div>

  </div>
</template>

<script>
export default {
  name: 'StrengthCardCompt',
  props: {
    index: {
      type: Number,
      default: 0
    },
    height: {
      type: String,
      default: '250px'
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      imgSrc: [
        require('@/assets/images/card-first.png'),
        require('@/assets/images/card-middle.png'),
        require('@/assets/images/card-last.png')
      ]

    }
  },
  methods: {
    // 前一组
    onPrevItem() {

    },
    // 后一组
    onNextItem() {

    }

  }
}
</script>

<style lang="scss" scoped>
.ctx{
  padding: 5px 10px;
  background-image: url("~@/assets/images/strengths-bg.png");
  background-size: 100% 100%;;
  background-repeat:no-repeat;
  width: 1274px;
  height: 583px;
  color: #98A0A4;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  justify-items: center;

}
.title{
  position: relative;
  top: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  justify-items: flex-start;

  h4{
    width: 310px;
    text-align: center;
  }

}
.serial{
  position: relative;
  top: 90px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  justify-items: flex-start;
  color: #fff;
  h1{
    width: 310px;
    font-size: 60px;
    text-align: center;
  }
}

.desc{
  position: relative;
  top: 125px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  justify-items: flex-start;

  span{
    display: block;
    width: 280px;
    padding: 0 10px;
    text-align: center;
  }
}
.icon{
  position: relative;
  top: 150px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  justify-items: flex-start;
  .item-icon{
     width: 280px;
     height: 33px;
  }
}

.bg-1{
  background-image: url("~@/assets/images/card-first.png");
}
.bg-2{
  background-image: url("~@/assets/images/card-middle.png");
}
.bg-3{
  background-image: url("~@/assets/images/card-last.png");
}

</style>>

