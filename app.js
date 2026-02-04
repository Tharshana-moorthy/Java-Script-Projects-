const products = [
    {
      name: "Organic Bananas",
      description: "1 bunch · Fresh & ripe",
      price: 3.2,
    },
    {
      name: "Whole Milk",
      description: "1 gallon · Dairy",
      price: 4.6,
    },
    {
      name: "Brown Eggs",
      description: "12 count · Cage-free",
      price: 5.1,
    },
    {
      name: "Baby Spinach",
      description: "6 oz · Washed",
      price: 3.9,
    },
    {
      name: "Sourdough Bread",
      description: "1 loaf · Bakery",
      price: 4.4,
    },
    {
      name: "Avocados",
      description: "2 count · Hass",
      price: 3.7,
    },
    {
      name: "Olive Oil",
      description: "500 ml · Extra virgin",
      price: 8.9,
    },
    {
      name: "Pasta",
      description: "16 oz · Whole grain",
      price: 2.8,
    },
  ];
  
  const cart = new Map();
  const productGrid = document.getElementById("product-grid");
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const placeOrderButton = document.getElementById("place-order");
  
  const currentTime = document.getElementById("current-time");
  const orderTimer = document.getElementById("order-timer");
  const trackingSection = document.getElementById("tracking-section");
  const placedAt = document.getElementById("placed-at");
  const eta = document.getElementById("eta");
  const remaining = document.getElementById("remaining");
  const progressBar = document.getElementById("progress-bar");
  const statusText = document.getElementById("status-text");
  const elapsed = document.getElementById("elapsed");
  
  let orderPlacedAt = null;
  let orderInterval = null;
  let trackingInterval = null;
  
  const formatCurrency = (value) => `$${value.toFixed(2)}`;
  
  const formatTime = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  
  const formatDuration = (durationMs) => {
    const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  
  const renderProducts = () => {
    productGrid.innerHTML = "";
    products.forEach((product, index) => {
      const card = document.createElement("div");
      card.className = "card";
  
      const title = document.createElement("h3");
      title.textContent = product.name;
  
      const description = document.createElement("p");
      description.textContent = product.description;
  
      const price = document.createElement("div");
      price.className = "price";
      price.textContent = formatCurrency(product.price);
  
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Add to cart";
      button.addEventListener("click", () => addToCart(index));
  
      card.append(title, description, price, button);
      productGrid.appendChild(card);
    });
  };
  
  const addToCart = (productIndex) => {
    const currentCount = cart.get(productIndex) ?? 0;
    cart.set(productIndex, currentCount + 1);
    renderCart();
  };
  
  const renderCart = () => {
    cartItems.innerHTML = "";
    let itemCount = 0;
    let total = 0;
  
    cart.forEach((quantity, index) => {
      const product = products[index];
      itemCount += quantity;
      total += quantity * product.price;
  
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <span>${product.name} × ${quantity}</span>
        <span>${formatCurrency(quantity * product.price)}</span>
      `;
      cartItems.appendChild(row);
    });
  
    if (cart.size === 0) {
      const empty = document.createElement("p");
      empty.className = "note";
      empty.textContent = "Your cart is empty. Add grocery items to begin.";
      cartItems.appendChild(empty);
    }
  
    cartCount.textContent = String(itemCount);
    cartTotal.textContent = formatCurrency(total);
    placeOrderButton.disabled = cart.size === 0;
  };
  
  const startOrderTimer = () => {
    if (orderInterval) {
      clearInterval(orderInterval);
    }
  
    orderInterval = setInterval(() => {
      const now = new Date();
      currentTime.textContent = formatTime(now);
      if (orderPlacedAt) {
        orderTimer.textContent = formatDuration(now - orderPlacedAt);
      }
    }, 1000);
  };
  
  const startTracking = () => {
    orderPlacedAt = new Date();
    const etaTime = new Date(orderPlacedAt.getTime() + 30 * 60 * 1000);
    placedAt.textContent = formatTime(orderPlacedAt);
    eta.textContent = formatTime(etaTime);
    trackingSection.scrollIntoView({ behavior: "smooth" });
  
    statusText.textContent = "Picking and packing your groceries...";
  
    if (trackingInterval) {
      clearInterval(trackingInterval);
    }
  
    trackingInterval = setInterval(() => {
      const now = new Date();
      const elapsedMs = now - orderPlacedAt;
      const remainingMs = etaTime - now;
      const progress = Math.min(100, (elapsedMs / (30 * 60 * 1000)) * 100);
  
      remaining.textContent = formatDuration(remainingMs);
      elapsed.textContent = `Elapsed: ${formatDuration(elapsedMs)}`;
      progressBar.style.width = `${progress}%`;
  
      if (elapsedMs > 10 * 60 * 1000) {
        statusText.textContent = "Courier is heading to you.";
      }
      if (elapsedMs > 22 * 60 * 1000) {
        statusText.textContent = "Courier is nearby. Please be ready!";
      }
      if (remainingMs <= 0) {
        statusText.textContent = "Delivered! Enjoy your groceries.";
        remaining.textContent = "00:00:00";
        progressBar.style.width = "100%";
        clearInterval(trackingInterval);
      }
    }, 1000);
  };
  
  placeOrderButton.addEventListener("click", () => {
    if (cart.size === 0) {
      return;
    }
    startTracking();
  });
  
  renderProducts();
  renderCart();
  startOrderTimer();