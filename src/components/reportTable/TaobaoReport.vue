<template>
  <div class="taobao-report">
    <h2 class="all-title">蒲公英淘宝查询报告</h2>
    <p class="sub-title">报告生成时间：2017-10-11 09:11:44</p>
    <div class="refresh-box">
      <Button type="success" size="large" @click="handleRefresh">手动刷新数据</Button>
    </div>
    <p class="refresh-time">更新时间：2018-03-05 15:23:08</p>
    <div class="simple-box">
      <h3>查询信息</h3>
      <Row class="info-out">
        <Col span="12">
        <p class="info-line">姓名：{{AliInfo.name}}</p>
        </Col>
        <Col span="12">
        <p class="info-line">淘宝账号：{{AliInfo.web_account}}</p>
        </Col>
      </Row>
    </div>
    <div class="first-level">
      <table class="table-info" cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="5" class="cus-head">淘宝信息分析</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>检查项目</td>
          <td>结果</td>
        </tr>
        <tr>
          <td>邮箱</td>
          <td>{{AliInfo.email}}</td>
        </tr>
        <tr>
          <td>会员等级</td>
          <td>{{AliInfo.account_level}}</td>
        </tr>
        <tr>
          <td>是否实名认证</td>
          <td>{{AliInfo.is_name_idcard}}</td>
        </tr>
        <tr>
          <td>注册时间</td>
          <td>{{AliInfo.reg_time}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <table class="table-info" cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="5" class="cus-head">账单情况分析</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>月份</td>
          <td>笔数</td>
          <td>金额</td>
        </tr>
        <tr v-for="item in AliOrder" :key="item.m">
          <td>{{item.m}}</td>
          <td>{{item.num}}</td>
          <td>{{item.total}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <table class="table-info" cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="5" class="cus-head">账单地址分析</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>地址</td>
          <td>近三个月收货次数</td>
          <td>总成交金额</td>
        </tr>
        <tr v-for="(item,index) in AliAddress" :key="index">
          <td>{{item.receiver_addr}}</td>
          <td>{{item.count}}</td>
          <td>{{item.total}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <table class="table-info" cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="5" class="cus-head">淘宝账单详情</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>地址</td>
          <td>说明</td>
          <td>成交金额</td>
          <td>成交日期</td>
        </tr>
        <tr v-for="item in AliOrderInfo" :key="item.id">
          <td>{{item.address}}</td>
          <td>{{item.product_name}}</td>
          <td>{{item.product_price}}</td>
          <td>{{item.trans_time}}</td>
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
        },
        isRefresh: false
      }
    },
    computed:{
      AliInfo(){
        let info = {};
        if("ali_info" in this.Report){
          info = this.Report.ali_info;
        }
        return info;
      },
      AliOrder(){
        let info = [];
        if("ali_info" in this.Report){
          info = this.Report.ali_order;
        }
        return info;
      },
      AliAddress(){
        let info = [];
        if("ali_info" in this.Report){
          info = this.Report.ali_address;
        }
        return info;
      },
      AliOrderInfo(){
        let info = [];
        if("ali_order_info" in this.Report){
          info = this.Report.ali_order_info;
          info.forEach(val=>{
            //let date = new Date(val.trans_time * 1000);
            //let res = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
            //val.trans_time = res;
          })
        }
        return info;
      }
    },
    created(){
      const uid = this.$route.query.uid;
      this.$fetch('/backend/report/taobao-report',{uid: uid}).then(d=>{
        if(d.status === 1){
          this.Report = d.data.data;
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
      },
      handleRefresh(){
        if(this.isRefresh){
          return;
        }
        const uid = this.$route.query.uid;
        this.isRefresh = true;
        this.$Message.info({
          content: '更新数据中，请耐心等待',
          duration: 200
        });
        this.$fetch('/backend/report/taobao-reporth',{uid: uid}).then(d=>{
          if(d.status === 1){
            this.isRefresh = false;
            this.$Message.destroy();
            this.Report = d.data.data;
          }else{
            this.isRefresh = false;
            this.$Message.destroy();
            this.$Message.error(d.message);
          }
        });
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
  .taobao-report{
    width: 100%;
    box-sizing: border-box;
    padding: 0 5%;
    .first-level{
      padding-bottom: 20px;
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
          &:nth-child(even){
            background: #f5f5f5;
          }
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
  .refresh-box{
    display: flex;
    flex-direction: row-reverse;
  }
  .refresh-time{
    padding-top: 5px;
    text-align: right;
  }
</style>
