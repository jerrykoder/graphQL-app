import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const CUSTOMERS_QUERY = gql`
	query CustomersQuery {
		customers {
			id
			name
			email
			post {
				post_title
				post_date
			}
		}
	}
`

export default class Customers extends Component {
	render() {
		return (
			<div>
				<h1>Customers</h1>
				<Query query={CUSTOMERS_QUERY}>
					{({ loading, error, data }) => {
						if (loading) return <p>Loading...</p>
						if (error) return <p>Error :(</p>

						console.log(data)

						return data.customers.map(({ id, name, email }) => (
							<div key={id}>
								<p>
									{name}: {email}
								</p>
							</div>
						))
					}}
				</Query>
			</div>
		)
	}
}
