<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="年" prop="timeId">
        <el-select v-model="queryParams.timeId" placeholder="请选择">
          <el-option
            v-for="da in dateRange"
            :key="da.id"
            :label="da.engYears"
            :value="da.id">
          </el-option>
        </el-select>
      </el-form-item>
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
          v-hasPermi="['module:project:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:project:update']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:project:delete']"
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

    <el-table v-loading="loading" :data="projectList" @sort-change='sortChange' @selection-change="handleSelectionChange" :span-method="arraySpanMethod" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" prop="proSort" :show-overflow-tooltip="true" width="100" sortable='custom'/>
      <el-table-column label="客户名称" prop="customerName" />
      <el-table-column label="项目名称" prop="projectName" />
      <el-table-column label="省" prop="addrProvince" :formatter="(r, c)=> {return getShengName(r.addrProvince);}"/>
      <el-table-column label="市" prop="addrCity" :formatter="(r, c)=> {return getShiName(r.addrProvince, r.addrCity);}"/>
      <!--<el-table-column label="创建时间" prop="createTime" sortable='custom' :show-overflow-tooltip="true" width="150" :formatter="(r, c) => { return r.createTime != null ? r.createTime.replace('T', ' ') : '-'}"/>-->
      <!--<el-table-column label="创建人" prop="createName" width="120" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:project:update']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:project:delete']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getprolist"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body center>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="年" prop="timeId">
          <el-select v-model="form.timeId" placeholder="请选择">
            <el-option
              v-for="da in dateRange"
              :key="da.id"
              :label="da.engYears"
              :value="da.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" controls-position="right" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="省" prop="addrProvince">
          <el-select v-model="form.addrProvince" placeholder="请选择省" @change="listCity(form.addrProvince)">
            <el-option
              v-for="item in provinceArr"
              :key="item.adcode"
              :label="item.name"
              :value="item.adcode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市" prop="addrCity">
          <el-select v-model="form.addrCity" placeholder="请选择市">
            <el-option
              v-for="item in cityArr"
              :key="item.adcode"
              :label="item.name"
              :value="item.adcode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序号" prop="proSort">
          <el-input v-model="form.proSort" placeholder="请输入序号(默认1)" oninput="value=value.replace(/[^0-9]/g,'')" />
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
  import {getprolist, addpro, delpro, updatepro, getprodan } from '@/api/project/project'
  // 工程项目的时间集合
  import {getEngTime } from '@/api/time'
  import axios from 'axios'
  import $ from 'jquery'

  export default {
    name: "Role",
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
        // 项目表格数据
        projectList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        //时间id
        open: false,
        // 是否显示弹出层（数据权限）
        openDataScope: false,
        // 日期范围
        dateRange: [],
        provinceArr: [],
        cityArr: [],
        // 查询参数
        queryParams: {
          projectName:undefined,
          timeId : null,
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
        rules: {
          timeId: [
            { required: true, message: "时间日期不能为空", trigger: "blur" }
          ],
          customerName: [
            { required: true, message: "客户名称不能为空", trigger: "blur" }
          ],
          projectName: [
            { required: true, message: "项目名称不能为空", trigger: "blur" }
          ],
          addrProvince: [
            { required: true, message: "请选择省份", trigger: "blur" }
          ],
          addrCity: [
            { required: true, message: "请选择市", trigger: "blur" }
          ]
        },
      };
    },
    created() {
      this.getEngTime();
      this.getprolist();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });

      this.listProvince();
    },
    methods: {
      /**工程项目时间*/
      getEngTime(){
        getEngTime().then(response => {
          this.dateRange = response.data;
          this.queryParams.timeId = this.dateRange[0].id;
        });
      },
      getprolist() {
        setTimeout(()=>{
          getprolist(this.queryParams).then(
            res => {
              this.projectList = res.rows;
              this.total = res.total;
              this.loading = false;
              this.merage();
            }
          );
        },500)
      },
      //表格合并
      arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 2) {
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
        for (let i = 0; i < this.projectList.length; i++) {
          if (i === 0) {
            this.idArr.push(1)
            this.idPos = 0
          } else {
            if (this.projectList[i].customerName === this.projectList[i - 1].customerName) {
              this.idArr[this.idPos] += 1
              this.idArr.push(0)
            } else {
              this.idArr.push(1)
              this.idPos = i
            }
          }
        }
      },
      /** 获取省 **/
      listProvince() {
        axios.get('http://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/100000_province.json')
          .then(response=> {
            if (null != response.data) {
              this.provinceArr = response.data.rows;
              if (undefined != this.form.addrProvince) {
                this.listCity(this.form.addrProvince);
              }
            } else {
              this.msgError("获取省份失败");
            }
          })
      },
      // 获取指定省份下面的城市
      listCity(id) {
        axios.get('http://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/'+id+'_city.json')
          .then(response=> {
            if (null != response.data) {
              this.cityArr = response.data.rows;
            } else {
              this.msgError("获取市失败");
            }
          })
      },
      // 通过省份ID获取省份名称
      getShengName(sheng) {
        if (null != sheng && '' != sheng) {
          var data = '';
          $.ajaxSettings.async = false;
          $.get('http://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/100000_province.json', (res)=> {
              res.rows.find((item) => {
                if (item.adcode == sheng) {
                  data = item.name
                }
              })
          })
          return data;
        }
      },
      // 通过省与市的ID获取市的名称处
      getShiName(sheng, shi) {
        if (null != sheng && null != shi) {
          var data = '';
          $.ajaxSettings.async = false;
          $.get('http://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/'+sheng+'_city.json', (res)=> {
            res.rows.find((item) => {
              if (item.adcode == shi) {
                data = item.name
              }
            })
          })
          return data;
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
        this.getprolist();
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
          createName: undefined,
          createTime: undefined,
          customerName: undefined,
          id: 0,
          projectName:undefined,
          timeId : undefined
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getprolist();
      },
      /** 重置按钮操作 */
      resetQuery() {
        // this.dateRange = [];
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
        this.reset();
        this.open = true;
        this.title = "添加项目";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getprodan(id).then(response => {
          this.form = response.data;
          if (undefined != this.form.addrProvince) {
            this.listCity(this.form.addrProvince);
          }
          this.open = true;
          this.title = "修改角色";
        });
      },

      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined && this.form.id != '') {
              this.form.createTime=null;
              updatepro(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.handleQuery();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              this.form.timeId=this.queryParams.timeId;
              addpro(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.handleQuery();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const id = row.id || this.ids;
        this.$confirm('是否确认删除项目编号为"' + id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delpro(id);
        }).then(() => {
          this.handleQuery();
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
            const multiHeader = [['项目列表', '', '']];
            const tHeader = ['序号' ,'客户名称','项目名称']
            const filterVal = ['proSort','customerName', 'projectName']
            const list = this.projectList;
            const data = this.formatJson(filterVal, list)
            // 进行所有表头的单元格合并
            const merges = ['A1:C1'];

            const fileNameDate = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate() + '日';
            excel.export_json_to_excel({
              multiHeader, // 这里是第一行的表头
              // multiHeader2, // 这里是第二行的表头
              header: tHeader, // 这里是第三行的表头
              data,
              filename: '项目列表' + fileNameDate,
              merges,
            });
          });
        }).catch(function() {

        });

      }
    }
  };
</script>
