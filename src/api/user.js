import request from '@/utils/request'
/**
 * 登录
 * @param {*} data
 * @returns
 */
export function getNonce(data) {
  return request({
    url: '/api/login/getNonce',
    method: 'post',
    data
  })
}
/**
 * 退出
 * @param {*} data
 * @returns
 */
export function logout(data) {
  // return request({
  //   url: '/api/login/logout',
  //   method: 'post',
  //   data
  // })
}
/**
 * 签名
 * @param {*} data
 * @returns
 */
export function checkSign(data) {
  return request({
    url: '/api/login/checkSign',
    method: 'post',
    data
  })
}
/**
 * 查看用户
 * @returns
 */
export function getInfo() {
  return request({
    url: '/api/user/getUserInfo',
    method: 'get'
  })
}
/**
 * 切换用户
 * @returns
 */
export function changeUserInfo(data) {
  return request({
    url: '/api/user/changeUserInfo',
    method: 'post',
    data: data
  })
}

/**
 * 获取用户的NFT
 * @returns
 */
export function getNFTs(data) {
  return request({
    url: '/api/user/getNFTs',
    method: 'post',
    data: data
  })
}

/**
 * 获取用户的NFT的数量
 * @returns
 */
export function getNFTsNum(params) {
  return request({
    url: '/api/user/getNFTsNum',
    method: 'get',
    params
  })
}

/**
 * 获取实名认证信息
 * @returns
 */
export function getVerifiedInfo() {
  return request({
    url: '/api/user/getVerifiedInfo',
    method: 'get'
  })
}

/**
 * 实名认证
 * @returns
 */
export function verify(data) {
  return request({
    url: '/api/user/authentication',
    method: 'post',
    data: data
  })
}

/**
 * 获取用户钱包余额
 * @returns
 */
export function getBalance() {
  return request({
    url: '/api/user/wallet/getBalance',
    method: 'get'
  })
}

/**
 * 获取提现信息
 * @returns
 */
export function getWithdrawInfo() {
  return request({
    url: '/api/user/wallet/getWithdrawInfo',
    method: 'get'
  })
}

/**
 * 设置提现信息
 * @returns
 */
export function changeWithdrawInfo(data) {
  return request({
    url: '/api/user/wallet/changeWithdrawInfo',
    method: 'post',
    data: data
  })
}

/**
 * 钱包充值
 * @returns
 */
export function recharge(data) {
  return request({
    url: '/api/user/wallet/recharge',
    method: 'post',
    data: data
  })
}

/**
 * 钱包提现
 * @returns
 */
export function withdraw(data) {
  return request({
    url: '/api/user/wallet/withdraw',
    method: 'post',
    data: data
  })
}

export function getNFTSold() {
  return request({
    url: '/api/nft/getNFTSold',
    method: 'get'
  })
}

/**
 * NFT开启售卖
 * @param {*} data
 * @returns
 */
export function openSold(data) {
  return request({
    url: '/api/user/nft/openSold',
    method: 'post',
    data: data
  })
}
/**
 * NFT关闭售卖
 * @param {*} data
 * @returns
 */
export function closeSold(data) {
  return request({
    url: '/api/user/nft/closeSold',
    method: 'post',
    data: data
  })
}
/**
 * NFT设置价格
 * @param {*} data
 * @returns
 */
export function setPrice(data) {
  return request({
    url: '/api/user/nft/setPrice',
    method: 'post',
    data: data
  })
  // {tokenId: nft.tokenId,price: parseInt(nft.price)}
}
/**
 * NFT购买
 * @param {*} data
 * @returns
 */
export function buyNFT(data) {
  return request({
    url: '/api/user/nft/buy',
    method: 'post',
    data: data
  })
  // {tokenId: nft.tokenId}
}
/**
 * NFT删除
 * @param {*} data
 * @returns
 */
export function deleteNFT(data) {
  return request({
    url: '/api/user/nft/delete',
    method: 'post',
    data: data
  })
  // {tokenId: nft.tokenId}
}

/**
 * 累计收益金额
 * @param {*} data
 * @returns
 */
export function getProfit(data) {
  return request({
    url: '/api/user/getProfit',
    method: 'get',
    params: data
  })
}

/**
 * 修改密码
 * @param {*} data
 * @returns
 */
export function changePassword(data) {
  return request({
    url: '/api/user/changePassword',
    method: 'post',
    data: data
  })
}

/**
 * 修改交易密码
 * @param {*} data
 * @returns
 */
export function changePaymentPassword(data) {
  return request({
    url: '/api/user/changePaymentPassword',
    method: 'post',
    data: data
  })
}

/**
 * 用户名登录
 * @param {*} data
 * @returns
 */
export function loginByLoginName(data) {
  return request({
    url: '/api/login/loginByLoginName',
    method: 'post',
    data: data
  })
}

/**
 * 手机号登录
 * @param {*} data
 * @returns
 */
export function loginByPhoneNumber(data) {
  return request({
    url: '/api/login/loginByPhoneNumber',
    method: 'post',
    data: data
  })
}

/**
 * 获取验证码
 * @returns
 */
export function getVerificationCode(data) {
  return request({
    url: '/api/getVerificationCode',
    method: 'post',
    data: data
  })
}

/**
 * 绑定手机号
 * @returns
 */
export function bindPhone(data) {
  return request({
    url: '/api/user/bindPhone',
    method: 'post',
    data: data
  })
}

/**
 * 用户注册
 * @returns
 */
export function register(data) {
  return request({
    url: '/api/user/register',
    method: 'post',
    data: data
  })
}

/**
 * 支付宝支付接口
 * @returns
 */
export function getAlipay(data) {
  return request({
    url: '/api/market/getAlipay',
    method: 'post',
    data: data
  })
}

/**
 * 生成邀请码
 * @returns
 */
export function createCode() {
  return request({
    url: '/api/user/createCode',
    method: 'get'
  })
}

/**
 * 生成分享海报
 * @returns
 */
export function createPoster(data) {
  return request({
    url: '/api/user/createPoster',
    method: 'post',
    data: data
  })
}

// 支付宝提现
export function alipayWithdraw(data) {
  return request({
    url: '/api/market/alipayWithdraw',
    method: 'post',
    data: data
  })
}

// 名认证与支付宝账户实名验证
export function alipayAuthorize(data) {
  return request({
    url: '/api/market/alipayAuthorize',
    method: 'post',
    data: data
  })
}

/**
 * 获取用户数据
 * @returns
 */
export function getUserList(data) {
  return request({
    url: '/api/master/getUserInfo',
    method: 'post',
    data: data
  })
}

/**
 * 获取用户数据
 * @returns
 */
export function changeUserLevel(data) {
  return request({
    url: 'api/master/changeUserInfo',
    method: 'post',
    data: data
  })
}

/**
 * 查询邀请码和有效期
 * @returns
 */
export function getIcodeTmt(data) {
  return request({
    url: '/api/user/getIcodeTmt',
    method: 'get'
  })
}

/**
 * 下载插件
 * @returns
 */
export function dlMetaMask(data) {
  return request({
    url: '/api/dlMetaMask',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

/**
 * 用户头像
 * @returns
 */
export function uploadHeader(data) {
  return request({
    url: '/api/user/avatar',
    method: 'post',
    data: data
  })
}

/**
 * 查看粉丝数量
 * @returns
 */
export function getFansNum(data) {
  return request({
    url: '/api/user/interact/getFansNum',
    method: 'post',
    data: data
  })
}

/**
 * 查看关注者数量
 * @returns
 */
export function getFollowNum() {
  return request({
    url: '/api/user/interact/getFollowNum',
    method: 'get'
  })
}

/**
 * 关注用户
 * @returns
 */
export function followUser(data) {
  return request({
    url: '/api/user/interact/follow',
    method: 'post',
    data: data
  })
}

/**
 * 取消关注用户
 * @returns
 */
export function unfollowUser(data) {
  return request({
    url: '/api/user/interact/unfollow',
    method: 'post',
    data: data
  })
}

/**
 * 点赞用户
 * @returns
 */
export function likeUser(data) {
  return request({
    url: '/api/user/interact/like',
    method: 'post',
    data: data
  })
}

/**
 * 取消点赞用户
 * @returns
 */
export function unlikeUser(data) {
  return request({
    url: '/api/user/interact/unlike',
    method: 'post',
    data: data
  })
}

/**
 * 查询我是否关注点赞
 * @returns
 */
export function queryIsAgreeAndIsFllow(data) {
  return request({
    url: '/api/user/interact/query',
    method: 'post',
    data: data
  })
}

/**
 * 加入机构
 * @returns
 */
export function joinAgency(data) {
  return request({
    url: '/api/agency/joinAgency',
    method: 'post',
    data: data
  })
}

/**
 * 查看消息
 * @returns
 */
export function getMes(data) {
  return request({
    url: '/api/user/interact/getMes',
    method: 'post',
    data: data
  })
}

/**
 * 艺术家认证
 * @returns
 */
export function artistVerify(data) {
  return request({
    url: '/api/user/artistVerify',
    method: 'post',
    data: data
  })
}

