<template>
  <div :style="{width:width,height:height}" class="ntf-container ">
    <div class="top flex-row flex-hs flex-vs pdlr-10 pdb-30 pdt-10" @click="onView('/my/intro')">
      <el-image class="header mgr-10 wdtp-40" fit="cover" lazy :src="artist.avatar" />
      <!-- <img v-lazy="artist.avatar+2" class="header mgr-10 wdtp-40" fit="cover"> -->
      <div class="flex-column flex-hc flex-vs hgtp-100 wdtp-60">
        <span class="wdtp-100 dispaly-block txt-ellipsis font-16 font-wt-800 ">{{ artist.username }}</span>
        <div class="wdtp-100 txt-overflow-h hgt-60 font-10 pdtb-6">
          {{ artist.description }}
        </div>
        <div class="flex-row flex-sb flex-vs wdtp-100">
          <span class="wdtp-100 dispaly-block txt-ellipsis font-10 pdtb-6" style="color:#999999;">{{ fansNum }}粉丝</span>
          <div v-if="isFous" class="focus" @click.stop="onFocus(0)">取消关注</div>
          <div v-else class="focus" @click.stop="onFocus(1)">关注</div>
        </div>

      </div>
    </div>
    <el-image v-if="false" class="main wdp-100 mgt-5" style="height:60%;" fit="fill" lazy :src="baseUrl+artist.avatar" />
    <el-row v-if="true" type="flex" justify="space-between" align="middle" style="color: #CECCCD;" class="pdlr-10">
      <el-col :span="12" class="txt-ellipsis txt-algin-l">{{ artist.work_num }}</el-col>
      <el-col :span="12" class="flex-row flex-he flex-vc">
        <svg-icon v-if="isAgree" icon-class="un-heart" class="agree" style="margin-right:2px;height:20px;width:20px" @click.stop="onAgree(0)" />
        <svg-icon v-else icon-class="heart-fill" class="agree" style="margin-right:2px;height:20px;width:20px" @click.stop="onAgree(1)" />
        <p class="font-10">{{ agreeNum }}</p>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { followUser, unfollowUser, likeUser, unlikeUser } from '@/api/user'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
  name: 'ArtistCard',
  props: {
    width: {
      type: String,
      default: '336px'
    },
    height: {
      type: String,
      default: '180px'
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      artist: {},
      baseUrl: '',
      isAgree: false,
      isFous: false,
      agreeNum: 0,
      fansNum: 0
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  watch: {
    // data: {
    //   handler(val) {
    //     this.init(val)
    //   },
    //   deep: true
    // }
  },
  created() {
    this.init(this.data)
    this.baseUrl = process.env.VUE_APP_DAOMAIN
  },
  methods: {

    init(data) {
      if (!data) {
        return
      }
      this.artist = data
      const { isLike, isFollow, likeMe, fansNum, avatar } = data
      this.isAgree = !!isLike
      this.isFous = !!isFollow
      this.agreeNum = likeMe
      this.fansNum = fansNum
      if (avatar) {
        this.artist.avatar = (this.$baseUrl + avatar).trim()
      } else {
        this.artist['avatar'] = require('@/assets/images/logo2.jpg')
      }
    },
    // 关注
    onFocus(type) {
      const { address } = this.artist
      const that = this
      if (!getToken()) {
        this.$message.warning('请先链接钱包')
        return
      }
      if (address === this.account) {
        this.$message.warning('不能自己关注自己哟~')
        return
      }

      if (type === 1) {
        followUser({ toAddress: address }).then(res => {
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
        unfollowUser({ toAddress: address }).then(res => {
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
    },
    // 点赞
    onAgree(type) {
      const { address } = this.artist
      const that = this
      if (!getToken()) {
        this.$message.warning('请先链接钱包')
        return
      }
      if (address === this.account) {
        this.$message.warning('不能自己给自己点赞哟~')
        return
      }

      if (type === 1) {
        likeUser({ toAddress: address }).then(res => {
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
        unlikeUser({ toAddress: address }).then(res => {
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
    onView(path) {
      const { address } = this.artist
      this.$router.push({ path: path, query: { address }})
      this.$store.dispatch('app/toggleMenue', 2)
    }
  }
}
</script>

<style lang="scss" scoped>
.ntf-container{
  border: 1px solid #ebebed;
  border-radius: 8px;
  margin: 10px 10px;
  padding: 2px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover{
    box-shadow: 0 0.1px 0.3px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 20%);
    border: 1px solid #409EFF;
    cursor: default;
  }
}
.top{
  background-color: #F2F2F2;
  &:hover{
    cursor: pointer;
  }

}
.header{
  width: 80px;
  height: 80px;
  //box-shadow: 0px 0px 1px 2px #BEBEBE;
  border-radius: 50%;

}
.main{
  &:hover{
    cursor: pointer;
  }
}
.focus{
  padding: 3px 10px;
  text-align: center;
  font-size: 12px;
  background-color: #169BD5;
  color: #fff;
  min-width: 80px;
  border-radius: 50px;
  &:hover{
    cursor: pointer;
    transform: scale(1.1);
  }
}

.agree{
   &:hover{
    cursor: pointer;
    transform: scale(1.1);
  }
}

</style>
