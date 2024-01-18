const readlineSync = require('readline-sync');

// Product prices
const prodPrices = {
  'Product A': 20,
  'Product B': 40,
  'Product C': 50,
};

// Discount rules
const disRules = {
  'flat_10_discount': (total) => (total > 200 ? 10 : 0),
  'bulk_5_discount': (quantity, price) => (quantity > 10 ? (price * quantity * 5) / 100 : 0),
  'bulk_10_discount': (totalQ, totalP) =>
    totalQ > 20 ? (totalP * 10) / 100 : 0,
  'tiered_50_discount': (totalQ, quantityAbove15, totalP) =>
    totalQ > 30 && quantityAbove15 > 15 ? (totalP * 50) / 100 : 0,
};

// Function to calculate the total amount of a product
function calculateProductTotal(quantity, price, gWrap) {
  const gWrapFee = gWrap ? quantity : 0;
  return quantity * price + gWrapFee;
}

// Function to calculate the total discount based on rules
function calculateDiscounts(_totalQ, _totalP) {
  let maxDis = 0;
  let discountName = '';

  for (const rule in disRules) {
    const discount = disRules[rule](_totalQ, _totalQ, _totalP);
    if (discount > maxDis) {
      maxDis = discount;
      discountName = rule;
    }
  }

  return { discountName, maxDis };
}

// Function to calculate shipping fee
function calculateShippingFee(totalQuantity) {
  return Math.ceil(totalQuantity / 10) * 5;
}

// Function to start the program
function startProgram() {
  const cart = {};

  for (const product in prodPrices) {
    const quantity = parseInt(readlineSync.question(`Enter quantity for ${product}: `), 10);
    const giftWrap = readlineSync.keyInYNStrict(`Is ${product} wrapped as a gift?`);
    cart[product] = {
      quantity,
      price: prodPrices[product],
      giftWrap,
      total: calculateProductTotal(quantity, prodPrices[product], giftWrap),
    };
  }

  // Calculate subtotal
  const subtotal = Object.values(cart).reduce((acc, product) => acc + product.total, 0);

  // Calculate total quantity and total price
  const totalQuantity = Object.values(cart).reduce((acc, product) => acc + product.quantity, 0);
  const totalPrice = Object.values(cart).reduce((acc, product) => acc + product.total, 0);

  // Calculate discounts
  const { discountName, maxDis} = calculateDiscounts(
    totalQuantity,
    Object.values(cart).reduce((acc, product) => acc + product.total, 0)
  );

  // Calculate shipping fee
  const shippingFee = calculateShippingFee(totalQuantity);

  // Output details
  console.log('\nProduct Details:');
  for (const product in cart) {
    console.log(
      `${product} - Quantity: ${cart[product].quantity}, Total: $${cart[product].total.toFixed(2)}`
    );
  }

  console.log(`\nSubtotal: $${subtotal.toFixed(2)}`);
  console.log(`Discount Applied: ${discountName}, Discount Amount: $${maxDis.toFixed(2)}`);
  console.log(`Shipping Fee: $${shippingFee.toFixed(2)}`);
  console.log(`Total: $${(subtotal - maxDis + shippingFee).toFixed(2)}`);
}

// Run the program
startProgram();
