import request from '@/utils/request'

/**
 * 获取市场满足相应属性的NFT
 * @returns
 */
export function getNFTs(data) {
  return request({
    url: '/api/market/getNFTs',
    method: 'post',
    data
  })
}
/**
 * 获取市场满足相应属性的NFT数量
 * @returns
 */
export function getNFTsNum(params) {
  return request({
    url: '/api/market/getNFTsNum',
    method: 'get',
    params
  })
}

/**
 * 商品页获取单个NFT信息
 * @returns
 */
export function getANFT(data) {
  return request({
    url: '/api/market/getANFT',
    method: 'post',
    data
  })
}
/**
 * 获取艺术家数量
 * @returns
 */
export function getAritistsNum() {
  return request({
    url: '/api/market/getAritistsNum',
    method: 'get'
  })
}
/**
 * 获取市场艺术家
 * @returns
 */
export function getAritists(data) {
  return request({
    url: '/api/market/getAritists',
    method: 'post',
    data
  })
}
/**
 * 获取艺术家根据地址
 * @param {*} data
 * @returns
 */
export function getArtistInfo(data) {
  return request({
    url: '/api/market/getArtistInfo',
    method: 'post',
    data: data
  })
}
/**
 * 获取某个人的NFT数量
 * @returns
 */
export function getAritistsNFTsNum() {
  return request({
    url: '/api/market/getAritistsNFTsNum',
    method: 'get'
  })
}
/**
 * 获取某个人的NFT
 * @returns
 */
export function getAritistsNFTs(params) {
  return request({
    url: '/api/market/getAritistsNFTs',
    method: 'get',
    params
  })
}

/**
 * 获取艺术家根据地址
 * @param {*} data
 * @returns
 */
export function getLabel(data) {
  return request({
    url: '/api/market/getLabel',
    method: 'post',
    data: data
  })
}

/**
 * 导航栏查询
 * @returns
 */
export function searchByKeyWords(data) {
  return request({
    url: '/api/market/search',
    method: 'post',
    data: data
  })
}
