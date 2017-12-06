<template>
  <div id="consumer-edit">
    <h1 class="list-title">
      <span>{{ title }}</span>
      <Button type="warning"
              size="large"
              icon="arrow-return-left"
              shape="circle"
              @click="BackList">返回</Button>
    </h1>
    <div class="info-box">
      <Form :model="ResData" inline :label-width="100">
        <div class="ipt-area">
          <FormItem label="性别：">
            <RadioGroup v-model="ResData.info.sex">
              <Radio label="男"></Radio>
              <Radio label="女"></Radio>
            </RadioGroup>
          </FormItem>
        </div>
        <div class="ipt-area">
          <FormItem label="用户手机号：">
            <Input v-model="ResData.info.phone" placeholder="输入手机号码" style="width: 160px;"></Input>
          </FormItem><FormItem label="身份证号：">
            <Input v-model="ResData.info.idcard" placeholder="输入身份证号码" style="width: 160px;"></Input>
          </FormItem><FormItem label="会员等级：">
            <Select v-model="ResData.info.type" placeholder="请选择会员等级" style="width:160px">
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
              <Option value="E">E</Option>
              <Option value="W">W</Option>
            </Select>
          </FormItem><FormItem label="生日：">
            <DatePicker type="date"
                        placeholder="选择日期"
                        format="yyyy/MM/dd"
                        :value="ResData.info.birth"
                        @on-change="PickDate"
                        style="width: 160px"></DatePicker>
          </FormItem>
        </div>
        <div class="ipt-area">
          <FormItem v-for="(item, index) in ResData.lianxiren" :label="`联系人${index}：`" :key="index">
            <p>
              <Input v-model="item.name" placeholder="请输入姓名" style="width: 160px;"></Input>
            </p>
            <p class="second-part">
              <Input v-model="item.phone" placeholder="请输入手机号码" style="width: 160px;"></Input>
            </p>
          </FormItem>
        </div>
        <div class="ipt-area">
          <FormItem label="户籍地址：">
            <Input v-model="ResData.info.address" placeholder="请输入户籍地址" style="width: 160px;"></Input>
          </FormItem><FormItem label="芝麻分：">
            <Input v-model="ResData.info.zmop" placeholder="请输入芝麻分" style="width: 160px;"></Input>
          </FormItem><FormItem label="学历：">
            <Select v-model="ResData.info.education" style="width:160px">
              <Option :value="10">初中</Option>
              <Option :value="20">高中</Option>
              <Option :value="30">大专</Option>
              <Option :value="40">本科</Option>
              <Option :value="50">硕士</Option>
              <Option :value="60">博士</Option>
              <Option :value="70">博士后</Option>
            </Select>
          </FormItem><FormItem label="最大借款额度：">
            <Input v-model="ResData.info.credit_limit" placeholder="请输入额度" style="width: 160px;"></Input>
          </FormItem>
        </div>
        <div class="ipt-area">
          <FormItem v-for="item in ResData.rz_info" :label="`${item.type_name}：`" :key="item">
            <Select v-model="item.pass_at" style="width:160px">
              <Option :value="1">通过</Option>
              <Option :value="0">未通过</Option>
            </Select>
          </FormItem>
        </div>
        <div class="ipt-area">
          <FormItem label="审核员：">
            <Select v-model="ResData.info.auditorId" style="width:160px">
              <Option v-for="item in ResData.auditor" :value="item.id" :key="item.id">{{item.admin_name}}</Option>
            </Select>
          </FormItem><FormItem label="催收员：">
            <Select v-model="ResData.info.collectorId" style="width:160px">
              <Option v-for="item in ResData.collector" :value="item.id" :key="item.id">{{item.admin_name}}</Option>
            </Select>
          </FormItem>
        </div>
        <div class="ipt-area">
          <FormItem label="居住地址：">
            <Cascader :data="AllAreaData"
                      v-model="ChoseCompany"
                      :style="{width: AddressWidth}"></Cascader>
          </FormItem><FormItem label="详细地址：">
            <Input v-model="DetailsCompany"
                   placeholder="请输入详细地址"
                   :style="{width: AddressWidth}"></Input>
          </FormItem>
        </div>
        <div class="ipt-area">
          <FormItem label="公司地址：">
            <Cascader :data="AllAreaData"
                      v-model="ChoseLive"
                      :style="{width: AddressWidth}"></Cascader>
          </FormItem><FormItem label="详细地址：">
            <Input v-model="DetailsLive"
                   placeholder="请输入详细地址"
                   :style="{width: AddressWidth}"></Input>
          </FormItem>
        </div>
        <div class="btn-area">
          <Button :type="DelayBtn.type" size="large" @click="OpenDelay">{{DelayBtn.name}}</Button>
          <Button :type="BlackBtn.type" size="large" @click="AddBlack">{{BlackBtn.name}}</Button>
          <Button type="info" size="large" @click="OpenRemark">备注</Button>
        </div>
        <div class="btn-area suball">
          <Button type="success" @click="SubmitAll">提交</Button>
        </div>
      </Form>
    </div>
    <Modal
      v-model="RemarkModal"
      @on-ok="SubRemark">
      <h2 slot="header">备注信息</h2>
      <Input v-model="ResData.info.remark" type="textarea" :rows="4" placeholder="请输入备注信息"></Input>
    </Modal>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import Area from '@/util/area.json'

  export default {
    name: 'consumerEdit',
    props: {
      info: Object,
      uid: Number
    },
    data () {
      return {
        title: '编辑资料',
        AddressWidth: '300px',
        RemarkModal: false,
        WxShow: false,
        //地区数据
        ChoseCompany: [],
        DetailsCompany: '',
        ChoseLive: [],
        DetailsLive: '',
        //提交数据数据
        ResData: {
            info: {
                name: '',
                phone: '',
                idcard: '',
                education: '',
                company: '',
                address_company: [],
                address_live: [],
                type: '',
                black: '',
                zmop: '',
                allow_delay: '',
                credit_limit: '',
                sex: '',
                nation: '',
                birth: '',
                address: '',
                remark: ''
            },
            rz_info: [],
            lianxiren: [],
            auditor: [],
            collector:[]
        },
        AllAreaData: Area, //全国省市区信息集合
        DelayBtn: {
            type: 'primary',
            name: '开通展期'
        },
        BlackBtn: {
            type: 'error',
            name: '加入黑名单'
        }
      }
    },
    watch: {
      info(){
        this.ResData = this.info;
        this.ResData.uid = this.uid;
        this.ResData.info.uid = this.uid;
        this.ChoseCompany = this.StdArea(this.info.info.address_company);
        this.DetailsCompany = this.info.info.address_company[3];
        this.ChoseLive = this.StdArea(this.info.info.address_live);
        this.DetailsLive = this.info.info.address_live[3];
        this.BindHidden();
        this.WxShenh();
      },
      ChoseCompany(){
        this.AddressBack();
      },
      ChoseLive(){
        this.AddressBack();
      },
      DetailsCompany(){
        this.AddressBack();
      },
      DetailsLive(){
        this.AddressBack();
      }
    },
    methods: {
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
        });
      },
      //返回列表
      BackList(){
        this.$emit('BackOpt');
        this.ChoseCompany = [];
        this.DetailsCompany = '';
        this.ChoseLive = [];
        this.DetailsLive = '';
        this.ResData = {
          info: {
            name: '',
            phone: '',
            idcard: '',
            education: '',
            company: '',
            address_company: [],
            address_live: [],
            type: '',
            black: '',
            zmop: '',
            allow_delay: '',
            credit_limit: '',
            sex: '',
            nation: '',
            birth: '',
            address: ''
          },
          rz_info: [],
          lianxiren: [],
          auditor: [],
          collector:[]
        };
      },
      //选择时间
      PickDate(time){
        this.ResData.info.birth = time;
      },
      //转换前端用地址格式
      StdArea(arr){
        if(arr[0] === arr[1]){
            return [arr[0],arr[2]];
        }else{
            return [...arr.slice(0,3)];
        }
      },
      //转换后端用
      BackArea(arr){
        let newArr = [...arr];
        if(arr.length === 2){
            newArr.unshift(arr[0]);
        }
        return newArr;
      },
      //传输所用的地址
      AddressBack(){
        this.ResData.info.address_company = [...this.BackArea(this.ChoseCompany), this.DetailsCompany];
        this.ResData.info.address_live = [...this.BackArea(this.ChoseLive), this.DetailsLive];
      },
      BindHidden(){
        const delay = this.ResData.info.allow_delay;
        const black = this.ResData.info.black;
        if(delay){
          this.DelayBtn.type = 'default';
          this.DelayBtn.name = '取消展期';
        }else{
          this.DelayBtn.type = 'primary';
          this.DelayBtn.name = '开通展期'
        }
        if(black){
          this.BlackBtn.type = 'default';
          this.BlackBtn.name = '移除黑名单';
        }else{
          this.BlackBtn.type = 'error';
          this.BlackBtn.name = '加入黑名单';
        }
      },
      //判断微信认证是否出现
      WxShenh(){
        if(this.ResData.info.auditorId === 0){

        }else{

        }
      },
      //开通展期
      OpenDelay(){
        this.UploadData('User/allowDelay',{uid: this.uid}).then((d)=>{
          this.ResData.info.allow_delay = d.val;
          this.BindHidden();
        });
      },
      //加入黑名单
      AddBlack(){
        this.UploadData('User/black',{uid: this.uid}).then((d)=>{
          this.ResData.info.black = d.val;
          this.BindHidden();
        })
      },
      //备注信息
      OpenRemark(){
        this.RemarkModal = true;
      },
      SubRemark(){
        const remark = {
            uid: this.uid,
            remark: this.ResData.info.remark
        }
        this.UploadData('User/remark',remark);
      },
      //提交所有信息
      SubmitAll(){
        const allinfo = JSON.stringify(this.ResData);
        this.UploadData('User/editUserQuery',{_post: allinfo})
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
    padding-top: 20px;
    .ivu-table-wrapper{
      border: none;
    }
  }
  .card-tit{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .info-box{
    padding: 10px 30px;
  }
  .second-part{
    margin-top: 20px;
  }
  .btn-area{
    padding-bottom: 10px;
    &.suball{
      padding-top: 50px;
    }
  }
</style>
