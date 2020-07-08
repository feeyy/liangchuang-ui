<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import 'echarts/map/js/china'
  //import 'echarts/map/js/province/guangxi'
  import resize from './mixins/resize'
  import {porjectMap} from '@/api/index'
  import $ from 'jquery'


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
    },
    data() {
      return {
      mapdata1: [
         {name: '北京', value: 179},
         {name: '天津省', value: 400},
         {name: '上海', value: Math.round(Math.random() * 500)},
         {name: '重庆', value: Math.round(Math.random() * 500)},
         {name: '河北', value: Math.round(Math.random() * 500)},
         {name: '河南', value: Math.round(Math.random() * 500)},
         {name: '云南', value: Math.round(Math.random() * 500)},
         {name: '辽宁', value: Math.round(Math.random() * 500)},
         {name: '黑龙江', value: Math.round(Math.random() * 500)},
         {name: '湖南', value: Math.round(Math.random() * 500)},
         {name: '安徽', value: Math.round(Math.random() * 500)},
         {name: '山东', value: Math.round(Math.random() * 500)},
         {name: '新疆', value: Math.round(Math.random() * 500)},
         {name: '江苏', value: Math.round(Math.random() * 500)},
         {name: '浙江', value: Math.round(Math.random() * 500)},
         {name: '江西', value: Math.round(Math.random() * 500)},
         {name: '湖北', value: Math.round(Math.random() * 500)},
         {name: '广西', value: Math.round(Math.random() * 500)},
         {name: '甘肃', value: Math.round(Math.random() * 500)},
         {name: '山西', value: Math.round(Math.random() * 500)},
         {name: '内蒙古', value: Math.round(Math.random() * 500)},
         {name: '陕西', value: Math.round(Math.random() * 500)},
         {name: '吉林', value: Math.round(Math.random() * 500)},
         {name: '福建', value: Math.round(Math.random() * 500)},
         {name: '贵州', value: Math.round(Math.random() * 500)},
         {name: '广东', value: Math.round(Math.random() * 500)},
         {name: '青海', value: Math.round(Math.random() * 500)},
         {name: '西藏', value: Math.round(Math.random() * 500)},
         {name: '四川', value: Math.round(Math.random() * 500)},
         {name: '宁夏', value: Math.round(Math.random() * 500)},
         {name: '海南', value: Math.round(Math.random() * 500)},
         {name: '台湾', value: Math.round(Math.random() * 500)},
         {name: '香港', value: Math.round(Math.random() * 500)},
         {name: '澳门', value: Math.round(Math.random() * 500)},
         {name: '南海诸岛', value: Math.round(Math.random() * 500)}
       ],
      }
    },
    created () {
     // this.initChart(mapdata);
    },
    mounted(){
      this.getMapDate();
    },
    methods: {
      // 获取项目分布的地图数据
      getMapDate() {
        porjectMap().then(response=> {
          // 返回结果: projectCount 项目数量 toYears 当前年份 addrProvince 省份ID addrCity 城市ID
          var data = response.data;
          var lastData = [];
          if (null != data) {
            for (let i = 0; i < data.length; i++) {
              var obj = data[i];
              obj.addrCity = this.getShiName(obj.addrProvince, obj.addrCity);
              obj.addrProvince = this.getShengName(obj.addrProvince);
              if (obj.addrProvince == '广西壮族自治区') {
                obj.addrProvince = '广西省'
              }
              if (obj.addrProvince == '内蒙古自治区') {
                obj.addrProvince = '内蒙古省'
              }
              var mapObj = {
                name: obj.addrProvince.replace('省', ''),
                value: obj.projectCount
              };
           //   console.log(mapObj.name +"："+mapObj.value);
              lastData.push(mapObj);

            }
          }
        //  this.mapdata = lastData;
          this.initChart(lastData);
       //  console.log("省份："+this.mapdata);
       //   console.log("省份1："+this.mapdata1);
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
      tbeforeDestroy() {
        if (!this.chart) {
          return
        }
        this.chart.dispose()
        this.chart = null
      },
      initChart:function(mapdata) {
        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption({
        //  backgroundColor: 'transparent',
          title: {
           text: '中国',
           subtext: 'china',
            sublink: '',
            left: 'center',
            //textStyle: {
             // color: '#fff'
         //   }
          },
          // 提示框，鼠标移入
          tooltip:{
            show:true, //鼠标移入是否触发数据
            trigger: 'item', //出发方式
            formatter:'{b}<br>项目数量：{c}'
          },

          //是视觉映射组件，用于进行『视觉编码』，也就是将数据映射到视觉元素（视觉通道）。
          //左侧小导航图标
          visualMap: {
            show : true,
            x: 'left',
            y: 'center',
            splitList: [
              {start: 60},{start: 40, end: 50},
              {start: 30, end: 40},{start: 20, end: 30},
              {start: 10, end: 20},{start: 0, end: 10},
            ],
            textStyle:{
              color:'#ffffff',
            },
           // color: ['#5475f5', '#9feaa5', '#85daef','#74e2ca', '#e6ac53', '#9fb5ea']
          },

          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },


          //配置地图的数据，并且显示
          series:[
            {
              name: '项目',
              mapType: 'china',
              type: 'map',
             // coordinateSystem: 'geo',
              data: mapdata,
              label: {
                normal: {
                  show: true,
                  color:'#409EFF'
                },
                emphasis: {
                  show: true,
                  color:'#fff'
                }
              },

              roam: true,
              itemStyle: {
                normal: {
                  areaColor: 'RGBA(255,255,255,0)',//地图默认的背景颜色
                  borderColor: '#ffffff'//地图默认的边线颜色
                },
                emphasis: {
                  areaColor: '#409EFF'//地图触发地区的背景颜色

                }
              },
            }
          ]
        })
      }
    }
  }
</script>
