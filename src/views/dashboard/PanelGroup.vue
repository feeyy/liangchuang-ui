<template>
  <el-row :gutter="20" class="panel-group">

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="excel" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            本年计划总量(条)
          </div>
          <count-to :start-val="0" :end-val="indexTaskMary.totalTask" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="skill" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            本年按时完成(条)
          </div>
          <count-to :start-val="0" :end-val="indexTaskMary.hasComplete" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="date-range" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            本年未完成(条)
          </div>
          <count-to :start-val="0" :end-val="indexTaskMary.notComplete" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="time-range" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            本年延后完成(条)
          </div>
          <count-to :start-val="0" :end-val="indexTaskMary.lastComplete" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>

  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import {getIndexTaskMary} from '@/api/index'

export default {
  data() {
    return {
      // 统计result
      indexTaskMary: {}
    }
  },
  created () {
    this.getIndexTaskMary();
  },
  methods: {
    /** 统计当前年的计划总数、完成、未完成、延后完成数量 **/
    getIndexTaskMary() {
      getIndexTaskMary().then(response => {
        this.indexTaskMary = response.data;
      }).catch((error) => {
        // console.log(error);
      });
    },
  },
  components: {
    CountTo
  }
}
</script>

<style lang="scss" scoped>
  .panel-group {
    margin-top: 10px;

    .card-panel-col {
      margin-bottom: 20px;

    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      background: rgba(0, 0, 0, .1);
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .icon-people {
          color: #fff;
          background: #36a3f7;
        }

        .icon-message {
          color: #fff;
          background: #67C23A;
        }

        .icon-money {
          color: #fff;
          background: #40c9c6;
        }

        .icon-shopping {
          color: #fff;
          background: #F56C6C;
        }

      }

      .icon-people {
        color: #36a3f7;
      }

      .icon-message {
        color: #67C23A;
      }

      .icon-money {
        color: #40c9c6;
      }

      .icon-shopping {
        color: #F56C6C;
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        margin: 20px;
        margin-left: 0px;
        font-weight: bold;
        color: #409EFF;

        .card-panel-text {
          line-height: 18px;
          margin-bottom: 12px;
          font-size: 14px;
          color: rgba(255, 255, 255, 1);
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
  @media (max-width:550px) {
    .card-panel-icon-wrapper {
      display: none;
      }

      .card-panel-description {
        float: none !important;
        width: 100%;
        height: 100%;
        margin-top: 25px;
        text-align: center;
      }

        .card-panel-text {
          line-height: 22px;
          margin-bottom: 12px;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.45);
        }


    }


</style>
