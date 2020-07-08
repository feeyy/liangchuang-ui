<template>
  <div class="elcontent">
    <div class="elcontent-l">
      <div class="elcontent-t1" style="color: #ffffff">
        <el-progress type="circle" :percentage="this.prodictMaryList[0].completeRate" :width="120" :stroke-width="10" :color="customColors"></el-progress>
      </div>
      <div class="elcontent-t2">
        铝件车间
      </div>
      <div class="elcontent-t3">
        <i class="el-icon-odometer"></i>指标(m²)：{{this.prodictMaryList[0].indicators}}
      </div>
      <div class="elcontent-t3">
        <i class="el-icon-data-line"></i>计划(m²)：{{this.prodictMaryList[0].planComplete}}
      </div>
      <div class="elcontent-t3">
        <i class="el-icon-circle-check"></i>完成(m²)：{{this.prodictMaryList[0].actualComplete}}
      </div>
      <div class="elcontent-t3">
        <i class="el-icon-pie-chart"></i>差量(m²)：{{this.prodictMaryList[0].proPoor}}
      </div>

    </div>
    <div class="elcontent-r">
      <div class="elcontent-t1" >
        <el-progress type="circle" :percentage="this.prodictMaryList[1].completeRate" :width="120" :stroke-width="10" :color="customColors"></el-progress>
      </div>
      <div class="elcontent-t2">
        打砂车间
      </div>
      <div class="elcontent-t3">
        <i class="el-icon-odometer"></i>指标(m²)：{{this.prodictMaryList[1].indicators}}
      </div>
      <div class="elcontent-t3">
        <i class="el-icon-data-line"></i>计划(m²)：{{this.prodictMaryList[1].planComplete}}
      </div>
      <div class="elcontent-t3">
        <i class="el-icon-circle-check"></i>完成(m²)：{{this.prodictMaryList[1].actualComplete}}
      </div>
      <div class="elcontent-t3">
        <i class="el-icon-pie-chart"></i>差量(m²)：{{this.prodictMaryList[1].proPoor}}
      </div>
    </div>
  </div>
</template>

<script>

  // 年度生产汇总
  import {getYears} from '@/api/report/mary'
  import {listProdictMary} from '@/api/index'

  export default {
    name: 'elcontent',
    data() {
      return {
        // 遮罩层
        loading: true,
        //铝件车间
        lvjian:0,
        //打砂车间
        dasha:0,
        // 查询的年
        years: [],
        // 年度生产汇总data
        prodictMaryList: [],
        // 状态数据字典
        statusOptions: [],
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          whenYears: undefined,
          pageNum: 1,
          pageSize: 30,
          isAsc: undefined,
          orderByColumn: undefined
        },
        customColors: [
          {color: '#909399', percentage: 20},
          {color: '#F56C6C', percentage: 40},
          {color: '#E6A23C', percentage: 60},
          {color: '#67C23A', percentage: 80},
          {color: '#409EFF', percentage: 100}
        ]

      }
    },
    created() {
      /** 获取年度生产汇总有哪些年份 */
      this.getYears()
      this.getDicts("tb_product_type").then(response => {
        this.statusOptions = response.data;
      });
      /** 查询年度生产汇总列表 */
      this.listProdictMary()
    },
    methods: {
      /** 获取年度生产汇总有哪些年份 */
      getYears() {
        getYears().then(response => {
          this.years = response.data
          this.queryParams.whenYears = new Date().getFullYear()
        })
      },
      /** 查询年度生产汇总列表 */
      listProdictMary() {
        this.loading = true
        setTimeout(()=>{
          listProdictMary(this.queryParams).then(response => {
            this.prodictMaryList = response.rows
          //  this.lvjian = response.rows[0].completeRate
           // this.dasha = response.rows[1].completeRate
            this.total = response.total
            this.loading = false
          })
        },500)
      },
      refreshData() {
        this.loading = true
        refreshData().then(response => {
          this.loading = false
          this.listProdictMary()
        })
      },

    }
  }
</script>
<style lang="scss" scoped>
  .elcontent{
    text-align: left; line-height: 20px; margin: 0px 3% 3%  0px; width: 100%; height: 300px;
  }
  .elcontent-l{
    float:left;width: 49%; overflow: hidden; text-align: center;
  }
  .elcontent-r{
    float:right;width: 49%; overflow: hidden;text-align: center;
  }
  .elcontent-t1{
    float:left; width: 100%; margin-top: 10px;
  }
  .elcontent-t2{
    float:left; width: 100%; line-height: 20px; margin-top: 10px;font-size: 14px; color: #409EFF;
  }
  .elcontent-t3{
    float:left; width: 100%; line-height: 20px; margin-top: 5px; font-size: 12px; color: #ffffff;
    text-align: left; margin-left: 20px;
  }
  /deep/.el-progress__text{
    color:#ffffff ;
  }

</style>
