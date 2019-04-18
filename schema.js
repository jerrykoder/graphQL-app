const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql')

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

const CustomerType = new GraphQLObjectType({
	name: 'Customer',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		post: { type: PostType }
	})
})

const PostType = new GraphQLObjectType({
	name: 'Post',
	fields: () => ({
		post_id: { type: GraphQLString },
		post_title: { type: GraphQLString },
		post_date: { type: GraphQLString }
	})
})

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		customer: {
			type: CustomerType,
			args: {
				id: { type: GraphQLString }
			},
			resolve(parentValue, args) {
				const customer = customers.find(customer => customer.id === args.id)
				return customer

				// return axios.get('http://localhost:3000/customers/' + args.id).then(res => res.data)
			}
		},
		customers: {
			type: new GraphQLList(CustomerType),
			resolve(parentValue, args) {
				return customers
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery
})
