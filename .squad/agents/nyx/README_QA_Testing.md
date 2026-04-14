# Nyx QA Testing Documentation
**QA Engineer:** Nyx  
**Project:** PortfolioSigge (React/TypeScript Portfolio Site)  
**Last Updated:** 2026-03-29  

---

## 📋 QA Documents Index

### Current Testing Phase (2026-03-29)

#### **1. QA_SUMMARY_Contact_ProjectList.md** ⭐ START HERE
**What:** 1-page executive summary for stakeholders  
**Who:** Product managers, designers, code owners  
**Content:** Test scope, acceptance criteria, success metrics, critical issues to watch  
**Read time:** 5 minutes  

#### **2. QA_CHECKLIST_Contact_ProjectList.md** ⭐ FOR DAILY TESTING
**What:** Quick reference checklist for manual test execution  
**Who:** Nyx (daily testing workflow)  
**Content:** Condensed test cases, checkboxes, bug recording template, sign-off tracking  
**Read time:** 2 minutes (during testing, refer back repeatedly)  

#### **3. QA_TEST_PLAN_Contact_ProjectList.md** 📖 COMPREHENSIVE SPEC
**What:** Complete test specification (5,100+ lines)  
**Who:** QA engineers, test automation engineers, code reviewers  
**Content:**  
- 1.1–1.6: Contact Page testing (visual, responsive, form interaction, keyboard nav, a11y, cross-browser)
- 2.1–2.9: ProjectList testing (rendering, filters, sorting, responsive, keyboard nav, a11y, integration)
- Part 3: Test execution workflow, acceptance criteria summary, critical vs. nice-to-have
- Part 4: Tools & scripts reference
- Part 5: QA sign-off checklist

**Read time:** 30 minutes (reference during test execution)  

---

## 🚀 Quick Start: How to Use These Documents

### Scenario 1: I'm a Stakeholder (Product/Design)
👉 Read: **QA_SUMMARY_Contact_ProjectList.md**
- Understand what's being tested
- See acceptance criteria and critical issues
- Check test timeline and success metrics

### Scenario 2: I'm QA/Nyx (Executing Tests)
👉 Use: **QA_CHECKLIST_Contact_ProjectList.md**
- Open in browser or editor
- Work through checklist items systematically
- Check off as you go
- Record bugs with severity
- Fill in sign-off section when complete

👉 Reference: **QA_TEST_PLAN_Contact_ProjectList.md**
- For detailed test case descriptions
- Clarification on acceptance criteria
- Edge case handling
- Tools and browser setup

### Scenario 3: I'm a Code Reviewer (PR Review)
👉 Check: **QA_SUMMARY_Contact_ProjectList.md** (acceptance criteria section)
- Verify code changes address all critical test cases
- See what QA validated before PR submission

👉 Reference: **QA_TEST_PLAN_Contact_ProjectList.md** (Parts 3–4)
- Review regression risk assessment
- Understand test scope
- See which areas need special attention

---

## 📝 Test Execution Workflow

### Step 1: Setup (Pre-Test)
```bash
cd C:\Users\msigf\source\repos\PortfolioSigge
npm install                    # Install dependencies
npm run dev                    # Start Vite dev server (http://localhost:5173)
npm run type-check            # Verify no TypeScript errors
```

### Step 2: Execute Tests (Manual)
1. Open **QA_CHECKLIST_Contact_ProjectList.md**
2. Navigate to Contact page or Projects page in browser
3. Work through checklist systematically
4. **For each failing test:**
   - Copy bug template from checklist
   - Record severity, steps to reproduce, screenshot/video
   - Note assignee (Selene for code, Lyra for design)
5. Check off passing items

### Step 3: Collect Evidence
- **Screenshots:** Capture at 320px, 768px, 1024px, 1920px (responsive verification)
- **Videos:** Record parallax smoothness, filter/sort animations
- **Contrast checker:** Use axe DevTools or WebAIM for color contrast audit
- **Accessibility:** Test with screen reader (NVDA, JAWS, or VoiceOver if Mac)

### Step 4: Generate Report
1. Compile all bugs with severity/assignee
2. Record performance metrics (Lighthouse, DevTools Performance tab)
3. Note any deviations from test plan (e.g., "Android mobile parallax not smooth — acceptable fallback")
4. Fill in **QA_SUMMARY_Contact_ProjectList.md** sign-off section
5. Create PR comment with findings or submit as separate document

### Step 5: Sign-Off
When all critical bugs resolved:
- [ ] All test items executed
- [ ] Bugs recorded with severity and assignee
- [ ] Performance metrics within target range
- [ ] Accessibility audit passed (axe or manual)
- [ ] Visual baseline captured
- [ ] Ready for PR review

---

## 🎯 Acceptance Criteria (TL;DR)

### Contact Page ✅ Passes When:
- Parallax smooth (no jank), gradient visible, responsive at 4 breakpoints
- Form inputs focusable, tab order logical, labels associated
- Color contrast ≥4.5:1, no TypeScript errors, cross-browser consistent

### ProjectList ✅ Passes When:
- Renders without crashes, keyword filter works (case-insensitive, instant)
- Tag filter works (multi-select, correct logic), all sorts functional
- Responsive grid (1 col → 3+ col), keyboard nav complete, <100ms filter/sort
- No TypeScript errors, no console warnings, WCAG 2.1 AA compliant

---

## 🐛 Bug Severity Levels

| Level | Definition | Action |
|-------|-----------|--------|
| 🔴 **Critical** | Feature broken, not deployable, accessibility violation | Must fix before merge |
| 🟠 **High** | Feature works but with significant issues, poor UX | Should fix before merge |
| 🟡 **Medium** | Feature works but with minor issues, edge case | Nice to have, can defer |
| 🟢 **Low** | Nice-to-have improvement, no impact on core flow | Post-MVP |

---

## 📊 Coverage Summary

| Component | Test Cases | Status |
|-----------|-----------|--------|
| Contact Page Banner | 15 | 📋 Ready |
| Contact Links | 12 | 📋 Ready |
| Contact Form | 18 | 📋 Ready |
| Keyboard/A11y (Contact) | 12 | 📋 Ready |
| Responsive (Contact) | 20 | 📋 Ready |
| ProjectList Render | 8 | 📋 Ready |
| Keyword Filter | 12 | 📋 Ready |
| Tag Filter | 10 | 📋 Ready |
| Sort Controls | 20 | 📋 Ready |
| Integration (Filter+Sort) | 8 | 📋 Ready |
| Responsive (ProjectList) | 16 | 📋 Ready |
| Keyboard/A11y (ProjectList) | 14 | 📋 Ready |
| **Total** | **165+ test cases** | **Ready** |

---

## 🛠️ Tools & Resources

### Accessibility Testing
- **axe DevTools** (free, Chrome/Firefox): Automatic a11y audit
- **WAVE** (free, browser extension): HTML structure validation
- **Lighthouse** (built-in, Chrome DevTools): a11y + performance audit
- **WebAIM Contrast Checker** (online): Color contrast verification
- **Screen Readers:** NVDA (Windows, free), VoiceOver (Mac, built-in)

### Performance Testing
- **Chrome DevTools:** Performance tab (frame rate, paint time), Lighthouse
- **Responsive Design Mode:** Chrome/Firefox built-in tool
- **Mobile Device Testing:** Physical mobile or emulator

### Visual Regression
- **Manual screenshots:** Baseline at 320px, 768px, 1024px, 1920px
- **Browser DevTools:** Full-page screenshot capture
- **Percy/Chromatic:** (Optional, future) Automated visual regression

---

## 📞 Questions or Issues?

- **About test plan scope?** → Review **QA_TEST_PLAN_Contact_ProjectList.md** Part 1–2
- **Unclear test case?** → See detailed description in test plan with examples
- **Tool setup help?** → Check **Part 4** of test plan (Tools & Scripts section)
- **Found a bug, unsure severity?** → Refer to severity levels table above
- **Need clarification on acceptance criteria?** → Check **QA_SUMMARY_Contact_ProjectList.md**

---

## 📈 Test Timeline (Planned)

| Phase | Duration | Owner | Deliverable |
|-------|----------|-------|-------------|
| **Pre-test Setup** | 1 day | Nyx | Dev environment ready, dependencies installed |
| **Contact Page Testing** | 1.5 days | Nyx | Bugs reported, visual baseline captured |
| **ProjectList Testing** | 1.5 days | Nyx | Functional tests complete, performance metrics |
| **Bug Fix + Retest** | 1.5 days | Selene/Lyra + Nyx | Critical issues resolved, sign-off ready |
| **Documentation** | 0.5 days | Nyx | Final report, PR review ready |
| **Total** | **5–6 days** | — | **Ready for merge** |

---

## ✅ Success Checklist (QA Sign-Off)

When all items checked, features are ready for PR merge:

- [ ] All 165+ test cases executed (Contact + ProjectList)
- [ ] Bugs recorded with severity and assignee
- [ ] Critical bugs resolved and re-tested
- [ ] Visual baseline captured (screenshots at 4 breakpoints)
- [ ] Accessibility audit completed (axe or manual, WCAG 2.1 AA)
- [ ] Performance metrics recorded (Lighthouse, filter/sort <100ms, 60fps reflow)
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] No console errors or React warnings
- [ ] Keyboard navigation verified (tab order, focus visible)
- [ ] Responsive layout verified (1 col → 3+ col across breakpoints)
- [ ] Edge cases documented (known limitations, acceptable fallbacks)
- [ ] QA sign-off given: "Ready for PR review and merge"

---

## 📄 Document Versions

| Document | Version | Date | Purpose |
|----------|---------|------|---------|
| QA_SUMMARY_Contact_ProjectList.md | 1.0 | 2026-03-29 | Executive summary |
| QA_CHECKLIST_Contact_ProjectList.md | 1.0 | 2026-03-29 | Daily testing reference |
| QA_TEST_PLAN_Contact_ProjectList.md | 1.0 | 2026-03-29 | Comprehensive spec |
| README_QA_Testing.md | 1.0 | 2026-03-29 | This document |

---

**Status:** 📋 Ready for test execution  
**Next Step:** Begin testing with QA_CHECKLIST_Contact_ProjectList.md  
**Final Sign-Off Date:** [TBD, approximately 2026-04-04]  

---

*Prepared by Nyx, QA Engineer | PortfolioSigge Project*
