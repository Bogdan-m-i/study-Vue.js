<template>
	<div>
		<div class="page-title">
			<h3>Категории</h3>
		</div>
		<section>
			<Loader v-if="loading" />
			<div class="row" v-else>
				<div class="col s12 m6">
					<CategoryCreate @created="addNewCategory" />
				</div>
				<div class="col s12 m6">
					<CategoryEdit
						v-if="categories.length"
						@updated="updateCategory"
						:categories="categories"
						:key="categories.length + updateCount"
					/>
					<p v-else>Категорий пока нет</p>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate'
import CategoryEdit from '@/components/CategoryEdit'

export default {
	name: 'categories',
	metaInfo() {
		return {
			title: this.$title('Menu_categories')
		}
	},
	data: () => ({
		categories: [],
		loading: true,
		updateCount: 0,
	}),
	async mounted() {
		this.categories = await this.$store.dispatch('fetchCategories')
		this.loading = false
	},
	methods: {
		addNewCategory(category) {
			this.categories.push(category)
		},
		async updateCategory() {
			this.categories = await this.$store.dispatch('fetchCategories')
			this.updateCount++
		}
	},
	components: {
		CategoryCreate, CategoryEdit
	}
}
</script>

<style>

</style>