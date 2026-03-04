import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 ضع معلومات Firebase الخاصة بك هنا (ليست سرية)
const firebaseConfig = {
  apiKey: "PUT_YOUR_FIREBASE_API_KEY",
  authDomain: "PUT_YOUR_AUTH_DOMAIN",
  projectId: "PUT_YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productsDiv = document.getElementById("products");

async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  productsDiv.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const imagesHTML = data.images.map((img, index) => `
      <img src="${img}" class="slide" style="display:${index === 0 ? 'block' : 'none'}">
    `).join("");

    productsDiv.innerHTML += `
      <div class="card">
        <div class="slider">
          ${imagesHTML}
          <button onclick="prev(this)">◀</button>
          <button onclick="next(this)">▶</button>
        </div>
        <h3>${data.title}</h3>
        <p>${data.desc}</p>
        <h4>${data.price} درهم</h4>
        <a href="https://wa.me/212684092146?text=أريد شراء ${data.title}" target="_blank">
          <button>اطلب الآن</button>
        </a>
      </div>
    `;
  });
}

window.next = function(btn) {
  const slides = btn.parentElement.querySelectorAll(".slide");
  let current = [...slides].findIndex(s => s.style.display === "block");
  slides[current].style.display = "none";
  slides[(current + 1) % slides.length].style.display = "block";
}

window.prev = function(btn) {
  const slides = btn.parentElement.querySelectorAll(".slide");
  let current = [...slides].findIndex(s => s.style.display === "block");
  slides[current].style.display = "none";
  slides[(current - 1 + slides.length) % slides.length].style.display = "block";
}

loadProducts();
