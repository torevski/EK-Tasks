<template>
  <div ref="containerRef" class="avatar">
    <img v-if="image" :src="image" class="image" :alt="name" />
    <span v-else-if="name" class="initials"> {{ name[0] }} </span>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'

  const props = defineProps({
    image: {
      type: String,
      default: ''
    },

    name: {
      type: String,
      default: ''
    }
  })

  const containerRef = ref()
  const fontSize = ref('1rem')

  onMounted(() => {
    fontSize.value = `${containerRef.value.clientWidth * 0.5}px`
  })

  const bgColor = computed(() => {
    if (props.image) {
      return 'transparent'
    }
    const hue =
      props.name.split('').reduce((acc, cur) => {
        return acc + cur.charCodeAt(0)
      }, 0) % 360
    return `hsla(${hue}, 60%, 50%, 1)`
  })
</script>

<style scoped>
  .avatar {
    width: 20px;
    aspect-ratio: 1;
    border-radius: 20%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: v-bind(bgColor);
  }

  .image {
    width: 10px;
    height: 10px;
    object-fit: cover;
  }

  .initials {
    font-size: v-bind(fontSize);
    color: white;
    font-family: sans-serif;
    user-select: none;
  }
</style>