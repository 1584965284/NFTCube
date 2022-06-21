<template>
  <div class="app-container flex-column flex-sb flex-vc" :style="{width:width,height:height}">
    <div class="flex-column flex-hvc top">
      <!-- <el-image class="header" fit="cover" :src="`${baseUrl}${avatar}`" /> -->
      <!-- <el-image class="header" fit="cover" :src="require('@/assets/images/logo2.jpg')" /> -->
      <div class="header">
        <el-upload
          ref="upload"
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-exceed="handleExceed"
          :auto-upload="true"
          :limit="1"
        >
          <img v-if="avatar" :src="`${baseUrl}${avatar}`" class="avatar">
        </el-upload>
        <img v-if="verified" src="@/assets/images/verified.png" class="verified">
      </div>

      <div class="wdt-400 mgt-20" style="color:#fff">
        <h3 v-if="agency" class="wdtp-100 txt-ellipsis txt-algin-c dispaly-block">机构：{{ agency }}</h3>
        <p class="wdtp-100 txt-ellipsis txt-algin-c dispaly-block font-20 mgt-5">{{ name }}</p>
        <p class="wdtp-100 hgt-80 txt-ellipsis  txt-overflow-h txt-algin-c dispaly-block font-25" :title="introduce">{{ introduce }}</p>
      </div>
    </div>
    <div class="wdtp-100 mgt-40 pdtb-10 hgtp-45" style="border:1px solid #ccc;">
      <el-row type="flex" class="wdtp-100 pdtb-20 pdlr-10" justify="space-between" align="middle" style="border-bottom:1px solid #ccc;">
        <el-col :span="12" class="font-20 font-wt-550">我的钱包</el-col>
        <el-col :span="12" class="flex-row flex-he flex-vc">
          <svg-icon v-if="isHidden" icon-class="eye-i" class="eye" style="margin-right:2px;height:20px;width:20px" @click="isHidden=false" />
          <svg-icon v-else icon-class="eye-o" class="eye" style=";height:20px;width:20px" @click="isHidden=true" />
        </el-col>
      </el-row>
      <el-row type="flex" justify="start" align="top">

        <div class="pd-30 flex-column flex-hs flex-vs">
          <span>账户余额(元)</span>
          <span class="mgt-20 font-wt-500 wdt-200">
            <svg-icon icon-class="rmb" style="margin-right:2px;height:20px;width:20px" />{{ isHidden?balanceHidden:balance }}
          </span>
          <el-button type="primary" style="background:#0E7AC3;" class="font-14 font-wt-550 wdt-100 mgt-20 hgt-36 zoom-act" @click="isBindAlipay?dialogVisible=true:$message.warning('请先绑定支付宝账号！')">提 现</el-button>
        </div>

        <div class="pd-30 flex-column flex-hs flex-vs mgl-10">
          <span>累计收益(元)</span>
          <span class="mgt-20 font-wt-500">
            <svg-icon icon-class="rmb" style="margin-right:2px;height:20px;width:20px" />{{ isHidden?incomeHidden:income }}
          </span>
          <el-button type="primary" style="background:#0E7AC3;" class="font-14 font-wt-550 wdt-100 mgt-20 hgt-36 zoom-act" @click="dialogVisible2=true">充 值</el-button>
        </div>

      </el-row>

    </div>

    <!-- 提现弹框 -->
    <el-dialog
      title="我的钱包——提现"
      class="my-dialog"
      :visible.sync="dialogVisible"
      width="500px"
      top="50px"
      :close-on-click-modal="false"
      @opened="openBeforeDialog"
      @closed="colseBeforDialog"
    >
      <div slot="title" class="dialog-tilte">
        我的钱包——提现
      </div>
      <div v-if="false" class="pd-10 flex-column flex-sb flex-vs hgt-100" style="border:1px dashed #ccc;">
        <span class="dispaly-block wdtp-100 txt-algin-l txt-ellipsis">银行卡账号：某某某</span>
        <span class="dispaly-block wdtp-100 txt-algin-l txt-ellipsis">开户行：工商银行</span>
        <span class="dispaly-block wdtp-100 txt-algin-l txt-ellipsis">银行卡：6656677676678768676</span>
      </div>
      <div class="pd-10 flex-column flex-sb flex-vs hgt-80" style="border:1px dashed #ccc;">
        <span class="dispaly-block wdtp-100 txt-algin-l txt-ellipsis">姓名：{{ alipayName }}</span>
        <span class="dispaly-block wdtp-100 txt-algin-l txt-ellipsis">支付宝账号：{{ alipayAddress }}</span>
      </div>

      <div class="pd-10 mgt-20" style="border:1px dashed #ccc;">
        <el-form ref="dataForm" :model="temp" :rules="rules" hide-required-asterisk label-position="top" label-width="120px">
          <el-form-item prop="money" label="提现金额">
            <svg-icon icon-class="rmb" class="font-20" />
            <el-input v-model="temp.money" class="wdtp-90" :placeholder="rules.money[0].message" />
          </el-form-item>

          <div v-if="temp.money" class="mgl-20 mgb-10">实际到账金额为{{ userLevel==3?(temp.money*0.85).toFixed(2):(temp.money*0.99).toFixed(2) }}元</div>

          <el-form-item prop="password" label="交易密码">
            <el-input v-model="temp.password" type="password" :placeholder="rules.password[0].message" />
          </el-form-item>
        </el-form>

        <el-row>
          <el-col :span="12">本次可提现{{ balance }}元</el-col>
          <el-col :span="12" class="txt-algin-r font-18 font-wt-550" style="color:#0E7AC3;"><p class="zoom-act mgr-10" @click="getAllMoney">全部提现</p></el-col>
        </el-row>
      </div>
      <div>
        <p style="line-height:22px;color:#ccc" class="font-14 font-wt-600">
          备注：提现服务费率为1%实际提现金额，24小时内到账
        </p>
      </div>

      <span slot="footer" class="dialog-footer flex-row flex-hvc">
        <el-button type="primary" class="btn-common" style="background:#0E7AC3" @click="onSubmit"> 提 现</el-button>
      </span>
    </el-dialog>

    <!-- 充值弹框 -->
    <el-dialog
      title="我的钱包——充值"
      class="my-dialog"
      :visible.sync="dialogVisible2"
      width="500px"
      :close-on-click-modal="false"
      @opened="openBeforeDialog"
      @closed="colseBeforDialog"
    >
      <div slot="title" class="dialog-tilte">
        我的钱包——充值
      </div>
      <div class="pd-10 mgt-20" style=" flex-row flex-hs flex-vc">
        <span class="wdt-20"> 金额：</span><el-input v-model.number="caharge" maxlength="9" class="wdtp-80" placeholder="请输入充值金额" />
      </div>
      <span slot="footer" class="dialog-footer flex-row flex-hvc">
        <el-button type="primary" class="btn-common" style="background:#0E7AC3" @click="onRecharge"> 确认充值</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { changeUserInfo, uploadHeader } from '@/api/user'
import { getBalance, withdraw, recharge, getProfit, getAlipay, getWithdrawInfo, alipayWithdraw } from '@/api/user'
export default {
  name: 'MyCompt',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      caharge: '',
      temp: {},
      rules: {
        money: [{ required: true, message: `请输入金额`, trigger: 'blur' }],
        password: [{ required: true, message: `请输入交易密码`, trigger: 'blur' }]

      },
      baseUrl: '',
      isHidden: false,
      balance: '0',
      income: '0',
      alipayName: '',
      alipayAddress: '',
      isBindAlipay: false
    }
  },
  computed: {
    ...mapGetters(['avatar', 'name', 'account', 'isConnect', 'introduce', 'verified', 'agency', 'userLevel']),
    balanceHidden() {
      let mark = ''
      for (const c of this.balance) {
        mark += '*'
      }
      return mark
    },
    incomeHidden() {
      let mark = ''
      for (const c of this.income) {
        mark += '*'
      }
      return mark
    }
  },
  created() {
    this.baseUrl = process.env.VUE_APP_DAOMAIN
    this.initData()
  },
  // activated() {
  //   this.initData()
  // },
  methods: {
    ...mapMutations({ setAvatar: 'user/SET_AVATAR' }),
    openBeforeDialog() {
      // this.$refs.dataForm.resetFields()
    },
    colseBeforDialog() {
      this.$refs.dataForm.clearValidate()
      this.$refs.dataForm.resetFields()
    },
    // 提现
    async onSubmit() {
      const valid = await this.$refs.dataForm.validate().catch(_ => false)
      if (valid) {
        const { money, password } = this.temp
        const address = this.account
        // const actulMoney = this.userLevel == 3 ? (money * 0.85).toFixed(2) : (money * 0.99).toFixed(2)

        const { errCode, data, message } = await alipayWithdraw({ address, paypass: password, money: money }).catch(_ => false)
        if (errCode !== 0) {
          this.$message.error(message)
          return
        }
        const { balance } = data
        this.balance = Number(balance)
        this.dialogVisible = false
      } else {
        this.$message.error('数据验证失败！')
      }
    },
    // 数据初始化
    initData() {
      getBalance().then(res => {
        const { errCode, data, message } = res
        if (errCode !== 0) {
          this.$message.error(message)
          return false
        }
        const { balance } = data
        this.balance = Number(balance).toFixed(2) + ''
      }).catch(err => {
        console.log('getBalance', err)
      })
      // 获取累计收益
      getProfit({ form: this.account }).then(res => {
        console.log('getProfit', res)
        const { errCode, data, message } = res
        if (errCode !== 0) {
          this.$message.error(message)
          return false
        } else {
          const { profit } = data
          this.income = profit + ''
        }
      }).catch(err => {
        console.log('getBalance', err)
      })
      // 获取提现信息
      getWithdrawInfo().then(res => {
        const { errCode, data, message } = res
        if (errCode !== 0) {
          this.$message.error(message)
        } else {
          const { alipay_name, alipay_address } = data
          if (alipay_address) {
            this.isBindAlipay = true
            this.alipayName = alipay_name
            this.alipayAddress = alipay_address
          }
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 全部提取
    getAllMoney() {
      this.$set(this.temp, 'money', this.balance)
    },
    // 确认充值
    onRecharge() {
      if (!this.caharge) {
        this.$message.warning('请输入充值金额!')
        return
      }
      if (this.caharge <= 0) {
        this.$message.warning('充值金额不能为小于或等于0!')
        return
      }
      getAlipay({ address: this.account, money: this.caharge }).then(res => {
        const { errCode, data, message } = res
        if (errCode !== 0) {
          this.$message.error(message)
        } else {
          this.dialogVisible2 = false
          const { alipayUrl } = data
          window.open(alipayUrl, '_blank')
        }
      }).catch(_ => {
        this.$message.error('充值失败！')
      })

      // recharge({ num: Number(this.caharge) }).then(res => {
      //   const { errCode, data, message } = res
      //   if (errCode !== 0) {
      //     this.$message.error(message)
      //   } else {
      //     const { balance } = data
      //     this.balance = Number(balance).toFixed(2) + ''
      //     this.$message.success('充值成功!')
      //     this.dialogVisible2 = false
      //     this.caharge = ''
      //   }
      // }).catch(_ => {
      //   this.$message.error('充值失败！')
      // })
    },
    handleAvatarSuccess(res, file) {
      console.log('handleAvatarSuccess', res, file)
      // this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      console.log('beforeAvatarUpload', file)
      const isJPG = ['image/jpeg', 'image/png'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/png 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      const that = this
      const formData = new FormData()
      formData.append('file', file)
      uploadHeader(formData).then(res => {
        const { errCode, message, data } = res
        if (errCode === 0) {
          const { url } = data
          that.setAvatar(url)
        } else {
          this.$message.error(message)
        }
        that.$refs.upload.clearFiles()
      }).catch(_ => {
        that.$refs.upload.clearFiles()
      })

      return false
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    }
  }

}
</script>

<style lang="scss" scoped>
.top{
  width: 100%;
  height: 55%;
  background-image: url('~@/assets/images/bg-my.png');
  // background-attachment: fixed;
  background-repeat: no-repeat;
  background-size:100% 100%;

}
.header{
  position: relative;
}
.eye{
  margin: 0px 5px;
   &:hover{
    cursor: pointer;
    transform: scale(1.1);
  }
}
.btn-common{
  color: #fff;
  background: #0E7AC3;
  font-size: 16px;
  font-weight: 600;
  border-radius:10px ;
}

.my-dialog{
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

.avatar-uploader ::v-deep .el-upload {
    border: 1px solid #d9d9d9;
    border-radius:50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    padding: 0px;
    margin: 0px;

  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 110px;
    height: 110px;
    line-height: 110px;
    text-align: center;
  }
  .avatar {
    width: 110px;
    height: 110px;
    display: block;
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
