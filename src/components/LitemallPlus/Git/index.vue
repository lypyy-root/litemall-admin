<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'LitemallPlusGit',
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