<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      // type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({series, productTypes} = {}) {
      this.chart.setOption({
        // title: {
        //   left: 'right',
        //   text: '本月月产量统计图', //标题文本
        // },
        xAxis: {
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
          boundaryGap: false,
          axisTick: {
            show: true
          }
        },
        toolbox: {
          right : '10px',
          feature: {
            dataView:{},
            dataZoom :{},
            magicType: {
              type: ['line', 'bar','stack']
            },
            restore:{}
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '50px',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        axisPointer: {
            link: {xAxisIndex: 'all'},
            label: {
                backgroundColor: '#409EFF',

            }
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: true
          }
        },
        legend: {
          type: 'scroll',
          bottom: '0px',
          data: productTypes

        },
        series: series
      })
    }
  }
}
</script>
