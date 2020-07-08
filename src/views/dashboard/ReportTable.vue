<template>
  <div class="table-container">
        <div class="table-til">
          生产汇总表
        </div>
    <div id="scTable">
    <el-table width="100%" max-height="300px" v-loading="loading" :data="prodictMaryList" border>
      <!--<el-table-column label="年度生产汇总预览表" align="center">-->
        <el-table-column style="background: transparent" label="年/月" prop="isYears"  :formatter="(r, c) => {return r.isYears == 1 ? '全年' : r.whenYearsMonth.substring(0, 7)}"/>
        <el-table-column style="background: transparent" label="车间分组" prop="workShop" :formatter="(r, c) => {
            var val = '';
            for(let i = 0; i < this.statusOptions.length; i++) {
              var obj = this.statusOptions[i];
              if (obj.dictValue == r.workShop) {
                val = obj.dictLabel;
              }
            }
            return val;
        }"/>
        <el-table-column style="background: transparent" label="指标(m²)" prop="indicators" />
        <el-table-column style="background: transparent" label="计划完成(m²)" prop="planComplete" />
        <el-table-column style="background: transparent" label="实际完成(m²)" prop="actualComplete" />
        <el-table-column style="background: transparent" label="进度差量(m²)" prop="proPoor" />
        <el-table-column style="background: transparent" label="进度完成率(%)" prop="completeRate" />
      <!--</el-table-column>-->
    </el-table>
    </div>
  </div>
</template>

<script>

  // 年度生产汇总
  import {getYears} from '@/api/report/mary'
  import {listProdictMary} from '@/api/index'

  export default {
    name: 'table-container',
    data() {
      return {
        // 遮罩层
        loading: true,
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
        }
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
      // 修改 table cell边框的背景色
      tableCellStyle () {
      //  return 'border-color: #ffffff; background: transparent;'
      },
// 修改 table header cell的背景色
      tableHeaderCellStyle () {
       // return 'border-color: #ffffff;  background: transparent;'
      },
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
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.resetForm('form')
      },
    }
  }
</script>
<style lang="scss" scoped>
  .table-container {
    padding: 10px;
  }
  .table-til {
    width: 100%;
    text-align: center;
    color: #409EFF;
    font-weight: bold;
    line-height: 30px;
  }
  #scTable /deep/.el-table, .el-table__expanded-cell {
    background-color: transparent;
  }
  #scTable /deep/.el-table tr {
    background-color: transparent;
    color: #ffffff;
   // font-size: 12px;
  }
  #scTable /deep/.el-table--enable-row-hover .el-table__body tr:hover>td {
    background: #409EFF;
    color: #ffffff;
  }
  #scTable /deep/.el-table__header th, .el-table__header tr {
    background-color:#409EFF;
    color: #ffffff;
    padding:6px 0px;
  }

</style>
