<template>
  <div id="listRole">
    <h1 class="list-title">{{ title }}</h1>
    <div class="operate-box">
      <Button type="primary" icon="plus" size="large" @click="AddShow">添加账号</Button>
      <Button type="warning" icon="ios-reload" size="large" @click="RefreshList">刷新列表</Button>
    </div>
    <div class="data-area">
      <Table :columns="UserCol"
             size="large"
             :row-class-name="IsSuperAdmin"
             :data="UserData"
             :loading="loading"></Table>
    </div>
    <Modal
      v-model="AddModal"
      title="添加账号">
      <Form ref="AddInfo" :model="AddInfo" :rules="ValidateRules" label-position="right" :label-width="80">
        <FormItem label="账号名" prop="name">
          <Input v-model="AddInfo.name"></Input>
        </FormItem>
        <FormItem label="昵称" prop="nickname">
          <Input v-model="AddInfo.nickname"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="AddInfo.password"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input v-model="AddInfo.phone"></Input>
        </FormItem>
        <FormItem label="微信号" prop="wechat">
          <Input v-model="AddInfo.wechat"></Input>
        </FormItem>
        <FormItem label="状态" prop="is_status">
          <RadioGroup v-model="AddInfo.is_status">
            <Radio label="已启用"></Radio>
            <Radio label="已禁用"></Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="AddCancel" size="large">取消</Button>
        <Button type="primary" @click="AddOver" size="large">添加</Button>
      </div>
    </Modal>
    <Modal
      v-model="EditModal"
      title="编辑账号">
      <Form ref="EditInfo" :model="EditInfo" :rules="ValidateRules" label-position="right" :label-width="60">
        <FormItem label="账号编号">
          <Input v-model="EditInfo.id" disabled></Input>
        </FormItem>
        <FormItem label="账号名" prop="name">
          <Input v-model="EditInfo.name"></Input>
        </FormItem>
        <FormItem label="昵称" prop="nickname">
          <Input v-model="EditInfo.nickname"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input v-model="EditInfo.phone"></Input>
        </FormItem>
        <FormItem label="微信号" prop="wechat">
          <Input v-model="EditInfo.wechat"></Input>
        </FormItem>
        <FormItem label="初始页" prop="menu_index">
          <Select v-model="EditInfo.menu_index">
            <Option v-for="item in AuthData" :value="item.id" :key="item.id">{{ item.title }}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态" prop="is_status">
          <RadioGroup v-model="EditInfo.is_status">
            <Radio label="已启用"></Radio>
            <Radio label="已禁用"></Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="EditCancel" size="large">取消</Button>
        <Button type="primary" @click="EditOver" size="large">修改</Button>
      </div>
    </Modal>
    <RadioModal
      title="分配部门"
      :modalShow="AssignDepModal"
      :RdoInfo="DeparList"
      :InitDep="InitDep"
      label1="账号编号"
      label2="选择部门"
      @UpOver="Updepart"
      @CloseModal="CloseDep"></RadioModal>
    <CheckboxModal
      title="分配角色"
      :modalShow="AssignRoleModal"
      :CheckInfo="RoleList"
      :InitData="InitRole"
      label1="账号编号"
      label2="选择角色"
      @UpOver="UpRole"
      @CloseModal="CloseRole"></CheckboxModal>
    <CheckboxModal
      title="可视部门"
      :modalShow="SeeDepModal"
      :CheckInfo="SeeDepList"
      :InitData="InitSeeDep"
      label1="账号编号"
      label2="选择部门"
      @UpOver="UpSeeDep"
      @CloseModal="CloseSeeDep"></CheckboxModal>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import { phoneCheck } from '@/util/valid'
  import RadioModal from '@/components/listUser/RadioModal'
  import CheckboxModal from '@/components/listUser/CheckboxModal'

  export default {
    name: 'listRole',
    components: {
      RadioModal,
      CheckboxModal
    },
    data () {
      return {
        title: '账号管理',
        DeparList: [],
        RoleList: [],
        SeeDepList: [],
        AssignDepModal: false,
        InitDep: {
          id: '',
          depar_id: ''
        },
        AssignRoleModal: false,
        InitRole:{
          id: '',
          check_id: []
        },
        SeeDepModal: false,
        InitSeeDep:{
            id: '',
            check_id: []
        },
        loading: true,
        //表格数据
        UserCol: [
          {
            title: '账号编号',
            width: '100',
            key: 'id'
          },{
            title: '账号名称',
            width: '100',
            key: 'admin_name'
          },{
            title: '昵称',
            key: 'nickname'
          },{
            title: '手机号',
            key: 'phone'
          },{
            title: '初始页',
            key: 'menu_index'
          },{
            title: '部门编号',
            width: '100',
            key: 'depar_id'
          },{
            title: '微信号',
            key: 'wechat'
          },{
            title: '最近一次登录时间',
            key: 'recent_logintime'
          },{
            title: '分配角色编号',
            key: 'role'
          },{
            title: '可视部门编号',
            key: 'depar'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '280',
            render: (h, params)=>{
              let BtnArr = [];
              if(params.row.id === 1){
                BtnArr = '超级管理员，无法操作'
              }else{
                let rule = {};
                rule.btns = [{
                  class: 'ChangeStatus',
                  name: 'is_status',
                  type: 'warning',
                  right: '已启用',
                  wbtn: '禁用'
                }];
                rule.size = 2;
                BtnArr = this.$renderBtn(h, params, this.BtnData,rule);
              }
              return h('div',BtnArr);
            }
          }
        ],
        UserData: [],     //表格数据
        RowUserData: [],  //获取的原始数据
        BtnData: [],      //按钮数据
        AuthData: [],
        EditModal: false,
        //编辑数据
        EditInfo:{
          id: '',
          name: '',
          nickname: '',
          phone: '',
          wechat: '',
          menu_index: '',
          is_status: '已启用'
        },
        AddModal: false,
        //添加数据
        AddInfo: {
          name: '',
          nickname: '',
          password: '',
          phone: '',
          wechat: '',
          is_status: '已启用'
        },
        ValidateRules:{
          name: [
            {required: true,message: '账号名不能为空！'}
          ],
          nickname: [
            {required: true,message: '昵称不能为空！'}
          ],
          password: [
            {required: true,message: '密码不能为空！'}
          ],
          phone: [
            {required: true, message: '手机号码不能为空！'},
            {validator: phoneCheck, trigger: 'blur'}
          ],
          wechat: [
            {required: true,message: '微信号不能为空！'}
          ],
          is_status: [
            {required: true,message: '请选择状态！'}
          ],
          menu_index: [
            {required: true,message: '初始页不能为空！'}
          ]
        }
      }
    },
    created(){
      this.InitData();
    },
    methods: {
      //初始化数据
      InitData(callback = ()=>{}){
        const that = this;
        const auth_id = getLocal('auth_id');
        this.loading = true;
        //列表数据获取
        this.$post('/backend/Auth/adminUserList').then((d)=>{
          let info = d.data;
          const auth_id = getLocal('auth_id');
          that.RowUserData = info;
          info.forEach((infoObj)=>{
            infoObj.is_status = infoObj.is_status?'已启用':'已禁用';
          });
          that.UserData = info;
          that.loading = false;
          callback();
        });
        //部门数据获取
        this.$post('/backend/Auth/deparList').then((d)=>{
          that.DeparList = d.data;
          that.SeeDepList = [];
          d.data.forEach((val,index)=>{
            let data = {
              id: val.id,
              role_name: val.title
            };
            that.SeeDepList.push(data);
          })
        });
        //角色数据获取
        this.$post('/backend/Auth/roleList').then((d)=>{
          that.RoleList = d.data;
        });
        //获取按钮信息
        this.$fetch('/backend/Menuauth/listAuthGet',{auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
        })
      },
      //判断超级管理员
      IsSuperAdmin(row){
        if(row.id === 1){
          return 'super-admin';
        }else{
          return '';
        }
      },
      //刷新列表
      RefreshList(){
        this.InitData(()=>{
          this.$Message.success('刷新成功');
        });
      },
      //提交信息操作
      UploadData(url,info){
        return new Promise((resolve)=>{
          if(info.is_status) info.is_status = info.is_status === '已启用'?1:0;
          this.$post(url,info).then((d)=>{
            if(d.status === 1){
              this.$Message.success(d.message);
              resolve();
              this.InitData();
            }else{
              this.$Message.error(d.message);
            }
          }).catch((err)=>{
            this.$Message.error('服务器繁忙，请稍后再试！');
          })
        })
      },
      //添加角色
      AddShow(){
        this.$refs['AddInfo'].resetFields();
        for(let key in this.AddInfo){
            this.AddInfo[key] = '';
        }
        this.AddModal = true;
      },
      //提交添加
      AddCancel(){
        this.AddModal = false;
      },
      AddOver(){
        this.$refs['AddInfo'].validate((valid)=>{
          if(valid){
            this.UploadData('/backend/Auth/adminUserAdd',this.AddInfo).then(()=>{
              this.AddModal = false;
            });
          }
        });
      },
      //编辑操作
      EditOpt(row){
        for(let key in this.EditInfo){
          if(key === 'name'){
            this.EditInfo['name'] = row['admin_name'];
          }else{
            this.EditInfo[key] = row[key]
          }
        }
        this.$fetch('/backend/Auth/getUseAuth',{admin_id: row.id}).then(d=>{
          this.EditModal = true;
          this.AuthData = d.data;
          this.AuthData.forEach(val=>{
            if(val.title === this.EditInfo.menu_index){
              this.EditInfo.menu_index = val.id;
            }
          });
        });
      },
      EditCancel(){
        this.EditModal = false;
      },
      EditOver(){
        this.$refs['EditInfo'].validate(valid=>{
          if(valid){
            this.UploadData('/backend/Auth/adminUserUpdate',this.EditInfo).then(()=>{
              this.EditModal = false;
            })
          }
        });
      },
      //启用禁用
      ChangeStatus(row){
        this.UploadData('/backend/Auth/adminUserStatus',{admin_id: row.id});
      },
      //分配部门
      AssignDep(row){
        this.InitDep.id = row.id;
        this.InitDep.depar_id = row.depar_id;
        this.AssignDepModal = true;
      },
      CloseDep(){
        this.AssignDepModal = false;
      },
      Updepart(info){
        this.AssignDepModal = false;
        let data = {
          admin_id: info.id,
          depar_id: info.depar_id
        };
        this.UploadData('/backend/Auth/deparAdminUser',data);
      },
      //分配角色
      AssignRole(row){
        this.InitRole.id = row.id;
        if(row.role !== ''){
          this.InitRole.check_id = row.role.toString().split(',').map((val)=>{
              return parseInt(val);
          });
        }else{
          this.InitRole.check_id = [];
        }
        this.AssignRoleModal = true;
      },
      CloseRole(){
        this.AssignRoleModal = false;
      },
      UpRole(info){
        this.AssignRoleModal = false;
        let data = {
          admin_id: info.id,
          role_id: info.check_id.join(',')
        };
        this.UploadData('/backend/Auth/roleAllotment',data);
      },
      //可视部门
      SeeDep(row){
        this.InitSeeDep.id = row.id;
        if(row.depar !== ''){
          this.InitSeeDep.check_id = row.depar.toString().split(',').map((val)=>{
            return parseInt(val);
          });
        }else{
          this.InitSeeDep.check_id = [];
        }
        this.SeeDepModal = true;
      },
      CloseSeeDep(){
        this.SeeDepModal = false;
      },
      UpSeeDep(info){
        this.SeeDepModal = false;
        let data = {
          admin_id: info.id,
          depar_id: info.check_id.join(',')
        };
        this.UploadData('/backend/Auth/dataScope',data);
      }
    }
  }
</script>


<style lang="less" scoped>
  .list-title{
    font-weight: normal;
  }
  .operate-box{
    padding: 10px 0 20px;
  }
</style>
