import { getLocal, saveLocal, delLocal } from '@/util/util'

const SET_USERNAME = 'SET_USERNAME';
const SET_VIEW = 'SET_VIEW';
const SET_PATH = 'SET_PATH';
const INIT_DATA = 'INIT_DATA';
const SET_FIRST_VIEW = 'SET_FIRST_VIEW';
const DEL_RECORD = 'DEL_RECORD';

export default {
  //设置用户名
  [SET_USERNAME](state, name){
    localStorage.setItem('username', name);
    state.username = name;
  },
  //设置权限视图
  [SET_VIEW](state, view){
    saveLocal('authview',JSON.stringify(view));
    state.authView = view;
  },
  //设置当前页面路径
  [SET_PATH](state, path){
    saveLocal('path', path);
    state.currentpath = path;
  },
  [SET_FIRST_VIEW](state, path){
    saveLocal('firstview', path);
    state.firstview = path;
  },
  //初始化数据
  [INIT_DATA](state){
    const username = getLocal('username');
    const path = getLocal('path');
    const firstview = getLocal('firstview');
    const authview = JSON.parse(getLocal('authview'));
    if(path){
      state.currentpath = path;
    }
    if(firstview){
      state.firstview = firstview;
    }
    if(username){
      state.username = username;
    }
    if(authview){
      state.authView = authview;
    }
  }
}
