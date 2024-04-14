<template>
  <section
    class="w-full h-full flex-1 flex flex-col items-center justify-center"
  >
    <slot name="image">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0,0,256,256"
      >
        <g
          fill="#a3a3a3"
          fill-rule="nonzero"
          stroke="none"
          stroke-width="1"
          stroke-linecap="butt"
          stroke-linejoin="miter"
          stroke-miterlimit="10"
          stroke-dasharray=""
          stroke-dashoffset="0"
          font-family="none"
          font-weight="none"
          font-size="none"
          text-anchor="none"
          style="mix-blend-mode: normal"
        >
          <g transform="scale(5.12,5.12)">
            <path
              d="M21,3c-9.374,0 -17,7.626 -17,17c0,9.374 7.626,17 17,17c3.71133,0 7.137,-1.21035 9.93555,-3.23633l13.15039,13.15039l2.82812,-2.82812l-13.0293,-13.0293c2.55761,-2.97596 4.11523,-6.83399 4.11523,-11.05664c0,-9.374 -7.626,-17 -17,-17zM15,14c1.105,0 2,0.895 2,2c0,1.105 -0.895,2 -2,2c-1.105,0 -2,-0.895 -2,-2c0,-1.105 0.895,-2 2,-2zM27,14c1.105,0 2,0.895 2,2c0,1.105 -0.895,2 -2,2c-1.105,0 -2,-0.895 -2,-2c0,-1.105 0.895,-2 2,-2zM21,23c3.575,0 5.65128,2.23017 5.73828,2.32617c0.372,0.407 0.34355,1.04011 -0.06445,1.41211c-0.192,0.176 -0.43283,0.26172 -0.67383,0.26172c-0.271,0 -0.54128,-0.10917 -0.73828,-0.32617c-0.06,-0.064 -1.59672,-1.67383 -4.26172,-1.67383c-2.702,0 -4.24672,1.65683 -4.26172,1.67383c-0.371,0.409 -1.00311,0.43945 -1.41211,0.06445c-0.408,-0.372 -0.43745,-1.00511 -0.06445,-1.41211c0.086,-0.096 2.16328,-2.32617 5.73828,-2.32617z"
            ></path>
          </g>
        </g>
      </svg>
    </slot>
    <h4 :class="['font-extrabold text-neutral300 text-xl', contentClass]">
      {{ $t(content) }}
    </h4>
    <slot name="action"></slot>
  </section>
</template>
<script setup lang="ts">
interface Input {
  content: string;
  contentClass?: string;
}

const props = defineProps<Input>();
</script>
