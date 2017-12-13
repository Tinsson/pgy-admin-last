<template>
  <div id="pay-config">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
    </h1>
    <div class="data-area">
      <Card :padding="0">
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="clipboard"></Icon>
            配置列表
          </h3>
          <div class="btn-box">
            <Button type="warning" size="large" icon="wrench" @click="AddModeModal">添加支付渠道</Button>
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"></Table>
      </Card>
    </div>
    <Modal
      v-model="ModeModal.modal"
      title="添加支付配置">
      <Form ref="ModeModal" :model="ModeModal.data" :rules="ValidateRules" label-position="right" :label-width="100">
        <FormItem label="名称：" prop="name">
          <Select v-model="ModeModal.data.name" style="width:260px">
            <Option v-for="item in NameArr" :value="item.value" :key="item.id">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="值：" prop="disable">
          <RadioGroup v-model="ModeModal.data.disable">
            <Radio :label="0">关闭</Radio>
            <Radio :label="1">开启</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="ModalCancel" size="large">取消</Button>
        <Button type="primary" @click="AddOver" size="large">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'PayConfig',
    data () {
      return {
        title: '支付配置',
        apiUrl: '/backend/PaymentSet/paymentList',
        auth_id: '',
        loading: true,
        TextArr:{},
        //添加统一配置
        ModeModal:{
          modal: false,
          isEdit: false,
          id: '',
          data: {
            name: '',
            disable: 0
          }
        },
        UserCol: [
          {
            title: '序号',
            width: '70',
            align: 'center',
            key: 'id'
          },{
            title: '名称',
            key: 'name'
          },{
            title: '值',
            key: 'disable'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '330',
            render: (h, params)=>{
              const rule = {
                name: 'disable',
                right: true,
                wbtn: '禁用'
              }
              return h('div',this.$renderBtn(h, params, this.BtnData,rule));
            }
          }
        ],
        ValidateRules:{
          name: [
            {required: true, message: '名称不能为空！'}
          ],
          disable: [
            {required: true, message: '值不能为空！'}
          ]
        },
        UserData: [],     //表格数据
        RowUserData: [],  //获取的原始数据
        BtnData: [],
        NameArr: []
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.$fetch('/backend/Unified/UnifiedList').then(d=>{
        this.NameArr = d.data;
      });
      this.InitData(this.apiUrl);
    },
    methods: {
      //去除data数据里绑定的监视器
      RemoveObserve(rowdata){
        return JSON.parse(JSON.stringify(rowdata));
      },
      //初始化数据
      InitData(url,params = {}){
        const that = this;
        this.loading = true;
        //获取按钮信息
        this.$fetch('/backend/Menuauth/listAuthGet',{auth_id: this.auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
        });
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data;
            this.RowUserData = res;
            this.UserData = res;
            if(res.length > 0){
              this.UserData.forEach(val=>{
                for(let key in val){
                  if(key in this.TextArr){
                    val[key] = this.TextArr[key][val[key]];
                  }
                }
              })
            }
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
      //添加统一配置
      AddModeModal(){
        this.$refs['ModeModal'].resetFields();
        this.ModeModal.data = {
          name: '',
          disable: 0
        };
        this.ModeModal.isEdit = false;
        this.ModeModal.modal = true;
      },
      ModalCancel(){
        this.ModeModal.modal = false;
      },
      AddOver(){
        this.$refs['ModeModal'].validate(valid=>{
          if(valid){
            this.ModeModal.modal = false;
            let ninfo = this.RemoveObserve(this.ModeModal.data);
            const url = '/backend/PaymentSet/paymentAdd';
            this.UploadData(url,ninfo).then(()=>{
              this.InitData(this.apiUrl);
            });
          }
        });
      },
      //开启支付
      ChangeStatus(row){
        const disable = row.disable?0:1;
        const id = row.id;
        this.UploadData('/backend/PaymentSet/paymentDsiable',{id,disable}).then(()=>{
          this.InitData(this.apiUrl);
        });
      },
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
  .col-center{
    text-align: center;
  }
  .auto-height{
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .info-width{
    width: 200px;
  }
</style>
