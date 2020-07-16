<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="20">
      <el-col :xs="12" :sm="12" :lg="12">
        <div class="sy-top">
        <img class="sy-logo" src="@/imges/logo_icon.png">
          <h2 class="sy-title">良创数据化管理平台</h2>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="12">
        <div class="tim-c">
          {{this.timingTime}}
        </div>
        <div class="to-tim-c">
          {{this.toDateTime}}
        </div>
      </el-col>
    </el-row>

    <panel-group/>

    <el-row :gutter="20" >
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div class="table-til">
            本月日产量分析
          </div>
          <line-chart :chart-data="curve_echars"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" >
        <div class="chart-wrapper">
          <div class="table-til">
            项目分布地图
          </div>
          <Map />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" >
        <div class="chart-wrapper">
          <div class="table-til">
            本年生产完成率
          </div>
          <ReportProgress/>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">

      <el-col :xs="24" :sm="12" :lg="6" >
        <div class="chart-wrapper">
          <div class="table-til">
            本年月总产量（㎡）
          </div>
          <ProductMonth />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" >
        <div class="chart-wrapper">
          <div class="table-til">
            近三年总产量（㎡）
          </div>
          <ProductYears />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" >
        <div class="chart-wrapper">
          <div class="table-til">
            部门工作完成率
          </div>
          <ProdTaskProgress/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" >
        <div class="chart-wrapper">
          <div class="table-til">
            本年计划分析
          </div>
          <PieChart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :lg="12" :xl="6">
        <div class="chart-wrapper">
          <ProdTaskTable />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12" :xl="6">
        <div class="chart-wrapper">
          <ReportTable />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12" :xl="6">
        <div class="chart-wrapper">
          <EngTable />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12" :xl="6">
        <div class="chart-wrapper">
          <RepertoryTable />
        </div>
      </el-col>
    </el-row>
    <jump-btn/>
  </div>
</template>

<script>
// 查询所有的组别、日产量、月产量
import {listType, statisticalProductMary, statisticalProductMaryMonth} from '@/api/index'

import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import ProdTaskTable from './dashboard/ProdTaskTable'
import ProdTaskProgress from './dashboard/ProdTaskProgress'
import ReportTable from './dashboard/ReportTable'
import ReportProgress from './dashboard/ReportProgress'
import ProductMonth from './dashboard/ProductMonth'
import ProductYears from './dashboard/ProductYears'
import JumpBtn from './dashboard/JumpBtn'
import EngTable from './dashboard/EngTable'
import RepertoryTable from './dashboard/RepertoryTable'
import PieChart from './dashboard/PieChart'
import Map from './dashboard/Map'
var curve_echars_data  = {
  // 组别
  productTypes: [],
  series: []
}
var _data = {};

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    ProdTaskTable,
    ProdTaskProgress,
    ReportTable,
    ReportProgress,
    JumpBtn,
    ProductMonth,
    ProductYears,
    EngTable,
    RepertoryTable,
    PieChart,
    Map
  },
  data() {
    return {
      // 曲线图数据
      curve_echars: undefined,
      // 组别
      productTypes: [],
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      // 计时
      timingTime: undefined,
      // 当前时间git remote add origin https://github.com/feeyy/-.git
      toDateTime: undefined
    }
  },
  // 钩子函数
  mounted () {
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
      })()
    }
  },
  created() {
    this.timing();
    this.listType();
  },
  methods: {
    /** 获取组别list **/
    listType() {
      curve_echars_data  = {
        // 组别
        productTypes: [],
        series: []
      }
      listType().then(response => {
        var obj = response.data;
        this.productTypes = obj;
        // 形成数据
        curve_echars_data.productTypes = [];
        this.create_data();
      })
    },
    create_data() {
      var obj = this.productTypes;
      var arrs = [];
      if (null != obj && obj.length != 0) {
        for (let i = 0; i < obj.length; i++) {
          // 组别ID
          var prodTypeId = obj[i].id;
          // 组别名称
          arrs[i] = obj[i].productName;

          // 通过组别类型统计当月日产量详情-用作主页echars图形数据
          statisticalProductMary(prodTypeId).then(res => {
            var ductObj = res.data;
            // 值与别名
            _data = {
              data: [],
              itemStyle: {
                normal: {
                  //color: '#FF005A',
                  lineStyle: {
                    //color: '#FF005A',
                    width: 2
                  }
                }
              },
              smooth: true,
              type: 'line',
              areaStyle: {},
              animationDuration: 2800,
              animationEasing: 'cubicInOut'
            }
            if (null != ductObj && ductObj.length != 0) {
              var ductArrs = [];
              for (let j = 0; j < ductObj.length; j++) {
                ductArrs[j] = (ductObj[j].prodVal == null ? 0 : ductObj[j].prodVal);
              }
              _data.data = ductArrs;
            }
            // 赋值别名
            _data.name = obj[i].productName;
            curve_echars_data.series.push(_data);
          })
        }
      }
      curve_echars_data.productTypes = (this.screenWidth < 700 ? [] : arrs);
      this.curve_echars = curve_echars_data;
    },
    // 时间
    timing() {
      setInterval( () => {
        var now = new Date()
        var target = new Date(now.getFullYear() + 1 + '/1/1') //元旦的时间
        var d = target.getTime() - now.getTime()
        //两个对象直接相减得到的就是相差毫秒数
        d = Math.floor(d / 1000) //将毫秒转化为秒
        //获取相差的天数，除以一天的秒数,向下取整
        var day = Math.floor(d / (24 * 60 * 60))
        var lastTimeStr = '距今年结束还有: ' + day + ' 天';
        this.timingTime = lastTimeStr;

        var str = '';
        var week = now.getDay();
        if (week == 0) {
          str = "星期日";
        } else if (week == 1) {
          str = "星期一";
        } else if (week == 2) {
          str = "星期二";
        } else if (week == 3) {
          str = "星期三";
        } else if (week == 4) {
          str = "星期四";
        } else if (week == 5) {
          str = "星期五";
        } else if (week == 6) {
          str = "星期六";
        }
        var nowDate = now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日 " + str + ' ' +now.getHours()+ ":" + (now.getMinutes() < 10 ? ('0'+now.getMinutes()) : now.getMinutes());

        this.toDateTime = nowDate;
      }, 1000);
    },
  }
}
</script>

<style lang="scss" scoped>
 .dashboard-editor-container {
   padding: 20px;
  // background-color: #000000;
    background-color: #304156;
   //background-color: rgb(240, 242, 245);
   position: relative;
 }

  .chart-wrapper {
    margin-bottom: 20px;
    background-color: rgba(0, 0, 0, .1);
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
  }


 .sy-top {
     position: relative;
     height: 100%;
     width: 100%;
     line-height: 32px;
     text-align: left;

     & .sy-logo {
       width: 32px;
       height: 32px;
       vertical-align: middle;
     }

     & .sy-title {
       display: inline-block;
       margin: 0px;
       font-weight: bold;
       color: #ffffff;
       font-size: 20px;
       vertical-align: middle;
     }
   }

.tim-c {
  color:#409EFF;
  font-size: 14px;
  text-align: right;
  line-height: 20px;
  clear: both;
  font-weight: bold;
}
.to-tim-c {
  font-size: 14px;
  color: #fff;
  text-align: right;
  clear: both;
  line-height: 20px;
}

 .table-til {
   width: 100%;
   text-align: center;
   color: #409EFF;
   font-weight: bold;
   line-height: 40px;
 }



@media (max-width:550px) {
  .dashboard-editor-container {
    padding: 10px;
  }
  .app-container {
    padding: 5px;
  }
  .sy-top {
    line-height: 30px;

    & .sy-logo {
      width: 22px;
      height: 22px;
    }

    & .sy-title {
      font-size: 14px;
    }
  }
  .tim-c {
    font-size: 12px;
  }
  .to-tim-c {
    font-size: 12px;
  }
}

</style>
