# 🌿 TerraQuest — Find Your Outside

> **A little less scrolling. A little more living.**  
> Outdoor missions, browser-based image AI, and a field journal to help people reconnect with the world outside.

TerraQuest is a responsive front-end web project built with **HTML, CSS, and JavaScript**. It encourages users to spend mindful time outdoors through small missions, photo exploration, and personal field notes.

It **does not require Ollama, an AI API key, or a backend server**.

---

## ✨ Features

### 🧭 Outdoor missions
- Browse approachable outdoor activities.
- Filter missions by available time and location type.
- Mark missions complete or undo completion.
- Explore activities like listening to nature, cloud watching, colour hunts, photography, and caring for green spaces.

### 🤖 Browser-based photo AI
- Select and preview an image.
- Run a pretrained image-classification model in the browser with [Transformers.js](https://huggingface.co/docs/transformers.js).
- View the top predicted labels and confidence scores.
- No Ollama server or AI API key is required.

**Model:** `Xenova/mobilenet_v2_1.0_224`

> Image classification gives predictions, not guaranteed identifications. It may misidentify plants or animals and must not be used for safety-critical decisions.

### 📓 Field journal
- Save notes about what you notice outdoors.
- Display the date and time for each note.
- Delete notes.
- Store entries in the current browser using `localStorage`.

### 📊 Progress dashboard
- Count completed missions.
- Count saved journal entries.
- Count distinct dates represented in journal entries. This is not a consecutive-day streak.

### 📱 Responsive interface
- Responsive layout for desktop and mobile screens.
- Nature-inspired colours, mission cards, photo analysis, and journal sections.

---

## 🧰 Tech stack

| Technology | Purpose |
| --- | --- |
| HTML5 | Page structure and forms |
| CSS3 | Layout, styling, responsive design |
| JavaScript ES modules | Interactions and application logic |
| Transformers.js | Browser-side model inference |
| MobileNet V2 | Pretrained image-classification model |
| `localStorage` | Local mission and journal persistence |
| GitHub Pages | Static website hosting |

---

## 📁 Project structure

```text
terraquest/
├── index.html       # Website structure
├── style.css        # Styling and responsive layout
├── script.js        # App functionality and browser AI
└── README.md        # Project documentation
```

---

## 🚀 Run locally

### Requirements
- A modern browser (Chrome, Edge, Firefox, or Safari).
- [Visual Studio Code](https://code.visualstudio.com/) or another code editor.
- Internet access to load the JavaScript library and model files.

### Steps
1. Download or clone this repository.
2. Open the project folder in VS Code.
3. Install the **Live Server** extension if needed.
4. Open `index.html`.
5. Click **Go Live** in the VS Code status bar.
6. Open the local URL shown by Live Server.
7. Test the mission filters, mark a mission complete, save a field note, and try Photo AI.

**Why Live Server?** The project uses JavaScript modules loaded from a CDN. Opening `index.html` directly using a `file://` URL can cause browser security or module-loading issues.

---

## 🌐 Deploy on GitHub Pages

1. Create a repository on [GitHub](https://github.com/), for example `terraquest`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Commit the files to the `main` branch.
4. Open the repository's **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main` and folder `/ (root)`.
7. Click **Save** and wait for deployment.

The URL usually follows this format:

```text
https://YOUR-USERNAME.github.io/terraquest/
```

Replace `YOUR-USERNAME` and `terraquest` with your GitHub username and repository name. Future commits to the configured branch will trigger updates.

---

## 🧠 How the AI works

TerraQuest uses a pretrained image-classification model through Transformers.js.

1. The user selects an image.
2. The browser displays a preview.
3. When **Analyze photo** is clicked, the app loads the model if needed.
4. The image is passed to the model.
5. The top predicted labels and scores are displayed.

### Does it use Ollama?
**No.** TerraQuest does not require Ollama or a local language-model server.

### Does it need an API key?
No AI API key is needed for image classification. The browser does need internet access to fetch the JavaScript library and model files.

### Is the mission generator generative AI?
No. In this version, mission suggestions come from a curated JavaScript list and filters. This keeps the app simple and avoids needing a separate LLM service.

### Where does the model run?
Inference is initiated in the browser through Transformers.js. Model files are fetched from their host when required.

---

## 🔐 Privacy and data

- No account is required.
- Mission completion and journal notes are saved in browser `localStorage`.
- Local storage is tied to the browser and website origin; it does not sync between devices.
- Clearing browser site data may delete saved progress and notes.
- The model and JavaScript library are fetched from external hosting services.
- There is no custom backend or database in this project.

Avoid putting sensitive personal information in the journal.

---

## 🛠️ Customize the project

### Add a mission
Add an object to the `missions` array in `script.js`. Each mission should have a unique `id`.

```js
{
  id: "birdwatch",
  icon: "🐦",
  title: "Birdwatching break",
  time: 10,
  place: ["home", "park", "street"],
  type: "Notice",
  desc: "Listen and look for birds from a safe, respectful distance."
}
```

### Change the design
Edit `style.css`. Theme colours are defined as CSS custom properties near the top in `:root`.

### Change the model
The model is specified in the `pipeline()` call in `script.js`. Check that any replacement supports the `image-classification` task and the installed Transformers.js version.

---

## 🧪 Troubleshooting

### Photo AI does not load
- Check your internet connection.
- Allow time for the first model download.
- Refresh and try again.
- Use Live Server or GitHub Pages instead of opening the HTML file directly.
- Check the browser developer console for errors.

### The page loads but photo analysis fails
The main site is static, but photo analysis relies on an external library and model files. If the host is unavailable, blocked, or incompatible, the rest of the website may work while photo analysis fails.

### Progress or notes disappeared
Data is stored in the browser. Use the same browser and website origin, and check that site data has not been cleared. Data saved on your local development URL will not automatically appear on the GitHub Pages URL.

### GitHub Pages does not show my latest changes
- Confirm that changes are committed to the configured branch.
- Wait for the deployment to finish.
- Refresh or hard-refresh the page.

---

## 🗺️ Future improvements

Possible next steps (not implemented yet):

- [ ] Mission difficulty selector.
- [ ] Seasonal or weather-aware activities.
- [ ] Custom user-created missions.
- [ ] Export and import journal notes.
- [ ] More accessibility and keyboard testing.
- [ ] Offline support where practical.
- [ ] Optional AI-generated mission suggestions using an in-browser language model or hosted AI service.
- [ ] Automated tests for filters, storage, and journal behaviour.

---

## 🌱 Project purpose

TerraQuest explores how a small web app can encourage people to observe their surroundings, take mindful breaks, and build a habit of noticing nature. It also demonstrates how browser-based AI tools can make an AI feature possible without requiring every developer to run a local LLM server.

The aim is to make exploring outdoors feel approachable, one small mission at a time.

---

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a branch for your change.
3. Make a focused improvement.
4. Test locally.
5. Submit a pull request explaining the change.

Please keep changes accessible, respect user privacy, and avoid encouraging people to enter unsafe areas or disturb wildlife.

---

## 📄 License

**No license has been selected yet.** Add a `LICENSE` file before presenting the project as open source. The MIT License is one common permissive option, but choose the license that fits your intentions and review the terms of third-party dependencies and model assets.

---

## 🙌 Acknowledgements

- [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js) — browser-based model inference.
- [Xenova MobileNet V2](https://huggingface.co/Xenova/mobilenet_v2_1.0_224) — image-classification model.
- [GitHub Pages](https://pages.github.com/) — static website hosting.

---

**Built with curiosity, code, and a little more time outside. 🌿**
