import axios from 'axios';

let normalAxios = axios.create();
normalAxios.defaults.headers.common['cache-control'] = "no-cache";
normalAxios.defaults.headers.post['Content-Type'] = "no-cache";
normalAxios.defaults.headers.put['Content-Type'] = "no-cache";

export const paxios = normalAxios; // Axios For Public API

let secureAxios = axios.create();
secureAxios.defaults.headers.common['cache-control'] = "no-cache";
secureAxios.defaults.headers.post['Content-Type'] = "no-cache";
secureAxios.defaults.headers.put['Content-Type'] = "no-cache";

export const setJWTBearer = (jwt) => {
  secureAxios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}


export const saxios = secureAxios;

const localStorageAvailable = (()=>{
  let t='t';
  try{
    localStorage.setItem(t,t);
    localStorage.removeItem(t);
    return true;
  }catch(e){
    return false;
  }
})() ;

export const setLocalStorage = (key, value)=>{
  if(localStorageAvailable){
      localStorage.setItem(key, value);
      return true;
  }else{
    return false;
  }
}

export const getLocalStorage = (key) => {
  if (localStorageAvailable) {
    return localStorage.getItem(key);
  } else {
    return null;
  }
}

export const removeLocalStorage = (key) => {
  if (localStorageAvailable) {
    localStorage.removeItem(key);
    return true;
  } else {
    return false;
  }
}
