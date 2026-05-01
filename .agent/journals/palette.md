## 2024-05-01 - [ContactForm Accessibility Enhancements]
Learning: Form inputs like the ContactForm lacked semantic label relationships and screen-reader accessibility, missing the `required` states, and lacked clear keyboard `focus-visible` indicators.
Action: Add explicit `id` parameters mapped to `for` on visually hidden (`sr-only`) `<label>` tags. Implement `required` attributes and `focus-visible:ring-1` with theme color variables on input fields for clear accessibility.
