<template>
  <div class="editor-header">
    <div class="left">
      <Popover
        trigger="click"
        placement="bottom-start"
        v-model:value="mainMenuVisible"
      >
        <template #content>
          <!-- <PopoverMenuItem @click="openAIPPTDialog(); mainMenuVisible = false">AI 生成 PPT（测试版）</PopoverMenuItem> -->
          <!-- <FileInput accept="application/vnd.openxmlformats-officedocument.presentationml.presentation"  @change="files => {
            importPPTXFile(files)
            mainMenuVisible = false
          }">
            <PopoverMenuItem>导入 pptx 文件（测试版）</PopoverMenuItem>
          </FileInput>
          <FileInput accept=".pptist"  @change="files => {
            importSpecificFile(files)
            mainMenuVisible = false
          }">
            <PopoverMenuItem>导入 pptist 文件</PopoverMenuItem>
          </FileInput>
          <PopoverMenuItem @click="setDialogForExport('pptx')">导出文件</PopoverMenuItem> -->
          <PopoverMenuItem
            @click="
              resetSlides();
              mainMenuVisible = false;
            "
            >{{ t('ppt.resetSlides') }}</PopoverMenuItem
          >
          <PopoverMenuItem
            @click="
              openMarkupPanel();
              mainMenuVisible = false;
            "
            >{{ t('ppt.slideTypeAnnotation') }}</PopoverMenuItem
          >
          <!-- <PopoverMenuItem @click="goLink('https://github.com/pipipi-pikachu/PPTist/issues')">意见反馈</PopoverMenuItem> -->
          <!-- <PopoverMenuItem @click="goLink('https://github.com/pipipi-pikachu/PPTist/blob/master/doc/Q&A.md')">常见问题</PopoverMenuItem> -->
          <PopoverMenuItem
            @click="
              mainMenuVisible = false;
              hotkeyDrawerVisible = true;
            "
            >{{ t('ppt.shortcuts') }}</PopoverMenuItem
          >

          <PopoverMenuItem @click="backCenter">{{ t('ppt.back') }}</PopoverMenuItem>
        </template>
        <div class="menu-item"><IconHamburgerButton class="icon" /></div>
      </Popover>

      <!-- <div class="title">
        <Input
          class="title-input"
          ref="titleInputRef"
          v-model:value="titleValue"
          @blur="handleUpdateTitle()"
          v-if="editingTitle"
        ></Input>
        <div class="title-text" @click="startEditTitle()" :title="title" v-else>
          {{ title }}
        </div>
      </div> -->
    </div>

    <div class="right">
      <div class="group-menu-item">
        <div
          class="menu-item"
          v-tooltip="t('ppt.slideshow')"
          @click="enterScreening()"
        >
          <IconPpt class="icon" />
        </div>
        <Popover trigger="click" center>
          <template #content>
            <PopoverMenuItem @click="enterScreeningFromStart()">{{ t('ppt.startFromBeginning') }}</PopoverMenuItem>
            <PopoverMenuItem @click="enterScreening()">{{ t('ppt.startFromCurrent') }}</PopoverMenuItem>
          </template>
          <div class="arrow-btn"><IconDown class="arrow" /></div>
        </Popover>
      </div>
      <div
        class="menu-item"
        v-tooltip="t('ppt.export')"
        @click="downloadPPTX(slides, true, true)"
      >
        <IconDownload class="icon" />
      </div>
      <!-- <a
        class="github-link"
        v-tooltip="'Copyright © 2020-PRESENT pipipi-pikachu'"
        href="https://github.com/pipipi-pikachu/PPTist"
        target="_blank"
      >
        <div class="menu-item"><IconGithub class="icon" /></div>
      </a> -->
    </div>

    <Drawer
      :width="320"
      v-model:visible="hotkeyDrawerVisible"
      placement="right"
    >
      <HotkeyDoc />
      <template v-slot:title>{{ t('ppt.shortcuts') }}</template>
    </Drawer>

    <FullscreenSpin :loading="exporting" :tip="t('ppt.importing')" />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue";
import { storeToRefs } from "pinia";
import { useMainStore, useSlidesStore } from "@/store";
import useScreening from "@/hooks/useScreening";
import useImport from "@/hooks/useImport";
import useSlideHandler from "@/hooks/useSlideHandler";
import type { DialogForExportTypes } from "@/types/export";
import useExport from "@/hooks/useExport";
import HotkeyDoc from "./HotkeyDoc.vue";
import FileInput from "@/components/FileInput.vue";
import FullscreenSpin from "@/components/FullscreenSpin.vue";
import Drawer from "@/components/Drawer.vue";
import Input from "@/components/Input.vue";
import Popover from "@/components/Popover.vue";
import PopoverMenuItem from "@/components/PopoverMenuItem.vue";
import { useI18n } from 'vue-i18n'

const mainStore = useMainStore();
const slidesStore = useSlidesStore();
const { title } = storeToRefs(slidesStore);
const { slides } = storeToRefs(slidesStore);
const { enterScreening, enterScreeningFromStart } = useScreening();
const { exporting } = useImport();
const { resetSlides } = useSlideHandler();
const { downloadPPTX } = useExport();
const mainMenuVisible = ref(false);
const hotkeyDrawerVisible = ref(false);
const editingTitle = ref(false);
const titleInputRef = ref<InstanceType<typeof Input>>();
const titleValue = ref("");
const { t } = useI18n()

const startEditTitle = () => {
  titleValue.value = title.value;
  editingTitle.value = true;
  nextTick(() => titleInputRef.value?.focus());
};

const handleUpdateTitle = () => {
  slidesStore.setTitle(titleValue.value);
  editingTitle.value = false;
};

const goLink = (url: string) => {
  window.open(url);
  mainMenuVisible.value = false;
};

const setDialogForExport = (type: DialogForExportTypes) => {
  mainStore.setDialogForExport(type);
  mainMenuVisible.value = false;
};

const openMarkupPanel = () => {
  mainStore.setMarkupPanelState(true);
};

const openAIPPTDialog = () => {
  mainStore.setAIPPTDialogState(true);
};

const backCenter = () => {
  window.parent.postMessage("backCenter", "*");
};
</script>

<style lang="scss" scoped>
.editor-header {
  background-color: #fff;
  user-select: none;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
}
.left,
.right {
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu-item {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 0 10px;
  border-radius: $borderRadius;
  cursor: pointer;

  .icon {
    font-size: 18px;
    color: #666;
  }
  .text {
    width: 18px;
    text-align: center;
    font-size: 16px;
  }

  &:hover {
    background-color: #f1f1f1;
  }
}
.group-menu-item {
  height: 30px;
  display: flex;
  margin: 0 8px;
  padding: 0 2px;
  border-radius: $borderRadius;

  &:hover {
    background-color: #f1f1f1;
  }

  .menu-item {
    padding: 0 3px;
  }
  .arrow-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
.title {
  height: 30px;
  margin-left: 2px;
  font-size: 13px;

  .title-input {
    width: 200px;
    height: 100%;
    padding-left: 0;
    padding-right: 0;

    ::v-deep(input) {
      height: 28px;
      line-height: 28px;
    }
  }
  .title-text {
    min-width: 20px;
    max-width: 400px;
    line-height: 30px;
    padding: 0 6px;
    border-radius: $borderRadius;
    cursor: pointer;

    @include ellipsis-oneline();

    &:hover {
      background-color: #f1f1f1;
    }
  }
}
.github-link {
  display: inline-block;
  height: 30px;
}
</style>
