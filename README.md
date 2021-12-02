# e-commerce-federation

GraphQL Microservice Architecture implementation for basic e-commerce store using [Apollo Federation](https://www.apollographql.com/docs/federation/). This project is just meant to serve as a PoC ( Proof of Concept ).

### Note

You cannot use the `buyProduct` mutation without having a frontend, which has integrated stripe, as it involves payment intent creation. And required Frontend app is not included in this repo!

## Rover Configuration

Install Rover CLI

```bash
npm i -g @apollo/rover
```

Follow these two steps: [#1](https://www.apollographql.com/docs/rover/configuring/#1-obtain-an-api-key) and [#2](https://www.apollographql.com/docs/rover/configuring/#2-provide-the-api-key-to-rover)

Run following command in every service directory, namely "auth", "cart", "rest-api".

```bash
rover subgraph publish ${Graph id}@${variant} --schema "./src/${service name}-schema.graphql" --name ${service name} --routing-url "http://localhost:${service port}/graphql"
```

### Reference

[Rover CLI](https://www.apollographql.com/docs/rover/)

[Rover CLI for Subgraph](https://www.apollographql.com/docs/rover/subgraphs/)

## Setup

Clone the project from Github.

Install Dev dependencies in the root directory of project by running:

```bash
npm i -D
```

Install the dependencies of all the components by running:

```bash
npm run load-dependencies
```

Install and login into Stripe CLI by following [this](https://stripe.com/docs/stripe-cli) guide.

To start listening for webhook on localhost run following command:

```bash
stripe listen --forward-to http://localhost:${Router Port}/rest/api/v1/webhook/stripe
```

Run following command in every component's directory, namely "router", "auth", "cart", "rest-api".

```bash
npm run copy-env
```

Fill up the created .env files in all the components with appropriate values.

Migrate back to root directory of the project, and run:

```bash
npm run dev
```
