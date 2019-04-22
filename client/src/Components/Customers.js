import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const CUSTOMERS_QUERY = gql`
	query CustomersQuery {
		customers {
			id
			name
			date
			products {
				id
				product
				price
			}
		}
	}
`;

export default class Customers extends Component {
	render() {
		return (
			<div>
				<h1>Customers</h1>
				<Query query={CUSTOMERS_QUERY}>
					{({ loading, error, data }) => {
						if (loading) return <p>Loading...</p>;
						if (error) return <p>Error :(</p>;

						console.log(data);

						return data.customers.map(({ id, name, date, products }) => (
							<div key={id}>
								<p>
									{name}: {date}
								</p>
								{products.map(({ id, product, price }) => (
									<div key={id}>
										<p>
											{product}: {price}
										</p>
									</div>
								))}
							</div>
						));
					}}
				</Query>
			</div>
		);
	}
}
