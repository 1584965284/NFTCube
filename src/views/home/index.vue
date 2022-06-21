<template>
  <div class="app-container">
    <!-- 头部 -->
    <!-- <Nav /> -->
    <!-- banner背景图 -->
    <div id="banner">
      <el-carousel indicator-position="outside" arrow="never" :interval="5000" autoplay class="my-carousel">
        <el-carousel-item v-for="imgSrc in imgsBg" :key="imgSrc">
          <el-image fit="fill" :src="imgSrc" style="width:100%;height:100%" />
        </el-carousel-item>
      </el-carousel>
      <div v-if="false" class="banner-txt">区块链，全NFT，一个平台</div>
      <div class="banner-btn-container">
        <div v-if="true" class="banner-btn">
          <el-button type="primary" size="medium" class="btn-comon" style="background:#fff;color:#000;" @click.stop="onView('/create')">立即创作</el-button>
          <el-button type="primary" size="medium" class="btn-comon" style="background:#000;color:#fff;" @click.stop="onView('/market')">市场探索</el-button>
        </div>
      </div>
    </div>

    <!-- 艺术作品 -->

    <el-row v-if="false" type="flex" justify="center" align="middle">
      <div class="nft-section">
        <el-row style="margin-bottom: 20px;">
          <el-col :span="24" class="nft-title">
            <div class="title">艺术作品</div>
          </el-col>
          <el-col :span="23" class="nft-more">
            <span @click="onView('/market/art')">查看更多 <i class="el-icon-right" /></span>
          </el-col>
        </el-row>
        <!-- <SwiperCompt width="100%" :list="marketNFTs" /> -->
        <SwiperCompt width="100%" :list="artNFTs" />
      </div>
    </el-row>

    <el-row type="flex" justify="center" align="middle">
      <div class="art-list" style="height:680px">
        <el-carousel indicator-position="outside" arrow="always" :interval="5000" :loop="false" autoplay class="wdt-700 art-item">
          <el-carousel-item v-for="(item,index) in artNFTs" :key="index">
            <el-image :src="`${$httpHead}${item.s3}`" fit="contain" style="width:100%;height:100%" @click="onBuy(item)" /></el-carousel-item>
        </el-carousel>
        <el-image class="layout-1 hgt-80" fit="contain" :src="require('@/assets/images/CUBE.png')" />
        <el-image class="layout-2 hgt-80" fit="contain" :src="require('@/assets/images/art-2.png')" />
        <div class="layout-3 banner-btn">
          <el-button type="primary" size="medium" class="btn-comon2" style="background:#fff;color:#000;" @click.stop="onView('/market')">立即探索</el-button>
          <el-button type="primary" size="medium" class="btn-comon2" style="background:#000;color:#fff;" @click.stop="onView('/create')">立即创作</el-button>
        </div>
        <el-image class="layout-4 hgt-80" fit="contain" :src="require('@/assets/images/art-4.png')" />
        <el-image class="layout-5 hgt-100" fit="contain" :src="require('@/assets/images/art-5.png')" />
        <el-image class="layout-6 hgt-60" fit="contain" :src="require('@/assets/images/art-6.png')" />
        <el-image class="layout-7 hgt-60" fit="contain" :src="require('@/assets/images/art-7.png')" />

      </div>
    </el-row>
    <!-- 热门文旅 -->
    <el-row v-if="false" type="flex" justify="center" align="middle" style="margin-top: 30px;">
      <div class="nft-section">
        <el-row style="margin-bottom: 20px;">
          <el-col :span="24" class="nft-title">
            <div class="title">热门文旅</div>
          </el-col>
          <el-col :span="23" class="nft-more">
            <span @click="onView('/market/travel')">查看更多 <i class="el-icon-right" /></span>
          </el-col>
        </el-row>
        <SwiperCompt width="100%" :list="travelNFTs" />
      </div>
    </el-row>

    <!-- 优质创作者 -->
    <el-row type="flex" justify="center" align="middle" style="margin-top: 30px;">
      <div class="nft-section">
        <el-row style="margin-bottom: 20px;">
          <el-col :span="24" class="nft-title">
            <div class="title">优质创作者</div>
          </el-col>
          <el-col :span="23" class="nft-more">
            <span @click="onView('/hall')">查看更多 <i class="el-icon-right" /></span>
          </el-col>
        </el-row>
        <SwiperCircleCompt width="100%" :list="artistLst" />
      </div>
    </el-row>
    <el-row type="flex" justify="center" align="middle" style="margin-top:80px;">
      <div v-if="false" style="width:80%">
        <el-divider />
      </div>
    </el-row>
    <!-- 平台介绍 -->
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="24" class="nft-title">
        <div class="title">平台介绍</div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" align="middle" style="margin-top:30px;">
      <div id="intro">
        <div class="left">
          <el-image class="img" fit="contain" :src="require('@/assets/images/CUBE.png')" />
        </div>
        <div class="right">
          数字立方（CUBE）是首家主打文化旅游的多功能、多元化的数字作品交易服务平台，为个人创作者、文艺组织机构、实体产品品牌、文旅文创文博等提供数字作品的创作与交易服务，赋能数字作品，扩大产业影响力。
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="center" align="middle" class="mgb-50">
      <div id="intro">
        <div class="right">
          打造国内领先的数字作品交易平台，树立行业标杆，创造全新的交易模式和商业模式，开创数字作品交易领域的先河。
          打造为用户服务的元宇宙，用户数据半开放，赋予作品现实价值，引领用户进入社会生活、社交娱乐、社会工作的新纪元。
        </div>
        <div class="left">
          <el-image class="img" fit="contain" :src="require('@/assets/images/intro.gif')" />
        </div>
      </div>
    </el-row>

    <!-- 优势介绍 -->
    <el-row v-if="false" type="flex" justify="center" align="middle" style="margin-top:30px">
      <div id="strengths">
        <div class="title">CUBE平台优势</div>
        <div class="ctx">
          <StrengthCardCompt />
        </div>
      </div>
    </el-row>

    <!-- 底部介绍 -->
    <!-- <div id="footer">
      <FooterCopy />
    </div> -->

  </div>
</template>

<script>

import SwiperCompt from '@/views/components/SwiperCompt'
import SwiperCircleCompt from '@/views/components/SwiperCircleCompt'
import StrengthCardCompt from '@/views/components/StrengthCardCompt'
import { getNFTs, getAritists } from '@/api/market'
export default {
  name: 'Home',
  components: {
    SwiperCompt,
    StrengthCardCompt,
    SwiperCircleCompt
  },
  data() {
    return {
      imgsBg: [
        require('@/assets/images/post01.jpg'),
        require('@/assets/images/post02.jpg'),
        require('@/assets/images/post03.jpg'),
        require('@/assets/images/post04.jpg')
      ],
      artNFTs: [],
      travelNFTs: [],
      artistLst: []
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    onBuy({ tokenId }) {
      this.$router.push({ path: '/buy', query: { tokenId }})
    },
    init() {
      const that = this
      // 艺术作品
      getNFTs({ status: { sold: true, labels: ['ArtProduct'] }, minPrice: '', maxPrice: '', num: 30 }).then(res => {
        const { data, errCode, message } = res
        if (errCode === 0) {
          const { nfts } = data
          that.artNFTs = nfts
          console.log('艺术品', that.artNFTs)
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
      // 热门文旅
      getNFTs({ status: { sold: true, labels: ['HotTravel'] }, minPrice: '', maxPrice: '', num: 30 }).then(res => {
        const { data, errCode, message } = res
        if (errCode === 0) {
          const { nfts } = data
          that.travelNFTs = nfts
          console.log('热门文旅艺术品', that.travelNFTs)
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
      // 获取艺术家
      getAritists({ num: 30 }).then(res => {
        const { data, errCode, message } = res
        if (errCode === 0) {
          const { aritists } = data
          that.artistLst = aritists
          console.log('艺术家', that.artistLst)
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    onView(path) {
      this.$router.push({ path: path })
    }
  }

}
</script>

<style lang="scss" scoped>
.art-list{
  width: 95%;
  height: 400px;
  position: relative;

}
.art-item::v-deep .el-carousel__container{
  height: 450px !important;
}
.layout-1{
  position: absolute;
  right: 50px;
  top:0px;
}
.layout-2{
  position: absolute;
  right: 10px;
  top:120px;

}
.layout-3{
  position: absolute;
  right: 180px;
  top:250px;
}
.layout-4{
  position: absolute;
  left: 50px;
  bottom:100px;
}
.layout-5{
  position: absolute;
  left: 500px;
  bottom:90px;
}
.layout-6{
  position: absolute;
  left: 10px;
  bottom:10px;
}
.layout-7{
  position: absolute;
  right: 10px;
  bottom:10px;
}
.btn-comon2{
  width: 150px;
  letter-spacing:3px;
  height: 40px;
  border-radius: 30px;
  font-weight: bold;
  border: 1px solid #000;
}

.title{
    width: 550px;
    height: 50px;
    border-radius: 100px;
    font-size: 25px;
    text-align: center;
    line-height: 50px;
    font-weight: 900px;
    background: #5CDBD3;
    color: #fff;
    box-shadow: 5px 5px 4px #99E0F1;
  }
.btn-comon{
  width: 150px;
  letter-spacing:3px;
  height: 40px;
  border-radius: 30px;
  font-weight: bold;
  border: unset;
}
.app-container{
  padding:0px;
  margin: 0;
  overflow: auto;
  font-family: Proxima Nova,sans-serif;
  // background-image: url("~@/assets/images/bg.png");
}
#banner{
  position: relative;
  width: 100%;
  height: 700px;
  .banner-txt{
    width: 100%;
    position: absolute;
    top: 30%;
    text-align:center;
    color: #fff;
    font-size: 3.28em;
    font-weight: 700;
    z-index: 1999;
  }
  .banner-btn-container{
    display: flex;
    justify-content: center;
    align-items: center;
    .banner-btn{
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    width: 50%;
    top: 500px;
    z-index: 1999;
  }
  }

}

.nft-title{
  display: flex;
  justify-content: center;
  align-items: center;
  .img{
    width:  50px;
    height: 50px;
    margin: 0px 10px;
  }
}
.nft-more{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  span{
    font-size: 18px;
    font-weight: 500px;
    text-align:right;
    cursor: pointer;
    &:hover{
      color: #1571fa;
    }
  }

}
.nft-section{
  width: 90%;
  background: #fff;
  border-radius: 15px;
  padding: 10px 10px 20px 10px;
  color: #959595;
}

#intro{
  width: 90%;
  border-radius: 15px;
  background: #fff;
  height: 300px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .left{
    width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    .img{
      width: 300px;
    }
  }
  .right{
    padding: 30px 0px 0px 20px;
    line-height: 30px;
    width: 60%;
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    color: #959595;
    font-size: 25px;
    p{
      display: block;
      width: 90%;
      margin-bottom: 10px;
    }
  }
}

#strengths{
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #fff;
  border-radius: 15px;
  padding: 20px;
  .ctx{
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;

  }
}

.my-carousel-item{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  border-radius:3px ;

}
.nit-container{
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

.my-carousel ::v-deep .el-carousel__container{
  height: 680px !important;
}

.dsc-title{
  text-align:center;
  font-size: 28px;
  font-weight: 600;
  letter-spacing:0.5px;
  color: rgb(53, 56, 64);
}
.dsc-item{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img{
    width: 76px;
    height: 76px;
    margin: 10px;
  }
  span{
    color: rgb(53, 56, 64);
    font-size: 15.9px;
    font-weight: 600;
  }
  div{
     width: 50%;
     text-align: center;
     line-height: 24px;
     color: rgb(129, 143, 163);
  }
}
.market-info{
  font-size: 20px;
  font-weight: 600;
  line-height: 23px;
  color: rgb(46, 69, 105);
}

.market-card{
  background-size: cover;
  background-repeat: no-repeat;
  width: 170px;
  height: 170px;
  border-radius: 10px;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: #fff;
  text-align: center;
  h2{
    margin: 0px;
    display: block;
    width: 120px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap

  }
  h4{
    margin: 5px 0px;
    display: block;
    width: 150px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }

}
.el-divider--vertical{
    height: 60% !important;
    border: 2px !important;
}

#footer{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 100px;
  .community-item{
    line-height: 28px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
     align-items: center;
    img{
      width: 80px;
    }
    span{
      display: none;
      text-align: center;
      margin: 5px 0px;
    }
    p{
      color:#888;
      font-size: 14px;
    }
    button{
      width: 100px;
      height: 40px;
      font-size: 22px;
      color: #1571fa;
    }
  }
}
</style>
