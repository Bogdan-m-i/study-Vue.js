<template>
<div>
	<div class="page-title">
		<h3>Планирование</h3>
		<h4>{{info.bill | currency}}</h4>
	</div>

	<Loader v-if="loading" />

	<p class="center" v-else-if="!categories.length">Категорий пока нет. <router-link to="/categories">Добавить категорию</router-link></p>

	<section v-else>
		<div v-for="c in categories" :key="c.id">
			<p>
				<strong>{{c.name}}:</strong>
				Потрачено {{c.spend | currency}} из {{c.limit | currency}}
			</p>
			<div class="progress" v-tooltip="c.tooltipText">
				<div class="determinate" :class="[c.progressColor]" :style="{width: c.progressPercent+'%'}"></div>
			</div>
		</div>
	</section>
</div>
</template>

<script>
export default {
	name: 'planning',
	metaInfo() {
		return {
			title: this.$title('Menu_planning')
		}
	},
	data: () => ({
		loading: true,
		categories: [],
	}),
	computed: {
		info() { return this.$store.getters.info },
	},
	async mounted() {
		const records = await this.$store.dispatch('fetchRecords')
		const categories = await this.$store.dispatch('fetchCategories')
		this.loading = false

		this.categories = categories.map(c => {
			const spend = records
				.filter(r => r.categoryId === c.id)
				.reduce((total, r) => {
					if (r.type === 'outcome') {
						return total += +r.amount
					} else if (r.type === 'income') {
						return total -= +r.amount
					}
				}, 0)
			const percent = 100 * spend / c.limit
			const progressPercent = percent > 100 ? 100 : percent < 0 ? 0 : percent
			const progressColor = percent < 60 ? 'green' : percent < 100 ? 'yellow' : 'red'
			
			const tooltipVal = c.limit - spend
			const tooltipText = `${tooltipVal < 0 ? 'Превышение на' : 'Осталось'} ${this.$options.filters.currency(Math.abs(tooltipVal))}`
			return {
				...c,
				progressPercent,
				progressColor,
				spend,
				tooltipText,
			}
		})

	},
}
</script>

<style>

</style>