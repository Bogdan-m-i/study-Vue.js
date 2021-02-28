<template>
<div>
	<div class="page-title">
		<h3>{{'ProfileTitle' | localize}}</h3>
	</div>

	<form class="form" @submit.prevent="onSubmit">
		<div class="input-field">
			<input
				id="name"
				type="text"
				v-model.trim="name"
				:class="{invalid: ($v.name.$dirty && !$v.name.required)}"
			>
			<label for="name">{{'Name' | localize}}</label>
			<small
				class="helper-text invalid"
				v-if="$v.name.$dirty && !$v.name.required"
			>{{'EnterName' | localize}}</small>
		</div>
		
		<div class="input-field">
			<div class="switch">
				<label>
					Eng
					<input type="checkbox" v-model="isRuLocale">
					<span class="lever"></span>
					Рус
				</label>
			</div>
		</div>

		<button class="btn waves-effect waves-light" type="submit">
			{{'Update' | localize}}
			<i class="material-icons right">send</i>
		</button>
	</form>
</div>
</template>

<script>
import {mapGetters} from 'vuex'
import { required } from "vuelidate/lib/validators";

export default {
	metaInfo() {
		return {
			title: this.$title('ProfileTitle')
		}
	},
	data: () => ({
		name: '',
		isRuLocale: true,
	}),
	mounted() {
		this.name = this.info.name
		this.isRuLocale = this.info.locale === 'ru-RU'
		this.$nextTick(() => {window.M.updateTextFields()})
	},
	computed: {
		...mapGetters(['info'])
	},
	validations: {
		name: {required},
	},
	methods: {
		async onSubmit() {
			if (this.$v.$invalid) {
				this.$v.$touch()
				return
			}
			
			try {
				this.$message('Обновляю...')
				await this.$store.dispatch('updateInfo', {
					name: this.name,
					locale: this.isRuLocale ? 'ru-RU' : 'en-US'	
				})
				this.$message('Готово')
			} catch(e) {
				console.log(e)
			}
		}
	},
}
</script>

<style>

</style>