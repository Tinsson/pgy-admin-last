<template>
  <div class="taobao-report">
    <h2 class="all-title">淘宝报告</h2>
    <div class="first-level">
      <h3 class="first-title">1.基本信息</h3>
      <table cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="5" class="cus-head">1.1 用户及账号基本信息</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>姓名:{{BaseInfo.taobao_name}}</td>
          <td>邮箱:{{BaseInfo.taobao_email}}</td>
          <td>电话号码：{{BaseInfo.taobao_phone_number}}</td>
          <td colspan="2">关联支付宝账号：{{BaseInfo.alipay_account}}</td>
        </tr>
        <tr>
          <td>vip等级：{{BaseInfo.taobao_vip_level}}</td>
          <td>vip值：{{BaseInfo.taobao_vip_count}}</td>
          <td>天猫等级：{{BaseInfo.tmall_level}}</td>
          <td>天猫vip值：{{BaseInfo.tmall_vip_count}}</td>
          <td>天猫信誉：{{BaseInfo.tmall_apass}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <h3 class="first-title">2.财富信息</h3>
      <table cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th colspan="5" class="cus-head">2.1 总资产</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="td-title">魔蝎变量</td>
          <td class="td-title">当前</td>
        </tr>
        <tr>
          <td>账号余额（元）</td>
          <td></td>
        </tr>
        <tr>
          <td>余额宝余额（元）</td>
          <td></td>
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
          "basic_info": {
            "user_and_account_basic_info": {
              "taobao_name": "string",
              "taobao_email": "string",
              "taobao_phone_number": "string",
              "alipay_account": "string",
              "taobao_vip_level": "string",
              "taobao_vip_count": "string",
              "tmall_level": "string",
              "tmall_vip_count": "string",
              "tmall_apass": "string"
            }
          },
          "wealth_info": {
            "totalssets": {
              "balance": "string",
              "yue_e_bao_amt": "string",
              "total_profit": "string",
              "huai_bei_limit": "string",
              "huai_bei_can_use_limit": "string"
            }
          },
          "address_analysis": {
            "fundamental_point_analysis": {
              "self_address_change": "string",
              "self_city_change": "string",
              "nonself_address_change": "string",
              "self_address_cnt": "string",
              "avg_self_address_cnt": "string",
              "self_city_cnt": "string",
              "avg_self_city_cnt": "string",
              "nonself_address_cnt": "string",
              "avg_nonself_address_cnt": "string"
            },
            "commonly_used_address": {
              "deliver_address": {
                "top1": "string",
                "top2": "string",
                "top3": "string"
              },
              "deliver_city": {
                "top1": "string",
                "top2": "string",
                "top3": "string"
              },
              "deliver_address_type": {
                "top1": "string",
                "top2": "string",
                "top3": "string"
              },
              "use_month": {
                "top1": "string",
                "top2": "string",
                "top3": "string"
              },
              "last_deliver_past_cur": {
                "top1": "string",
                "top2": "string",
                "top3": "string"
              },
              "first_deliver_time": {
                "top1": "string",
                "top2": "string",
                "top3": "string"
              },
              "last_deliver_time": {
                "top1": "string",
                "top2": "string",
                "top3": "string"
              },
              "deliver_name": {
                "top1": "string",
                "top2": "string",
                "top3": "string"
              },
              "deliver_phone": {
                "top1": "string",
                "top2": "string",
                "top3": "string"
              },
              "deliver_amt": {
                "top1": "string",
                "top2": "string",
                "top3": "string"
              },
              "deliver_cnt": {
                "top1": "string",
                "top2": "string",
                "top3": "string"
              },
              "receiving_amt": {
                "top1": "string",
                "top2": "string",
                "top3": "string"
              },
              "receiving_cnt": {
                "top1": "string",
                "top2": "string",
                "top3": "string"
              }
            },
            "receipt_details": {
              "max_deliver_name_3": "string",
              "max_deliver_name_6": "string",
              "max_deliver_phone_3": "string",
              "max_deliver_phone_6": "string",
              "max_deliver_address_3": "string",
              "max_deliver_address_6": "string",
              "max_deliver_city_3": "string",
              "max_deliver_city_6": "string",
              "is_default_3": "string",
              "is_default_6": "string",
              "max_cnt_3": "string",
              "max_cnt_6": "string",
              "default_deliver_cnt_3": "string",
              "default_deliver_cnt_6": "string",
              "max_deliver_city_cnt_3": "string",
              "max_deliver_city_cnt_6": "string"
            }
          },
          "consumption_analysis": {
            "total_consumption": {
              "total_consum_amt": {
                "2017-05": "string",
                "2017-04": "string",
                "2017-03": "string",
                "2017-02": "string",
                "2017-01": "string",
                "2016-12": "string",
                "sum": "string"
              },
              "total_consum_times": {
                "2017-05": "string",
                "2017-04": "string",
                "2017-03": "string",
                "2017-02": "string",
                "2017-01": "string",
                "2016-12": "string",
                "sum": "string"
              },
              "total_category_cnt": {
                "2017-05": "string",
                "2017-04": "string",
                "2017-03": "string",
                "2017-02": "string",
                "2017-01": "string",
                "2016-12": "string",
                "sum": "string"
              }
            },
            "receiving_consumption": {
              "self_consum_amt": {
                "2017-05": "string",
                "2017-04": "string",
                "2017-03": "string",
                "2017-02": "string",
                "2017-01": "string",
                "2016-12": "string",
                "sum": "string"
              },
              "self_consum_times": {
                "2017-05": "string",
                "2017-04": "string",
                "2017-03": "string",
                "2017-02": "string",
                "2017-01": "string",
                "2016-12": "string",
                "sum": "string"
              },
              "self_category_cnt": {
                "2017-05": "string",
                "2017-04": "string",
                "2017-03": "string",
                "2017-02": "string",
                "2017-01": "string",
                "2016-12": "string",
                "sum": "string"
              }
            },
            "special_consumption": {
              "virtual_goods_amt": {
                "2017-05": "string",
                "2017-04": "string",
                "2017-03": "string",
                "2017-02": "string",
                "2017-01": "string",
                "2016-12": "string",
                "sum": "string"
              },
              "virtual_goods_rate": {
                "2017-05": "string",
                "2017-04": "string",
                "2017-03": "string",
                "2017-02": "string",
                "2017-01": "string",
                "2016-12": "string",
                "sum": "string"
              },
              "virtual_goods_cnt": {
                "2017-05": "string",
                "2017-04": "string",
                "2017-03": "string",
                "2017-02": "string",
                "2017-01": "string",
                "2016-12": "string",
                "sum": "string"
              },
              "lottery_amt": {
                "2017-05": "string",
                "2017-04": "string",
                "2017-03": "string",
                "2017-02": "string",
                "2017-01": "string",
                "2016-12": "string",
                "sum": "string"
              },
              "lottery_rate": {
                "2017-05": "string",
                "2017-04": "string",
                "2017-03": "string",
                "2017-02": "string",
                "2017-01": "string",
                "2016-12": "string",
                "sum": "string"
              },
              "lottery_cnt": {
                "2017-05": "string",
                "2017-04": "string",
                "2017-03": "string",
                "2017-02": "string",
                "2017-01": "string",
                "2016-12": "string",
                "sum": "string"
              }
            }
          }
        }
      }
    },
    computed:{
      BaseInfo(){
        return this.Report.basic_info.user_and_account_basic_info;
      },
      WealthInfo(){
        return this.Report.wealth_info.totalssets;
      }
    },
    created(){
      const uid = this.$route.query.uid;
      this.$fetch('/backend/Report/taobao',{user_id: uid}).then(d=>{

      });
    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
  .all-title{
    text-align: center;
    font-size: 20px;
    padding: 10px 0;
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
          td{
            min-width: 0;
            height: 48px;
            padding-left: 10px;
            font-size: 14px;
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
