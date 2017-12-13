<template>
  <div id="version-config">
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
            <Button type="warning" size="large" icon="wrench" @click="AddModeModal">添加版本信息</Button>
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"></Table>
      </Card>
    </div>
    <Modal
      v-model="ModeModal.modal"
      title="添加版本信息">
      <Form ref="ModeModal" :model="ModeModal.data" :rules="ValidateRules" label-position="right" :label-width="100">
        <FormItem label="设备类型：">
          <RadioGroup v-model="ModeModal.data.type">
            <Radio :label="0">安卓</Radio>
            <Radio :label="1">IOS</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="更新类型：">
          <RadioGroup v-model="ModeModal.data.uptype">
            <Radio :label="0">非强制更新</Radio>
            <Radio :label="1">强制更新</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="版本号：" prop="version_sn">
          <Input v-model="ModeModal.data.version_sn"></Input>
        </FormItem>
        <FormItem label="版本地址：" prop="version_address">
          <Input v-model="ModeModal.data.version_address"></Input>
        </FormItem>
        <FormItem label="版本描述：" prop="version_desc">
          <Input v-model="ModeModal.data.version_desc" type="textarea" :rows="3"></Input>
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
    name: 'VersionConfig',
    data () {
      return {
        title: '版本信息配置',
        apiUrl: '/backend/Sysconfig/sysVersionList',
        auth_id: '',
        loading: true,
        TextArr:{
          type: ['安卓','IOS'],
          uptype: ['非强制更新','强制更新']
        },
        //添加用户类型
        ModeModal:{
          modal: false,
          isEdit: false,
          id: '',
          data: {
            type: 1,
            uptype: 1,
            version_sn: '',
            version_address: '',
            version_desc: ''
          }
        },
        UserCol: [
          {
            title: '序号',
            width: '70',
            align: 'center',
            key: 'id'
          },{
            title: '设备类型',
            key: 'type'
          },{
            title: '更新类型',
            key: 'uptype'
          },{
            title: '版本号',
            key: 'version_sn'
          },{
            title: '版本地址',
            key: 'version_address'
          },{
            title: '版本描述',
            key: 'version_desc'
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
          version_sn: [
            {required: true, message: '版本号不能为空！'}
          ],
          version_address: [
            {required: true, message: '版本地址不能为空！'}
          ],
          version_desc: [
            {required: true, message: '版本描述不能为空！'}
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
            }else{
              this.$Message.error(d.message);
            }
          }).catch((err)=>{
            this.$Message.error('服务器繁忙，请稍后再试！');
          })
        })
      },
      //添加模板
      AddModeModal(){
        this.$refs['ModeModal'].resetFields();
        this.ModeModal.data = {
          type: 0,
          uptype: 0,
          version_sn: '',
          version_address: '',
          version_desc: ''
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
            const isEdit = this.ModeModal.isEdit;
            const url = isEdit?'/backend/Sysconfig/sysVersionUp':'/backend/Sysconfig/sysVersionAdd';
            if(isEdit){
              ninfo.id = this.ModeModal.id;
            }
            this.UploadData(url,ninfo).then(()=>{
              this.InitData(this.apiUrl);
            });
          }
        });
      },
      //修改版本
      EditOpt(row){
        this.ModeModal.data = {
          type: this.TextArr.type.indexOf(row.type),
          uptype: this.TextArr.uptype.indexOf(row.uptype),
          version_sn: row.version_sn,
          version_address: row.version_address,
          version_desc: row.version_desc
        };
        this.ModeModal.isEdit = true;
        this.ModeModal.id = row.id;
        this.ModeModal.modal = true;
      },
      //删除版本配置
      Delopt(row){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">删除此版本配置？</p>`,
          onOk: ()=>{
            this.UploadData('/backend/Sysconfig/sysVersionDel',{id: row.id}).then(()=>{
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
