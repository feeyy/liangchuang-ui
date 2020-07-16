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
          v-hasPermi="['eng:job:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['eng:job:update']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['eng:job:delete']"
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

    <el-table v-loading="loading" :data="jobList" @sort-change='sortChange'  @selection-change="handleSelectionChange" :span-method="arraySpanMethod" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" prop="jobSort" width="80" sortable='custom'/>
      <el-table-column label="客户名称" prop="lcProject.customerName" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="项目名称" prop="lcProject.projectName" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="楼号" prop="towerNumber" width="60"/>
      <el-table-column label="标准面积(㎡)" prop="standardArea" sortable='custom' width="120" />
      <el-table-column label="变换或补料(㎡)" prop="noStandardArea" sortable='custom' width="140" />
      <el-table-column label="生产排序" prop="jobOrder" sortable='custom' width="100" />
      <el-table-column label="下单时间" prop="placOrderTime" sortable='custom' width="100" />
      <el-table-column label="计划开始时间" prop="planStartTime" sortable='custom' width="130" />
      <el-table-column label="计划结束时间" prop="palnEndTime" sortable='custom' width="130" />
      <el-table-column label="生产实际开始时间" prop="actualStartTime" sortable='custom' width="150" />
      <el-table-column label="生产实际结束时间" prop="actualEndTime" sortable='custom' width="150" />
      <el-table-column label="切冲" prop="jodStatusQc" sortable='custom' width="100" :formatter="(r, c) => {return r.jodStatusQc == 0 ? '未完成' : '已完成'}"/>
      <el-table-column label="焊接" prop="jodStatusHj" sortable='custom' width="100" :formatter="(r, c) => {return r.jodStatusHj == 0 ? '未完成' : '已完成'}"/>
      <el-table-column label="校编" prop="jodStatusJb" sortable='custom' width="100" :formatter="(r, c) => {return r.jodStatusJb == 0 ? '未完成' : '已完成'}"/>
      <el-table-column label="铁件" prop="jodStatusTj" sortable='custom' width="100" :formatter="(r, c) => {return r.jodStatusTj == 0 ? '未完成' : '已完成'}"/>
      <el-table-column label="试装" prop="jodStatusSz" sortable='custom' width="100" :formatter="(r, c) => {return r.jodStatusSz == 0 ? '未完成' : '已完成'}"/>
      <el-table-column label="修改" prop="jodStatusUpdate" sortable='custom' width="100" :formatter="(r, c) => {return r.jodStatusUpdate == 0 ? '未完成' : '已完成'}"/>
      <el-table-column label="剩余(天)" prop="surplusDay" sortable='custom' width="100" />
      <el-table-column label="超期(天)" prop="superTime" sortable='custom' width="100" />
      <el-table-column label="完成(%)" prop="completeRate" sortable='custom' width="100" />
      <!--<el-table-column label="变换次数" prop="transformCount" sortable='custom' width="100" />-->
      <!--<el-table-column label="变换生产" prop="transformProd" sortable='custom' width="100" />-->
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
            v-hasPermi="['eng:job:update']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eng:job:delete']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="queryJob"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body center>
      <el-form ref="form" :inline="true" :model="form" label-width="150px">
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
        <el-form-item label="序号" prop="jobSort" label-width="150px">
          <el-input v-model="form.jobSort" placeholder="请输入序号(默认1)" style="width:180px;" oninput="value=value.replace(/[^0-9]/g,'')" />
        </el-form-item>
        <el-form-item label="楼号" prop="towerNumber" label-width="150px">
          <el-input v-model="form.towerNumber" placeholder="请输入楼号" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="标准面积(㎡)" prop="standardArea" label-width="150px">
          <el-input v-model="form.standardArea" placeholder="请输入标准面积(㎡)" oninput="value=value.replace(/[^0-9.]/g,'')" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="变换或补料(㎡)" prop="noStandardArea" label-width="150px">
          <el-input v-model="form.noStandardArea" placeholder="请输入变换或补料面积" oninput="value=value.replace(/[^0-9.]/g,'')" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="生产排序" prop="jobOrder" label-width="150px">
          <el-input v-model="form.jobOrder" placeholder="请输入序号" oninput="value=value.replace(/[^0-9]/g,'')" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="下单时间" prop="placOrderTime" label-width="150px">
          <el-date-picker
            v-model="form.placOrderTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 180px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生产实际时间(开始)" prop="actualStartTime" label-width="150px">
          <el-date-picker
            v-model="form.actualStartTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 180px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生产实际时间(结束)" prop="actualEndTime" label-width="150px">
          <el-date-picker
            v-model="form.actualEndTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 180px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="切冲" prop="jodStatusQc" label-width="150px">
          <el-select v-model="form.jodStatusQc" placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in isCom"
              :key="item.comSatus"
              :label="item.name"
              :value="item.comSatus">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="焊接" prop="jodStatusHj" label-width="150px">
          <el-select v-model="form.jodStatusHj" placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in isCom"
              :key="item.comSatus"
              :label="item.name"
              :value="item.comSatus">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="校编" prop="jodStatusJb" label-width="150px">
          <el-select v-model="form.jodStatusJb" placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in isCom"
              :key="item.comSatus"
              :label="item.name"
              :value="item.comSatus">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="铁件" prop="jodStatusTj" label-width="150px">
          <el-select v-model="form.jodStatusTj" placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in isCom"
              :key="item.comSatus"
              :label="item.name"
              :value="item.comSatus">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试装" prop="jodStatusSz" label-width="150px">
          <el-select v-model="form.jodStatusSz" placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in isCom"
              :key="item.comSatus"
              :label="item.name"
              :value="item.comSatus">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="修改" prop="jodStatusUpdate" label-width="150px">
          <el-select v-model="form.jodStatusUpdate" placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in isCom"
              :key="item.comSatus"
              :label="item.name"
              :value="item.comSatus">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="变换次数" prop="transformCount" label-width="150px">-->
          <!--<el-input v-model="form.transformCount" placeholder="请输入变换次数" oninput="value=value.replace(/[^0-9]/g,'')" style="width:180px;"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="变换生产" prop="transformProd" label-width="150px">-->
          <!--<el-input v-model="form.transformProd" placeholder="请输入变换生产" style="width: 180px;"/>-->
        <!--</el-form-item>-->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  // (项目) 生产工作
  import {queryJob, get, add, update, remove, getProjects} from '@/api/eng/job'

  import {getEngTime} from '@/api/time';

  export default {
    name: "Job",
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
        // 生产工作集合
        jobList: [],
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
      this.queryJob();
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
      /** (项目)生产工作列表 */
      queryJob() {
        this.loading = true;
        setTimeout(()=>{
          queryJob(this.queryParams).then(
            response => {
              this.jobList = response.rows;
              this.total = response.total;
              this.loading = false;
              this.merage();
            }
          );
        },500)
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
        for (let i = 0; i < this.jobList.length; i++) {
          if (i === 0) {
            this.idArr.push(1)
            this.idPos = 0
          } else {
            if (this.jobList[i].lcProject.projectName === this.jobList[i - 1].lcProject.projectName) {
              this.idArr[this.idPos] += 1
              this.idArr.push(0)
            } else {
              this.idArr.push(1)
              this.idPos = i
            }
          }
        }
      },
      //排序
      sortChange (column, prop, order){
        if (column.order != null) {
          this.queryParams.isAsc = 'desc';
        } else {
          this.queryParams.isAsc = 'asc';
        }
        this.queryParams.orderByColumn = column.prop
        this.queryJob(this.queryParams);
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
        this.queryJob();
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
        this.title = "添加生产工作信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        get(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改生产工作信息";
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
              this.queryJob();
            } else {
              this.msgError(response.msg);
            }
          });
        } else {
          add(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.open = false;
              this.queryJob();
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
          this.queryJob();
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
            const multiHeader = [['(项目)生产工作报表', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']];
            const tHeader = ['序号', '项目名称', '楼号', '标准面积(㎡)', '变换或补料面积(㎡)', '生产排序',
              '下单时间', '生产计划时间(开始)', '生产计划时间(结束)', '生产实际时间(开始)', '生产实际时间(结束)',
              '切冲', '焊接', '校编', '铁件', '试装', '修改', '剩余时间(天)', '超期时间(天)',
              '完成率(%)', '变换次数', '变换生产']
            const filterVal = ['jobSort', 'projectId', 'towerNumber', 'standardArea', 'noStandardArea', 'jobOrder',
              'placOrderTime', 'planStartTime', 'palnEndTime', 'actualStartTime', 'actualEndTime',
              'jodStatusQc', 'jodStatusHj', 'jodStatusJb', 'jodStatusTj', 'jodStatusSz', 'jodStatusUpdate', 'surplusDay', 'superTime',
              'completeRate', 'transformCount', 'transformProd']
            const list = this.jobList;
            if (list.length != 0) {
              for (let i = 0; i < list.length; i++) {
                var obj = list[i];
                obj.projectId = obj.lcProject.projectName;
              }
            }
            const data = this.formatJson(filterVal, list)
            // 进行所有表头的单元格合并
            const merges = ['A1:V1'];

            const fileNameDate = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate() + '日';
            excel.export_json_to_excel({
              multiHeader, // 这里是第一行的表头
              // multiHeader2, // 这里是第二行的表头
              header: tHeader, // 这里是第三行的表头
              data,
              filename: '(项目)生产工作报表' + fileNameDate,
              merges,
            });
            this.queryJob();
          });
        }).catch(function() {

        });
      }

    }
  };
</script>
