<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'LitemallPlusDoc',
  data() {
    return {
      url: 'https://gitee.com/JoyAtMeeting/litemall-plus'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>