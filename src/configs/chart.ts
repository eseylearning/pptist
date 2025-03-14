import type { ChartData } from '@/types/slides'
import i18n from '@/i18n'

const { t } = i18n.global

export const CHART_TYPE_MAP: { [key: string]: string } = {
  'bar': t('ppt.barChart'),
  'column': t('ppt.columnChart'),
  'line': t('ppt.lineChart'),
  'area': t('ppt.areaChart'),
  'scatter': t('ppt.scatterChart'),
  'pie': t('ppt.pieChart'),
  'ring': t('ppt.ringChart'),
  'radar': t('ppt.radarChart'),
}

export const CHART_DEFAULT_DATA: { [key: string]: ChartData } = {
  'bar': {
    labels: [t('ppt.category1'), t('ppt.category2'), t('ppt.category3'), t('ppt.category4'), t('ppt.category5')],
    legends: [t('ppt.series1'), t('ppt.series2')],
    series: [[12, 19, 5, 2, 18], [7, 11, 13, 21, 9]],
  },
  'column': {
    labels: [t('ppt.category1'), t('ppt.category2'), t('ppt.category3'), t('ppt.category4'), t('ppt.category5')],
    legends: [t('ppt.series1'), t('ppt.series2')],
    series: [[12, 19, 5, 2, 18], [7, 11, 13, 21, 9]],
  },
  'line': {
    labels: [t('ppt.category1'), t('ppt.category2'), t('ppt.category3'), t('ppt.category4'), t('ppt.category5')],
    legends: [t('ppt.series1'), t('ppt.series2')],
    series: [[12, 19, 5, 2, 18], [7, 11, 13, 21, 9]],
  },
  'pie': {
    labels: [t('ppt.category1'), t('ppt.category2'), t('ppt.category3'), t('ppt.category4'), t('ppt.category5')],
    legends: [t('ppt.value')],
    series: [[12, 19, 5, 2, 18]],
  },
  'ring': {
    labels: [t('ppt.category1'), t('ppt.category2'), t('ppt.category3'), t('ppt.category4'), t('ppt.category5')],
    legends: [t('ppt.value')],
    series: [[12, 19, 5, 2, 18]],
  },
  'area': {
    labels: [t('ppt.category1'), t('ppt.category2'), t('ppt.category3'), t('ppt.category4'), t('ppt.category5')],
    legends: [t('ppt.series1'), t('ppt.series2')],
    series: [[12, 19, 5, 2, 18], [7, 11, 13, 21, 9]],
  },
  'radar': {
    labels: [t('ppt.category1'), t('ppt.category2'), t('ppt.category3'), t('ppt.category4'), t('ppt.category5')],
    legends: [t('ppt.series1'), t('ppt.series2')],
    series: [[12, 19, 5, 2, 18], [7, 11, 13, 21, 9]],
  },
  'scatter': {
    labels: [t('ppt.coordinate1'), t('ppt.coordinate2'), t('ppt.coordinate3'), t('ppt.coordinate4'), t('ppt.coordinate5')],
    legends: [t('ppt.xAxis'), t('ppt.yAxis')],
    series: [[12, 19, 5, 2, 18], [7, 11, 13, 21, 9]],
  },
}

export const CHART_PRESET_THEMES = [
  ['#d87c7c', '#919e8b', '#d7ab82', '#6e7074', '#61a0a8', '#efa18d'],
  ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78'],
  ['#516b91', '#59c4e6', '#edafda', '#93b7e3', '#a5e7f0', '#cbb0e3'],
  ['#893448', '#d95850', '#eb8146', '#ffb248', '#f2d643', '#ebdba4'],
  ['#4ea397', '#22c3aa', '#7bd9a5', '#d0648a', '#f58db2', '#f2b3c9'],
  ['#3fb1e3', '#6be6c1', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8'],
  ['#fc97af', '#87f7cf', '#f7f494', '#72ccff', '#f7c5a0', '#d4a4eb'],
  ['#c1232b', '#27727b', '#fcce10', '#e87c25', '#b5c334', '#fe8463'],
  ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
  ['#e01f54', '#001852', '#f5e8c8', '#b8d2c7', '#c6b38e', '#a4d8c2'],
  ['#c12e34', '#e6b600', '#0098d9', '#2b821d', '#005eaa', '#339ca8'],
  ['#8a7ca8', '#e098c7', '#8fd3e8', '#71669e', '#cc70af', '#7cb4cc'],
]