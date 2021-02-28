import store from '../store/index'
import ru from '@/locales/ru'
import en from '@/locales/en'

const locales = {
	'ru-RU': ru,
	'en-US': en,
}

export default function localizeFilter(key) {
	const locale = store.getters.info.locale || 'ru-RU'
	return locales[locale][key] || `[localize error]: key ${key} not found`
}