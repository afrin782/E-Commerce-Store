
package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;
import com.example.demo.entity.Product;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;

@RestController
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    public OrderController(OrderRepository orderRepository,
                           OrderItemRepository orderItemRepository,
                           ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }

    @PostMapping("/orders")
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    @GetMapping("/orders/{email}")
    public List<Order> getOrders(@PathVariable String email) {
        return orderRepository.findByCustomerEmail(email);
    }

    @PostMapping("/order-items")
    public OrderItem addOrderItem(@RequestBody OrderItem item) {

        Product product = productRepository
                .findById(item.getProductId())
                .orElse(null);

        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        if (item.getQuantity() > product.getStock()) {
            throw new RuntimeException(
                    "Not enough stock for " + product.getName()
            );
        }

        // Reduce product stock
        product.setStock(
                product.getStock() - item.getQuantity()
        );

        // Save updated stock
        productRepository.save(product);

        // Save order item
        return orderItemRepository.save(item);
    }

    @GetMapping("/order-items/{orderId}")
    public List<OrderItem> getOrderItems(@PathVariable int orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }
}
