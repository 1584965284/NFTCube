<template>
  <div :style="{width:width,height:height}" class="ntf-container" @click="openNft(ntfObj)">
    <!-- :preview-src-list="[$httpHead+ntfObj.s3]" -->
    <el-image :src="$httpHead+ntfObj.s3" lazy fit="cover" class="header" />
    <div v-show="false" class="logo">
      <el-image fit="cover" lazy src="https://nftrade.com/matic.png" />
    </div>
    <div class="footer">
      <el-row>
        <el-col :span="24" class="txt-ellipsis">{{ ntfObj.name }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="txt-ellipsis">作者:{{ ntfObj.author }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="txt-ellipsis">描述:{{ ntfObj.description }}</el-col>
      </el-row>
      <el-row type="flex" justify="start" align="middle" class="mgt-5">
        <el-col :span="24" class="txt-ellipsis">价格:{{ ntfObj.price }}</el-col>
      </el-row>
      <el-row type="flex" justify="space-between" align="middle" class="mgt-20">
        <el-button type="primary" class="btn" size="mini" :disabled="isOpen" @click.stop="onSold(ntfObj)">开启售卖</el-button>
        <el-button type="primary" class="btn" size="mini" :disabled="isClose" @click.stop="onClose(ntfObj)">关闭售卖</el-button>

        <!-- <el-button type="primary" class="btn" size="mini" :disabled="isDelete" @click.stop="onDelete(ntfObj)">删除NFT</el-button> -->
        <el-popover
          placement="bottom"
          width="150"
          trigger="click"
        >
          <el-select v-model="ntfObj.delete" size="mini" placeholder="请选择" @change="onVisible($event,ntfObj)">
            <el-option
              v-for="item in $visibleOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button slot="reference" type="primary" class="btn" size="mini" @click.stop="">可见权限</el-button>
        </el-popover>

        <el-button type="primary" class="btn" size="mini" :disabled="ntfObj.sign" @click.stop="onSign(ntfObj)">签名</el-button>
      </el-row>
    </div>

  </div>
</template>

<script>
import { openSold, closeSold, deleteNFT, setPrice } from '@/api/user'
import { getContractAddress, mintNFT } from '@/api/nft'
import { mapGetters } from 'vuex'
export default {
  name: 'NtfCard',
  props: {
    width: {
      type: String,
      default: '260px'
    },
    height: {
      type: String,
      default: '290px'
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ntfObj: {}
    }
  },
  computed: {
    ...mapGetters(['account']),
    isOpen() {
      const { creater, mint, owner, sold } = this.ntfObj
      if (mint) {
        return true
      } else {
        if (creater === owner) {
          return sold
        } else {
          return true
        }
      }
    },
    isClose() {
      const { creater, mint, owner, sold } = this.ntfObj
      if (mint) {
        return true
      } else {
        if (creater === owner) {
          return !sold
        } else {
          return true
        }
      }
    },
    isDelete() {
      const { owner } = this.ntfObj
      if (owner === this.account) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    data: {
      handler(val) {
        this.ntfObj = val
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.ntfObj = this.data
  },
  methods: {
    onView(nft) {

    },
    /**
     * 查看nft
     */
    openNft(nft) {
      // window.open(nft.url_cos, 'target', '')
      this.$router.push({ path: '/buy', query: { isbuy: 'no', tokenId: nft.tokenId }})
    },
    /**
     * 设置价格
     */
    onSetPrice(ntfObj) {
      const that = this
      const reg = /^[1-9][0-9]*([\.][0-9]{1,})?$/
      const { tokenId, price } = ntfObj
      try {
        if (!reg.test(price)) {
          this.$message.error('请输入数值')
          return
        }
      } catch (e) {
        this.$message.error('请输入数值')
        return
      }

      setPrice({ tokenId, price }).then(res => {
        const { msg, errcode } = res
        if (errcode) {
          that.$message.error(msg)
        } else {
          that.$message.success(msg)
        }
      }).catch(err => {
        that.$message.error(err)
      })
    },
    /**
     * 开启出售
     */
    onSold(ntfObj) {
      const that = this
      const { tokenId } = ntfObj
      openSold({ tokenId }).then(res => {
        const { errCode, data, message } = res
        if (errCode !== 0) {
          that.$message.error(message)
        } else {
          that.$message.success('已开启售卖')
          ntfObj.sold = true
        }
      }).catch(err => {
        that.$message.error(err)
      })
    },
    /**
     * 关闭出售
     */
    onClose(ntfObj) {
      const that = this
      const { tokenId } = ntfObj
      closeSold({ tokenId }).then(res => {
        const { errCode, data, message } = res
        if (errCode !== 0) {
          that.$message.error(message)
        } else {
          that.$message.success('已关闭售卖')
          ntfObj.sold = false
        }
      }).catch(err => {
        that.$message.error(err)
      })
    },
    /**
     * 删除
     */
    onDelete(ntfObj) {
      const that = this
      const { tokenId } = ntfObj
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNFT({ tokenId }).then(res => {
          const { errCode, data, message } = res
          if (errCode !== 0) {
            that.$message.error(message)
          } else {
            that.$message.success('删除成功！')
            that.$emit('delNft', tokenId)
          }
        }).catch(err => {
          that.$message.error(err)
        })
      }).catch(() => {
      })
    },
    // 设置可见权限
    onVisible(status, ntfObj) {
      const that = this
      const { tokenId } = ntfObj
      deleteNFT({ tokenId, status }).then(res => {
        const { errCode, data, message } = res
        if (errCode !== 0) {
          that.$message.error(message)
        } else {
          that.$message.success(message)
          that.$emit('delNft', tokenId)
        }
      }).catch(err => {
        that.$message.error(err)
      })
    },
    /**
     * 签名
     */
    async onSign(ntfObj) {
      const { tokenId } = ntfObj
      const upper = this
      const chainId = await this.web3.eth.getChainId()
      const { errCode, data, message } = await getContractAddress()
      if (errCode !== 0) {
        this.$message.error(message)
        return
      }
      const { address: contract_address } = data
      const msgParams = JSON.stringify({
        domain: {
          name: 'NFTCube-Voucher',
          version: '1',
          chainId: chainId,
          verifyingContract: contract_address
        },
        message: {
          tokenId: tokenId
        },
        primaryType: 'NFTVoucher',
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' }
          ],
          NFTVoucher: [
            { name: 'tokenId', type: 'uint256' }
          ]
        }
      })
      upper.web3.currentProvider.sendAsync({
        method: 'eth_signTypedData_v3',
        params: [upper.account, msgParams],
        from: upper.account
      }, function(err, result) {
        if (err) {
          return console.error(err)
        }
        if (result.error) {
          console.log(result.error.message)
        }
        upper.mintNFT(result.result, tokenId)
      })
    },
    async mintNFT(signature, tokenId) {
      const that = this
      mintNFT({ tokenId: tokenId, signature: signature }).then(res => {
        const { errCode, data, message } = res
        if (errCode !== 0) {
          that.$message.error(message)
        } else {
          that.$message.success('签名成功!')
          that.ntfObj.sign = true
        }
      }).catch(err => {
        that.$message.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn{
  // width:60px;
  padding:2px 4px;
}
.inpt{
  width:70px;
}
.inpt ::v-deep .el-input__inner{
  height: 20px !important;
  text-align: left;
  padding: 1px 2px;
}
.ntf-container{
  border: 1px solid #ebebed;
  border-radius: 8px;
  margin: 10px 15px;
  padding: 2px;
  position: relative;
  &:hover{
    cursor: pointer;
    box-shadow: 0 0.1px 0.3px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 20%);
    border: 1px solid #409EFF;
  }
}
.header{
  width:100%;
  height:158px;
  display: flex;
  justify-content: center;
  background: #EBEEF5;
}
.logo{
  position: absolute;
  right: 5px;
  top: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
.footer{
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: #6c6a82;
    background: #fff;
    padding: 9px 12px;
}
.txt-ellipsis{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
</style>
