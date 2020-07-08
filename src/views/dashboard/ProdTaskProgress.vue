<template>
    <div class="elcontent">

      <div v-for="taskMary in taskMaryList"  class="elcontent-list">
        <div class="elcontent-list-t1" >
          <i class="el-icon-user"></i>{{taskMary.dept.deptName}}
        </div>
        <div class="elcontent-list-t2">
          <el-progress :text-inside="true" :stroke-width="20" :percentage="taskMary.completeRate" :color="customColors"  style="width: 100%"></el-progress>
        </div>
      </div>

    </div>
</template>

<script>

  // 年度计划汇总
  import {prodTaskMaryList} from '@/api/index'
  import {getYears} from '@/api/prod/mary'

  export default {
    name: 'elcontent',
    data() {
      return {
        // 遮罩层
        loading: true,
        // 查询的年
        years: [],
        // 年度计划汇总data
        taskMaryList: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          whenYears: undefined,
          pageNum: 1,
          pageSize: 20,
          isAsc: undefined,
          orderByColumn: undefined
        },
        customColors: [
          {color: '#909399', percentage: 20},
          {color: '#F56C6C', percentage: 40},
          {color: '#E6A23C', percentage: 60},
          {color: '#67C23A', percentage: 80},
          {color: '#409EFF', percentage: 100}
        ]
      }
    },
    created() {
      /** 获取年度计划汇总有哪些年份 */
      this.getYears()
      /** 查询年度计划汇总列表 */
      this.prodTaskMaryList()
    },
    methods: {

      /** 获取年度计划汇总有哪些年份 */
      getYears() {
        getYears().then(response => {
          this.years = response.data
          this.queryParams.whenYears = new Date().getFullYear()
        })
      },
      /** 查询年度计划汇总列表 */
      prodTaskMaryList() {
        this.loading = true
        setTimeout(()=>{
          prodTaskMaryList(this.queryParams).then(response => {
           // console.log(response.rows);
           // var dataArr = response.rows;
            //var pe = 0;
            //for (let i = 0; i < dataArr.length; i++) {
           //  pe = dataArr[i].completeRate;
            //  console.log(pe);
            //  this.colors(pe);
           // }
           // this.taskMaryList = dataArr;
            this.taskMaryList = response.rows
            this.total = response.total
            this.loading = false
          })
        },500)
      },
    }
  }
</script>
<style lang="scss" scoped>
  .elcontent{
    text-align: left;  margin: 0px 3% 3%  0px; width: 100%; height: 300px;
  }
  .elcontent-list{
    float:left;width: 98%; margin-bottom: 10px;
  }
  .elcontent-list-t1{
    float:left; width: 25%; font-size: 12px; text-align: center;line-height: 20px;color: #ffffff;
  }
  .elcontent-list-t2{
    float:left; width: 75%; font-size: 12px; text-align: left
  }

</style>
