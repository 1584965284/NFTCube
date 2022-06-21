<template>
  <div class="app-container">
    <el-row id="main" type="flex" justify="center" align="middle">
      <el-col :span="12" class="title">艺术创作工厂</el-col>
    </el-row>
    <!-- 介绍 -->
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="12" class="content">
        数字作品基本上可以代表任何类型的数字文件，包含图片、视频、，GIF、音频文件以及它们的综合,未来的艺术家，快来尝试吧！
      </el-col>
    </el-row>
    <!-- 表单数据 -->
    <el-form ref="dataForm" :model="temp" label-position="top" :rules="rules">
      <el-row type="flex" justify="center" align="middle" style="margin-top:10px">
        <el-col :span="12">
          <el-form-item label="文件上传" required>
            添加您独特的图像
            <el-upload
              ref="upload"
              class="upload wdtp-100"
              :before-upload="beforeAvatarUpload"
              drag
              :on-change="handleChange"
              action="#"
              :file-list="fileList"
              :on-exceed="handleExceed"
              :auto-upload="true"
              :limit="1"
            >
              <!-- <i class="el-icon-upload" /> -->
              <div class="el-upload__text">JPG或PNG最大30MB。</div>
              <el-button class="bnt-upload" @click.prevent="">选择文件</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle" style="margin-top:10px">
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            为你的数字作品选择一个唯一的名称
            <el-input v-model="temp.name" maxlength="100" placeholder="请输入数字作品名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle" style="margin-top:10px">
        <el-col :span="12">
          <el-form-item label="描述" prop="description">
            描述您的数字作品，帮助其他用户了解它的独特之处
            <el-input v-model="temp.description" maxlength="500" type="textarea" :rows="4" placeholder="请输入数字作品描述" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="userLevel!==1" type="flex" justify="center" align="middle" style="margin-top:10px">
        <el-col :span="12">
          <el-form-item label="标签" prop="labels">
            列出代表您的数字作品标签
            <!-- <el-input v-model="temp.labels" maxlength="200" placeholder="请输入数字作品标签" /> -->
            <el-select v-model="temp.labels" multiple class="wdtp-100" clearable placeholder="请输入数字作品标签">
              <el-option
                v-for="item in labelsOpts"
                :key="item.label"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle" style="margin-top:10px">
        <el-col :span="12">
          <el-form-item label="等级" prop="rank">
            请选择代表您数字作品的等级
            <el-select v-model="temp.level" class="wdtp-100" clearable placeholder="请选择数字作品等级" @change="onRank">
              <el-option
                v-for="item in rankOptsByLevel"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle" style="margin-top:10px">
        <el-col v-show="showNumInput" :span="12">
          <el-form-item label="数量" prop="num">
            <el-input v-model.number="temp.num" maxlength="10" placeholder="请输入数量" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle" style="margin-top:10px">
        <el-col :span="12">
          <el-form-item label="价格" prop="price">
            I级0~100, II级101~1000, III级企业用户专用
            <el-input v-model="temp.price" maxlength="10" placeholder="请输入数字作品价格" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 条款说明 -->
      <el-row type="flex" justify="center" align="middle" class="mgt-10">
        <el-col :span="12" class="lbl-3">
          请注意！铸造后将不可修改信息，请确认信息填写无误。
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle" class="mgt-10">
        <el-col :span="12" class="lbl-1">
          <el-checkbox v-model="checkedPTL1" /> 我确认我是所有者或拥有出版权和销售权。
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle" class="mgt-3">
        <el-col :span="12" class="lbl-1">
          <el-checkbox v-model="checkedPTL2" /> 我同意CUBE的<em class="lbl-2" @click="dialogPTL=true">条款和条件。</em>
        </el-col>
      </el-row>

      <!-- 铸造按钮 -->
      <el-row type="flex" justify="center" align="middle" class="mgt-40 mgb-20">
        <el-button type="primary" :loading="loading" class="btn-create" @click.stop="onSubmit">发 布</el-button>
      </el-row>
    </el-form>

    <!-- 实名认证弹框 -->
    <el-dialog
      title="实名认证"
      class="my-dialog"
      :visible.sync="dialogID"
      width="30%"
      :close-on-click-modal="false"
      @open="openBeforeDialog"
      @closed="colseBeforDialog"
    >
      <div slot="title" class="dialog-tilte">
        实名认证
      </div>
      <el-form ref="dataForm2" :model="IDForm" :rules="IDRules" hide-required-asterisk label-position="top" label-width="120px">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="IDForm.name" :placeholder="IDRules.name[0].message" />
        </el-form-item>
        <el-form-item prop="identity" label="身份证号">
          <el-input v-model="IDForm.identity" :placeholder="IDRules.identity[0].message" />
        </el-form-item>
        <p style="line-height:22px">
          应国家法律犯规要求，购买前请完成实名认证。实名认证完成之后，您的提现账户将与此实名信息进行绑定，请知晓！<br>
          即将创作得作品若存在侵权行为请及时下架，若有任何法律问题，平台将根据实名信息进行处理。
        </p>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="btn-common" style="background:#0E7AC3" @click="onVerify"> 保 存</el-button>
        <el-button class="btn-common" style="background:#B0B0B0" @click="dialogID = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 订单支付弹框 -->
    <el-dialog
      title="订单支付"
      class="my-dialog2"
      :visible.sync="dialogPay"
      width="400px"
      :close-on-click-modal="false"
      @open="openBeforeDialog"
      @closed="colseBeforDialog"
    >
      <div slot="title" class="dialog-tilte">
        订单支付
      </div>
      <div class="pay-info">
        请选择支付方式
      </div>
      <div class="flex-column flex-hs flex-vc">
        <div class="flex-row flex-sb flex-vc wdtp-100 pd-8">
          <div class="wdt-200 flex-row flex-hs flex-vc">
            <el-image class="wdt-40 hgt-40 mgr-10" fit="contain" :src="require('@/assets/images/zfb.png')" />
            <span>支付宝支付</span>
          </div>
          <li class="dot" :class="{'dotted':payWay==1}" @click="payWay=1" />
        </div>
        <div class="flex-row flex-sb flex-vc wdtp-100 pd-8">
          <div class="wdt-200 flex-row flex-hs flex-vc">
            <el-image class="wdt-40 hgt-40 mgr-10" fit="contain" :src="require('@/assets/images/change.png')" />
            <span>零钱支付</span>
          </div>
          <li class="dot" :class="{'dotted':payWay==2}" @click="payWay=2" />
        </div>
        <div v-show="false" class="flex-row flex-sb flex-vc wdtp-100 pd-8">
          <div class="wdt-200 flex-row flex-hs flex-vc">
            <el-image class="wdt-40 hgt-40 mgr-10" fit="contain" :src="require('@/assets/images/wx.png')" />
            <span>微信支付（暂不支持）</span>
          </div>
          <li class="dot" :class="{'dotted':payWay==3}" @click="payWay=3" />
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="btn-pay" style="background:#0E7AC3" @click="onPay">
          确认支付<svg-icon icon-class="rmb3" class="font-20" />{{ money }}
        </el-button>
      </span>
    </el-dialog>

    <!-- c查看协议弹框 -->
    <el-dialog
      title="查看条款条件"
      class="my-dialog2"
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
import { uploadFile } from '@/api/nft'
import { getVerifiedInfo, verify, withdraw } from '@/api/user'
import { getLabels } from '@/api/group'
import { mapGetters } from 'vuex'
import protocolTxt from '@/api/protocol'
export default {
  name: 'MarketCreatArt',
  components: {
  },
  data() {
    // 价格自定义验证方法
    const validatePrice = (rule, value, callback) => {
      if (value !== undefined && value !== '' && value !== null) {
        if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value)) {
          callback(new Error('请输入有效数值'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
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
      payWay: 0,
      money: 10,
      dialogID: false,
      dialogPay: false,
      fileList: [],
      loading: false,
      temp: {
        level: undefined
      },
      IDForm: {
        name: '',
        identity: ''
      },
      sortType: 1,
      dialogPTL: false,
      rules: {
        num: [{ required: true, message: `输入数量`, trigger: 'blur' }, { pattern: /^[1-9]*$/, message: '请输入大于0的正整数', trigger: 'blur' }],
        name: { required: true, message: `输入数字作品名称`, trigger: 'blur' },
        labels: { required: false, message: `输入数字作品标签`, trigger: 'blur' },
        level: { required: true, message: `请选择数字作品等级`, trigger: 'blur' },
        price: [{ required: true, message: `请输入数字作品价格`, trigger: 'blur' }, { validator: validatePrice, trigger: 'blur' }],
        file: { required: false, message: `添加唯一的图像`, trigger: 'blur' },
        description: { required: false, message: `输入数字作品描述`, trigger: 'blur' }
      },
      IDRules: {
        name: [{ required: true, message: `输入您的真实姓名`, trigger: 'blur' },
          { min: 2, max: 100, message: `至少输入2个字以上符且在100个字符以内`, trigger: 'blur' }],
        identity: [{ required: true, message: `请输入您的身份证号`, trigger: 'blur' },
          { validator: validateID, trigger: 'blur' }]

      },
      rankOpts: [
        {
          label: 'I级',
          value: 1
        },
        {
          label: 'II级',
          value: 2
        },
        {
          label: 'III级',
          value: 3
        },
        {
          label: 'Ⅳ级',
          value: 4
        }
      ],
      labelsOpts: [],
      checkedPTL1: 0,
      checkedPTL2: 0,
      protocol: protocolTxt
    }
  },
  computed: {
    ...mapGetters(['isConnect', 'name', 'account', 'userLevel']),
    rankOptsByLevel() {
      if (this.userLevel > 1) {
        return [this.rankOpts[2], this.rankOpts[3]]
      } else {
        return [this.rankOpts[0], this.rankOpts[1]]
      }
    },
    showNumInput() {
      const { level } = this.temp
      if (level === 4) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    // 获取热门标签
    if (Number(this.userLevel) > 1) {
      getLabels().then(res => {
        const { data, errCode, message } = res
        if (errCode === 0) {
          const { labels } = data
          this.labelsOpts = labels.map(e => {
            return { label: e.name, value: e.name }
          })
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  },
  mounted() {},
  methods: {
    // 付款
    onPay() {
      if (this.payWay === 0) {
        this.$message.warning('请选择支付方式！')
        return
      }
      const that = this
      if (this.money > 0 && this.payWay === 2) {
        // 零钱支付
        withdraw({ num: parseInt(this.money) }).then(res => {
          const { errCode, data, message } = res
          if (errCode !== 0) {
            that.$message.error(message)
            return
          }
          that.$message.success('支付成功！')
          that.$refs.dataForm.resetFields()
          that.fileList = []
          that.dialogPay = false
          that.$router.push({ path: `/my`, query: { active: 21 }})
        }).catch(_ => {
          that.$message.error('扣款失败')
        })
      } else {
        // 支付宝支付
        that.$message.success('支付成功！')
      }
    },
    // 选择等级
    onRank(val) {
      // if (val === 3) {
      //   this.$message.warning('暂未开通')
      // }
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3)
    },
    openBeforeDialog() {
      this.$refs.dataForm2.resetFields()
    },
    colseBeforDialog() {
      this.$refs.dataForm2.clearValidate()
    },

    // 用户认证
    async onVerify() {
      const valid = await this.$refs.dataForm2.validate().catch(_ => false)
      if (valid) {
        const { name, identity } = this.IDForm
        const { errCode, message } = await verify({ realName: name, idCard: identity }).catch(_ => {
          this.$message.error('认证失败！')
        })
        if (errCode !== 0) {
          this.$message.error(message)
        } else {
          this.dialogID = false
          this.$message.success('认证成功！')
        }
      } else {
        this.$message.error('数据校验失败！')
      }
    },
    async onSubmit() {
      // 钱包是否链接
      if (!this.isConnect) {
        this.$message.warning('请先登录！')
        return
      }
      // 版权协议是否勾选
      if (!this.checkedPTL1 || !this.checkedPTL2) {
        this.$message.warning('请勾选版权说明及协议条款！')
        return
      }

      // 判断是否认证
      const { errCode, data, message } = await getVerifiedInfo().catch(err => err)
      if (errCode !== 0) {
        this.$message.info(message)
        return
      }
      const { verified_status } = data
      if (!verified_status) {
        this.$message.info('请先完成实名认证!')
        this.dialogID = true
        return
      }

      // 表单数据校验
      const valid = await this.$refs.dataForm.validate().catch(_ => false)
      if (valid) {
        if (!this.temp.file) {
          this.$message.error('请上传文件')
          return
        }

        // 验证价格与等级是否匹配
        if (this.temp.level === 2) {
          if (this.temp.price <= 100 || this.temp.price > 1000) {
            this.$message.warning('II等级与价格不匹配！')
            return
          }
        } else if (this.temp.level === 1) {
          if (this.temp.price < 0 || this.temp.price > 100) {
            this.$message.warning('I等级与价格不匹配！')
            return
          }
        }

        if (this.temp.level === 1) {
          this.money = (30 * 0.85).toFixed(2)
        } else {
          this.money = ((30 + (this.temp.price - 100) * 0.15) * 0.85).toFixed(2)
        }
        if (this.userLevel > 1) {
          this.createNFT()
        } else {
          // 提示铸造价格
          this.$confirm(`铸造艺术品需支付￥${this.money}, 是否继续?`, '提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.createNFT()
          }).catch(() => {
            console.log('已取消铸造')
          })
        }
      } else {
        this.$message.error('数据验证失败')
      }
    },

    // 提交创建数据
    async createNFT() {
      const that = this
      const formData = new FormData()
      formData.append('name', this.temp.name)
      formData.append('description', this.temp.description)
      formData.append('labels', `${'ArtProduct'},${this.temp.labels}`)
      formData.append('price', this.temp.price)
      formData.append('level', this.temp.level)
      formData.append('num', this.temp.level > 3 ? this.temp.num ??= '' : '')
      formData.append('author', this.name)
      formData.append('file', this.temp.file)
      this.loading = true
      const { errCode, data, message } = await uploadFile(formData).catch(_ => { return })
      this.loading = false
      if (errCode !== 0) {
        this.$message.error(message)
      } else {
        that.$message({ message: '铸造成功,作品正在审核,请耐心等待！', type: 'success', duration: 5000, showClose: true })

        that.$refs.dataForm.resetFields()
        that.fileList = []
        that.$router.push({ path: `/my`, query: { active: 21 }})
      }
    },

    // 上传作品文件
    beforeAvatarUpload(file) {
      // const types = ['jpg', 'png', 'webp', 'mp4', 'mp3', 'gif']
      const types = ['jpg', 'png', 'gif']
      console.log(file)
      if (file.size / 1024 / 1024 > 30) {
        this.$message.error('文件大小不能超过30MB!')
        return false
      }
      const stuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
      const exist = types.some(e => stuffix === e)
      if (!exist) {
        this.$message.error('请上传指定格式的文件！')
        this.fileList = []
        return false
      }
      this.temp.file = file
      return false
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    }
  }

}
</script>

<style lang="scss" scoped>

.app-container{
  width: 100%;
  padding:0px;
  margin: 0;
  overflow: auto;
  font-family: Proxima Nova,sans-serif;
  color: rgb(129, 143, 163);
}

.title{
  text-align: center;
  font-weight: 600;
  font-size: 28px;
  line-height: 36px;
}
.content{
  text-align: center;
  font-size: 16px;

}

#main{
  width: 100%;
  padding: 10px 30px ;
  margin: 10px 0px 0px 0px;
  // border:1px solid green;
}
.upload{
  width: 100%;
}
.el-upload__text,.bnt-upload{
  color: rgb(129, 143, 163);
}

.btn-create{
  min-width: 160px;
  margin-top: 8px;
  height: 40px;
  text-align: center;
  background: #0E7AC3;
  border: 1px solid transparent;
  border-radius: 4px;
  color: #fff;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 1px;
  cursor: pointer;
}
.upload ::v-deep .el-upload{
  width: 100% !important;
}
.upload ::v-deep .el-upload-dragger{
  width: 100% !important;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.lbl-1{
  font-size: 12;
}
.lbl-2{
  color: #409EFF;
  text-decoration: underline;
  &:hover{
    cursor: pointer;
    color: #409EFF;
  }

}
.lbl-3{
  color: #ff0000;
  font-size: 13;
  font-weight: 800;
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
.btn-pay{
  color: #fff;
  background: #0E7AC3;
  font-size: 16px;
  font-weight: 600;
  border-radius:10px ;
}

.my-dialog2{
  ::v-deep{
    .el-dialog__body{
      padding:0px!important;
      }
  }
}
.pay-info{
  width: 100%;
  background: #F5F5F5;
  font-size: 18px;
  opacity: 0.7;
  padding: 15px 3px;
}
.dot{
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 50%;
  list-style-type:none;
  &:hover{
    cursor: pointer;
    transform: scale(1.1);
    box-shadow: 0px 0px 2px #409EFF;
  }
}
.dotted{
  border: 0px;
  padding: 1px;
  background: #0E7AC3;
  box-shadow: 0px 0px 5px #409EFF;
}

</style>
