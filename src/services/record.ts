import { request } from 'umi';

// 根据botID获取所有配置的任务
export async function getAllTaskByBotId (data) {
  return request('/salesTalk/getTasksByBotId', {
    method: 'POST',
    data,
  });
}


// 更新任务
export async function updateSalesTalkTask (data) {
  return request('/salesTalk/updateSalesTalkTask', {
    method: 'POST',
    data,
  });
}

// 批量更新任务
export async function batchUpdateTask (data) {
  return request('/salesTalk/batchUpdateTask', {
    method: 'POST',
    data,
  });
}
