<template>
  <div id="listRole">
    <h1 class="list-title">{{ title }}</h1>
    <div class="operate-box">
      <Button type="primary" icon="plus" size="large" @click="AddOpt({levelNum: 0})">添加菜单</Button>
      <Button type="warning" icon="ios-reload" size="large" @click="RefreshList">刷新列表</Button>
    </div>
    <div class="data-area">
      <Table :columns="UserCol"
             size="large"
             :data="DepData"
             :loading="loading"></Table>
    </div>
    <Modal
      v-model="AddModal"
      title="添加菜单">
      <Form ref="AddInfo" :model="AddInfo" :rules="ValidateRules" label-position="right" :label-width="80">
        <FormItem label="菜单标题" prop="title">
          <Input v-model="AddInfo.title"></Input>
        </FormItem>
        <FormItem label="状态" prop="status">
          <RadioGroup v-model="AddInfo.status">
            <Radio label="开启"></Radio>
            <Radio label="关闭"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="排序" prop="sort">
          <Input v-model="AddInfo.sort"></Input>
        </FormItem>
        <FormItem label="菜单图标">
          <Input v-model="AddInfo.icon" :disabled="AddInfo.iconState"></Input>
        </FormItem>
        <FormItem label="目录链接">
          <Input v-model="AddInfo.function" :disabled="AddInfo.topLevel"></Input>
        </FormItem>
        <FormItem label="接口链接">
          <Input v-model="AddInfo.apiurl" :disabled="AddInfo.topLevel"></Input>
        </FormItem>
        <FormItem label="是否为按钮">
          <RadioGroup v-model="AddInfo.mark">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="按钮类型">
          <Select v-model="AddInfo.href" :disabled="AddInfo.hideBtn" placeholder="请选择按钮类型">
            <Option v-for="item in BtnType" :key="item.value" :value="item.value">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="按钮颜色">
          <Select v-model="AddInfo.color" :disabled="AddInfo.hideBtn" placeholder="请选择按钮类型">
            <Option value="ghost"></Option>
            <Option value="primary"></Option>
            <Option value="info"></Option>
            <Option value="success"></Option>
            <Option value="warning"></Option>
            <Option value="error"></Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="AddCancel" size="large">取消</Button>
        <Button type="primary" @click="AddOver" size="large">添加</Button>
      </div>
    </Modal>
    <Modal
      v-model="EditModal"
      title="编辑菜单">
      <Form ref="EditInfo" :model="EditInfo" :rules="ValidateRules" label-position="right" :label-width="80">
        <FormItem label="菜单标题" prop="title">
          <Input v-model="EditInfo.title"></Input>
        </FormItem>
        <FormItem label="状态" prop="status">
          <RadioGroup v-model="EditInfo.status">
            <Radio label="开启"></Radio>
            <Radio label="关闭"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="排序" prop="sort">
          <Input v-model="EditInfo.sort"></Input>
        </FormItem>
        <FormItem label="菜单图标">
          <Input v-model="EditInfo.icon" :disabled="EditInfo.iconState"></Input>
        </FormItem>
        <FormItem label="目录链接">
          <Input v-model="EditInfo.function" :disabled="EditInfo.topLevel"></Input>
        </FormItem>
        <FormItem label="接口链接">
          <Input v-model="EditInfo.apiurl" :disabled="EditInfo.topLevel"></Input>
        </FormItem>
        <FormItem label="是否为按钮">
          <RadioGroup v-model="EditInfo.mark">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="按钮类型">
          <Select v-model="EditInfo.href" :disabled="EditInfo.hideBtn" placeholder="请选择按钮类型">
            <Option v-for="item in BtnType" :key="item.value" :value="item.value">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="按钮颜色">
          <Select v-model="EditInfo.color" :disabled="EditInfo.hideBtn" placeholder="请选择按钮类型">
            <Option value="ghost"></Option>
            <Option value="primary"></Option>
            <Option value="info"></Option>
            <Option value="success"></Option>
            <Option value="warning"></Option>
            <Option value="error"></Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="EditCancel" size="large">取消</Button>
        <Button type="primary" @click="EditOver" size="large">修改</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import store from '@/store'

  export default {
    name: 'listRole',
    data () {
      return {
        title: '菜单管理',
        auth_id: '',
        loading: true,
        BtnType:[{
          name: '查看按钮',
          value: 'DetailsOpt'
        },{
          name: '删除按钮',
          value: 'Delopt'
        },{
          name: '添加按钮',
          value: 'AddOpt'
        },{
          name: '编辑按钮',
          value: 'EditOpt'
        },{
          name: '备注按钮',
          value: 'RemarkOpt'
        },{
          name: '展期按钮',
          value: 'DelayOpt'
        },{
          name: '还款按钮',
          value: 'RepayOpt'
        },{
          name: '放款按钮',
          value: 'LoanOpt'
        },{
          name: '离职按钮',
          value: 'QuitOpt'
        },{
          name: '通过按钮',
          value: 'PassOpt'
        },{
          name: '拒绝按钮',
          value: 'RejectOpt'
        },{
          name: '挂起按钮',
          value: 'HangOpt'
        },{
          name: '销账按钮',
          value: 'WriteOffOpt'
        },{
          name: '提前还款按钮',
          value: 'PreRepayOpt'
        },{
          name: '授予额度按钮',
          value: 'GiveLimitOpt'
        },{
          name: '添加记录按钮',
          value: 'RecordAddOpt'
        },{
          name: '设置放款员按钮',
          value: 'SetLoanOpt'
        },{
          name: '加入黑名单按钮',
          value: 'AddBlackOpt'
        },{
          name: '审核面板按钮',
          value: 'AuditPanel'
        },{
          name: '禁用启用按钮',
          value: 'ChangeStatus'
        },{
          name: '主动分配按钮',
          value: 'AssignUrge'
        },{
          name: '权限分配按钮',
          value: 'AssignAuth'
        },{
          name: '分配部门按钮',
          value: 'AssignDep'
        },{
          name: '分配角色按钮',
          value: 'AssignRole'
        },{
          name: '可视部门按钮',
          value: 'SeeDep'
        }],
        UserCol: [
          {
            title: '菜单编号',
            key: 'id',
            width: '100'
          },{
            title: '菜单标题',
            key: 'title',
            width: '180'
          },{
            title: '菜单图标',
            key: 'icon'
          },{
            title: '目录链接',
            key: 'function'
          },{
            title: '接口链接',
            key: 'apiurl'
          },{
            title: '按钮类型',
            key: 'href'
          },{
            title: '状态',
            width: '80',
            key: 'status'
          },{
            title: '排序',
            width: '80',
            key: 'sort'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '220',
            render: (h, params)=>{
              let BtnArr = this.$renderBtn(h, params, this.BtnData);
              if(!params.row.hasAdd && params.row.href !== 'AuditPanel'){
                BtnArr.shift();
              }
              return h('div',BtnArr);
            }
          }
        ],
        DepData: [],     //表格数据
        RowDepData: [],  //获取的原始数据
        BtnData: [],      //按钮数据
        ValidateRules: {
          title: [
            {required: true,message: '菜单标题不能为空！'}
          ],
          status: [
            {required: true,message: '请选择状态！'}
          ],
          sort: [
            {required: true,message: '请填写排序数字！'}
          ]
        },
        EditModal: false,
        EditInfo:{
          title: '',
          id: '',
          icon: '',
          function: '',
          apiurl: '',
          href: '',
          hideBtn: false,
          topLevel: false,
          iconState: false,
          status: '',
          sort: '',
          mark: 1,
          color: ''
        },
        AddModal: false,
        AddInfo: {
          pid: '',
          title: '',
          icon: '',
          function: '',
          apiurl: '',
          href: '',
          hideBtn: false,
          topLevel: false,
          iconState: false,
          status: '',
          sort: '',
          mark: 0,
          color: ''
        },
        AssignModal: false,
        AssignInfo:{
          role_id: '',
          auth_id: ['权限管理']
        },
        AuthList: []
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.InitData();
    },
    methods: {
      //初始化数据
      InitData(callback = ()=>{}){
        const that = this;
        this.loading = true;
        //获取按钮信息
        this.$fetch('/backend/Menuauth/listAuthGet',{auth_id: this.auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
        });
        //列表数据获取
        this.$post('/backend/Auth/authList').then((d)=>{
          let info = d.data;
          let res = [];
          that.RowDepData = info;
          this.DepData = [];
          this.GetChild(info, this.DepData);
          //this.$store.dispatch('setView');
          that.loading = false;
          callback();
        });
      },
      //循环取出数据
      GetChild(data,arr,num = 0) {
        num++;
        data.forEach((val)=>{
          val.levelNum = num;
          let space = '';
          if(num > 1){
            for(let i = 1;i<num;i++){
              space += "　";
            }
            val.title = space + "|——" + val.title;
          }
          if(num > 2){
            val.hasAdd = false;
          }else{
            val.hasAdd = true;
          }
          val.status = (val.status === 1)?'开启':'关闭';
          arr.push(val);
          if(val.auth !== undefined && val.auth.length > 0){
            this.GetChild(val.auth,arr,num);
          }
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
        return new Promise(resolve=>{
          if(info.status) info.status = (info.status === '开启')?1:0;
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
        });
      },
      //添加部门
      AddOpt(p){
        this.$refs['AddInfo'].resetFields();
        this.AddInfo.href = '';
        for(let key in this.AddInfo){
          this.AddInfo[key] = '';
        }
        this.AddInfo.mark = 0;
        this.AddInfo.iconState = true;
        this.AddInfo.topLevel = true;
        if(p.levelNum === 0){
          this.AddInfo.hideBtn = true;
          this.AddInfo.iconState = false;
          this.AddInfo.pid = 0;
        }else if(p.levelNum === 1){
          this.AddInfo.topLevel = false;
          this.AddInfo.pid = p.id;
        }else{
          if(p.levelNum === 2 || p.levelNum === 3){
            this.AddInfo.mark = 1;
            this.AddInfo.hideBtn = false;
          }else{
            this.AddInfo.hideBtn = true;
          }
          this.AddInfo.pid = p.id;
        }
        this.AddModal = true;
      },
      AddCancel(){
        this.AddModal = false;
      },
      //提交添加
      AddOver(){
        this.$refs['AddInfo'].validate((valid)=>{
          if(valid){
            this.UploadData('/backend/Auth/authAdd',this.AddInfo).then(()=>{
              this.AddModal = false;
            });
          }
        });
      },
      //编辑操作
      EditOpt(row){
        this.EditModal = true;
        console.log(row.levelNum);
        for(let key in this.EditInfo){
          if(key === 'title'){
              let title = row['title'];
              if(title.indexOf('—') !== -1){
                title = title.slice(title.indexOf('——') + 2);
              }
              this.EditInfo['title'] = title;
          }else if(key === 'hideBtn'){
            this.EditInfo.hideBtn = (row.levelNum === 3 || row.levelNum === 4)?false:true;
          }else if(key === 'mark'){
            this.EditInfo.mark = (row.levelNum === 3 || row.levelNum === 4)?1:0;
          }else{
            this.EditInfo[key] = row[key];
          }
        }
        this.EditInfo.iconState = true;
        this.EditInfo.topLevel = true;
        this.EditInfo.hideBtn = true;
        switch (row.levelNum) {
          case 1:
            this.EditInfo.iconState = false;
            break;
          case 2:
            this.EditInfo.topLevel = false;
            break;
          case 3:
            this.EditInfo.hideBtn = false;
            break;
          case 4:
            this.EditInfo.hideBtn = false;
            break;
        }
      },
      EditCancel(){
        this.EditModal = false;
      },
      //提交编辑
      EditOver(){
        this.$refs['EditInfo'].validate(valid=>{
          if(valid){
            this.UploadData('/backend/Auth/authUp',this.EditInfo).then(()=>{
              this.EditModal = false;
            });
          }
        });
      },
      //删除菜单
      Delopt(row){
        //删除确认
        this.$Modal.confirm({
          title: '温馨提示',
          content: '<p class="confirm-text">确认删除此项菜单吗？</p>',
          onOk: ()=>{
            this.UploadData('/backend/Auth/authDel',{id: row.id});
          }
        })
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
