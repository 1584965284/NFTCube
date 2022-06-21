import request from '@/utils/request'
// 文件下载
export const download = (url, params) => {
  return request({
    url: url,
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/octet-stream' // 流
    },
    data: params
  })
}
