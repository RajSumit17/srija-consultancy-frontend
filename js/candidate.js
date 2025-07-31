import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { auth } from "./firebaseInit.js";
let recruiterEmail;
const db = getFirestore();
const candidateDetails = {
  name: "",
  email: "",
  number: "",
};
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      console.log("Candidate Email:", user.email);

      // Use query instead of assuming email is the doc ID
      const q = query(
        collection(db, "candidates"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const candidateDoc = querySnapshot.docs[0].data();
        const name = candidateDoc.name;
        candidateDetails.name = name;
        // console.log("Candidate Name:", name);
        candidateDetails.email = user.email;
        candidateDetails.number = candidateDoc.number;
        const nameEl = document.getElementById("userFirstName");
        const headerEl = document.getElementById("dropdownHeader");
        recruiterEmail = user.email; // Store the email for later use
        if (nameEl) nameEl.innerText = name;
        if (headerEl) {
          headerEl.innerHTML = `
      Welcome, ${name}
      <br><span class="text-muted fw-normal" style="font-size: 0.85rem">Candidate</span>
    `;
        }
      } else {
        console.warn("No candidate found with email:", user.email);
      }
    } catch (err) {
      console.error("Error fetching candidate name:", err);
    }
  } else {
    console.log("User is not logged in.");
  }
});