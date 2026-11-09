# Database Schema

## Overview

The application uses Spring Data JPA and Hibernate to persist product information in a relational database.

The `Product` entity maps to the database table managed by JPA.

## Product Entity

| Field | Java Type | Description |
|---|---|---|
| id | Integer | Primary key, auto-generated |
| name | String | Product name |
| desc | String | Product description |
| brand | String | Product brand |
| price | BigDecimal | Product price |
| category | String | Product category |
| releaseDate | LocalDate | Product release date |
| available | boolean | Product availability |
| stockQuantity | Integer | Available stock quantity |
| imageName | String | Image file name |
| imageType | String | Image content type |
| imageData | byte[] | Image binary data |

## Database Mapping

- `@Entity` marks the class as a JPA entity.
- `@Id` identifies the primary key.
- `@GeneratedValue(strategy = GenerationType.IDENTITY)` enables database-generated IDs.
- `@Column(name = "description")` maps `desc` to the `description` column.
- `@Column(name = "quantity")` maps `stockQuantity` to the `quantity` column.
- `@Lob` marks image data as a large object.
- `@Column(name = "image_data", columnDefinition = "MEDIUMBLOB")` maps image data to a MEDIUMBLOB column.
- `@JsonIgnore` prevents image data from being included in normal JSON serialization.

## Notes

- Product prices use `BigDecimal` for decimal precision.
- Product release dates use Java's `LocalDate`.
- Image data is stored in the database as binary data.
- The default stock quantity is initialized to zero.
