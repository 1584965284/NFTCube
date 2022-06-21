<template>
  <div class="app-container">
    <!-- 主体部分 -->
    <div id="main" class="flex-row flex-sb flex-vs" :style="{height:ctxHeight+'px'}">
      <div id="left">
        <!-- <div class="wdtp-100 hgt-40 font-20 font-wt-550">个人中心</div>  :default-openeds="['1','2','3','4','5']"-->
        <el-menu
          class="hgtp-100 txt-overflow-y font-color"
          :collapse="false"
          text-color="#A6A6A6"
          @select="handleSelect"
        >
          <!-- 个人中心 -->
          <el-menu-item index="1" style="border-bottom:1px solid #ccc;">
            <i class="el-icon-s-home" />
            <span slot="title" class="font-20 font-wt-500">个人中心</span>
          </el-menu-item>

          <!-- 我的作品 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-help" />
              <span>我的作品</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">我创作的</el-menu-item>
              <el-menu-item index="2-2">我拥有的</el-menu-item>
              <!-- <el-menu-item index="2-3">已售出</el-menu-item> -->
            </el-menu-item-group>
          </el-submenu>
          <!-- 我的钱包 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-finance" />
              <span>我的钱包</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">提现信息</el-menu-item>
              <el-menu-item v-if="false" index="3-2">银行卡绑定</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 个性化设置 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-tools" />
              <span>个性化设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">基本资料</el-menu-item>
              <el-menu-item index="4-2">账号安全</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 机构管理 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-cooperation" />
              <span>机构信息</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-if="userLevel=='3'" index="5-1">处理申请</el-menu-item>
              <el-menu-item index="5-2">我的机构</el-menu-item>
              <el-menu-item v-if="userLevel=='3'" index="5-3">查看抽成记录</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-message-solid" />
              <span>消息管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="6-1">我的消息</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
      <div id="right">
        <component :is="currentCompt" :data="params" /></div>
    </div>

    <!-- 创建机构 -->
    <el-dialog
      title="创建机构"
      class="my-dialog"
      :visible.sync="dialogJG"
      width="500px"
      :close-on-click-modal="false"
      @opened="openBeforeDialog6"
      @close="colseBeforDialog6"
    >
      <div slot="title" class="dialog-tilte">
        创建机构
      </div>
      <el-form ref="dataForm6" :model="JGForm" :rules="JGRules" hide-required-asterisk label-position="top" label-width="120px">
        <el-form-item prop="name" label="描述">
          <el-input v-model="JGForm.name" maxlength="100" :placeholder="JGRules.name[0].message" />
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="JGForm.description" maxlength="400" type="textarea" :rows="3" :placeholder="JGRules.description[0].message" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="btn-common" style="background:#0E7AC3" @click="onCreateGroup"> 提 交</el-button>
        <el-button class="btn-common" style="background:#B0B0B0;" @click="dialogJG = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { createAgency } from '@/api/group'

import MyCompt from './components/MyCompt'
import ArtCompt1 from './components/ArtCompt1'
import ArtCompt2 from './components/ArtCompt2'
import ArtCompt3 from './components/ArtCompt3'
import PayWayCompt from './components/PayWayCompt'
import BankCardCompt from './components/BankCardCompt'
import UserInfoCompt from './components/UserInfoCompt'
import SecurityCompt from './components/SecurityCompt'
import UserInfoSetting from './components/UserInfoSetting'
import AgencyCompt from './components/AgencyCompt'
import MessageInfo from './components/MessageCompt'
import RateRecordCompt from './components/RateRecordCompt'

export default {
  name: 'MyCenter',
  components: {
    MyCompt,
    ArtCompt1,
    ArtCompt2,
    ArtCompt3,
    PayWayCompt,
    BankCardCompt,
    UserInfoCompt,
    SecurityCompt,
    UserInfoSetting,
    AgencyCompt,
    MessageInfo,
    RateRecordCompt
  },
  data() {
    return {
      actv: 0,
      ctxHeight: 560,
      currentCompt: 'MyCompt',
      params: {},

      JGForm: {
        name: '',
        description: ''
      },
      dialogJG: false,
      JGRules: {
        name: [{ required: true, message: `请输入机构名称`, trigger: 'blur' }],
        description: [{ required: true, message: `请输入机构描述`, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['account', 'userLevel', 'agency'])
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(val) {
        const { errCode, passed, message } = val
        if (errCode == '0') {
          if (passed == 'true') {
            this.$message.success(message)
          } else {
            this.$message.error(message)
          }
          this.$router.replace({ path: '/my', query: { active: 31 }})
        }
      }
    }
  },
  // watch: {
  //   $route(route) {
  //     const { active } = route.query
  //     if (active) { this.initData(active) }
  //   }
  // },
  created() {
    const { active } = this.$route.query
    if (active) { this.initData(String(active)) }
    window.onresize = () => {
      this.$nextTick(() => {
        const hgt = document.body.clientHeight
        this.ctxHeight = hgt
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      const hgt = document.body.clientHeight
      this.ctxHeight = hgt
    })
  },
  methods: {
    // 数据初始化
    initData(active) {
      if (active) {
        switch (active) {
          case '1':
            this.currentCompt = 'MyCompt'
            this.actv = '1'
            this.$router.replace({ path: `/my`, query: { active: '1' }})
            break
          case '21':
            this.currentCompt = 'ArtCompt1'
            this.actv = '2-1'
            break
          case '22':
            this.currentCompt = 'ArtCompt2'
            this.actv = '2-2'
            break
          case '23':
            this.currentCompt = 'ArtCompt3'
            this.actv = '2-3'
            break
          case '31':
            this.currentCompt = 'PayWayCompt'
            this.actv = '3-1'
            break
          case '32':
            this.currentCompt = 'BankCardCompt'
            this.actv = '3-2'
            break
          case '41':
            this.currentCompt = 'UserInfoCompt'
            this.actv = '4-1'
            break
          case '42':
            this.currentCompt = 'SecurityCompt'
            this.actv = '4-2'
            break
          case '51':
            this.currentCompt = 'UserInfoSetting'
            this.actv = '5-1'
            break
          case '52':
            this.currentCompt = 'AgencyCompt'
            this.actv = '5-2'
            break
          case '53':
            this.currentCompt = 'RateRecordCompt'
            this.actv = '5-3'
            break
          case '61':
            this.currentCompt = 'MessageInfo'
            this.actv = '6-1'
            break
        }
        console.log('currentCompt' + active, this.currentCompt)
      }
    },
    handleSelect(mainIndex, subIndex) {
      console.log('mainIndex', mainIndex)
      switch (mainIndex) {
        case '1':
          this.currentCompt = 'MyCompt'
          break
        case '2-1':
          this.currentCompt = 'ArtCompt1'
          break
        case '2-2':
          this.currentCompt = 'ArtCompt2'
          break
        case '2-3':
          this.currentCompt = 'ArtCompt3'
          break
        case '3-1':
          this.currentCompt = 'PayWayCompt'
          break
        case '3-2':
          this.currentCompt = 'BankCardCompt'
          break
        case '4-1':
          this.currentCompt = 'UserInfoCompt'
          break
        case '4-2':
          this.currentCompt = 'SecurityCompt'
          break
        case '5-1':
          this.currentCompt = 'UserInfoSetting'
          break
        case '5-2':
          if (this.agency) {
            if (this.userLevel == '2') {
              this.$router.push({ path: '/my/group', query: { name: this.agency }})
            } else {
              this.currentCompt = 'AgencyCompt'
            }
          } else {
            this.$confirm('您还没有机构，是否创建机构?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.dialogJG = true
            }).catch(() => {
            })
          }
          break
        case '5-3':
          this.currentCompt = 'RateRecordCompt'
          break
        case '6-1':
          this.currentCompt = 'MessageInfo'
          break
      }
    },
    // 是否创建机构
    async onCreateGroup() {
      const that = this
      const { description, name } = this.JGForm
      const valid = await this.$refs.dataForm6.validate().catch(_ => false)
      if (valid) {
        const { errCode, message } = await createAgency({ description, name }).catch(_ => {
          return { errCode: -1, message: '创建机构失败！' }
        })
        if (errCode === 0) {
          that.dialogFS = false
          that.$message.success(message)
        } else {
          that.$message.error(message)
        }
        return
      } else {
        this.$message.error('数据验证失败')
      }
    },
    openBeforeDialog6() {
      this.$refs.dataForm6.resetFields()
    },
    colseBeforDialog6() {
      this.$refs.dataForm6.clearValidate()
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
  color: #A6A6A6;
}
#main{
  width: 100%;
  padding: 0px;
  margin-top: 10px;
  #left{

    width: 207px;
    height: 100%;
    border:1px solid #ccc;
  }
  #right{
     width: calc(100% - 200px);
    height: 100%;
    border:1px solid #F0F8FF;
    margin-right: 10px;
  }
}
.font-color{
  color: #A6A6A6 !important;
}

.my-dialog,.my-dialog2{
  ::v-deep{
    .el-dialog__header{
      padding:10px 0px!important;
      font-size: 22px;
      font-weight: 800;
      border-bottom: 2px solid #ccc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-dialog__headerbtn{
        //top:0px !important;
        top:unset!important;
        right: 5px!important;
      }
      .el-dialog__headerbtn .el-dialog__close{
        font-size: 20px!important;
      }

    }
    .el-dialog{
      border-radius: 10px !important;
    }

  }
}
.dialog-tilte{
 padding: 0px 10px;
}
.btn-common{
  color: #fff;
  background: #0E7AC3;
  width: 120px;
  font-size: 16px;
  font-weight: 600;
  border-radius:10px ;
}
</style>

