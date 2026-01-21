---
description: Cyberdelics 101 Course Development - Project rules and progressive build guidelines
---

# Cyberdelics 101 Interactive Course - Development Workflow

## PROJECT STRUCTURE

```
Cyberdelics-101-Web Structure/
├── core/                    # SHARED - changes affect ALL lessons
│   ├── styles.css           # Design tokens, dark theme
│   ├── course-core.js       # Progress tracking, Framer bridge
│   ├── method-base.js       # createTeachingMethod() factory
│   └── method-loader.js     # Auto-discovery via [data-method]
│
├── methods/                 # MODULAR - each method is independent
│   └── [method-name]/
│       ├── [method-name].css
│       └── [method-name].js
│
├── lessons/                 # CONTENT - uses core + methods
│   └── [lesson-name]/
│       └── index.html
│
├── Cyberdelics_101_Course_Overview.md   # Content reference
└── Interactive_teaching_methods.md      # Method specifications
```

---

## RULES FOR PROGRESSIVE DEVELOPMENT

### 1. Before Any Change - Check Dependencies
- **CORE files** → Check which lessons/methods use them before editing
- **METHOD files** → Only affect lessons using that method
- **LESSON files** → Isolated, safe to modify independently

### 2. Required Interface (method-base.js)
All teaching methods MUST implement:
```javascript
{
    onInit(container, options)   // Called by init()
    onDestroy()                  // Cleanup listeners
    onReset()                    // Return to initial state
    getCustomState()             // Method-specific state
    setCustomState(savedState)   // Restore method-specific state
}
```
Plus inherited from base: init(), getProgress(), emit(), on(), etc.

### 3. Testing Requirements
After ANY code change:
- [ ] Open lesson in browser
- [ ] Check console for JavaScript errors
- [ ] Verify progress bar updates correctly
- [ ] Verify completion button behavior
- [ ] If method was changed: test ALL lessons using that method

### 4. Script Load Order in Lessons
Scripts MUST load in this order:
```html
<script src="core/course-core.js"></script>
<script src="core/method-base.js"></script>
<script src="methods/[method]/[method].js"></script>
```

### 5. CSS Scoping
Method CSS should be scoped to prevent conflicts:
```css
/* GOOD - scoped to method */
[data-method="progressive-disclosure"] .reveal-section { }

/* RISKY - global selector */
.reveal-section { }
```

### 6. Adding New Teaching Methods
1. Create folder: `methods/[method-name]/`
2. Create CSS and JS files
3. Use `createTeachingMethod('[name]', { ... })` factory
4. Implement required lifecycle hooks
5. Test in isolation first, then in lesson

### 7. Adding New Lessons
1. Create folder: `lessons/[lesson-name]/`
2. Copy HTML template from existing lesson
3. Update content
4. Include correct script paths
5. Register lesson ID in CourseCore.init()

---

## CROSS-CHECK BEFORE COMMITTING

| If you change... | Then verify... |
|------------------|----------------|
| `core/styles.css` | All lessons still render correctly |
| `core/method-base.js` | All methods still work |
| `core/course-core.js` | Progress tracking in all lessons |
| Any method JS | All lessons using that method |
| Lesson HTML | Just that lesson (isolated) |

---

## FRAMER INTEGRATION (Future)
The Framer bridge is scaffolded but not active. When ready:
- Messages sent via `CourseCore.framer.postMessage()`
- Events: `cyberdelics-started`, `cyberdelics-progress`, `cyberdelics-complete`
- Lesson ID passed with each message

## VERSION CONTROL (REQUIRED)

**Repository:** https://github.com/Tee-Rez/Cyberdelics-101-Web-Structure

### After Completing ANY Section/Feature:
// turbo
1. Agent MUST ask: "Would you like to commit and push these changes to GitHub?"
2. If yes, run:
   ```bash
   git add .
   git commit -m "[SUMMARY]"
   git push
   ```
3. The commit message should summarize what was completed

### Commit Message Format:
```
[TYPE]: Brief description

- Bullet points of specific changes
- Files added/modified
```

**Types:**
- `feat:` New feature or method
- `fix:` Bug fix
- `refactor:` Code restructure (no new features)
- `docs:` Documentation changes
- `style:` CSS/visual changes

### Example Commit:
```
feat: Add Scenario-Based teaching method

- Created methods/scenario-based/scenario-based.css
- Created methods/scenario-based/scenario-based.js
- Implements branching narrative with choice tracking
```

### Quick Commands:
| Action | Command |
|--------|---------|
| Save & push | `git add . && git commit -m "msg" && git push` |
| View history | `git log --oneline -10` |
| Revert file | `git checkout -- [file]` |
| Undo last commit | `git reset --soft HEAD~1` |

---

## COMPOSITION PATTERNS

### Sequential (Methods in Order)
```html
<section data-method="progressive-disclosure">...</section>
<section data-method="interactive-simulation">...</section>
```

### Nested (Method Inside Method)
```html
<section data-method="scenario-based">
    <div data-method="interactive-simulation">...</div>
</section>
```
Use `MethodLoader.initNested(parent, '[data-method]')` for nested methods.

### Wrapper (Reveal Wraps Content)
Progressive disclosure can reveal other method content inside.

---

## DARK THEME TOKENS (Reference)
```css
--color-bg: #0a0a0f
--color-surface: #12121a
--color-accent: #7b5cff
--color-text-primary: #e8e8f0
```
Use these tokens, don't hardcode colors.
