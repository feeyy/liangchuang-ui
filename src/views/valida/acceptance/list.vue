<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['valida:acceptance:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['valida:acceptance:update']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['valida:acceptance:delete']"
        >删除</el-button>
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

    <el-table v-loading="loading" :data="accList" @sort-change='sortChange'  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" prop="id" width="80"  sortable='custom'/>
      <el-table-column label="项目名称" prop="projectName" width="150" />
      <el-table-column label="总面积(㎡)" prop="sumArea" sortable='custom' :formatter="(r, c) => { return r.sumArea > 0 ? r.sumArea + ' ㎡': '-'}" width="120" />
      <el-table-column label="总件数(件)" prop="sumLetter" sortable='custom' width="120" />
      <el-table-column label="生产错误数" prop="prodErrorCount" sortable='custom' width="120" />
      <el-table-column label="生产错误率" prop="prodErrorRate" sortable='custom' :formatter="(r, c) => {return r.prodErrorRate > 0 ? r.prodErrorRate + ' %' : '-'}" width="120" />
      <el-table-column label="设计错误数" prop="designErrorCount" sortable='custom' width="120" />
      <el-table-column label="设计错误率" prop="designErrorRate" sortable='custom' :formatter="(r, c) => {return r.designErrorRate > 0 ? r.designErrorRate + ' %' : '-'}" width="120" />
      <el-table-column label="试装错误数" prop="pretendErrorCount" sortable='custom' width="120" />
      <el-table-column label="试装错误率" prop="pretendErrorRate" sortable='custom' :formatter="(r, c) => {return r.pretendErrorRate > 0 ? r.pretendErrorRate + ' %' : '-'}" width="120" />
      <el-table-column label="验收日期" prop="acceptanceTime" sortable='custom' width="100" />
      <el-table-column label="设计单位" prop="designUnit" width="120" />
      <el-table-column label="试拼装进度" prop="acceptanceProgress" width="120" />
      <el-table-column label="完成情况" prop="acceptanceStatus" width="100" />
      <el-table-column label="楼栋(栋)" prop="towerCount" width="100" />
      <el-table-column label="备注" prop="note" width="80" />
      <el-table-column label="操作" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['valida:acceptance:update']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['valida:acceptance:delete']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body center>
      <el-form ref="form" :inline="true" id="acce-form" :model="form" label-width="100px">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称"/>
        </el-form-item>
        <el-form-item label="总面积㎡" prop="sumArea">
          <el-input v-model="form.sumArea" placeholder="请输入总面积" oninput="value=value.replace(/[^0-9.]/g,'')" />
        </el-form-item>
        <el-form-item label="总件数" prop="sumLetter">
          <el-input v-model="form.sumLetter" placeholder="请输入总件数" oninput="value=value.replace(/[^0-9]/g,'')"/>
        </el-form-item>
        <el-form-item label="生产错误数" prop="prodErrorCount">
          <el-input v-model="form.prodErrorCount" placeholder="请输入生产错误数" oninput="value=value.replace(/[^0-9]/g,'')"/>
        </el-form-item>
        <el-form-item label="设计错误数" prop="designErrorCount">
          <el-input v-model="form.designErrorCount" placeholder="请输入设计错误数" oninput="value=value.replace(/[^0-9]/g,'')"/>
        </el-form-item>
        <el-form-item label="试装错误数" prop="pretendErrorCount">
          <el-input v-model="form.pretendErrorCount" placeholder="请输入试装错误数" oninput="value=value.replace(/[^0-9]/g,'')"/>
        </el-form-item>
        <el-form-item label="验收日期" prop="acceptanceTime">
          <el-date-picker
              v-model="form.acceptanceTime"
              type="date"
              placeholder="请选择验收日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        <el-form-item label="设计单位" prop="designUnit">
          <el-input v-model="form.designUnit" placeholder="请输入设计单位" />
        </el-form-item>
        <el-form-item label="试拼装进度" prop="acceptanceProgress">
          <el-input v-model="form.acceptanceProgress" placeholder="请输入试拼装进度" />
        </el-form-item>
        <el-form-item label="验收完成情况" prop="acceptanceStatus">
          <el-input v-model="form.acceptanceStatus" placeholder="请输入验收完成情况" />
        </el-form-item>
        <el-form-item label="楼栋数(栋)" prop="towerCount">
          <el-input v-model="form.towerCount" placeholder="请输入楼栋数(栋)" oninput="value=value.replace(/[^0-9]/g,'')"/>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="form.note" type="textarea" style="width: 300px;" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {listAcce, addAcce, updateAcce, deleteAcce, get } from '@/api/valida/acce'

  export default {
    name: "Acce",
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
        // 角色表格数据
        accList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          projectName: undefined,
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
      this.getList();
    },
    methods: {
      /** 试装验收列表 */
      getList() {
        this.loading = true;
        listAcce(this.queryParams).then(
          response => {
            this.accList = response.rows;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      //排序
      sortChange (column, prop, order){
        if (column.order != null) {
          this.queryParams.isAsc = 'desc';
        } else {
          this.queryParams.isAsc = 'asc';
        }
        this.queryParams.orderByColumn = column.prop
        this.getList(this.queryParams);
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
        this.getList();
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
      /** 新增按钮操作 */
      handleAdd() {
        this.form = {
          id: undefined,
          projectName: undefined,
          sumArea: undefined,
          sumLetter: undefined,
          prodErrorCount: undefined,
          designErrorCount: undefined,
          pretendErrorCount: undefined,
          acceptanceTime: undefined,
          designUnit:undefined,
          acceptanceProgress: undefined,
          acceptanceStatus: undefined,
          towerCount: undefined,
          note: undefined
        }
        this.open = true;
        this.reset();
        this.title = "添加试装验收信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        get(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改试装验收信息";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        if (this.form.id != undefined && this.form.id != '') {
          updateAcce(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        } else {
          addAcce(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;

        this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteAcce(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
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
            const multiHeader = [['试装验收详情', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']];
            const tHeader = ['序号', '项目名称','总面积(㎡)','总件数(件)','生产错误数','生产错误率','设计错误数','设计错误率','试装错误数','试装错误率','验收日期','设计单位','试拼装进度','完成情况','楼栋(栋)','备注'];
            const filterVal = ['id', 'projectName','sumArea', 'sumLetter','prodErrorCount','prodErrorRate','designErrorCount','designErrorRate','pretendErrorCount','pretendErrorRate','acceptanceTime','designUnit','acceptanceProgress','acceptanceStatus','towerCount','note']
            const list = this.accList;
            const data = this.formatJson(filterVal, list)
            // 进行所有表头的单元格合并
            const merges = ['A1:P1'];

            const fileNameDate = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate() + '日';
            excel.export_json_to_excel({
              multiHeader, // 这里是第一行的表头
              // multiHeader2, // 这里是第二行的表头
              header: tHeader, // 这里是第三行的表头
              data,
              filename: '验收详情报表' + fileNameDate,
              merges,
            });
          });
        }).catch(function() {

        });
      }

    }
  };
</script>
