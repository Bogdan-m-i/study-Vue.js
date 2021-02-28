<template>
	<div>
		<div class="page-subtitle">
			<h4>Редактировать</h4>
		</div>

		<form @submit.prevent="submitHandler">
			<div class="input-field">
				<select ref="select" v-model="current">
					<option v-for="c of categories" :key="c.id" :value="c.id">
						{{c.name}}
					</option>
				</select>
				<label>Выберите категорию</label>
			</div>

			<div class="input-field">
				<input
					id="name"
					type="text"
					v-model="name"
					:class="{invalid: $v.name.$dirty && !$v.name.required}"
				>
				<label for="name">Название</label>
				<span
					class="helper-text invalid"
					v-if="$v.name.$dirty && !$v.name.required"
				>Введите название</span>
			</div>

			<div class="input-field">
				<input
					id="limit"
					type="number"
					v-model.number="limit"
					:class="{invalid: ($v.limit.$dirty && !$v.limit.minValue) || ($v.limit.$dirty && !$v.limit.required)}"
				>
				<label for="limit">Лимит</label>
				<span
					class="helper-text invalid"
					v-if="$v.limit.$dirty && !$v.limit.minValue"
				>Минимальная величина: {{$v.limit.$params.minValue.min}}</span>
				<span
					class="helper-text invalid"
					v-if="$v.limit.$dirty && !$v.limit.required"
				>Введите лимит</span>
			</div>

			<button class="btn waves-effect waves-light" type="submit">
				Обновить
				<i class="material-icons right">send</i>
			</button>
		</form>
	</div>
</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators'

export default {
	props: {
		categories: {
			type: Array,
			required: true,
		}
	},
	data: () => ({
		select: null,
		name: '',
		limit: '',
		current: null,
	}),
	validations: {
		name: {required},
		limit: {minValue: minValue(1), required},
	},
	methods: {
		async submitHandler() {
			if (this.$v.$invalid) {
				this.$v.$touch()
				return
			}

			try {
				const categoryData = {
					id: this.current,
					name: this.name,
					limit: this.limit,
				}
				await this.$store.dispatch('updateCategory', categoryData)
				this.$message(`Категория ${categoryData.name} обновлена`)
				this.$emit('updated')
			} catch (e) {
				console.log(e)
			}
		}
	},
	watch: {
		current(cId) {
			const {name, limit} = this.categories.find(c => c.id === cId)
			this.name = name
			this.limit = limit
			this.$nextTick(() => {window.M.updateTextFields()})
			this.$store.commit('setSelectId', cId)
		},
	},
	created() {
		this.current = this.$store.getters.selectId || this.categories[0].id
	},
	mounted() {
		this.select = window.M.FormSelect.init(this.$refs.select)
	},
	destroyed() {
		if (this.select && this.select.destroy) {
			this.select.destroy()
		}
	}
}
</script>

<style>

</style>