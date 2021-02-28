<template>
<ul class="sidenav app-sidenav" :class="{open: isOpen}">
	<router-link
		v-for="link in links"
		:key="link.url"
		tag="li"
		active-class="active"
		:to="link.url"
		:exact="link.exact"
	>
		<a href="#" class="waves-effect waves-orange pointer">{{link.title | localize}}</a>
	</router-link>
</ul>
</template>

<script>
export default {
	props: ['isOpen'],
	data: () => ({
		links: [
			{title: 'Menu_bill', url: '/', exact: true},
			{title: 'Menu_history', url: '/history'},
			{title: 'Menu_planning', url: '/planning'},
			{title: 'Menu_newRecord', url: '/record'},
			{title: 'Menu_categories', url: '/categories'},
		]
	})
}
</script>

<style>

</style>