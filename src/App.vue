<template>
  <template v-if="slides.length">
    <Screen v-if="screening" />
    <Editor v-else-if="_isPC" />
    <Mobile v-else />
  </template>
  <FullscreenSpin :tip="t('ppt.wait')" v-else loading :mask="false" />
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
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();

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
const url = location.search;
const urlParams = new URLSearchParams(url);

const lang = urlParams.get("lang");

locale.value = lang;
console.log(locale.value);
watch(
  () => slides.value,
  (val, old) => {
    if (firstPost.value) {
      return;
    }
    // nextTick(() => {
    //   firstPost.value = true;
    //   saveServer();
    // });
  },
  { deep: true }
);

if (import.meta.env.MODE !== "development") {
  window.onbeforeunload = () => false;
}

onMounted(async () => {
  const url = location.search;
  const urlParams = new URLSearchParams(url);

  const lang = urlParams.get("lang");
  // ipptId.value = urlParams.get("id");
  // const firstUrl = urlParams.get("url");

  // const res = await api.getPPTinfo({ id: ipptId.value });
  // let { ppt_url, ppt_name } = res.info;
  // const obj = JSON.parse(ppt_url);
  // slidesStore.setTitle(ppt_name);
  // importPPTXFile(obj.url || firstUrl);

  // await deleteDiscardedDB();
  // snapshotStore.initSnapshotDatabase();

  // timer.value = setInterval(() => {
  //   if (firstPost.value) {
  //     saveServer();
  //   }
  // }, 10000);

  slidesStore.setSlides([
    {
      id: "h5sB6aRGVb",
      elements: [
        {
          type: "shape",
          id: "l6VJAjABe1",
          width: 169.31212598425196,
          height: 169.31212598425196,
          left: 632.380997375328,
          top: 214.1270341207349,
          viewBox: [126.98409448818897, 126.98409448818897],
          path: " M31.74606299212598,0 L95.23811023622046,0 L126.98409448818897,126.98409448818897 L0,126.98409448818897z",
          fill: "#5b9bd5",
          fixedRatio: false,
          rotate: 0,
          outline: {
            color: "#00000000",
            width: 1,
            style: "solid",
          },
          text: {
            content: "",
            defaultFontName: "",
            defaultColor: "#333",
            align: "top",
          },
          flipH: false,
          flipV: false,
          special: true,
          opacity: 0.4,
        },
      ],
      background: {
        type: "solid",
        color: "#FFFFFF",
      },
      remark: "",
    },
  ]);
});

onUnmounted(() => {
  clearInterval(timer.value);
});

const saveServer = async () => {
  const file1 = await exportPPTX(slides.value, true, true);
  // const file2 = await exportSpecificFile(slides.value);
  try {
    const res1 = await api.uploadFile(file1);

    const ppt_url = res1.info.file_url;
    // const pptist = res2.info.file_url;

    api.resultupdate({ ppt_url, pptist: "xxx", id: ipptId.value });
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
