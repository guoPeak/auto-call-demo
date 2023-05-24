
const TOKEN = '__token__'

export function getToken () {
  // let token = ''
  // const info = useModel('common');
  // token = info.token
  // console.log(token);
 
  // if (!token) {
    // let token = localStorage.getItem(TOKEN)
  // }

  return localStorage.getItem(TOKEN) || ''

}

export function setToken (token) {
  localStorage.setItem(TOKEN, token)
}

export function removeToken (token) {
  localStorage.removeItem(TOKEN)
}
