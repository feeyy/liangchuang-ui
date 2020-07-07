<template>
  <div class="table-container">
        <div class="table-til">
          物资汇总表
        </div>
    <div id="wzTable">
    <el-table max-height="300px" v-loading="loading" :data="maryList"  border>
      <!--<el-table-column label="年度仓储库存汇总预览" align="center">-->
        <el-table-column label="仓库名称" prop="artName"/>
        <el-table-column label="新/旧" prop="isNew">
          <template slot-scope="scope">
            <span v-if="scope.row.isNew == 1" style="color: red;"><el-tag type="danger">新</el-tag></span>
            <span v-else-if="scope.row.isNew == 2" style="color: #13ce66"><el-tag type="info">旧</el-tag></span>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="unit"/>
        <el-table-column label="期初库存" prop="earlyRepertory"/>
        <el-table-column label="本期入库" prop="thisInRepertory"/>
        <el-table-column label="本期出库" prop="thisOutRepertory"/>
        <el-table-column label="期末库存" prop="endRepertory"/>
      <!--</el-table-column>-->
    </el-table>
    </div>
  </div>
</template>

<script>

  // 仓库存储汇总
  import {queryRepertoryList} from '@/api/index'

  export default {
    name: "table-container",
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
          startTime: new Date().getFullYear() + '-01-01',
          endTime: undefined,
        }
      };
    },
    created() {
      this.queryRepertoryList();
    },
    methods: {
      /** 仓库存储汇总列表 */
      queryRepertoryList() {
        this.loading = true;
        queryRepertoryList(this.queryParams).then(
          response => {
            this.maryList = response.data;
            this.loading = false;
          }
        );
      },
    }
  };
</script>

<style lang="scss" scoped>
  .table-container {
    padding: 10px;
  }
  .table-til {
    width: 100%;
    text-align: center;
    color: #409EFF;
    font-weight: bold;
    line-height: 30px;
  }
  #wzTable /deep/.el-table, .el-table__expanded-cell {
    background-color: transparent;
  }
  #wzTable /deep/.el-table tr {
    background-color: transparent;
    color: #ffffff;
    font-size: 12px;
  }
  #wzTable /deep/.el-table--enable-row-hover .el-table__body tr:hover>td {
    background: #409EFF;
    color: #ffffff;
  }
  #wzTable /deep/.el-table__header th, .el-table__header tr {
    background-color:transparent;
    color: #409EFF;
    padding:6px 0px;
  }
</style>
