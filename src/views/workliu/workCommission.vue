<template>
  <div id="review-panel">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
    </h1>
    <div class="card-box">
      <div v-for="item in CountData" class="sim-card" :class="{cur:item.cur}" @click="CountList(item.status)">
        <Icon class="icon" :type="item.icon"></Icon>
        <p class="title">{{ item.name }}</p>
        <p class="value"><span class="num">{{item.count}}</span>{{item.cunit}}</p>
        <span class="tips">点击查看</span>
      </div>
    </div>
    <div class="data-area">
      <Card>
        <div ref="BarTitle" class="card-tit" slot="title">
          <h3>
            <Icon type="clipboard"></Icon>
            数据列表
          </h3>
        </div>
        <div id="BarChart1" class="chart-box" :style="{width: BarWidth+'px'}"></div>
        <div id="BarChart2" class="chart-box" :style="{width: BarWidth+'px', height: SecondH}"></div>
      </Card>
    </div>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import AuditModal from '@/components/infoModal/AuditModal'
  import Clipboard from 'clipboard'

  export default {
    name: 'ReviewPanel',
    components: {
      AuditModal
    },
    data () {
      return {
        title: '工作业绩',
        apiUrl: '/backend/loan-audit/list',
        auth_id: '',
        loading: true,
        allTime: [],
        //统计数据
        CountData: [{
          name: '方其余',
          icon: 'ios-list-outline',
          count: 0,
          cunit: '元',
          second: false,
          status: 'check_waiting',
          cur: true
        },{
          name: '冯剑涛',
          icon: 'ios-list-outline',
          count: 0,
          cunit: '元',
          second: false,
          status: 'check_pass_today',
          cur: false
        },{
          name: '张杰',
          icon: 'ios-list-outline',
          count: 0,
          cunit: '元',
          second: false,
          status: 'check_pass',
          cur: false
        },{
          name: '张铠峰',
          icon: 'ios-list-outline',
          count: 0,
          cunit: '元',
          second: false,
          status: 'check_deny',
          cur: false
        }],
        SecondH: '300px',
        HasSecond: false,
        BarWidth: '',
        BarOption1:{
          title : {
            text: '当月新增放款客户数量',
            subtext: '',
            x:'center'
          },
          color: ['#358AF5'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : ['2017-12-24', '2017-12-25', '2017-12-26', '2017-12-27', '2017-12-28', '2017-12-29', '2017-12-30'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'',
              type:'bar',
              barWidth: '60%',
              data:[2, 3, 4, 5, 6, 7, 8]
            }
          ]
        },
        BarOption2:{
          title : {
            text: '当月新增放款客户数量',
            subtext: '',
            x:'center'
          },
          color: ['#358AF5'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : ['2017-12-24', '2017-12-25', '2017-12-26', '2017-12-27', '2017-12-28', '2017-12-29', '2017-12-30'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'',
              type:'bar',
              barWidth: '60%',
              data:[2, 3, 4, 5, 6, 7, 8]
            }
          ]
        }
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.InitData(this.apiUrl,{type: 'check_waiting'});
    },
    mounted(){
      this.BarWidth = this.$refs['BarTitle'].offsetWidth;
    },
    methods: {
      //统计列表
      CountList(status){
        this.loading = true;
        this.CountData.forEach(val=>{
          if(val.status === status){
            val.cur = true;
          }else{
            val.cur = false;
          }
        });
      },
      //初始化数据
      InitData(url,params = {}){
        const that = this;
        this.loading = true;
        this.$fetch('/backend/loan-audit/block-data').then(d=>{
          this.CountData.forEach(val=>{
            val.count = d.data[val.status];
          })
        });
        //列表数据获取
        return new Promise((resolve)=>{
          this.$fetch(url,params).then((d)=>{
            let res = d.data;
            this.DrawChart();
            this.UserData = res.customer_list;
            that.loading = false;
            resolve();
          })
        })
      },
      //提交信息操作
      UploadData(url,info){
        return new Promise((resolve)=>{
          this.$post(url,info).then((d)=>{
            if(d.status === 1){
              this.$Message.success(d.message);
              resolve(d.data);
            }else{
              this.$Message.error(d.message);
            }
          }).catch((err)=>{
            this.$Message.error('服务器繁忙，请稍后再试！');
          })
        })
      },
      //重置页码
      ResetPageNum(){
        this.Page.cur = 1;
        this.Page.size = 20;
        this.ScreenData.page = 1;
        this.ScreenData.num = 20;
      },
      DrawChart(){
        let BarChart1 = this.$echarts.init(document.getElementById('BarChart1'));
        let BarChart2 = this.$echarts.init(document.getElementById('BarChart2'));
        BarChart1.setOption(this.BarOption1);
        BarChart2.setOption(this.BarOption2);
      }
    }
  }
</script>


<style lang="less" scoped>
  .list-title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-weight: normal;
    padding-bottom: 10px;
  }
  .data-area{
    padding-top: 10px;
    .ivu-table-wrapper{
      border: none;
    }
    .page-box{
      padding: 20px;
      display: flex;
      flex-direction: row-reverse;
    }
  }
  .card-tit{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .card-box{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-bottom: 10px;
    .sim-card{
      position: relative;
      width: 24%;
      padding: 15px;
      color: #FFF;
      overflow: hidden;
      cursor: pointer;
      border-radius: 5px;
      background-color: #c3c3c3;
      margin-bottom: 15px;
      .title{
        font-size: 16px;
      }
      .value{
        padding: 5px 0;
        font-size: 18px;
        .num{
          font-size: 40px;
        }
      }
      .tips{
        position: absolute;
        transition: all 0.1s linear;
        bottom: -20px;
        right: 20px;
        font-size: 14px;
      }
      &:hover{
        .tips{
          bottom: 10px;
        }
      }
      .icon{
        position: absolute;
        right: 20px;
        top: 20px;
        font-size: 60px;
      }
      &.cur{
        background-color: #2db7f5;
        &:hover{
          .tips{
            bottom: -20px;
          }
        }
      }
    }
  }
  .count-span{
    font-size: 18px;
    padding: 0 5px;
    color: #d7000f;
  }
  .auth-icon{
    width: 32px;
    height: 32px;
    display: inline-block;
    margin-right: 5px;
    &.TB{
      background: url('../../assets/images/taobao.png') no-repeat center;
      background-size: cover;
    }
    &.MB{
      background: url('../../assets/images/phone.png') no-repeat center;
      background-size: cover;
    }
    &.JD{
      background: url('../../assets/images/phone.png') no-repeat center;
      background-size: cover;
    }
  }
  .chart-box{
    height: 300px;
  }
</style>
