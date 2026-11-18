// sql-practice.js — in-browser SQL playground over Donovan's courses, projects and skills
// Uses sql.js (SQLite compiled to WebAssembly). Nothing is sent to a server;
// every visitor gets their own in-memory copy, so DROP/DELETE can't hurt anything.

// ---------- Data (edit this to add courses/projects/skills) ----------
const SEED_SQL = `
-- ===== Courses (from my Queens College record; grades intentionally not included) =====
CREATE TABLE courses (
  id         INTEGER PRIMARY KEY,
  code       TEXT,      -- e.g. 'CSCI 313' (CSCI 381 = special topics, so it repeats)
  title      TEXT,
  semester   TEXT,      -- e.g. 'Fall 2025'
  term_order INTEGER,   -- 0 = Summer 2023 ... 10 = Spring 2027 (use for ORDER BY)
  credits    REAL,
  status     TEXT       -- 'Completed', 'In Progress', 'Registered', 'Transfer', 'Test Credit'
);

INSERT INTO courses VALUES
  ( 1, 'BUS 499'  , 'Business Elective (Transfer: York College FINC 101)'    , 'Summer 2023', 0 , 3   , 'Transfer'),
  ( 2, 'BIOL 499' , 'Biology Elective (Transfer: St. John''s BIO 1008)'      , 'Summer 2023', 0 , 3   , 'Transfer'),
  ( 3, 'ANTH 101' , 'Intro to Cultural Anthropology'                         , 'Fall 2023'  , 1 , 3   , 'Completed'),
  ( 4, 'CSCI 111' , 'Intro to Algorithmic Problem Solving'                   , 'Fall 2023'  , 1 , 3   , 'Completed'),
  ( 5, 'ENGL 110H', 'College Writing I'                                      , 'Fall 2023'  , 1 , 3   , 'Completed'),
  ( 6, 'HNRS 125' , 'The Arts in New York City'                              , 'Fall 2023'  , 1 , 3   , 'Completed'),
  ( 7, 'MATH 122' , 'Precalculus'                                            , 'Fall 2023'  , 1 , 4   , 'Completed'),
  ( 8, 'ENGL 499' , 'English Elective (Test Credit)'                         , 'Fall 2023'  , 1 , 6   , 'Test Credit'),
  ( 9, 'ARAB 101' , 'Elementary Arabic I'                                    , 'Spring 2024', 2 , 4   , 'Completed'),
  (10, 'CSCI 211' , 'Object-Oriented Programming in C++'                     , 'Spring 2024', 2 , 3   , 'Completed'),
  (11, 'CSCI 212' , 'Object-Oriented Programming in Java'                    , 'Spring 2024', 2 , 3   , 'Completed'),
  (12, 'HNRS 126W', 'The Peopling of New York'                               , 'Spring 2024', 2 , 3   , 'Completed'),
  (13, 'MATH 151' , 'Calculus: Differentiation & Integration'                , 'Spring 2024', 2 , 4   , 'Completed'),
  (14, 'ENGL 130' , 'Writing about Literature'                               , 'Summer 2024', 3 , 3   , 'Completed'),
  (15, 'MATH 120' , 'Discrete Math for Computer Science'                     , 'Summer 2024', 3 , 3   , 'Completed'),
  (16, 'CSCI 240' , 'Computer Organization & Assembly Language'              , 'Fall 2024'  , 4 , 3   , 'Completed'),
  (17, 'HNRS 225' , 'Science & Technology in NYC'                            , 'Fall 2024'  , 4 , 3   , 'Completed'),
  (18, 'MES 160'  , 'Classical Islamic Literature & Civilization'            , 'Fall 2024'  , 4 , 3   , 'Completed'),
  (19, 'SOC 101'  , 'General Intro to Sociology'                             , 'Fall 2024'  , 4 , 3   , 'Completed'),
  (20, 'CSCI 220' , 'Discrete Structures'                                    , 'Spring 2025', 5 , 3   , 'Completed'),
  (21, 'ENGL 161W', 'Introduction to Narrative'                              , 'Spring 2025', 5 , 3   , 'Completed'),
  (22, 'FNES 101' , 'The Science of Foods'                                   , 'Spring 2025', 5 , 3   , 'Completed'),
  (23, 'HNRS 226' , 'Shaping the Future of NYC'                              , 'Spring 2025', 5 , 3   , 'Completed'),
  (24, 'MATH 152' , 'Calculus: Integration & Infinite Series'                , 'Spring 2025', 5 , 4   , 'Completed'),
  (25, 'MATH 231' , 'Linear Algebra I'                                       , 'Spring 2025', 5 , 4   , 'Completed'),
  (26, 'MATH 241' , 'Intro to Probability & Mathematical Statistics'         , 'Summer 2025', 6 , 3   , 'Completed'),
  (27, 'CSCI 12'  , 'Intro to Computers & Computation'                       , 'Fall 2025'  , 7 , 3   , 'Completed'),
  (28, 'CSCI 48'  , 'Spreadsheet Programming'                                , 'Fall 2025'  , 7 , 3   , 'Completed'),
  (29, 'CSCI 313' , 'Data Structures'                                        , 'Fall 2025'  , 7 , 3   , 'Completed'),
  (30, 'CSCI 320' , 'Theory of Computation'                                  , 'Fall 2025'  , 7 , 3   , 'Completed'),
  (31, 'CSCI 90'  , 'Topics in Computing: Computational Thinking'            , 'Spring 2026', 8 , 3   , 'Completed'),
  (32, 'CSCI 316' , 'Principles of Programming Languages'                    , 'Spring 2026', 8 , 3   , 'Completed'),
  (33, 'CSCI 323' , 'Design & Analysis of Algorithms'                        , 'Spring 2026', 8 , 3   , 'Completed'),
  (34, 'CSCI 331' , 'Database Systems'                                       , 'Spring 2026', 8 , 3   , 'Completed'),
  (35, 'CSCI 340' , 'Operating Systems Principles'                           , 'Spring 2026', 8 , 3   , 'Completed'),
  (36, 'CSCI 381' , 'Special Topics: Wireless Networks and Signals'          , 'Spring 2026', 8 , 3   , 'Completed'),
  (37, 'CSCI 343' , 'Computer Architecture'                                  , 'Fall 2026'  , 9 , 3   , 'In Progress'),
  (38, 'CSCI 370' , 'Software Engineering'                                   , 'Fall 2026'  , 9 , 3   , 'In Progress'),
  (39, 'CSCI 381' , 'Special Topics: Video Game Design & Development'        , 'Fall 2026'  , 9 , 3   , 'In Progress'),
  (40, 'CSCI 381' , 'Special Topics: Computability and Complexity (CSCI 722)', 'Fall 2026'  , 9 , 3   , 'In Progress'),
  (41, 'CSCI 80'  , 'Problem Solving with Computers'                         , 'Spring 2027', 10, NULL, 'Registered'),
  (42, 'DESN 191' , 'Basic Software for Design'                              , 'Spring 2027', 10, NULL, 'Registered');

-- ===== Projects, skills, and how they connect =====
CREATE TABLE projects (
  id          INTEGER PRIMARY KEY,
  name        TEXT,
  description TEXT,
  status      TEXT,     -- 'Live', 'Completed', 'In Progress'
  github_url  TEXT
);

CREATE TABLE skills (
  id       INTEGER PRIMARY KEY,
  name     TEXT,
  category TEXT         -- 'Language', 'Data', 'Cloud', 'Security', 'Networking', 'Infrastructure', 'Tools'
);

CREATE TABLE project_skills (project_id INTEGER, skill_id INTEGER);  -- many-to-many
CREATE TABLE course_skills  (course_id  INTEGER, skill_id INTEGER);  -- many-to-many

INSERT INTO projects VALUES
  (1, 'Home Cloud Server', 'Self-hosted portfolio server on an old MacBook Pro running Ubuntu Server, HTTPS-secured and remotely managed over Tailscale.', 'Live', 'https://github.com/Donovan-Gonzalez/Personal-Cloud-Server-Home-Lab'),
  (2, 'AWS Cloud Security & IAM Lab', 'IAM users, groups and roles with least-privilege custom JSON policies and permission boundaries.', 'Completed', 'https://github.com/Donovan-Gonzalez/Aws-IAM-Lab'),
  (3, 'Cybersecurity Monitoring Lab', 'Analyzed Windows Sysmon logs to detect suspicious processes and privilege escalation.', 'Completed', 'https://github.com/Donovan-Gonzalez/Windows-Sysmon-Security-Monitoring-Lab'),
  (4, 'Customer Data Platform (Capstone)', 'Macaulay Honors capstone: a self-hosted Customer Data Platform.', 'In Progress', NULL),
  (5, 'SQL Playground', 'This widget: an in-browser SQLite database you can query, built with sql.js.', 'Live', NULL);

INSERT INTO skills VALUES
  (1, 'Java', 'Language'),
  (2, 'C++', 'Language'),
  (3, 'C', 'Language'),
  (4, 'C#', 'Language'),
  (5, 'Python', 'Language'),
  (6, 'JavaScript', 'Language'),
  (7, 'HTML/CSS', 'Language'),
  (8, 'SQL', 'Data'),
  (9, 'SQLite', 'Data'),
  (10, 'Excel', 'Data'),
  (11, 'VBA', 'Data'),
  (12, 'Linux', 'Infrastructure'),
  (13, 'Nginx', 'Infrastructure'),
  (14, 'Raspberry Pi', 'Infrastructure'),
  (15, 'AWS', 'Cloud'),
  (16, 'GCP', 'Cloud'),
  (17, 'IAM', 'Security'),
  (18, 'RBAC', 'Security'),
  (19, 'TLS/HTTPS', 'Security'),
  (20, 'SSH', 'Security'),
  (21, 'Firewalls (UFW)', 'Security'),
  (22, 'Sysmon', 'Security'),
  (23, 'Log Analysis', 'Security'),
  (24, 'Threat Hunting', 'Security'),
  (25, 'DNS', 'Networking'),
  (26, 'Tailscale/WireGuard', 'Networking'),
  (27, 'Wi-Fi & Bluetooth', 'Networking'),
  (28, 'Unity', 'Tools'),
  (29, 'Windows', 'Tools');

INSERT INTO project_skills VALUES
  (1, 12), (1, 13), (1, 19), (1, 20), (1, 21), (1, 25), (1, 26), (1, 15),
  (2, 15), (2, 17), (2, 18),
  (3, 22), (3, 29), (3, 23), (3, 24),
  (4, 14), (4, 16), (4, 12),
  (5, 8), (5, 9), (5, 6), (5, 7);

INSERT INTO course_skills VALUES
  (10, 2), (11, 1), (29, 1), (34, 8), (35, 3), (35, 12), (28, 10), (28, 11), (38, 1), (39, 28), (39, 4), (36, 27);
`;

const EXAMPLES = [
    ["My projects", "SELECT name, status, github_url\nFROM projects;"],
    ["Skills by category", "SELECT category, GROUP_CONCAT(name, ', ') AS skills\nFROM skills\nGROUP BY category;"],
    ["Projects using AWS", "SELECT p.name\nFROM projects p\nJOIN project_skills ps ON ps.project_id = p.id\nJOIN skills s        ON s.id = ps.skill_id\nWHERE s.name = 'AWS';"],
    ["Skills per project", "SELECT p.name, COUNT(*) AS num_skills\nFROM projects p\nJOIN project_skills ps ON ps.project_id = p.id\nGROUP BY p.name\nORDER BY num_skills DESC;"],
    ["Where I learned Java", "SELECT c.code, c.title, c.semester\nFROM courses c\nJOIN course_skills cs ON cs.course_id = c.id\nJOIN skills s       ON s.id = cs.skill_id\nWHERE s.name = 'Java'\nORDER BY c.term_order;"],
    ["This semester", "SELECT code, title FROM courses\nWHERE status = 'In Progress';"],
    ["CS courses taken", "SELECT code, title, semester FROM courses\nWHERE code LIKE 'CSCI%' AND status = 'Completed'\nORDER BY term_order;"],
    ["Credits per semester", "SELECT semester, SUM(credits) AS credits\nFROM courses\nWHERE status = 'Completed'\nGROUP BY semester\nORDER BY MIN(term_order);"],
    ["Skills never used in a project", "SELECT name, category FROM skills\nWHERE id NOT IN (SELECT skill_id FROM project_skills);"],
];

(function () {
    let db = null;

    const editor = document.getElementById("sqlInput");
    const output = document.getElementById("sqlOutput");
    const runBtn = document.getElementById("sqlRun");
    const resetBtn = document.getElementById("sqlReset");
    const exBox = document.getElementById("sqlExamples");
    if (!editor || !output) return;

    function resetDb(SQL) {
        if (db) db.close();
        db = new SQL.Database();
        db.run(SEED_SQL);
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, (c) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
        })[c]);
    }

    function showMessage(msg, isError) {
        output.innerHTML = `<p class="sql-msg${isError ? " sql-error" : ""}">${escapeHtml(msg)}</p>`;
    }

    function run() {
        if (!db) return showMessage("Database is still loading…", true);
        const query = editor.value.trim();
        if (!query) return showMessage("Type a query first.", true);

        try {
            const results = db.exec(query); // array of {columns, values}, one per SELECT
            if (results.length === 0) {
                return showMessage(`OK — ${db.getRowsModified()} row(s) affected.`, false);
            }
            output.innerHTML = results.map(({ columns, values }) => `
        <table class="sql-table">
          <thead><tr>${columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead>
          <tbody>${values.map((row) =>
                `<tr>${row.map((v) => `<td>${v === null ? '<span class="sql-null">NULL</span>' : escapeHtml(v)}</td>`).join("")}</tr>`
            ).join("")}</tbody>
        </table>
        <p class="sql-msg">${values.length} row(s)</p>`).join("");
        } catch (err) {
            showMessage("ERROR: " + err.message, true);
        }
    }

    // Example buttons
    EXAMPLES.forEach(([label, sql]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sql-chip";
        b.textContent = label;
        b.addEventListener("click", () => { editor.value = sql; run(); });
        exBox.appendChild(b);
    });

    runBtn.addEventListener("click", run);
    // Ctrl/Cmd + Enter runs the query
    editor.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
    });

    initSqlJs({
        locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
    }).then((SQL) => {
        resetDb(SQL);
        resetBtn.addEventListener("click", () => {
            resetDb(SQL);
            showMessage("Database reset to original transcript.", false);
        });
        showMessage("Ready. Try an example or write your own query (Ctrl+Enter to run).", false);
    }).catch((err) => showMessage("Failed to load SQL engine: " + err.message, true));
})();