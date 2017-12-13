<template>
  <div id="certify-config">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
    </h1>
    <div class="data-area">
      <Card :padding="0">
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="clipboard"></Icon>
            认证列表
          </h3>
          <div class="btn-box">
            <Button type="warning" size="large" icon="wrench" @click="AddModeModal">添加认证</Button>
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"></Table>
      </Card>
    </div>
    <Modal
      v-model="ModeModal.modal"
      title="添加认证">
      <Form ref="ModeModal" :model="ModeModal.data" :rules="ValidateRules" label-position="right" :label-width="100">
        <FormItem label="状态：">
          <RadioGroup v-model="ModeModal.data.status">
            <Radio :label="1">开启</Radio>
            <Radio :label="0">关闭</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="名称：" prop="cer_name">
          <Input v-model="ModeModal.data.cer_name"></Input>
        </FormItem>
        <FormItem label="模型名称：" prop="cer_model">
          <Input v-model="ModeModal.data.cer_model"></Input>
        </FormItem>
        <FormItem label="排序：" prop="sort">
          <InputNumber v-model="ModeModal.data.sort"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="ModalCancel" size="large">取消</Button>
        <Button type="primary" @click="AddOver" size="large">保存</Button>
      </div>
    </Modal>
    <Modal v-model="EditModal"
           title="设置排序">
      <Form ref="EditSort" :model="EditSort" :rules="ValidateRules" label-position="right" :label-width="100">
        <FormItem label="名称：" prop="cer_name">
          <Input v-model="EditSort.cer_name" :disabled="true"></Input>
        </FormItem>
        <FormItem label="排序：" prop="val">
          <InputNumber v-model="EditSort.val"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="EditCancel" size="large">取消</Button>
        <Button type="primary" @click="EditOver" size="large">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'CertifyConfig',
    data () {
      return {
        title: '认证配置',
        apiUrl: '/backend/Certification/getCertifiList',
        auth_id: '',
        loading: true,
        TextArr:{
          status: ['关闭','开启']
        },
        //添加用户类型
        ModeModal:{
          modal: false,
          data: {
            cer_name: '',
            cer_model: '',
            status: 1,
            sort: 1
          }
        },
        //修改排序
        EditModal: false,
        EditSort: {
          id: '',
          cer_name: '',
          val: 0
        },
        UserCol: [
          {
            title: '序号',
            width: '70',
            align: 'center',
            key: 'id'
          },{
            title: '名称',
            key: 'cer_name'
          },{
            title: '模型名称',
            key: 'cer_model'
          },{
            title: '状态',
            key: 'status'
          },{
            title: '排序',
            key: 'sort'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '330',
            render: (h, params)=>{
              return h('div',this.$renderBtn(h, params, this.BtnData));
            }
          }
        ],
        ValidateRules:{
          cer_name: [
            {required: true, message: '认证名称不能为空！'}
          ],
          cer_model: [
            {required: true, message: '模型名称不能为空！'}
          ],
          sort: [
            {required: true, message: '排序不能为空！'}
          ],
          val: [
            {required: true, message: '排序不能为空！'}
          ]
        },
        UserData: [],     //表格数据
        RowUserData: [],  //获取的原始数据
        BtnData: []
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
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
              this.InitData(this.apiUrl);
            }else{
              this.$Message.error(d.message);
            }
          }).catch((err)=>{
            this.$Message.error('服务器繁忙，请稍后再试！');
          })
        })
      },
      //添加配置
      AddModeModal(){
        this.$refs['ModeModal'].resetFields();
        this.ModeModal.data = {
          cer_name: '',
          cer_model: '',
          status: 1,
          sort: 0
        };
        this.ModeModal.modal = true;
      },
      ModalCancel(){
        this.ModeModal.modal = false;
      },
      AddOver(){
        this.$refs['ModeModal'].validate(valid=>{
          if(valid){
            let ninfo = this.RemoveObserve(this.ModeModal.data);
            const url = '/backend/Certification/AddCertifi';
            this.UploadData(url,ninfo).then(()=>{
              this.ModeModal.modal = false;
            });
          }
        });
      },
      //修改操作
      EditOpt(row){
        this.EditModal = true;
        this.EditSort.id = row.id;
        this.EditSort.cer_name = row.cer_name;
        this.EditSort.val = row.sort;
      },
      EditCancel(){
        this.EditModal = false;
      },
      EditOver(){
        this.$refs['EditSort'].validate(valid=>{
          if(valid){
            let sinfo = this.RemoveObserve(this.EditSort);
            this.UploadData('/backend/Certification/setCertifi',sinfo).then(()=>{
              this.EditModal = false;
            })
          }
        });
      },
      //删除认证配置
      Delopt(row){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">删除此认证配置？</p>`,
          onOk: ()=>{
            this.UploadData('/backend/Certification/delCertifi',{id: row.id}).then(()=>{
              this.InitData(this.apiUrl);
            });
          }
        })
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
