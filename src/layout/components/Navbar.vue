<template>
  <div>
    <el-row id="header" type="flex" justify="start" align="middle">
      <el-col class="logo" :span="16">
        <el-image class="img" :src="require('@/assets/images/logo.png')" @click="onView('/home')" />
        <span class="mgr-20">数字立方</span>
        <div class="line" />

        <!-- <el-button type="text" @click="onView('/home')">首页</el-button>
        <el-button type="text" @click="onView('/market')">市场</el-button>
        <el-button type="text" @click="onView('/create')">创造工坊</el-button>
        <el-button type="text" @click="onView('/create')">创造者大厅</el-button> -->

        <el-menu class="el-menu-nft" text-color="#fff" active-text-color="#fff" background-color="#006E7B" mode="horizontal" :default-active="active" @select="onSelect">
          <el-menu-item index="1" @click="onView('/home')">首页</el-menu-item>
          <!-- <el-menu-item index="2" @click="onView('/market/art')">市场</el-menu-item> -->

          <el-submenu index="2">
            <template slot="title">市场</template>
            <el-menu-item index="2-1" @click="onView('/market/art')">艺术专区 </el-menu-item>
            <el-menu-item v-if="false" index="2-2" @click="onView('/market/travel')">旅游专区</el-menu-item>
          </el-submenu>
          <el-menu-item index="3" @click="onView('/create/art')">创作工厂</el-menu-item>
          <!--  <el-submenu index="3">
            <template slot="title">创造工坊</template>
            <el-menu-item index="3-1" @click="onView('/create/art')">艺术创作 </el-menu-item>
            <el-menu-item index="3-2" @click="onView('/create/travel')">旅游创作</el-menu-item>
          </el-submenu> -->
          <!-- <el-menu-item index="4" @click="onView('/hall')">创造者大厅</el-menu-item> -->
          <el-submenu index="4">
            <template slot="title">创造者大厅</template>
            <el-menu-item index="3-1" @click="onView('/hall/index')">个人创造者 </el-menu-item>
            <el-menu-item index="3-2" @click="onView('/hall/group')">艺术机构</el-menu-item>
          </el-submenu>
          <el-menu-item v-if="isRegister" index="5" @click="onCreateCode">佣金分享</el-menu-item>
          <el-menu-item index="6" @click="metaMaskShow=true;progress=0;">MetaMask下载</el-menu-item>

        </el-menu>
      </el-col>
      <!-- <el-col :span="8" class="nav-search" /> -->

      <el-col class="nav-login" :span="9">
        <HeaderSearch />
        <div class="line" style="margin:0 20px" />
        <!-- <el-button v-if="!isConnect" type="text" style="margin-right:20px" @click="onView('/login')">你好，请登录</el-button> -->
        <el-button v-if="!isConnect" type="text" class="mgr-20" @click="onConnect">你好，连接钱包</el-button>
        <div v-else class="flex-row flex-hs flex-vc mgr-20">
          <div @click="onView('/my')">
            <!-- <el-avatar :src="require('@/assets/images/user-filling.png')" class="avatar" /> -->
            <el-avatar :src="`${baseUrl}${avatar}`" class="avatar" />
          </div>
          <div class="txt-ellipsis mgl-3" style="max-width:80px;" :title="name">{{ name }}</div>
          <el-popover
            placement="bottom"
            width="60"
            trigger="click"
          >
            <div class="myMenue">
              <ul>
                <li @click="logout">
                  <i class="el-icon-switch-button" />断开
                </li>
              </ul>
            </div>
            <i slot="reference" class="el-icon-caret-bottom downarrow" />
          </el-popover>
        </div>
        <el-button v-if="!isRegister" type="text" class="mgr-1" @click="onView('/register')">绑定手机号</el-button>
        <el-button v-if="false" type="text" class="mgr-3" @click="onShowWallet">{{ isBind?'钱包已连接':'连接钱包' }}</el-button>
      </el-col>
    </el-row>

    <!-- 连接你的钱包 -->
    <el-dialog
      title="连接你的钱包"
      :visible.sync="dialogShow"
      width="400px"
      class="my-dialog"
      left
    >
      <div class="metamask hgt-60 wdtp-100 flex-row flex-sb flex-vc pd-5 bdr-r-3" style="border:1px solid #ccc;" @click="onConnectWallet">
        <span class="font-20 font-wt-600">Metamask</span>
        <el-image class="wdt-60 hgt-60 pd-1 bdr-pr-50" fit="contain" :src="require('@/assets/images/metamask.png')" />
      </div>
    </el-dialog>

    <!-- 佣金分享弹框 -->
    <el-dialog
      title="佣金分享"
      :visible.sync="visible"
      width="430px"
      class="my-dialog"
    >
      <div slot="title" class="dialog-tilte">佣金分享</div>
      <h2>邀请码：{{ icode }} </h2>
      <h3>有效时间：{{ time }} </h3>
      <h3>已邀请人数：{{ num }} </h3>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="onFreshCode">更新邀请码</el-button>
        <el-button v-clipboard:copy="icode" v-clipboard:success="onCopy" v-clipboard:error="onError" type="warning " @click="visible = false">复制邀请码</el-button>
        <el-button :loading="postLoading" type="primary" @click="onDownload">{{ postLoading?'海报生成中...':'生成邀请海报' }}</el-button>
      </span>
    </el-dialog>

    <!-- metaMask下载 -->
    <el-dialog
      title="下载"
      :visible.sync="metaMaskShow"
      width="400px"
      class="my-dialog"
      left
    >
      <div slot="title" class="dialog-tilte">下载</div>
      <div class="metamask hgt-60 wdtp-100 flex-row flex-sb flex-vc pd-5 bdr-r-3" style="border:1px solid #ccc;" @click="onDlowndPlugin">
        <span class="font-20 font-wt-600">Metamask下载</span>
        <el-image class="wdt-60 hgt-60 pd-1 bdr-pr-50" fit="contain" :src="require('@/assets/images/metamask.png')" />
      </div>
      <div class="flex-row flex-hvc mgt-8 pdtb-5 wdtp-100">
        <el-progress v-show="progress>0" :text-inside="true" class="wdtp-100" :stroke-width="26" :percentage="parseInt(progress)" />
      </div>
      <div>
        <h4 style="margin:2px 0px;">安装教程：<a style="color:rgb(14, 122, 195;" href="http://www.nftcubecn.com/Metamask插件安装教程.docx" target="_blank">安装说明文档</a></h4>
        <!-- <h4 style="margin:2px 0px;">查看安装方法：<em style="color:rgb(14, 122, 195;" @click="openFile">安装说明文档</em></h4> -->
      </div>

    </el-dialog>

  </div>
</template>

<script>
import { getNonce, checkSign, changeUserInfo, searchByKeyWords, createCode, createPoster, getIcodeTmt, dlMetaMask } from '@/api/user'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { downloadFile, downloadIamge, parseTime } from '@/utils'
import HeaderSearch from '@/components/HeaderSearch'
import axios from 'axios'

export default {
  name: 'Navbar',
  components: {
    HeaderSearch
  },
  data() {
    return {
      active: '1',
      addres: '',
      dialogShow: false,
      metaMaskShow: false,
      visible: false,
      progress: 0,
      icode: '',
      time: '',
      num: 0,
      userInfo: {
        username: '',
        avatar: '',
        description: ''
      },
      baseUrl: '',
      postLoading: false,
      downloadAPI: `prod-api`,
      domain: ''
    }
  },
  computed: {
    ...mapGetters(['avatar', 'name', 'isRegister', 'account', 'isConnect', 'introduce', 'isBind', 'loginState', 'activeMune'])
  },
  watch: {
    loginState(flag) {
      if (flag) {
        this.dialogShow = true
      }
    },
    activeMune(index) {
      console.log('activeMune', index)
      this.active = index + ''
    }
  },
  created() {
    this.domain = document.domain
    this.baseUrl = process.env.VUE_APP_DAOMAIN

    if (process.env.NODE_ENV === 'development') {
      this.downloadAPI = `dev-api`
    }
    window.ethereum.on('accountsChanged', function(accounts) {
      if (accounts.length === 0) {
        this.setIsConnect(false)
        removeToken()
      }
    })
    const taht = this
    taht.getInfo().catch(_ => {
      taht.logout()
    })
  },
  methods: {
    ...mapMutations({ setName: 'user/SET_NAME' }),
    ...mapActions('user', ['setIsConnect', 'getInfo', 'setAccount', 'setIsBind', 'logout']),
    ...mapActions('app', ['toggleMenue']),

    // 生成邀请码
    async onCreateCode() {
      if (this.icode) {
        this.visible = true
        return
      }
      const { errCode: status, data: dt, message: msg } = await getIcodeTmt().catch(err => { return { errCode: -1, message: err } })
      if (status === 0) {
        const { icode, tmt, num } = dt
        // const currentTime = parseTime(new Date().getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
        // const validTime = parseTime(new Date(tmt).getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
        this.num = num ?? 0
        if (icode) {
          this.icode = icode
          this.time = parseTime(new Date(tmt).getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
          this.visible = true
          return
        }
      }

      const { errCode, data, message } = await createCode().catch(err => { return { errCode: -1, message: err } })
      if (errCode !== 0) {
        this.$message.error(message)
      } else {
        const { icode, tmt } = data
        this.icode = icode
        this.time = parseTime(tmt, '{y}-{m}-{d} {h}:{i}:{s}')
        this.visible = true
      }
    },
    // 更新邀请码
    async onFreshCode() {
      const { errCode, data, message } = await createCode().catch(err => { return { errCode: -1, message: err } })
      if (errCode !== 0) {
        this.$message.error(message)
      } else {
        const { icode, tmt } = data
        this.time = parseTime(tmt, '{y}-{m}-{d} {h}:{i}:{s}')
        this.icode = icode
      }
    },
    // 复制邀请码
    onCopy({ text }) {
      this.$message.success(`复制成功过！`)
    },
    onError(e) {
      this.$message.error('抱歉，复制失败！')
    },
    // 下载邀请海报
    async onDownload() {
      const url = location.protocol + '//' + location.host + `/#/register?icode=${this.icode}`
      this.downloadPostFile(`/${this.downloadAPI}/api/user/createPoster`, { url })
    },
    // 下载插件
    async onDlowndPlugin() {
      this.downloadPluginFile(`/${this.downloadAPI}/api/dlMetaMask`)
    },
    downloadPostFile(url, data) {
      function down(fileUrl, fileName) {
        fileName = decodeURIComponent(fileName)
        const a = document.createElement('a')
        a.setAttribute('href', fileUrl)
        a.setAttribute('download', fileName)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
      this.postLoading = true
      axios({
        url,
        data,
        headers: {
          'Authorization': 'Bearer ' + getToken()
        },
        responseType: 'blob',
        method: 'POST'
      }).then(res => {
        const data = res.data
        const url = URL.createObjectURL(data)
        const fileName = this.icode + '.png'
        this.postLoading = false
        down(url, fileName)
      }).catch(_ => {
        this.postLoading = false
      })
    },
    // 下载插件
    downloadPluginFile(url) {
      const that = this
      function down(fileUrl, fileName) {
        that.metaMaskShow = false
        that.progress = 100
        fileName = decodeURIComponent(fileName)
        const a = document.createElement('a')
        a.setAttribute('href', fileUrl)
        a.setAttribute('download', fileName)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
      axios({
        url,
        headers: {
          'Authorization': 'Bearer ' + getToken()
        },
        responseType: 'blob',
        method: 'GET',
        onDownloadProgress: (progress) => {
          console.log(progress)
          if (progress.loaded) {
            that.progress = Math.round(progress.loaded / progress.total * 100)
          } else {
            if (that.progress <= 100) {
              that.progress += 0.1
            }
          }

          // if (progress.loaded === progress.total) {
          //   that.metaMaskShow = false
          // }
        }
      }).then(res => {
        const data = res.data
        const dis = res.headers['content-disposition']
        const url = URL.createObjectURL(data)
        const fileName = dis.split('filename=')[1].replace(/\"/g, '').trim()
        console.log(fileName)
        down(url, fileName)
      }).catch(err => {
        that.$message.error(err)
      })
    },
    // 选择激活
    onSelect(index) {
      if (index === '5' || index === '-5') {
        this.toggleMenue(index > 0 ? -6 : 6)
      } else if (index === '6' || index === '-6') {
        this.toggleMenue(index > 0 ? -5 : 5)
      } else {
        this.toggleMenue(index)
      }
    },
    // 页面跳转
    onView(path) {
      this.$router.push({ path: path })
    },
    onConnectWallet() {
      this.onConnect()
      this.dialogShow = false
    },
    onShowWallet() {
      if (this.isBind) {
        this.$message.info('钱包已连接，无需再连接！')
      } else {
        this.dialogShow = true
      }
    },

    /**
     * 链接以太坊
     */
    async onConnect() {
      const upper = this
      try {
        //eslint -disable-next-line no-undef
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length) {
          this.setAccount(accounts[0])
          upper.bind()
        } else {
          this.$message.error('metamask链接失败')
        }
      } catch {
        console.log('connect error')
      }
    },
    // 获取Nonce
    async bind() {
      const upper = this
      const { errCode, data, message } = await getNonce({ address: this.account }).catch(err => {
        console.log(err)
      })
      if (errCode !== 0) {
        this.$message.error(message)
        return
      }
      const { nonce } = data
      const msg = { 'address': this.account, 'nonce': nonce }
      const msg_hex = upper.web3.utils.stringToHex(JSON.stringify(msg))
      const from = this.account
      const method = 'personal_sign'
      const params = [msg_hex, from]
      upper.web3.currentProvider.sendAsync({ method, params, from },
        function(err, result) {
          if (err) {
            this.setIsBind(false)
            return
          }
          const sign = result.result
          localStorage.setItem('checkSign', JSON.stringify({ sign, nonce }))
          upper.setIsBind(true)
          upper.dialogShow = false
          upper.loginSign(sign, nonce)
        }
      )
    },
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

      if (errCode === 0) {
        const { token } = data
        console.log('token', token)
        this.setIsConnect(true)
        setToken(token)
        this.getInfo()
      } else {
        this.$message.error(message)
      }
    },
    /**
     * 打开弹框
     */
    onShowDialog() {
      this.userInfo = Object.assign({}, {
        username: this.name,
        description: this.introduce
      })
      this.dialogShow = true
    }

  }
}
</script>

<style lang="scss" scoped>
.el-menu.el-menu--horizontal{
  border-bottom:unset !important;
}
.metamask{
  &:hover{
    background: #F0F8FF;
    box-shadow: 0px 0px 2px #ccc;
    cursor: pointer;
  }
}
.logo{
  display: flex;
  justify-content:flex-start ;
  align-items: center;
  font-weight: 600;
  font-size: 20px;
  .img{
    margin-right: 16px;
    cursor: pointer;
    width: 130px;
    &:hover{
      color: #1571fa;
      transform: scale(1.1);
    }
  }

}
#header{
  min-width: 1500px;
  color: #fff;
  z-index: 2000;
  flex: 0 0 auto;
  background: #006E7B;
  height: 60px;
  padding: 0 22px 0 16px;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  padding-bottom:3px;
  border-bottom: 1px solid #98A0A4;
  // min-width: 1440px;
  width: 100%;

}
.mycenter{
  display: flex;
  justify-content: space-between;
  align-items: center;
  i{
    width: 16px;
    &:hover{
      color: #1571fa;
      cursor:pointer;
    }
  }
}
.nametxt{
    width: 120px;
    padding: 0 10px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    text-align: center;
}
.avatar{
  &:hover{
      transform: scale(1.1);
      box-shadow: 0px 0px 1px 1px #ccc;
      cursor:pointer;
    }

}
.downarrow{
  &:hover{
      color: #1571fa;
      cursor:pointer;
    }
}
.line{
  height: 25px;
  width: 1px;
  background: #98A0A4;
  margin: 0 5px;
}
.myMenue{
  font-weight: 600px;
  color: #000;
  font-size: 14px;
  text-size-adjust: 100%;
  ul{
    margin: 0px;
    padding: 0px;
    list-style-type: none;
    h5{
      margin: 0px;
    }
    li{
      margin: 0px;
      i{
        margin-right: 10px;
        font-size: 16px;
      }
      height: 30px;
      line-height: 30px;
      &:hover{
        color: #1571fa;
        cursor:pointer;
      }

    }
  }
}
.nav-menu{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 40px;
  button{
    color: #98A0A4;
    font-size: 16px;

    &:hover{

    }

  }
}
.nav-search{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.nav-login{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  button{
    color: #fff;
    font-size: 14px;
    &:hover{
      color: #fff;
      font-weight: 800;
      text-decoration: underline;
    }

  }
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

</style>
