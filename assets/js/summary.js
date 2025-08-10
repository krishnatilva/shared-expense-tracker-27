import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

  const supabaseUrl = 'https://lcvdimgrajtskmbhwnxh.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdmRpbWdyYWp0c2ttYmh3bnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTQ4MTEsImV4cCI6MjA2OTU3MDgxMX0.JlNHo01Xjn8HehF3fWojrNUhkzssqq6K8gn1D8nZQLU';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: entries, error } = await supabase
    .from("expenses")
    .select("*");

  if (error) {
    console.error("Error fetching summary data:", error);
  }

  const summary = {};

  entries.forEach(entry => {
    const names = entry.friends || [];
    const perPerson = entry.amount / names.length;

    names.forEach(name => {
      summary[name] = (summary[name] || 0) + perPerson;
    });
  });

  const table = document.getElementById("summaryTable");
  Object.entries(summary).forEach(([name, amount]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${name}</td><td>₹${amount.toFixed(2)}</td>`;
    table.appendChild(row);
  });





    const entries = JSON.parse(localStorage.getItem("entries") || "[]");
    const summary = {};
    entries.forEach(entry => {
      entry.names.forEach(name => {
        summary[name] = (summary[name] || 0) + entry.perPerson;
      });
    });
    const table = document.getElementById("summaryTable");
    Object.entries(summary).forEach(([name, amount]) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${name}</td><td>₹${amount.toFixed(2)}</td>`;
      table.appendChild(row);
    });