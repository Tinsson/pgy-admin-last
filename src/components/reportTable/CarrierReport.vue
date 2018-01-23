<template>
  <div class="carrier-report">
    <h2 class="all-title">蒲公英运营商查询报告</h2>
    <p class="sub-title">报告生成时间：{{UserInfo.time}}</p>
    <div class="simple-box">
      <h3>查询信息</h3>
      <Row class="info-out">
        <Col span="10">
          <p class="info-line">姓名：{{UserBasic.name}}</p>
          <p class="info-line">身份证号：{{UserBasic.idcard}}</p>
        </Col>
        <Col span="8">
          <p class="info-line">年龄：{{UserBasic.age}}</p>
          <p class="info-line">地址：{{UserBasic.hujidizhi}}</p>
        </Col>
        <Col span="6">
          <p class="info-line">性别：{{UserBasic.sex}}</p>
          <p class="info-line">星座：{{UserBasic.xingzuo}}</p>
        </Col>
      </Row>
    </div>
    <div class="simple-box">
      <h3>号码信息</h3>
      <Row class="info-out">
        <Col span="10">
        <p class="info-line">号码：{{UserTel.phone}}</p>
        <p class="info-line">机主姓名：{{UserTel.name}}</p>
        </Col>
        <Col span="8">
        <p class="info-line">运营商：{{UserTel.yys}}</p>
        <p class="info-line">入网时间：{{UserTel.regtime}}</p>
        </Col>
        <Col span="6">
        <p class="info-line">归属地：{{UserTel.address}}</p>
        <p class="info-line">入网时长：{{UserTel.lentime}}</p>
        </Col>
      </Row>
    </div>

    <div class="first-level">
      <table class="table-info" cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="5" class="cus-head">风险探查</th>
        </tr>
        </thead>
        <tbody>
          <tr>
            <td>探查点</td>
            <td>探查结果</td>
            <td>探查情况</td>
          </tr>
          <tr v-for="item in UserRisk" :key="item.key">
            <td>{{item.key}}</td>
            <td>{{item.is_check}}</td>
            <td>{{item.value}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <table class="table-info" cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="9" class="cus-head">常联系人验证</th>
        </tr>
        </thead>
        <tbody>
          <tr>
            <td>关系</td>
            <td>姓名</td>
            <td>号码</td>
            <td>通话次数</td>
            <td>主叫次数</td>
            <td>被叫次数</td>
            <td>通话时长</td>
            <td>最后通话时间</td>
          </tr>
          <tr v-for="item in LinkInfo" :key="item.rela">
            <td>{{item.rela}}</td>
            <td>{{item.name}}</td>
            <td>{{item.tel}}</td>
            <td>{{item.call_num}}</td>
            <td>{{item.zhujiao_num}}</td>
            <td>{{item.beijiao_num}}</td>
            <td>{{item.call_timelength}}</td>
            <td>{{item.call_endtime}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <table class="table-info" cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="6" class="cus-head">通话概览</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>通话总次数</td>
          <td>通话总号码数</td>
          <td>互拨号码总数</td>
          <td>通话总时长</td>
          <td>通话地点数</td>
          <td>总账单金额</td>
        </tr>
        <tr>
          <td>{{CallInfo.callinfo.call_total_num}}</td>
          <td>{{CallInfo.callinfo.call_tel_num}}</td>
          <td>{{CallInfo.callinfo.each_num}}</td>
          <td>{{CallInfo.callinfo.call_total_time}}</td>
          <td>{{CallInfo.callinfo.call_address}}</td>
          <td>{{CallInfo.callinfo.call_money}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <table class="table-info" cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="8" class="cus-head">月通话记录</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>月份</td>
          <td>通话次数</td>
          <td>主叫次数</td>
          <td>被叫次数</td>
          <td>通话号码数</td>
          <td>通话时长</td>
          <td>通话地点数</td>
          <td>账单金额</td>
        </tr>
        <tr v-for="item in MonthInfo" :key="item.call_time">
          <td>{{item.call_time}}</td>
          <td>{{item.call_num}}</td>
          <td>{{item.zhujiao_num}}</td>
          <td>{{item.beijiao_num}}</td>
          <td>{{item.tonghua_num}}</td>
          <td>{{item.tonghua_time}}</td>
          <td>{{item.tonghua_address}}</td>
          <td>{{item.zhangdan_jine}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <table class="table-info" cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="8" class="cus-head">通话时段分析</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>时段</td>
          <td>通话次数</td>
          <td>通话次数占比</td>
          <td>主叫次数</td>
          <td>主叫占比</td>
          <td>被叫次数</td>
          <td>被叫占比</td>
        </tr>
        <tr v-for="(item,index) in CallInfo.th_timefram" :key="index">
          <td>{{item.name}}</td>
          <td>{{item.call_num}}</td>
          <td>{{item.call_num_proportion}}</td>
          <td>{{item.zhujiao_num}}</td>
          <td>{{item.zhujiao_num_proportion}}</td>
          <td>{{item.beijiao_num}}</td>
          <td>{{item.beijiao_num_proportion}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <table class="table-info" cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="8" class="cus-head">夜间通话分析</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>通话号码数量</td>
          <td>归属地数量</td>
          <td>通话时长</td>
          <td>通话地点数</td>
        </tr>
        <tr>
          <td>{{CallInfo.yejian.call_num}}</td>
          <td>{{CallInfo.yejian.tel_place}}</td>
          <td>{{CallInfo.yejian.use_time}}</td>
          <td>{{CallInfo.yejian.call_add}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <table class="table-info" cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="8" class="cus-head">通话次数分析</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>通话号码</td>
          <td>号码标记</td>
          <td>归属地</td>
          <td>通话次数</td>
          <td>主叫次数</td>
          <td>被叫次数</td>
          <td>通话时长</td>
        </tr>
        <tr v-for="(item,index) in CallNum" :key="index">
          <td>{{item.other_cell_phone}}</td>
          <td>{{item.bj}}</td>
          <td>{{item.place}}</td>
          <td>{{item.nums}}</td>
          <td>{{item.zhujiao}}</td>
          <td>{{item.beijiao}}</td>
          <td>{{item.use_time}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <table class="table-info" cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="8" class="cus-head">通话时长分析</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>通话号码</td>
          <td>号码标记</td>
          <td>归属地</td>
          <td>通话时长</td>
          <td>通话次数</td>
          <td>主叫次数</td>
          <td>被叫次数</td>
        </tr>
        <tr v-for="(item,index) in CallTimelength" :key="index">
          <td>{{item.other_cell_phone}}</td>
          <td>{{item.bj}}</td>
          <td>{{item.place}}</td>
          <td>{{item.use_time}}</td>
          <td>{{item.nums}}</td>
          <td>{{item.zhujiao}}</td>
          <td>{{item.beijiao}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <table class="table-info" cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="8" class="cus-head">通话号码归属地分析</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>归属地</td>
          <td>通话号码数量</td>
          <td>互拨号码数量</td>
          <td>通话次数</td>
          <td>主叫次数</td>
          <td>被叫次数</td>
          <td>通话时长</td>
        </tr>
        <tr v-for="(item,index) in CallPlace" :key="index">
          <td>{{item.place}}</td>
          <td>{{item.tel_num}}</td>
          <td>{{item.place_num}}</td>
          <td>{{item.call_nums}}</td>
          <td>{{item.zhujiao}}</td>
          <td>{{item.beijiao}}</td>
          <td>{{item.use_time}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <table class="table-info" cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="8" class="cus-head">单次最长通话</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>联系号码</td>
          <td>号码标记</td>
          <td>号码归属地</td>
          <td>通话时长</td>
          <td>通话时间</td>
          <td>呼叫类型</td>
          <td>通话地点</td>
        </tr>
        <tr v-for="(item,index) in CallOnce" :key="index">
          <td>{{item.other_cell_phone}}</td>
          <td>{{item.bj}}</td>
          <td>{{item.place}}</td>
          <td>{{item.use_time}}</td>
          <td>{{item.start_time}}</td>
          <td>{{item.init_type}}</td>
          <td>{{item.call_type}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SumTable',
    data () {
      return{
        Report:{

        }
      }
    },
    computed:{
      UserInfo(){
        let info = {};
        if("userinfo" in this.Report) {
          info = this.Report.userinfo;
        }
        return info;
      },
      UserBasic(){
        let info = {};
        if("userinfo" in this.Report) {
          info = this.Report.userinfo.jb;
        }
        return info;
      },
      UserTel(){
        let info = {};
        if("userinfo" in this.Report) {
          info = this.Report.userinfo.tel;
        }
        return info;
      },
      UserRisk(){
        let info = [];
        if("userinfo" in this.Report){
          info = Object.values(this.Report.userinfo.risk);
        }
        return info;
      },
      LinkInfo(){
        let info = [];
        if("link" in this.Report){
          info = Object.values(this.Report.link);
        }
        return info;
      },
      CallInfo(){
        let info = {};
        if("callinfo" in this.Report){
          info = this.Report.callinfo;
        }
        return info;
      },
      MonthInfo(){
        let info = {};
        if("callinfo" in this.Report){
          info = this.Report.callinfo.monthinfo;
        }
        return info;
      },
      CallNum(){
        let info = [];
        if("call_nums" in this.Report){
          info = this.Report.call_nums;
        }
        return info;
      },
      CallTimelength(){
        let info = [];
        if("call_timelength" in this.Report){
          info = this.Report.call_timelength;
        }
        return info;
      },
      CallPlace(){
        let info = [];
        if("call_place" in this.Report){
          info = this.Report.call_place;
        }
        return info;
      },
      CallOnce(){
        let info = [];
        if("call_once" in this.Report){
          info = this.Report.call_once;
        }
        return info;
      }
    },
    created(){
      const uid = this.$route.query.uid;
      this.$fetch('/backend/report/carrier-report',{uid: uid}).then(d=>{
        if(d.status === 1){
          this.Report = d.data.data;
          console.log(this.Report);
        }
      });
    },
    methods: {
      JudgeSum(key){
        if(key === 'sum'){
          return '总共';
        }else{
          return key;
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .all-title{
    text-align: center;
    font-size: 20px;
    padding: 15px 0;
    background-color: #0096e0;
    color: #FFF;
  }
  .sub-title{
    background-color: #f6fbfe;
    font-size: 14px;
    line-height: 30px;
    text-align: right;
    padding-right: 50px;
    margin-bottom: 30px;
  }
  .simple-box{
    padding-top: 15px;
    border-bottom: 1px solid #e8eaeb;
  }
  .simple-box .info-out{
    padding: 15px 0;
  }
  .simple-box .info-line{
    font-size: 12px;
    line-height: 25px;
  }
  .carrier-report{
    width: 100%;
    box-sizing: border-box;
    padding: 0 5%;
    .first-level{
      padding-bottom: 20px;
      width: 100%;
      overflow: auto;
      .table-info{
        margin-bottom: 20px;
        &.long{
          width: 7000px;
        }
      }
    }
    .first-title{
      padding: 10px;
      font-size: 16px;
    }
    table{
      width: 100%;
      font-size: 12px;
      text-align: left;
      border: 1px solid #e3e3e3;
      border-bottom: none;
      .cus-head{
        height: 40px;
        white-space: nowrap;
        padding-left: 10px;
        background: #468cb4;
        font-size: 14px;
        overflow: hidden;
        color: #FFF;
        border-bottom: 1px solid #e9eaec;
      }
      tbody{
        tr{
          td{
            min-width: 0;
            height: 38px;
            padding-left: 10px;
            font-size: 12px;
            box-sizing: border-box;
            text-overflow: ellipsis;
            border-bottom: 1px solid #e9eaec;
            border-right: 1px solid #e3e3e3;
            &.td-title{
              font-weight: bold;
            }
            &:nth-last-child(1){
              border-right: none;
            }
            &.sum-left{
              border-right: 1px solid #e9eaec;
            }
            .td-name{
              font-size: 15px;
            }
            .td-amount{
              font-size: 14px;
              color: #d73435;
            }
          }
        }
      }
    }
  }
</style>
