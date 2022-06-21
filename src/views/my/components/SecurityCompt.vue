<template>
  <div class="app-container" :style="{width:width,height:height}">
    <div class="wdtp-100 box-border pd-10">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>个性化设置</el-breadcrumb-item>
        <el-breadcrumb-item>账号安全</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="ctx" class="mgt-20 mglr-10 pdlr-5 pdtb-20" style="background: #FBFBFB;">
      <div class="flex-row flex-sb flex-vc item pdtb-10">
        <span class="font-18 pdl-5" style="color:#C3C1C1">实名认证</span>
        <span v-if="isVerify" class="font-14 pdr-8" style="color:#0E7AC3">已实名认证</span>
        <span v-else class="font-14 pdr-8 setting" style="color:#0E7AC3" @click="dialogID=true">认证</span>
      </div>
      <div class="flex-row flex-sb flex-vc item pdtb-10 mgt-10">
        <span class="font-18 pdl-5" style="color:#C3C1C1">设置交易密码</span>
        <span class="font-14 pdr-8 setting" style="color:#0E7AC3" @click="dialogPW=true">设置</span>
      </div>
      <div class="flex-row flex-sb flex-vc item pdtb-10 mgt-10">
        <span class="font-18 pdl-5" style="color:#C3C1C1">重置密码</span>
        <span class="font-14 pdr-8 setting" style="color:#0E7AC3" @click="dialogUPW = true">重置</span>
      </div>
      <div v-if="false" class="flex-row flex-sb flex-vc item pdtb-10 mgt-10">
        <span class="font-18 pdl-5" style="color:#C3C1C1">邮箱</span>
        <span class="font-14 pdr-8 setting" style="color:#0E7AC3" @click="dialogML=true">设置</span>
      </div>
      <div v-if="!verified" class="flex-row flex-sb flex-vc item pdtb-10 mgt-10">
        <span class="font-18 pdl-5" style="color:#C3C1C1">身份认证</span>
        <span class="font-14 pdr-8 setting" style="color:#0E7AC3" @click="dialogSF=true">认证</span>
      </div>
      <div v-if="false" class="flex-row flex-sb flex-vc item pdtb-10 mgt-10">
        <span class="font-18 pdl-5" style="color:#C3C1C1">创建机构</span>
        <span class="font-14 pdr-8 setting" style="color:#0E7AC3" @click="dialogJG=true">创建</span>
      </div>
    </div>

    <!-- 实名认证弹框 -->
    <el-dialog
      title="实名认证"
      class="my-dialog"
      :visible.sync="dialogID"
      width="500px"
      :close-on-click-modal="false"
      @opened="openBeforeDialog"
      @close="colseBeforDialog"
    >
      <div slot="title" class="dialog-tilte">
        实名认证
      </div>
      <el-form ref="dataForm1" :model="IDForm" :rules="IDRules" hide-required-asterisk label-position="top" label-width="120px">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="IDForm.name" :placeholder="IDRules.name[0].message" />
        </el-form-item>
        <el-form-item prop="identity" label="身份证号">
          <el-input v-model="IDForm.identity" :placeholder="IDRules.identity[0].message" />
        </el-form-item>
        <p style="line-height:22px;color:#B4B3B3">
          应国家法律犯规要求，购买前请完成实名认证。实名认证完成之后，您的提现账户将与此实名信息进行绑定，请知晓！
        </p>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="btn-common" style="background:#0E7AC3" @click="onVerify"> 保 存</el-button>
        <el-button class="btn-common" style="background:#B0B0B0;" @click="dialogID = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 设置交易密码弹框 -->
    <el-dialog
      title="设置交易密码"
      class="my-dialog"
      :visible.sync="dialogPW"
      width="500px"
      :close-on-click-modal="false"
      @opened="openBeforeDialog2"
      @close="colseBeforDialog2"
    >
      <div slot="title" class="dialog-tilte">
        设置交易密码
      </div>
      <el-form ref="dataForm2" :model="PWForm" :rules="PwRules" hide-required-asterisk label-position="top" label-width="120px">
        <el-form-item prop="password2" label="手机号">
          <el-input v-model="PWForm.phone" :placeholder="PwRules.phone[0].message" maxlength="11" />
        </el-form-item>
        <el-form-item prop="smsCode" label="短信验证">
          <el-input
            v-model="PWForm.smsCode"
            :placeholder="PwRules.smsCode[0].message"
            class="wdtp-60 mgr-40"
          /> <el-button :loading="sendCode" type="primary" class="wdtp-30" style="background:#0E7AC3;" :disabled="sendCode" @click="onGetCode">获取验证码{{ countdown>0? `(${countdown})`:'' }}</el-button>
        </el-form-item>
        <el-form-item prop="password" label="交易密码">
          <el-input v-model="PWForm.password" :placeholder="PwRules.password[0].message" maxlength="20" type="password" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="btn-common" style="background:#0E7AC3" @click="onSetPassword"> 保 存</el-button>
        <el-button class="btn-common" style="background:#B0B0B0;" @click="dialogPW = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 修改登录密码弹框 -->
    <el-dialog
      title="重置密码"
      class="my-dialog"
      :visible.sync="dialogUPW"
      width="500px"
      :close-on-click-modal="false"
      @opened="openBeforeDialog3"
      @closed="colseBeforDialog3"
    >
      <div slot="title" class="dialog-tilte">
        重置密码
      </div>
      <el-form ref="dataForm3" :model="UPWForm" :rules="UPwRules" hide-required-asterisk label-position="top" label-width="120px">
        <el-form-item prop="password" label="输入旧密码">
          <el-input v-model="UPWForm.password" :placeholder="UPwRules.password[0].message" type="password" />
        </el-form-item>
        <el-form-item prop="password2" label="新密码">
          <el-input v-model="UPWForm.password2" :placeholder="UPwRules.password2[0].message" type="password" />
        </el-form-item>
        <el-form-item prop="password3" label="确认新密码">
          <el-input v-model="UPWForm.password3" :placeholder="UPwRules.password3[0].message" type="password" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="btn-common" style="background:#0E7AC3" @click="onSetUPassword"> 保 存</el-button>
        <el-button class="btn-common" style="background:#B0B0B0;" @click="dialogUPW = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 设置邮箱弹框 -->
    <el-dialog
      title="设置邮箱密码"
      class="my-dialog"
      :visible.sync="dialogML"
      width="500px"
      :close-on-click-modal="false"
      @open="openBeforeDialog4"
      @closed="colseBeforDialog4"
    >
      <div slot="title" class="dialog-tilte">
        设置邮箱
      </div>
      <el-form ref="dataForm4" :model="MLForm" :rules="MLRules" hide-required-asterisk label-position="top" label-width="120px">
        <el-form-item prop="address" label="邮箱">
          <el-input v-model="MLForm.address" :placeholder="MLRules.address[0].message" />
        </el-form-item>
        <el-form-item prop="code" label="验证码">
          <el-row type="flex" justify="start" align="middle">
            <el-input v-model="MLForm.code" :placeholder="MLRules.code[0].message" class="wdtp-70 mgr-40" />
            <span class="send font-wt-500" style="color:#0E7AC3;">发送</span>
          </el-row>

        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="btn-common" style="background:#0E7AC3" @click="onSetMail"> 保 存</el-button>
        <el-button class="btn-common" style="background:#B0B0B0;" @click="dialogML = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 设置身份认证 -->
    <el-dialog
      title="设置身份认证"
      class="my-dialog"
      :visible.sync="dialogSF"
      width="500px"
      :close-on-click-modal="false"
      @opened="openBeforeDialog5"
      @close="colseBeforDialog5"
    >
      <div slot="title" class="dialog-tilte">
        设置身份认证
      </div>
      <el-form ref="dataForm5" :model="SFForm" :rules="SFRules" hide-required-asterisk label-position="top" label-width="120px">
        <el-form-item prop="description" label="描述">
          <el-input v-model="SFForm.description" maxlength="400" type="textarea" :rows="3" :placeholder="SFRules.description[0].message" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="btn-common" style="background:#0E7AC3" @click="onSetSelf"> 提 交</el-button>
        <el-button class="btn-common" style="background:#B0B0B0;" @click="dialogSF = false">取 消</el-button>
      </span>
    </el-dialog>

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
import { mapGetters } from 'vuex'
import { getVerifiedInfo, verify, changePassword, changePaymentPassword, getVerificationCode, artistVerify, getMes } from '@/api/user'
import { createAgency } from '@/api/group'
export default {
  name: 'SecurityCompt',
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
    // 身份自定义证验证方法
    const validateID = (rule, value, callback) => {
      if (value !== undefined && value !== '' && value !== null) {
        const isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/
        const isIDCard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
        if (isIDCard1.test(value) || isIDCard2.test(value)) {
          callback()
        } else {
          callback(new Error('身份证号验证失败'))
        }
      } else {
        callback()
      }
    }
    return {
      isVerify: false,
      IDForm: {
        name: '',
        identity: ''
      },
      dialogID: false,
      IDRules: {
        name: [{ required: true, message: `请输入您的真实姓名`, trigger: 'blur' },
          { min: 2, max: 100, message: `至少输入2个字以上符且在100个字符以内`, trigger: 'blur' }],
        identity: [{ required: true, message: `请请输入您的身份证号`, trigger: 'blur' },
          { validator: validateID, trigger: 'blur' }]
      },

      PWForm: {
        password: '',
        phone: '',
        smsCode: ''
      },
      dialogPW: false,
      PwRules: {
        phone: [{ required: true, message: `请输入手机号`, trigger: 'blur' }],
        password: [{ required: true, message: `请输入交易密码`, trigger: 'blur' }],
        smsCode: [{ required: true, message: `请输入验证码`, trigger: 'blur' }]
      },

      UPWForm: {
        password: '',
        password2: '',
        password3: ''
      },
      dialogUPW: false,
      UPwRules: {
        password: [{ required: true, message: `请输入旧密码`, trigger: 'blur' }, { min: 6, max: 20, message: '密码现限制在6到20个字符之间' }],
        password2: [{ required: true, message: `请输入新密码`, trigger: 'blur' }, { min: 6, max: 20, message: '密码现限制在6到20个字符之间' }],
        password3: [{ required: true, message: `请输入确认新密码`, trigger: 'blur' }, { min: 6, max: 20, message: '密码现限制在6到20个字符之间' }]
      },

      MLForm: {},
      dialogML: false,
      MLRules: {
        address: [{ required: true, message: `请输入邮箱地址`, trigger: 'blur' }],
        code: [{ required: true, message: `请输入邮箱里得验证码`, trigger: 'blur' }]
      },

      SFForm: {
        description: ''
      },
      dialogSF: false,
      SFRules: {
        description: [{ required: true, message: `请输入描述`, trigger: 'blur' }]
      },

      JGForm: {
        name: '',
        description: ''
      },
      dialogJG: false,
      JGRules: {
        name: [{ required: true, message: `请输入机构名称`, trigger: 'blur' }],
        description: [{ required: true, message: `请输入机构描述`, trigger: 'blur' }]
      },

      sendCode: false,
      timer: '',
      countdown: 0
    }
  },
  computed: {
    ...mapGetters(['account', 'verified', 'agency', 'userLevel'])
  },
  async created() {
    const { errCode, data, message } = await getVerifiedInfo().catch(err => err)
    if (errCode !== 0) {
      this.$message.info(message)
      return
    }
    const { verified_status, real_name, idcard, phone, address } = data
    this.isVerify = verified_status
    this.IDForm.name = real_name
    this.IDForm.identity = idcard
    // getMes().then(res => {
    //   const { errCode, message, data } = res
    //   if (errCode !== 0) {
    //     this.$message.error(message)
    //   } else {
    //     const { mes } = data
    //   }
    // })
  },
  methods: {
    // 获取验证码
    onGetCode() {
      const { phone } = this.PWForm
      if (phone) {
        this.sendCode = true
        getVerificationCode({ phone }).then(res => {
          const { errCode, message } = res
          if (errCode !== 0) {
            this.sendCode = false
            this.$message.error(message)
          } else {
            this.$message.success(message)
            this.startTimer()
          }
        }).catch(_ => {
          this.$message.error('验证码获取失败！')
          this.sendCode = false
        })
      } else {
        this.$message.warning('请输入手机号！')
      }
    },
    // 定时30秒再获取验证码
    startTimer() {
      this.countdown = 30
      this.timer = setInterval(() => {
        this.countdown--
        if (this.countdown === 0) {
          this.endTimer()
        }
      }, 1000)
    },
    // 结束倒计时
    endTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.sendCode = false
      }
    },
    // 实名认证
    openBeforeDialog() {
      this.$refs.dataForm1.resetFields()
    },
    colseBeforDialog() {
      this.$refs.dataForm1.clearValidate()
    },
    // 用户认证
    async onVerify() {
      const valid = await this.$refs.dataForm1.validate().catch(_ => false)
      if (valid) {
        const { name, identity } = this.IDForm
        const { errCode, message } = await verify({ realName: name, idCard: identity }).catch(_ => {
          this.$message.error('认证失败！')
        })
        if (errCode !== 0) {
          this.$message.error(message)
        } else {
          this.dialogID = false
          this.isVerify = true
          this.$message.success('认证成功！')
        }
      } else {
        this.$message.error('数据校验失败！')
      }
    },
    // 修改交易密码
    openBeforeDialog2() {
      this.$refs.dataForm2.resetFields()
    },
    colseBeforDialog2() {
      this.$refs.dataForm2.clearValidate()
    },
    // 设置交易密码
    async onSetPassword() {
      const that = this
      const valid = await this.$refs.dataForm2.validate().catch(_ => false)
      if (valid) {
        const { password: new_password, smsCode } = this.PWForm
        const { errCode, message } = await changePaymentPassword({ smsCode, new_password }).catch(_ => {
          return { errCode: -1, message: '修改密码失败！' }
        })
        if (errCode === 0) {
          that.dialogPW = false
          that.$message.success(message)
        } else {
          that.$message.error(message)
        }

        return
      } else {
        this.$message.error('数据验证失败')
      }
    },
    // 修改登录密码
    openBeforeDialog3() {
      this.$refs.dataForm3.resetFields()
    },
    colseBeforDialog3() {
      this.$refs.dataForm3.clearValidate()
    },
    // 设置登录密码
    async onSetUPassword() {
      const that = this
      const valid = await this.$refs.dataForm3.validate().catch(_ => false)
      if (valid) {
        const { password: password, password2: newPassword, password3 } = this.UPWForm
        if (newPassword !== password3) {
          that.$message.warning('新密码与确认密码不一致')
          return
        }
        const { errCode, message } = await changePassword({ password, newPassword }).catch(err => {
          return { errCode: -1, message: err }
        })
        if (errCode === 200) {
          that.dialogUPW = false
          that.$message.success(message)
        } else {
          that.$message.error(message)
        }
      } else {
        this.$message.error('数据验证失败！')
      }
    },
    // 修改邮箱
    openBeforeDialog4() {
      this.$refs.dataForm4.resetFields()
    },
    colseBeforDialog4() {
      this.$refs.dataForm4.clearValidate()
    },
    async onSetMail() {
      const valid = await this.$refs.dataForm4.validate().catch(_ => false)
      if (valid) {
        this.dialogML = false
        return
      } else {
        this.$message.error('数据验证失败')
      }
    },
    // 身份认证
    async onSetSelf() {
      const that = this
      const { description } = this.SFForm
      const valid = await this.$refs.dataForm5.validate().catch(_ => false)
      if (valid) {
        const { errCode, message } = await artistVerify({ description }).catch(_ => {
          return { errCode: -1, message: '身份认证失败！' }
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
    openBeforeDialog5() {
      this.$refs.dataForm5.resetFields()
    },
    colseBeforDialog5() {
      this.$refs.dataForm5.clearValidate()
    },

    // 创建机构
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
#ctx{
  font-family: Proxima Nova,sans-serif;
  color: rgb(129, 143, 163);

}
.item{
  border-bottom:1px solid #ccc;
}
.setting,.send{
  &:hover{
    cursor: pointer;
    transform: scale(1.1);
    font-weight: 550;
  }
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
