<template>
  <div id="black-list">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
      <Button class="tit-btn"
              type="info"
              icon="ios-reload"
              size="large"
              @click="RefreshList">刷新列表</Button>
    </h1>
    <div class="screen-area">
      <Card>
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="ios-pricetags-outline"></Icon>
            筛选查询
          </h3>
          <!--<div class="btn-box">
            <Button type="ghost" icon="reply" @click="ResetScreen">重置筛选</Button>
            <Button type="success" icon="search" @click="SimpleSearch">查询结果</Button>
          </div>-->
        </div>
        <div class="opt-box">
          <div class="form-group">
            <label class="form-label">检索：</label>
            <Input v-model="ScreenData.key" style="width: 200px" @on-enter="SimpleSearch"></Input>
          </div>
        </div>
      </Card>
    </div>
    <div class="data-area">
      <Card :padding="0">
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="clipboard"></Icon>
            数据列表
          </h3>
          <div class="btn-box">
            <Button type="primary" size="large" icon="archive" @click="ExportData">导出数据</Button>
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"
               @on-selection-change="SelectTable"></Table>
        <div class="page-box">
          <Page :current="Page.cur"
                :page-size="Page.size"
                :total="Page.count"
                placement="top"
                @on-change="ChangePage"
                @on-page-size-change="ChangeSize" show-sizer></Page>
        </div>
      </Card>
    </div>
    <Modal
      v-model="EditModal"
      title="编辑账号">
      <Form ref="EditInfo" :model="EditInfo" :rules="ValidateRules" label-position="right" :label-width="80">
        <FormItem label="用户名" prop="name">
          <Input v-model="EditInfo.name"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input v-model="EditInfo.phone"></Input>
        </FormItem>
        <FormItem label="身份证号" prop="idcard">
          <Input v-model="EditInfo.idcard"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="EditCancel" size="large">取消</Button>
        <Button type="primary" @click="EditOver" size="large">修改</Button>
      </div>
    </Modal>
    <AuditModal :modalShow="Audit.modal"
                :InitId="Audit.id"
                :BtnId="Audit.btn"
                :UniqueId="Audit.id"
                :AllId="Audit.allId"
                @CloseModal="AuditCancel"></AuditModal>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import { phoneCheck } from '@/util/valid'
  import GroupSms from '@/components/groupModal/GroupSms'
  import AuditModal from '@/components/infoModal/AuditModal'

  export default {
    name: 'BlackList',
    components:{
      GroupSms,
      AuditModal
    },
    data () {
      return {
        title: '黑名单列表',
        BlackType: ['第三方认定黑名单','手动设定黑名单'],
        apiUrl: '/backend/Postloan/blackList',
        auth_id: '',
        loading: true,
        Remark: {
          modal: false,
          loan_id: '',
          remark: ''
        },
        allTime: [],
        //基础筛选数据
        ScreenData: {
          key: ''
        },
        UserCol: [
          {
            type: 'selection',
            width: 55,
            align: 'center'
          },{
            title: '序号',
            width: '70',
            align: 'center',
            key: 'id'
          },{
            title: '姓名',
            width: '100',
            align: 'center',
            key: 'name'
          },{
            title: '手机号',
            width: '150',
            align: 'center',
            key: 'phone'
          },{
            title: '身份证号',
            key: 'idcard'
          },{
            title: '黑名单类型',
            key: 'black'
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
        UserData: [],     //表格数据
        BtnData: [],
        RowUserData: [],  //获取的原始数据
        //群选打钩后操作
        SelectData: [],
        //验证规则
        ValidateRules: {
          name: [
            {required: true, message: '用户名不能为空！'}
          ],
          phone: [
            {required: true, message: '手机号码不能为空！'},
            {validator: phoneCheck, trigger: 'blur'}
          ],
          idcard: [
            {required: true, message: '身份证号不能为空！'}
          ]
        },
        EditModal: false,
        //编辑数据
        EditInfo:{
          uid: '',
          name: '',
          phone: '',
          idcard: ''
        },
        Group: {
          SmsModal: false,
          AppmsgModal: false
        },
        //初始分页信息
        Page: {
          count: 0,
          cur: 1,
          size: 20,
        },
        //审核面板
        Audit:{
          modal: false,
          id: '',
          allId: '',
          btn: ''
        }
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
      //筛选操作(重置筛选)
      ResetScreen(){
        for(let key in this.ScreenData){
          this.ScreenData[key] = '';
        }
        this.allTime = '';
      },
      //多选打钩绑定数据
      SelectTable(data){
        let idarr = [];
        if(data.length > 0){
          data.forEach(val=>{
            idarr.push(val.id);
          })
        }
        this.SelectData = idarr;
      },
      //选择时间
      PickDate(time){
        this.allTime = time;
      },
      //查询结果
      SimpleSearch(sign = 1){
        let sinfo = this.RemoveObserve(this.ScreenData);
        if(this.allTime[0] !== ""){
          sinfo.start_time = this.allTime[0];
          sinfo.end_time = this.allTime[1];
        }else{
          sinfo.start_time = '';
          sinfo.end_time = '';
        }
        this.InitData(this.apiUrl,sinfo).then(()=>{
          if(sign){
            this.$Message.success('筛选成功！')
          }
        });
      },
      //初始化数据
      InitData(url,params = {}){
        const that = this;
        this.loading = true;
        //获取按钮信息
        this.$fetch("/backend/Menuauth/listAuthGet",{auth_id: this.auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
          this.BtnData.forEach(val=>{
            if(val.class === "AuditPanel"){
              this.Audit.btn = val.id;
            }
          })
        });
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data.list;
            this.Page.count = d.data.count;
            this.UserData = res;
            this.UserData.forEach(val=>{
              val.black = this.BlackType[val.black - 1];
            })
            this.RowUserData = res;
            that.loading = false;
            resolve();
          })
        })
      },
      //刷新列表
      RefreshList(){
        this.ScreenData.key = '';
        this.InitData(this.apiUrl).then(()=>{
          this.$Message.success('刷新成功');
        });
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
      //审核面板
      AuditPanel(row){
        this.Audit.modal = true;
        this.Audit.id = row.id;
        let idArr = [];
        this.RowUserData.forEach(val=>{
          idArr.push(val.id);
        });
        this.Audit.allId = idArr;
      },
      AuditCancel(){
        this.Audit.modal = false;
      },
      //编辑操作
      EditOpt(row){
        for(let key in this.EditInfo){
            if(key === 'uid'){
              this.EditInfo.uid = row.id;
            }else{
              this.EditInfo[key] = row[key];
            }
        }
        this.EditModal = true;
      },
      EditCancel(){
        this.EditModal = false;
      },
      //提交编辑
      EditOver(){
        this.$refs['EditInfo'].validate(valid=>{
          if(valid){
            this.UploadData('/backend/Postloan/blackUp',this.EditInfo).then(()=>{
              this.SimpleSearch(0);
            });
          }
        })
      },
      //移除操作
      Delopt(row){

      },
      //导出数据
      ExportData(){
        let sinfo = this.RemoveObserve(this.ScreenData);
        sinfo.expro = 1;
        this.UploadData(this.apiUrl,sinfo).then((url)=>{
          console.log(url);
          //window.location.href = url;
        });
      },
      //改变页数
      ChangePage(curpage){
        let sinfo = Object.assign(this.ScreenData,{
          page: curpage,
          num: this.Page.size
        });
        this.InitData(this.apiUrl,sinfo).then(()=>{
          this.Page.cur = curpage;
        })
      },
      //改变显示条数
      ChangeSize(size){
        let sinfo = Object.assign(this.ScreenData,{
          page: 1,
          num: size
        });
        this.InitData(this.apiUrl,sinfo).then(()=>{
          this.Page.cur = 1;
          this.Page.size = size;
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

</style>
