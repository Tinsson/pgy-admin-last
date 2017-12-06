<template>
  <div id="listRole">
    <h1 class="list-title">{{ title }}</h1>
    <div class="operate-box">
      <Button type="primary" icon="plus" size="large" @click="AddOpt(0)">添加部门</Button>
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
      title="添加账号">
      <Form ref="AddInfo" :model="AddInfo" :rules="ValidateRule" label-position="right" :label-width="80">
        <!--<FormItem label="父级编号">
          <Input v-model="AddInfo.pid" disabled></Input>
        </FormItem>-->
        <FormItem label="部门名称" prop="name">
          <Input v-model="AddInfo.name"></Input>
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
      title="编辑部门">
      <Form ref="EditInfo" :model="EditInfo" label-position="right" :rules="ValidateRule" :label-width="80">
        <FormItem label="部门编号">
          <Input v-model="EditInfo.id" disabled></Input>
        </FormItem>
        <FormItem label="部门名称" prop="name">
          <Input v-model="EditInfo.name"></Input>
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

  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  export default {
    name: 'listRole',
    data () {
      return {
        title: '部门管理',
        loading: true,
        UserCol: [
          {
            title: '账号编号',
            key: 'id'
          },{
            title: '父级编号',
            key: 'pid'
          },{
            title: '部门',
            key: 'title'
          },{
            title: '排序',
            key: 'sort'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '220',
            render: (h, params)=>{
              let BtnArr = [];
              this.BtnData.forEach((val)=>{
                const btn = h('Button',{
                  props: {
                    type: val.color
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: ()=>{
                      this[val.class](params.row)
                    }
                  },
                },val.name);
                BtnArr.push(btn);
              });
              return h('div',BtnArr);
            }
          }
        ],
        DepData: [],     //表格数据
        RowDepData: [],  //获取的原始数据
        BtnData: [],      //按钮数据
        ValidateRule: {
          name: [
            {required: true,message: '部门名称不能为空！'}
          ],
          sort: [
            {required: true,message: '排序数字不能为空！'}
          ]
        },
        EditModal: false,
        EditInfo:{
          id: '',
          name: '',
          sort: ''
        },
        AddModal: false,
        AddInfo: {
          pid: '',
          name: '',
          sort: ''
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
      this.InitData();
    },
    methods: {
      //初始化数据
      InitData(callback = ()=>{}){
        const that = this;
        const auth_id = getLocal('auth_id');
        this.loading = true;
        //列表数据获取
        this.$post('Auth/deparList').then((d)=>{
          let info = d.data;
          let res = [];
          that.RowDepData = info;
          info.forEach((item)=>{
            res.push(item);
            if(item.auth.length > 0){
                item.auth.map((val)=>{
                    val.title = "　|——" + val.title;
                });
                res.push(...item.auth);
            }
          });
          this.DepData = res;
          that.loading = false;
          callback();
        });
        //获取按钮信息
        this.$fetch('Menuauth/listAuthGet',{auth_id}).then((d)=>{
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
        return new Promise(resolve=>{
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
        for(let key in this.AddInfo){
          this.AddInfo[key] = '';
        }
        this.AddInfo.pid = p.pid;
        this.AddModal = true;
      },
      AddCancel(){
        this.AddModal = false;
      },
      //提交添加
      AddOver(){
        this.$refs['AddInfo'].validate(valid=>{
          if(valid){
            this.UploadData('Auth/deparAdd',this.AddInfo).then(()=>{
              this.AddModal = false;
            });
          }
        })
      },
      //编辑操作
      EditOpt(row){
        this.EditModal = true;
        for(let key in this.EditInfo){
          if(key === 'name'){
            this.EditInfo['name'] = row['title'];
          }else{
            this.EditInfo[key] = row[key]
          }
        }
      },
      EditCancel(){
        this.EditModal = false;
      },
      //提交编辑
      EditOver(){
        this.$refs['EditInfo'].validate(valid=>{
          if(valid){
            this.UploadData('Auth/deparUp',this.EditInfo).then(()=>{
              this.EditModal = false;
            });
          }
        })
      },
      //删除部门
      Delopt(p){
        //删除确认
        this.$Modal.confirm({
          title: '温馨提示',
          content: '<p class="confirm-text">确认删除此部门吗？</p>',
          onOk: ()=>{
            this.UploadData('Auth/deparDel',{id: p.id});
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
