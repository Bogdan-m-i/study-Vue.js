<template>
<div>
	<div class="page-title">
		<h3>Новая запись</h3>
	</div>

	<Loader v-if="loading" />

	<p class="center" v-else-if="!categories.length">Категорий пока нет. <router-link to="/categories">Добавить категорию</router-link></p>

	<form class="form" @submit.prevent="submitHandler" v-else>
		<div class="input-field">
			<select ref="select" v-model="category">
				<option v-for="c of categories" :key="c.id" :value="c.id">
					{{c.name}}
				</option>
			</select>
			<label>Выберите категорию</label>
		</div>

		<p>
			<label>
				<input
					class="with-gap"
					name="type"
					type="radio"
					value="income"
					v-model="type"
				/>
				<span>Доход</span>
			</label>
		</p>

		<p>
			<label>
				<input
					class="with-gap"
					name="type"
					type="radio"
					value="outcome"
					v-model="type"
				/>
				<span>Расход</span>
			</label>
		</p>

		<div class="input-field">
			<input
				id="amount"
				type="number"
				v-model.number="amount"
				:class="{invalid: ($v.amount.$dirty && !$v.amount.minValue) || ($v.amount.$dirty && !$v.amount.required)}"
			>
			<label for="amount">Сумма</label>
			<span
				class="helper-text invalid"
				v-if="$v.amount.$dirty && !$v.amount.minValue"
			>Минимальная величина: {{$v.amount.$params.minValue.min}}</span>
			<span
				class="helper-text invalid"
				v-if="$v.amount.$dirty && !$v.amount.required"
			>Введите лимит</span>
		</div>

		<div class="input-field">
			<input
				id="description"
				type="text"
				v-model="description"
				:class="{invalid: $v.description.$dirty && !$v.description.required}"
			>
			<label for="description">Описание</label>
			<span
				class="helper-text invalid"
				v-if="$v.description.$dirty && !$v.description.required"
			>Введите описание</span>
		</div>

		<button class="btn waves-effect waves-light" type="submit">
			Создать
			<i class="material-icons right">send</i>
		</button>
	</form>
</div>
</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators'
import {mapGetters} from 'vuex'
export default {
	name: 'record',
	metaInfo() {
		return {
			title: this.$title('Menu_newRecord')
		}
	},
	data: () => ({
		loading: true,
		categories: [],
		category: null,
		select: null,
		type: 'outcome',
		amount: '',
		description: '',
	}),
	computed: {
		...mapGetters(['info']), //info() { return this.$store.getters.info },
		canCreateRecord() {
			if (this.type === 'income') {
				return true
			}

			return this.info.bill >= this.amount
		},
	},
	methods: {
		async submitHandler() {
			if (this.$v.$invalid) {
				this.$v.$touch()
				return
			}

			if (this.canCreateRecord) {

				try {
					await this.$store.dispatch('createRecord', {
						categoryId: this.category,
						amount: this.amount,
						description: this.description,
						type: this.type,
						date: new Date().toJSON()
					})

					let bill = null
					if (this.type === 'income') {
						bill = this.info.bill + this.amount
						this.$message(`Запись создана. +${this.$options.filters.currency(this.amount)}`)
					} else if (this.type === 'outcome') {
						bill = this.info.bill - this.amount
						this.$message(`Запись создана. -${this.$options.filters.currency(this.amount)}`)
					}

					await this.$store.dispatch('updateInfo', {bill})
					this.$v.$reset()
					this.amount = ''
					this.description = ''
				} catch (e) {
					console.log(e)
				}
				
			} else {
				this.$message(`Недостаточно средств на счете (Осталось: ${this.$options.filters.currency(this.info.bill)})`)
			}
		}
	},
	async mounted() {
		this.categories = await this.$store.dispatch('fetchCategories')
		this.category = this.categories[0].id;
		this.loading = false

		this.$nextTick(() => {
			this.select = window.M.FormSelect.init(this.$refs.select)
		})
	},
	destroyed() {
		if (this.select && this.select.destroy) {
			this.select.destroy()
		}
	},
	validations: {
		amount: {minValue: minValue(1), required},
		description: {required},
	},
}
</script>

<style>

</style>