// fetchRecruiterName.js
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { auth } from "./firebaseInit.js";

const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      console.log("Recruiter Email:", user.email);

      // Use query instead of assuming email is the doc ID
      const q = query(
        collection(db, "recruiters"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const recruiterDoc = querySnapshot.docs[0].data();
        const name = recruiterDoc.contactPersonName;
        const companyName = recruiterDoc.companyName;

        const nameEl = document.getElementById("userFirstName");
        const headerEl = document.getElementById("dropdownHeader");

        if (nameEl) nameEl.innerText = name;
        if (headerEl) {
          headerEl.innerHTML = `
      Welcome, ${name}
      <br><span class="text-muted fw-normal" style="font-size: 0.85rem">${companyName}</span>
    `;
        }
      } else {
        console.warn("No recruiter found with email:", user.email);
      }
    } catch (err) {
      console.error("Error fetching recruiter name:", err);
    }
  } else {
    console.log("User is not logged in.");
  }
});
