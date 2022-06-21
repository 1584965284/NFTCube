<template>
  <div class="app-container flex-column flex-sb flex-vc">
    <!-- 主体部分 -->
    <div class="flex-column flex-hvc top hgt-400" :style="{backgroundImage: 'url('+`${group.background}`+')',backgroundSize:'cover'}">
      <el-image class="header" fit="cover" :src="`${group.avatar}`" />
      <div class="wdt-200 mgt-20">
        <p class="wdtp-100 txt-ellipsis txt-algin-c dispaly-block font-20 mgt-5">{{ group.name }}</p>
      </div>
      <div class="wdt-200 flex-row flex-sb flex-vc pdb-20">
        <span class="flex-row flex-hs flex-vc"><svg-icon icon-class="work" class="pdr-5" style="width:40px;height:40px;" />{{ group.workNum }}</span>
        <span class="flex-row flex-hs flex-vc"><svg-icon icon-class="u1330" class="pdr-5" style="width:30px;height:30px;" />{{ group.memNum }}</span>
      </div>
    </div>

    <div class="wdtp-100 mgt-40 pd-20  flex-column felx-hs flex-vc mgb-20" style="border:1px solid #ccc;">
      <div class="hgt-180 wdtp-100 flex-column felx-hs flex-vc">
        <div class="wrap">
          <div>机构介绍</div>
        </div>
        <div class="mgt-50 wdtp-100 hgtp-80 txt-overflow-y pd-20" style="border:1px dashed #ccc;">
          {{ group.description }}
        </div>
      </div>
      <div class=" wdtp-100 flex-column felx-hs flex-vc mgt-30">
        <div class="wrap">
          <div>艺术家</div>
        </div>
        <div class="mgt-50 wdtp-100 hgtp-80 txt-overflow-y pd-20 flex-row flex-wrap flex-hs" style="border:1px dashed #ccc;min-height:400px;">
          <ArtistCard v-for="(item,index) in artistLst" :key="index" width="260px" :data="item" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import ArtistCard from '@/views/components/ArtistCard'
import { getArtistInfo, getNFTs } from '@/api/market'
import { getAgencyInfo, getMembers } from '@/api/group'

export default {
  name: 'Group',
  components: {
    ArtistCard
  },
  data() {
    return {
      baseUrl: '',
      group: {},
      agreeNum: 0,
      fnasNum: 0,
      artistLst: [],
      address: ''

    }
  },
  computed: {
    ...mapGetters(['avatar', 'name', 'account', 'isConnect', 'introduce', 'isBind', 'loginState'])
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(new_value, old_value) {
        const { name } = new_value
        this.init(name)
      }
    }
  },
  created() {
    this.baseUrl = process.env.VUE_APP_DAOMAIN
    const { name } = this.$route.query
    if (name) {
      // this.init(name)
    } else {
      this.$router.go(-1)
    }
  },
  methods: {
    async init(name) {
      if (!name) {
        return
      }
      const { data, errCode, message } = await getAgencyInfo({ name }).catch(e => { return { errCode: -1, message: e } })
      if (errCode !== 0) {
        this.$$message.error(message)
      } else {
        this.group = data.res
        if (this.group?.background) {
          this.group.background = this.$baseUrl + this.group.background
        } else {
          this.group.background = require('@/assets/images/bg_intro.png')
        }

        if (this.group?.avatar) {
          this.group.avatar = this.$baseUrl + this.group.avatar
        } else {
          this.group.avatar = require('@/assets/images/logo2.jpg')
        }
      }
      const that = this
      // 获取自己的NFT
      getMembers({ name }).then(res => {
        const { data, errCode, message } = res
        if (errCode === 0) {
          const { res } = data
          that.artistLst = res
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    onAgree() {

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

</style>
