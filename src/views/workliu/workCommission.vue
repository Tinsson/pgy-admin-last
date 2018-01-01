<template>
  <div id="review-panel">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
    </h1>
    <div class="card-box">
      <div v-for="item in CountData" class="sim-card" :class="{cur:item.cur}" @click="CountList(item)">
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
          <div class="right-side">
            <DatePicker type="month" style="width: 120px" :value="CurrentMonth" placement="bottom-end" @on-change="pickMonth"></DatePicker>
          </div>
        </div>
        <div id="BarChart1" class="chart-box" :style="{width: BarWidth+'px'}"></div>
        <div v-show="HasSecond" style="margin-top: 15px">
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
    data () {
      return {
        title: '工作业绩',
        apiUrl: '/backend/Results/Audit',
        auth_id: '',
        loading: true,
        allTime: [],
        //统计数据
        CurrentMonth: '',
        CountData: [{
          name: '方其余',
          icon: 'ios-list-outline',
          count: 0,
          cunit: '元',
          second: false,
          status: 'review_fqy',
          type: 'review',
          cur: true
        },{
          name: '冯剑涛',
          icon: 'ios-list-outline',
          count: 0,
          cunit: '元',
          second: false,
          status: 'loan_fjt',
          type: 'loan',
          cur: false
        },{
          name: '张杰',
          icon: 'ios-list-outline',
          count: 0,
          id: 22,
          cunit: '元',
          second: false,
          status: 'urge_zj',
          type: 'urge',
          cur: false
        },{
          name: '张铠峰',
          icon: 'ios-list-outline',
          count: 0,
          id: 23,
          cunit: '元',
          second: false,
          status: 'urge_zkf',
          type: 'urge',
          cur: false
        }],
        SecondH: '300px',
        HasSecond: false,
        BarWidth: '',
        BarOption1:{
          title : {
            text: '审核客户数',
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
              data : ['2017-12-24', '2017-12-25', '2017-12-26', '2017-12-27', '2017-12-28', '2017-12-29'],
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
              data:[2, 3, 4, 5, 6, 7]
            }
          ]
        },
        BarOption2:{
          title : {
            text: '还款笔数',
            subtext: '',
            x:'center'
          },
          color: ['#fa8c16'],
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
      const now = new Date();
      this.CurrentMonth = `${now.getFullYear()}-${now.getMonth()+1}`;
      this.auth_id = getLocal('auth_id');
      this.$post('/backend/Results/index').then(d=>{
        this.CountData[0].count = d.audit;
        this.CountData[1].count = d.lending;
        this.CountData[2].count = d.zjamount;
        this.CountData[3].count = d.zkfamount;
        this.InitData(this.apiUrl);
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
          params.m = this.CurrentMonth.split('-')[1];
        }else{
          params.y = month.split('-')[0];
          params.m = month.split('-')[1];
        }
        switch(type){
          case 'review':
            this.HasSecond = false;
            this.BarOption1.title.text = '审核客户数';
            this.InitData(this.apiUrl,params);
            break;
          case 'loan':
            this.HasSecond = false;
            this.BarOption1.title.text = '放款客户数';
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
            }else{
              this.BarOption1.xAxis[0].data = Object.keys(d);
              this.BarOption1.series[0].data = Object.values(d);
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
        BarChart1.setOption(this.BarOption1);
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
        this.$post('/backend/Results/index',{y: date.split('-')[0],m: date.split('-')[1]}).then(d=>{
          this.CountData[0].count = d.audit;
          this.CountData[1].count = d.lending;
          this.CountData[2].count = d.zjamount;
          this.CountData[3].count = d.zkfamount;
        });
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
