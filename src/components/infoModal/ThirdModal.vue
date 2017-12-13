<template>
  <Modal
    v-model="State"
    :width="1000"
    @on-cancel="CloseBtn">
    <div class="head-area" slot="header">
      <h2>成安聚力探查报告</h2>
    </div>
    <div slot="close">
      <Icon class="close-icon" type="ios-close-outline"></Icon>
    </div>
    <p class="create-date">生成时间：{{Data.addtime}}</p>
    <Row class="content">
      <Col :span="11">
        <div class="info-box">
          <span class="label">基本信息</span>
          <ul>
            <li class="line">
              <span class="sub-lab">姓名：</span>
              <span class="value">{{Data.names}}</span>
            </li>
            <li class="line">
              <span class="sub-lab">手机：</span>
              <span class="value">{{Data.phone}}</span>
            </li>
            <li class="line">
              <span class="sub-lab">身份证：</span>
              <span class="value">{{Data.idcard}}</span>
            </li>
          </ul>
        </div>
        <div class="info-box">
          <span class="label">探查情况</span>
          <ul>
            <li class="line">
              <span class="sub-lab">建议:</span>
              <span class="value">{{ TextArr.advice[Data.advice]}}</span>
            </li>
          </ul>
        </div>
        <div class="info-box">
          <span class="label">决策原因</span>
          <ul>
            <li class="line">
              <span class="sub-lab">原因：</span>
              <span class="value">{{ Reason }}</span>
            </li>
            <li class="line">
              <span class="sub-lab">解释：</span>
              <span class="value">{{ TextArr.reasonCode[Data.reasoncode] }}</span>
            </li>
          </ul>
        </div>
      </Col>
      <Col :span="11">
        <div v-for="item in DataProd" class="info-box" :key="GetName(item)">
          <span class="label">{{ GetName(item) }}</span>
          <ul>
            <li v-for="detail in item[GetName(item)]" :key="GetName(detail)" class="line">
              <span class="sub-lab long">{{ GetName(detail) }}：</span>
              <span class="value">{{ detail[GetName(detail)] }}</span>
            </li>
          </ul>
        </div>
      </Col>
    </Row>
    <div slot="footer">
      <Button type="error" @click="CloseBtn">关闭</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'ThirdModal',
    data () {
      return{
        State: this.modalShow,
        Data: this.InitData,
        TextArr:{
          advice:{
            accept: '通过',
            reject: '拒绝',
            cancel: '取消（系统原因）',
            limit: '取消（风控原因）',
            lackdt: '取消（数据不足）'
          },
          reasonCode:{
            AC: '客群准入',
            IV: '身份认证',
            FP: '反第一方欺诈',
            FG: '反团伙欺诈',
            CR: '信用风险',
            CP: '信用授信'
          }
        }
      }
    },
    props: {
      modalShow: Boolean,
      InitData: Object
    },
    watch: {
      modalShow(val){
        this.State = val;
      },
      InitData(val){
        this.Data = val;
      }
    },
    computed:{
      Reason(){
        if(this.Data.reason !== undefined){
          return this.Data.reason.join(",");
        }
      },
      DataProd(){
        if(this.Data.dataprod !== undefined){
          let DataArr = [];
          Object.keys(this.Data.dataprod).forEach(val=>{
            let res = [];
            Object.keys(this.Data.dataprod[val]).forEach(vval=>{
              const sdata = {
                [vval]: this.Data.dataprod[val][vval]
              };
              res.push(sdata);
            });
            const data = {
              [val]: res
            };
            DataArr.push(data);
          });
          return DataArr;
        }
      }
    },
    methods: {
      CloseBtn(){
        this.$emit('CloseModal',this.modalState);
      },
      GetName(obj){
        return Object.keys(obj)[0];
      }
    }
  }
</script>

<style lang="less" scoped>
  .head-area{
    color: #333;
  }
  .close-icon{
    font-size: 23px;
    color: #333;
  }
  .content{
    font-size: 14px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .create-date{
    font-size: 14px;
    text-align: right;
  }
  .info-box{
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #e3e3e3;
  }
  .info-box .label{
    width: 100px;
    display: inline-block;
  }
  .info-box .line{
    padding-bottom: 5px;
  }
  .info-box .line .sub-lab{
    display: inline-block;
    width: 65px;
    &.long{
      width: 120px;
    }
  }
</style>
