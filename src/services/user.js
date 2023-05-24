import { request } from 'umi';


export async function queryCurrentUser () {
  // return request('/info', {
  //   method: 'GET',
  // });

  return new Promise((resolve, reject) => {
    resolve({
      data: {}
    })
  })
}

export async function login (data) {
  return request('/auth/account/pc/login', {
    method: 'POST',
    data,
  });
}

export async function loginOut (data) {
  return request('/auth/account/pc/logout', {
    method: 'POST',
    data,
  });
}


