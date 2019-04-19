const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
	GraphQLID
} = require('graphql')

const axios = require('axios')

const customers = [
	{
		id: '1',
		name: 'Pedro',
		email: 'pedro@gmail.com',
		post: { post_id: '1', post_title: 'Pedro', post_date: 'April' }
	},
	{
		id: '2',
		name: 'Juan',
		email: 'juan@gmail.com',
		post: { post_id: '1', post_title: 'Pedro', post_date: 'April' }
	},
	{ id: '3', name: 'Jose', email: 'jose@gmail.com', post: { post_id: '1', post_title: 'Pedro', post_date: 'April' } },
	{
		id: '4',
		name: 'Jerry',
		email: 'jerry@gmail.com',
		post: { post_id: '1', post_title: 'Pedro', post_date: 'April' }
	}
]

const PostType = new GraphQLObjectType({
	name: 'Post',
	fields: () => ({
		post_id: { type: GraphQLID },
		post_title: { type: GraphQLString },
		post_date: { type: GraphQLString }
	})
})

const CustomerType = new GraphQLObjectType({
	name: 'Customer',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		post: {
			type: PostType,
			resolve(parentValue, args) {
				return axios.get('http://localhost:3000/posts/' + parentValue.postId).then(res => res.data)
			}
		}
	})
})

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		customer: {
			type: CustomerType,
			args: {
				id: { type: GraphQLID }
			},
			resolve(parentValue, args) {
				// const customer = customers.find(customer => customer.id === args.id)
				// return customer

				return axios.get('http://localhost:3000/customers/' + args.id).then(res => res.data)
			}
		},
		customers: {
			type: new GraphQLList(CustomerType),
			resolve(parentValue, args) {
				// return customers

				return axios.get('http://localhost:3000/customers/').then(res => res.data)
			}
		}
	}
})

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addCustomer: {
			type: CustomerType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parentValue, args) {
				return axios
					.post('http://localhost:3000/customers/', {
						name: args.name,
						email: args.email
					})
					.then(res => res.data)
			}
		},
		deleteCustomer: {
			type: CustomerType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve(parentValue, args) {
				return axios.delete('http://localhost:3000/customers/' + args.id).then(res => res.data)
			}
		},
		updateCustomer: {
			type: CustomerType,
			args: {
				id: { type: GraphQLID },
				name: { type: GraphQLString },
				email: { type: GraphQLString }
			},
			resolve(parentValue, args) {
				return axios.patch('http://localhost:3000/customers/' + args.id, args).then(res => res.data)
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation
})
