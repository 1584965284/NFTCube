<template>
  <div :style="{width:width,height:height}" class="ntf-container ">
    <div class="top flex-row flex-hs flex-vs pdlr-10 pdb-30 pdt-10" style=" position: relative;" @click="onView('/my/group')">
      <el-image class="header mgr-10 wdtp-40" fit="cover" :src="artist.avatar" />
      <div class="flex-column flex-hc flex-vs hgtp-100 wdtp-60">
        <span class="wdtp-100 dispaly-block txt-ellipsis font-16 font-wt-800 ">{{ artist.name }}</span>
        <div class="wdtp-100 txt-overflow-h hgt-60 font-10 pdtb-6">
          {{ artist.description }}
        </div>
      </div>
      <div class="pst-join">
        <i class="el-icon-circle-plus-outline zoom-act" title="加入机构" style="color:#ccc;font-size:30px;" @click.stop="onJoinGroup" />
      </div>
    </div>
  </div>
</template>

<script>

import { joinAgency } from '@/api/user'
export default {
  name: 'ArtistCard',
  props: {
    width: {
      type: String,
      default: '336px'
    },
    height: {
      type: String,
      default: '126px'
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      artist: {},
      baseUrl: ''
    }
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
      this.artist = data
      if (this.artist?.avatar) {
        this.artist.avatar = (this.$baseUrl + this.artist.avatar).trim()
      } else {
        this.artist['avatar'] = require('@/assets/images/logo2.jpg')
      }
    },
    onView(path) {
      const { name } = this.artist
      this.$router.push({ path: path, query: { name }})
      this.$store.dispatch('app/toggleMenue', 2)
    },
    onJoinGroup() {
      const { name, description } = this.artist
      this.$confirm('是否加入该机构?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        joinAgency({ name, description }).then(res => {
          const { errCode, message } = res
          if (errCode !== 0) {
            this.$message.error(message)
          } else {
            this.$message.success(message)
          }
        })
      }).catch(() => {
      })
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
.pst-join{
  position: absolute;
  right: 10px;
  bottom: 10px;
}

</style>
