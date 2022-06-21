<template>
  <div class="app-container" :style="{width:width,height:height}">
    <div class="wdtp-100 box-border pd-10">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>我的钱包</el-breadcrumb-item>
        <el-breadcrumb-item>第三方支付</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="ctx" class="flex-row flex-sb flex-vc pdtb-20 pdlr-8">
      <div class="wdt-200 flex-row flex-hs flex-vc wdtp-20">
        <el-image class="wdt-40 hgt-40 mgr-10" fit="contain" :src="require('@/assets/images/zfb.png')" />
        <span>支付宝支付</span>
      </div>
      <div class="flex-row flex-hc flex-vc wdtp-70">
        <p class="mgr-50">{{ isBindAlipay?`姓名: ${temp.alipayName}`:'暂无设置' }}</p>
        <p v-if="temp.alipayAddress">支付宝账号: {{ temp.alipayAddress }}</p>

      </div>
      <div v-if="!isBindAlipay" class="wdtp-10 txt-algin-r mgr-3" style="color:#0E7AC3" @click="dialogVisible=true">
        <em class="bind">绑定</em>
      </div>
      <div v-else class="wdtp-10 txt-algin-r mgr-3" style="color:#0E7AC3">
        <em>已绑定</em>
      </div>

    </div>

    <!-- 支付宝绑定弹框 -->
    <el-dialog
      title="支付宝绑定"
      class="my-dialog"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
      @opened="openBeforeDialog"
      @close="colseBeforDialog"
    >
      <div slot="title" class="dialog-tilte">
        支付宝绑定
      </div>
      <div class="pd-10" style=" flex-row flex-hs flex-vc">
        <el-form ref="dataForm" :model="temp" :rules="rules" hide-required-asterisk label-position="top" label-width="120px">
          <el-form-item prop="alipayName" label="真实姓名">
            <el-input v-model="temp.alipayName" :placeholder="rules.alipayName[0].message" />
          </el-form-item>
          <el-form-item prop="alipayAddress" label="支付宝账号">
            <el-input v-model="temp.alipayAddress" :placeholder="rules.alipayAddress[0].message" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer flex-row flex-hvc">
        <el-button type="primary" class="btn-common" style="background:#0E7AC3" @click="onBindAlipay">绑 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { changeWithdrawInfo, getWithdrawInfo, alipayAuthorize } from '@/api/user'
import { mapGetters } from 'vuex'
export default {
  name: 'PayWayCompt',
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
      isBindAlipay: false,
      dialogVisible: false,
      temp: {
        alipayName: '',
        alipayAddress: ''
      },
      rules: {
        alipayName: [{ required: true, message: `请输真实姓名`, trigger: 'blur' }],
        alipayAddress: [{ required: true, message: `请输入支付宝账号`, trigger: 'blur' }]

      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  created() {
    getWithdrawInfo().then(res => {
      const { errCode, data, message } = res
      if (errCode !== 0) {
        this.$message.error(message)
      } else {
        const { alipay_name, alipay_address } = data
        if (alipay_address) {
          this.isBindAlipay = true
          this.$set(this.temp, 'alipayName', alipay_name)
          this.$set(this.temp, 'alipayAddress', alipay_address)
        }
      }
    }).catch(err => {
      this.$message.error(err)
    })
  },
  methods: {
    // 支付宝绑定
    async onBindAlipay() {
      const valid = await this.$refs.dataForm.validate().catch(_ => false)
      if (valid) {
        const { alipayName, alipayAddress } = this.temp
        const params = { alipay_name: alipayName, alipay_address: alipayAddress }
        const { errCode, data, message } = await changeWithdrawInfo(params).catch(err => err)
        if (errCode !== 0) {
          this.$message.error(message)
        } else {
          const { alipay_name, alipay_address } = data
          this.alipayName = alipay_name
          this.alipayAddress = alipay_address
          this.bindAlipayAuth()
        }
      } else {
        this.$message.error('数据验证失败!')
      }
    },
    // 支付宝绑定
    async bindAlipayAuth() {
      const { errCode, data, message } = await alipayAuthorize({ address: this.account }).catch(err => { return { errCode: -1, message: err } })
      if (errCode !== 0) {
        this.$message.error(message)
      } else {
        const { authorizeUrl } = data
        this.dialogVisible = false
        this.isBindAlipay = true
        window.open(authorizeUrl, '_blank')
      }
    },
    // 打开弹窗后opened
    openBeforeDialog() {
      this.$refs.dataForm.resetFields()
    },
    // 关闭弹窗后
    colseBeforDialog() {
      this.$refs.dataForm.clearValidate()
    }
  }

}

</script>

<style lang="scss" scoped>
#ctx{
  width: 100%;
  border: 1px dashed #ccc;
}
.bind{
  &:hover{
    cursor: pointer;
    transform: scale(1.1);
    font-weight: 550;
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
    .el-dialog__body{
      padding: 5px 20px !important;
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
  font-size: 16px;
  font-weight: 600;
  width: 120px;
  border-radius:10px ;
}
</style>
