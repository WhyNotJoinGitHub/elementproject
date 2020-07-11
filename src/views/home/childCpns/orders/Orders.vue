<template>
	<div class="orders">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-row :gutter="20">
				<el-col :span="7">
					<el-input placeholder="请输入内容"
										v-model="queryInfo.query"
										clearable
										@clear="getOrdersList">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: "Orders",
		data() {
			return {
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 5
				}
			}
		},
		created() {
			this.getOrdersList()
		},
		methods: {
			//获取订单数据列表
			async getOrdersList() {
				const {data: res} = await this.$http.get('orders', {
					params: {
						pagenum:this.queryInfo.pagenum,
						pagesize:this.queryInfo.pagesize
					}
				})
				console.log(res);
			}
		}
	}
</script>

<style scoped>

</style>