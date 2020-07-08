<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

// 查询月产量(本年)
import {statisticalProductMaryMonth} from '@/api/index'

const animationDuration = 6000

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
      chart: null,
      mTest:['2020-1','2020-2','2020-3','2020-4','2020-5','2020-6','2020-7','2020-8','2020-9','2020-10','2020-11','2020-12'],
      vTest:['3100','3200','3300','3600','3300','3000','3900','3500','3900','3200','3100','3300'],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.statisticalProductMaryMonth();
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
    /** 获取组别list **/
    statisticalProductMaryMonth() {
      statisticalProductMaryMonth().then(response => {
        var obj = response.data;
        var m = [];
        var v = [];
        for (let i = 0; i < obj.length; i++) {
          m[i] = obj[i].whenYears;
          v[i] = obj[i].prodVal;
        }
        this.initChart(m, v);
      })
    },
    initChart(m, v) {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          left: 'center',
          text: '', //标题文本
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        //toolbox: {
      //    right : '10px',
      //    feature: {
         //   magicType: {
         //     type: ['line', 'bar']
        //    }
      //    }
      //  },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: m,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: true
          }
        }],
        series: [{
          name: '月产量',
         // type: 'bar',
          //stack: 'vistors',
         // barWidth: '20px',
         // itemStyle: {
          //  barBorderRadius: 25,

            // color: new echarts.graphic.LinearGradient(
            //   0, 0, 0, 1,
            //   [
            //     {offset: 0, color: '#14c8d4'},
            //     {offset: 1, color: '#409EFF'}
            //   ]
            // )
         // },
          data: v,
          type: 'pictorialBar',
          //xAxisIndex: 1,
          barCategoryGap: '-40%',
         // barCategoryGap: '-5%',
          symbol: 'path://d="M150 50 L130 130 L170 130  Z"',
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = [
                  'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)',
                  'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)',
                  'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)',
                  'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)',
                  'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)',
                  'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)'
                ];
                return colorList[params.dataIndex];
              }
            },
            emphasis: {
              opacity: 1
            }
          },
          //animationDuration
        }]
      })
    }
  }
}
</script>
