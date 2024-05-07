# Answers

## Content

- [Microservices](#advantages-and-challenges-of-using-microservices)
- [Data consistency](#eventual-consistency-in-distributed-systems---data-replication-and-synchronization-in-microservices)

- [Expected Salary](#expected-salary)

## Advantages and Challenges Of Using Microservices

According to [Microsoft](https://learn.microsoft.com/en-us/azure/architecture/microservices/), "Microservices are small, independent, and loosely coupled systems in which  a single or small team of developers can write and maintain a service."

In my opinion, this style of architecture in software works for very large teams or a growing team who have services that have grown beyond their proposed levels of scalability. It would be an overkill for a budding startup having one or two developers to start thinking of microservices from the get-go.

That being said, some advantages of microservices for large scale applications:

### Advantages

- In a large system, microservices help to reduce the workload on a deployed server. The monolithic application can be split into several microservices and deployed to different servers.

- When the services are split, they become easily deployable.

- Containerizing the services becomes easy as dependencies have reduced. Each team need only worry about its own service, thus making it easily maintainable.

### Challenges

As previously said [here](#advantages-and-challenges-of-using-microservices), when the team is a small team and have not encountered any scalability issues, microservices become "too much". Some challenges that may arise are:

- Cost of deployment. Deploying to several servers is expensive.
- When the entire team is small, tracking bugs become difficult.
- When each service is responsible for its own data persistence, data consistency becomes an issue.

## Eventual consistency In distributed systems - Data Replication and Synchronization In Microservices

## Expected salary

275,000
