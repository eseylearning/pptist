import type { TurningMode } from '@/types/slides'
import i18n from '@/i18n'

const { t } = i18n.global

export const ANIMATION_DEFAULT_DURATION = 1000
export const ANIMATION_DEFAULT_TRIGGER = 'click'
export const ANIMATION_CLASS_PREFIX = 'animate__'

export const ENTER_ANIMATIONS = [
  {
    type: 'bounce',
    name: t('ppt.bounce'),
    children: [
      { name: t('ppt.bounceIn'), value: 'bounceIn' },
      { name: t('ppt.bounceInLeft'), value: 'bounceInLeft' },
      { name: t('ppt.bounceInRight'), value: 'bounceInRight' },
      { name: t('ppt.bounceInUp'), value: 'bounceInUp' },
      { name: t('ppt.bounceInDown'), value: 'bounceInDown' },
    ],
  },
  {
    type: 'fade',
    name: t('ppt.fade'),
    children: [
      { name: t('ppt.fadeIn'), value: 'fadeIn' },
      { name: t('ppt.fadeInDown'), value: 'fadeInDown' },
      { name: t('ppt.fadeInDownBig'), value: 'fadeInDownBig' },
      { name: t('ppt.fadeInLeft'), value: 'fadeInLeft' },
      { name: t('ppt.fadeInLeftBig'), value: 'fadeInLeftBig' },
      { name: t('ppt.fadeInRight'), value: 'fadeInRight' },
      { name: t('ppt.fadeInRightBig'), value: 'fadeInRightBig' },
      { name: t('ppt.fadeInUp'), value: 'fadeInUp' },
      { name: t('ppt.fadeInUpBig'), value: 'fadeInUpBig' },
      { name: t('ppt.fadeInTopLeft'), value: 'fadeInTopLeft' },
      { name: t('ppt.fadeInTopRight'), value: 'fadeInTopRight' },
      { name: t('ppt.fadeInBottomLeft'), value: 'fadeInBottomLeft' },
      { name: t('ppt.fadeInBottomRight'), value: 'fadeInBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: t('ppt.rotate'),
    children: [
      { name: t('ppt.rotateIn'), value: 'rotateIn' },
      { name: t('ppt.rotateInDownLeft'), value: 'rotateInDownLeft' },
      { name: t('ppt.rotateInDownRight'), value: 'rotateInDownRight' },
      { name: t('ppt.rotateInUpLeft'), value: 'rotateInUpLeft' },
      { name: t('ppt.rotateInUpRight'), value: 'rotateInUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: t('ppt.zoom'),
    children: [
      { name: t('ppt.zoomIn'), value: 'zoomIn' },
      { name: t('ppt.zoomInDown'), value: 'zoomInDown' },
      { name: t('ppt.zoomInLeft'), value: 'zoomInLeft' },
      { name: t('ppt.zoomInRight'), value: 'zoomInRight' },
      { name: t('ppt.zoomInUp'), value: 'zoomInUp' },
    ],
  },
  {
    type: 'slide',
    name: t('ppt.SlideIn'),
    children: [
      { name: t('ppt.slideInDown'), value: 'slideInDown' },
      { name: t('ppt.slideInLeft'), value: 'slideInLeft' },
      { name: t('ppt.slideInRight'), value: 'slideInRight' },
      { name: t('ppt.slideInUp'), value: 'slideInUp' },
    ],
  },
  {
    type: 'flip',
    name: t('ppt.flip'),
    children: [
      { name: t('ppt.flipInX'), value: 'flipInX' },
      { name: t('ppt.flipInY'), value: 'flipInY' },
    ],
  },
  {
    type: 'back',
    name: t('ppt.Zoomin'),
    children: [
      { name: t('ppt.backInDown'), value: 'backInDown' },
      { name: t('ppt.backInLeft'), value: 'backInLeft' },
      { name: t('ppt.backInRight'), value: 'backInRight' },
      { name: t('ppt.backInUp'), value: 'backInUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: t('ppt.lightSpeed'),
    children: [
      { name: t('ppt.lightSpeedInRight'), value: 'lightSpeedInRight' },
      { name: t('ppt.lightSpeedInLeft'), value: 'lightSpeedInLeft' },
    ],
  },
]

export const EXIT_ANIMATIONS = [
  {
    type: 'bounce',
    name: t('ppt.bounce'),
    children: [
      { name: t('ppt.bounceOut'), value: 'bounceOut' },
      { name: t('ppt.bounceOutLeft'), value: 'bounceOutLeft' },
      { name: t('ppt.bounceOutRight'), value: 'bounceOutRight' },
      { name: t('ppt.bounceOutUp'), value: 'bounceOutUp' },
      { name: t('ppt.bounceOutDown'), value: 'bounceOutDown' },
    ],
  },
  {
    type: 'fade',
    name: t('ppt.fade'),
    children: [
      { name: t('ppt.fadeOut'), value: 'fadeOut' },
      { name: t('ppt.fadeOutDown'), value: 'fadeOutDown' },
      { name: t('ppt.fadeOutDownBig'), value: 'fadeOutDownBig' },
      { name: t('ppt.fadeOutLeft'), value: 'fadeOutLeft' },
      { name: t('ppt.fadeOutLeftBig'), value: 'fadeOutLeftBig' },
      { name: t('ppt.fadeOutRight'), value: 'fadeOutRight' },
      { name: t('ppt.fadeOutRightBig'), value: 'fadeOutRightBig' },
      { name: t('ppt.fadeOutUp'), value: 'fadeOutUp' },
      { name: t('ppt.fadeOutUpBig'), value: 'fadeOutUpBig' },
      { name: t('ppt.fadeOutTopLeft'), value: 'fadeOutTopLeft' },
      { name: t('ppt.fadeOutTopRight'), value: 'fadeOutTopRight' },
      { name: t('ppt.fadeOutBottomLeft'), value: 'fadeOutBottomLeft' },
      { name: t('ppt.fadeOutBottomRight'), value: 'fadeOutBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: t('ppt.rotate'),
    children: [
      { name: t('ppt.rotateOut'), value: 'rotateOut' },
      { name: t('ppt.rotateOutDownLeft'), value: 'rotateOutDownLeft' },
      { name: t('ppt.rotateOutDownRight'), value: 'rotateOutDownRight' },
      { name: t('ppt.rotateOutUpLeft'), value: 'rotateOutUpLeft' },
      { name: t('ppt.rotateOutUpRight'), value: 'rotateOutUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: t('ppt.zoom'),
    children: [
      { name: t('ppt.zoomOut'), value: 'zoomOut' },
      { name: t('ppt.zoomOutDown'), value: 'zoomOutDown' },
      { name: t('ppt.zoomOutLeft'), value: 'zoomOutLeft' },
      { name: t('ppt.zoomOutRight'), value: 'zoomOutRight' },
      { name: t('ppt.zoomOutUp'), value: 'zoomOutUp' },
    ],
  },
  {
    type: 'slide',
    name: t('ppt.slideOut'),
    children: [
      { name: t('ppt.slideOutDown'), value: 'slideOutDown' },
      { name: t('ppt.slideOutLeft'), value: 'slideOutLeft' },
      { name: t('ppt.slideOutRight'), value: 'slideOutRight' },
      { name: t('ppt.slideOutUp'), value: 'slideOutUp' },
    ],
  },
  {
    type: 'flip',
    name: t('ppt.flip'),
    children: [
      { name: t('ppt.flipOutX'), value: 'flipOutX' },
      { name: t('ppt.flipOutY'), value: 'flipOutY' },
    ],
  },
  {
    type: 'back',
    name: t('ppt.backOut'),
    children: [
      { name: t('ppt.backOutDown'), value: 'backOutDown' },
      { name: t('ppt.backOutLeft'), value: 'backOutLeft' },
      { name: t('ppt.backOutRight'), value: 'backOutRight' },
      { name: t('ppt.backOutUp'), value: 'backOutUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: t('ppt.lightSpeedOut'),
    children: [
      { name: t('ppt.lightSpeedOutRight'), value: 'lightSpeedOutRight' },
      { name: t('ppt.lightSpeedOutLeft'), value: 'lightSpeedOutLeft' },
    ],
  },
]

export const ATTENTION_ANIMATIONS = [
  {
    type: 'shake',
    name: t('ppt.shake'),
    children: [
      { name: t('ppt.shakeX'), value: 'shakeX' },
      { name: t('ppt.shakeY'), value: 'shakeY' },
      { name: t('ppt.headShake'), value: 'headShake' },
      { name: t('ppt.swing'), value: 'swing' },
      { name: t('ppt.wobble'), value: 'wobble' },
      { name: t('ppt.tada'), value: 'tada' },
      { name: t('ppt.jello'), value: 'jello' },
    ],
  },
  {
    type: 'other',
    name: t('ppt.other'),
    children: [
      { name: t('ppt.bounce'), value: 'bounce' },
      { name: t('ppt.flash'), value: 'flash' },
      { name: t('ppt.pulse'), value: 'pulse' },
      { name: t('ppt.rubberBand'), value: 'rubberBand' },
      { name: t('ppt.heartBeat'), value: 'heartBeat' },
    ],
  },
]

interface SlideAnimation {
  label: string
  value: TurningMode
}

export const SLIDE_ANIMATIONS: SlideAnimation[] = [
  { label: t('ppt.noAnimation'), value: 'no' },
  { label: t('ppt.random'), value: 'random' },
  { label: t('ppt.slideX'), value: 'slideX' },
  { label: t('ppt.slideY'), value: 'slideY' },
  { label: t('ppt.slideX3D'), value: 'slideX3D' },
  { label: t('ppt.slideY3D'), value: 'slideY3D' },
  { label: t('ppt.fade'), value: 'fade' },
  { label: t('ppt.rotate'), value: 'rotate' },
  { label: t('ppt.scaleY'), value: 'scaleY' },
  { label: t('ppt.scaleX'), value: 'scaleX' },
  { label: t('ppt.scale'), value: 'scale' },
  { label: t('ppt.scaleReverse'), value: 'scaleReverse' },
]