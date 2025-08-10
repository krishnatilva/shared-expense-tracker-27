 import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

    // 🔁 REPLACE these with your actual project credentials
    const supabaseUrl = 'https://lcvdimgrajtskmbhwnxh.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdmRpbWdyYWp0c2ttYmh3bnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTQ4MTEsImV4cCI6MjA2OTU3MDgxMX0.JlNHo01Xjn8HehF3fWojrNUhkzssqq6K8gn1D8nZQLU';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const friends = ["Krishna", "Dushyant", "Dhruv", "Darsh", "Kasyap", "Kush", "Om", "Zeel"];

    async function init() {
      document.getElementById("entryDate").value = new Date().toLocaleString();
      const boxDiv = document.getElementById("friendCheckboxes");

      // Generate checkboxes
      friends.forEach(name => {
        const label = document.createElement("label");
        label.innerHTML = `<input type='checkbox' value='${name}'> ${name}`;
        boxDiv.appendChild(label);
      });

      // Load entries from Supabase
      await renderEntries();
    }

    // ADD ENTRY FUNCTION
    document.getElementById("addEntryBtn").onclick = async function () {
      const title = document.getElementById("entryTitle").value.trim();
      const amount = parseFloat(document.getElementById("entryPrice").value);
      const date = new Date().toISOString();
      const selectedFriends = [...document.querySelectorAll("#friendCheckboxes input:checked")].map(cb => cb.value);

      if (!title || !amount || selectedFriends.length === 0) {
        alert("Please fill all fields.");
        return;
      }

      const { error } = await supabase.from("expenses").insert([
        {
          title,
          amount,
          date,
          friends: selectedFriends,
          shared_by: "admin"
        }
      ]);

      if (error) {
        alert("Insert error: " + error.message);
        return;
      }

      alert("Added successfully!");
      clearForm();
      await renderEntries();
    };

    // CLEAR FORM
    function clearForm() {
      document.getElementById("entryTitle").value = "";
      document.getElementById("entryPrice").value = "";
      document.getElementById("entryDate").value = new Date().toLocaleString();
      document.querySelectorAll("#friendCheckboxes input").forEach(cb => cb.checked = false);
    }

    // RENDER ENTRIES
    async function renderEntries() {
      const container = document.getElementById("entriesContainer");
      container.innerHTML = "Loading entries...";

      const { data: entries, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        container.innerHTML = "Error loading entries.";
        console.error(error);
        return;
      }

      container.innerHTML = "";

      if (entries.length === 0) {
        container.innerHTML = "<p>No entries found.</p>";
        return;
      }

      entries.forEach(entry => {
        const div = document.createElement("div");
        const perPerson = (entry.amount / entry.friends.length).toFixed(2);
        div.className = "entry";
        div.innerHTML = `
        <b>${entry.title}</b><br>
        <span style="opacity: 0.8;">${new Date(entry.date).toLocaleString()}</span><br>
        <span><strong>Total:</strong> ₹${entry.amount}</span><br>
        <span><strong>Friends:</strong> ${entry.friends.join(", ")}</span><br>
        <span style="color:#4caf50;"><strong>Per Person:</strong> ₹${perPerson}</span>
      `;
        container.appendChild(div);
      });
    }

    // INIT ON PAGE LOAD
    init();