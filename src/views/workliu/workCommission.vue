<template>
  <div id="review-panel">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
    </h1>
    <div class="card-box">
      <div v-for="item in CountData" v-if="item.show" class="sim-card" :class="{cur:item.cur}" @click="CountList(item)">
        <Icon class="icon" :type="item.icon"></Icon>
        <p class="title">{{ item.name }}</p>
        <p class="value"><span class="num">{{item.count}}</span>元</p>
        <span class="tips">点击查看</span>
      </div>
    </div>
    <div class="data-area">
      <Card>
        <div ref="BarTitle" class="card-tit" slot="title">
          <h3>
            <Icon type="clipboard"></Icon>
            统计图表1
          </h3>
          <div class="right-side">
            <DatePicker type="month" style="width: 120px" :value="CurrentMonth" placement="bottom-end" @on-change="pickMonth"></DatePicker>
          </div>
        </div>
        <div class="chart-out">
          <span class="count-all">总计：{{BarText1}}</span>
          <div id="BarChart1" class="chart-box" :style="{width: BarWidth+'px'}"></div>
        </div>
        <div v-show="!HasSecond" class="chart-out" style="margin-top: 15px">
          <span class="count-all">总计：{{BarText3}}</span>
          <div id="BarChart3" class="chart-box" :style="{width: BarWidth+'px'}"></div>
        </div>
        <div v-show="HasSecond" class="chart-out" style="margin-top: 15px">
          <span class="count-all">总计：{{BarText2}}</span>
          <div id="BarChart2" class="chart-box" :style="{width: BarWidth+'px'}"></div>
        </div>
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
    data: function () {
      return {
        title: '工作业绩',
        apiUrl: '/backend/Results/Audit',
        auth_id: '',
        loading: true,
        allTime: [],
        //统计数据
        CurrentMonth: '',
        CountData: [{
          name: '方启宇',
          icon: 'ios-list-outline',
          count: 0,
          status: 'review_fqy',
          type: 'review',
          cur: true,
          show: false
        }, {
          name: '冯剑涛',
          icon: 'ios-list-outline',
          count: 0,
          status: 'loan_fjt',
          type: 'loan',
          cur: false,
          show: false
        }, {
          name: '张杰',
          icon: 'ios-list-outline',
          count: 0,
          id: 22,
          status: 'urge_zj',
          type: 'urge',
          cur: false,
          show: false
        }, {
          name: '张铠峰',
          icon: 'ios-list-outline',
          count: 0,
          id: 23,
          status: 'urge_zkf',
          type: 'urge',
          cur: false,
          show: false
        }],
        SecondH: '300px',
        HasSecond: false,
        BarWidth: '',
        BarText1: '0',
        BarOption1: {
          title: {
            text: '审核客户数',
            subtext: '',
            x: 'center'
          },
          color: ['#358AF5','#13c2c2','#52c41a'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['2017-12-24', '2017-12-25', '2017-12-26', '2017-12-27', '2017-12-28', '2017-12-29'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '',
              type: 'bar',
              data: [2, 3, 4, 5, 6, 7]
            }
          ]
        },
        BarText3: '0',
        BarOption3: {
          title: {
            text: '放款客户数',
            subtext: '',
            x: 'center'
          },
          color: ['#358AF5','#13c2c2','#52c41a'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['2017-12-24', '2017-12-25', '2017-12-26', '2017-12-27', '2017-12-28', '2017-12-29'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '',
              type: 'bar',
              data: [2, 3, 4, 5, 6, 7]
            }
          ]
        },
        BarText2: '0',
        BarOption2: {
          title: {
            text: '还款笔数',
            subtext: '',
            x: 'center'
          },
          color: ['#fa8c16'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['2017-12-24', '2017-12-25', '2017-12-26', '2017-12-27', '2017-12-28', '2017-12-29', '2017-12-30'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '',
              type: 'bar',
              data: [2, 3, 4, 5, 6, 7, 8]
            }
          ]
        }
      }
    },
    created(){
      const now = new Date();
      this.CurrentMonth = `${now.getFullYear()}-${now.getMonth()+1}`;
      this.auth_id = getLocal('auth_id');
      this.$post('/backend/Results/index').then(d=>{
        this.CountData[0].count = d.fqy;
        this.CountData[1].count = d.fjt;
        this.CountData[2].count = d.zjamount;
        this.CountData[3].count = d.zkfamount;
        if(d.status === 'all'){
          this.CountData.forEach(val=>{
            val.show = true;
          });
          this.InitData(this.apiUrl,{admin_id: '20'});
          this.InitData('/backend/Results/Lending',{admin_id: '20'});
        }else{
          this.CountData.forEach(val=>{
            if(val.status === d.status){
              val.show = true;
              this.CountList(val);
            }else{
              val.show = false;
            }
          })
        }
      });
    },
    mounted(){
      this.BarWidth = this.$refs['BarTitle'].offsetWidth;
    },
    methods: {
      //统计列表
      CountList(item, month = 0){
        this.loading = true;
        let type = '';
        this.CountData.forEach(val=>{
          if(val.status === item.status){
            val.cur = true;
            type = val.type;
          }else{
            val.cur = false;
          }
        });
        let params = {};
        if(month === 0){
          params.y = this.CurrentMonth.split('-')[0];
          let month_row = this.CurrentMonth.split('-')[1];
          if(month_row < 10){
            month_row = '0' + String(parseInt(month_row));
          }
          params.m = month_row;
        }else{
          params.y = month.split('-')[0];
          let month_row = month.split('-')[1];
          if(month_row < 10){
            month_row = '0' + String(parseInt(month_row));
          }
          params.m = month_row;
        }
        switch(type){
          case 'review':
            this.HasSecond = false;
            //this.BarOption1.title.text = '审核客户数';
            params.admin_id = '20';
            this.InitData(this.apiUrl,params);
            this.InitData('/backend/Results/Lending',params);
            break;
          case 'loan':
            this.HasSecond = false;
            //this.BarOption1.title.text = '放款客户数';
            params.admin_id = '7';
            this.InitData(this.apiUrl,params);
            this.InitData('/backend/Results/Lending',params);
            break;
          case 'urge':
            this.HasSecond = true;
            this.BarOption1.title.text = '展期费';
            this.BarOption2.title.text = '还款笔数';
            params.status = item.id;
            this.InitData('/backend/Results/Collection',params);
            break;
        }
      },
      //初始化数据
      InitData(url,params = {}){
        const that = this;
        this.loading = true;
        //列表数据获取
        return new Promise((resolve)=>{
          this.$fetch(url,params).then((d)=>{
            if(this.HasSecond){
              this.BarOption1.xAxis[0].data = Object.keys(d.zq);
              this.BarOption1.series[0].data = Object.values(d.zq);
              this.BarOption2.xAxis[0].data = Object.keys(d.hk);
              this.BarOption2.series[0].data = Object.values(d.hk);
              this.BarText1 = this.CountAll(Object.values(d.zq));
              this.BarText2 = this.CountAll(Object.values(d.hk));
              this.CutRest();
            }else{
              if(url === '/backend/Results/Lending'){
                this.BarOption3.xAxis[0].data = Object.keys(d.data);
                this.BarOption3.series[0].data = Object.values(d.data);
                this.BarOption3.series[0].name = '总客户数';
                this.BarOption3.series[1] = {
                  name:'新增客户',
                  type:'bar',
                  data: Object.values(d.data1)
                };
                this.BarOption3.series[2] = {
                  name:'续借客户',
                  type:'bar',
                  data: Object.values(d.data2)
                };
                this.BarOption3.title.subtext = `新增总数：${d.fkNew} 续借总数：${d.fkXuj}`;
                this.BarText3 = d.fkAll;
              }else{
                this.BarOption1.xAxis[0].data = Object.keys(d);
                this.BarOption1.series[0].data = Object.values(d);
                this.BarText1 = this.CountAll(Object.values(d));
                this.CutRest();
              }
            }
            this.DrawChart();
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
      DrawChart(){
        let BarChart1 = this.$echarts.init(document.getElementById('BarChart1'));
        BarChart1.setOption(this.BarOption1,true);
        let BarChart3 = this.$echarts.init(document.getElementById('BarChart3'));
        BarChart3.setOption(this.BarOption3,true);
        if(this.HasSecond){
          let BarChart2 = this.$echarts.init(document.getElementById('BarChart2'));
          BarChart2.setOption(this.BarOption2);
        }
      },
      pickMonth(date){
        this.CurrentMonth = date;
        this.CountData.forEach(val=>{
          if(val.cur){
            this.CountList(val,date);
          }
        });
        let month = date.split('-')[1];
        if(month < 10){
          month = '0'+String(parseInt(month));
        }
        this.$post('/backend/Results/index',{y: date.split('-')[0],m: month}).then(d=>{
          this.CountData[0].count = d.fqy;
          this.CountData[1].count = d.fjt;
          this.CountData[2].count = d.zjamount;
          this.CountData[3].count = d.zkfamount;
        });
      },
      CountAll(arr){
        let res = 0;
        arr.forEach(val=>{
          res += parseFloat(val);
        });
        return res;
      },
      CutRest(){
        if(this.BarOption1.series.length > 1){
          this.BarOption1.series = this.BarOption1.series.slice(0,1);
          this.BarOption1.series[0].name = '';
          this.BarOption1.title.subtext = '';
        }
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
    position: relative;
  }
  .chart-out{
    position: relative;
    .count-all{
      position: absolute;
      top: 10px;
      right: 35px;
    }
  }
</style>
