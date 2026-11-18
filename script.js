// ---------- About Section ----------
window.onload = function() {
  const savedText = localStorage.getItem("aboutText");
  if (savedText) {
    document.getElementById("aboutText").value = savedText;
  }
};

function saveText() {
  const text = document.getElementById("aboutText").value;
  localStorage.setItem("aboutText", text);
  alert("Your bio has been saved!");
}

function deleteText() {
  document.getElementById("aboutText").value = "";
}

// ---------- Grade Calculator ----------
function inRange(g) {
  return !Number.isNaN(g) && g >= 0 && g <= 100;
}

function letter(grade) {
  if (grade >= 93) return "A";
  if (grade >= 90) return "A-";
  if (grade >= 87) return "B+";
  if (grade >= 83) return "B";
  if (grade >= 80) return "B-";
  if (grade >= 77) return "C+";
  if (grade >= 73) return "C";
  if (grade >= 70) return "C-";
  if (grade >= 60) return "D";
  return "F";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("gradeForm");
  const result = document.getElementById("gradeResult");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const w1 = parseFloat(formData.get("w1"));
    const g1 = parseFloat(formData.get("g1"));
    const w2 = parseFloat(formData.get("w2"));
    const g2 = parseFloat(formData.get("g2"));
    const w3 = parseFloat(formData.get("w3"));
    const g3 = parseFloat(formData.get("g3"));
    const w4 = parseFloat(formData.get("w4"));
    const g4 = parseFloat(formData.get("g4"));

    const totalWeight = w1 + w2 + w3 + w4;
    let error = null;

    if (Math.abs(totalWeight - 100.0) > 0.2) {
      error = `Total weight must be 100% (±0.2). Currently: ${totalWeight}`;
    } else if (![g1, g2, g3, g4].every(inRange)) {
      error = "Grades must be between 0 and 100.";
    }

    if (error) {
      result.textContent = "ERROR: " + error;
      result.style.color = "crimson";
      return;
    }

    const weighted = (w1/100)*g1 + (w2/100)*g2 + (w3/100)*g3 + (w4/100)*g4;
    const finalPct = Math.round(weighted * 100) / 100;
    const lettr = letter(finalPct);

    result.textContent = `Final %: ${finalPct} — Letter: ${lettr}`;
    result.style.color = "#39FF14";
  });
});
