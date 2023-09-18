import { request } from 'umi';

// 根据botID获取所有配置的任务
export async function getAllTaskList (data) {
  return request('/talk/task/group/page', {
    method: 'POST',
    data,
  });
}