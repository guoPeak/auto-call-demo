import { request } from 'umi';

export async function getBranchDefaultConfig() {
  return request('/branch/getDefaultBranch', {
    method: 'GET',
  });
}

export async function getBotList(data?: Record<string, any>) {
  return request('/salesTalk/querySalesTalk', {
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
  return request('/salesTalk/createSalesTalk', {
    method: 'POST',
    data,
  });
}

export async function deleteBotTalk(data: any) {
  return request('/salesTalk/deleteSalesTalk', {
    method: 'POST',
    data,
  });
}

export async function updateBotTalk(data: any) {
  return request('/salesTalk/updateSalesTalk', {
    method: 'POST',
    data,
  });
}

// 保存流程
export async function saveTalkProcess(data: any) {
  return request('/salesTalk/saveSalesTalkInst', {
    method: 'POST',
    data,
  });
}

export async function getTalkProcessById(data: any) {
  return request('/salesTalk/getTaskInstBySalesTalkId', {
    method: 'POST',
    data,
  });
}

export async function updateTalkProcessSortById(data: any) {
  return request('/salesTalk/updateSalesTalkInstSort', {
    method: 'POST',
    data,
  });
}

export async function saveTalkProcessById(data: any) {
  return request('/salesTalk/saveInstTasks', {
    method: 'POST',
    data,
  });
}

export async function getTalkProcessTaskById(data: any) {
  return request('/salesTalk/getTasksByInstID', {
    method: 'POST',
    data,
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
