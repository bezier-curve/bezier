<template>
  <el-dialog title="生成代码" :visible.sync="isVisible">
    <el-input
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4}"
      placeholder="请输入内容"
      v-model="code">
    </el-input>
    <el-button type="primary" @click="handleCopy">复制代码</el-button>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleCopy() {
      this.$message({
        message: '复制代码成功',
        type: 'success'
      });
    }
  }
}
</script>

<style>

</style>