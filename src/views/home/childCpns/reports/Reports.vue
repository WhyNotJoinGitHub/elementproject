<template>
	<div class="reports">
		图表
	</div>
</template>

<script>
	export default {
		name: "Reports",
		data() {
			return {}
		},
		created() {
			this.getData()
		},
		methods: {
			async getData() {
				const {data: res} = await this.$http.get('reports/type/1')
				console.log(res);
			}
		}
	}
</script>

<style scoped>

</style>