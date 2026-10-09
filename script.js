
import { pipeline, env } from
  "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";

env.allowLocalModels = false;
env.useBrowserCache = true;

const $ = id => document.getElementById(id);
const STORAGE_KEY = "terraquest-project-v1";

const missions = [
  {
    id: "leaf", category: "notice", emoji: "🍃",
    visual: "visual-green", tag: "LOOK CLOSER", time: 5,
    title: "Meet one leaf",
    description: "Notice the edges, veins, texture and color of a leaf.",
    steps: [
      "Find a fallen leaf or observe one on a plant.",
      "Notice three details you hadn't seen before.",
      "Leave living plants where they are."
    ],
    points: 10
  },
  {
    id: "cloud", category: "notice", emoji: "☁️",
    visual: "visual-sky", tag: "SLOW DOWN", time: 5,
    title: "Cloud watching",
    description: "Look up and find shapes in the clouds.",
    steps: [
      "Find a safe spot to pause.",
      "Watch the clouds for five minutes.",
      "Name a shape you see."
    ],
    points: 10
  },
  {
    id: "walk", category: "move", emoji: "🥾",
    visual: "visual-green", tag: "TAKE A WALK", time: 15,
    title: "The unfamiliar turn",
    description: "Explore a different turn on a familiar, safe route.",
    steps: [
      "Choose a familiar, safe area.",
      "Take one different turn or path.",
      "Notice one new sound or color."
    ],
    points: 20
  },
  {
    id: "birds", category: "listen", emoji: "🐦",
    visual: "visual-sky", tag: "TUNE IN", time: 10,
    title: "Birdsong minute",
    description: "Pause and listen to the layers of sound around you.",
    steps: [
      "Sit somewhere peaceful and safe.",
      "Listen quietly for a minute.",
      "Notice different calls without chasing birds."
    ],
    points: 15
  },
  {
    id: "grow", category: "grow", emoji: "🌱",
    visual: "visual-sun", tag: "GROW SOMETHING", time: 15,
    title: "A tiny green plan",
    description: "Check a pot, garden or windowsill plant.",
    steps: [
      "Check the plant's light and soil.",
      "See whether it needs care before watering.",
      "Plan one thing to try this week."
    ],
    points: 20
  },
  {
    id: "texture", category: "notice", emoji: "🌰",
    visual: "visual-rose", tag: "SENSORY QUEST", time: 10,
    title: "Nature textures",
    description: "Observe five textures without disturbing wildlife.",
    steps: [
      "Look for textures from a safe path.",
      "Notice bark, stone, grass or fallen seeds.",
      "Leave things where you found them."
    ],
    points: 15
  },
  {
    id: "stretch", category: "move", emoji: "🧘",
    visual: "visual-sun", tag: "RESET", time: 5,
    title: "Fresh-air reset",
    description: "Take a gentle outdoor break at your own pace.",
    steps: [
      "Choose a safe outdoor spot.",
      "Relax your shoulders and look around.",
      "Head back whenever you're ready."
    ],
    points: 10
  },
  {
    id: "sounds", category: "listen", emoji: "👂",
    visual: "visual-green", tag: "LISTEN IN", time: 15,
    title: "Make a sound map",
    description: "Notice the sounds around you, near and far.",
    steps: [
      "Sit somewhere safe for two minutes.",
      "Notice where sounds seem to come from.",
      "Remember or sketch a simple sound map."
    ],
    points: 20
  }
];

const defaultState = {
  completed: [],
  notes: [],
  minutes: 0,
  points: 0
};

let state = loadState();
let selectedFile = null;
let classifier = null;
let toastTimer;

function loadState() {
  try {
    return {
      ...defaultState,
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
    };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function renderMissions(filter = "all") {
  const visible = missions.filter(mission =>
    filter === "all" || mission.category === filter
  );

  $("missionGrid").innerHTML = visible.map(mission => {
    const completed = state.completed.includes(mission.id);

    return `
      <article class="mission-card">
        <div class="mission-visual ${mission.visual}">
          <span class="mini-label">${mission.tag}</span>
          ${mission.emoji}
        </div>

        <div class="mission-content">
          <div class="mission-meta">
            <span>${mission.category.toUpperCase()}</span>
            <span>◷ ${mission.time} MIN</span>
          </div>

          <h3>${mission.title}</h3>
          <p>${mission.description}</p>

          <div class="mission-bottom">
            <span>✦ ${mission.points} points</span>
            <button
              class="complete-btn ${completed ? "done" : ""}"
              data-complete="${mission.id}">
              ${completed ? "✓ Completed" : "+ Complete"}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll("[data-complete]").forEach(button => {
    button.addEventListener("click", () => {
      completeMission(button.dataset.complete);
    });
  });
}

function renderStats() {
  $("completedCount").textContent = state.completed.length;
  $("minutesCount").textContent = state.minutes;
}

function completeMission(id) {
  if (state.completed.includes(id)) {
    showToast("You've already completed this adventure 🌿");
    return;
  }

  const mission = missions.find(item => item.id === id);
  if (!mission) return;

  state.completed.push(id);
  state.points += mission.points;
  state.minutes += mission.time;

  saveState();
  renderMissions(
    document.querySelector(".filter.active")?.dataset.filter || "all"
  );
  renderStats();

  showToast(`Mission complete! +${mission.points} nature points.`);
}

function generateMission() {
  const time = Number($("timeSelect").value);
  const interest = $("interestSelect").value;

  const plans = {
    notice: {
      title: "Five tiny wonders",
      intro: "A mini observation walk for curious minds.",
      steps: [
        "Step outside to a safe garden or public space.",
        "Find a shape, color, pattern, movement and sound.",
        "Choose your favorite detail and remember it."
      ]
    },
    move: {
      title: "A little wander",
      intro: "A gentle outdoor movement break.",
      steps: [
        "Choose a familiar route that fits your time.",
        "Walk at a comfortable pace and notice your surroundings.",
        "Pause somewhere safe before heading back."
      ]
    },
    grow: {
      title: "Green thumb moment",
      intro: "A small act of care for your green space.",
      steps: [
        "Find a plant, pot or patch of soil.",
        "Check its light and soil before deciding what it needs.",
        "Make one small care plan for later this week."
      ]
    },
    listen: {
      title: "The listening landscape",
      intro: "Tune into the sounds around you.",
      steps: [
        "Find a safe place to pause.",
        "Listen for natural and human-made sounds.",
        "Choose one sound you hadn't noticed before."
      ]
    }
  };

  const plan = plans[interest];
  const steps = plan.steps.slice(0, time <= 5 ? 2 : 3);

  $("generatedMission").innerHTML = `
    <span class="eyebrow">YOUR ${time}-MINUTE MISSION</span>
    <h3>${plan.title}</h3>
    <p>${plan.intro}</p>
    <p><strong>Note:</strong> This version uses a local JavaScript template
    engine, not a generative AI model.</p>
    <ol>${steps.map(step =>
      `<li>${escapeHTML(step)}</li>`
    ).join("")}</ol>
    <button class="btn primary" id="startMissionBtn">Let's go ↗</button>
  `;

  $("generatedMission").classList.remove("hidden");

  $("startMissionBtn").addEventListener("click", () => {
    state.minutes += time;
    state.points += 5;
    saveState();
    renderStats();

    $("generatedMission").innerHTML = `
      <span class="eyebrow">MISSION STARTED</span>
      <h3>Enjoy your time outside 🌿</h3>
      <p>Put your phone away and enjoy the real world.</p>
    `;

    showToast("Your outdoor mission has started!");
  });
}

function renderJournal() {
  const list = $("journalList");
  $("noteCount").textContent =
    `${state.notes.length} ${state.notes.length === 1 ? "note" : "notes"}`;

  if (state.notes.length === 0) {
    list.innerHTML = `
      <div class="empty-journal">
        ✳<br><br>
        Your field notes will live here.<br>
        Start with a little curiosity.
      </div>
    `;
    return;
  }

  const icons = {
    Plant: "🌱",
    Bird: "🐦",
    Sky: "☁️",
    Walk: "🥾",
    Other: "🍃"
  };

  list.innerHTML = [...state.notes].reverse().map(note => `
    <article class="journal-entry">
      <div class="entry-emoji">${icons[note.type] || "🍃"}</div>
      <div class="entry-main">
        <h4>${escapeHTML(note.title)}</h4>
        <p>${escapeHTML(note.details || "A little moment outside.")}</p>
        <div class="entry-meta">
          ${escapeHTML(note.type)} · ${note.minutes} minutes ·
          ${escapeHTML(note.date)}
        </div>
      </div>
      <button class="delete-note" data-delete="${note.id}"
              aria-label="Delete note">×</button>
    </article>
  `).join("");

  document.querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click", () => {
      state.notes = state.notes.filter(
        note => note.id !== button.dataset.delete
      );

      saveState();
      renderJournal();
      showToast("Field note deleted.");
    });
  });
}

// Filters
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item =>
      item.classList.remove("active")
    );

    button.classList.add("active");
    renderMissions(button.dataset.filter);
  });
});

// Mission generator
$("generateBtn").addEventListener("click", generateMission);

// Random adventure
$("surpriseBtn").addEventListener("click", () => {
  const remaining = missions.filter(
    mission => !state.completed.includes(mission.id)
  );

  const pool = remaining.length ? remaining : missions;
  const mission = pool[Math.floor(Math.random() * pool.length)];

  renderMissions("all");
  $("explore").scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    const button = document.querySelector(
      `[data-complete="${mission.id}"]`
    );
    button?.closest(".mission-card")?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 250);
});

// Journal form
$("journalForm").addEventListener("submit", event => {
  event.preventDefault();

  const title = $("noteTitle").value.trim();
  if (!title) return;

  const minutes = Math.min(
    600,
    Math.max(1, Number($("noteMinutes").value) || 1)
  );

  state.notes.push({
    id: crypto.randomUUID?.() || String(Date.now()),
    title,
    details: $("noteDetails").value.trim(),
    type: $("noteType").value,
    minutes,
    date: new Date().toLocaleDateString()
  });

  state.minutes += minutes;
  state.points += 5;

  saveState();
  renderJournal();
  renderStats();
  $("journalForm").reset();

  showToast("Your field note was saved on this device 🌿");
});

// Open-weight browser AI image classifier
async function getClassifier() {
  if (classifier) return classifier;

  $("modelStatus").textContent =
    "Loading the open-weight model. First download may take a while…";

  classifier = await pipeline(
    "image-classification",
    "Xenova/mobilenet_v2_1.0_224"
  );

  $("modelStatus").textContent = "AI model is ready in this browser.";
  return classifier;
}

$("chooseImageBtn").addEventListener("click", event => {
  event.stopPropagation();
  $("imageInput").click();
});

$("uploadZone").addEventListener("click", event => {
  if (event.target.id !== "chooseImageBtn") {
    $("imageInput").click();
  }
});

$("imageInput").addEventListener("change", event => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showToast("Please choose an image file.");
    return;
  }

  selectedFile = file;

  $("previewImage").src = URL.createObjectURL(file);
  $("previewImage").classList.remove("hidden");
  $("uploadPlaceholder").classList.add("hidden");
  $("analyzeBtn").disabled = false;
  $("analysisResult").classList.add("hidden");
});

$("analyzeBtn").addEventListener("click", async () => {
  if (!selectedFile) return;

  const button = $("analyzeBtn");
  const result = $("analysisResult");

  button.disabled = true;
  button.textContent = "Loading / analyzing…";
  result.classList.remove("hidden");
  result.textContent =
    "Preparing the image and loading the AI model…";

  try {
    const model = await getClassifier();
    const predictions = await model(selectedFile, { topk: 5 });

    result.innerHTML = `
      <h4>Model suggestions — verify these results</h4>
      ${predictions.map(prediction => `
        <div class="prediction">
          <span>${escapeHTML(
            prediction.label.replaceAll("_", " ")
          )}</span>
          <span>${Math.round(prediction.score * 100)}%</span>
        </div>
      `).join("")}
      <p class="disclaimer">
        This general image classifier is not a specialist plant or bird
        identifier. Scores do not guarantee correctness.
      </p>
      <button class="btn secondary" id="saveSuggestionBtn">
        Save top suggestion to journal
      </button>
    `;

    $("saveSuggestionBtn").addEventListener("click", () => {
      $("noteTitle").value =
        `Photo suggestion: ${predictions[0].label.replaceAll("_", " ")}`;

      $("noteDetails").value =
        "Unverified AI image-classification suggestion.";

      $("noteType").value = "Other";
      $("journal").scrollIntoView({ behavior: "smooth" });
      showToast("Suggestion added to the journal form.");
    });
  } catch (error) {
    console.error(error);

    result.textContent =
      "Could not load the model. Check your internet connection and try again.";
    $("modelStatus").textContent =
      "Model unavailable. Missions and journal still work.";
  } finally {
    button.disabled = false;
    button.textContent = "✦ Analyze with open AI";
  }
});

// Mobile menu
$("menuBtn").addEventListener("click", () => {
  $("nav").classList.toggle("open");
});

document.querySelectorAll("#nav a").forEach(link => {
  link.addEventListener("click", () => {
    $("nav").classList.remove("open");
  });
});

$("breakBtn").addEventListener("click", () => {
  showToast("Close this tab and enjoy your outside time 🌱");
});

// Initial render
renderMissions();
renderStats();
renderJournal();