<template>
  <div 
    class="editable-element"
    ref="elementRef"
    :id="`editable-element-${elementInfo.id}`"
    :style="{
      zIndex: elementIndex,
    }"
  >
    <component
      :is="currentElementComponent"
      :elementInfo="elementInfo"
      :selectElement="selectElement"
      :contextmenus="contextmenus"
    ></component>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElementTypes, type PPTElement } from '@/types/slides'
import type { ContextmenuItem } from '@/components/Contextmenu/types'
import { useI18n } from 'vue-i18n'

import useLockElement from '@/hooks/useLockElement'
import useDeleteElement from '@/hooks/useDeleteElement'
import useCombineElement from '@/hooks/useCombineElement'
import useOrderElement from '@/hooks/useOrderElement'
import useAlignElementToCanvas from '@/hooks/useAlignElementToCanvas'
import useCopyAndPasteElement from '@/hooks/useCopyAndPasteElement'
import useSelectElement from '@/hooks/useSelectElement'

import { ElementOrderCommands, ElementAlignCommands } from '@/types/edit'

import ImageElement from '@/views/components/element/ImageElement/index.vue'
import TextElement from '@/views/components/element/TextElement/index.vue'
import ShapeElement from '@/views/components/element/ShapeElement/index.vue'
import LineElement from '@/views/components/element/LineElement/index.vue'
import ChartElement from '@/views/components/element/ChartElement/index.vue'
import TableElement from '@/views/components/element/TableElement/index.vue'
import LatexElement from '@/views/components/element/LatexElement/index.vue'
import VideoElement from '@/views/components/element/VideoElement/index.vue'
import AudioElement from '@/views/components/element/AudioElement/index.vue'

const props = defineProps<{
  elementInfo: PPTElement
  elementIndex: number
  isMultiSelect: boolean
  selectElement: (e: MouseEvent | TouchEvent, element: PPTElement, canMove?: boolean) => void
  openLinkDialog: () => void
}>()

const { t } = useI18n()

const currentElementComponent = computed<unknown>(() => {
  const elementTypeMap = {
    [ElementTypes.IMAGE]: ImageElement,
    [ElementTypes.TEXT]: TextElement,
    [ElementTypes.SHAPE]: ShapeElement,
    [ElementTypes.LINE]: LineElement,
    [ElementTypes.CHART]: ChartElement,
    [ElementTypes.TABLE]: TableElement,
    [ElementTypes.LATEX]: LatexElement,
    [ElementTypes.VIDEO]: VideoElement,
    [ElementTypes.AUDIO]: AudioElement,
  }
  return elementTypeMap[props.elementInfo.type] || null
})

const { orderElement } = useOrderElement()
const { alignElementToCanvas } = useAlignElementToCanvas()
const { combineElements, uncombineElements } = useCombineElement()
const { deleteElement } = useDeleteElement()
const { lockElement, unlockElement } = useLockElement()
const { copyElement, pasteElement, cutElement } = useCopyAndPasteElement()
const { selectAllElements } = useSelectElement()

const contextmenus = (): ContextmenuItem[] => {
  if (props.elementInfo.lock) {
    return [{
      text: t('ppt.unlock'),
      handler: () => unlockElement(props.elementInfo),
    }]
  }

  return [
    {
      text: t('ppt.cut'),
      subText: 'Ctrl + X',
      handler: cutElement,
    },
    {
      text: t('ppt.copy'),
      subText: 'Ctrl + C',
      handler: copyElement,
    },
    {
      text: t('ppt.paste'),
      subText: 'Ctrl + V',
      handler: pasteElement,
    },
    { divider: true },
    {
      text: t('ppt.alignHorizontalCenter'),
      handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL),
      children: [
        { text: t('ppt.alignHorizontalCenter') + ' & ' + t('ppt.alignVerticalCenter'), handler: () => alignElementToCanvas(ElementAlignCommands.CENTER), },
        { text: t('ppt.alignHorizontalCenter'), handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL) },
        { text: t('ppt.alignLeft'), handler: () => alignElementToCanvas(ElementAlignCommands.LEFT) },
        { text: t('ppt.alignRight'), handler: () => alignElementToCanvas(ElementAlignCommands.RIGHT) },
      ],
    },
    {
      text: t('ppt.alignVerticalCenter'),
      handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL),
      children: [
        { text: t('ppt.alignHorizontalCenter') + ' & ' + t('ppt.alignVerticalCenter'), handler: () => alignElementToCanvas(ElementAlignCommands.CENTER) },
        { text: t('ppt.alignVerticalCenter'), handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL) },
        { text: t('ppt.alignTop'), handler: () => alignElementToCanvas(ElementAlignCommands.TOP) },
        { text: t('ppt.alignBottom'), handler: () => alignElementToCanvas(ElementAlignCommands.BOTTOM) },
      ],
    },
    { divider: true },
    {
      text: t('ppt.bringToFront'),
      disable: props.isMultiSelect && !props.elementInfo.groupId,
      handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP),
      children: [
        { text: t('ppt.bringToFront'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP) },
        { text: t('ppt.moveUp'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.UP) },
      ],
    },
    {
      text: t('ppt.alignBottom'),
      disable: props.isMultiSelect && !props.elementInfo.groupId,
      handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM),
      children: [
        { text: t('ppt.alignBottom'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM) },
        { text: t('ppt.moveDown'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.DOWN) },
      ],
    },
    { divider: true },
    {
      text: t('ppt.hyperlink'),
      handler: props.openLinkDialog,
    },
    {
      text: props.elementInfo.groupId ? t('ppt.ungroup') : t('ppt.group'),
      subText: 'Ctrl + G',
      handler: props.elementInfo.groupId ? uncombineElements : combineElements,
      hide: !props.isMultiSelect,
    },
    {
      text: t('ppt.selectAll'),
      subText: 'Ctrl + A',
      handler: selectAllElements,
    },
    {
      text: t('ppt.lock'),
      subText: 'Ctrl + L',
      handler: lockElement,
    },
    {
      text: t('ppt.delete'),
      subText: 'Delete',
      handler: deleteElement,
    },
  ]
}
</script>