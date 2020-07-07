<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="年" prop="timeId">
        <el-select v-model="queryParams.timeId" placeholder="请选择">
          <el-option
            v-for="item in times"
            :key="item.id"
            :label="item.engYears"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="项目" prop="projectId">
        <el-select v-model="queryParams.projectId" placeholder="选择项目">
          <el-option
            v-for="item in projects"
            :key="item.id"
            :label="item.projectName"
            :value="item.id">
            <span style="float: left">{{ item.projectName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.customerName }}</span>
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['eng:progress:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['eng:progress:update']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['eng:progress:delete']"
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

    <el-table v-loading="loading" :data="progressList" @sort-change='sortChange'  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" prop="proSort" width="80"  sortable='custom'/>
      <el-table-column label="客户名称" prop="lcProject.customerName" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="项目名称" prop="lcProject.projectName" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="楼号" prop="towerNumber" width="60"/>
      <el-table-column label="面积(㎡)" prop="templateArea" sortable='custom' width="110" />
      <el-table-column label="合同租期(天)" prop="leaseContract" sortable='custom' width="130" />
      <el-table-column label="租期开始" prop="contractStartTime" sortable='custom' width="100" />
      <el-table-column label="租期结束" prop="contractEndTime" sortable='custom' width="100" />
      <el-table-column label="铝模始层(F)" prop="temStartLayer" sortable='custom' width="120" />
      <el-table-column label="铝模终层(F)" prop="temEndLayer" sortable='custom' width="120" />
      <el-table-column label="计划进度" prop="palnProgress" sortable='custom' width="100" />
      <el-table-column label="实时进度" prop="currentCompleteLayer" sortable='custom' width="100" />
      <el-table-column label="完成率(%)" prop="completeRate" sortable='custom' width="110" />
      <el-table-column label="超期时间(天)" prop="superDay" sortable='custom' width="120" />
      <el-table-column label="" prop=""/>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="updatePro(scope.row)"
            v-hasPermi="['eng:progress:update:pro']"
          >更新进度</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eng:progress:update']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eng:progress:delete']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="queryProgress"
    />

    <!-- 更新进度 -->
    <el-drawer title="当前进度" :visible.sync="pro_open" :with-header="false">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="24">
          <div role="button" id="el-collapse-head-1381" tabindex="0" class="el-collapse-item__header">&nbsp;&nbsp;&nbsp;&nbsp;当前进度详情<i class="el-collapse-item__arrow el-icon-arrow-right"></i></div>
        </el-col>
      </el-row>
      <div v-for="(item,index) in proList" :key="index">
        <button type="button" class="el-button el-button--success is-circle pro-c" @click="updateCurrent(item.id, item.currentCompleteLayer)" size="mini" v-if="item.isOver">{{item.currentCompleteLayer}}层</button>
        <button type="button" class="el-button el-button--info is-circle pro-c" @click="updateCurrent(item.id, item.currentCompleteLayer)" size="mini" v-else-if="item.isOver == false">{{item.currentCompleteLayer}}层</button>
      </div>
    </el-drawer>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body center>
      <el-form ref="form" :inline="true" :model="form" label-width="120px">
        <el-form-item label="项目" prop="projectId">
          <el-select v-model="form.projectId" placeholder="选择项目" style="width:180px;">
            <el-option
              v-for="item in projects"
              :key="item.id"
              :label="item.projectName"
              :value="item.id">
              <span style="float: left">{{ item.projectName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">客户: {{ item.customerName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序号" prop="proSort" label-width="120px">
          <el-input v-model="form.proSort" placeholder="请输入序号(默认1)" style="width:180px;" oninput="value=value.replace(/[^0-9]/g,'')" />
        </el-form-item>
        <el-form-item label="楼号" prop="towerNumber" label-width="120px">
          <el-input v-model="form.towerNumber" placeholder="请输入楼号" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="面积(㎡)" prop="templateArea" label-width="120px">
          <el-input v-model="form.templateArea" placeholder="请输入面积(㎡)" oninput="value=value.replace(/[^0-9.]/g,'')" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="合同租期(天)" prop="leaseContract" label-width="120px">
          <el-input v-model="form.leaseContract" placeholder="请输入合同租期(天)" oninput="value=value.replace(/[^0-9]/g,'')" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="租期开始" prop="contractStartTime" label-width="120px">
          <el-date-picker
            v-model="form.contractStartTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 180px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="铝模始层(F)" prop="temStartLayer" label-width="120px">
          <el-input v-model="form.temStartLayer" placeholder="请输入铝模始层" oninput="value=value.replace(/[^0-9]/g,'')" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="铝模终层(F)" prop="temEndLayer" label-width="120px">
          <el-input v-model="form.temEndLayer" placeholder="请输入铝模终层" oninput="value=value.replace(/[^0-9]/g,'')" style="width:180px;"/>
        </el-form-item>
        <!--<el-form-item label="计划进度" prop="palnProgress" label-width="120px">-->
          <!--<el-input v-model="form.palnProgress" placeholder="请输入计划进度" oninput="value=value.replace(/[^0-9]/g,'')" style="width:180px;"/>-->
        <!--</el-form-item>-->
        <el-form-item label="实时进度" prop="currentCompleteLayer" label-width="120px">
          <el-input v-model="form.currentCompleteLayer" placeholder="请输入实时进度" oninput="value=value.replace(/[^0-9]/g,'')" style="width:180px;"/>
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

  // (项目) 工程进展
  import {queryProgress, get, add, update, remove, getProjects, updateCurrent} from '@/api/eng/progress'

  import {getEngTime} from '@/api/time';

  export default {
    name: "Progress",
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
        // 工程进展集合
        progressList: [],
        // 时间数组
        times: [],
        // 项目列表集合
        projects: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 进度对话框
        pro_open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          projectId: undefined,
          timeId: undefined,
          isAsc: undefined,
          orderByColumn: undefined
        },
        // 表单参数
        form: {},
        // 是否完成
        isCom: [{comSatus: 0, name: '未完成'}, {comSatus: 1, name: '已完成'}],
        defaultProps: {
          children: "children",
          label: "label"
        },
        //
        temStartLayer: undefined,
        temEndLayer: undefined,
        proList: [],
      };
    },
    created() {
      this.getEngTimes();
      this.queryProgress();
    },
    methods: {
      /** 获取项目的时间列表*/
      getEngTimes() {
        getEngTime().then( response => {
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
      /** (项目)工程进展列表 */
      queryProgress() {
        this.loading = true;
        setTimeout(()=>{
          queryProgress(this.queryParams).then(
            response => {
              this.progressList = response.rows;
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
        this.queryProgress(this.queryParams);
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
        this.queryProgress();
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
        this.getProjects();
        this.title = "添加工程进展信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        get(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改工程进展信息";
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
              this.queryProgress();
            } else {
              this.msgError(response.msg);
            }
          });
        } else {
          add(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.open = false;
              this.queryProgress();
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
          this.queryProgress();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      /** 更新进度 */
      updatePro(row) {
        this.pro_open = true;
        this.temStartLayer = row.temStartLayer;
        this.temEndLayer = row.temEndLayer;
        var id = row.id;
        var currentCompleteLayer = (row.currentCompleteLayer == null ? 0 : row.currentCompleteLayer);
        var lou = {}; var louArr = [];
        for (let i = 0; i < this.temEndLayer - this.temStartLayer + 1; i++) {
            lou = {
              id: id,
              currentCompleteLayer: this.temStartLayer + i,
              isOver: (currentCompleteLayer >= (this.temStartLayer + i) ? true : false)
            }
          louArr[i] = lou;
        }
        this.proList = louArr;
      },
      // 保存进度
      updateCurrent(id, currentCompleteLayer) {
        updateCurrent(id, currentCompleteLayer).then(response => {
          if (response.code === 200) {
            this.msgSuccess("更新成功");
            this.pro_open = false;
            this.queryProgress();
          } else {
            this.msgError(response.msg);
          }
        });
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
            const multiHeader = [['(项目)工程进展报表', '', '', '', '', '', '', '', '', '', '', '', '']];
            const tHeader = ['序号', '项目名称', '楼号', '面积(㎡)', '合同租期(天)',
              '租期开始', '租期结束', '铝模始层(F)', '铝模终层(F)', '计划进度', '实时进度', '完成率(%)', '超期时间(天)']
            const filterVal = ['proSort', 'projectId', 'towerNumber', 'templateArea', 'leaseContract',
              'contractStartTime', 'contractEndTime', 'temStartLayer', 'temEndLayer', 'palnProgress',
              'currentCompleteLayer', 'completeRate', 'superDay']
            const list = this.progressList;
            if (list.length != 0) {
              for (let i = 0; i < list.length; i++) {
                var obj = list[i];
                obj.projectId = obj.lcProject.projectName;
              }
            }
            const data = this.formatJson(filterVal, list)
            // 进行所有表头的单元格合并
            const merges = ['A1:M1'];

            const fileNameDate = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate() + '日';
            excel.export_json_to_excel({
              multiHeader, // 这里是第一行的表头
              // multiHeader2, // 这里是第二行的表头
              header: tHeader, // 这里是第三行的表头
              data,
              filename: '(项目)工程进展报表' + fileNameDate,
              merges,
            });
            this.queryProgress();
          });
        }).catch(function() {

        });
      }

    }
  };
</script>
<style>
  .pro-c{
    float: left;
    margin-left: 25px;
    margin-top: 10px;
    width: 50px;

  }
  .el-drawer.rtl{
    overflow: scroll;
  }

</style>
