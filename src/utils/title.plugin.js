export default {
	install(Vue) {
		Vue.prototype.$title = function(titleKey) {
			const appName = process.env.VUE_APP_TITLE

			return `${this.$options.filters.localize(titleKey)} | ${appName}`
		}
	}
}