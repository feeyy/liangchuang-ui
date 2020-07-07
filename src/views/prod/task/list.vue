<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="部门" prop="deptId" v-if="dept_select == true">
        <el-select v-model="queryParams.deptId" placeholder="部门">
          <el-option
            v-for="roles in roleList"
            :key="roles.id"
            :label="roles.label"
            :value="roles.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间" prop="startTime">
        <el-select v-model="queryParams.startTime" placeholder="时间日期">
          <el-option
            v-for="da in dateRange"
            :key="da.id"
            :label="da.time"
            :value="da.id">
          </el-option>

        </el-select>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-select v-model="queryParams.endTime" placeholder="时间日期">
          <el-option
            v-for="das in datetimes"
            :key="das.id"
            :label="das.time"
            :value="das.id">
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
          v-hasPermi="['prod:task:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['prod:task:update']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['prod:task:delete']"
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

    <el-table v-loading="loading" :data="taskList" @sort-change='sortChange' @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="月度" align="center" prop="lcTime.time" width="80" sortable='custom'/>
      <el-table-column label="序号" align="center" prop="taskSort" width="80" sortable='custom'/>
      <el-table-column label="部门" align="center" prop="deptId" :show-overflow-tooltip="true" width="80" />
      <el-table-column label="工作项" align="center" prop="workItem" :show-overflow-tooltip="true"/>
      <el-table-column label="计划开始时间" align="center" prop="planStartTime" width="140" sortable='custom'/>
      <el-table-column label="计划结束时间" align="center" prop="planEndTime" width="140" sortable='custom'/>
      <el-table-column label="计划用时(天)" align="center" prop="planDays" width="140" sortable='custom'/>
      <el-table-column label="完成时间" align="center"  prop="completeTime" width="100" sortable='custom'/>
      <el-table-column label="剩余(天)" align="center" prop="surplusDay" width="100" sortable='custom' :formatter="(r, c) => {return r.surplusDay == 0 ? '-' : r.surplusDay}"/>
      <el-table-column label="完成状态" align="center" prop="completeStatus" width="100" />
      <el-table-column label="延后(天)" align="center" prop="delayCount" width="100" sortable='custom'/>
      <!--<el-table-column label="创建时间" align="center" prop="createTime" width="140" sortable='custom' :formatter="(r, c) => { return r.createTime != null ? r.createTime.replace('T', ' ') : '-'}"/>-->
      <!--<el-table-column label="创建人" align="center" prop="createName" width="100" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-edit"-->
            <!--v-if="scope.row.completeStatus=='未完成'"-->
            <!--@click="handleUpdate(scope.row)"-->
            <!--v-hasPermi="['prod:task:update']"-->
          <!--&gt;去完成</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="scope.row.completeStatus=='未完成'"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['prod:task:update']"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['prod:task:delete']"
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

    <!-- 添加或修改实施任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body center>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="时间日期" prop="timeId" v-if="iscom==false">
          <el-select v-model="form.timeId" placeholder="时间日期">
            <el-option
              v-for="da in dateRange"
              :key="da.id"
              :label="da.time"
              :value="da.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门" prop="deptId"  v-if="iscom==false && dept_select == true">
          <el-select v-model="form.deptId" placeholder="部门">
            <el-option
              v-for="roles in roleList"
              :key="roles.id"
              :label="roles.label"
              :value="roles.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="序号" prop="taskSort" label-width="100px">
          <el-input v-model="form.taskSort" placeholder="请输入序号" oninput="value=value.replace(/[^0-9]/g,'')" style="width:180px;"/>
        </el-form-item>

        <el-form-item label="工作项" >
          <el-input v-model="form.workItem"  type="textarea"
                    :rows="3" placeholder="请输入工作项"></el-input>
        </el-form-item>
        <el-form-item label="计划开始时间" prop="planStartTime" >
          <el-date-picker
            v-model="form.planStartTime"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划结束时间" prop="planEndTime">
          <el-date-picker
            v-model="form.planEndTime"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="完成时间" prop="completeTime" >
          <el-date-picker
            v-model="form.completeTime"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
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

  import {  roleDeptTreeselect } from "@/api/system/dept";
  import {getTasklist,getTasklistdan,getroleDeptTreeselect,addTask,updateTask,delTask,getdept} from '@/api/prod/task'
  import {getTime} from "@/api/time";
  import {  isAdmin } from "@/api/common";

  export default {
    name: "task",
    data() {
      return {
        timecre:false,
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 部门下拉框
        dept_select: false,
        // 部门ID
        deptId: undefined,
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 实施任务表格数据
        taskList: [],
        //部门数据树
        roleList:[],
        //部门名称表格数据
        rolenameList:[],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 是否显示弹出层（数据权限）
        openDataScope: false,
        // 日期范围
        dateRange: [],
        //开始时间与结束时间范围
        datetimes:[],
        //是否完成
        comTime:null,
        iscom:false,
        // 查询参数
        queryParams: {
          id:null,
          deptId: null,
          startTime: null,
          endTime: null,
          timeId:null,
          pageNum:1,
          pageSize:10,
          isAsc: undefined,
          orderByColumn: undefined
        },
        // 表单参数
        form: {},
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 表单校验
      };
    },
    created() {
      this.isAdmin();
      this.getTime();
      this.getList();
      this.getroleList(0);
    },
    methods: {
      isAdmin() {
        isAdmin().then(response => {
          if (response.data.isAdmin == true) {
            this.dept_select = true;
          } else {
            this.deptId = response.data.deptId;
          }
        })
      },
      getTime() {
        getTime().then(res=>{
          this.dateRange = res.data;
          this.datetimes = res.data;
        })
      },
      /** 查询部门列表 */
      getroleList(){
        /** 根据角色ID查询部门树结构 */
        roleDeptTreeselect(100).then(response => {
            this.roleList = response.depts[0].children[0].children;
        });
      },
      /** 查询实施任务列表 */
      getList() {
        this.loading = true;
        getTasklist(this.queryParams).then(
          response => {
            this.taskList = response.rows;
            for (let i = 0; i <response.rows.length ; i++) {
              /**this.taskList[i].completeTime=parseTime(response.rows[i].completeTime);*/
              getdept(response.rows[i].deptId).then(ress=>{
                this.taskList[i].deptId=ress.data.deptName;
                })
              switch (response.rows[i].completeStatus) {
                case 1:
                  this.taskList[i].completeStatus="已按时完成";
                  break;
                case 2:
                  this.taskList[i].completeStatus="未完成";
                  break;
                case 3:
                  this.taskList[i].completeStatus="延后完成";
                  break;
              }
            }
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
        this.getList();
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 取消按钮（数据权限）
      cancelDataScope() {
        this.openDataScope = false;
        this.reset();
      },
      // 表单重置
      reset() {
        if (this.$refs.menu != undefined) {
          this.$refs.menu.setCheckedKeys([]);
        }
        this.form = {
          completeTime: '',
          timeId:null,
          deptId: null,
          planEndTime: '',
          planStartTime: '',
          workItem:''
        };
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
        this.completeStatuss = selection.map(item => item.completeStatus)
        this.single = selection.length!=1;
        this.single =this.completeStatuss!="未完成";
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.timecre=false;
        this.iscom=false;
        this.reset();
        this.open = true;
        this.title = "添加实施任务";
        this.form.deptId = this.dept_select == false ? this.deptId : undefined;
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.timecre=true;
        this.iscom=true;
        this.reset();
        const id = row.id || this.ids;
        getTasklistdan(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "完成实施任务";
        });
      },
      /** 分配数据权限操作 */
      handleDataScope(row) {
        this.reset();
        this.$nextTick(() => {
          this.getRoleDeptTreeselect(row.roleId);
        });
        getRole(row.roleId).then(response => {
          this.form = response.data;
          this.openDataScope = true;
          this.title = "分配数据权限";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined && this.form.id != '') {
              this.form.createTime=null;
              updateTask(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addTask(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          }
        });
      },
      /** 提交按钮（数据权限） */
      submitDataScope: function() {
        if (this.form.roleId != undefined) {
          this.form.deptIds = this.getDeptAllCheckedKeys();
          dataScope(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.openDataScope = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const id = row.id || this.ids;
        this.$confirm('是否确认删除编号为"' + id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delTask(id).then(response => {
            if (response.code === 200) {
              this.msgSuccess("删除成功");
              this.openDataScope = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
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
            const multiHeader = [['生产计划表', '', '', '', '', '', '', '', '', '', '']];
            const tHeader = ['月度','序号', '部门','工作项','计划开始时间','计划结束时间', '计划用时(天)',
              '完成时间','剩余天数(天)','完成状态','延后的天数(天)']
            const filterVal = [ 'timeId', 'taskSort', 'deptId','workItem', 'planStartTime','planEndTime', 'planDays','completeTime', 'surplusDay','completeStatus', 'delayCount']
            const list = this.taskList;
            if (list.length != 0) {
              for (let i = 0; i < list.length; i++) {
                var obj = list[i];
                obj.timeId = obj.lcTime.time;
              }
            }
            const data = this.formatJson(filterVal, list)
            // 进行所有表头的单元格合并
            const merges = ['A1:K1'];

            const fileNameDate = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate() + '日';
            excel.export_json_to_excel({
              multiHeader, // 这里是第一行的表头
              // multiHeader2, // 这里是第二行的表头
              header: tHeader, // 这里是第三行的表头
              data,
              filename: '生产计划表' + fileNameDate,
              merges,
            });
          });
        }).catch(function() {

        });
      }
    }
  };
</script>
