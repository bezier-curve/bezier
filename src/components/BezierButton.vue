<template>
  <div href="javascript:;" class="bezier-button">
    <div class="button" v-show="!isFile" @click="handleClick()">
      {{title}}
    </div>
    <div class="file" v-show="isFile">
      <a>{{title}}</a>
      <input class="file-import" type="file" @change="handleChange()">
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'file'
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    isFile() {
      return this.type === 'file'
    }
  },
  methods: {
    handleClick () {
      this.$emit('handleClick')
    },
    handleChange () {
      const fileList = document.getElementsByClassName('file-import')[0].files;
      this.$emit('handleImport', fileList)
    }
  }
}
</script>
<style lang="sass" scoped>
.bezier-button
  position: relative
  display: inline-block
  border: 1px solid rgba(154, 154, 154, 1)
  border-radius: 4px
  width: 70px
  height: 28px
  color: #303133
  line-height: 28px
  text-align: center
  text-decoration: none
  text-indent: 0
  font-size: 14px
  margin-left: 10px
  cursor: pointer

  input
    position: absolute
    width: 70px
    top: 0
    left: 0
    bottom: 0
    opacity: 0
    cursor: pointer
.bezier-button:hover
  background: rgb(253, 253, 253)
  border-color: rgb(51, 121, 179)
  color: rgb(51, 121, 179)
  text-decoration: none
</style>