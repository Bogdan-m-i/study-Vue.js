<template>
<div>
	<div class="page-title">
		<h3>История записей</h3>
	</div>

	<div class="history-chart">
		<canvas ref="canvas"></canvas>
	</div>

	<Loader v-if="loading" />

	<p class="center" v-else-if="!records.length">
		Записей пока нет
		<br>
		<router-link to="/record">Создать</router-link>
	</p>

	<section v-else>
		<HistoryTable :records="items" />

		<Paginate
			v-model="page"
			:page-count="pageCount"
			:click-handler="pageChangeHandler"
			:prev-text="'Назад'"
			:next-text="'Вперед'"
			:container-class="'center pagination'"
			:page-class="'waves-effect'"
			:page-range="pageSize"
		>
		</Paginate>
	</section>
</div>
</template>

<script>
import HistoryTable from '@/components/HistoryTable'
import Loader from '@/components/app/Loader.vue'
import paginationMixin from '@/mixins/pagination.mixin.js'
import {Pie} from 'vue-chartjs'

export default {
	name: 'history',
	metaInfo() {
		return {
			title: this.$title('Menu_history')
		}
	},
	extends: Pie,
	mixins: [paginationMixin],
	data: () => ({
		loading: true,
		records: [],
		categories: [],

	}),
	async mounted() {
		this.records = await this.$store.dispatch('fetchRecords')
		this.categories = await this.$store.dispatch('fetchCategories')

		this.setup()

		this.loading = false
	},
	components: {
		HistoryTable, Loader
	},
	methods: {
		setup() {
			this.setupPagination(this.records.map((rec) => {
				return {
					...rec,
					categoryName: this.categories.find(c => c.id === rec.categoryId).name,
					typeClass: rec.type === 'income' ? 'green' : 'red',
					typeText: rec.type === 'income' ? 'Доход' : 'Расход',
					date: new Date(rec.date)
				}
			}))

			this.renderChart({
				labels: this.categories.map(c => c.name),
				datasets: [{
					label: 'Расходы по категориям',
					data: this.categories.map(c => {
						return this.records.reduce((total, r) => {
							if (r.categoryId === c.id && r.type === 'outcome') {
								total += +r.amount
							}
							return total
						}, 0)
					}),
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)',
						'rgba(255, 159, 64, 0.2)',
						'rgba(140, 240, 34, 0.2)',
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)',
						'rgba(140, 240, 34, 1)',
					],
					borderWidth: 1
				}]
			})

		},
	}
}
</script>

<style>
	.waves-effect:focus,
	a:focus {
		outline: none;
	}
	.pagination {
		user-select: none;
	}
</style>