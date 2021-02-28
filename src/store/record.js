import firebase from 'firebase/app'

export default {
	actions: {
		async createRecord({dispatch, commit}, record) {
			try {
				const uid = await dispatch('getUid')
				return await firebase.database().ref(`/user/${uid}/records`).push(record)
			} catch (e) {
				commit('setError', e)
				throw e
			}
		},
		async fetchRecords({dispatch, commit}, start = '0', limit = 100) {
			try {
			const uid = await dispatch('getUid')
			const records = (await firebase.database().ref(`/user/${uid}/records`).orderByKey().startAt(start).limitToFirst(limit).once('value')).val() || {}


			// const token = await firebase.auth().currentUser.getIdToken(true)
			// const count = await fetch(`https://vue-crm-92a26-default-rtdb.firebaseio.com/user/${uid}/records.json?auth=${token}&shallow=true`, { method: 'GET' })
			// 	.then((res) => {
			// 		return res.json()
			// 	})
			// 	.then((res) => {
			// 		console.log(res)
			// 	})
			// console.log('count: ', count);

			
			return Object.keys(records).map((key) => ({...records[key], id: key}))
		} catch (e) {
				commit('setError', e)
				throw e
			}
		},
		async fetchRecordById({dispatch, commit}, id) {
			try {
			const uid = await dispatch('getUid')
			const record = (await firebase.database().ref(`/user/${uid}/records`).child(id).once('value')).val() || {}
			return {...record, id}
		} catch (e) {
				commit('setError', e)
				throw e
			}
		},
	}
}