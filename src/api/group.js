import request from '@/utils/request'
/**
 * 获取机构
 * @param {*} data
 * @returns
 */
export function getAgencies(data) {
  return request({
    url: '/api/market/getAgencies',
    method: 'post',
    data
  })
}

/**
 * 获取单个机构详情
 * @param {*} data
 * @returns
 */
export function getAgencyInfo(data) {
  return request({
    url: '/api/agency/getAgencyInfo',
    method: 'post',
    data
  })
}

/**
 * 获取机构成员
 * @param {*} data
 * @returns
 */
export function getMembers(data) {
  return request({
    url: '/api/agency/getMembers',
    method: 'post',
    data
  })
}

/**
 * 创建机构
 * @param {*} data
 * @returns
 */
export function createAgency(data) {
  return request({
    url: '/api/agency/createAgency',
    method: 'post',
    data
  })
}

/**
 * 管理员查看申请
 * @param {*} data
 * @returns
 */
export function getApplications(data) {
  return request({
    url: '/api/agency/getApplications',
    method: 'post',
    data
  })
}

/**
 * 管理员审核加入申请
 * @param {*} data
 * @returns
 */
export function auditApplication(data) {
  return request({
    url: '/api/agency/auditApplication',
    method: 'post',
    data
  })
}

/**
 * 修改机构信息
 * @param {*} data
 * @returns
 */
export function changeAgencyInfo(data) {
  return request({
    url: '/api/agency/changeAgencyInfo',
    method: 'post',
    data
  })
}

// /**
//  * 上传机构头像
//  * @param {*} data
//  * @returns
//  */
// export function agencyAvatar(data) {
//   return request({
//     url: '/api/agency/agencyAvatar',
//     method: 'post',
//     data
//   })
// }

/**
 * 获取机构标签
 * @param {*} data
 * @returns
 */
export function getLabels() {
  return request({
    url: '/api/agency/getLabels',
    method: 'get'
  })
}

/**
 * 添加构标签
 * @param {*} data
 * @returns
 */
export function createLabel(data) {
  return request({
    url: '/api/agency/createLabel',
    method: 'post',
    data
  })
}

/**
 * 删除标签
 * @param {*} data
 * @returns
 */
export function deleLabel(data) {
  return request({
    url: '/api/agency/deleLabel',
    method: 'post',
    data
  })
}

/**
 * 获取抽成比例
 * @param {*} data
 * @returns
 */
export function getRatio() {
  return request({
    url: '/api/agency/getRatio',
    method: 'get'
  })
}

/**
 * 设置抽成比例
 * @param {*} data
 * @returns
 */
export function setRatio(data) {
  return request({
    url: '/api/agency/setRatio',
    method: 'post',
    data
  })
}

/**
 * 查看抽成记录
 * @param {*} data
 * @returns
 */
export function drawTable(data) {
  return request({
    url: '/api/agency/drawTable',
    method: 'post',
    data
  })
}

/**
 * 机构上传头像
 * @param {*} data
 * @returns
 */
export function uploadHeader(data) {
  return request({
    url: '/api/agency/avatarA',
    method: 'post',
    data
  })
}
/**
 * 机构上传头像
 * @param {*} data
 * @returns
 */
export function uploadBackground(data) {
  return request({
    url: '/api/agency/backgroundA',
    method: 'post',
    data
  })
}

