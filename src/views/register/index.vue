<template>
  <div class="login-container">
    <el-form ref="loginForm" required-asterisk :model="loginForm" label-width="100px" :rules="loginRules" class="login-form" label-position="left">
      <el-form-item v-if="false" prop="username" label="用户名：">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输用户名"
          name="username"
          tabindex="1"
        />
      </el-form-item>
      <el-form-item v-if="false" prop="payment_password" label="支付密码：">
        <el-input
          ref="payment_password"
          v-model="loginForm.payment_password"
          placeholder="支付密码"
          name=",payment_password"
          type="password"
          tabindex="5"
        />
      </el-form-item>

      <el-form-item prop="phone" label="手机号：">
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="请输手机号"
          name="phone"
          tabindex="3"
        />
      </el-form-item>
      <el-form-item prop="vericode" label="验证码：">
        <el-input
          ref="vericode"
          v-model="loginForm.vericode"
          placeholder="请输验证码"
          name="vericode"
          class="wdtp-60 mgr-40"
          tabindex="4"
        /> <el-button :loading="sendCode" type="primary" class="wdtp-30" style="background:#0E7AC3;" :disabled="sendCode" @click="onGetCode">获取验证码{{ countdown>0? `(${countdown})`:'' }}</el-button>
      </el-form-item>
      <el-form-item prop="password" label="密 码：" :required="isRequired">
        <el-input
          ref="password"
          v-model="loginForm.password"
          placeholder="注册时请输密码"
          name="password"
          type="password"
          tabindex="2"
        />
      </el-form-item>
      <el-form-item prop="icode" label="邀请码：">
        <el-input
          ref="icode"
          v-model="loginForm.icode"
          placeholder="请输邀请码"
          name="icode"
          tabindex="5"
        />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checkedPTL" /> 我同意CUBE的<em class="lbl-2" @click="dialogPTL=true">条款和条件。</em>
      </el-form-item>

      <div class="flex-column flex-sb flex-vc hgt-100">
        <el-button :loading="loading" type="primary" class="font-wt-500 font-20 " style="width:90%;background:#0E7AC3;" @click.native.prevent="handRegister">
          新手机注册</el-button>
        <el-button :loading="loading2" type="primary" class="font-wt-500 font-20" style="width:90%;background:#0E7AC3; margin-left:0px" @click.native.prevent="handBid">
          绑定手机号</el-button>
      </div>

    </el-form>

    <!-- c查看协议弹框 -->
    <el-dialog
      title="查看条款条件"
      class="my-dialog2"
      top="10px"
      :visible.sync="dialogPTL"
      width="500px"
      :close-on-click-modal="false"
    >
      <div slot="title" class="dialog-tilte">
        查看条款条件
      </div>
      <div class="hgt-450 txt-overflow-y pdtp-3 pdlr-8" v-html="protocol" />

      <span slot="footer" class="dialog-footer flex-row flex-hvc">
        <el-button type="primary" class="btn-common" style="background:#0E7AC3" @click="dialogPTL =false"> 确 定</el-button>
        <!-- <el-button class="btn-common" style="background:#B0B0B0" @click="dialogPTL = false">取 消</el-button> -->
      </span>
    </el-dialog>

    <!-- <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog> -->
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import protocolTxt from '@/api/protocol'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { getVerificationCode, register, bindPhone } from '@/api/user'
export default {
  name: 'Register',
  components: { },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {},
      isRequired: false,
      loginRules: {
        username: [{ required: false, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: false, trigger: 'blur', message: '请输入密码' }, { min: 6, max: 20, message: '密码现限制在6到20个字符之间' }],
        payment_password: [{ required: false, trigger: 'blur', message: '请输入确认密码' }],
        phone: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
        icode: [{ required: false, trigger: 'blur', message: '请输入邀请码' }],
        vericode: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      loading: false,
      loading2: false,
      showDialog: false,
      checkedPTL: 0,
      dialogPTL: false,
      sendCode: false,
      timer: '',
      countdown: 0,
      protocol: protocolTxt
    }
  },
  computed: {
    ...mapGetters(['isConnect', 'account'])
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler({ icode }) {
        if (icode) {
          console.log(icode)
          this.$set(this.loginForm, 'icode', icode)
        }
      }
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    // 绑定手机号
    handBid() {
      this.loginRules.password[0].required = false
      if (!this.isConnect) {
        this.$message.warning('请先连接钱包！')
        return
      }
      if (!this.checkedPTL) {
        this.$message.warning('请同意CUBE的条款和条件！')
        return
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading2 = true
          const params = Object.assign({}, { phone: this.loginForm.phone, smsCode: this.loginForm.vericode })
          bindPhone(params).then(res => {
            this.loading2 = false
            const { errCode, message } = res
            if (errCode === 0) {
              this.$message.success(message)
            } else {
              this.$message.error(message)
            }
          }).catch(err => {
            this.$message.error(err)
            this.loading2 = false
          })
        } else {
          this.$message.error('数据验证失败！')
        }
      })
    },
    // 注册
    handRegister() {
      this.loginRules.password[0].required = true
      if (!this.isConnect) {
        this.$message.warning('请先连接钱包！')
        return
      }
      if (!this.checkedPTL) {
        this.$message.warning('请同意CUBE的条款和条件！')
        return
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          console.log(this.loginForm)
          const params = Object.assign({}, this.loginForm, { icode: this.loginForm.icode ? this.loginForm.icode : '', address: this.account })
          this.loading = true
          register(params).then(res => {
            this.loading = false
            const { errCode, message } = res
            if (errCode === 0) {
              this.$store.dispatch('user/setIsRegister', true)
              this.$message.success(message)
              this.$router.push('/home')
            } else {
              this.$message.error(message)
            }
          }).catch(_ => {
            this.$message.error('注册失败！')
            this.loading = false
          })
        } else {
          this.$message.error('数据验证失败！')
        }
      })
    },
    // 获取验证码
    onGetCode() {
      if (!this.isConnect) {
        this.$message.warning('请连接钱包！')
        return
      }
      const { phone } = this.loginForm
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
    }

  }
}
</script>

<style lang="scss" scoped>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#FFF;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 630px;
    max-width: 100%;
    padding:35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
.lbl-2{
  color: #409EFF;
  text-decoration: underline;
  &:hover{
    cursor: pointer;
    color: #409EFF;
  }
}
</style>
