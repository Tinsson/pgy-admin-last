import Vue from 'vue'
import Router from 'vue-router'
import { getLocal, saveLocal } from '@/util/util'
import store from '@/store'
import axios from 'axios'

//通用模块
import AdminFrame from '@/components/AdminFrame'
import NoContent from '@/components/NoContent'
import NotFind from '@/components/NotFind'
import OperateRes from '@/components/phoneView/OperateRes'
import TaobaoReport from '@/components/reportTable/TaobaoReport'

//登录模块
import Login from '@/views/login/Login'

//权限模块
import listRole from '@/views/auth/listRole'
import listUser from '@/views/auth/listUser'
import listDepartment from '@/views/auth/listDepartment'
import listAuth from '@/views/auth/listAuth'

//用户管理
import consumerList from '@/views/user/consumerList'
import blackList from '@/views/user/BlackList'

//交易记录
//import bindApply from '@/views/loan/bindApply'
//import bindList from '@/views/loan/bindList'
//import loanApply from '@/views/loan/loanApply'
import loanList from '@/views/loan/loanList'
//import delayApply from '@/views/loan/delayApply'
import delayList from '@/views/loan/delayList'
//import repayApply from '@/views/loan/repayApply'
import repayList from '@/views/loan/repayList'
import contractList from '@/views/loan/contractList'
import contractInfo from '@/views/loan/contract/contractInfo'

//催收管理
import urgeList from '@/views/urge/urgeList'
import badDebtList from '@/views/urge/badDebtList'
import repayConfirm from '@/views/urge/repayConfirm'

//工作流平台
import workliuList from '@/views/workliu/workliuList'
import reviewPanel from '@/views/workliu/reviewPanel'
import loanPanel from '@/views/workliu/loanPanel'

//推送管理
import autoPost from '@/views/post/autoPost'
import templateEdit from '@/views/post/templateEdit'

//配置管理
import userConfig from '@/views/config/userConfig'
import formulaConfig from '@/views/config/formulaConfig'
import versionConfig from '@/views/config/versionConfig'
import unifiedConfig from '@/views/config/unifiedConfig'
import payConfig from '@/views/config/payConfig'
import commissionFormula from '@/views/config/commissionFormula'
import reviewConfig from '@/views/config/reviewConfig'
import urgeConfig from '@/views/config/urgeConfig'
import dingList from '@/views/config/dingList'

//推广管理
import generalizeConfig from '@/views/generalize/generalizeConfig'
import generalizeList from '@/views/generalize/generalizeList'
import generalizeDetail from '@/views/generalize/generalizeDetail'
import generalizeCount from '@/views/generalize/generalizeCount'
import Extend from '@/views/generalize/Extend'
import Registered from '@/views/generalize/Registered'

//统计
import statistiIndex from '@/views/statistical/statistiIndex'
import statiTrading from '@/views/statistical/statiTrading'

//整合所有的模块集合，用于动态路由
const componentList = {
  AdminFrame,
  listRole,
  listUser,
  listDepartment,
  listAuth,

  consumerList,
  blackList,

  loanList,
  delayList,
  repayList,
  contractList,

  urgeList,
  badDebtList,
  repayConfirm,

  workliuList,
  reviewPanel,
  loanPanel,

  autoPost,
  templateEdit,

  userConfig,
  formulaConfig,
  versionConfig,
  unifiedConfig,
  payConfig,
  commissionFormula,
  reviewConfig,
  urgeConfig,
  dingList,

  generalizeConfig,
  generalizeList,

  statistiIndex,
  statiTrading
};
Vue.use(Router);

const routes = [
  {
    path: '/',
    redirect: {path: '/login'}
  },
  {
    path: '/login',
    name: '登录',
    component: Login
  },{
    path: '/contractInfo',
    name: '合同详细信息',
    component: contractInfo
  },{
    path: '/taobaoReport',
    name: '淘宝报表',
    component: TaobaoReport
  },{
    path: '/extend',
    name: '推广H5页面',
    component: Extend,
    meta:{
      IsOpen: true
    }
  },{
    path: '/registered',
    name: '注册完后引导页',
    component: Registered,
    meta: {
      IsOpen: true
    }
  },{
    path: '/checkover',
    name: '钉钉按钮结果',
    component: OperateRes,
    meta: {
      IsOpen: true
    }
  },{
    path: '/generalize',
    name: '推广管理',
    component: AdminFrame,
    children: [
      {
        path: 'generalizeDetail',
        name: '渠道详情',
        component: generalizeDetail
      },{
        path: 'generalizeCount',
        name: '渠道统计',
        component: generalizeCount
      }
    ]
  },{
    path: '/notfind',
    name: '页面不存在',
    component: NotFind
  }
]

const router = new Router({
  routes
});

//这个是请求页面路由的时候会验证token存不存在，不存在的话会到登录页
router.beforeEach((to, from, next)=>{
  //推广链接
  if(to.meta.IsOpen){
    next();
    return;
  }
  const token = getLocal('token');
  if(token){
    console.log(to.query);
    if(to.query.admin_url){
      next();
      return;
    }
    store.dispatch('setView').then(()=>{
      let permission = JSON.stringify(store.getters.permission);
      let perdep = JSON.parse(permission);
      perdep.forEach((val)=>{
        val.component = componentList[val.component];
        if('children' in val){
          val.children.forEach((vval)=>{
            if(vval.component in componentList){
              vval.component = componentList[vval.component];
            }else{
              vval.component = NoContent;
            }
          })
        }
      });
      router.addRoutes(perdep);
    });

    saveLocal('path', to.path);
    if(to.meta.id){
      saveLocal('auth_id', to.meta.id);
    }
    if(to.path === '/login'){
      next({path: getLocal('firstview')});
    }else{
      next();
    }
  }else{
    saveLocal('path', '/login');
    if(to.path === '/login'){
      next();
    }else{
      next({path: '/login'});
    }
  }
});


export default router;
