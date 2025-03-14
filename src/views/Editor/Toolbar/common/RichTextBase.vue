<template>
  <div class="rich-text-base">
    <SelectGroup class="row">
      <Select
        style="width: 60%;"
        :value="richTextAttrs.fontname"
        search
        :searchLabel="t('ppt.searchFont')"
        @update:value="value => emitRichTextCommand('fontname', value as string)"
        :options="FONTS"
      >
        <template #icon>
          <IconFontSize />
        </template>
      </Select>
      <Select
        style="width: 40%;"
        :value="richTextAttrs.fontsize"
        search
        :searchLabel="t('ppt.searchFontSize')"
        @update:value="value => emitRichTextCommand('fontsize', value as string)"
        :options="fontSizeOptions.map(item => ({
          label: item, value: item
        }))"
      >
        <template #icon>
          <IconAddText />
        </template>
      </Select>
    </SelectGroup>

    <ButtonGroup class="row" passive>
      <Popover trigger="click" style="width: 30%;">
        <template #content>
          <ColorPicker
            :modelValue="richTextAttrs.color"
            @update:modelValue="value => emitRichTextCommand('color', value)"
          />
        </template>
        <TextColorButton first v-tooltip="t('ppt.fontColor')" :color="richTextAttrs.color">
          <IconText />
        </TextColorButton>
      </Popover>
      <Popover trigger="click" style="width: 30%;">
        <template #content>
          <ColorPicker
            :modelValue="richTextAttrs.backcolor"
            @update:modelValue="value => emitRichTextCommand('backcolor', value)"
          />
        </template>
        <TextColorButton v-tooltip="t('ppt.textHighlight')" :color="richTextAttrs.backcolor">
          <IconHighLight />
        </TextColorButton>
      </Popover>
      <Button 
        class="font-size-btn"
        style="width: 20%;"
        v-tooltip="t('ppt.increaseFontSize')"
        @click="emitRichTextCommand('fontsize-add')"
      ><IconFontSize />+</Button>
      <Button
        last
        class="font-size-btn"
        style="width: 20%;"
        v-tooltip="t('ppt.decreaseFontSize')"
        @click="emitRichTextCommand('fontsize-reduce')"
      ><IconFontSize />-</Button>
    </ButtonGroup>

    <ButtonGroup class="row">
      <CheckboxButton 
        style="flex: 1;"
        :checked="richTextAttrs.bold"
        v-tooltip="t('ppt.bold')"
        @click="emitRichTextCommand('bold')"
      ><IconTextBold /></CheckboxButton>
      <CheckboxButton 
        style="flex: 1;"
        :checked="richTextAttrs.em"
        v-tooltip="t('ppt.italic')"
        @click="emitRichTextCommand('em')"
      ><IconTextItalic /></CheckboxButton>
      <CheckboxButton 
        style="flex: 1;"
        :checked="richTextAttrs.underline"
        v-tooltip="t('ppt.underline')"
        @click="emitRichTextCommand('underline')"
      ><IconTextUnderline /></CheckboxButton>
      <CheckboxButton 
        style="flex: 1;"
        :checked="richTextAttrs.strikethrough"
        v-tooltip="t('ppt.strikethrough')"
        @click="emitRichTextCommand('strikethrough')"
      ><IconStrikethrough /></CheckboxButton>
    </ButtonGroup>

    <ButtonGroup class="row">
      <CheckboxButton
        style="flex: 1;"
        :checked="richTextAttrs.superscript"
        v-tooltip="t('ppt.superscript')"
        @click="emitRichTextCommand('superscript')"
      >A²</CheckboxButton>
      <CheckboxButton
        style="flex: 1;"
        :checked="richTextAttrs.subscript"
        v-tooltip="t('ppt.subscript')"
        @click="emitRichTextCommand('subscript')"
      >A₂</CheckboxButton>
      <CheckboxButton
        style="flex: 1;"
        :checked="richTextAttrs.code"
        v-tooltip="t('ppt.inlineCode')"
        @click="emitRichTextCommand('code')"
      ><IconCode /></CheckboxButton>
      <CheckboxButton
        style="flex: 1;"
        :checked="richTextAttrs.blockquote"
        v-tooltip="t('ppt.quote')"
        @click="emitRichTextCommand('blockquote')"
      ><IconQuote /></CheckboxButton>
    </ButtonGroup>

    <ButtonGroup class="row" passive>
      <CheckboxButton
        first
        style="flex: 1;"
        v-tooltip="t('ppt.clearFormat')"
        @click="emitRichTextCommand('clear')"
      ><IconFormat /></CheckboxButton>
      <CheckboxButton
        style="flex: 1;"
        :checked="!!textFormatPainter"
        v-tooltip="t('ppt.formatPainter')"
        @click="toggleTextFormatPainter()"
        @dblclick="toggleTextFormatPainter(true)"
      ><IconFormatBrush /></CheckboxButton>
      <Popover placement="bottom-end" trigger="click" v-model:value="linkPopoverVisible" style="width: 33.33%;">
        <template #content>
          <div class="link-popover">
            <Input v-model:value="link" :placeholder="t('ppt.enterLink')" />
            <div class="btns">
              <Button size="small" :disabled="!richTextAttrs.link" @click="removeLink()" style="margin-right: 5px;">{{ t('ppt.remove') }}</Button>
              <Button size="small" type="primary" @click="updateLink(link)">{{ t('ppt.confirm') }}</Button>
            </div>
          </div>
        </template>
        <CheckboxButton
          last
          style="width: 100%;"
          :checked="!!richTextAttrs.link"
          v-tooltip="t('ppt.hyperlink')"
          @click="openLinkPopover()"
        ><IconLinkOne /></CheckboxButton>
      </Popover>
    </ButtonGroup>
    <Divider />

    <RadioGroup 
      class="row" 
      :value="richTextAttrs.align || 'left'"
      @update:value="value => emitRichTextCommand('align', value)"
    >
      <RadioButton value="left" style="flex: 1;" v-tooltip="t('ppt.alignLeft')"><IconAlignTextLeft /></RadioButton>
      <RadioButton value="center" style="flex: 1;" v-tooltip="t('ppt.alignCenter')"><IconAlignTextCenter /></RadioButton>
      <RadioButton value="right" style="flex: 1;" v-tooltip="t('ppt.alignRight')"><IconAlignTextRight /></RadioButton>
      <RadioButton value="justify" style="flex: 1;" v-tooltip="t('ppt.alignJustify')"><IconAlignTextJustify /></RadioButton>
    </RadioGroup>

    <div class="row">
      <ButtonGroup style="flex: 1;" passive>
        <Popover trigger="click" v-model:value="bulletListPanelVisible">
          <template #content>
            <div class="list-wrap">
              <div 
                class="list" 
                v-for="(item, index) in bulletListStyleTypeOption" 
                :key="index"
                @click="emitRichTextCommand('bulletList', item)"
              >
                <div class="list-item">
                  <span></span>
                </div>
              </div>
            </div>
          </template>
          <Button first style="flex: 1;" v-tooltip="t('ppt.bulletList')" @click="emitRichTextCommand('bulletList')"><IconListTwo /></Button>
        </Popover>
        <Popover trigger="click" v-model:value="orderedListPanelVisible">
          <template #content>
            <div class="list-wrap">
              <div 
                class="list" 
                v-for="(item, index) in orderedListStyleTypeOption" 
                :key="index"
                @click="emitRichTextCommand('orderedList', item)"
              >
                <div class="list-item">
                  <span></span>
                </div>
              </div>
            </div>
          </template>
          <Button last style="flex: 1;" v-tooltip="t('ppt.orderedList')" @click="emitRichTextCommand('orderedList')"><IconOrderedList /></Button>
        </Popover>
      </ButtonGroup>
      <div style="width: 10px;"></div>
      <ButtonGroup style="flex: 1;" passive>
        <Button first style="flex: 1;" v-tooltip="t('ppt.decreaseParagraphIndent')" @click="emitRichTextCommand('indent', '-1')"><IconIndentLeft /></Button>
        <Popover trigger="click" v-model:value="indentLeftPanelVisible">
          <template #content>
            <PopoverMenuItem @click="emitRichTextCommand('textIndent', '-1')">{{ t('ppt.decreaseFirstLineIndent') }}</PopoverMenuItem>
          </template>
          <Button last class="popover-btn"><IconDown /></Button>
        </Popover>
      </ButtonGroup>
      <div style="width: 10px;"></div>
      <ButtonGroup style="flex: 1;" passive>
        <Button first style="flex: 1;" v-tooltip="t('ppt.increaseParagraphIndent')" @click="emitRichTextCommand('indent', '+1')"><IconIndentRight /></Button>
        <Popover trigger="click" v-model:value="indentRightPanelVisible">
          <template #content>
            <PopoverMenuItem @click="emitRichTextCommand('textIndent', '+1')">{{ t('ppt.increaseFirstLineIndent') }}</PopoverMenuItem>
          </template>
          <Button last class="popover-btn"><IconDown /></Button>
        </Popover>
      </ButtonGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import emitter, { EmitterEvents } from '@/utils/emitter'
import { FONTS } from '@/configs/font'
import useTextFormatPainter from '@/hooks/useTextFormatPainter'
import message from '@/utils/message'
import { useI18n } from 'vue-i18n'

import TextColorButton from '@/components/TextColorButton.vue'
import CheckboxButton from '@/components/CheckboxButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import Select from '@/components/Select.vue'
import SelectGroup from '@/components/SelectGroup.vue'
import Divider from '@/components/Divider.vue'
import Popover from '@/components/Popover.vue'
import RadioButton from '@/components/RadioButton.vue'
import RadioGroup from '@/components/RadioGroup.vue'
import PopoverMenuItem from '@/components/PopoverMenuItem.vue'

const { t } = useI18n()

const { richTextAttrs, textFormatPainter } = storeToRefs(useMainStore())

const { toggleTextFormatPainter } = useTextFormatPainter()

const fontSizeOptions = [
  '12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px',
  '36px', '40px', '44px', '48px', '54px', '60px', '66px', '72px', '76px',
  '80px', '88px', '96px', '104px', '112px', '120px',
]

const emitRichTextCommand = (command: string, value?: string) => {
  emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action: { command, value } })
}

const bulletListPanelVisible = ref(false)
const orderedListPanelVisible = ref(false)
const indentLeftPanelVisible = ref(false)
const indentRightPanelVisible = ref(false)

const bulletListStyleTypeOption = ref(['disc', 'circle', 'square'])
const orderedListStyleTypeOption = ref(['decimal', 'lower-roman', 'upper-roman', 'lower-alpha', 'upper-alpha', 'lower-greek'])

const link = ref('')
const linkPopoverVisible = ref(false)

watch(richTextAttrs, () => linkPopoverVisible.value = false)

const openLinkPopover = () => {
  link.value = richTextAttrs.value.link
}
const updateLink = (link?: string) => {
  const linkRegExp = /^(https?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/
  if (!link || !linkRegExp.test(link)) return message.error(t('ppt.invalidLink'))

  emitRichTextCommand('link', link)
  linkPopoverVisible.value = false
}

const removeLink = () => {
  emitRichTextCommand('link')
  linkPopoverVisible.value = false
}
</script>

<style lang="scss" scoped>
.rich-text-base {
  user-select: none;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.font-size-btn {
  padding: 0;
}
.link-popover {
  width: 240px;

  .btns {
    margin-top: 10px;
    text-align: right;
  }
}
.list-wrap {
  width: 176px;
  color: #666;
  padding: 8px;
  margin: -12px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
.list {
  background-color: $lightGray;
  padding: 4px 4px 4px 20px;
  cursor: pointer;

  &:not(:nth-child(3n)) {
    margin-right: 8px;
  }

  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6) {
    margin-top: 8px;
  }

  &:hover {
    color: $themeColor;

    span {
      background-color: $themeColor;
    }
  }
}
.list-item {
  width: 24px;
  height: 12px;
  position: relative;
  font-size: 12px;
  top: -3px;

  span {
    width: 100%;
    height: 2px;
    display: inline-block;
    position: absolute;
    top: 8px;
    background-color: #666;
  }
}
.popover-btn {
  padding: 0 3px;
}
</style>