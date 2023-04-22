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

export async function createBotTalk(data: any) {
  return request('/salesTalk/createSalesTalk', {
    method: 'POST',
    data,
  });
}

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

export async function updateTalkProcessById(data: any) {
  return request('/salesTalk/updateSalesTalkInstSort', {
    method: 'POST',
    data,
  });
}
