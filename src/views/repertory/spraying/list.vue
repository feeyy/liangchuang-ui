<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="型材" prop="artName">
        <el-input
          v-model="queryParams.artName"
          placeholder="请输入型材"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="queryParams.startTime"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="queryParams.endTime"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
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
          v-hasPermi="['repertory:spraying:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['repertory:spraying:update']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['repertory:spraying:remove']"
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

    <el-table v-loading="loading" :data="sprayingList" @sort-change='sortChange' @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="序号" prop="id" width="80" sortable='custom'/>-->
      <el-table-column label="型材" prop="artName" width="140" sortable='custom'/>
      <el-table-column label="单件面积" prop="singArea" width="110" sortable='custom'/>
      <el-table-column label="期初库存件数" prop="earlyRepertoryNumber" width="130" sortable='custom'/>
      <el-table-column label="期初库存面积" prop="earlyRepertoryArea" width="130" sortable='custom'/>
      <el-table-column label="本期入库件数" prop="thisInRepertoryNumber" width="130" sortable='custom'>
        <template slot-scope="scope">
          <span v-if="scope.row.thisInRepertoryNumber != null" style="color: red;">{{scope.row.thisInRepertoryNumber}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="本期入库面积" prop="thisInRepertoryArea" width="130" sortable='custom'/>
      <el-table-column label="本期出库件数" prop="thisOutRepertoryNumber" width="130" sortable='custom'/>
      <el-table-column label="本期出库面积" prop="thisOutRepertoryArea" width="130" sortable='custom'/>
      <el-table-column label="期末库存件数" prop="endRepertoryNumber" width="130" sortable='custom'/>
      <el-table-column label="期末库存面积" prop="endRepertoryArea" width="130" sortable='custom'/>
      <el-table-column label="" prop=""/>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="140">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['repertory:spraying:update']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['repertory:spraying:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="list"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px" append-to-body center>
      <el-form ref="form" :model="form" label-width="130px">
        <el-form-item label="型材" prop="artName" label-width="130px">
          <el-input v-model="form.artName" placeholder="请输入型材" />
        </el-form-item>
        <el-form-item label="单件面积" prop="singArea" label-width="130px">
          <el-input v-model="form.singArea" placeholder="请输入单件面积" oninput="value=value.replace(/[^0-9.]/g,'')" />
        </el-form-item>
        <el-form-item label="期初库存件数" prop="earlyRepertoryNumber" label-width="130px">
          <el-input v-model="form.earlyRepertoryNumber" placeholder="请输入期初库存件数" oninput="value=value.replace(/[^0-9]/g,'')" />
        </el-form-item>
        <el-form-item label="期初库存面积" prop="earlyRepertoryArea" label-width="130px">
          <el-input v-model="form.earlyRepertoryArea" placeholder="请输入期初库存面积" oninput="value=value.replace(/[^0-9.]/g,'')" />
        </el-form-item>
        <el-form-item label="本期入库件数" prop="thisInRepertoryNumber" label-width="130px">
          <el-input v-model="form.thisInRepertoryNumber" placeholder="请输入本期入库件数" oninput="value=value.replace(/[^0-9]/g,'')" />
        </el-form-item>
        <el-form-item label="本期入库面积" prop="thisInRepertoryArea" label-width="130px">
          <el-input v-model="form.thisInRepertoryArea" placeholder="请输入本期入库面积" oninput="value=value.replace(/[^0-9.]/g,'')" />
        </el-form-item>
        <el-form-item label="本期出库件数" prop="thisOutRepertoryNumber" label-width="130px">
          <el-input v-model="form.thisOutRepertoryNumber" placeholder="请输入本期出库件数" oninput="value=value.replace(/[^0-9]/g,'')" />
        </el-form-item>
        <el-form-item label="本期出库面积" prop="thisOutRepertoryArea" label-width="130px">
          <el-input v-model="form.thisOutRepertoryArea" placeholder="请输入本期出库面积" oninput="value=value.replace(/[^0-9.]/g,'')" />
        </el-form-item>
        <el-form-item label="期末库存件数" prop="endRepertoryNumber" label-width="130px">
          <el-input v-model="form.endRepertoryNumber" placeholder="请输入期末库存件数" oninput="value=value.replace(/[^0-9]/g,'')" />
        </el-form-item>
        <el-form-item label="期末库存面积" prop="endRepertoryArea" label-width="130px">
          <el-input v-model="form.endRepertoryArea" placeholder="请输入期末库存面积" oninput="value=value.replace(/[^0-9.]/g,'')" />
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

  // 喷涂板进销存
  import {list, get, add, update, remove} from '@/api/repertory/spraying'

  export default {
    name: "Spraying",
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
        // 喷涂板进销存集合
        sprayingList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          startTime: undefined,
          endTime: undefined,
          artName: undefined,
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
      this.list();
    },
    methods: {
      /** 喷涂板进销存列表 */
      list() {
        this.loading = true;
        list(this.queryParams).then(
          response => {
            this.sprayingList = response.rows;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
          } else if (index >= 3 && index <= 11) {
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return Math.floor((prev + curr) * 100) / 100;
                } else {
                  return Math.floor(prev * 100) / 100;
                }
              }, 0)
            } else {
              sums[index] = 'N/A'
            }
          } else {
            // sums[index] = '--'
            sums[index] = ''
          }
        })
        return sums
      },
      //排序
      sortChange (column, prop, order){
        if (column.order != null) {
          this.queryParams.isAsc = 'desc';
        } else {
          this.queryParams.isAsc = 'asc';
        }
        this.queryParams.orderByColumn = column.prop
        this.list(this.queryParams);
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
        this.list();
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

        }
        this.open = true;
        this.reset();
        this.title = "添加喷涂板进销存信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        get(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改喷涂板进销存信息";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        if (this.form.id != undefined && this.form.id != '') {
          this.form.createTime = undefined;
          update(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.open = false;
              this.list();
            } else {
              this.msgError(response.msg);
            }
          });
        } else {
          add(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.open = false;
              this.list();
            } else {
              this.loading = false;
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
          return remove(ids);
        }).then(() => {
          this.list();
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
            const multiHeader = [['喷涂板进销存报表', '', '', '', '', '', '', '', '', '', '']];
            const tHeader = [
              '序号', '型材', '单件面积', '期初库存件数', '期初库存面积',
              '本期入库件数', '本期入库面积', '本期出库件数', '本期出库面积', '期末库存件数', '期末库存面积']
            const filterVal = [
              'id', 'artName', 'singArea', 'earlyRepertoryNumber', 'earlyRepertoryArea',
              'thisInRepertoryNumber', 'thisInRepertoryArea', 'thisOutRepertoryNumber', 'thisOutRepertoryArea',
              'endRepertoryNumber', 'endRepertoryArea']
            const list = this.sprayingList;
            const data = this.formatJson(filterVal, list)
            // 进行所有表头的单元格合并
            const merges = ['A1:J1'];

            const fileNameDate = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate() + '日';
            excel.export_json_to_excel({
              multiHeader, // 这里是第一行的表头
              // multiHeader2, // 这里是第二行的表头
              header: tHeader, // 这里是第三行的表头
              data,
              filename: '喷涂板进销存报表' + fileNameDate,
              merges,
            });
          });
        }).catch(function() {

        });
      }

    }
  };
</script>
