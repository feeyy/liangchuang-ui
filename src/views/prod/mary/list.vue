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
          <!--v-hasPermi="['valida:acceptance:add']"-->
        <!--&gt;新增-->
        <!--</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="success"-->
          <!--icon="el-icon-edit"-->
          <!--size="mini"-->
          <!--:disabled="single"-->
          <!--@click="handleUpdate"-->
          <!--v-hasPermi="['valida:acceptance:update']"-->
        <!--&gt;修改-->
        <!--</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="danger"-->
          <!--icon="el-icon-delete"-->
          <!--size="mini"-->
          <!--:disabled="multiple"-->
          <!--@click="handleDelete"-->
          <!--v-hasPermi="['valida:acceptance:delete']"-->
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
            @click="updateMary"
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
            @click="redirectView('#/prod/effect')"
          >工作计划表</el-button>
        </el-tooltip>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="prodTaskMaryList" @sort-change='sortChange'
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" prop="id" sortable='custom' width="80"/>
      <el-table-column label="部门" prop="dept.deptName" sortable='custom' width="110"/>
      <el-table-column label="负责人" prop="principalName"/>
      <el-table-column label="计划总量(条)" prop="planCount" sortable='custom' width="120"/>
      <el-table-column label="按时完成(条)" prop="timingComplete" sortable='custom' width="120"/>
      <el-table-column label="未完成(条)" prop="noComplete" sortable='custom' width="120"/>
      <el-table-column label="延后完成(条)" prop="delayComplete" sortable='custom' width="120"/>
      <el-table-column label="延期累计天" prop="delaySumDay" sortable='custom' width="120"/>
      <el-table-column label="到节点完成率(%)" prop="completeRate" sortable='custom' width="150"/>
      <!--<el-table-column label="创建人" prop="createName"/>-->
      <!--<el-table-column label="创建时间" prop="createTime" sortable='custom' width="140"-->
                       <!--:formatter="(r, c) => {return r.createTime != null ? r.createTime.replace('T', ' ') : '-'}"/>-->
      <!--<el-table-column label="更新时间" prop="updateTime" sortable='custom' width="140"-->
                       <!--:formatter="(r, c) => {return r.updateTime != null ? r.updateTime.replace('T', ' ') : '-'}"/>-->
      <!--<el-table-column label="操作" class-name="small-padding fixed-width" width="120">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-edit"-->
            <!--@click="handleUpdate(scope.row)"-->
            <!--v-hasPermi="['report:details:update']"-->
          <!--&gt;修改-->
          <!--</el-button>-->
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['valida:acceptance:delete']"-->
          <!--&gt;删除-->
          <!--</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="listProdMary"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px" append-to-body center>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="部门" prop="deptId">
          <el-select v-model="form.deptId" placeholder="部门">
            <el-option
              v-for="(item, index) in deptList"
              :key="deptList[index].id"
              :label="deptList[index].label"
              :value="deptList[index].id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="负责人" prop="principalName">
          <el-input v-model="form.principalName" placeholder="负责人"/>
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

  // 年度计划汇总
  import {
    listProdMary,
    get,
    addProdMary,
    updateProdMary,
    deleteProdMary,
    getYears,
    updateMary
  } from '@/api/prod/mary.js'

  import { roleDeptTreeselect } from '@/api/system/dept'

  // require('file-saver')
  // require('@/utils/blob')
  // require('xlsx')

  export default {
    name: 'prod-task-mary',
    data() {
      return {
        // 遮罩层
        loading: true,
        // 查询的年
        years: [],
        // 年度计划汇总data
        prodTaskMaryList: [],
        // 部门树
        deptList: [],
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
          pageSize: 20,
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
      /** 获取年度计划汇总有哪些年份 */
      this.getYears()
      /** 查询年度计划汇总列表 */
      this.listProdMary()
      /** 根据角色ID查询部门树结构 */
      this.getDepts()
    },
    methods: {
      /** 获取年度计划汇总有哪些年份 */
      getYears() {
        getYears().then(response => {
          this.years = response.data
          this.queryParams.whenYears = new Date().getFullYear()
        })
      },
      /** 根据角色ID查询部门树结构 */
      getDepts() {
        roleDeptTreeselect(0).then(response => {
          this.deptList = response.depts[0].children[0].children
        })
      },
      /** 查询年度计划汇总列表 */
      listProdMary() {
        this.loading = true
        setTimeout(()=>{
          listProdMary(this.queryParams).then(response => {
            this.prodTaskMaryList = response.rows
            this.total = response.total
            this.loading = false
          })
        },500)
      },
      //排序
      sortChange(column, prop, order) {
        if (column.order != null) {
          this.queryParams.isAsc = 'desc'
        } else {
          this.queryParams.isAsc = 'asc'
        }
        this.queryParams.orderByColumn = column.prop
        this.listProdMary(this.queryParams)
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
        this.listProdMary()
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
          deptId: undefined,
          principalName: undefined
        }
        this.open = true
        this.reset()
        this.title = '添加年度计划汇总信息'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        get(id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改年度计划汇总信息'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.open = true
        if (this.form.id != undefined && this.form.id != '') {
          this.form.createTime = undefined
          this.form.updateTime = undefined
          this.form.whenYears = undefined
          updateProdMary(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess('修改成功')
              this.open = false
              this.listProdMary()
            } else {
              this.msgError(response.msg)
            }
          })
        } else {
          addProdMary(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess('新增成功')
              this.open = false
              this.listProdMary()
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
          return deleteProdMary(ids)
        }).then(() => {
          this.listProdMary()
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
        this.$confirm('您确定要导出当页数据吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          import('../../../utils/Export2Excel').then((excel) => {
            const multiHeader = [['年度计划汇总报表', '', '', '', '', '', '', '', '', '']];
            const tHeader = ['序号', '部门', '负责人', '计划总量(条)', '按时完成(条)', '未完成(条)',
              '延后完成(条)', '延期累计(天)', '到节点完成率(%)', '更新时间']
            const filterVal = ['id', 'deptId', 'principalName', 'planCount', 'timingComplete', 'noComplete', 'delayComplete', 'delaySumDay', 'completeRate', 'updateTime']
            const list = this.prodTaskMaryList
            if (null != list && list.length != 0) {
              for (let i = 0; i < list.length; i++) {
                let obj = list[i];
                obj.deptId = obj.dept.deptName;
              }
            }
            const data = this.formatJson(filterVal, list)
            // 进行所有表头的单元格合并
            const merges = ['A1:J1'];

            const fileNameDate = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate() + '日';
            excel.export_json_to_excel({
              multiHeader, // 这里是第一行的表头
              // multiHeader2, // 这里是第二行的表头
              header: tHeader, // 这里是第三行的表头
              data,
              filename: '年度计划汇总报表' + fileNameDate,
              merges,
            });
          });
        }).catch(function() {

        })
      },
      /** 手动更新数据 */
      updateMary() {
        this.loading = true
        updateMary().then(response => {
            this.loading = false;
            this.handleQuery();
        });
      }

    }
  }
</script>
