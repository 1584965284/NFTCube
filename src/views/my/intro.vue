<template>
  <div class="app-container flex-column flex-sb flex-vc">
    <!-- 主体部分 -->
    <div class="flex-column flex-hvc top hgt-400">
      <div class="flex-column flex-hvc head-part">
        <el-image v-if="userInfo.avatar" class="header" fit="cover" :src="userInfo.avatar" />
        <img v-if="!userInfo.verified" src="@/assets/images/verified.png" class="verified">
      </div>
      <h3 v-if="userInfo.agency">机构: {{ userInfo.agency }}</h3>
      <div class="wdt-200 mgt-20">
        <p class="wdtp-100 txt-ellipsis txt-algin-c dispaly-block font-20 mgt-5">{{ userInfo.username }}</p>
        <p v-if="false" class="wdtp-100 txt-ellipsis txt-algin-c dispaly-block font-25">XXX签名</p>
      </div>
      <div class="wdt-200 flex-row flex-sb flex-vc pdb-20">
        <span class="flex-row flex-hs flex-vc zoom-act"><svg-icon :icon-class="isFous?'foucs':'u1330'" class="pdr-5" style="width:30px;height:30px;" @click="isFous?onFous(0):onFous(1)" />{{ fansNum }}</span>
        <span class="flex-row flex-hs flex-vc zoom-act"><svg-icon :icon-class="isAgree?'un-heart':'u1331'" class="pdr-5" style="width:30px;height:30px;" @click="isAgree?onAgree(0):onAgree(1)" />{{ agreeNum }}</span>
      </div>
    </div>

    <div class="wdtp-100 mgt-40 pd-20  flex-column felx-hs flex-vc mgb-20" style="border:1px solid #ccc;">

      <div class="hgt-180 wdtp-100 flex-column felx-hs flex-vc">
        <div class="wrap">
          <div>个人介绍</div>
        </div>
        <div class="mgt-50 wdtp-100 hgtp-80 txt-overflow-y pd-20" style="border:1px dashed #ccc;">
          {{ userInfo.description }}

        </div>
      </div>
      <div class=" wdtp-100 flex-column felx-hs flex-vc mgt-30">
        <div class="wrap">
          <div>个人作品</div>
        </div>
        <div class="mgt-50 wdtp-100 hgt-550 txt-overflow-y pd-20 flex-row flex-wrap flex-hs" style="border:1px dashed #ccc;min-height:400px;">
          <NftCard v-for="(item,index) in myNFTs" :key="index" :data="item" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import NftCard from '@/views/components/NftCard'
import { getArtistInfo, getNFTs } from '@/api/market'
import { getFansNum, getFollowNum } from '@/api/user'
import { followUser, unfollowUser, likeUser, unlikeUser, queryIsAgreeAndIsFllow } from '@/api/user'
import { getToken } from '@/utils/auth'

export default {
  name: 'Intro',
  components: {
    NftCard
  },
  data() {
    return {
      baseUrl: '',
      userInfo: {},
      agreeNum: 0,
      fansNum: 0,
      myNFTs: [],
      address: '',
      isAgree: false,
      isFous: false

    }
  },
  computed: {
    ...mapGetters(['avatar', 'name', 'account', 'isConnect', 'introduce', 'isBind', 'loginState'])
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(new_value, old_value) {
        const { address } = new_value
        this.init(address)
      }
    }
  },
  created() {
    this.baseUrl = process.env.VUE_APP_DAOMAIN
    const { address } = this.$route.query
    if (address) {
      // this.init(address)
    } else {
      this.$router.go(-1)
    }
  },
  methods: {
    async init(address) {
      if (!address) {
        return
      }
      this.address = address
      const { data, errCode, message } = await getArtistInfo({ address }).catch(e => { return { errCode: -1, message: e } })
      console.log(data)
      if (errCode !== 0) {
        this.$message.error(message)
      } else {
        this.userInfo = data
        if (this.userInfo?.avatar) {
          this.userInfo.avatar = this.$baseUrl + this.userInfo.avatar
        } else {
          this.userInfo['avatar'] = require('@/assets/images/logo3.jpg')
        }
      }
      const that = this
      // 获取粉丝数量 获取关注数量
      getFansNum({ toAddress: address }).then(res => {
        const { data, errCode, message } = res
        if (errCode === 0) {
          that.fansNum = data.fansNum
          that.agreeNum = data.likeNum
        } else {
          that.$message.error(message)
        }
      })
      // 获取关注数量
      // getFollowNum().then(res => {
      //   const { data, errCode, message } = res
      //   if (errCode === 0) {
      //     that.agreeNum = data.followNum
      //   } else {
      //     that.$$message.error(message)
      //   }
      // })
      // 获取自己的NFT sold: true,
      getNFTs({ status: { creater: address }, minPrice: '', maxPrice: '' }).then(res => {
        const { data, errCode, message } = res
        if (errCode === 0) {
          const { nfts } = data
          that.myNFTs = nfts.sort((a, b) => {
            return a.sold - b.sold
          })
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.$message.error(err)
      })

      // 获取是否关注或点赞
      queryIsAgreeAndIsFllow({ toAddress: address }).then(res => {
        const { data, errCode, message } = res
        if (errCode === 0) {
          const { isLike, isFollow } = data
          that.isAgree = isLike ? 1 : 0
          that.isFous = isFollow ? 1 : 0
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 点赞 1点赞 0取消点赞
    onAgree(type) {
      if (!getToken()) {
        this.$message.warning('请先链接钱包')
        return
      }
      if (this.address === this.account) {
        this.$message.warning('不能自己给自己点赞哟~')
        return
      }
      const that = this
      if (type === 1) {
        likeUser({ toAddress: this.address }).then(res => {
          const { errCode, message } = res
          if (errCode === 0) {
            that.isAgree = true
            that.agreeNum += 1
            that.$message.success('点赞成功！')
          } else {
            that.$message.error(message)
          }
        })
      } else {
        unlikeUser({ toAddress: this.address }).then(res => {
          const { errCode, message } = res
          if (errCode === 0) {
            that.isAgree = false
            that.agreeNum -= 1
            that.$message.success('取消点赞成功！')
          } else {
            that.$message.error(message)
          }
        })
      }
    },
    // 关注 1关注 0取消关注
    onFous(type) {
      if (!getToken()) {
        this.$message.warning('请先链接钱包')
        return
      }
      if (this.address === this.account) {
        this.$message.warning('不能自己关注自己哟~')
        return
      }
      const that = this
      if (type === 1) {
        followUser({ toAddress: this.address }).then(res => {
          const { errCode, message } = res
          if (errCode === 0) {
            that.isFous = true
            that.fansNum += 1
            that.$message.success('关注成功！')
          } else {
            that.$message.error(message)
          }
        })
      } else {
        unfollowUser({ toAddress: this.address }).then(res => {
          const { errCode, message } = res
          if (errCode === 0) {
            that.isFous = false
            that.fansNum -= 1
            that.$message.success('取消关注成功！')
          } else {
            that.$message.error(message)
          }
        })
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.app-container{
  width: 100%;
  padding:2px;
  margin: 0;
  overflow: auto;
  font-family: Proxima Nova,sans-serif;
}
.top{
  width: 100%;
  background-image: url('~@/assets/images/bg_intro.png');
  // background-attachment: fixed;
  background-repeat: no-repeat;
  background-size:100% 100%;

}
.header{
  width: 110px;
  height: 110px;
  border-radius: 50%;
}

.wrap {
    position: absolute;
    text-align: center;
    width: 400px;
    font-size: 19;
    font-weight: 550;
  }
  .wrap div {
    line-height: 20px;
  }
  /*CSS伪类用法*/
  .wrap div:after, .wrap div:before {
    position: absolute;
    top: 50%;
    background: #ddd;
    content: "";
    height: 1px;
    width: 45%;
  }
  /*调整背景横线的左右距离*/
  .wrap div:before {
      left: -40px;
  }
  .wrap div:after {
      right: -40px;
  }
.head-part{
position: relative;
}
.verified{
    border-radius: 50%;
    padding: 0;
    position: absolute;
    bottom:-5px;
    left: 70px;
    height: 35px;
  }
</style>
