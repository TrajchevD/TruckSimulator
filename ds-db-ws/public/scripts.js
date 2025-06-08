let isEmployee = false;


document.getElementById("type-select").addEventListener("change", function () {
  const container = document.getElementById("spec-container");
  if (this.value === "truck") {
    container.innerHTML = `<input class="form-control" name="HP" type="number" placeholder="Horsepower (HP)" required>`;
  } else if (this.value === "trailer") {
    container.innerHTML = `<input class="form-control" name="Capacity" type="number" step="0.01" placeholder="Capacity (tons)" required>`;
  } else {
    container.innerHTML = "";
  }
});


fetch('/api/me')
  .then(res => res.json())
  .then(user => {
    if (user.type === "employee") {
      isEmployee = true;

      if (user.department === "Maintenance") {
        document.getElementById("maintenance-form").style.display = "block";
        document.getElementById("maintenance-logs").style.display = "block";
        document.getElementById("admin-dashboard-link").style.display = "none";
        loadAvailableProducts();
        loadMaintenanceLogs();
        setInterval(() => {
          loadProducts(); 
        }, 10000);
      }

      if (user.department === "Sales") {
        
        loadGroupedRequests();
        document.getElementById("request-panel").style.display = "block";
        document.getElementById("admin-dashboard-link").style.display = "none";
        setInterval(() => {
          loadGroupedRequests();
          loadProducts(); 
        }, 10000);
        
      }

      if (user.department === "Admin") {
        document.getElementById("admin-panel").style.display = "block";
        document.getElementById("admin-dashboard-link").style.display = "block";
      }

      document.getElementById('add-form').style.display = "block";
    }

    if (user.type === "customer") {
      loadProcurements();
      checkNotifications();
      setInterval(() => {
        loadProcurements();
        checkNotifications();
        loadProducts();
      }, 10000);
      document.getElementById("admin-dashboard-link").style.display = "none";
    }

    loadProducts();
  });

let shownNotifications = new Set(); 

function checkNotifications() {
  fetch("/api/my-notifications")
    .then(res => res.json())
    .then(notifs => {
      const unseen = notifs.filter(n => !shownNotifications.has(n.TransactionID));

      if (unseen.length > 0) {
        const container = document.getElementById("notifications");
        const textContainer = document.getElementById("notification-text");

        
        textContainer.innerHTML = unseen.map(n =>
          `Transaction ${n.TransactionID} was <strong>${n.Status}</strong>.`
        ).join("<br>");

        
        unseen.forEach(n => shownNotifications.add(n.TransactionID));

        container.style.display = "block";
      }
    });
}



function closeNotification() {
  document.getElementById("notifications").style.display = "none";
}

 
function loadProducts() {
  fetch('/api/products', {
    method: 'GET',
    credentials: 'include'
  })
    .then(res => res.json())
    .then(products => {
      // Filter for customers
      if (!isEmployee) {
        products = products.filter(p => p.Status === 'available');
      }

      const container = document.getElementById("product-list");
      container.innerHTML = "";

      products.forEach(p => {
        const col = document.createElement("div");
        col.className = "col-md-4";

        let extraSpec = '';
        if (p.type === 'truck') {
          extraSpec = `<strong>HP:</strong> ${p.specs?.HP || 'N/A'}`;
        } else if (p.type === 'trailer') {
          extraSpec = `<strong>Capacity:</strong> ${p.specs?.Capacity || 'N/A'} tons`;
        }

        col.innerHTML = `
  <div class="card shadow-sm h-100">
    <div class="card-body">
      <input class="form-control mb-2" value="${p.Model}" ${!isEmployee ? 'readonly' : ''} data-id="${p.ProductID}" data-field="Model">
      <input class="form-control mb-2" value="${p.Price}" ${!isEmployee ? 'readonly' : ''} data-id="${p.ProductID}" data-field="Price" type="number">
      <input class="form-control mb-2" value="${p.LicensePlate}" ${!isEmployee ? 'readonly' : ''} data-id="${p.ProductID}" data-field="LicensePlate">
      <select class="form-select mb-2" ${!isEmployee ? 'disabled' : ''} data-id="${p.ProductID}" data-field="Status">
        <option ${p.Status === 'available' ? 'selected' : ''}>available</option>
        <option ${p.Status === 'sold' ? 'selected' : ''}>sold</option>
        <option ${p.Status === 'rented' ? 'selected' : ''}>rented</option>
        <option ${p.Status === 'maintenance' ? 'selected' : ''}>maintenance</option>
      </select>

      <p class="mt-2">
        <strong>Type:</strong> ${p.type} <br>
        ${extraSpec}
      </p>

      ${isEmployee ? `
  <button class="btn btn-sm btn-primary me-2" onclick="saveProduct(${p.ProductID})">Save</button>
  <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.ProductID})">Delete</button>
` : `
  <button class="btn btn-sm btn-outline-success"
        onclick='addToCart(${JSON.stringify(p)})'
        ${p.Status !== 'available' ? 'disabled title="Unavailable product"' : ''}>
  Add to Cart
</button>
`}
    </div>
  </div>
`;
        container.appendChild(col);
      });
    });
}



document.getElementById('product-form')?.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const product = Object.fromEntries(formData.entries());

  fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  })
    .then(res => res.ok ? alert("Added!") : alert("Failed to add"))
    .then(() => {
      e.target.reset();
      document.getElementById("spec-container").innerHTML = "";
      loadProducts();
    });
});
function saveProduct(id) {
  const fields = document.querySelectorAll(`[data-id='${id}']`);
  const payload = {};
  fields.forEach(f => {
    payload[f.dataset.field] = f.value;
  });

  fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.ok ? alert("Updated!") : alert("Failed to update"))
  .then(loadProducts);
}

function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  fetch(`/api/products/${id}`, { method: 'DELETE' })
    .then(res => res.ok ? alert("Deleted!") : alert("Failed to delete"))
    .then(loadProducts);
}

let cart = [];


function toggleCart() {
  const panel = document.getElementById("cart-panel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
  renderCart();
}


function addToCart(product) {
  if (cart.find(p => p.id === product.ProductID)) return alert("Already in cart.");

  cart.push({
    id: product.ProductID,
    model: product.Model,
    type: 'Buy',
    price: parseFloat(product.Price),
    duration: null
  });

  alert("Added to cart");
  renderCart();
}

function calculateCartTotal(cart) {
  let total = 0;
  for (const item of cart) {
    const price = parseFloat(item.price);
    const duration = item.type === "Rent" ? parseInt(item.duration || 24) : 1;
    const monthly = item.type === "Rent" ? price / 36 : price;
    const totalForItem = item.type === "Rent" ? monthly * duration : price;
    total += totalForItem;
  }
  return parseFloat(total.toFixed(2));
}



async function renderCart() {
  const list = document.getElementById("cart-items");
  list.innerHTML = "";

  const pendingIds = await fetch("/api/procurement/pending-products").then(res => res.json());
  let hasPending = false;

  cart.forEach((item, idx) => {
    const li = document.createElement("li");
    const isPending = pendingIds.includes(item.id);
    if (isPending) hasPending = true;

    li.className = "list-group-item";
    if (isPending) li.style.border = "2px solid red";

    const rentFields = item.type === "Rent" ? `
      <div class="mt-2">
        Duration (months): 
        <input type="number" min="1" max="36" value="${item.duration || 24}" 
          onchange="setDuration(${idx}, this.value)" class="form-control form-control-sm" />
        <div class="mt-1 small text-muted">
          Monthly: ${(item.price / 36).toFixed(2)}<br>
          Total: ${((item.price / 36) * (item.duration || 24)).toFixed(2)}
        </div>
      </div>
    ` : `
      <div class="mt-2 small text-muted">
        Total: ${item.price.toFixed(2)}
      </div>
    `;

    li.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        ${item.model}
        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${idx})">X</button>
      </div>
      <div class="mt-2">
        <select class="form-select form-select-sm" onchange="setProcurementType(${idx}, this.value)">
          <option value="Buy" ${item.type === "Buy" ? "selected" : ""}>Buy</option>
          <option value="Rent" ${item.type === "Rent" ? "selected" : ""}>Rent</option>
        </select>
        ${rentFields}
        ${isPending ? '<div class="mt-2 text-danger">This product is currently being checked out by another customer. Try again later.</div>' : ''}
      </div>
    `;
    list.appendChild(li);
  });

  const totalDisplay = document.getElementById("cart-total");
  if (totalDisplay) {
    totalDisplay.textContent = `Total: ${calculateCartTotal(cart)} ден`;
  }

  
  const confirmBtn = document.querySelector("#payment-form button[type='submit']");
  const warningMsg = document.getElementById("pending-warning");

  if (confirmBtn) confirmBtn.disabled = hasPending;
  if (warningMsg) warningMsg.style.display = hasPending ? "block" : "none";
}



function setProcurementType(index, type) {
  cart[index].type = type;
  if (type === "Rent") {
    cart[index].duration = 36;
  } else {
    delete cart[index].duration;
  }
  renderCart();
}

function setDuration(index, val) {
  const num = parseInt(val);
  cart[index].duration = Math.max(1, Math.min(num, 36));
}



function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}


let pendingCart = []; 

document.getElementById("submit-cart").addEventListener("click", () => {
  if (cart.length === 0) return alert("Cart is empty");

  pendingCart = [...cart]; 

  const total = calculateCartTotal(cart); 

  togglePaymentModal(true, total);
});


function togglePaymentModal(show, total = 0) {
  const modal = document.getElementById("payment-modal");
  modal.style.display = show ? "block" : "none";
  document.getElementById("payment-total").textContent = total.toFixed(2);

  if (show) {
    
    fetch("/api/wallet")
      .then(res => res.json())
      .then(cards => {
        const container = document.getElementById("wallet-options");
        container.innerHTML = "";

        cards.forEach(card => {
          const last4 = card.CardNumber.slice(-4);
          const cardHTML = `
            <div class="form-check mb-2">
              <input class="form-check-input" type="radio" name="card" value="${card.CardID}" id="card-${card.CardID}" required>
              <label class="form-check-label" for="card-${card.CardID}">
                ${card.CardHolderName} •••• ${last4}
              </label>
              <input type="password" class="form-control mt-2" placeholder="Enter CVV" id="cvv-${card.CardID}" required style="display: none;" />
              <span class="text-danger small" id="cvv-error-${card.CardID}"></span>
            </div>
          `;
          container.insertAdjacentHTML("beforeend", cardHTML);
        });

        
        document.querySelectorAll("input[name='card']").forEach(radio => {
          radio.addEventListener("change", () => {
            document.querySelectorAll("input[type='password']").forEach(cvv => cvv.style.display = "none");
            const selected = document.getElementById(`cvv-${radio.value}`);
            document.querySelectorAll(".text-danger").forEach(err => err.textContent = "");
            if (selected) selected.style.display = "block";
          });
        });
      });
  }
}


document.getElementById("payment-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const selectedCardId = document.querySelector("input[name='card']:checked")?.value;
  const cvvInput = document.getElementById(`cvv-${selectedCardId}`);
  const cvv = cvvInput?.value;
  const errorSpan = document.getElementById(`cvv-error-${selectedCardId}`);

  if (errorSpan) errorSpan.textContent = "";

  if (!selectedCardId || !cvv) {
    if (errorSpan) errorSpan.textContent = "Please select a card and enter CVV.";
    return;
  }
  if (!/^\d{3}$/.test(cvv)) {
    if (errorSpan) errorSpan.textContent = "Invalid CVV.";
    return;
  }

  fetch("/api/procurement-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: pendingCart.map(item => ({
        productId: item.id,
        quantity: item.quantity || 1,
        duration: item.duration || null,
        type: item.type || "Buy"
      })),
      cardId: selectedCardId,
      paymentMethod: "Card",
      cvv: cvv
    })
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        cart = [];
        pendingCart = [];
        renderCart();
        toggleCart();
        togglePaymentModal(false);
      } else {
        const error = result?.error || "Unknown error";
        if (error.includes("CVV")) {
          if (errorSpan) errorSpan.textContent = "Incorrect CVV.";
        } else if (error.includes("Insufficient")) {
          if (errorSpan) errorSpan.textContent = "Insufficient funds.";
        } else {
          if (errorSpan) errorSpan.textContent = error;
        }
      }
    })
    .catch(err => {
      console.error("Submission error:", err);
      if (errorSpan) errorSpan.textContent = "Submission failed.";
    });
});








function loadProcurements() {
  fetch("/api/my-procurements")
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      const tbody = document.querySelector("#procurement-table tbody");
      tbody.innerHTML = "";

      const grouped = {};

      
      data.forEach(p => {
        const groupKey = p.GroupID || `single-${p.TransactionID}`;
        if (!grouped[groupKey]) grouped[groupKey] = [];
        grouped[groupKey].push(p);
      });

      Object.values(grouped).forEach(group => {
        let total = 0;
        let status = group[0].Status;
        let feedback = group[0].FeedbackRating
          ? `<span title="${group[0].FeedbackComment || ''}">${'⭐'.repeat(group[0].FeedbackRating)}</span>`
          : `<button class="btn btn-sm btn-outline-primary mt-1" onclick="toggleFeedback(true, ${group[0].ProductID}, ${group[0].TransactionID})">Leave Feedback</button>`;

        
        const modelList = group.map(p => `<li>${p.Model} × ${p.Quantity}</li>`).join("");
        
        group.forEach(p => {
          const itemTotal = p.Type === "Rent"
            ? parseFloat(p.MonthlyPay) * p.Duration
            : parseFloat(p.TotalPrice || 0);
          total += itemTotal;
        });

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${group[0].TransactionID}</td>
          <td><ul class="mb-0">${modelList}</ul></td>
          <td>${new Date(group[0].ProcurementDate).toLocaleDateString()}</td>
          <td><strong>${total.toFixed(2)}</strong></td>
          <td><strong>${status}</strong><br>${status === "Approved" ? feedback : ""}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Failed to load procurements:", err);
      alert("Could not load procurements — check console.");
    });
}



function closeNotification() {
  document.getElementById("notifications").style.display = "none";
}

function loadAvailableProducts() {
  fetch("/api/products")
    .then(res => res.json())
    .then(products => {
      const select = document.getElementById("maintenance-product-select");
      select.innerHTML = '<option value="">Select Product</option>';
      products.filter(p => p.Status !== 'maintenance' && p.Status === 'available').forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.ProductID;
        opt.textContent = `${p.Model} (${p.LicensePlate || 'No Plate'})`;
        select.appendChild(opt);
      });
    });
}

function loadMaintenanceLogs() {
  fetch("/api/maintenance")
    .then(res => res.json())
    .then(logs => {
      const tbody = document.getElementById("maintenance-body");
      tbody.innerHTML = "";
      logs.forEach(log => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${log.MainID}</td>
          <td>${log.Model}</td>
          <td>${log.Description || '-'}</td>
          <td>${log.Cost || '-'}</td>
          <td>
            ${log.Status}
            ${log.Status === 'Pending' ? `<br><button class="btn btn-sm btn-success mt-1" onclick="completeMaintenance(${log.MainID})">Finish</button>` : ''}
          </td>
          <td>${new Date(log.MainDate).toLocaleDateString()}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.warn("Failed to load maintenance logs", err);
    });
}


function completeMaintenance(id) {
  const desc = prompt("Enter maintenance description:");
  const cost = prompt("Enter maintenance cost (€):");

  if (!desc || isNaN(parseFloat(cost))) {
    alert("Invalid input.");
    return;
  }

  fetch(`/api/maintenance/complete/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: desc, cost: parseFloat(cost) })
  })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(() => {
      alert("Maintenance completed.");
      loadMaintenanceLogs();
      loadAvailableProducts();
      loadProducts(); 
    })
    .catch(() => alert("Failed to complete maintenance"));
}



const form = document.getElementById("add-maintenance-form");
form?.addEventListener("submit", e => {
  e.preventDefault();
  const ProductID = document.getElementById("maintenance-product-select").value;
  const Description = document.getElementById("maintenance-desc").value;
  const Cost = document.getElementById("maintenance-cost").value;

  if (!ProductID || !Description || !Cost) return alert("Please fill all fields.");

  fetch("/api/maintenance/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ProductID, Description, Cost })
  })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(() => {
      alert("Maintenance started");
      loadMaintenanceLogs();
      loadAvailableProducts();
      form.reset();
    })
    .catch(() => alert("Failed to start maintenance"));
});

function toggleFeedback(show, productId = null, transactionId = null) {
  const panel = document.getElementById("feedback-panel");
  panel.style.display = show ? "block" : "none";

  if (show && productId && transactionId) {
    document.getElementById("feedback-product-id").value = productId;
    document.getElementById("feedback-transaction-id").value = transactionId;
  } else {
    document.getElementById("feedback-form").reset();
  }
}

document.getElementById("feedback-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const ProductID = document.getElementById("feedback-product-id").value;
  const TransactionID = document.getElementById("feedback-transaction-id").value;
  const Rating = document.getElementById("feedback-rating").value;
  const Comment = document.getElementById("feedback-comment").value;

  fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ProductID, TransactionID, Rating, Comment })
  })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(() => {
      alert("Feedback submitted!");
      toggleFeedback(false);
    })
    .catch(() => alert("Failed to submit feedback"));
});

document.getElementById("create-employee-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  fetch("/api/employees/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      alert(`Employee created!\nEmail: ${data.email}\nPassword: ${data.password}`);
      this.reset();
    })
    .catch(() => alert("Failed to create employee"));
});




function approveGroup(groupId) {
  fetch(`/api/procurements/requests/group/${groupId}/approve`, {
    method: 'POST'
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to approve");
    return res.json();
  })
  .then(data => {
    console.log("Approved:", data);
    loadGroupedRequests();
     
  })
  .catch(err => {
    console.error("Approval error:", err);
  });
}


async function rejectGroup(groupId) {
  const res = await fetch(`/procurements/requests/group/${groupId}/reject`, {
    method: 'POST'
  });
  if (res.ok) {
    alert('Rejected');
    loadGroupedRequests();
  }
}



async function loadGroupedRequests() {
  try {
    const res = await fetch('/procurements/requests/grouped');
    const data = await res.json();

    const container = document.getElementById('grouped-requests-container');
    container.innerHTML = '';

    data.forEach(group => {
      const groupDiv = document.createElement('div');
      groupDiv.className = "card mb-3";
      groupDiv.innerHTML = `
      <div class="card-header bg-light">
        Group ID: ${group.GroupID}
      </div>
      <div class="card-body">
        <p><strong>Customer:</strong> ${group.CustomerName} ${group.CustomerSurName}</p>
        <p><strong>Products:</strong> ${group.ProductModels}</p>
        <p><strong>Total:</strong> ${parseFloat(group.Total).toFixed(2)} ден</p>
        <p><strong>Items:</strong> ${group.ItemCount}</p>
        <button class="btn btn-success me-2" onclick="approveGroup('${group.GroupID}')">Approve</button>
        <button class="btn btn-danger" onclick="rejectGroup('${group.GroupID}')">Reject</button>
      </div>
      `;
      container.appendChild(groupDiv);
    });
  } catch (err) {
    console.error("Error loading grouped requests:", err);
  }
}


