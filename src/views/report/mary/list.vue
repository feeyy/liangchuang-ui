<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="年份" prop="whenYears">
        <el-select v-model="queryParams.whenYears" placeholder="年份">
          <el-option
            v-for="(item, index) in years"
            :key="years[index]"
            :label="years[index]"
            :value="years[index]">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="primary"-->
          <!--icon="el-icon-plus"-->
          <!--size="mini"-->
          <!--@click="handleAdd"-->
          <!--v-hasPermi="['report:mary:add']"-->
        <!--&gt;新增-->
        <!--</el-button>-->
      <!--</el-col>-->
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['report:mary:update']"
        >修改
        </el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="danger"-->
          <!--icon="el-icon-delete"-->
          <!--size="mini"-->
          <!--:disabled="multiple"-->
          <!--@click="handleDelete"-->
          <!--v-hasPermi="['report:mary:delete']"-->
        <!--&gt;删除-->
        <!--</el-button>-->
      <!--</el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-tooltip class="item" effect="dark" content="可手动更新, 每日凌晨一点自动更新" placement="top-start">
          <el-button
            type="success" plain
            icon="el-icon-refresh"
            size="mini"
            @click="refreshData"
          >手动更新</el-button>
        </el-tooltip>
      </el-col>

      <el-col :span="1.5">
        <el-tooltip class="item" effect="dark" content="跳转至" placement="top-start">
          <el-button
            class="is-plain"
            type="primary"
            icon="el-icon-view el-icon--right"
            size="mini"
            @click="redirectView('#/prod/report')"
          >日产量报表</el-button>
        </el-tooltip>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="prodictMaryList" @sort-change='sortChange'
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--<el-table-column label="序号" prop="id" sortable='custom' width="80"/>-->
      <el-table-column label="年/月" prop="isYears" sortable='custom' width="80" :formatter="(r, c) => {return r.isYears == 1 ? '全年' : r.whenYearsMonth.substring(0, 7)}"/>
      <el-table-column label="车间分组" prop="workShop" :formatter="(r, c) => {
          var val = '';
          for(let i = 0; i < this.statusOptions.length; i++) {
            var obj = this.statusOptions[i];
            if (obj.dictValue == r.workShop) {
              val = obj.dictLabel;
            }
          }
          return val;
      }"/>
      <el-table-column label="指标(m²)" prop="indicators" sortable='custom'/>
      <el-table-column label="计划完成(m²)" prop="planComplete" sortable='custom'/>
      <el-table-column label="实际完成(m²)" prop="actualComplete" sortable='custom'/>
      <el-table-column label="进度差量(m²)" prop="proPoor" sortable='custom'/>
      <el-table-column label="进度完成率(%)" prop="completeRate" sortable='custom'/>
      <!--<el-table-column label="更新时间" prop="updateTime" sortable='custom' width="140"-->
                       <!--:formatter="(r, c) => {return r.updateTime != null ? r.updateTime.replace('T', ' ') : '-'}"/>-->
      <el-table-column label="操作" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['report:details:update']"
          >修改
          </el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['report:mary:delete']"-->
          <!--&gt;删除-->
          <!--</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="listProdictMary"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px" append-to-body center>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="指标(㎡)" prop="indicators">
          <el-input v-model="form.indicators" placeholder="指标(最多保留4位小数)" oninput="value=value.replace(/[^0-9.]/g,'')"/>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="计划完成(㎡)" prop="planComplete">
          <el-input v-model="form.planComplete" placeholder="计划完成(最多保留4位小数)"
                    oninput="value=value.replace(/[^0-9.]/g,'')"/>
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

  // 年度生产汇总
  import {
    listProdictMary,
    get,
    addProdictMary,
    updateProdictMary,
    deleteProdictMary,
    getYears,
    refreshData
  } from '@/api/report/mary'

  // require('file-saver');
  // require('@/utils/blob');
  // require('xlsx');

  export default {
    name: 'report-mary',
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
          pageSize: 10,
          isAsc: undefined,
          orderByColumn: undefined
        },
        // 表单参数
        form: {},
        defaultProps: {
          children: 'children',
          label: 'label'
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
      //排序
      sortChange(column, prop, order) {
        if (column.order != null) {
          this.queryParams.isAsc = 'desc'
        } else {
          this.queryParams.isAsc = 'asc'
        }
        this.queryParams.orderByColumn = column.prop
        this.listProdictMary(this.queryParams)
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
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.listProdictMary()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.queryParams.toDayNumber = undefined
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.form = {
          id: undefined,
          indicators: undefined,
          planComplete: undefined,
          actualComplete: undefined
        }
        this.open = true
        this.reset()
        this.title = '添加年度生产汇总信息'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        get(id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改年度生产汇总信息'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.open = true
        if (this.form.id != undefined && this.form.id != '') {
          this.form.crateTime = undefined;
          this.form.whenYears = undefined;
          this.form.updateTime = undefined
          updateProdictMary(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess('修改成功')
              this.open = false
              this.listProdictMary()
            } else {
              this.msgError(response.msg)
            }
          })
        } else {
          addProdictMary(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess('新增成功')
              this.open = false
              this.listProdictMary()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids

        this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return deleteProdictMary(ids)
        }).then(() => {
          this.listProdictMary()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
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
            const multiHeader = [['年度生产汇总报表', '', '', '', '', '', '']];
            const tHeader = ['年月', '车间分组','指标(㎡)', '计划完成(㎡)', '实际完成(㎡)', '进度差量(㎡)', '进度完成率(%)']
            const filterVal = ['whenYearsMonth', 'workShop', 'indicators', 'planComplete', 'actualComplete', 'proPoor', 'completeRate']
            const list = this.prodictMaryList;
            if (list.length != 0) {
              for (let i = 0; i < list.length; i++) {
                var obj = list[i];
                if (null == obj.whenYearsMonth) {
                  obj.whenYearsMonth = '全年';
                } else if (obj.isYears == 2) {
                  obj.whenYearsMonth = obj.whenYearsMonth.substring(0, 7);
                }
                for (let j = 0; j < this.statusOptions.length; j++) {
                  if (obj.workShop == this.statusOptions[j].dictValue) {
                    obj.workShop = this.statusOptions[j].dictLabel;
                  }
                }
              }
            }
            const data = this.formatJson(filterVal, list)
            // 进行所有表头的单元格合并
            const merges = ['A1:G1'];

            const fileNameDate = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate() + '日';
            excel.export_json_to_excel({
              multiHeader, // 这里是第一行的表头
              // multiHeader2, // 这里是第二行的表头
              header: tHeader, // 这里是第三行的表头
              data,
              filename: '年度生产汇总报表' + fileNameDate,
              merges,
            });
            this.listProdictMary();
          });
        }).catch(function() {

        });
      }

    }
  }
</script>
