import { post,fetch } from '@/util/http'
import { getLocal } from '@/util/util'
import axios from 'axios'

export default {
  //设置用户名
  setUsername({ commit },name){
    commit('SET_USERNAME',name);
  },
  //设置视图表
  setView({ commit }){
    return new Promise((resolve)=>{
      //const token = getLocal('token');
      //axios.defaults.headers.common['TOKEN'] = token
      fetch('/backend/Menuauth/listLeftAuthGet').then((d)=>{
        let info = d.data;
        let view = [];
        info.forEach((val,index)=>{
          let route = {};
          route.name = val.tit;
          route.meta = {};
          route.meta.id = val.id;
          route.meta.icon = val.icon;
          route.component = 'AdminFrame';
          if(val.data.length > 0){
            route.path = '/' + val.data[0].http.split('/')[1];
            route.children = [];
            val.data.forEach((vval)=>{
              let rroute = {};
              let vpath = vval.http.split('/')[2];
              rroute.name = vval.tit;
              rroute.meta = {};
              rroute.meta.id = vval.id;
              rroute.path = vpath;
              rroute.component = vpath;
              route.children.push(rroute);
            })
          }else{
            route.path = '/';
          }
          view.push(route);
        });
        commit('SET_VIEW',view);
        resolve();
      });
    })
  }
}
