<template>
  <div id="contract-list">
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
          <div class="btn-box">
            <Button type="ghost" icon="reply" @click="ResetScreen">重置筛选</Button>
            <Button type="success" icon="search" @click="SimpleSearch">查询结果</Button>
          </div>
        </div>
        <div class="opt-box">
          <Form :model="ScreenData" inline :label-width="85">
            <FormItem label="用户名：">
              <Input v-model="ScreenData.name" style="width: 120px"></Input>
            </FormItem>
            <FormItem label="用户手机号：">
              <Input v-model="ScreenData.phone" style="width: 120px"></Input>
            </FormItem>
            <FormItem label="身份证号：">
              <Input v-model="ScreenData.idcard"></Input>
            </FormItem>
            <FormItem label="合同编号：">
              <Input v-model="ScreenData.orderid"></Input>
            </FormItem>
            <FormItem label="时间：">
              <DatePicker type="datetimerange"
                          placeholder="选择日期和时间"
                          format="yyyy-MM-dd HH:mm:ss"
                          placement="bottom-end"
                          :value="allTime"
                          @on-change="PickDate"
                          style="width: 280px"></DatePicker>
            </FormItem>
          </Form>
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
            <Button type="primary" icon="archive" @click="ExportData">导出数据</Button>
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading" ></Table>
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
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  export default {
    name: 'contractList',
    data () {
      return {
        title: '合同列表',
        auth_id: '',
        loading: true,
        allTime: [],
        //基础筛选数据
        ScreenData: {
          name: '',
          phone: '',
          idcard: '',
          orderid: '',
          status: '',
          start_time: '',
          end_time: '',
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
            title: '用户姓名',
            width: '100',
            align: 'center',
            key: 'name'
          },{
            title: '用户手机号',
            width: '110',
            align: 'center',
            key: 'phone'
          },{
            title: '合同总金额（元）',
            key: 'amount'
          },{
            title: '合同开始日期',
            key: 'create_date'
          },{
            title: '合同名称',
            key: 'title'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '220',
            render: (h, params)=>{
              return h('div',this.RenderBtn(h, params, this.BtnData));
            }
          }
        ],
        UserData: [],     //表格数据
        RowUserData: [],  //获取的原始数据
        BtnData: [],      //按钮数据
        //初始分页信息
        Page: {
          count: 0,
          cur: 1,
          size: 20,
        }
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.InitData();
    },
    methods: {
      //循环渲染按钮
      RenderBtn(h,params,bdata){
        let res = [];
        bdata.forEach((val)=>{
          let btn = '';
          if(val.class === 'DetailsOpt'){
            let innerbtn = h('Button',{
              props: {
                type: val.color
              },
              style: {
                marginRight: '5px'
              }
            },val.name);
            btn = h('router-link',{
              props: {
                to: '/contractInfo?id=' + params.row.id
              },
              attrs: {
                target: '_blank'
              }
            },[innerbtn]);
          }else{
            btn = h('Button',{
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
          }
          res.push(btn);
        });
        return res;
      },
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
      //选择时间
      PickDate(time){
          this.allTime = time;
      },
      //查询结果
      SimpleSearch(){
        let sinfo = this.RemoveObserve(this.ScreenData);
        if(this.allTime[0] !== ""){
          sinfo.start_time = this.allTime[0];
          sinfo.end_time = this.allTime[1];
        }else{
          sinfo.start_time = '';
          sinfo.end_time = '';
        }
        this.InitData(sinfo).then(()=>{
          this.$Message.success('筛选成功！')
        });
      },
      //初始化数据
      InitData(params = {}){
        const that = this;
        this.loading = true;
        //获取按钮信息
        this.$fetch('Menuauth/listAuthGet',{auth_id: this.auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
        });
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post('Contract/contractList',params).then((d)=>{
            let res = d.data.list;
            this.Page.count = d.data.count;
            this.RowUserData = res;
            if(res.length === 0){
              this.UserData = [];
            }else{
              this.UserData = res;
            }
            that.loading = false;
            resolve();
          })
        })
      },
      //刷新列表
      RefreshList(){
        this.InitData().then(()=>{
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
              //this.InitData();
            }else{
              this.$Message.error(d.message);
            }
          }).catch((err)=>{
            this.$Message.error('服务器繁忙，请稍后再试！');
          })
        })

      },
      //导出数据
      ExportData(){
        let sinfo = this.RemoveObserve(this.ScreenData);
        sinfo.expro = 1;
        this.UploadData('Contract/contractList',sinfo).then((url)=>{
            window.location.href = url;
        });
      },
      //查看合同
      DetailsOpt(){
        this.UploadData('Contract/contractShow',{id: row.id});
      },
      //删除合同
      Delopt(row){
        //删除确认
        this.$Modal.confirm({
          title: '温馨提示',
          content: '<p class="confirm-text">确认删除此合同吗？</p>',
          onOk: ()=>{
            this.UploadData('Contract/contractDel',{id: row.id});
          }
        })
      },
      //改变页数
      ChangePage(curpage){
        let sinfo = Object.assign(this.ScreenData,{
          page: curpage,
          num: this.Page.size
        });
        this.InitData(sinfo).then(()=>{
          this.Page.cur = curpage;
        })
      },
      //改变显示条数
      ChangeSize(size){
        let sinfo = Object.assign(this.ScreenData,{
          page: 1,
          num: size
        });
        this.InitData(sinfo).then(()=>{
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
