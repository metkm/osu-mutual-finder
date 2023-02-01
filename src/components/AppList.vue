<script setup lang="ts">
import { ref, toRefs, computed, onMounted } from 'vue';

const props = defineProps<{
  items: any[],
  itemHeight: number
}>();

const { items: baseItems, itemHeight } = toRefs(props);

const nodePadding = 10;

const scrollTop = ref(0);
const rootElement = ref<HTMLElement | null>(null);
const rootElementHeight = ref(0);

const totalHeight = computed(() => itemHeight.value * baseItems.value.length);
const startOffset = computed(() => {
  let start = Math.floor(scrollTop.value / itemHeight.value) - nodePadding;
  return Math.max(start, 0);
})
const showCount = computed(() => {
  let count = Math.ceil(rootElementHeight.value / itemHeight.value); // the amount could be showed on screen
  return count + (nodePadding * 2) + 2 // {nodePadding} items before viewport + viewport items + {nodePadding} items after viewport
})

const items = computed(() => {
  return baseItems.value.slice(
    startOffset.value,
    startOffset.value + showCount.value
  )
})

const scrollHandler = (event: UIEvent) => {
  let target = event.target as HTMLElement;
  scrollTop.value = target.scrollTop;
}

const resizeHandler = () => {
  if (!rootElement.value) return;
  rootElementHeight.value = rootElement.value.clientHeight;
}

onMounted(() => {
  new ResizeObserver(resizeHandler).observe(rootElement.value as Element)
})
</script>

<template>
  <div ref="rootElement" class="overflow-y-auto" @scroll="scrollHandler">
    <ul aria-label="user list" class="" :style="{
      height: `${totalHeight}px`,
      paddingTop: `${startOffset * itemHeight}px`
    }">
      <slot v-for="(item, index) in items" :item="item" :index="index"></slot>
    </ul>
  </div>
</template>
