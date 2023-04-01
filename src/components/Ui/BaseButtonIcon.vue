<template>
  <!-- <button 
    class="
      flex justify-center items-center
      border dark:border-neutral-800
      hover:bg-green-600 hover:text-white dark:fill-white hover:fill-white transition-colors
      rounded p-2 h-min
    "
  > -->
  <button
    class="
      p-2
      dark:bg-neutral-900
      shadow-sm rounded-lg border dark:border-neutral-800
      dark:fill-white hover:bg-green-600 hover:fill-white transition-colors
    "
  >
    <slot></slot>
  </button>
</template>
