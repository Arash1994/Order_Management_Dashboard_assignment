# Seeds are idempotent — only runs if no orders exist yet
if Order.count.zero?
  orders = [
    { customer: "Alice Johnson",  status: "Completed", total: 149.99, items: [{name:"Wireless Headphones",qty:1,price:99.99},{name:"Phone Case",qty:2,price:25.00}] },
    { customer: "Bob Smith",      status: "Pending",   total: 89.50,  items: [{name:"Mechanical Keyboard",qty:1,price:89.50}] },
    { customer: "Carol White",    status: "Completed", total: 320.00, items: [{name:"Smart Watch",qty:1,price:250.00},{name:"Watch Band",qty:2,price:35.00}] },
    { customer: "David Lee",      status: "Pending",   total: 54.99,  items: [{name:"USB-C Hub",qty:1,price:54.99}] },
    { customer: "Emma Davis",     status: "Pending",   total: 199.00, items: [{name:"Bluetooth Speaker",qty:1,price:129.00},{name:"Laptop Stand",qty:1,price:70.00}] },
    { customer: "Frank Brown",    status: "Completed", total: 79.95,  items: [{name:"Mouse Pad XL",qty:1,price:29.95},{name:"Webcam",qty:1,price:50.00}] }

  ]

  orders.each { |attrs| Order.create!(attrs) }
  puts "✅ Seeded #{Order.count} orders"
end

