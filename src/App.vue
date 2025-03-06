<template>
  <template v-if="slides.length">
    <Screen v-if="screening" />
    <Editor v-else-if="_isPC" />
    <Mobile v-else />
  </template>
  <FullscreenSpin tip="数据初始化中，请稍等 ..." v-else loading :mask="false" />
</template>

<script lang="ts" setup>
import { onMounted, watch, nextTick, ref, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import {
  useScreenStore,
  useMainStore,
  useSnapshotStore,
  useSlidesStore,
} from "@/store";
import { LOCALSTORAGE_KEY_DISCARDED_DB } from "@/configs/storage";
import { deleteDiscardedDB } from "@/utils/database";
import { isPC } from "@/utils/common";
import type { Slide } from "@/types/slides";
import message from "./utils/message";
import api from "@/services";
import _ from "lodash";
import Editor from "./views/Editor/index.vue";
import Screen from "./views/Screen/index.vue";
import Mobile from "./views/Mobile/index.vue";
import FullscreenSpin from "@/components/FullscreenSpin.vue";
import useImport from "@/hooks/useImport";
import useExport from "@/hooks/useExport";

const { exportSpecificFile, exportPPTX } = useExport();
const { importPPTXFile } = useImport();
const _isPC = isPC();

const mainStore = useMainStore();
const slidesStore = useSlidesStore();
const snapshotStore = useSnapshotStore();
const { databaseId } = storeToRefs(mainStore);
const { slides } = storeToRefs(slidesStore);
const { screening } = storeToRefs(useScreenStore());

const ipptId = ref<any>("");
const firstPost = ref<boolean>(false);

const timer = ref<any>(null);

watch(
  () => slides.value,
  (val, old) => {
    if (firstPost.value) {
      return;
    }
    nextTick(() => {
      firstPost.value = true;
      saveServer();
    });
  },
  { deep: true }
);

if (import.meta.env.MODE !== "development") {
  window.onbeforeunload = () => false;
}

onMounted(async () => {
  const url = location.search;
  const urlParams = new URLSearchParams(url);

  ipptId.value = urlParams.get("id");
  const firstUrl = urlParams.get("url");

  const res = await api.getPPTinfo({ id: ipptId.value });
  let { ppt_url } = res.info;
  const obj = JSON.parse(ppt_url);

  importPPTXFile(obj.pptList || obj.url || firstUrl);

  await deleteDiscardedDB();
  snapshotStore.initSnapshotDatabase();

  timer.value = setInterval(() => {
    saveServer();
  }, 10000);
});

onUnmounted(() => {
  clearInterval(timer.value);
});

const saveServer = async () => {
  const file1 = await exportPPTX(slides.value, true, true);
  const file2 = await exportSpecificFile(slides.value);
  try {
    const [res1, res2] = await Promise.all([
      api.uploadFile(file1),
      api.uploadFile(file2),
    ]);

    const ppt_url = res1.info.file_url;
    const pptist = res2.info.file_url;

    api.resultupdate({ ppt_url, pptist, id: ipptId.value });
  } catch (e) {}
};

// 应用注销时向 localStorage 中记录下本次 indexedDB 的数据库ID，用于之后清除数据库
window.addEventListener("unload", () => {
  const discardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB);
  const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : [];

  discardedDBList.push(databaseId.value);

  const newDiscardedDB = JSON.stringify(discardedDBList);
  localStorage.setItem(LOCALSTORAGE_KEY_DISCARDED_DB, newDiscardedDB);
});
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
