<template>
  <div class="table-container">
        <div class="table-til">
          工程汇总表
        </div>
    <div id="gcTable">
    <el-table width="100%" max-height="300px" v-loading="loading" :data="progressMaryList" :span-method="arraySpanMethod" border >
      <!--<el-table-column type="selection" width="55" align="center" />-->
      <!--<el-table-column label="年度工程汇总预览" align="center">-->
      <el-table-column label="客户名称" prop="customerName" :show-overflow-tooltip="true" />
      <el-table-column label="项目名称" prop="projectName" :show-overflow-tooltip="true" />
      <el-table-column label="楼号" prop="towerNumber" />
      <el-table-column label="实时进度(层)" prop="currentCompleteLayer"  />
      <el-table-column label="模板面积(㎡)" prop="templateArea" />
      <el-table-column label="合同租期(天)" prop="leaseContract"  />
      <el-table-column label="中标时间" prop="winningTime"  />
      <el-table-column label="设计完成时间" prop="planRealEndTime"  />
      <el-table-column label="生产完成时间" prop="actualEndTime" />
      <el-table-column label="租期开始" prop="contractStartTime"   />
      <el-table-column label="租期结束" prop="contractEndTime"  />
      <el-table-column label="完成率(%)" prop="completeRate"  />
        <el-table-column label="超期时间(天)" prop="superDay"   />
      <!--</el-table-column>-->
    </el-table>
    </div>
  </div>
</template>

<script>

  // (项目) 工程进展汇总
  import {queryProgressMary} from '@/api/index'

  export default {
    name: "table-container",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 工程进展汇总集合
        progressMaryList: [],
        // 时间数组
        times: [],
        // 项目列表集合
        projects: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 20,
          projectId: undefined,
          timeId: undefined,
          isAsc: undefined,
          orderByColumn: undefined
        }
      };
    },
    created() {
      this.queryProgressMary();
    },
    methods: {
      /** (项目)工程进展汇总列表 */
      queryProgressMary() {
        this.loading = true;
        setTimeout(()=>{
          queryProgressMary(this.queryParams).then(
            response => {
              this.progressMaryList = response.rows;
              this.total = response.total;
              this.loading = false;
              this.merage();
            }
          );
        },500)
      },
      //表格合并
      arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 1||columnIndex === 2) {
          const row1 = this.idArr[rowIndex]
          const col1 = row1 > 0 ? 1 : 0
          return {
            rowspan: row1,
            colspan: col1
          }
        }
      },
      merage () {
        this.idArr = []
        this.idPos = 0
        for (let i = 0; i < this.progressMaryList.length; i++) {
          if (i === 0) {
            this.idArr.push(1)
            this.idPos = 0
          } else {
            if (this.progressMaryList[i].projectName === this.progressMaryList[i - 1].projectName) {
              this.idArr[this.idPos] += 1
              this.idArr.push(0)
            } else {
              this.idArr.push(1)
              this.idPos = i
            }
          }
        }
      },
      // //排序
      // sortChange (column, prop, order){
      //   if (column.order != null) {
      //     this.queryParams.isAsc = 'desc';
      //   } else {
      //     this.queryParams.isAsc = 'asc';
      //   }
      //   this.queryParams.orderByColumn = column.prop
      //   this.queryProgressMary(this.queryParams);
      // },
      // // 取消按钮
      // cancel() {
      //   this.open = false;
      //   this.reset();
      // },
      // // 表单重置
      // reset() {
      //   this.resetForm("form");
      // },
      // /** 搜索按钮操作 */
      // handleQuery() {
      //   this.queryParams.pageNum = 1;
      //   this.queryProgressMary();
      // },
      // /** 重置按钮操作 */
      // resetQuery() {
      //   this.queryParams.isAsc = undefined;
      //   this.queryParams.orderByColumn = undefined;
      //   this.resetForm("queryForm");
      //   this.handleQuery();
      // },
      // // 多选框选中数据
      // handleSelectionChange(selection) {
      //   this.ids = selection.map(item => item.id)
      //   this.single = selection.length!=1
      //   this.multiple = !selection.length
      // },
    }
  };
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
  #gcTable /deep/.el-table, .el-table__expanded-cell {
    background-color: transparent;
  }
  #gcTable /deep/.el-table tr {
    background-color: transparent;
    color: #ffffff;
    //font-size: 12px;
  }
  #gcTable /deep/.el-table--enable-row-hover .el-table__body tr:hover>td {
    background: #409EFF;
    color: #ffffff;
  }
  #gcTable /deep/.el-table__header th, .el-table__header tr {
    background-color:#409EFF;
    color: #ffffff;
    padding:6px 0;
  }
</style>
