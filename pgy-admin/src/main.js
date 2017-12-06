// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import {post,fetch,patch,put} from './util/http'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import * as echarts from 'echarts/lib/echarts';
// 引入图的类型
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
// 引入提示框组件、标题组件、工具箱组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';

Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false
Vue.use(iView);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
