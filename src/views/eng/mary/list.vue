<template>
  <div class="app-container">
    <!--<el-form :model="queryParams" ref="queryForm" :inline="true">-->
      <!--<el-form-item label="时间日期" prop="timeId">-->
        <!--<el-select v-model="queryParams.timeId" placeholder="时间日期">-->
          <!--<el-option-->
            <!--v-for="item in times"-->
            <!--:key="item.id"-->
            <!--:label="item.time"-->
            <!--:value="item.id">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->

      <!--<el-form-item label="项目" prop="projectId">-->
        <!--<el-select v-model="queryParams.projectId" placeholder="选择项目">-->
          <!--<el-option-->
            <!--v-for="item in projects"-->
            <!--:key="item.id"-->
            <!--:label="item.projectName"-->
            <!--:value="item.id">-->
            <!--<span style="float: left">{{ item.projectName }}</span>-->
            <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.customerName }}</span>-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->

      <!--<el-form-item>-->
        <!--<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
        <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
      <!--</el-form-item>-->
    <!--</el-form>-->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-tooltip class="item" effect="dark" content="跳转至" placement="top-start">
          <el-button
            class="is-plain"
            type="primary"
            icon="el-icon-view el-icon--right"
            size="mini"
            @click="redirectView('#/engin/projectentry')"
          >项目录入</el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="1.5">
        <el-tooltip class="item" effect="dark" content="跳转至" placement="top-start">
          <el-button
            class="is-plain"
            type="primary"
            icon="el-icon-view el-icon--right"
            size="mini"
            @click="redirectView('#/engin/business')"
          >经营合约</el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="1.5">
        <el-tooltip class="item" effect="dark" content="跳转至" placement="top-start">
          <el-button
            class="is-plain"
            type="primary"
            icon="el-icon-view el-icon--right"
            size="mini"
            @click="redirectView('#/engin/design')"
          >设计工作</el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="1.5">
        <el-tooltip class="item" effect="dark" content="跳转至" placement="top-start">
          <el-button
            class="is-plain"
            type="primary"
            icon="el-icon-view el-icon--right"
            size="mini"
            @click="redirectView('#/engin/pjob')"
          >生产工作</el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="1.5">
        <el-tooltip class="item" effect="dark" content="跳转至" placement="top-start">
          <el-button
            class="is-plain"
            type="primary"
            icon="el-icon-view el-icon--right"
            size="mini"
            @click="redirectView('#/engin/progress')"
          >工程进展</el-button>
        </el-tooltip>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="progressMaryList" @sort-change='sortChange'  @selection-change="handleSelectionChange">
      <!--<el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="客户名称" prop="customerName" :show-overflow-tooltip="true" width="110" />
      <el-table-column label="项目名称" prop="projectName" :show-overflow-tooltip="true" width="110" />
      <el-table-column label="楼号" prop="towerNumber" width="50" />
      <el-table-column label="实时进度(层)" prop="currentCompleteLayer" width="100" />
      <el-table-column label="模板面积(㎡)" prop="templateArea" sortable='custom' width="120" />
      <el-table-column label="合同租期(天)" prop="leaseContract" sortable='custom' width="120" />
      <el-table-column label="中标时间" prop="winningTime" sortable='custom' width="100" />
      <el-table-column label="设计完成时间" prop="planRealEndTime" sortable='custom' width="130" />
      <el-table-column label="生产完成时间" prop="actualEndTime" sortable='custom' width="130" />
      <el-table-column label="租期开始" prop="contractStartTime" sortable='custom' width="100" />
      <el-table-column label="租期结束" prop="contractEndTime" sortable='custom' width="100" />
      <el-table-column label="完成率(%)" prop="completeRate" sortable='custom' width="110" />
      <el-table-column label="超期时间(天)" prop="superDay" sortable='custom' width="130" />
      <el-table-column label="" prop=""/>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="queryProgressMary"
    />
  </div>
</template>

<script>

  // (项目) 工程进展汇总
  import {queryProgressMary, getProjects} from '@/api/eng/mary'

  import {getTime} from '@/api/time';

  export default {
    name: "ProgressMary",
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
        },
        // 表单参数
        form: {},
        defaultProps: {
          children: "children",
          label: "label"
        }
      };
    },
    created() {
      this.getTimes();
      this.queryProgressMary();
    },
    methods: {
      /** 获取项目的时间列表*/
      getTimes() {
        getTime().then( response => {
          this.times = response.data;
          // 时间设置默认值
          this.queryParams.timeId = this.times[0].id;
          // 获取项目列表
          this.getProjects();
        });
      },
      /** 通过时间ID获取时间对象的项目集合*/
      getProjects() {
        getProjects(this.queryParams.timeId).then( response => {
          this.projects = response.data;
        });
      },
      /** (项目)工程进展汇总列表 */
      queryProgressMary() {
        this.loading = true;
        setTimeout(()=>{
          queryProgressMary(this.queryParams).then(
            response => {
              this.progressMaryList = response.rows;
              this.total = response.total;
              this.loading = false;
            }
          );
        },500)
      },
      //排序
      sortChange (column, prop, order){
        if (column.order != null) {
          this.queryParams.isAsc = 'desc';
        } else {
          this.queryParams.isAsc = 'asc';
        }
        this.queryParams.orderByColumn = column.prop
        this.queryProgressMary(this.queryParams);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.queryProgressMary();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams.isAsc = undefined;
        this.queryParams.orderByColumn = undefined;
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      // 跳转
      redirectView(url) {
        window.location.href = url;
      },
      //格式化表格数据
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      /** 导出按钮操作 */
      handleExport() {
        this.$confirm('您确定要导出当页数据吗？', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() =>{
          import('../../../utils/Export2Excel').then((excel) => {
            const multiHeader = [['(项目)工程进展汇总报表', '', '', '', '', '', '', '', '', '', '', '', '']];
            const tHeader = ['客户名称', '项目名称', '楼号', '实时进度(层)', '模板面积(㎡)', '合同周期(天)', '中标时间',
              '设计完成时间', '生产完成时间', '租期开始', '租期结束', '完成率(%)', '超期时间(天)']
            const filterVal = ['customerName', 'projectName', 'towerNumber', 'currentCompleteLayer', 'templateArea',
              'leaseContract', 'winningTime', 'planRealEndTime'
              , 'actualEndTime', 'contractStartTime', 'contractEndTime', 'completeRate', 'superDay']
            const list = this.progressMaryList;
            const data = this.formatJson(filterVal, list)
            // 进行所有表头的单元格合并
            const merges = ['A1:M1'];

            const fileNameDate = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate() + '日';
            excel.export_json_to_excel({
              multiHeader, // 这里是第一行的表头
              // multiHeader2, // 这里是第二行的表头
              header: tHeader, // 这里是第三行的表头
              data,
              filename: '(项目)工程进展汇总报表' + fileNameDate,
              merges,
            });
            this.queryProgressMary();
          });
        }).catch(function() {

        });
      }

    }
  };
</script>
