import i18n from '@/i18n'

const { t } = i18n.global

export const ELEMENT_TYPE_ZH: { [key: string]: string } = {
  text: t('ppt.text'),
  image: t('ppt.image'),
  shape: t('ppt.shape'),
  line: t('ppt.line'),
  chart: t('ppt.chart'),
  table: t('ppt.table'),
  video: t('ppt.video'),
  audio: t('ppt.audio'),
  latex: t('ppt.latex'),
}

export const MIN_SIZE: { [key: string]: number } = {
  text: 40,
  image: 20,
  shape: 20,
  chart: 200,
  table: 30,
  video: 250,
  audio: 20,
  latex: 20,
}