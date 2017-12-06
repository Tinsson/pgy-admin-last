<template>
  <div id="contract-info">
    <a href="javascript:;" class="printBtn" @click="PrintFunc">
      <Icon type="printer"></Icon>
      打印合同
    </a>
    <h1 class="all-title">借款协议</h1>
    <p class="bold">甲方（出借人）：{{ UserData.username }}</p>
    <p>证件类型：{{ UserData.card_type }}</p>
    <p class="division">证件号码：{{ UserData.cardno }}</p>
    <p class="bold">乙方（借款人）：{{ UserData.name }}</p>
    <p>用户名：{{ UserData.name }}</p>
    <p>身份证号：{{ UserData.idcard}}</p>
    <p class="division">手机号：{{ UserData.phone }}</p>
    <p class="bold">鉴于：</p>
    <p>1. 甲方为具有完全民事行为能力的中华人民共和国公民或具有合法提供贷款相关资质的机构。</p>
    <p>2. 乙方为持有中华人民共和国有效身份证明/证件的18周岁（含）以上具有完全民事行为能力的自然人。</p>
    <p>3. 甲方为深圳欣荣金融信息服务有限公司（以下简称“欣荣钱包”）的合作方，乙方为欣荣钱包移动互联网应用（以下简称“欣荣钱包APP”）的注册会员，乙方有借款需求，甲方自愿以其自有资金向乙方提供借款，甲乙双方通过欣荣钱包达成借款合意，并同意通过欣荣钱包以线上点击操作的方式签署本电子协议，达成借款交易。</p>
    <h2 class="sub-title">第一条 借款基本信息</h2>
    <table class="table-box">
      <tr v-for="item in baseTable">
        <td class="half">{{ item.name }}</td>
        <td class="half">{{ item.value }}</td>
      </tr>
    </table>
    <h2 class="sub-title">第二条 协议的订立及生效</h2>
    <p>1．甲乙各方同意并确认，各方自行根据欣荣钱包有关规则和说明，在欣荣钱包通过点击相关按钮的方式确认签署本合同。</p>
    <p>2．各方在确认操作之前，均需仔细阅读并确认同意本协议各条款以及同意本协议的签署。</p>
    <p>3．甲乙双方委托欣荣钱包保管所有与本协议相关的书面文件及电子信息，且本协议将在欣荣钱包系统中保存。</p>
    <h2 class="sub-title">第三条 借款及支付方式</h2>
    <p class="content">甲方同意将出借资金存放至欣荣钱包或其在第三方支付机构（由欣荣钱包指定）开立的账户内，并于本协议生效日授权欣荣钱包或自行划转至乙方账户，款项的出借完成。</p>
    <h2 class="sub-title">第四条 还款及支付方式</h2>
    <p>1．乙方应按照约定的还款方式和日期向甲方归还本金、利息以及可能产生的逾期利息和违约金。</p>
    <p>2．甲乙双方确认，本次借款采用到期一次性归还的还款方式：</p>
    <p>到期一次性归还：乙方应于到期还款日之前（含到期还款日）归还所借本金及利息（甲方同意，到账日期以资金托管机构以及银行为准，约定还款日次日至银行到账的期间不计利息）。</p>
    <p>3. 乙方到期应还及应付款项（包含本金、利息）由欣荣钱包根据与甲方的约定及本协议约定计算生成应还金额如下：</p>
    <table class="table-box">
      <tr>
        <td class="third">约定还款日</td>
        <td class="third">期数</td>
        <td class="third">应还金额（元）</td>
      </tr>
      <tr>
        <td>{{ UserData.hk_date }}</td>
        <td>1</td>
        <td>{{ UserData.yhamount }}</td>
      </tr>
    </table>
    <p>4. 提前还款：乙方须向甲方归还剩余应还而未还的全部本金及利息。</p>
    <p>5．若乙方的还款金额不足以偿还应还本金、利息、违约金的，所还金额先归还全部利息、违约金，余款归还本金。</p>
    <p>6. 乙方授权欣荣钱包在借款到期日委托第三方支付机构从包括但不限于接受借款的银行账户、以及归属授权人名下的其他任意银行账户内以协议约定的资费标准直接划付应付的款项。上述银行账户余额不足的，欣荣钱包有权委托第三方支付机构继续划付直至借款人还清所欠款项为止。在借款人欠款未结清之前，该等委托划付还款方式不影响甲方委托欣荣钱包采取其他方式向借款人提醒还款。</p>
    <p>7. 乙方知晓并同意，由于第三方支付机构、银行等划付操作的不确定性，欣荣钱包无法确保每笔划款均能够成功。当划付失败时，乙方需及时通过线下转账的方式将应还款项支付至甲方或欣荣钱包账户内。</p>
    <p>8．乙方确认，欣荣钱包可在每期约定还款日前协助甲方通知乙方还款。</p>
    <p>9. 乙方知晓并同意，因第三方支付机构、银行转账方面的原因导致无法按时还款的，视为乙方还款失败。</p>
    <h2 class="sub-title">第五条 账户信息</h2>
    <p>1. 甲方的收支账户为：{{ UserData.account }}</p>
    <p class="content">户名：{{ UserData.account_name}}</p>
    <p class="content">开户行：{{ UserData.open_bank }}</p>
    <p class="content">账号：{{ UserData.account_number }}</p>
    <p>2. 乙方的收支账户为：{{ UserData.cardno }}</p>
    <p class="content">户名（与乙方姓名一致）：{{ UserData.name }}</p>
    <p class="content">开户行：{{ UserData.bankcode }}</p>
    <p class="content">账号：{{ UserData.cardno }}</p>
    <h2 class="sub-title">第六条 逾期</h2>
    <p>1．乙方未按本协议第三条的约定按时足额将应还款项归还给甲方的，即认定乙方本次借款逾期。</p>
    <p>2．当出现乙方逾期还款情况时，甲方可委托欣荣钱包将逾期情况告知乙方，协助甲方提醒乙方及时还款。</p>
    <p>3. 乙方逾期还款总额应当包括到期未还的本金及利息、逾期利息、违约金。</p>
    <h2 class="sub-title">第七条 违约责任</h2>
    <p class="content">乙方未按本协议约定的金额和时间按时足额还款（包括本金和利息）造成逾期的，应向甲方支付借款本金5%作为违约金，同时按借款金额0.1%/日向甲方支付逾期利息，逾期利息计收至乙方完全履行还款义务（包括违约金、逾期利息、利息和本金）止。</p>
    <h2 class="sub-title">第八条 特别条款</h2>
    <p>1．乙方不得将所借款项用于任何违法活动（包括但不限于赌博、吸毒、贩毒、卖淫嫖娼等），否则一经发现，甲方或欣荣钱包金将立即向公安等有关行政机关举报，追回欠款并协助追究乙方的刑事责任。</p>
    <p>2．乙方不得将所借款项用于本协议约定用途以外的范畴（包括但不限于股票，基金，期货等金融产品的投资，房地产信托投资，二次借贷，彩票等）。否则，甲方有权要求乙方立即归还借款，借款利息以协议约定期限全额收取。</p>
    <p>3．甲方保证其是具有完全民事行为能力的中华人民共和国公民或具有合法提供贷款相关资质的法人，并且出借资金来源合法。</p>
    <h2 class="sub-title">第九条 其他事项</h2>
    <p>1．甲乙双方确认，本次借款相关的所有协议均通过电子数据形式呈现，各方对相关互联网页面或电子数据的同意、确认操作即视为合法有效的签署，欣荣钱包向本次借款所涉及各方主体以短信、站内信等形式发出的通知，即视为合法有效的送达。</p>
    <p>2．本协议中的所有内容对甲乙双方均具有约束效力，甲乙双方按本协议中的约定条款履行权利与义务，甲乙双方在本协议中所作的委托与授权均不可撤销。</p>
    <p>3．甲乙双方必须按要求如实向欣荣钱包提供个人信息及材料；且乙方同意，为协助甲方确保乙方履行还款义务，欣荣钱包可将乙方的个人信息，包括但不限于姓名、合法有效的身份证号码等，提供给相关贷后管理机构。</p>
    <p>4．乙方同意欣荣钱包及相关贷后管理机构可以通过合法渠道验证其所提供信息的真实性，且乙方应承担因所提供信息虚假而产生的所有后果和法律责任。</p>
    <p>5．乙方同意，欣荣钱包有权将乙方逾期信息上传至相关征信系统。</p>
    <p class="division">6. 本协议签订地为上海市，在本协议履行过程中，如发生任何争执或纠纷，甲乙方应友好协商解决，协商不成的，任何一方有权向欣荣钱包住所地有管辖权的人民法院提起诉讼。</p>
    <p>甲方：{{ UserData.username }}</p>
    <p>乙方：{{ UserData.name }}</p>
    <p class="right-bot">日期：{{ CreateDate }}</p>
  </div>
</template>

<script>

  export default {
    name: 'contractInfo',
    data () {
      return {
        title: '合同详情',
        cid: '',
        UserData: {},     //表格数据
        baseTable: [{
          name: '借款总额（元）',
          key: 'amount',
          value: ''
        },{
          name: '借款期限（个自然日/月）',
          key: 'jk_day',
          value: ''
        },{
          name: '借款利息起算日',
          key: 'create_date',
          value: '提现日'
        },{
          name: '借款用途',
          value: '日常消费',
        },{
          name: '还款方式',
          value: '一次性还本付息/按月等额还款'
        }],
        PrintBtn: true,
        CreateDate: ''
      }
    },
    created(){
      this.cid = this.$route.query.id;
      this.InitData({id: this.cid}).then(()=>{
        this.baseTable.forEach(val=>{
          if('key' in val){
            val.value = this.UserData[val.key];
          }
        });
        let dateArr = this.UserData.create_date.split('/');
        this.CreateDate = `${dateArr[0]}年${dateArr[1]}月${dateArr[2]}日`;
      });

    },
    methods: {
      //初始化数据
      InitData(params = {}){
        const that = this;
        this.loading = true;
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post('Contract/contractShow',params).then((d)=>{
            this.UserData = d.data;
            resolve();
          })
        })
      },
      //打印操作
      PrintFunc(){
        this.PrintBtn = false;
        window.print();
      }
    }
  }
</script>


<style lang="less" scoped>
  #contract-info{
    max-width: 750px;
    margin: 0 auto;
    color: #333;
    position: relative;
    p{
      font-size: 14px;
      padding-bottom: 15px;
      line-height: 25px;
      &.bold{
        font-weight: bold;
      }
      &.division{
        padding-bottom: 50px;
      }
      &.content{
        text-indent: 28px;
      }
      &.right-bot{
        text-align: right;
      }
    }
    .printBtn{
      position: fixed;
      bottom: 50px;
      margin-left: -200px;
      color: #FFF;
      font-size: 16px;
      padding: 10px 20px;
      border-radius: 5px;
      background-color: #2DB7F5;
    }
  }
  .all-title{
    text-align: center;
    padding: 20px 0;
  }
  .sub-title{
    font-size: 16px;
    padding: 10px 0 15px;
  }
  .table-box{
    width: 100%;
    border-width: 1px;
    border-color: #666666;
    border-collapse: collapse;
    margin-bottom: 15px;
    td{
      border-width: 1px;
      padding: 8px;
      border-style: solid;
      border-color: #666666;
      background-color: #ffffff;
      font-size: 14px;
      &.half{
        width: 50%;
      }
      &.third{
        width: 33%;
      }
    }
  }
</style>
