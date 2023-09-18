import { request } from 'umi';

export async function getBranchDefaultConfig() {
  return request('/sales/talk/bot/task/branch/default/get', {
    method: 'GET',
  });
}

export async function getBotList(data?: Record<string, any>) {
  return request('/sales/talk/bot/page', {
    method: 'POST',
    data: data,
  });
}


// 送审
export async function applyAudit(data?: Record<string, any>) {
  return request('/audit/applyAudit', {
    method: 'POST',
    data: data,
  });
}

export async function createBotTalk(data: any) {
  return request('/sales/talk/bot/create', {
    method: 'POST',
    data,
  });
}

export async function deleteBotTalk(data: any) {
  return request('/sales/talk/bot/delete', {
    method: 'POST',
    data,
  });
}

export async function updateBotTalk(data: any) {
  return request('/sales/talk/bot/modify', {
    method: 'POST',
    data,
  });
}

// 保存流程
export async function saveTalkProcess(data: any) {
  return request('/sales/talk/bot/inst/create', {
    method: 'POST',
    data,
  });
}

export async function getTalkProcessById(data: any) {
  return request('/sales/talk/bot/inst/query', {
    method: 'POST',
    data,
  });
}

export async function updateTalkProcessSortById(data: any) {
  return request('/sales/talk/bot/inst/modify', {
    method: 'POST',
    data,
  });
}

export async function saveTalkProcessById(data: any) {
  return request('/sales/talk/bot/task/create', {
    method: 'POST',
    data,
  });
}

export async function getTalkProcessTaskById(data: any) {
  return request('/sales/talk/bot/task/query', {
    method: 'POST',
    params: data,
  });
}

export async function deleteTalkProcessById(data: any) {
  return request('/salesTalk/deleteSalesTalkInst', {
    method: 'POST',
    data,
  });
}

// 更新流程
export async function updateTalkProcessById(data: any) {
  return request('/salesTalk/updateSalesTalkInst', {
    method: 'POST',
    data,
  });
}
