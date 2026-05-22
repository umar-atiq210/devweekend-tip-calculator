# Devweekend Assessment - Answers

## 1. How to run
To run this project on a fresh machine:
1. Clone the repo and navigate to the directory (`cd tip-calculator`).
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the Vite server.
4. Open `http://localhost:5173` in your browser.
*(If deployed, Live URL: [Insert Your Vercel/Netlify URL Here])*

## 2. Stack & design choices
**Stack:** I chose React (via Vite) and Tailwind CSS v4. React's `useState` is perfect for the "live reactive updates" requirement without needing a "Calculate" button. Tailwind allowed me to rapidly build a responsive, polished UI without writing custom CSS files.

**Rounding Policy Defense:** For per-person amounts, I used `Math.ceil((grandTotal / numPeople) * 100) / 100` to always **round up** to the nearest cent. 
*Reasoning:* If a bill splits to Rs. 33.333 per person, standard rounding makes it 33.33. Three people paying 33.33 equals 99.99. The group underpays the restaurant. By strictly rounding up (33.34), the restaurant is always paid in full, and the extra 2 cents is a negligible overhead for the group.

**Visual/Interaction Decisions:**
1. **Tip Grid Layout:** Instead of a dropdown for tip percentages, I used a grid of highly visible preset buttons. This reduces friction (1 tap instead of 2) and keeps all options immediately scannable.
2. **Disabled Reset Button State:** The 'Reset' button remains greyed out (opacity lowered) until the user interacts with the app. This visually communicates to the user that the app is already in a clean state, preventing unnecessary clicks.

## 3. Responsive & accessibility
**Responsiveness:** - On a 360px phone, the app uses `flex-col` so the input panel stacks vertically above the dark results panel, ensuring no horizontal scrolling. 
- On a 1440px laptop, it switches to `md:flex-row`, placing inputs on the left and the sticky result panel on the right.

**Accessibility (a11y) Handled:** I added `aria-live="polite"` to the results container. Since there is no "Calculate" button, screen readers wouldn't normally know the total changed. Now, they will gracefully announce the updated totals as the user types. I also used `aria-invalid` on inputs when validation fails.

**Accessibility Skipped:** I knowingly skipped implementing a "Dark Mode / Light Mode" toggle. While great for visual accessibility, managing color tokens across the entire app would have taken time away from polishing the core validation and keyboard interaction logic within the given timeframe.

## 4. AI usage
* **Tools Used:** Gemini and Claude principles.
* **What I asked:** I used AI to generate the initial React boilerplate, the Tailwind flexbox layout structure, and basic state management.
* **What I changed (The Edge Case Overhaul):** The AI initially gave me `<input type="number">` for the fields and basic empty-string validation. I completely rewrote this because browser number inputs awkwardly allow characters like 'e', '+', and '-' to be pasted, which breaks logic. 
I changed the inputs to `<input type="text" inputMode="decimal">` and applied strict Regex `(/^\d*\.?\d{0,2}$/)` to prevent negative numbers and garbage text entirely. 
Furthermore, the AI output allowed absurdly large numbers. I realized someone could type a 20-digit number for "Number of People", breaking the UI layout and resulting in logical nonsense. I manually intercepted the handler and added length limits (`if (val.length > 4) return;` for people, and 10 for bills) before state updates.

## 5. Honest gap
One thing missing from this submission is **State Persistence**. If a user is midway through splitting a complex bill and accidentally refreshes the browser, all data is lost. With another day, I would implement a custom React hook that syncs the state with `localStorage`, so the session survives page reloads.