import request from '@/utils/request'

/**
 * 上传文件
 * @returns
 */
export function uploadFile(data) {
  return request({
    url: '/api/nft/uploadFile',
    method: 'post',
    data: data
  })
}
/**
 * 获取合约地址
 * @param {*} data
 * @returns
 */
export function getContractAddress() {
  return request({
    url: '/api/nft/getContractAddress',
    method: 'get'
  })
}
/**
 * Mint
 * @param {*} data
 * @returns
 */
export function mintNFT(data) {
  return request({
    url: '/api/nft/mintNFT',
    method: 'post',
    data: data
  })
}

/**
 * 退出
 * @returns
 */
// export function logout() {
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
// }

