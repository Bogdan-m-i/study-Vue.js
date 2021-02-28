<template>
	<div>
		<div class="page-subtitle">
			<h4>Создать</h4>
		</div>

		<form @submit.prevent="submitHandler">
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
				Создать
				<i class="material-icons right">send</i>
			</button>
		</form>
	</div>
</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators'
export default {
	data: () => ({
		name: '',
		limit: '',
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
				const category = await this.$store.dispatch('createCategory', {
					name: this.name,
					limit: this.limit,
				})
				this.$message(`Создана категория - ${category.name}`)
				this.name = ''
				this.limit = ''
				this.$v.$reset()
				this.$emit('created', category)
			} catch(e) {
				console.log(e)
			}
		}
	}
}
</script>

<style>

</style>