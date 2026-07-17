# NeuroAccess

NeuroAccess is a Chrome extension project focused on making websites easier to use for people with accessibility needs.

See [Project.md](./Project.md) for repo layout, module setup commands, and stack choices, and [CLAUDE.md](./CLAUDE.md) for architecture notes.

## Problem We Are Solving

Many websites still have accessibility barriers such as missing image descriptions, poor contrast, weak keyboard navigation, and difficult reading interfaces. These issues make the web harder to use for millions of people.

NeuroAccess provides one-click, privacy-first accessibility assistance directly in the browser.

## Why This Matters

Accessibility barriers are not edge cases. They affect school admissions, job applications, banking, healthcare forms, learning portals, and daily communication.

NeuroAccess focuses on reducing these barriers in seconds, so users can complete tasks with dignity, speed, and independence.

## Who NeuroAccess Helps

NeuroAccess is designed to support people with:

- Blindness and severe low vision
- Moderate low vision and age-related vision decline
- Color vision deficiency (protanopia, deuteranopia, tritanopia)
- Dyslexia and reading difficulties
- Cognitive load and attention challenges
- Motor impairments that make precise mouse use difficult
- Temporary impairments (eye strain, injury, fatigue)

NeuroAccess is an assistive tool, not a medical treatment. It helps users navigate and read the web more effectively.

## Disability/Condition to Feature Mapping

| User group or challenge                                                  | Common web barrier                                            | NeuroAccess support                                                         |
| ------------------------------------------------------------------------ | ------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Blind users                                                              | Images and controls are not understandable via screen readers | AI image labeling + OCR, ARIA improvements, voice commands, profile presets |
| Low vision users                                                         | Small text, poor contrast, visual clutter                     | Smart contrast fixer, readability-focused profiles, better focus visibility |
| Color vision deficiency (protanopia, deuteranopia, tritanopia)           | Color-only meaning and weak color contrast                    | Color-blind presets + WCAG-oriented contrast adjustments                    |
| Dyslexia and reading difficulties                                        | Dense text and reading fatigue                                | Text-to-speech, paced reading support, profile-based simplification         |
| Motor impairments (for example tremors, arthritis, limited fine control) | Precise clicking and deep navigation are difficult            | Voice navigation commands, keyboard navigation enhancements, skip links     |
| Cognitive and attention challenges                                       | Complex layouts and high cognitive load                       | One-click accessibility mode, guided profiles, cleaner navigation flow      |
| Age-related accessibility decline                                        | Mixed vision, motor, and reading friction                     | Personalized profile combinations and one-click fixes                       |
| Temporary impairments (eye strain, injury, fatigue)                      | Reduced readability and navigation speed                      | Instant contrast, TTS, and keyboard-first shortcuts                         |
| Deaf or hard-of-hearing users                                            | Audio-first content is hard to consume                        | Caption/transcript-oriented workflows and visual-first interaction patterns |

## Real-Life Use Cases

- A low-vision student can increase readability and contrast instantly before reading long course material.
- A blind or keyboard-first user can run one-click fixes, then navigate faster with skip links and improved semantics.
- A user with motor impairments can use voice commands for scrolling, page navigation, and action triggering.
- A dyslexic user can switch to TTS and profile-based reading support to reduce cognitive strain.

## What Success Looks Like

- Fewer accessibility blockers on real websites after one-click mode.
- Faster task completion for users with assistive needs.
- Better independence through local-first tools that do not require advanced setup.

## Core Features

- One-click Global Accessibility Mode
  - Accessibility audit
  - Safe auto-fixes (alt text placeholders, ARIA improvements, heading and navigation helpers)
  - Before/after issue summary
- AI image labeling and OCR
  - Detects unlabeled images
  - Generates editable alt text suggestions
- Text-to-speech (TTS)
  - Read selected text or full page
  - User controls for playback
- Speech-to-text and voice commands (STT)
  - Hands-free navigation actions
- Smart contrast fixer
  - WCAG-oriented readability improvements
  - Color-blind presets
- Enhanced keyboard navigation
  - Better tab flow and focus visibility
  - Skip-link support
- Accessibility profiles
  - Default, Blind, Low Vision, Dyslexic
  - Site-level overrides and personalization
- Accessibility report output
  - Machine-readable report export for tracking improvements

## Privacy and Security Principles

- Local-first by default
- Optional cloud AI integrations
- No hidden tracking of user browsing content
- Secure handling of user-provided API keys
