let product = { price: 5, quantity: 2 };
let total = product.price * product.quantity; // 10 right?
product.price = 20;
console.log(`total is ${total}`);
