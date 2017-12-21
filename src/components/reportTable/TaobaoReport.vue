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
          <td>{{WealthInfo.balance}}</td>
        </tr>
        <tr>
          <td>余额宝余额（元）</td>
          <td>{{WealthInfo.yue_e_bao_amt}}</td>
        </tr>
        <tr>
          <td>历史累计收益（元）</td>
          <td>{{WealthInfo.total_profit}}</td>
        </tr>
        <tr>
          <td>花呗授信额度（元）</td>
          <td>{{WealthInfo.huai_bei_limit}}</td>
        </tr>
        <tr>
          <td>花呗可用授信额度（元）</td>
          <td>{{WealthInfo.huai_bei_can_use_limit}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <h3 class="first-title">3.地址分析</h3>
      <table cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
        <thead>
        <tr>
          <th colspan="5" class="cus-head">3.1 基本地点分析</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="td-title">魔蝎变量</td>
          <td class="td-title">结果</td>
          <td class="td-title">证据</td>
        </tr>
        <tr>
          <td>本人收货地址变化情况</td>
          <td>{{BaseAddressAnalysis.self_address_change}}</td>
          <td>使用{{BaseAddressAnalysis.self_address_cnt}}个地址，平均每个地址使用{{BaseAddressAnalysis.avg_self_address_cnt}}次</td>
        </tr>
        <tr>
          <td>本人收货城市变化情况</td>
          <td>{{BaseAddressAnalysis.self_city_change}}</td>
          <td>地址分布在{{BaseAddressAnalysis.self_city_change}}个城市，平均每个城市使用{{BaseAddressAnalysis.avg_self_city_cnt}}次</td>
        </tr>
        <tr>
          <td>非本人收件地址变化情况</td>
          <td>{{BaseAddressAnalysis.nonself_address_change}}</td>
          <td>使用{{BaseAddressAnalysis.nonself_address_cnt}}个地址，平均每个地址使用{{BaseAddressAnalysis.avg_nonself_address_cnt}}次</td>
        </tr>
        </tbody>
      </table>
      <table cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
        <thead>
        <tr>
          <th colspan="5" class="cus-head">3.2 常用地址（收货次数Top3）</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="td-title">魔蝎变量</td>
          <td class="td-title">Top1</td>
          <td class="td-title">Top2</td>
          <td class="td-title">Top3</td>
        </tr>
        <tr>
          <td>收货地址</td>
          <td>{{UsedAddress.deliver_address.top1}}</td>
          <td>{{UsedAddress.deliver_address.top2}}</td>
          <td>{{UsedAddress.deliver_address.top3}}</td>
        </tr>
        <tr>
          <td>收货城市</td>
          <td>{{UsedAddress.deliver_city.top1}}</td>
          <td>{{UsedAddress.deliver_city.top2}}</td>
          <td>{{UsedAddress.deliver_city.top3}}</td>
        </tr>
        <tr>
          <td>地址类型</td>
          <td>{{UsedAddress.deliver_address_type.top1}}</td>
          <td>{{UsedAddress.deliver_address_type.top2}}</td>
          <td>{{UsedAddress.deliver_address_type.top3}}</td>
        </tr>
        <tr>
          <td>持续使用月数</td>
          <td>{{UsedAddress.use_month.top1}}</td>
          <td>{{UsedAddress.use_month.top2}}</td>
          <td>{{UsedAddress.use_month.top3}}</td>
        </tr>
        <tr>
          <td>最后送货时间距今天数</td>
          <td>{{UsedAddress.last_deliver_past_cur.top1}}</td>
          <td>{{UsedAddress.last_deliver_past_cur.top2}}</td>
          <td>{{UsedAddress.last_deliver_past_cur.top3}}</td>
        </tr>
        <tr>
          <td>首次送货时间</td>
          <td>{{UsedAddress.first_deliver_time.top1}}</td>
          <td>{{UsedAddress.first_deliver_time.top2}}</td>
          <td>{{UsedAddress.first_deliver_time.top3}}</td>
        </tr>
        <tr>
          <td>最后送货时间</td>
          <td>{{UsedAddress.last_deliver_time.top1}}</td>
          <td>{{UsedAddress.last_deliver_time.top2}}</td>
          <td>{{UsedAddress.last_deliver_time.top3}}</td>
        </tr>
        <tr>
          <td>收货人姓名</td>
          <td>{{UsedAddress.deliver_name.top1}}</td>
          <td>{{UsedAddress.deliver_name.top2}}</td>
          <td>{{UsedAddress.deliver_name.top3}}</td>
        </tr>
        <tr>
          <td>收货人号码</td>
          <td>{{UsedAddress.deliver_phone.top1}}</td>
          <td>{{UsedAddress.deliver_phone.top2}}</td>
          <td>{{UsedAddress.deliver_phone.top3}}</td>
        </tr>
        <tr>
          <td>送货总金额(元)</td>
          <td>{{UsedAddress.deliver_amt.top1}}</td>
          <td>{{UsedAddress.deliver_amt.top2}}</td>
          <td>{{UsedAddress.deliver_amt.top3}}</td>
        </tr>
        <tr>
          <td>送货总次数</td>
          <td>{{UsedAddress.deliver_cnt.top1}}</td>
          <td>{{UsedAddress.deliver_cnt.top2}}</td>
          <td>{{UsedAddress.deliver_cnt.top3}}</td>
        </tr>
        <tr>
          <td>收货总金额(元)</td>
          <td>{{UsedAddress.receiving_amt.top1}}</td>
          <td>{{UsedAddress.receiving_amt.top2}}</td>
          <td>{{UsedAddress.receiving_amt.top3}}</td>
        </tr>
        <tr>
          <td>收货总次数</td>
          <td>{{UsedAddress.receiving_cnt.top1}}</td>
          <td>{{UsedAddress.receiving_cnt.top2}}</td>
          <td>{{UsedAddress.receiving_cnt.top3}}</td>
        </tr>
        </tbody>
      </table>
      <table cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
        <thead>
        <tr>
          <th colspan="5" class="cus-head">3.3 收件详细信息</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="td-title">魔蝎变量</td>
          <td class="td-title">近3月</td>
          <td class="td-title">近6月</td>
        </tr>
        <tr>
          <td>最多收件人姓名</td>
          <td>{{ReceiptDetails.max_deliver_name_3}}</td>
          <td>{{ReceiptDetails.max_deliver_name_6}}</td>
        </tr>
        <tr>
          <td>最多收件人电话</td>
          <td>{{ReceiptDetails.max_deliver_phone_3}}</td>
          <td>{{ReceiptDetails.max_deliver_phone_6}}</td>
        </tr>
        <tr>
          <td>最多收件人联系地址</td>
          <td>{{ReceiptDetails.max_deliver_address_3}}</td>
          <td>{{ReceiptDetails.max_deliver_address_6}}</td>
        </tr>
        <tr>
          <td>最多收件城市</td>
          <td>{{ReceiptDetails.max_deliver_city_3}}</td>
          <td>{{ReceiptDetails.max_deliver_city_6}}</td>
        </tr>
        <tr>
          <td>最多收件人是否是默认联系人	</td>
          <td>{{ReceiptDetails.is_default_3}}</td>
          <td>{{ReceiptDetails.is_default_6}}</td>
        </tr>
        <tr>
          <td>最多收件人收件数</td>
          <td>{{ReceiptDetails.max_cnt_3}}</td>
          <td>{{ReceiptDetails.max_cnt_6}}</td>
        </tr>
        <tr>
          <td>默认收件人收件数</td>
          <td>{{ReceiptDetails.default_deliver_cnt_3}}</td>
          <td>{{ReceiptDetails.default_deliver_cnt_6}}</td>
        </tr>
        <tr>
          <td>最多收件城市收件数</td>
          <td>{{ReceiptDetails.max_deliver_city_cnt_3}}</td>
          <td>{{ReceiptDetails.max_deliver_city_cnt_6}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="first-level">
      <h3 class="first-title">4.消费分析</h3>
      <table cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
        <thead>
        <tr>
          <th colspan="10" class="cus-head">4.1 消费分析</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="td-title">月份</td>
          <td v-for="(value,key) in TotalConsum.total_consum_amt" :key="key">{{JudgeSum(key)}}</td>
        </tr>
        <tr>
          <td>消费金额（元）</td>
          <td v-for="(value,key) in TotalConsum.total_consum_amt" :key="key">{{value}}</td>
        </tr>
        <tr>
          <td>消费次数</td>
          <td v-for="(value,key) in TotalConsum.total_consum_times" :key="key">{{value}}</td>
        </tr>
        <tr>
          <td>消费品类数</td>
          <td v-for="(value,key) in TotalConsum.total_category_cnt" :key="key">{{value}}</td>
        </tr>
        </tbody>
      </table>
      <table cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
        <thead>
        <tr>
          <th colspan="10" class="cus-head">4.2 本人收货的消费</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="td-title">月份</td>
          <td v-for="(value,key) in ReceiveConsum.self_consum_amt" :key="key">{{JudgeSum(key)}}</td>
        </tr>
        <tr>
          <td>消费金额（元）</td>
          <td v-for="(value,key) in ReceiveConsum.self_consum_amt" :key="key">{{value}}</td>
        </tr>
        <tr>
          <td>消费次数</td>
          <td v-for="(value,key) in ReceiveConsum.self_consum_times" :key="key">{{value}}</td>
        </tr>
        <tr>
          <td>消费品类数</td>
          <td v-for="(value,key) in ReceiveConsum.self_category_cnt" :key="key">{{value}}</td>
        </tr>
        </tbody>
      </table>
      <table cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
        <thead>
        <tr>
          <th colspan="10" class="cus-head">4.3 特殊品消费</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="td-title">月份</td>
          <td v-for="(value,key) in SpecialConsum.virtual_goods_amt" :key="key">{{JudgeSum(key)}}</td>
        </tr>
        <tr>
          <td>虚拟物品消费金额（元）</td>
          <td v-for="(value,key) in SpecialConsum.virtual_goods_amt" :key="key">{{value}}</td>
        </tr>
        <tr>
          <td>虚拟物品消费金额占比（%）</td>
          <td v-for="(value,key) in SpecialConsum.virtual_goods_rate" :key="key">{{value}}</td>
        </tr>
        <tr>
          <td>虚拟物品消费次数</td>
          <td v-for="(value,key) in SpecialConsum.virtual_goods_cnt" :key="key">{{value}}</td>
        </tr>
        <tr>
          <td>彩票消费金额(元)</td>
          <td v-for="(value,key) in SpecialConsum.lottery_amt" :key="key">{{value}}</td>
        </tr>
        <tr>
          <td>彩票消费金额占比(%)</td>
          <td v-for="(value,key) in SpecialConsum.lottery_rate" :key="key">{{value}}</td>
        </tr>
        <tr>
          <td>彩票消费笔数</td>
          <td v-for="(value,key) in SpecialConsum.lottery_cnt" :key="key">{{value}}</td>
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
      },
      BaseAddressAnalysis(){
        return this.Report.address_analysis.fundamental_point_analysis;
      },
      UsedAddress(){
        return this.Report.address_analysis.commonly_used_address;
      },
      ReceiptDetails(){
        return this.Report.address_analysis.receipt_details;
      },
      TotalConsum(){
        return this.Report.consumption_analysis.total_consumption;
      },
      ReceiveConsum(){
        return this.Report.consumption_analysis.receiving_consumption;
      },
      SpecialConsum(){
        return this.Report.consumption_analysis.special_consumption;
      }
    },
    created(){
      const uid = this.$route.query.uid;
      this.$fetch('/backend/report/taobao',{user_id: uid}).then(d=>{
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
      }
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
          &:nth-child(even){
            background: #f5f5f5;
          }
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
