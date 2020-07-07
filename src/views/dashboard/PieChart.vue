<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

 // import CountTo from 'vue-count-to'
  import {getIndexTaskMary} from '@/api/index'

  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      }
    },
    data() {
      return {
        // 统计result
        indexTaskMary: {}
      }
    },
    created () {
      this.getIndexTaskMary();
    },
    mounted(){
      this.$nextTick(() => {
        this.getIndexTaskMary();
      })
    },
    methods: {
      /** 统计当前年的计划总数、完成、未完成、延后完成数量 **/
      getIndexTaskMary: function () {

        getIndexTaskMary().then(response => {
          this.indexTaskMary = response.data;
          this.initChart(this.indexTaskMary);
        }).catch((error) => {
          // console.log(error);
        });
      },
      //components: {
       // CountTo
     // },
      beforeDestroy() {
        if (!this.chart) {
          return
        }
        this.chart.dispose()
        this.chart = null
      },
      initChart:function(data) {
        this.chart = echarts.init(this.$el, 'macarons')

        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: ['按时完成', '未完成', '延后完成']
          },
          series: [
            {
              name: '计划完成情况',
              type: 'pie',
              roseType: 'radius',
              radius: [20, 80],
              center: ['50%', '38%'],
              data: [
                {value: data.hasComplete, name: '按时完成'},
                {value: data.notComplete, name: '未完成'},
                {value: data.lastComplete, name: '延后完成'}
              ],
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      }
    }
  }
</script>
