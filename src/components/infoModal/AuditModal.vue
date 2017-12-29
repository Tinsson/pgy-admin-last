<template>
  <div>
    <Modal
      v-model="State"
      :width="1150"
      class="all-modal"
      :styles="{top: '50px'}"
      @on-cancel="CloseBtn">
      <div class="head-area" slot="header">
        <h2 class="big-head">数据详情（{{ EditData.info.name }}）</h2>
      </div>
      <div slot="close">
        <Icon class="close-icon" type="ios-close-outline"></Icon>
      </div>
      <Row class="content">
        <Col class="left-box" :span="16">
          <div class="head-info">
            <div class="avator">
              <img v-if="EmptyAvator" @click="GetAvator" src="../../assets/images/avator.jpg" alt="">
              <img v-if="!EmptyAvator" @click="GetAvator" :src="Avator" alt="">
              <p v-if="!EmptyAvator" class="text">{{ NickName }}</p>
              <Icon v-if="EditData.info.sex === '男'" class="icon male" type="male"></Icon>
              <Icon v-if="EditData.info.sex === '女'" class="icon female" type="female"></Icon>
            </div>
            <ul class="third-party">
              <li class="res-box">
                <p class="simple" :class="'type'+AllInfo.jiben.info.tongdun.status">{{AllInfo.jiben.info.tongdun.info}}</p>
                <p class="title">同盾</p>
              </li>
              <li class="res-box">
                <div class="simple" :class="'type'+AllInfo.jiben.info.huabei.status">
                  <span>{{AllInfo.jiben.info.huabei.info}}</span>
                </div>
                <p class="title">花呗额度</p>
              </li>
              <li class="res-box">
                <p class="simple" :class="'type'+AllInfo.jiben.info.yunyings.status">{{AllInfo.jiben.info.yunyings.info}}</p>
                <p class="title active" @click="ReportCarrier">运营商</p>
              </li>
              <li class="res-box">
                <p class="simple" :class="'type'+AllInfo.jiben.info.taobao.status">{{AllInfo.jiben.info.taobao.info}}</p>
                <p class="title active" @click="ReportTaobao">淘宝</p>
              </li>
              <li class="res-box">
                <div class="simple edit-part" @click="ZmfEdit" :class="'type'+AllInfo.jiben.info.zhimafen.status">
                  <span v-show="!Zhimafen.modal">{{EditData.info.zmop}}</span>
                  <input v-show="Zhimafen.modal" ref="ZmfIpt" class="head-input" :class="'type'+AllInfo.jiben.info.zhimafen.status" v-model="Zhimafen.data.zmop" @keyup.enter="ZmfSub"/>
                </div>
                <p class="title">芝麻分</p>
              </li>
            </ul>
          </div>
          <div class="info-area">
            <ul>
              <li class="single-line">
                <Row>
                  <Col span="6">
                    <p class="label">姓名</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{EditData.info.name}}</span>
                      <Input v-show="IsEdit" v-model="EditData.info.name" :style="{width: IptWidth}"></Input>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">手机号</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{EditData.info.phone}}</span>
                      <Input v-show="IsEdit" v-model="EditData.info.phone" :style="{width: IptWidth}"></Input>
                    </p>
                  </Col>
                  <Col span="6">
                  <p class="label">身份证号</p>
                  <p class="value">
                    <span v-show="!IsEdit">{{EditData.info.idcard}}</span>
                    <Input v-show="IsEdit" v-model="EditData.info.idcard" :style="{width: IptWidth}"></Input>
                  </p>
                  </Col>
                  <Col span="6">
                    <p class="label">客户类型</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{EditData.info.type}}</span>
                      <Select v-show="IsEdit" v-model="EditData.info.type" placeholder="请选择会员等级" :style="{width: IptWidth}">
                        <Option v-for="item in NewType" :key="item.level" :value="item.level">{{item.level}}</Option>
                      </Select>
                    </p>
                  </Col>
                </Row>
              </li>
              <li class="single-line">
                <Row>
                  <!--<Col span="6">
                    <p class="label">性别</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{EditData.info.sex}}</span>
                      <RadioGroup v-show="IsEdit" v-model="EditData.info.sex">
                        <Radio label="男"></Radio>
                        <Radio label="女"></Radio>
                      </RadioGroup>
                    </p>
                  </Col>-->
                  <Col span="6">
                    <p class="label">年龄</p>
                    <p class="value">
                      <span>{{EditData.info.age}}</span>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">学历</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{TextArr.edu[EditData.info.education - 1]}}</span>
                      <Select v-show="IsEdit" v-model="EditData.info.education" :style="{width: IptWidth}">
                        <Option :value="1">初中</Option>
                        <Option :value="2">高中</Option>
                        <Option :value="3">大专</Option>
                        <Option :value="4">本科</Option>
                        <Option :value="5">硕士</Option>
                        <Option :value="6">博士</Option>
                        <Option :value="7">博士后</Option>
                      </Select>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">生日</p>
                    <p class="value">
                      <span>{{EditData.info.birth}}</span>
                      <!--<DatePicker type="date"
                                  placeholder="选择日期"
                                  format="yyyy/MM/dd"
                                  v-show="IsEdit"
                                  :value="EditData.info.birth"
                                  @on-change="PickDate"
                                  :style="{width: IptWidth}"></DatePicker>-->
                    </p>
                  </Col>
                  <Col span="6">
                  <p class="label">网龄</p>
                  <p class="value">
                    {{AllInfo.moxie.interday}}
                  </p>
                  </Col>
                </Row>
              </li>
              <!--<li class="single-line">
                <Row>
                  <Col span="6">
                  <p class="label">运营商</p>
                  <p class="value">
                    <span>实名</span>
                  </p>
                  </Col>
                  <Col span="6">
                  <p class="label">淘宝</p>
                  <p class="value">
                    <span>实名／不实名</span>
                  </p>
                  </Col>
                  <Col span="6">
                  <p class="label">网龄</p>
                  <p class="value">
                    {{AllInfo.moxie.interday}}
                  </p>
                  </Col>
                  <Col span="6">
                  <p class="label">芝麻分</p>
                  <p class="value">
                    <span>{{EditData.info.zmop}}</span>
                  </p>
                  </Col>
                </Row>
              </li>
              <li class="single-line">
                <Row>
                  <Col span="8">
                  <p class="label">审核员</p>
                  <p class="value">
                    <span v-show="!IsEdit">{{ GetAuditor }}</span>
                    <Select v-show="IsEdit" v-model="EditData.info.auditorId" :style="{width: IptWidth}">
                      <Option v-for="item in EditData.auditor" :value="item.id" :key="item.id">{{item.admin_user}}</Option>
                    </Select>
                  </p>
                  </Col>
                  <Col span="8">
                  <p class="label">催收员</p>
                  <p class="value">
                    <span v-show="!IsEdit">{{ GetCollector }}</span>
                    <Select v-show="IsEdit" v-model="EditData.info.collectorId" :style="{width: IptWidth}">
                      <Option v-for="item in EditData.collector" :value="item.id" :key="item.id">{{item.admin_user}}</Option>
                    </Select>
                  </p>
                  </Col>
                </Row>
              </li>-->
              <li class="single-line">
                <p class="label">联系人</p>
                <p class="value long">
                  <Row>
                    <Col v-for="item in EditData.lianxiren" :key="item.name" :span="12">
                      <Row>
                        <Col class="lxr-line" :span="12">
                        {{item.relationship}}：<span v-show="!IsEdit">{{item.name}}</span>
                        <Input v-show="IsEdit" v-model="item.name" :style="{width: IptWidth}"/>
                        </Col>
                        <Col class="lxr-line" :span="12">
                        手机号：<span v-show="!IsEdit">{{item.phone}}-<span class="num">{{ 12 }}</span>次</span>
                        <Input v-show="IsEdit" v-model="item.phone" :style="{width: IptWidth}"/>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </p>
                <p class="value long">
                  <Row>
                    <Col v-for="(value, key) in AllInfo.moxie.yys" :key="key" :span="6"><p class="line">{{key}}-<span class="num">{{value}}</span>次</p></Col>
                  </Row>
                </p>
              </li>
              <li class="single-line">
                <p class="label">地址</p>
                <div class="value long">
                  <p v-if="EditData.info.address" class="line">
                    {{EditData.info.address}}-(户籍地址)
                  </p>
                  <p v-if="DetailsCompany" class="line">
                    {{DetailsCompany}}-(公司地址)
                  </p>
                  <p class="line" v-for="item in AllInfo.moxie.tb" :key="item.address">
                    {{`${item.address} ${item.name} ${item.phone}`}}-(淘宝地址)
                  </p>
                </div>
              </li>
              <!--<li class="single-line">
                <p class="label">淘宝地址</p>
                <div class="value long">
                  <p class="line" v-for="item in AllInfo.moxie.tb" :key="item.address">{{`${item.address} ${item.name} ${item.phone}`}}</p>
                </div>
              </li>
              <li class="single-line">
                <p class="label">户籍地址</p>
                <p class="value">
                  <span v-show="!IsEdit">{{EditData.info.address}}</span>
                  <Input v-show="IsEdit" v-model="EditData.info.address" :style="{width: IptWidth}"></Input>
                </p>
              </li>
              <li class="single-line">
                <p class="label">公司地址</p>
                <p class="value">
                  <span v-show="!IsEdit">{{ AddressText(ChoseCompany) }}</span>
                  <Cascader :data="AllAreaData"
                            v-show="IsEdit"
                            v-model="ChoseCompany"
                            :style="{width: '300px'}"></Cascader>
                </p>
              </li>
              <li class="single-line">
                <p class="label">公司详细地址</p>
                <p class="value">
                  <span v-show="!IsEdit">{{ DetailsCompany }}</span>
                  <Input v-show="IsEdit" v-model="DetailsCompany" style="width: 300px"></Input>
                </p>
              </li>
              <li class="single-line">
                <p class="label">居住地址</p>
                <p class="value">
                  <span v-show="!IsEdit">{{ AddressText(ChoseLive) }}</span>
                  <Cascader :data="AllAreaData"
                            v-show="IsEdit"
                            v-model="ChoseLive"
                            :style="{width: '300px'}"></Cascader>
                </p>
              </li>
              <li class="single-line">
                <p class="label">居住详细地址</p>
                <p class="value">
                  <span v-show="!IsEdit">{{ DetailsLive }}</span>
                  <Input v-show="IsEdit" v-model="DetailsLive" style="width: 300px"></Input>
                </p>
              </li>-->
              <li class="single-line">
                <p class="label">身份证正反面</p>
                <p class="idcard-box" v-if="JudgeIdcard">
                  <img v-for="item in AllInfo.jiben.idcardimg" :src="item" @click="CheckBigPic(item)" :key="item" alt="">
                </p>
                <p class="idcard-box" v-if="!JudgeIdcard">
                  暂无图片
                </p>
              </li>
            </ul>
          </div>
        </Col>
        <Col class="record-box" :span="8">
          <div class="nav-box">
            <a class="nav-block" :class="{cur: NavData.baseInfo.cur}" @click="NavChange('baseInfo')" href="javascript:;">基本信息</a>
            <a class="nav-block" :class="{cur: NavData.tradeRecord.cur}" @click="NavChange('tradeRecord')" href="javascript:;">交易记录</a>
            <a class="nav-block" :class="{cur: NavData.optRecord.cur}" @click="NavChange('optRecord')" href="javascript:;">备注记录</a>
          </div>
          <div class="base-info" v-show="NavData.baseInfo.cur">
            <Tabs>
              <TabPane label="基本信息">
                <div class="info-box">
                  <!--<span class="half">审核员：{{AllInfo.jiben.info.auditorId}}</span>
                  <span class="half">催收员：{{AllInfo.jiben.info.collectorId}}</span>-->
                  <p class="half">
                    <span @click="OpenEdit('IsAuditor')">审核员：</span>
                    <span @click="OpenEdit('IsAuditor')" v-show="!EditPerson.IsAuditor">{{ GetAuditor }}</span>
                    <Select v-show="EditPerson.IsAuditor" v-model="EditData.info.auditorId" @on-change="SelectAuditor" size="small" :style="{width: '100px'}">
                      <Option v-for="item in EditData.auditor" :value="item.id" :key="item.id">{{item.admin_user}}</Option>
                    </Select>
                  </p>
                  <p class="half">
                    <span @click="OpenEdit('IsCollector')">催收员：</span>
                    <span @click="OpenEdit('IsCollector')" v-show="!EditPerson.IsCollector">{{ GetCollector }}</span>
                    <Select v-show="EditPerson.IsCollector" v-model="EditData.info.collectorId" @on-change="SelectCollector" size="small" :style="{width: '100px'}">
                      <Option v-for="item in EditData.collector" :value="item.id" :key="item.id">{{item.admin_user}}</Option>
                    </Select>
                  </p>
                </div>
                <p class="info-box">
                  <!--<span class="half">放款员：{{AllInfo.jiben.info.fangkuanId}}</span>-->
                  <span class="half">放款员：冯剑涛</span>
                  <span class="half">借款用途：{{AllInfo.jiben.info.money_use_to}}</span>
                </p>
                <Card class="card-area">
                  <h2 class="user-title">认证数据</h2>
                  <Table :columns="Authorize.Col"
                         :data="Authorize.Data"
                         size="large"></Table>
                </Card>
              </TabPane>
              <TabPane label="操作日志">
                <Card>
                  <ul>
                    <li class="opt-log" v-for="item in AllInfo.operation.log.system">
                      <p class="line">{{item.content}}</p>
                      <p class="line">操作员：{{item.nickname}}</p>
                      <p class="line">操作时间：{{item.addtime}}</p>
                    </li>
                  </ul>
                </Card>
              </TabPane>
            </Tabs>
          </div>
          <div class="trade-record" v-show="NavData.tradeRecord.cur">
            <div class="count-box">
              <p class="count-line">
                <span class="title">借款总笔数：<em class="num">{{ AllInfo.loan.jk_count }}</em></span>
                <span class="value">展期总笔数：<em class="num">{{ AllInfo.loan.zq_count }}</em></span>
              </p>
              <p class="count-line">
                <span class="title">借款总额：<em class="num">{{ AllInfo.loan.jk_all_amount }}</em></span>
                <span class="value">展期总额：<em class="num">{{ AllInfo.loan.zq_all_amount }}</em></span>
              </p>
              <p class="count-line">
                <span class="title">已收违约金：<em class="num">{{ AllInfo.loan.hk_all_wyamount }}</em></span>
                <span class="value">展期费总额：<em class="num">{{ AllInfo.loan.zq_all_fee }}</em></span>
              </p>
              <p class="count-line">
                <span class="title">未还本金：<em class="num">{{ AllInfo.jiben.info.yuE }}</em></span>
                <span class="value"></span>
              </p>
            </div>
            <Card class="card-area" v-for="item in AllInfo.loan.jk_list" :key="item.id">
              <div class="lend-info row">
                <!--<p class="yq_state">{{ item.yq_status }}</p>-->
                <div class="main-part">
                  <p class="text-line">{{JudgeAmtTip(item.color)}}金额：<i class="price_num">{{ item.yh_amount }}</i></p>
                  <p class="text-line">违约金：{{item.wy_amount}}</p>
                  <p class="text-line">应还日：{{ item.hk_date }}</p>
                  <p class="text-line">总天数：{{ item.total_days}}</p>
                </div>
                <div class="side-part">
                  <div class="text-line">
                    状态：<span class="status" :style="{color: item.color}">{{item.status}}</span>
                  </div>
                  <p class="text-line">
                    <span>出资人：</span>
                    <span class="czr-text" v-if="!item.capital_modal" @click="CapitalEdit(item.id)">{{ item.capital_account }}</span>
                    <Select class="cap-select" size="small" v-if="item.capital_modal" v-model="Capital.data.ren" @on-change="CapitalSub">
                      <Option :value="1">L</Option>
                      <Option :value="2">Z</Option>
                    </Select>
                  </p>
                  <p class="text-line">实际日：{{ item.pay_date }}</p>
                </div>
                <!--<div class="text-line">
                  <div class="msg-area">
                    <p class="tips">金额（元）</p>
                    <p class="value num">{{ item.amount }}</p>
                  </div>
                  <div class="msg-area">
                    <p class="tips">实际还款日：{{ item.pay_date }}</p>
                    <p class="value state" v-if="item.status === 1">
                      <Icon type="checkmark-circled"></Icon>
                      已还款
                    </p>
                    <p class="value state nopay" v-if="item.status === 0">
                      <Icon type="alert-circled"></Icon>
                      未还款
                    </p>
                  </div>
                </div>-->
                <!--<div class="text-line">
                  <span class="msg-area"></span>
                  <span class="msg-area">借款天数：{{ item.jk_days }}</span>
                </div>
                <div class="text-line">
                  <span class="msg-area">违约金：{{ item.wy_amount }}</span>
                  <span class="msg-area">借款日期：{{ item.jk_date }}</span>
                </div>
                <div class="text-line">
                  <span>出资人：</span>
                  <span v-show="!Capital.modal" @click="CapitalEdit(item.id,item.capital_account)">{{ item.capital_account }}</span>
                  <Select class="cap-select" size="small" v-show="Capital.modal" v-model="Capital.data.ren" @on-change="CapitalSub">
                    <Option :value="1">李义</Option>
                    <Option :value="2">张晓成</Option>
                  </Select>
                </div>
                <div class="text-line">
                  合同还款日：{{ item.hthk_date }}
                </div>-->
              </div>
              <div class="lend-info child">
                <h2 class="part-title loan">借款</h2>
                <div class="row-box">
                  <div class="main-part">
                    <p class="text-line">本金：{{item.amount}}</p>
                    <p class="text-line">借出日：{{item.jk_date}}</p>
                  </div>
                  <div class="side-part">
                    <p class="text-line">天数：{{item.jk_days}}</p>
                    <p class="text-line">到期日：{{item.hthk_date}}</p>
                  </div>
                </div>
              </div>
              <div class="lend-info child" v-if="item.zqlist.length > 0" v-for="zqitem in item.zqlist">
                <h2 class="part-title delay">展期</h2>
                <div class="row-box">
                  <div class="main-part">
                    <div class="text-line">展期费：{{zqitem.fee}}</div>
                    <div class="text-line">开始日：{{zqitem.start_date}}</div>
                  </div>
                  <div class="side-part">
                    <div class="text-line">天数：{{zqitem.days}}</div>
                    <div class="text-line">结束日：{{zqitem.end_date}}</div>
                  </div>
                </div>
              </div>
              <div class="lend-info child" v-if="item.hklist.length > 0" v-for="hkitem in item.hklist">
                <h2 class="part-title repay">还款</h2>
                <div class="row-box">
                  <div class="main-part">
                    <div class="text-line">金额：{{hkitem.amount}}</div>
                    <div class="text-line">还款日：{{hkitem.create_at}}</div>
                  </div>
                  <div class="side-part">
                    <div class="text-line">类型：{{hkitem.type}}</div>
                  </div>
                </div>
              </div>
            </Card>
            <!--<Tabs>
              <TabPane label="放款">
              </TabPane>
              <TabPane label="展期">
                <div class="count-box">
                  <p class="count-line">
                    <span class="title">总笔数：<em class="num">{{ AllInfo.loan.zq_count }}</em></span>
                    <span class="value">当前金额：<em class="num">{{ AllInfo.loan.zq_this_amount }}</em></span>
                  </p>
                </div>
                <Card class="card-area" v-for="item in AllInfo.loan.zq_list" :key="item.id">
                  <div class="lend-info">
                    <p class="yq_state">{{item.yq_status}}</p>
                    <div class="text-line">
                      <div class="msg-area">
                        <p class="tips">展期金额（元）</p>
                        <p class="value num">{{ item.amount }}</p>
                      </div>
                    </div>
                    <div class="text-line">
                      <span class="msg-area">展期费用：{{ item.fee }}元</span>
                      <span class="msg-area">展期时间：{{ item.days }}天</span>
                    </div>
                    <div class="text-line">展期开始日：{{ item.start_date }}</div>
                    <div class="text-line">展期结束日：{{ item.hk_date }}</div>
                    <div class="text-line">展期操作日：{{ item.create_at }}</div>
                  </div>
                </Card>
              </TabPane>
              <TabPane label="还款">
                <div class="count-box">
                  <p class="count-line">
                    <span class="title">总笔数：</span>
                    <span class="value"><em class="num">{{ AllInfo.loan.hk_count }}</em></span>
                  </p>
                </div>
                <Card class="card-area" v-for="item in AllInfo.loan.hk_list" :key="item.id">
                  <div class="lend-info">
                    <div class="text-line">
                      <div class="msg-area">
                        <p class="tips">还款金额（元）</p>
                        <p class="value num">{{ item.hk_amount }}</p>
                      </div>
                      <div class="msg-area">
                        <p class="tips long">实际还款日：{{ item.pay_date }}</p>
                        <p class="value state">
                          <Icon type="checkmark-circled"></Icon>
                          已还款
                        </p>
                      </div>
                    </div>
                    <div class="text-line">
                      <span class="msg-area">借款金额：{{ item.jk_amount }}元</span>
                      <span class="msg-area">借款天数：{{ item.jk_day }}天</span>
                    </div>
                    <div class="text-line">
                      <span class="msg-area">应还金额：{{ item.hk_amount }}元</span>
                      <span class="msg-area">违约金：{{ item.wy_amount }}元</span>
                    </div>
                    <div class="text-line">合同还款日：{{ item.hthk_date }}</div>
                    <div class="text-line">借款日期：{{ item.jk_date }}</div>
                    <div class="text-line">还款方式：{{ item.type }}</div>
                  </div>
                </Card>
              </TabPane>
            </Tabs>-->
          </div>
          <div class="opt-record" v-show="NavData.optRecord.cur">
            <!--<Tabs>
              <TabPane label="用户记录">
                <Card class="card-area">
                  <h2 class="user-title">审核数据</h2>
                  <Table :columns="Audit.Col"
                         :data="Audit.Data"
                         size="large"></Table>
                </Card>
              </TabPane>
              <TabPane label="催收记录">
                <Card class="card-area">
                  <h2 class="user-title">催收数据</h2>
                  <Table :columns="Urge.Col"
                         :data="Urge.Data"
                         size="large"></Table>
                </Card>
                <p v-show="Urge.status" class="urge-add">
                  <span class="label">记录：</span>
                  <Input type="textarea" v-model="Urge.content"></Input>
                </p>
                <p v-show="Urge.auth">
                  <Button v-show="!Urge.status" type="primary" @click="RecordAddOpt" size="large">添加记录</Button>
                  <Button v-show="Urge.status" type="warning" @click="UrgeAddOver" size="large">保存</Button>
                </p>
              </TabPane>
              <TabPane label="操作日志">

              </TabPane>
            </Tabs>-->
            <div>
              <Table :columns="NavData.baseInfo.remark_col"
                     :data="NavData.baseInfo.remark"
                     style="margin-bottom: 10px;"
                     size="large"></Table>
            </div>
          </div>
        </Col>
      </Row>
      <div slot="footer" class="footer-area">
        <div class="btn-box">
          <Button type="info" v-show="!IsEdit" @click="EditInfo">修改</Button>
          <Button type="primary" style="margin-left: 0" v-show="IsEdit" @click="SubOpt">保存</Button>
          <Button type="warning" v-show="IsEdit" @click="EditCancel">取消</Button>
          <Button v-for="item in ButtonAll" :disabled="PassBtnStatus(item.class)" :key="item.id" :type="item.color" @click="EventTune(item.class)">{{item.name}}</Button>
          <p v-show="IsPass.status && IsPass.isLoan" class="inline-block">
            <Button :type="SetLoan.type" @click="SetLoanOpt">{{SetLoan.name}}</Button>
          </p>
          <p v-show="IsPass.isLimit" class="inline-block">
            <Button type="primary" v-show="IsPass.status && !Limit.status" @click="GiveLimitOpt">{{ Limit.text }}</Button>
            <Input ref="LimitInput" v-show="Limit.status" v-model="Limit.value" autofocus @on-enter="SubmitLimit" style="width: 80px;display: inline-block"/>
          </p>
          <Button type="info" @click="RemarkOpt">添加备注</Button>
          <p id="clipBtn" class="clipBtn" ref="ClipBox" :src="LoanCopyInfo"></p>
          <!--<p v-show="IsPass.isLoan" class="inline-block">-->
            <!--<Button type="info" v-show="IsPass.status" @click="SetLoanOpt">设置放款员</Button>-->
            <!--<span v-show="IsPass.status">-->
              <!--<Select v-show="SetLoan.status" v-model="SetLoan.value" style="width: 75px;">-->
                <!--<Option v-for="item in SetLoan.select" :key="item.id" :value="item.id">{{item.nickname}}</Option>-->
              <!--</Select>-->
              <!--<Button v-show="SetLoan.status" type="success" @click="SubmitSetLoan">提交操作</Button>-->
              <!--<Button v-show="SetLoan.status" type="error" @click="SetLoanCancel">取消</Button>-->
            <!--</span>-->
          <!--</p>-->
        </div>
        <Page :current="CurrentPage"
              :total="TotalPage"
              :page-size="1"
              @on-change="ChangePage"
              simple></Page>
      </div>
      <Spin size="large" fix v-if="loading"></Spin>
    </Modal>
    <Modal v-model="NavData.baseInfo.IsRemark"
           @on-ok="RemarkOver"
           class="all-modal remark-modal"
           style="z-index: 10">
      <h2 slot="header">备注信息</h2>
      <div class="remark-box">
        <Input v-model="NavData.baseInfo.remark_ipt" ref="RemarkInput" type="textarea" :rows="4" @on-enter="RemarkOver" autofocus placeholder="请输入备注信息"></Input>
      </div>
      <div slot="footer"></div>
    </Modal>
    <BigPic :modalShow="BigPic.modal"
            :InitData="BigPic.img"
            :maxWidth="800"
            titleTxt="身份证正反面"
            @CloseModal="CloseBigPic"></BigPic>
    <DelayModal :modalShow="Delay.modal"
                :initData="Delay.data"
                @CloseModal="DelayCancel"
                @SubModal="DelaySub"></DelayModal>
    <RepayModal :modalShow="Repay.modal"
                :initData="Repay.data"
                @CloseModal="RepayCancel"
                @SubModal="RepaySub"></RepayModal>
    <LoanModal :modalShow="Loan.modal"
               :initData="Loan.data"
               @CloseModal="LoanCancel"
               @SubModal="LoanSub"></LoanModal>
  </div>
</template>

<script>
  import Area from '@/util/area.json'
  import Clipboard from 'clipboard'
  import BigPic from '@/components/infoModal/BigPic'
  import DelayModal from '@/components/infoModal/DelayModal'
  import RepayModal from '@/components/infoModal/RepayModal'
  import LoanModal from '@/components/infoModal/LoanModal'

  export default {
    name: 'AuditModal',
    components:{
      BigPic,
      DelayModal,
      RepayModal,
      LoanModal
    },
    data () {
      return{
        loading: true,
        State: this.modalShow,
        ID: this.InitId,
        Unique: this.UniqueId,
        IdArr: this.AllId,
        IptWidth: '160px',
        Avator: '',
        NickName: '',
        TextArr: {
          edu:['初中','高中','大专','本科','硕士','博士','博士后']
        },
        NewType: [],
        AllAreaData: Area, //全国省市区信息集合
        AllInfo:{
          jiben:{
            idcardimg: ["",""],
            huoti: [""],
            info: {
              auditorId: '',
              collectorId: '',
              tongdun: {},
              cajl: {},
              yunyings: {},
              taobao: {},
              zhimafen: {},
              huabei: {}
            },
            renz: ''
          },
          loan:{
            jk_count: '',
            jk_this_amount: '',
            jk_all_amount: '',
            jk_list: [{capital_modal: false}],
            zq_count: '',
            zq_this_amount: '',
            zq_all_amount: '',
            hk_count: '',
            hk_this_amount: {
              amount: ''
            },
            hk_all_yhamount: '',
            hk_all_wyamount: ''
          },
          moxie:{
            tb: [],
            yys: {}
          },
          operation:{
            log:{
              system:[]
            }
          }
        },
        EditData: {
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
            remark: '',
            owner: 1
          },
          lianxiren: [],
          auditor: [],
          collector: []
        },
        ChoseCompany: [],
        DetailsCompany: '',
        ChoseLive: [],
        DetailsLive: '',
        IsEdit: false,
        IsPass: {
          isLimit: false,
          isLoan: false,
          type: 'success',
          status: false,
          text: '通过'
        },
        IsHang: {
          type: 'primary',
          status: false,
          text: '挂起'
        },
        Limit: {
          status: false,
          value: '',
          text: '借款额度'
        },
        SetLoan: {
          status: false,
          select: [],
          value: '',
          type: 'info',
          name: ''
        },
        NavData: {
          baseInfo: {
            cur: true,
            IsRemark: false,
            remark_col: [{
              title: '内容',
              key: 'content',
              ellipsis: false
            },{
              title: '角色',
              key: 'nickname',
              ellipsis: false
            },{
              title: '添加时间',
              key: 'addtime',
              width: '120',
              ellipsis: false
            }],
            remark: [],
            remark_ipt: ''
          },
          tradeRecord:{
            cur: false
          },
          optRecord: {
            cur: false
          }
        },
        DelayBtn: {
          type: 'primary',
          name: '发起展期'
        },
        BlackBtn: {
          status: false,
          type: 'error',
          name: '加入黑名单'
        },
        Authorize:{
          Col: [{
            title: '类型',
            key: 'type'
          },{
            title: '状态',
            key: 'status'
          },{
            title: '生成时间',
            width: '120',
            key: 'create_at'
          }],
          Data: []
        },
        Audit:{
          Col: [{
            title: '类型',
            key: 'type'
          },{
            title: '状态',
            key: 'status'
          },{
            title: '生成时间',
            key: 'create_at'
          }],
          Data: []
        },
        Urge:{
          auth: false,
          status: false,
          content: '',
          Col: [{
            title: '记录',
            key: 'content'
          },{
            title: '生成时间',
            key: 'create_at'
          }],
          Data: []
        },
        BigPic: {
          modal: false,
          img: ''
        },
        //展期操作
        Delay:{
          modal: false,
          data: {
            id: '',
            name: '',
            amount: ''
          }
        },
        //主动还款操作
        Repay:{
          modal: false,
          data:{
            id: '',
            name: '',
            amount: ''
          }
        },
        //放款操作
        Loan:{
          modal: false,
          data: {
            id: '',
            name: '',
            amount: ''
          }
        },
        Huabei:{
          modal: false,
          data: {
            uid: '',
            value: ''
          }
        },
        Zhimafen:{
          modal: false,
          data:{
            uid: '',
            zmop: ''
          }
        },
        Capital:{
          modal: false,
          data:{
            jid: '',
            ren: ''
          }
        },
        //按钮集合
        ButtonAll:[],
        EditPerson: {
          IsAuditor: false,
          IsCollector: false
        }
      }
    },
    props: {
      modalShow: Boolean,
      InitId: [String, Number],
      UniqueId: [String, Number],
      AllId: [Array,String],
      BtnId: [String, Number]
    },
    watch: {
      modalShow(val){
        this.State = val;
        if(val){
          this.loading = true;
          this.InitData(this.InitId);
        }
      },
      InitId(val){
        this.ID = val;
      },
      UniqueId(val){
        this.Unique = val;
      },
      AllId(val){
        this.IdArr = val;
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
    mounted(){
      this.ClipBoard = new Clipboard('#clipBtn',{
        text: function(elm){
          return elm.getAttribute('src');
        }
      });
      this.ClipBoard.on('success',(e)=>{
        this.$Message.success('复制成功！');
      })
    },
    destroyed(){
      this.ClipBoard.destroy();
    },
    computed:{
      CurrentPage(){
        let cur = 0;
        if(this.IdArr.length > 0){
          this.IdArr.forEach((val,index)=>{
            if(val === this.UniqueId) cur = index + 1;
          });
        }
        return cur;
      },
      TotalPage(){
        return this.IdArr.length;
      },
      ReviewStatus(){
        switch(this.AllInfo.jiben.info.status){
          case 1:
            return '未审核';
            break;
          case 2:
            return '已通过';
            break;
          case 3:
            return '未通过';
            break;
          default:
            return '未知';
        }
      },
      GetAuditor(){
        let name = ''
        this.EditData.auditor.forEach(val=>{
          if(val.id === this.EditData.info.auditorId){
            name = val.admin_user;
          }
        });
        return name;
      },
      GetCollector(){
        let name = '';
        this.EditData.collector.forEach(val=>{
          if(val.id === this.EditData.info.collectorId){
            name = val.admin_user;
          }
        });
        return name;
      },
      LoanCopyInfo(){
        let amount = '';
        if(this.AllInfo.loan.jk_list.length > 0){
          const last_jk = this.ArrLast(this.AllInfo.loan.jk_list);
          amount = last_jk.amount;
        }else{
          amount = this.Limit.value;
        }
        const start = new Date(),
              end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * this.AllInfo.jiben.info.days);
        return `金额：${amount} 利率：24% 还款时间：${end.getFullYear()}-${end.getMonth()+1}-${end.getDate(0)}`;
      },
      JudgeIdcard(){
        if(this.AllInfo.jiben.idcardimg[0] === false || this.AllInfo.jiben.idcardimg[0] === false){
          return false;
        }else{
          return true;
        }
      },
      EmptyAvator(){
        if(this.Avator === ''){
          return true;
        }else{
          return false;
        }
      }
    },
    methods: {
      //提交信息操作
      UploadData(url,info){
        return new Promise((resolve,reject)=>{
          this.$post(url,info).then((d)=>{
            if(d.status === 1){
              this.$Message.success(d.message);
              resolve(d.data);
            }else{
              this.$Message.error(d.message);
              reject();
            }
          }).catch((err)=>{
            this.$Message.error('服务器繁忙，请稍后再试！');
          })
        });
      },
      //触发事件
      EventTune(event){
        this[event]();
      },
      ResetData(){
        this.EditData = {
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
        };
        this.ChoseCompany = [];
        this.DetailsCompany = '';
        this.ChoseLive = [];
        this.DetailsLive = '';
        this.IsEdit = false;
        this.Limit.status = false;
      },
      CloseBtn(){
        this.ResetData();
        this.$emit('CloseModal',this.modalState);
      },
      InitData(id){
        this.$fetch('backend/Menuauth/listAuthGet', {auth_id: this.BtnId}).then(d=>{
          this.ButtonAll = [];
          this.IsPass.isLimit = false;
          this.IsPass.isLoan = false;
          this.Urge.auth = false;
          d.data.operation.forEach(val=>{
            if(val.class === 'GiveLimitOpt'){
              this.IsPass.isLimit = true;
            }else if(val.class === 'SetLoanOpt'){
              this.SetLoan.name = val.name;
              this.SetLoan.type = val.color;
              this.IsPass.isLoan = true;
            }else if(val.class === 'RecordAddOpt'){
              this.Urge.auth = true;
            }else{
              this.ButtonAll.push(val);
            }
          });
          this.$fetch('/backend/User/editUser',{uid: id}).then(edit=>{
            this.EditData = edit.data;
            this.EditData.uid = this.ID;
            this.EditData.info.uid = this.ID;
            this.Limit.value = edit.data.info.credit_limit;
            this.Limit.text = edit.data.info.credit_limit;
            this.NewType = edit.data.info.newtype;
            this.NavData.baseInfo.remark = edit.data.info.remark;
            this.ChoseCompany = this.StdArea(edit.data.info.address_company);
            this.ChoseLive = this.StdArea(edit.data.info.address_live);
            this.DetailsCompany = edit.data.info.address_company[edit.data.info.address_company.length - 1];

            this.$fetch('/backend/User/getInfo',{uid: id}).then(info=>{
              this.AllInfo = info.data;
              this.IsPass.status = (info.data.jiben.info.status === 2)?true:false;
              this.IsPass.type = this.IsPass.status?'ghost':'success';
              this.IsPass.text = this.IsPass.status?'不通过':'通过';
              this.IsHang.status = (info.data.jiben.info.is_hangup === 1)?true:false;
              this.JudgeHang(this.IsHang.status);
              this.StateText(this.AllInfo.loan.jk_list);
              this.Authorize.Data = this.AllInfo.operation.user.authorize;
              this.Audit.Data = this.AllInfo.operation.user.audit;
              this.Urge.Data = this.AllInfo.operation.collection.inputlist;
              this.BindHidden();
              this.loading = false;
            });
          });
        });
      },
      ChangePage(page){
        this.loading = true;
        this.ID = this.IdArr[page - 1];
        this.InitData(this.ID);
      },
      EditInfo(){
        this.IsEdit = true;
      },
      SubOpt(sign = 1){
        const allinfo = JSON.stringify(this.EditData);
        this.UploadData('/backend/User/editUserQuery',{_post: allinfo}).then(()=>{
          if(sign){
            this.IsEdit = false;
          }
        });
      },
      EditCancel(){
        this.IsEdit = false;
      },
      //通过审核
      PassOpt(){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">确认通过该用户的审核吗</p>`,
          onOk: ()=>{
            this.UploadData('/backend/User/auditUser',{uid: this.ID, status: 2}).then(()=>{
              this.loading = true;
              this.InitData(this.InitId);
            });
          }
        })
      },
      //不通过审核
      RejectOpt(){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">确认不通过该用户的审核吗</p>`,
          onOk: ()=>{
            this.UploadData('/backend/User/auditUser',{uid: this.ID, status: 3}).then(()=>{
              this.loading = true;
              this.InitData(this.InitId);
            });
          }
        })
      },
      CopyInfoOpt(){
        this.$refs.ClipBox.click();
      },
      HangOpt(){
        /*const tips = this.IsHang.status?'确认要取消该用户挂起状态吗？':'确认挂起该用户吗？';
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">${tips}</p>`,
          onOk: ()=>{
          }
        })*/
        this.UploadData('/backend/User/setGuaQi',{uid: this.ID}).then(()=>{
          this.IsHang.status = !this.IsHang.status;
          this.JudgeHang(this.IsHang.status);
          this.CloseBtn();
        });
      },
      GiveLimitOpt(){
        this.Limit.status = true;
        this.$nextTick(() => {
          this.$refs.LimitInput.focus();
        });
      },
      SubmitLimit(){
        const data = {
          uid: this.ID,
          edu: this.Limit.value
        }
        this.UploadData('/backend/User/creditLimit',data).then(()=>{
          this.Limit.status = false;
          this.Limit.text = this.Limit.value;
        });
      },
      LimitCancel(){
        this.Limit.status = false;
      },
      SetLoanOpt(){
        const data = {
          type: 0,
          uid: this.ID,
          fk_id: 7
        };
        this.UploadData('/backend/User/distributionFk',data).then(()=>{
          this.InitData(this.InitId);
        })
      },
      SubmitSetLoan(){
        const data = {
          type: 0,
          uid: this.ID,
          fk_id: this.SetLoan.value
        };
        this.UploadData('/backend/User/distributionFk',data).then(()=>{
          this.SetLoan.status = false;
        })
      },
      SetLoanCancel(){
        this.SetLoan.status = false;
      },
      PickDate(time){
        this.EditData.info.birth = time;
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
        this.EditData.info.address_company = [...this.BackArea(this.ChoseCompany), this.DetailsCompany];
        this.EditData.info.address_live = [...this.BackArea(this.ChoseLive), this.DetailsLive];
      },
      AddressText(arr){
        return arr.join(',');
      },
      NavChange(nav){
        Object.keys(this.NavData).forEach(val=>{
          this.NavData[val].cur = (val === nav)?true:false;
        });
      },
      BindHidden(){
        const black = this.EditData.info.black;
        this.BlackBtn.status = black;
        this.JudgeBlack(black);
      },
      //开通展期
      DelayOpt(){
        const jk_list = this.AllInfo.loan.jk_list;
        const type = this.AllInfo.jiben.info.type;
        let days = '';
        switch(type){
          case 'A':
            days = 28;
            break;
          case 'B':
            days = 15;
            break;
          case 'C':
            days = 10;
            break;
          default:
            days = this.AllInfo.jiben.info.days;
        }
        if(this.AllInfo.jiben.info.yuE <= 0){
          this.$Message.error('没法展期！');
        }
        if(jk_list.length > 0){
          const jk_data = this.ArrLast(jk_list);
          const data = {
            uid: this.ID,
            id: jk_data.id,
            days: days,
            amount: this.AllInfo.jiben.info.yuE,
            hk_date: jk_data.hk_date,
            name: this.AllInfo.jiben.info.name,
            type: this.AllInfo.jiben.info.type
          };
          this.Delay.modal = true;
          this.Delay.data = data;
        }else{
          this.$Message.error('当前无借款！');
        }
      },
      DelayCancel(){
        this.Delay.modal = false;
      },
      DelaySub(data){
        this.UploadData('/backend/Loan/payDelayRequest',data).then(()=>{
          this.Delay.modal = false;
          this.InitData(this.InitId);
        }).catch(()=>{
          this.Delay.modal = false;
        });
      },
      //加入黑名单
      AddBlackOpt(){
        this.UploadData('/backend/User/black',{uid: this.ID}).then((d)=>{
          this.EditData.info.black = d.val;
          this.BindHidden();
        })
      },
      RemarkOpt(){
        this.NavData.baseInfo.remark_ipt = '';
        this.NavData.baseInfo.IsRemark = true;
        this.$nextTick(() => {
          this.$refs.RemarkInput.focus()
        })
      },
      RemarkOver(){
        /*if(this.Urge.auth){
          this.UrgeAddOver();
        }*/
        const data = {
          uid: this.ID,
          remark: this.NavData.baseInfo.remark_ipt
        };
        this.UploadData('/backend/User/remark',data).then(()=>{
          this.NavData.baseInfo.IsRemark = false;
          this.InitData(this.ID);
        });
      },
      RemarkCancel(){
        this.NavData.baseInfo.IsRemark = false;
      },
      //主动还款
      RepayOpt(){
        const jk_list = this.AllInfo.loan.jk_list;
        if(jk_list.length > 0){
          const jk_data = this.ArrLast(jk_list);
          const data = {
            uid: this.ID,
            jid: jk_data.id,
            amount: this.AllInfo.jiben.info.yuE,
            name: this.AllInfo.jiben.info.name,
            hk_status: this.AllInfo.jiben.info.hk_status
          };
          this.Repay.modal = true;
          this.Repay.data = data;
        }else{
          this.$Message.error('当前无借款！');
        }
      },
      RepayCancel(){
        this.Repay.modal = false;
      },
      RepaySub(data){
        this.UploadData('/backend/Loan/payMentDone',data).then(()=>{
          this.Repay.modal = false;
          this.InitData(this.InitId);
        });
      },
      //放款操作
      LoanOpt(){
        let amount = '';
        if(this.AllInfo.loan.jk_list.length > 0){
          const last_jk = this.ArrLast(this.AllInfo.loan.jk_list);
          if(this.AllInfo.jiben.info.yuE > 0){
            this.$Message.error('该用户已放款！');
            return false;
          }
          //amount = last_jk.amount;
        }
        amount = this.Limit.value;
        if(amount <= 0){
          this.$Message.error('请先给用户授予额度！');
          return;
        }
        this.Loan.data = {
          uid: this.ID,
          amount,
          name: this.AllInfo.jiben.info.name,
          type: this.AllInfo.jiben.info.type,
          limit: this.Limit.value,
          jk_date: this.AllInfo.jiben.info.days
        }
        this.Loan.modal = true;
      },
      LoanCancel(){
        this.Loan.modal = false;
      },
      LoanSub(data){
        this.UploadData('/backend/Loan/payLoanRequest',data).then(()=>{
          this.Loan.modal = false;
          this.InitData(this.InitId);
        })
      },
      StateText(arr){
        if(arr !== false && arr.length > 0){
          arr.forEach(val=>{
            val.capital_modal = false;
          })
        }
      },
      //淘宝报表
      ReportTaobao(){
        this.$fetch('/backend/Report/taobao',{user_id: this.ID}).then(d=>{
          if(d.status === 0){
            this.$Message.error(d.message);
          }else{
            const { href } = this.$router.resolve({
              path: '/taobaoReport',
              name: '淘宝报表',
              query:{
                uid: this.ID
              }
            });
            window.open(href, '_blank');
          }
        });
      },
      //运营商报表
      ReportCarrier(){
        this.$fetch('/backend/Report/carrier',{user_id: this.ID}).then(d=>{
          if(d.status === 0){
            this.$Message.error(d.message);
          }else{
            const { href } = this.$router.resolve({
              path: '/carrierReport',
              name: '运营商报表',
              query:{
                uid: this.ID
              }
            });
            window.open(href, '_blank');
          }
        });
      },
      //查看大图
      CheckBigPic(img){
        this.BigPic.img = img;
        this.BigPic.modal = true;
      },
      CloseBigPic(){
        this.BigPic.modal = false;
      },
      RecordAddOpt(){
        this.Urge.status = true;
      },
      UrgeAddOver(){
        const data = {
          uid: this.ID,
          content: this.NavData.baseInfo.remark_ipt
          //content: this.Urge.content
        };
        this.UploadData('/backend/User/addCollection',data).then((d)=>{
          //this.Urge.status = false;
          this.Urge.Data.unshift({
            content: this.NavData.baseInfo.remark_ipt,
            create_at: d.date
          });
        })
      },
      //判断挂起状态
      JudgeHang(status){
        this.ButtonAll.forEach(val=>{
          if(val.class === 'HangOpt'){
            val.name = status?'取消挂起':'挂起';
            val.color = status?'default':'primary';
          }
        })
      },
      //判断黑名单
      JudgeBlack(status){
        this.ButtonAll.forEach(val=>{
          if(val.class === 'AddBlackOpt'){
            val.name = status?'移除黑名单':'进黑名单';
            val.color = status?'default':'error';
          }
        })
      },
      //获取放款员列表
      GetFangkuan(){
        this.$fetch('/backend/User/distributionFk',{type:1}).then(d=>{
          this.SetLoan.select = d.data;
        })
      },
      JudgeAmtTip(color){
        if(color === '#19be6b' || color === '#42be19'){
          return '已还';
        }else{
          return '应还';
        }
      },
      ArrLast(arr){
        return arr[0];
      },
      //花呗编辑
      HuabeiEdit(){
        this.Huabei.modal = true;
      },
      HuabeiSub(){
        this.Huabei.modal = false;
      },
      //芝麻分修改
      ZmfEdit(){
        this.Zhimafen.modal = true;
        this.Zhimafen.data.uid = this.ID;
        this.$nextTick(()=>{
          this.$refs.ZmfIpt.focus();
        })
      },
      ZmfSub(){
        this.UploadData('/backend/User/editZmop',this.Zhimafen.data).then(()=>{
          this.AllInfo.jiben.info.zhimafen.info = this.Zhimafen.data.zmop;
          this.AllInfo.jiben.info.zhimafen.status = 1;
          this.AllInfo.jiben.info.zmop = this.Zhimafen.data.zmop;
          this.Zhimafen.modal = false;
        });
      },
      //出资人修改
      CapitalEdit(id){
        let jk_list = this.AllInfo.loan.jk_list,ren = '';
        if(jk_list.length > 0) {
          jk_list.forEach((val,index) => {
            if (id === val.id) {
              this.$set(this.AllInfo.loan.jk_list,index, Object.assign(val,{capital_modal: true}));
              ren = val.capital_account;
            }else{
              this.$set(this.AllInfo.loan.jk_list,index, Object.assign(val,{capital_modal: false}));
            }
          });
        }
        this.Capital.data.ren = ren;
        this.Capital.data.jid = id;
      },
      CapitalSub(value){
        this.Capital.data.ren = value;
        this.UploadData('/backend/User/editChuziren',this.Capital.data).then(()=>{
          let jk_list = this.AllInfo.loan.jk_list;
          jk_list.forEach((val,index)=>{
            let capital_account = '';
            if(val.id === this.Capital.data.jid){
              capital_account = this.Capital.data.ren === 1?'L':'Z';
            }else{
              capital_account = val.capital_account;
            }
            let newData = {
              capital_modal: false,
              capital_account
            }
            this.$set(this.AllInfo.loan.jk_list,index, Object.assign(val,newData));
          });
        });
      },
      PassBtnStatus(name){
        if(name === 'PassOpt' && this.AllInfo.jiben.info.status === 2){
          return true;
        }else if(name === 'RejectOpt' && this.AllInfo.jiben.info.status === 3){
          return true;
        }else if((name === 'DelayOpt' || name === 'RepayOpt') && this.AllInfo.jiben.info.yuE <= 0){
          return true;
        }else if(name === 'RepayOpt' && this.AllInfo.jiben.info.hk_status === 0){
          return true;
        }else{
          return false;
        }
      },
      OpenEdit(type){
        this.EditPerson[type] = true;
      },
      SelectAuditor(){
        const allinfo = JSON.stringify(this.EditData);
        /*this.$post('/backend/User/editUserQuery',{_post: allinfo}).then(()=>{
          this.EditPerson.IsAuditor = false;
        });*/
      },
      SelectCollector(){
        const allinfo = JSON.stringify(this.EditData);
        /*this.$post('/backend/User/editUserQuery',{_post: allinfo}).then(()=>{
          this.EditPerson.IsCollector = false;
        });*/
      },
      GetAvator(){
        this.$fetch('backend/User/loadUserInfo',{uid: this.ID}).then((d)=>{
          if(d.status === 1){
            this.$Message.success(d.message);
            this.Avator = d.data.wx_userInfo.wx_avatar;
            this.NickName = d.data.wx_userInfo.wx_nick_name;
          }else{
            this.$Message.error('该用户已经取消关注！');
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  #towardsLeft{
    display: flex;
    flex-direction: row;
  }
  .head-area{
    color: #333;
  }
  .big-head{
    font-size: 26px;
  }
  .close-icon{
    margin-top: 5px;
    font-size: 26px;
    color: #333;
  }
  .content{
    font-size: 14px;
    height: 550px;
    overflow: hidden;
    background-color: #add8f7;
  }
  .footer-area{
    #towardsLeft;
    justify-content: space-between;
  }
  .left-box{
    max-height: 550px;
    overflow: auto;
    background: #FFF;
  }
  .head-info{
    #towardsLeft;
    justify-content: space-between;
    padding: 8px;
    border-bottom: 1px solid #eee;
    border-right: 1px solid #eee;
    .avator{
      width: 60px;
      height: 60px;
      margin: 2px 15px 0;
      position: relative;
      cursor: pointer;
      .text{
        text-align: center;
        font-size: 12px;
      }
      .icon{
        position: absolute;
        bottom: 0;
        right: -25px;
        font-size: 25px;
        &.male{
          color: rgb(65,177,228);
        }
        &.female{
          color: rgb(228,58,141);
        }
      }
      img{
        width: 100%;
        border-radius: 50%;
      }
    }
    .third-party{
      width: 620px;
      #towardsLeft;
      justify-content: space-between;
      .res-box{
        width: 120px;
        text-align: center;
        .simple{
          width: 100%;
          padding: 8px 3px;
          margin-bottom: 5px;
          white-space: nowrap;
          color: #fff;
          border-radius: 5px;
          background-color: #919191;
          &.edit-part{
            cursor: pointer;
          }
          &.edit-auth{
            padding: 6px 3px;
          }
          &.type1{
            background-color: #00a854;
          }
          &.type2{
            background-color: #d73435;
          }
        }
        .title{
          width: 100%;
          padding: 8px 3px;
          color: #333;
          border-radius: 5px;
          background-color: #7EC2F3;
          &.active{
            cursor: pointer;
            position: relative;
            &:after{
              content: '';
              position: absolute;
              transform: translateX(-50%);
              transform-origin: 0 center;
              top: -4px;
              right: -8px;
              height: 12px;
              width: 12px;
              border-radius: 100%;
              background: #ed3f14;
              z-index: 2;
              box-shadow: 0 0 0 1px #fff;
            }
          }
        }
      }
    }
  }
  .info-area{
    padding: 0 30px;
    border-right: 1px solid #eee;
    .single-line{
      padding-top: 10px;
      border-bottom: 1px solid #eee;
      .label{
        font-size: 18px;
        line-height: 25px;
      }
      .cross{
        display: flex;
        flex-direction: row;
      }
      .value{
        font-size: 12px;
        min-height: 45px;
        line-height: 45px;
        .line{
          line-height: 25px;
        }
        .num{
          font-size: 16px;
          color: #f74c17;
        }
        &.long{
          padding: 5px 0;
        }
      }
      .idcard-box{
        width: 100%;
        padding: 10px 0;
        img{
          max-width: 40%;
          margin-right: 10%;
        }
      }
    }
  }
  .record-box{
    max-height: 550px;
    overflow: auto;
  }
  .nav-box{
    width: 100%;
    background: #fff;
    padding: 15px 10px;
    font-size: 16px;
    #towardsLeft;
    justify-content: space-between;
    .nav-block{
      width: 100px;
      padding: 15px 0;
      text-align: center;
      background: #bfbfbf;
      color: #FFF;
      border-radius: 5px;
      &.cur{
        background: #00a2ae;
      }
    }
  }
  .info-box{
    width: 100%;
    padding-bottom: 5px;
    font-size: 14px;
    line-height: 25px;
    #towardsLeft;
    .remark-box{
      padding-bottom: 10px;
    }
    span{
      display: inline-block;
    }
    .half{
      width: 50%;
    }
    .label{
      width: 50px;
    }
    .value{
      width: 280px;
    }
  }
  .textarea{
    padding-bottom: 10px;
  }
  .limit-input{
    padding-left: 5px;
  }
  .base-info{
    position: relative;
    padding: 5px 15px;
    .bot-btn{
      padding-bottom: 10px;
    }
  }
  .trade-record,.opt-record{
    padding: 10px 10px 15px;
  }
  .urge-add{
    padding-bottom: 10px;
  }
  .count-box{
    border: 1px solid #666;
    border-radius: 5px;
    margin-bottom: 10px;
    background: #FFF;
    .count-line{
      border-top: 1px solid #666;
      #towardsLeft;
      .title,.value{
        padding: 5px 0;
        padding-left: 10px;
        width: 50%;
        text-align: left;
        display: inline-block;
        .num{
          color: #333;
          font-size: 16px;
        }
      }
      .title{
        border-right: 1px solid #666;
      }
      &:nth-child(1){
        border: none;
      }
    }
  }
  .card-area{
    margin-bottom: 15px;
    overflow: auto;
    .user-title{
      padding-bottom: 10px;
    }
  }
  .lend-info{
    position: relative;
    .row-box ,&.row{
      display: flex;
      flex-direction: row;
    }
    &.child{
      border-top: 1px solid #e3e3e3;
    }
    .part-title{
      font-size: 18px;
      display: block;
      padding: 6px 0;
      &.loan{
        color: #40a9ff;
      }
      &.delay{
        color: #ff4d4f;
      }
      &.repay{
        color: #47b717;
      }
    }
    .main-part{
      width: 50%;
    }
    .side-part{
      width: 50%;
      padding-left: 10px;
    }
    .yq_state{
      position: absolute;
      right: -8px;
      top: -10px;
      font-size: 20px;
      color: #F00;
    }
    .text-line{
      width: 100%;
      padding-bottom: 5px;
      display: flex;
      flex-direction: row;
      .status{
        font-weight: bold;
      }
      .price_num{
        color: #F00;
      }
      &.remark{
        width: 100%;
        padding-bottom: 20px;
      }
      .value{
        color: #f74c17;
        font-size: 14px;
        &.num{
          font-size: 22px;
        }
        &.state{
          color: #19be6b;
          &.nopay{
            color: #f7830c;
          }
        }
      }
    }
  }
  .lxr-line{
    line-height: 40px;
  }
  .opt-log {
    padding: 12px 0;
    border-bottom: 1px solid #e3e3e3;
    &:nth-last-child(1) {
      border: none;
    }
    .line {
      line-height: 25px;
    }
  }
  .inline-block{
    display: inline-block;
  }
  .clipBtn{
    display: none;
  }
  .head-input{
    width: 80px;
    border: none;
    text-align: center;
    color: #fff;
    background-color: #919191;
    &.type1{
      background-color: #00a854;
    }
    &.type2{
      background-color: #d73435;
    }
  }
  .cap-select{
    display: inline-block;
    width: 80px;
  }
  .czr-text{
    cursor: pointer;
  }
</style>
