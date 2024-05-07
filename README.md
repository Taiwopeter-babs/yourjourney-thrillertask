# ThrillersTravels Backend Task Submission

## Content

- [Description](#description)

## Description

The task is to implement a travel booking platform with Nestjs using a microservices architecture that utilizes `RabbitMQ` or `Kafka` as a message broker to enable communication between these services. `RabbitMQ` was used in this implementation.

The microservices include:

- **User Management Service** - This microservice is the central point in the application as it serves as the middleman between the microservices. Every request - authorization, bookings, and reservations - is routed to the user service before communication is established with the other microservices.

  This enables permission authorization before any other microservice is pinged.

- **Flight Booking Service** -  This microservice is responsible for the booking or cancellation of flights. Only authenticated and authorized users will be able to get access to this service.

- **Hotel Reservation Service** -  This microservice is responsible for the reservation and cancellation of hotel reservations. Only authenticated and authorized users will be able to get access to this service.

**NOTE**: The last two microservices are simple implementations.

## Architecture

<iframe width="768" height="432" src="https://miro.com/app/live-embed/uXjVKLYmoO4=/?moveToViewport=-617,-308,1320,640&embedId=710158375176" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

## API Endpoints

The API is deployed on render.

The base url `https://yourjourney-thrillertask.onrender.com` must be suffixed with `/api`.

`{{base_url}}` refers to the above.

### Authentication

- **POST `{{base_url}}`/api/auth/users/register**
- **POST `{{base_url}}`/api/auth/users/login**

### Flight Bookings

- **POST `{{base_url}}`/api/users/:id/flights** - book a flight
- **GET `{{base_url}}`/api/users/:id/flights/:flightId** - Get a booked flight
- **DELETE `{{base_url}}`/api/users/:id/flights/:flightId** - Cancel a booked flight

### Hotel Reservations

- **POST `{{base_url}}`/api/users/:id/reservations** - make a reservation
- **GET `{{base_url}}`/api/users/:id/reservations/:reservationIdId** - Get a reservation
- **DELETE `{{base_url}}`/api/users/:id/reservations/:reservationIdId** - Cancel a reservation
