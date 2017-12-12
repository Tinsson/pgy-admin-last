<template>
  <div id="listRole">
    <h1 class="list-title">{{ title }}</h1>
    <div class="operate-box">
      <Button type="primary" icon="plus" size="large" @click="AddShow">添加角色</Button>
      <Button type="warning" icon="ios-reload" size="large" @click="RefreshList">刷新列表</Button>
    </div>
    <div class="data-area">
      <Table :columns="RoleCol"
             size="large"
             :data="RoleData"
             :loading="loading"></Table>
    </div>
    <Modal
      v-model="AddModal"
      title="添加角色">
      <Form ref="AddInfo" :model="AddInfo" :rules="AddRules" label-position="right" :label-width="80">
        <FormItem label="父级编号">
          <Input v-model="AddInfo.pid" disabled></Input>
        </FormItem>
        <FormItem label="角色名称" prop="name">
          <Input v-model="AddInfo.name"></Input>
        </FormItem>
        <FormItem label="状态">
          <RadioGroup v-model="AddInfo.status">
            <Radio label="已启用"></Radio>
            <Radio label="已禁用"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="排序" prop="sort">
          <Input v-model="AddInfo.sort"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="AddCancel" size="large">取消</Button>
        <Button type="primary" @click="AddOver" size="large">添加</Button>
      </div>
    </Modal>
    <Modal
      v-model="EditModal"
      title="编辑权限">
      <Form ref="EditInfo" :model="EditInfo" :rules="AddRules" label-position="right" :label-width="100">
        <FormItem label="角色编号">
          <Input v-model="EditInfo.id" disabled></Input>
        </FormItem>
        <FormItem label="角色名称" prop="name">
          <Input v-model="EditInfo.name"></Input>
        </FormItem>
        <FormItem label="状态">
          <RadioGroup v-model="EditInfo.status">
            <Radio label="已启用"></Radio>
            <Radio label="已禁用"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="排序" prop="sort">
          <Input v-model="EditInfo.sort"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="EditCancel" size="large">取消</Button>
        <Button type="primary" @click="EditOver" size="large">修改</Button>
      </div>
    </Modal>
    <Modal
      v-model="AssignModal"
      title="权限分配"
      @on-ok="AssignOver">
      <Form class="auto-area" label-position="right" :label-width="60">
        <FormItem label="角色编号">
          <Input v-model="AssignInfo.role_id" disabled></Input>
        </FormItem>
        <FormItem label="权限">
          <CheckboxGroup v-model="AssignInfo.auth_id">
            <div v-for="(item,index) in AuthList" :key="item.id">
              <Checkbox :label="item.id">{{item.title}}</Checkbox>
              <div class="auth-seclist" v-for="(secItem,secIndex) in item.auth" :key="secItem.id">
                <Checkbox :label="secItem.id">{{secItem.title}}</Checkbox>
                <Checkbox v-for="(thirdItem, thirdIndex) in secItem.auth" :label="thirdItem.id" :key="thirdItem.id">{{thirdItem.title}}</Checkbox>
              </div>
            </div>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'listRole',
    data () {
      return {
        title: '角色管理',
        loading: true,
        RoleCol: [
          {
            title: '角色编号',
            key: 'id'
          },{
            title: '角色名称',
            key: 'role_name'
          },{
            title: '状态',
            key: 'status'
          },{
            title: '排序',
            key: 'sort'
          },{
            title: '创建时间',
            key: 'created_at'
          },{
            title: '修改时间',
            key: 'updated_at'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '200',
            render: (h, params)=>{
              return h('div',this.$renderBtn(h, params, this.BtnData));
            }
          }
        ],
        RoleData: [],     //表格数据
        RowRoleData: [],  //获取的原始数据
        BtnData: [],      //按钮数据
        AddModal: false,
        AddInfo: {
          pid: '',
          name: '',
          status: '',
          sort: ''
        },
        AddRules:{
          name: [
            {required: true,message: '角色名称不能未空'}
          ],
          sort: [
            {required: true,message: '请填写排序数字，数字越小越靠前'}
          ]
        },
        EditModal: false,
        EditInfo:{
          id: '',
          name: '',
          status: '',
          sort: ''
        },
        AssignModal: false,
        AssignInfo:{
            role_id: '',
            auth_id: [0]
        },
        AuthList: []
      }
    },
    created(){
      this.InitData();
    },
    methods: {
      //初始化数据
      InitData(callback = ()=>{}){
        const that = this;
        const auth_id = this.$getLocal('auth_id');
        this.loading = true;
        //列表数据获取
        this.$post('/backend/Auth/roleList').then((d)=>{
          let info = d.data;
          that.RowRoleData = info;
          info.forEach((infoObj)=>{
            infoObj.status = infoObj.status?'已启用':'已禁用';
          });
          that.RoleData = info;
          that.loading = false;
          callback();
        });
        //权限数据获取
        this.$post('/backend/Auth/authList').then((d)=>{
          that.AuthList = d.data;
        });
        //获取按钮信息
        this.$fetch('/backend/Menuauth/listAuthGet',{auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
        })
      },
      //刷新列表
      RefreshList(){
        this.InitData(()=>{
            this.$Message.success('刷新成功');
        });
      },
      //提交信息操作
      UploadData(url,info){
        if(info.status){info.status = (info.status === '已启用')?1:0}
        return new Promise((resolve)=>{
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
        this.AddInfo.pid = 0;
        this.AddInfo.name = '';
        this.AddInfo.status = '已启用';
        this.AddInfo.sort = '';
        this.AddModal = true;
      },
      //提交操作
      AddCancel(){
          this.AddModal = false;
      },
      AddOver(){
        this.$refs['AddInfo'].validate((valid)=>{
          if(valid){
            this.UploadData('/backend/Auth/roleAdd',this.AddInfo).then(()=>{
              this.AddModal = false;
            });
          }
        })
      },
      //编辑操作
      EditOpt(row){
        this.$refs['EditInfo'].resetFields();
        this.EditModal = true;
        for(let key in this.EditInfo){
          if(key === 'name'){
            this.EditInfo['name'] = row['role_name'];
          }else{
            this.EditInfo[key] = row[key]
          }
        }
      },
      //编辑操作
      EditCancel(){
        this.EditModal = false;
      },
      EditOver(){
        this.$refs['EditInfo'].validate(valid=>{
          if(valid){
            let info = {
              id: '',
              name: '',
              status: '',
              sort: ''
            };
            this.TransData(this.EditInfo, info);
            this.UploadData('/backend/Auth/roleEdit', info).then(()=>{
              this.EditModal = false;
            });
          }
        });
      },
      //权限分配操作
      AssignAuth(row){
        this.AssignInfo.role_id = row.id;
        if(row.auth !== null && row.auth !== true){
          let auth_id = row.auth.split(',');
          auth_id = auth_id.map((val)=> parseInt(val));
          this.AssignInfo.auth_id = auth_id;
        }else{
          this.AssignInfo.auth_id = [];
        }
        this.AssignModal = true;
      },
      AssignOver(){
        let info = {
          role_id: this.AssignInfo.role_id,
          auth_id: this.AssignInfo.auth_id.join(',')
        };
        this.UploadData('/backend/Auth/roleAuthAllotment',info);
      },
      //转换data数据
      TransData(obdata,normal){
        for(let key in normal){
          normal[key] = obdata[key];
        }
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
  .auth-seclist{
    padding-left: 8px;
  }
  .auto-area{
    max-height: 400px;
    overflow-y: auto;
  }
</style>
