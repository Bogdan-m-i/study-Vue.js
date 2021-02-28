export default {
	data() {
		return {
			page: +this.$route.query.page || 1,
			pageSize: 3,
			pageCount: 0,
			allItems: [],
			items: [],
		}
	},
	methods: {
		setupPagination(allItems) {
			let chunk = []
			allItems.forEach((el, key, arr) => {
				chunk.push(el)
				if (((key + 1) % this.pageSize) === 0) {
					this.allItems.push(chunk)
					chunk = []
				} else if ((key + 1) === arr.length) {
					this.allItems.push(chunk)
				}
			})

			this.pageCount = this.allItems.length
			if (this.page > this.pageCount || this.page < 1) {
				this.page = 1
				this.$router.push(`${this.$route.path}?page=${this.page}`)
			}
			this.items = this.allItems[this.page - 1] || this.allItems[0]
		},
		pageChangeHandler(page) {
			this.$router.push(`${this.$route.path}?page=${page}`)
			this.items = this.allItems[page - 1] || this.allItems[0]
		}
	}
} 