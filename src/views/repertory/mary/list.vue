<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
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
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-tooltip class="item" effect="dark" content="跳转至" placement="top-start">
          <el-button
            class="is-plain"
            type="primary"
            icon="el-icon-view el-icon--right"
            size="mini"
            @click="redirectView('#/warehouse/aluminum')"
          >铝型材仓库</el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="1.5">
        <el-tooltip class="item" effect="dark" content="跳转至" placement="top-start">
          <el-button
            class="is-plain"
            type="primary"
            icon="el-icon-view el-icon--right"
            size="mini"
            @click="redirectView('#/warehouse/ban')"
          >半成品仓库</el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="1.5">
        <el-tooltip class="item" effect="dark" content="跳转至" placement="top-start">
          <el-button
            class="is-plain"
            type="primary"
            icon="el-icon-view el-icon--right"
            size="mini"
            @click="redirectView('#/warehouse/standard')"
          >标准板仓库</el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="1.5">
        <el-tooltip class="item" effect="dark" content="跳转至" placement="top-start">
          <el-button
            class="is-plain"
            type="primary"
            icon="el-icon-view el-icon--right"
            size="mini"
            @click="redirectView('#/warehouse/spraying')"
          >喷涂板仓库</el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="1.5">
        <el-tooltip class="item" effect="dark" content="跳转至" placement="top-start">
          <el-button
            class="is-plain"
            type="primary"
            icon="el-icon-view el-icon--right"
            size="mini"
            @click="redirectView('#/warehouse/playsand')"
          >未打砂模板仓库</el-button>
        </el-tooltip>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="maryList" @selection-change="handleSelectionChange">
      <!--<el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="仓库名称" prop="artName" width="140"/>
      <el-table-column label="新/旧" prop="isNew" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.isNew == 1" style="color: red;"><el-tag type="danger">新</el-tag></span>
          <span v-else-if="scope.row.isNew == 2" style="color: #13ce66"><el-tag type="info">旧</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="单位" prop="unit" width="140"/>
      <el-table-column label="期初库存" prop="earlyRepertory" width="140"/>
      <el-table-column label="本期入库" prop="thisInRepertory" width="140"/>
      <el-table-column label="本期出库" prop="thisOutRepertory" width="140"/>
      <el-table-column label="期末库存" prop="endRepertory" width="140"/>
      <el-table-column label="" prop=""/>
    </el-table>

  </div>
</template>

<script>

  // 仓库存储汇总
  import {list} from '@/api/repertory/mary'

  export default {
    name: "BanProduct",
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
        // 仓库存储汇总集合
        maryList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          startTime: undefined,
          endTime: undefined,
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
      /** 仓库存储汇总列表 */
      list() {
        this.loading = true;
        list(this.queryParams).then(
          response => {
            this.maryList = response.data;
            this.loading = false;
          }
        );
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
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!=1
        this.multiple = !selection.length
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
            const multiHeader = [['仓库存储汇总报表', '', '', '', '', '', '']];
            const tHeader = ['仓库名称', '新/旧', '单位', '期初库存', '本期入库', '本期出库', '期末库存']
            const filterVal = ['artName', 'isNew', 'unit', 'earlyRepertory', 'thisInRepertory', 'thisOutRepertory', 'endRepertory']
            const list = this.maryList;
            if (list.length != 0) {
              for (let i = 0; i < list.length; i++) {
                var obj = list[i];
                if (obj.isNew == 1) {
                  obj.isNew = '新';
                } else if (obj.isNew == 2) {
                  obj.isNew = '旧';
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
              filename: '仓库存储汇总报表' + fileNameDate,
              merges,
            });
            this.list();
          });
        }).catch(function() {

        });
      }

    }
  };
</script>
