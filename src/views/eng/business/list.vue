<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="年" prop="timeId">
        <el-select v-model="queryParams.timeId" placeholder="年">
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
          v-hasPermi="['eng:business:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['eng:business:update']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['eng:business:delete']"
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

    <el-table v-loading="loading" :data="businessList" @sort-change='sortChange'  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" prop="busSort" width="80" sortable='custom'/>
      <el-table-column label="客户名称" prop="lcProject.customerName" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="项目名称" prop="lcProject.projectName" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="楼号" prop="towerNumber" width="50"/>
      <el-table-column label="施工层数" prop="toLayer" sortable='custom' width="100" />
      <el-table-column label="占地面积(㎡)" prop="occupyArea" sortable='custom' width="120" />
      <el-table-column label="中标时间" prop="winningTime" sortable='custom' width="120" />
      <el-table-column label="中标通知书" prop="isWinningNotice" sortable='custom' width="120" :formatter="(r, c) => {return r.isWinningNotice == 0 ? '否' : '是'}"/>
      <el-table-column label="合同周期(天)" prop="leaseContract" sortable='custom' width="120" />
      <el-table-column label="完成报量-起" prop="completeSubSince" sortable='custom' width="120" />
      <el-table-column label="完成报量-止" prop="completeSubCheck" sortable='custom' width="120" />
      <el-table-column label="完成报量-共" prop="completeSubTotal" sortable='custom' width="120" />
      <el-table-column label="合同外签回份数" prop="signOutside" sortable='custom' width="140" />
      <el-table-column label="实际完成层数" prop="actualCompletion" sortable='custom' width="130" />
      <el-table-column label="已完报量率(%)" prop="subRate" sortable='custom' width="150" />
      <el-table-column label="是否有书面交底" prop="isWritten" sortable='custom' width="150" :formatter="(r, c) => {return r.isWritten == 0 ? '否' : '是'}"/>
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
            v-hasPermi="['eng:business:update']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eng:business:delete']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="queryBusiness"
    />

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
        <el-form-item label="序号" prop="busSort" label-width="120px">
          <el-input v-model="form.busSort" placeholder="请输入序号(默认1)" style="width:180px;" oninput="value=value.replace(/[^0-9]/g,'')" />
        </el-form-item>
        <el-form-item label="楼号" prop="towerNumber" label-width="120px">
          <el-input v-model="form.towerNumber" placeholder="请输入楼号" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="施工层数" prop="toLayer" label-width="120px">
          <el-input v-model="form.toLayer" placeholder="请输入施工层数" oninput="value=value.replace(/[^0-9]/g,'')" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="占地面积(㎡)" prop="occupyArea" label-width="120px">
          <el-input v-model="form.occupyArea" placeholder="请输入占地面积" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="中标时间" prop="winningTime" label-width="120px">
          <el-date-picker
            v-model="form.winningTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 180px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否有中标通知书或函件" prop="isWinningNotice" label-width="120px">
          <el-select v-model="form.isWinningNotice" placeholder="请选择">
            <el-option
              v-for="item in isWinningNoticeArr"
              :key="item.isWinningNotice"
              :label="item.name"
              :value="item.isWinningNotice" style="width:180px;">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同周期(天)" prop="leaseContract" label-width="120px">
          <el-input v-model="form.leaseContract" placeholder="请输入合同周期(天)" oninput="value=value.replace(/[^0-9.]/g,'')" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="完成报量-起" prop="completeSubSince" label-width="120px">
          <el-input v-model="form.completeSubSince" placeholder="请输入完成报量-起" oninput="value=value.replace(/[^0-9]/g,'')" style="width: 180px;"/>
        </el-form-item>
        <el-form-item label="完成报量-止" prop="completeSubCheck" label-width="120px">
          <el-input v-model="form.completeSubCheck" placeholder="请输入完成报量-止" oninput="value=value.replace(/[^0-9]/g,'')" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="合同外签回份数" prop="signOutside" label-width="120px">
          <el-input v-model="form.signOutside" placeholder="请输入合同外签回份数" oninput="value=value.replace(/[^0-9]/g,'')" style="width: 180px;"/>
        </el-form-item>
        <el-form-item label="实际完成层数" prop="actualCompletion" label-width="120px">
          <el-input v-model="form.actualCompletion" placeholder="请输入实际完成层数" oninput="value=value.replace(/[^0-9]/g,'')" style="width:180px;"/>
        </el-form-item>
        <el-form-item label="是否有书面交底" prop="isWritten" label-width="120px">
          <el-select v-model="form.isWritten" placeholder="请选择">
            <el-option
              v-for="item in isWinningNoticeArr"
              :key="item.isWinningNotice"
              :label="item.name"
              :value="item.isWinningNotice" style="width:180px;">
            </el-option>
          </el-select>
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

  // (项目) 经营合约
  import {queryBusiness, get, add, update, remove, getProjects} from '@/api/eng/business'

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
        // 经营合约集合
        businessList: [],
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
        // 是否有中标
        isWinningNoticeArr: [{isWinningNotice: 0, name: '否'}, {isWinningNotice: 1, name: '是'}],
        defaultProps: {
          children: "children",
          label: "label"
        }
      };
    },
    created() {
      this.getEngTimes();
      this.queryBusiness();
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
      /** (项目)经营合约列表 */
      queryBusiness() {
        this.loading = true;
        setTimeout(()=>{
          queryBusiness(this.queryParams).then(
            response => {
              this.businessList = response.rows;
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
        this.queryBusiness(this.queryParams);
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
        this.queryBusiness();
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
        this.title = "添加经营合约信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        get(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改经营合约信息";
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
              this.queryBusiness();
            } else {
              this.msgError(response.msg);
            }
          });
        } else {
          add(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.open = false;
              this.queryBusiness();
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
          this.queryBusiness();
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
            const multiHeader = [['(项目)经营合约报表', '', '', '', '', '', '', '', '', '', '', '', '', '', '']];
            const tHeader = ['序号', '项目名称', '楼号', '施工层数', '总面积(㎡)',
              '中标时间', '是否有中标通知书和函件', '合同周期(天)', '完成报量-起', '完成报量-止', '完成报量-工',
              '合同外签回份数', '实际完成层数', '已完成报量率(%)', '是否有书面交底']
            const filterVal = ['busSort', 'projectId', 'towerNumber', 'toLayer', 'occupyArea',
              'winningTime', 'isWinningNotice', 'leaseContract', 'completeSubSince', 'completeSubCheck', 'completeSubTotal',
              'signOutside', 'actualCompletion', 'subRate', 'isWritten']
            const list = this.businessList;
            if (list.length != 0) {
              for (let i = 0; i < list.length; i++) {
                var obj = list[i];
                obj.projectId = obj.lcProject.projectName;
                if (obj.isWinningNotice == 0) {
                  obj.isWinningNotice = '否';
                } else {
                  obj.isWinningNotice = '是';
                }
                if (obj.isWritten == 0) {
                  obj.isWritten = '否';
                } else {
                  obj.isWritten = '是';
                }
                if (obj.createTime != null) {
                  obj.createTime = obj.createTime.replace('T', ' ');
                }
              }
            }
            const data = this.formatJson(filterVal, list)
            // 进行所有表头的单元格合并
            const merges = ['A1:O1'];

            const fileNameDate = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate() + '日';
            excel.export_json_to_excel({
              multiHeader, // 这里是第一行的表头
              // multiHeader2, // 这里是第二行的表头
              header: tHeader, // 这里是第三行的表头
              data,
              filename: '(项目)经营合约报表' + fileNameDate,
              merges,
            });
            this.queryBusiness();
          });
        }).catch(function() {

        });
      }

    }
  };
</script>
