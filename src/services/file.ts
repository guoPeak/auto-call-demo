import { request } from 'umi';

// 上传文件
export async function uploadFile (data) {
  return request('/file/upload', {
    method: 'POST',
    data,
  });
}

// 下载文件
export async function downloadFile (params) {
  return request('/file/download', {
    method: 'GET',
    params,
  });
}