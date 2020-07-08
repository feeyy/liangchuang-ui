<template>
  <el-row :gutter="20" class="panel-group1">
    <el-col :xs="12" :sm="6" :lg="6" class="card-panel-col1">
      <a href="#/prod/effect">
        <div class="card-panel1">
            <div class="card-panel-icon">
              <i class="el-icon-s-data"></i>
            </div>
            <div class="card-panel-text">
              计划任务查看
            </div>
          </div>
      </a>
    </el-col>
    <el-col :xs="12" :sm="6" :lg="6" class="card-panel-col1">
      <a href="#/engin/mary">
        <div class="card-panel1">
            <div class="card-panel-icon">
              <i class="el-icon-office-building"></i>
            </div>
            <div class="card-panel-text">
              工程项目查看
            </div>
        </div>
      </a>
    </el-col>
    <el-col :xs="12" :sm="6" :lg="6" class="card-panel-col1">
      <a href="#/warehouse/ckumary">
        <div class="card-panel1">
            <div class="card-panel-icon">
              <i class="el-icon-s-platform"></i>
            </div>
            <div class="card-panel-text">
              仓储库存查看
            </div>
        </div>
      </a>
    </el-col>
    <el-col :xs="12" :sm="6" :lg="6" class="card-panel-col1">
      <a href="#/acceptance/valida">
        <div class="card-panel1">
            <div class="card-panel-icon">
              <i class="el-icon-box"></i>
            </div>
            <div class="card-panel-text">
              试装验收查看
            </div>
        </div>
      </a>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
  .panel-group1 {
    margin-top: 0px;

    .card-panel-col1 {
      text-align: center;
      margin-bottom: 20px;
    }

    .card-panel1 {
      height: 108px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      text-align: center;
      background: rgba(0, 0, 0, .1);
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      color: #409EFF;

      &:hover {
          color: #fff;
          background: #409EFF;
      }


      .card-panel-icon {
        float: left;
        margin: 10px 0px 10px 0px;
        text-align: center;
        width: 100%;
        clear: both;
        font-size: 40px;
      }

      .card-panel-text {
        float: left;
        width: 100%;
        text-align: center;
        clear: both;
        line-height: 18px;
        font-size: 16px;
        font-weight: bold;
        }

      }
  }



</style>
