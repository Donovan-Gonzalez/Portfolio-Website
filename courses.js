// courses.js — shared logic for ALL course pages
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    initTilt();
    initNotes();
  });

  // ========== 3D Tilt ==========
  function initTilt() {
    const tiltEls = document.querySelectorAll("[data-tilt]");
    tiltEls.forEach((el) => {
      let rx = 0, ry = 0;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width - 0.5;
        const cy = (e.clientY - r.top) / r.height - 0.5;
        rx = cy * 8;   // rotateX
        ry = -cx * 8;  // rotateY
        el.style.transform = `translateY(-2px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translateY(0) rotateX(0) rotateY(0)";
      });
    });
  }

  // ========== Notes (localStorage) ==========
  function initNotes() {
    // Allow each course page to set a distinct storage key via <body data-note-key="...">
    const KEY = document.body.dataset.noteKey || "course_notes_default";

    const listEl = document.getElementById("notes");
    const form = document.getElementById("noteForm");
    const titleEl = document.getElementById("noteTitle");
    const bodyEl = document.getElementById("noteBody");

    // If the page doesn’t include a notes section, just skip
    if (!listEl || !form || !titleEl || !bodyEl) return;

    function loadNotes() {
      const arr = JSON.parse(localStorage.getItem(KEY) || "[]");
      render(arr);
    }
    function saveNotes(arr) {
      localStorage.setItem(KEY, JSON.stringify(arr));
    }
    function render(arr) {
      listEl.innerHTML = "";
      if (arr.length === 0) {
        listEl.innerHTML = `<div class="note">No notes yet. Add one in the form!</div>`;
        return;
      }
      arr.forEach((n, idx) => {
        const div = document.createElement("div");
        div.className = "note";
        div.innerHTML = `
          <strong>${escapeHtml(n.title || "Untitled")}</strong>
          <p>${escapeHtml(n.body || "")}</p>
          <small>${new Date(n.when).toLocaleString()}</small>
          <button class="del" data-idx="${idx}" title="Delete" aria-label="Delete note">×</button>
        `;
        listEl.appendChild(div);
      });
    }
    function escapeHtml(s) {
      return (s || "").replace(/[&<>"']/g, (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = {
        title: titleEl.value.trim(),
        body: bodyEl.value.trim(),
        when: Date.now(),
      };
      if (!note.title && !note.body) return;
      const current = JSON.parse(localStorage.getItem(KEY) || "[]");
      current.unshift(note);
      saveNotes(current);
      titleEl.value = "";
      bodyEl.value = "";
      render(current);
    });

    // Delete via event delegation
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".del");
      if (!btn || !listEl.contains(btn)) return;
      const idx = parseInt(btn.dataset.idx, 10);
      const current = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (!Number.isNaN(idx)) {
        current.splice(idx, 1);
        saveNotes(current);
        render(current);
      }
    });

    loadNotes();
  }
})();
