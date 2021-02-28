import firebase from 'firebase/app'

export default {
	state: {
		selectId: null,
	},
	mutations: {
		setSelectId(state, id) {
			state.selectId = id
		}
	},
	getters: {
		selectId: s => s.selectId
	},
	actions: {
		async createCategory({commit, dispatch}, {name, limit}) {
			try {
				const uid = await dispatch('getUid')
				const category = await firebase.database().ref(`/user/${uid}/categories`).push({name, limit})
				return {name, limit, id: category.key}
			} catch (e) {
				commit('setError', e)
				console.log(e)
			}
		},
		async fetchCategories({commit, dispatch}) {
			try {
				const uid = await dispatch('getUid')
				const categories = (await firebase.database().ref(`/user/${uid}/categories`).once('value')).val() || {}

				return Object.keys(categories).map((key) => ({...categories[key], id: key}))
			} catch (e) {
				commit('setError', e)
				console.log(e)
			}
		},
		async fetchCategoryById({commit, dispatch}, id) {
			try {
				const uid = await dispatch('getUid')
				const category = (await firebase.database().ref(`/user/${uid}/categories`).child(id).once('value')).val() || {}

				return {...category, id}
			} catch (e) {
				commit('setError', e)
				console.log(e)
			}
		},
		async updateCategory({commit, dispatch}, {name, limit, id}) {
			try {
				const uid = await dispatch('getUid')
				await firebase.database().ref(`/user/${uid}/categories`).child(id).update({name, limit})
			} catch (e) {
				commit('setError', e)
				console.log(e)
			}
		}
	}
}