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
          v-hasPermi="['eng:design:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['eng:design:update']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['eng:design:delete']"
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

    <el-table border v-loading="loading" :data="designList"  @sort-change='sortChange'  @selection-change="handleSelectionChange"  :span-method="arraySpanMethod">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" prop="desSort" width="80"  sortable='custom'/>
      <el-table-column label="客户名称" prop="lcProject.customerName" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="项目名称" prop="lcProject.projectName" :show-overflow-tooltip="true"  width="110" />
      <el-table-column label="楼号" prop="towerNumber" width="60"/>
      <el-table-column label="模板面积约(㎡)" prop="templateArea" sortable='custom' width="140" />
      <el-table-column label="首次接图时间" prop="firstPickMap" sortable='custom' width="130" />
      <el-table-column label="变更次数" prop="changeCount" sortable='custom' width="120" />
      <el-table-column label="变更说明" prop="changeNote" sortable='custom' width="120" />
      <el-table-column label="底图确认时间" prop="bottomMapTime" sortable='custom' width="130" />
      <!--<el-table-column label="配模计划开始时间" prop="withTemTime" sortable='custom' width="150" />-->
      <el-table-column label="设计计划开始时间" prop="planStartTime" sortable='custom' width="150" />
      <el-table-column label="设计计划结束时间" prop="planEndTime" sortable='custom' width="150" />
      <el-table-column label="设计实时开始时间" prop="planRealStartTime" sortable='custom' width="150" />
      <el-table-column label="设计实时结束时间" prop="planRealEndTime" sortable='custom' width="150" />
      <el-table-column label="情况W" prop="planStatusW" sortable='custom' width="90" :formatter="(r, c) => {return r.planStatusW == 0 ? '未完成' : '已完成'}"/>
      <el-table-column label="情况B" prop="planStatusB" sortable='custom' width="100" :formatter="(r, c) => {return r.planStatusB == 0 ? '未完成' : '已完成'}"/>
      <el-table-column label="情况D" prop="planStatusD" sortable='custom' width="100" :formatter="(r, c) => {return r.planStatusD == 0 ? '未完成' : '已完成'}"/>
      <el-table-column label="情况ST" prop="planStatusSt" sortable='custom' width="100" :formatter="(r, c) => {return r.planStatusSt == 0 ? '未完成' : '已完成'}"/>
      <el-table-column label="情况BL" prop="planStatusBl" sortable='custom' width="100" :formatter="(r, c) => {return r.planStatusBl == 0 ? '未完成' : '已完成'}"/>
      <el-table-column label="剩余时间(天)" prop="surplusDay" sortable='custom' width="120" />
      <el-table-column label="超期时间(天)" prop="superTime" sortable='custom' width="120" />
      <el-table-column label="完成率(%)" prop="completeReal" sortable='custom' width="120" />
      <el-table-column label="变换次数" prop="transformCount" sortable='custom' width="120" />
      <el-table-column label="变换下单" prop="transformOrder" sortable='custom' width="120" />
      <!--<el-table-column label="创建时间" prop="createTime" sortable='custom' width="180" :formatter="(r, c) => {return r.createTime != null ? r.createTime.replace('T', ' ') : '-'}"/>-->
      <!--<el-table-column label="创建人" prop="createName" sortable='custom' width="150" />-->
      <el-table-column label="" prop=""/>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eng:design:update']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eng:design:delete']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="queryDesign"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body center>
      <el-form ref="form" :inline="true" :model="form" label-width="140px">
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
        <el-form-item label="序号" prop="desSort" label-width="140px">
          <el-input v-model="form.desSort" placeholder="请输入序号(默认1)" style="width:180px;" oninput="value=value.replace(/[^0-9]/g,'')" />
        </el-form-item>
        <el-form-item label="楼号" prop="towerNumber" label-width="140px">
          <el-input v-model="form.towerNumber" placeholder="请输入楼号" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="模板面积约(㎡)" prop="templateArea" label-width="140px">
          <el-input v-model="form.templateArea" placeholder="请输入模板面积约" oninput="value=value.replace(/[^0-9.]/g,'')" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="首次接图时间" prop="firstPickMap" label-width="140px">
          <el-date-picker
            v-model="form.firstPickMap"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 180px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="变更次数" prop="changeCount" label-width="140px">
          <el-input v-model="form.changeCount" placeholder="请输入完成报量-止" oninput="value=value.replace(/[^0-9]/g,'')" style="width: 180px;"/>
        </el-form-item>
        <el-form-item label="变更说明" prop="changeNote" label-width="140px">
          <el-input v-model="form.changeNote" placeholder="请输入完成报量-止" style="width: 180px;"/>
        </el-form-item>
        <el-form-item label="底图确认时间" prop="bottomMapTime" label-width="140px">
          <el-date-picker
            v-model="form.bottomMapTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 180px;">
          </el-date-picker>
        </el-form-item>
        <!--<el-form-item label="配模计划开始时间" prop="withTemTime" label-width="140px">-->
          <!--<el-date-picker-->
            <!--v-model="form.withTemTime"-->
            <!--type="date"-->
            <!--placeholder="选择日期"-->
            <!--format="yyyy 年 MM 月 dd 日"-->
            <!--value-format="yyyy-MM-dd"-->
            <!--style="width: 200px;">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <el-form-item label="设计计划开始时间" prop="planStartTime" label-width="140px">
          <el-date-picker
            v-model="form.planStartTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 180px;">
          </el-date-picker>
        </el-form-item>
        <!--<el-form-item label="设计计划结束时间" prop="planEndTime" label-width="140px">-->
          <!--<el-date-picker-->
            <!--v-model="form.planEndTime"-->
            <!--type="date"-->
            <!--placeholder="选择日期"-->
            <!--format="yyyy 年 MM 月 dd 日"-->
            <!--value-format="yyyy-MM-dd"-->
            <!--style="width: 200px;">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <el-form-item label="设计实时开始时间" prop="planRealStartTime" label-width="140px">
          <el-date-picker
            v-model="form.planRealStartTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 180px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="设计实时结束时间" prop="planRealEndTime" label-width="140px">
          <el-date-picker
            v-model="form.planRealEndTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 180px;">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="完成情况W" prop="planStatusW" label-width="140px">
          <el-select v-model="form.planStatusW" placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in isCom"
              :key="item.comSatus"
              :label="item.name"
              :value="item.comSatus">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成情况B" prop="planStatusB" label-width="140px">
          <el-select v-model="form.planStatusB" placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in isCom"
              :key="item.comSatus"
              :label="item.name"
              :value="item.comSatus">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成情况D" prop="planStatusD" label-width="140px">
          <el-select v-model="form.planStatusD" placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in isCom"
              :key="item.comSatus"
              :label="item.name"
              :value="item.comSatus">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成情况ST" prop="planStatusSt" label-width="140px">
          <el-select v-model="form.planStatusSt" placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in isCom"
              :key="item.comSatus"
              :label="item.name"
              :value="item.comSatus">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成情况BL" prop="planStatusBl" label-width="140px">
          <el-select v-model="form.planStatusBl" placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in isCom"
              :key="item.comSatus"
              :label="item.name"
              :value="item.comSatus">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变换次数" prop="transformCount" label-width="140px">
          <el-input v-model="form.transformCount" placeholder="请输入变换次数" oninput="value=value.replace(/[^0-9]/g,'')" style="width: 180px;"/>
        </el-form-item>
        <el-form-item label="变换下单" prop="transformOrder" label-width="140px">
          <el-input v-model="form.transformOrder" placeholder="请输入变换下单" oninput="value=value.replace(/[^0-9]/g,'')" style="width:180px;"/>
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

  // (项目) 设计工作
  import {queryDesign, get, add, update, remove, getProjects} from '@/api/eng/design'

  import {getEngTime} from '@/api/time';

  export default {
    name: "Business",
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
        // 设计工作集合
        designList: [],
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
        }
      };
    },
    created() {
      this.getEngTimes();
      this.queryDesign();

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
      /** (项目)设计工作列表 */
      queryDesign() {
        this.loading = true;
        setTimeout(()=>{
          queryDesign(this.queryParams).then(
            response => {
              this.designList = response.rows;
              this.total = response.total;
              this.loading = false;
              this.merage ();
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
        this.queryDesign(this.queryParams);
      },

      //表格合并
      arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 2|| columnIndex === 3) {
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
        for (let i = 0; i < this.designList.length; i++) {
          if (i === 0) {
            this.idArr.push(1)
            this.idPos = 0
          } else {
            if (this.designList[i].lcProject.projectName === this.designList[i - 1].lcProject.projectName) {
              this.idArr[this.idPos] += 1
              this.idArr.push(0)
            } else {
              this.idArr.push(1)
              this.idPos = i
            }
          }
        }
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
        this.queryDesign();
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
        this.title = "添加设计工作信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        get(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改设计工作信息";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        if (this.form.id != undefined && this.form.id != '') {
          // this.form.createTime = undefined;
          update(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.open = false;
              this.queryDesign();
            } else {
              this.msgError(response.msg);
            }
          });
        } else {
          add(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.open = false;
              this.queryDesign();
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
          return remove(ids);
        }).then(() => {
          this.queryDesign();
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
            const multiHeader = [['(项目)设计工作报表', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']];
            const tHeader = ['序号', '项目名称', '楼号', '模板面积约(㎡)', '首次接图时间', '变更次数',
              '变更说明', '地图确认时间', '配模计划开始时间', '设计计划开始时间', '设计计划结束时间',
              '设计实时开始时间', '设计实时结束时间', '完成情况W', '完成情况B', '完成情况D', '完成情况ST', '完成情况BL',
              '剩余天数(天)', '超期时间(天)', '完成率(%)', '变换次数', '变换下单']
            const filterVal = ['desSort', 'projectId', 'towerNumber', 'templateArea', 'firstPickMap', 'changeCount',
              'changeNote', 'bottomMapTime', 'withTemTime', 'planStartTime', 'planEndTime',
              'planRealStartTime', 'planRealEndTime', 'planStatusW', 'planStatusB', 'planStatusD', 'planStatusSt', 'planStatusBl',
              'surplusDay', 'superTime', 'completeReal', 'transformCount', 'transformOrder']
            const list = this.designList;
            if (list.length != 0) {
              for (let i = 0; i < list.length; i++) {
                var obj = list[i];
                obj.projectId = obj.lcProject.projectName;
                if (obj.createTime != null) {
                  obj.createTime = obj.createTime.replace('T', ' ');
                }
              }
            }
            const data = this.formatJson(filterVal, list)
            // 进行所有表头的单元格合并
            const merges = ['A1:W1'];

            const fileNameDate = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate() + '日';
            excel.export_json_to_excel({
              multiHeader, // 这里是第一行的表头
              // multiHeader2, // 这里是第二行的表头
              header: tHeader, // 这里是第三行的表头
              data,
              filename: '(项目)设计工作报表' + fileNameDate,
              merges,
            });
            this.queryDesign();
          });
        }).catch(function() {

        });
      }

    }
  };
</script>
