<template>
  <div class="app-container">
    <div id="main">
      <div class="left">
        <el-image v-if="ntfObj.s3" class="pd-10 wdtp-100 hgt-500" lazy :src="$httpHead+ntfObj.s3" fit="contain" />
      </div>
      <div class="right">

        <el-row>
          <el-col :span="12" class="font-26 font-wt-800 txt-ellipsis">
            {{ ntfObj.name }}
          </el-col>
          <el-col v-if="false" :span="12" class="flex-row flex-he flex-vc">
            <div class="link flex-column flex-hs flex-vc wdt-40 mgl-2">
              <svg-icon icon-class="copy" class="wdt-50 hgt-50" />
              <span v-clipboard:copy="buyUrl" v-clipboard:success="onCopy" v-clipboard:error="onError" class="font-12">复制</span>
            </div>
            <div class="link flex-column flex-hs flex-vc wdt-40 mgl-2">
              <svg-icon icon-class="qq" class="wdt-50 hgt-50" />
              <span class="font-12">QQ</span>
            </div>
            <div class="link flex-column flex-hs flex-vc wdt-40 mgl-2">
              <svg-icon icon-class="wx" class="wdt-50 hgt-50" />
              <span class="font-12">微信</span>
            </div>
            <div class="link flex-column flex-hs flex-vc wdt-40 mgl-2">
              <svg-icon icon-class="share" class="wdt-50 hgt-50" />
              <span class="font-12">分享</span>
            </div>
          </el-col>
        </el-row>

        <el-row class="mgt-50">
          <el-col :span="24">等级：{{ ntfObj.level|levelFilter }}</el-col>
          <el-col :span="24" class="mgt-20 txt-ellipsis">作者：{{ ntfObj.author }}</el-col>
        </el-row>

        <el-row class="mgt-40">
          <el-col :span="24" class="font-18 font-wt-540">认证信息</el-col>
          <el-col :span="24" style="border:1px solid #EDECED;border-radius: 5px;" class="pdlr-10 pdtb-20 mgt-8">
            <el-row>
              <el-col :span="8" class="txt-algin-l">合约地址</el-col>
              <el-col :span="16" class="txt-algin-r txt-ellipsis">{{ contractAddress }}</el-col>
            </el-row>
            <el-row class="mgt-10">
              <el-col :span="8" class="txt-algin-l">认证标识</el-col>
              <el-col :span="16" class="txt-algin-r">{{ ntfObj.tokenId }}</el-col>
            </el-row>
            <el-row class="mgt-10">
              <el-col :span="8" class="txt-algin-l">认证标准</el-col>
              <el-col :span="16" class="txt-algin-r">ERC-721</el-col>
            </el-row>
            <el-row class="mgt-10">
              <el-col :span="8" class="txt-algin-l">认证网络</el-col>
              <el-col :span="16" class="txt-algin-r">BSC</el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row class="mgt-40">
          <el-col :span="24" style="color:#0E7AC3" class="font-26 font-wt-530">
            <svg-icon icon-class="rmb4" />{{ ntfObj.price }}
          </el-col>
          <el-col v-show="isbuy==='yes'" :span="24" class="mgt-30">
            <el-button :loading="loading" type="primary" style="background:#0E7AC3;" class="font-24 font-wt-520 wdt-180" @click="onBuy">立即购买</el-button>
          </el-col>
        </el-row>

      </div>
    </div>
    <div id="footer">
      <el-row class="mgb-50">
        <el-col :span="24" class="pdlr-20 txt-ellipsis">
          {{ ntfObj.labels|labelsFilter }}
        </el-col>
      </el-row>
      <el-row class="font-18 font-wt-500">
        <el-col :span="12">
          作品说明
        </el-col>
        <el-col :span="12">
          创作者介绍
        </el-col>
      </el-row>
      <el-row class="mgt-20 font-14 font-wt-100">
        <el-col :span="12" class="txt-wrap txt-overflow-y hgt-100">
          {{ ntfObj.description }}
        </el-col>
        <el-col :span="12" class="txt-wrap txt-overflow-y hgt-100">
          {{ authorObj.description }}
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getANFT, getArtistInfo } from '@/api/market'
import { buyNFT } from '@/api/user'
import { getContractAddress } from '@/api/nft'
import { mapGetters } from 'vuex'
export default {
  name: 'BuyNft',
  components: {
  },
  filters: {},
  data() {
    return {
      ntfObj: {},
      tokenId: '',
      buyUrl: '',
      authorObj: {},
      isbuy: 'yes',
      loading: false,
      contractAddress: ''
    }
  },
  computed: {
    ...mapGetters(['name', 'account', 'isConnect'])
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(new_value, old_value) {
        const { tokenId } = new_value
        this.init(tokenId)
      }
    }
  },

  created() {
    const { tokenId, isbuy } = this.$route.query
    this.buyUrl = window.location.href
    this.isbuy = isbuy || 'yes'
    if (tokenId) {
      this.init(tokenId)
    } else {
      this.$router.go(-1)
    }
  },
  mounted() {},
  methods: {

    init(tokenId) {
      const that = this
      if (tokenId) {
      // 获取NFT详情
        getANFT({ tokenId }).then(res => {
          const { data, errCode, message } = res
          if (errCode !== 0) {
            this.$message.error(message)
            return
          }
          that.ntfObj = data.nft
          if (that.ntfObj.owner === that.account || !that.ntfObj.sold) {
            that.isbuy = 'no'
          }
          this.getArtist(that.ntfObj.owner)
        }).catch(err => {
          this.$message.error(err)
        })
        // 获取NFT合约地址
        getContractAddress().then(res => {
          const { data, errCode, message } = res
          if (errCode !== 0) {
            this.$message.error(message)
            return
          }
          this.contractAddress = data.address
        }).catch(err => {
          this.$message.error(err)
        })
      }
    },
    // 获取用户
    async getArtist(address) {
      const { errCode, data, message } = await getArtistInfo({ address }).catch(err => { return { errCode: -1, message: err } })
      if (errCode !== 0) {
        this.$message.error(message)
        return
      } else {
        this.authorObj = data
      }
    },

    /**
     * 购买nit
     */
    onBuy() {
      const that = this
      const { tokenId } = this.ntfObj
      this.loading = true

      this.$notify.info({
        title: '提醒',
        message: '正在调用智能合约，请等待...'
      })
      buyNFT({ tokenId }).then(res => {
        const { errCode, message } = res
        if (errCode !== 0) {
          that.$message.error(message)
          if (errCode === -1) {
            that.$router.push({ path: '/my' })
          }
        } else {
          that.$message.success('购买成功')
          this.loading = false
          that.$router.push({ path: '/my', query: { active: 22 }})
        }
      }).catch(_ => {
        that.$message.error('购买失败！')
        this.loading = false
      })
    },
    // 复制购买链接
    onCopy(e) {
      this.$message.success('链接复制成功过！')
    },
    onError(e) {
      this.$message.error('抱歉，复制失败！')
    },
    getAuthor(creater) {

    }

  }

}
</script>

<style lang="scss" scoped>

.app-container{
  color: #949494;
  width: 100%;
  padding:0px 0px 30px 0px;
  margin: 0;
  overflow: auto;
  font-family: Proxima Nova,sans-serif;
}

#main{
  width: 100%;
  padding: 10px 30px ;
  margin: 10px 0px 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .left{
    padding: 10px;
    width: 45%;
    background: rgb(245, 245, 245);
    box-shadow: 3px 3px 6px 3px #EBEBEB;
    border-radius: 3px;

  }
  .right{
    width: 50%;
    padding: 20px 30px;
    .link{
      &:hover{
        cursor: pointer;
        transform: scale(1.1);
      }
    }
  }
}
#footer{
  padding: 10px;
  width: 100%;
}

</style>
