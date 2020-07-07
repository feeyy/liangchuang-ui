<template>
  <div class="table-container">
        <div class="table-til">
          计划汇总表
        </div>
    <div id="jhTable">
    <el-table width="100%" max-height="300px" v-loading="loading" :data="taskMaryList" border  >
      <!--<el-table-column label="年度计划汇总预览表" align="center">-->
        <el-table-column class="home-table" label="部门" prop="dept.deptName" />
        <el-table-column class="home-table" label="负责人" prop="principalName"/>
        <el-table-column class="home-table" label="计划总量(条)" prop="planCount" />
        <el-table-column class="home-table" label="按时完成(条)" prop="timingComplete" />
        <el-table-column class="home-table" label="未完成(条)" prop="noComplete" />
        <el-table-column class="home-table" label="延后完成(条)" prop="delayComplete" />
        <el-table-column class="home-table" label="延期累计天" prop="delaySumDay" />
        <el-table-column class="home-table" label="完成率(%)" prop="completeRate" />
      <!--</el-table-column>-->
    </el-table>
    </div>
  </div>
</template>

<script>

  // 年度计划汇总
  import {prodTaskMaryList} from '@/api/index'
  import {getYears} from '@/api/prod/mary'

  export default {
    name: 'table-container',
    data() {
      return {
        // 遮罩层
        loading: true,
        // 查询的年
        years: [],
        // 年度计划汇总data
        taskMaryList: [],
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
          pageSize: 20,
          isAsc: undefined,
          orderByColumn: undefined
        }
      }
    },
    created() {
      /** 获取年度计划汇总有哪些年份 */
      this.getYears()
      /** 查询年度计划汇总列表 */
      this.prodTaskMaryList()
    },
    methods: {
      /** 获取年度计划汇总有哪些年份 */
      getYears() {
        getYears().then(response => {
          this.years = response.data
          this.queryParams.whenYears = new Date().getFullYear()
        })
      },
      formatterRowStyle({row, index}) {
        return 'background-color: red;';
      },
      /** 查询年度计划汇总列表 */
      prodTaskMaryList() {
        this.loading = true
        setTimeout(()=>{
          prodTaskMaryList(this.queryParams).then(response => {
           // console.log(response.rows);
          //  var dataArr = response.rows;
         //   for (let i = 0; i < dataArr.length; i++) {
//
          //  }
         //   this.taskMaryList = dataArr;
            this.taskMaryList = response.rows
            this.total = response.total
            this.loading = false
          })
        },500)
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
  #jhTable /deep/.el-table, .el-table__expanded-cell {
    background-color: transparent;
  }
  #jhTable /deep/.el-table tr {
    background-color: transparent;
    color: #ffffff;
    font-size: 12px;
  }
  #jhTable /deep/.el-table--enable-row-hover .el-table__body tr:hover>td {
    background: #409EFF;
    color: #ffffff;
  }
  #jhTable /deep/.el-table__header th, .el-table__header tr {
    background-color:transparent;
    color: #409EFF;
    padding:6px 0px;
  }
</style>
