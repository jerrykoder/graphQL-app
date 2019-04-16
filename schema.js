const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql')

const axios = require('axios')

const customers = [
	{ id: '1', name: 'Pedro', email: 'pedro@gmail.com' },
	{ id: '2', name: 'Juan', email: 'juan@gmail.com' },
	{ id: '3', name: 'Jose', email: 'jose@gmail.com' },
	{ id: '4', name: 'Jerry', email: 'jerry@gmail.com' }
]

const CustomerType = new GraphQLObjectType({
	name: 'Customer',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		email: { type: GraphQLString }
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
				// const customer = customers.find(customer => customer.id === args.id)
				// return customer

				return axios.get('http://localhost:3000/customers/' + args.id).then(res => res.data)
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
