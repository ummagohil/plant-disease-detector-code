# 🌿 Plant Disease Detector

Upload an image of a plant to identify potential diseases and learn how to treat them, or confirm if your plant is healthy. Powered by the Gemini API.

---

## Features

- **Image Upload**: Drag-and-drop or click to upload a plant image (PNG, JPG, GIF up to 10MB).
- **AI Analysis**: Uses Google Gemini's multimodal model to analyze the plant's health and detect diseases or pests.
- **Beautiful Results**: Results are rendered with markdown formatting for clarity and readability.
- **Modern UI**: Responsive, accessible, and styled with Tailwind CSS.
- **TypeScript & Best Practices**: Clean, typed codebase with tests and linting.

---

## How It Works

1. **Upload**: The user uploads a plant image using the drag-and-drop area or file picker.
2. **Preview**: The selected image is previewed in the UI. The user can clear and re-upload if needed.
3. **Analyze**: Clicking "Analyze Plant" sends the image to the Gemini API for analysis.
4. **Gemini Model**: The image is converted to base64 and sent to Gemini with a detailed system prompt instructing it to:
   - Assess overall plant health
   - Identify diseases or pests (with name, symptoms, treatment, prevention)
   - Confirm health if no issues are found
   - Format the response with markdown headings and lists
5. **Result**: The AI's markdown-formatted response is displayed beautifully in the UI.

---

## Project Structure & Components

```
plant-disease-detector/
├── src/
│   ├── App.tsx                # Main app logic and state
│   ├── index.tsx              # Entry point
│   ├── components/
│   │   ├── ImageUploader.tsx      # Handles image upload, drag-and-drop, preview, and clear
│   │   ├── AnalysisDisplay.tsx    # Shows loading spinner and renders markdown analysis result
│   │   ├── LoadingSpinner.tsx     # Animated spinner for loading states
│   │   ├── IconComponents.tsx     # SVG icons for UI polish
│   │   └── ...
│   ├── services/
│   │   └── geminiService.ts       # Handles Gemini API calls and system prompt
│   ├── utils/
│   │   └── imageUtils.ts          # Converts image files to base64 for API
│   └── setupTests.ts              # (empty, for test setup)
```

### Component Overview

- **App.tsx**: Orchestrates the app. Manages state for the uploaded image, preview, loading, errors, and analysis result. Handles the flow from upload to analysis to result display.
- **ImageUploader.tsx**: Provides a drag-and-drop area and file picker. Shows a preview of the selected image and a button to clear it. Calls parent callbacks on select/clear.
- **AnalysisDisplay.tsx**: Shows a loading spinner during analysis. When a result is available, renders it using `react-markdown` and Tailwind's `prose` class for beautiful formatting.
- **LoadingSpinner.tsx**: Simple animated SVG spinner, used during analysis.
- **IconComponents.tsx**: Collection of SVG icons (leaf, upload, sparkles, alert, close) for UI polish.
- **geminiService.ts**: Contains the `analyzePlantImage` function. Converts the image to base64, sends it to Gemini with a detailed system prompt, and returns the markdown-formatted analysis.
- **imageUtils.ts**: Utility to convert image files to base64 strings for API upload.

---

## Gemini Model Integration

- The app uses the [@google/genai](https://www.npmjs.com/package/@google/genai) package to call Gemini's multimodal model.
- The system prompt instructs Gemini to act as a plant pathologist, providing:
  - An overall assessment
  - Disease/pest detection (with name, symptoms, treatment, prevention)
  - Markdown formatting for clarity
- The API key is read from the `API_KEY` environment variable. **You must set this to use the app.**

---

## Setup & Usage

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Set your Gemini API key:**
   - Create a `.env` file in the project root:
     ```sh
     echo "API_KEY=your-gemini-api-key" > .env
     ```
   - Or set `API_KEY` in your shell environment.
3. **Start the development server:**
   ```sh
   npm run dev
   ```
4. **Run tests:**
   ```sh
   npm test
   ```
5. **Check code quality:**
   ```sh
   npm run lint
   ```

---

## Example Workflow

1. **User uploads a plant image** via drag-and-drop or file picker.
2. **Image is previewed**. User can clear and re-upload if needed.
3. **User clicks "Analyze Plant"**. The app:
   - Converts the image to base64
   - Calls Gemini with the image and system prompt
   - Shows a loading spinner
4. **Gemini analyzes the image** and returns a markdown-formatted report.
5. **Result is displayed** with headings, lists, and clear formatting.

---
