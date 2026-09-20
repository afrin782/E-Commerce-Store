# LUQAF - E-Commerce Store

A full-stack e-commerce web application built using **Java Spring Boot, MySQL, HTML, CSS, and JavaScript**.

## 📸 Screenshots

### 🏠 Home

![Home](screenshots/home.png)

### 🛍️ Products

![Products](screenshots/products.png)

### 📦 Product Details

![Product Details](screenshots/product-details.png)

### 🛒 Cart

![Cart](screenshots/cart.png)

### 🔐 Login

![Login](screenshots/login.png)

### 📝 Register

![Register](screenshots/register.png)

### 📋 Orders

![Orders](screenshots/orders.png)

## ✨ Features

* User registration
* User login and logout
* Browse products
* Product details
* Add products to cart
* Increase and decrease cart quantity
* Remove products from cart
* Stock management
* Checkout and order placement
* Order history
* Ordered product details
* Product images
* Responsive web design

## 🛠️ Technologies Used

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Java
* Spring Boot
* Spring Data JPA
* REST API

### Database

* MySQL

### Tools

* Eclipse
* MySQL Workbench
* Git
* GitHub

## 📁 Project Structure

```text
EcommerceStore
│
├── screenshots
│   ├── home.png
│   ├── products.png
│   ├── product-details.png
│   ├── cart.png
│   ├── login.png
│   ├── register.png
│   └── orders.png
│
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com.example.demo
│   │   │       ├── controller
│   │   │       ├── entity
│   │   │       └── repository
│   │   │
│   │   └── resources
│   │       ├── static
│   │       └── application.properties
│   │
│   └── test
│
├── pom.xml
└── README.md
```

## ⚙️ How to Run

### 1. Clone the repository

```bash
git clone https://github.com/afrin782/E-Commerce-Store.git
```

### 2. Create the database

Open MySQL and create:

```sql
CREATE DATABASE ecommerce_db;
```

### 3. Configure MySQL

Update `application.properties` with your MySQL username and password.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=root
spring.datasource.password=root
```

### 4. Run the application

Run:

```text
EcommerceStoreApplication.java
```

from Eclipse.

### 5. Open the application

Open your browser and visit:

```text
http://localhost:8084
```

## 👩‍💻 Developer

**Afrin Fathima Beevi**

GitHub: https://github.com/afrin782

---

⭐ If you like this project, feel free to star the repository.
