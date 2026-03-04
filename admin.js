import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "PUT_YOUR_FIREBASE_API_KEY",
  authDomain: "PUT_YOUR_AUTH_DOMAIN",
  projectId: "PUT_YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PASSWORD = "vincam123"; // يمكنك تغييره

window.login = function() {
  if(document.getElementById("adminPass").value === PASSWORD){
    document.getElementById("adminPanel").style.display = "block";
    loadAdminProducts();
  } else {
    alert("كلمة مرور خاطئة");
  }
}

window.addProduct = async function() {

  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const desc = document.getElementById("desc").value;
  const files = document.getElementById("images").files;

  let imageUrls = [];

  for (let i = 0; i < files.length; i++) {

    const formData = new FormData();
    formData.append("file", files[i]);

    // 🔹 ضع Upload Preset unsigned
    formData.append("upload_preset", "PUT_YOUR_UNSIGNED_PRESET");

    const res = await fetch("https://api.cloudinary.com/v1_1/PUT_YOUR_CLOUD_NAME/image/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    imageUrls.push(data.secure_url);
  }

  await addDoc(collection(db, "products"), {
    title,
    price,
    desc,
    images: imageUrls
  });

  alert("تمت إضافة المنتج");
  location.reload();
}

async function loadAdminProducts(){
  const querySnapshot = await getDocs(collection(db, "products"));
  const container = document.getElementById("adminProducts");
  container.innerHTML = "";

  querySnapshot.forEach((documento) => {
    const data = documento.data();

    container.innerHTML += `
      <div>
        <p>${data.title}</p>
        <button onclick="deleteProduct('${documento.id}')">حذف</button>
      </div>
    `;
  });
}

window.deleteProduct = async function(id){
  await deleteDoc(doc(db, "products", id));
  alert("تم الحذف");
  location.reload();
}
