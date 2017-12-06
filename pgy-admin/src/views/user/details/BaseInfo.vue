<template>
  <div id="base-info">
    <div class="text-part">
      <Table size="large"
             :columns="UserCol"
             :data="ShortInfo"></Table>
      <div class="simple">
        <Row>
          <Col :xs="14" :lg="12">
            <h2 class="side-title">更多信息</h2>
            <div class="state-box">
              <span class="label">工作单位：</span>
              <span class="value">{{ UserData.info.company }}</span>
            </div>
            <div class="state-box">
              <span class="label">公司地址：</span>
              <span class="value">{{ UserData.info.address_company }}</span>
            </div>
            <div class="state-box">
              <span class="label">户籍地址：</span>
              <span class="value">{{ UserData.info.address }}</span>
            </div>
            <div class="state-box">
              <span class="label">认证状态：</span>
              <span class="value">{{ RzInfo }}</span>
            </div>
            <div class="state-box">
              <span class="label">审核状态：</span>
              <span class="value">{{ ShenhInfo }}</span>
            </div>
            <div class="state-box">
              <span class="label">交易状态：</span>
              <span class="value">{{ UserData.loanstatus}}</span>
            </div>
          </Col>
          <Col :xs="10" :lg="12">
            <h2 class="side-title">添加笔记</h2>
            <Input v-model="Remark"
                   type="textarea"
                   :rows="5"
                   placeholder="在此纪录你的想法。。。"></Input>
            <div class="pull-right">
              <Button type="success" @click="SubRemark" size="large">保存</Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <!--<h2 class="sub-tit">银行卡</h2>
    <div class="table-box">
      <Table :columns="BankCard" :data="BankData"></Table>
    </div>-->
    <div class="pic-area">
      <Row>
        <Col :xs="14" :lg="12">
          <h2 class="side-title">身份证正反面</h2>
          <div class="all-sides">
            <!--<img src="../../../assets/images/idcard.png" alt="">
            <img src="../../../assets/images/idcard.png" alt="">-->
            <img v-for="(item, index) in UserData.idcardimg" :src="item" :key="index" alt="">
          </div>
        </Col>
        <Col :xs="10" :lg="12">
          <h2 class="side-title">人脸识别</h2>
          <div class="all-img">
            <img v-for="(item, index) in UserData.huoti" :src="item" :key="index" alt="">
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'BaseInfo',
    data () {
      return {
        title: '基本信息',
        CurId: '',
        RzInfo: '',
        ShenhInfo: '',
        Remark: '',
        //用户数据
        UserData: {
            info: {}
        },
        BankCard: [{
            type: 'selection',
            width: 60,
            align: 'center'
          },{
            title: '序号',
            key: 'id',
            align: 'center'
          },{
            title: '银行卡号',
            key: 'cardno',
            align: 'center'
          },{
            title: '银行名称',
            key: 'bankcode',
            align: 'center'
          },{
            title: '支付途径',
            key: 'channel_id',
            align: 'center'
        }],
        BankData: [],
        UserCol:[{
          title: '姓名',
          width: '100',
          key: 'name',
        },{
          title: '手机号',
          key: 'phone'
        },{
          title: '身份证号',
          key: 'idcard'
        },{
          title: '学历',
          width: '80',
          key: 'education'
        },{
          title: '用户类型',
          width: '100',
          key: 'type'
        },{
          title: '是否黑名单',
          key: 'black'
        }],
        ShortInfo: []
      }
    },
    created(){
      this.CurId = this.$route.query.id;
      this.InitData();
    },
    methods: {
      InitData(){
        const uid = this.CurId;
        this.$fetch('User/getInfo',{uid}).then((d)=>{
          const res = d.data.jiben;
          this.UserData = res;
          this.ShortInfo.push(res.info);
          this.TransBlack(this.ShortInfo[0]);
          this.BankData = res.banklist;
          this.RzInfo = this.StateInfo(res.renz, '，');
          this.ShenhInfo = this.StateInfo(res.shenh, '，');
        });
      },
      //状态信息转换
      StateInfo(arr,divide){
        let res = [];
        arr.forEach(val=>{
            res.push(val.type);
        });
        return res.join(divide);
      },
      TransBlack(obj){
        if(obj.black === 0){
            obj.black = '否'
        }else{
            obj.black = '是'
        }
      },
      SubRemark(){
        const sinfo = {
          uid: this.CurId,
          remark: this.Remark,
        };
        this.$post('User/remark', sinfo).then((d)=>{
          if(d.status === 1){
            this.$Message.success(d.message);
          }else{
            this.$Message.error(d.message);
          }
        })
      }
    }
  }
</script>


<style lang="less" scoped>
  @theme: #1FB5AD;
  #base-info{
    padding: 0 60px 60px;
  }
  .sub-tit{
    padding: 20px 0;
  }
  .text-part{
    padding: 30px 0;
    display: flex;
    flex-direction: column;
    .simple{
      width: 100%;
      font-size: 14px;
      padding-top: 30px;
      .value{
        display: inline-block;
        width: 830px;
        height: 40px;
      }
      .state-box{
        display: flex;
        flex-direction: row;
      }
      .label{
        width: 140px;
        display: inline-block;
      }
    }
  }
  .table-box{
    padding-bottom: 20px;
  }
  .side-title{
    font-size: 16px;
    line-height: 30px;
    padding-bottom: 20px;
  }
  .pic-area{
    width: 100%;
    padding-top: 30px;
    border-top: 2px solid #e3e3e3;
    img{
      max-width: 40%;
      margin-right: 10%;
    }
  }
  .base-line{
    width: 100%;
    padding-top: 10px;
    border-bottom: 2px dashed #E3E3E3;
  }
  .pull-right{
    display: flex;
    flex-direction: row-reverse;
    padding-top: 15px;
  }
</style>
