<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="月度" prop="timeId">
        <el-select v-model="queryParams.timeId" placeholder="月度">
          <el-option
            v-for="item in times"
            :key="item.id"
            :label="item.time"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日" prop="toDayNumber">
        <el-select v-model="queryParams.toDayNumber" placeholder="日">
          <el-option
            v-for="(item, index) in days"
            :key="days[index]"
            :label="days[index]"
            :value="days[index]">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="组别" prop="prodTypeId">
        <el-select v-model="queryParams.prodTypeId" placeholder="组别">
          <el-option
            v-for="item in reportType"
            :key="item.id"
            :label="item.productName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['report:details:update']"
        >录入日产量值</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="detailsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="组别" prop="productType.productName"/>
      <el-table-column label="车间分组" prop="productType.workShop" :formatter="(r, c) => {
          var val = '';
          for(let i = 0; i < this.statusOptions.length; i++) {
            var obj = this.statusOptions[i];
            if (obj.dictValue == r.productType.workShop) {
              val = obj.dictLabel;
            }
          }
          return val;
      }"/>
      <el-table-column label="当前日" prop="toDayNumber" :formatter="(r, c) => {return r.toDayNumber != null ? r.toDayNumber + ' 日' : '-'}"/>
      <el-table-column label="日产量值" prop="prodVal"/>
      <el-table-column label="当月合计" prop="sumValMonth"/>
      <el-table-column label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['report:details:update']"
          >录入日产量值</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="listDetails"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body center>
      <el-form ref="form" :inline="true" :model="form" label-width="100px">
          <el-form-item label="日产量值" prop="prodVal">
            <el-input v-model="form.prodVal" placeholder="请输入当日产量值" oninput="value=value.replace(/[^0-9.]/g,'')" />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  // 日产量类型名称
  import {listType} from '@/api/report/type/type'
  // 日产量详情
  import {listDetails, updateDetails, get} from '@/api/report/details/details'
  // 项目时间
  import {getTime} from '@/api/time'

  // require('file-saver');
  // require('@/utils/blob');
  // require('xlsx');

  export default {
    name: "report",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 项目时间
        times: [],
        // 日产量类型select
        reportType: [],
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 日产量详情数据列表
        detailsList: [],
        // 状态数据字典
        statusOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          timeId: undefined,
          prodTypeId: undefined,
          toDayNumber: undefined
        },
        // 表单参数
        form: {},
        days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
        defaultProps: {
          children: "children",
          label: "label"
        }
      };
    },
    created() {
      // 获取时间
      this.getTime();
      // 获取日产量类型名称
      this.listReportType();
      this.getDicts("tb_product_type").then(response => {
        this.statusOptions = response.data;
      });
      // 查询日产量详情列表
      this.listDetails();
      // 锁定当前日期
      this.queryParams.toDayNumber = new Date().getDate();
    },
    methods: {
      /** 获取项目时间 */
      getTime() {
        getTime().then( response => {
          this.times = response.data;
          // 时间设置默认值
          this.queryParams.timeId = this.times[0].id;
        });
      },
      /** 获取日产量类型名称 */
      listReportType() {
        listType().then(response => {
          this.reportType = response.data;
        });
      },
      /** 日产量详情 */
      listDetails() {
        this.loading = true;
        setTimeout(()=>{
          listDetails(this.queryParams).then(response => {
            this.detailsList = response.rows;
            this.total = response.total;
            this.loading = false;
          });
        },500)
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
        this.listDetails();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.queryParams.toDayNumber = undefined;
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        get(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "录入日产量信息";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.open = true;
        this.loading = true;
        if (this.form.id != undefined && this.form.id != '') {
          this.open = false;
          updateDetails(this.form).then(response => {
            this.loading = false;
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.listDetails();
            } else {
              this.msgError(response.msg);
            }
          }).catch( ()=> {
            this.loading = false;
          });
        }
      },
      //格式化表格数据
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      /** 导出按钮操作 */
      handleExport() {
        this.$confirm('您确定要导出当页数据吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          import('../../../utils/Export2Excel').then((excel) => {
            const multiHeader = [['产量日报', '', '', '', '']];
            const tHeader = ['序号', '组别', '当前天(号)', '日产量值', '当月合计']
            const filterVal = ['id', 'prodTypeId', 'toDayNumber', 'prodVal', 'sumValMonth']
            const list = this.detailsList;
            if (list.length != 0) {
              for (let i = 0; i < list.length; i++) {
                let obj = list[i];
                obj.prodTypeId = obj.productType.productName;
              }
            }
            const data = this.formatJson(filterVal, list)
            // 进行所有表头的单元格合并
            const merges = ['A1:E1'];

            const fileNameDate = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate() + '日';
            excel.export_json_to_excel({
              multiHeader, // 这里是第一行的表头
              // multiHeader2, // 这里是第二行的表头
              header: tHeader, // 这里是第三行的表头
              data,
              filename: '产量日报' + fileNameDate,
              merges,
            });
          });
        }).catch(function() {

        })
      }

    }
  };
</script>
