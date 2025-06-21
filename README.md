# Resume App

A modern, full-stack resume builder built with React + TypeScript, Firebase, and Firestore. Features a user-friendly UI, Google authentication, live PDF preview/export, drag-and-drop section reordering, undo/redo, and AI-powered resume import.

## Features

- **Google Authentication**: Secure login with Google.
- **Firestore Integration**: All resume data is saved to your user profile in Firestore.
- **Modular Resume Builder**: Add, remove, reorder, and toggle visibility of sections (Header, Summary, Work, Education, Certifications, Skills, Custom Sections).
- **Drag-and-Drop**: Reorder sections using an intuitive drag handle.
- **Undo/Redo**: Instantly revert or reapply changes to your resume.
- **Live PDF Preview & Export**: See your resume as a PDF in real time and export it with one click.
- **Resume Importer**: Paste or upload your resume, generate a ChatGPT prompt, and import AI-generated JSON to auto-fill all sections. PDF upload with text extraction supported.
- **Responsive Dashboard**: View your saved resume, sign out, and navigate easily between Dashboard and Resume Builder.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

3. **Build for production:**
   ```bash
   npm run build
   ```

## Scripts
- `npm start` – Start development server
- `npm run build` – Build for production
- `npm test` – Run tests
- `npm run eject` – Eject from Create React App (not recommended)

## Tech Stack
- React 19 + TypeScript
- Firebase Auth & Firestore
- @dnd-kit for drag-and-drop
- @react-pdf/renderer for PDF preview/export
- pdfjs-dist for PDF text extraction
- Zustand for state management

## Customization
- Update Firebase config in `src/lib/firebase.ts` for your own project.
- Modify resume section components in `src/components/sections/` as needed.

## License
MIT
