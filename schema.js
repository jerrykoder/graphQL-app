const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
	GraphQLID
} = require('graphql');

const axios = require('axios');

const products = [
	{
		id: '1',
		product: 'Paper',
		price: '12.00',
		productId: '1'
	},
	{
		id: '2',
		product: 'Milk',
		price: '9.00',
		productId: '2'
	},
	{
		id: '3',
		product: 'Meat',
		price: '5.00',
		productId: '1'
	},
	{
		id: '4',
		product: 'Candy',
		price: '11.00',
		productId: '2'
	},
	{
		id: '5',
		product: 'Soda',
		price: '21.00',
		productId: '3'
	},
	{
		id: '6',
		product: 'Clothes',
		price: '6.00',
		productId: '2'
	}
];

const customers = [
	{ id: '1', name: 'Jerry', date: 'April' },
	{ id: '2', name: 'Raul', date: 'March' },
	{ id: '3', name: 'Pedro', date: 'June' }
];

const CustomerType = new GraphQLObjectType({
	name: 'Customer',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		date: { type: GraphQLString },
		products: {
			type: new GraphQLList(ProductType),
			resolve(parentValue, args) {
				const product = products.filter(product => product.productId === parentValue.id);
				return product;

				//return axios.get('http://localhost:3000/posts/' + parentValue.postId).then(res => res.data);
			}
		}
	})
});

const ProductType = new GraphQLObjectType({
	name: 'Product',
	fields: () => ({
		id: { type: GraphQLID },
		product: { type: GraphQLString },
		price: { type: GraphQLString },
		customer: {
			type: new GraphQLList(CustomerType),
			resolve(parentValue, args) {
				const customer = customers.filter(customer => customer.id === parentValue.productId);
				return customer;

				//return axios.get('http://localhost:3000/posts/' + parentValue.postId).then(res => res.data);
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		customer: {
			type: CustomerType,
			args: {
				id: { type: GraphQLID }
			},
			resolve(parentValue, args) {
				const customer = customers.find(customer => customer.id === args.id);
				return customer;

				//return axios.get('http://localhost:3000/customers/' + args.id).then(res => res.data);
			}
		},
		customers: {
			type: new GraphQLList(CustomerType),
			resolve(parentValue, args) {
				return customers;

				//return axios.get('http://localhost:3000/customers/').then(res => res.data);
			}
		},
		product: {
			type: ProductType,
			args: {
				id: { type: GraphQLID }
			},
			resolve(parentValue, args) {
				const product = products.find(product => product.id === args.id);
				return product;

				//return axios.get('http://localhost:3000/customers/' + args.id).then(res => res.data);
			}
		},
		products: {
			type: new GraphQLList(ProductType),
			resolve(parentValue, args) {
				return products;

				//return axios.get('http://localhost:3000/customers/').then(res => res.data);
			}
		}
	}
});

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
					.then(res => res.data);
			}
		},
		deleteCustomer: {
			type: CustomerType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve(parentValue, args) {
				return axios.delete('http://localhost:3000/customers/' + args.id).then(res => res.data);
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
				return axios.patch('http://localhost:3000/customers/' + args.id, args).then(res => res.data);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation
});
