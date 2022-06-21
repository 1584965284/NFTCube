<template>
  <div class="login-container">
    <el-form ref="loginForm" required-asterisk :model="loginForm" label-width="80px" :rules="loginRules" class="login-form" label-position="left">
      <el-form-item prop="username" label="用户名：">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输用户名"
          name="username"
          tabindex="1"
        />
      </el-form-item>
      <el-form-item prop="password" label="密  码：">
        <el-input
          ref="password"
          v-model="loginForm.password"
          placeholder="请输密码"
          name="password"
          type="password"
          tabindex="2"
        />
      </el-form-item>
      <el-form-item v-if="false" prop="phone" label="手机号：">
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="请输手机号"
          name="phone"
          tabindex="3"
        />
      </el-form-item>
      <el-form-item v-if="false" prop="code" label="验证码：">
        <el-input
          ref="code"
          v-model="loginForm.code"
          placeholder="请输验证码"
          name="code"
          class="wdtp-60 mgr-40"
          tabindex="4"
        /> <el-button type="primary" class="wdtp-30" style="background:#0E7AC3;">获取验证码</el-button>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checkedPTL" /> 我同意CUBE的<em class="lbl-2" @click="dialogPTL=true">条款和条件。</em>
      </el-form-item>
      <el-button :loading="loading" type="primary" class="font-wt-500 font-20" style="width:100%;background:#0E7AC3;" @click.native.prevent="handleLogin">
        <svg-icon icon-class="coming" class="mgr-8" />登 录</el-button>

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
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { login, checkSign, changeUserInfo, loginByLoginName } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import protocolTxt from '@/api/protocol'
export default {
  name: 'Login',
  components: { },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {},
      dialogPTL: false,
      checkedPTL: 0,
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        phone: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      loading: false,
      showDialog: false,
      protocol: protocolTxt
    }
  },
  computed: {
    ...mapGetters(['account', 'isConnect', 'isBind'])
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
    ...mapMutations({ setName: 'user/SET_NAME' }),
    ...mapActions('user', ['setIsConnect', 'getInfo', 'setAccount', 'setLoginState']),
    handleLogin() {
      if (!this.checkedPTL) {
        this.$message.warning('请同意CUBE的条款和条件')
        return
      }
      const upper = this
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (!this.isBind) {
            upper.setLoginState(true)
          } else {
            console.log(localStorage.getItem('checkSign'))
            const checkSign = JSON.parse(localStorage.getItem('checkSign'))
            const { sign, nonce } = checkSign
            upper.loginSign(sign, nonce)
          }
        } else {
          this.$message.error('数据验证失败')
          return false
        }
      })
    },
    /**
     * 链接以太坊
     */
    // async onConnect() {
    //   const upper = this

    //   try {
    //     //eslint -disable-next-line no-undef

    //     const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

    //     if (accounts.length) {
    //       this.setAccount(accounts[0])
    //       upper.bind()
    //     } else {
    //       this.$message.error('metamask链接失败')
    //     }
    //   } catch {
    //     console.log('connect error')
    //   }
    // },
    // async bind() {
    //   const upper = this
    //   const { errCode, data, message } = await login({ address: this.account }).catch(err => {
    //     this.$message.error('登录失败')
    //     console.log(err)
    //     return
    //   })
    //   if (errCode !== 0) {
    //     this.$message.error(message)
    //     return
    //   }
    //   const { nonce } = data
    //   const msg = { 'address': this.account, 'nonce': nonce }
    //   const msg_hex = upper.web3.utils.stringToHex(JSON.stringify(msg))
    //   const from = this.account
    //   const method = 'personal_sign'
    //   var params = [msg_hex, from]
    //   upper.web3.currentProvider.sendAsync({ method, params, from },
    //     function(err, result) {
    //       if (err) {
    //         console.error(err)
    //         return
    //       }
    //       const sign = result.result
    //       console.log('SIGN:', sign, from)
    //       upper.loginSign(sign, nonce)
    //     }
    //   )
    // },
    /**
     * 获取token
     */
    async loginSign(sign, nonce) {
      const { errCode, data, message } = await checkSign({
        'address': this.account,
        'nonce': nonce,
        'sign': sign }).catch(_ => {
        this.$message.error('获取token失败')
      })
      if (errCode !== 0) {
        this.$message.error(message)
        return
      }
      const { token } = data
      if (token) {
        this.setIsConnect(true)
        setToken(token)
        this.getInfo()
        this.$router.push({ path: '/home' })
      }
    }
  }
}
</script>

<style lang="scss">
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
    width: 600px;
    max-width: 100%;
    padding: 30px 0;
    margin: 50px auto;
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
