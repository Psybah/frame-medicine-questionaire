# Product Requirements Document (PRD): FRAME Quiz / Funnel

## Overview
Develop a 6-step FRAME Quiz/Funnel to qualify users for testosterone therapy and related services. The funnel will guide users from initial engagement through qualification, payment, and onboarding, with best practices for conversion and compliance.

---

## Goals
- Efficiently qualify leads for FRAME services.
- Minimize user drop-off with a streamlined, mobile-first experience.
- Ensure HIPAA compliance and secure data handling.
- Automate follow-up and onboarding processes.

---

## Steps & Requirements

### Step 0: Entry Point
- **CTA Buttons:** “Start Your Framework” / “See If You’re a Candidate”
- **Placement:** Hero section, sticky navigation, and repeated at key service breakpoints.

### Step 1: Basics
- **Purpose:** Collect essential information to route users into the consult flow.
- **Fields:**
  - First name, last name
  - Date of birth
  - State of residence (auto-filter to eligible states: WA, FL, GA, NE)
  - Email and phone (SMS verification optional but preferred for follow-up)

### Step 2: Health Snapshot
- **Purpose:** Quick self-screen for eligibility.
- **Fields:**
  - Height / weight
  - Energy levels (low / moderate / high)
  - Main concerns (multi-select):
    - Low energy
    - Low sex drive / performance
    - Trouble building muscle
    - Fat gain / hard to lose fat
    - Hair loss
    - Sleep issues
  - Medical history quick check (heart disease, uncontrolled diabetes, cancer, active infection)

### Step 3: Service Alignment
- **Purpose:** Route user to the appropriate service pathway.
- **Question:** “What are you most interested in today?”
  - Testosterone therapy
  - Erectile function solutions
  - Hair treatment
  - Coaching (fitness/nutrition/lifestyle)
- **Branching Logic:**
  - TRT path triggers lab order
  - Coaching path goes to intake scheduling

### Step 4: Labs & Payment
- **Purpose:** Friction-controlled checkout.
- **Requirements:**
  - Clear language: “$100 covers your full lab panel and physician review. If you’re a candidate, your plan continues. If not, you’ll get a personal note back with recommendations — no bait, no upsell.”
  - Secure payment collection
  - Immediate confirmation page with instructions (lab draw locations, scheduling, prep)

### Step 5: Confirmation Page
- **Header:** “Next step: your labs.”
- **Checklist:**
  - Print/email lab order
  - Complete labs within 7 days
  - Results reviewed by FRAME physician
  - Results + recommendation emailed within 3–5 business days
  - “Questions?” → click-to-call / support email

### Step 6: Follow-up Automations
- **Abandoned quiz:** 2-part SMS/email nudge within 24h and 72h
- **Missed lab:** Reminder at 7 days and 14 days
- **Not a candidate:** Send polite closure + optional coaching invite
- **Candidate:** Route to subscription onboarding ($150/mo TRT)

---

## CRO & UX Best Practices
- Embedded progress bar at top (“Step 1 of 4”) to reduce drop-off
- Mobile-first layout (large buttons, short inputs)
- Simple, direct language (no corporate speak)
- Repeated CTA: sticky “Start Now” button throughout
- Trust badge: “HIPAA-secure. Labs + review by FRAME physician.”