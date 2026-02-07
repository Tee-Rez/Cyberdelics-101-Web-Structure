# CYBERDELICS 101: COURSE CREATION WORKFLOW v2.0

## SYSTEM ARCHITECTURE OVERVIEW

```
LESSON STRUCTURE HIERARCHY
â”œâ”€â”€ Module (e.g., "Module 1: Defining Cyberdelics")
â”‚   â””â”€â”€ Lesson (e.g., "Lesson 1.1: What is a Cyberdelic?")
â”‚       â”œâ”€â”€ Intro Video (Framer-hosted, you explaining lesson)
â”‚       â”œâ”€â”€ Framer Description Text
â”‚       â”œâ”€â”€ Mini-Lesson #1 (Embedded Component)
â”‚       â”‚   â””â”€â”€ Method Chain A (PD â†’ Scenario â†’ Quiz)
â”‚       â”œâ”€â”€ Framer Description Text
â”‚       â”œâ”€â”€ Mini-Lesson #2 (Embedded Component)
â”‚       â”‚   â””â”€â”€ Method Chain B (Interactive Sim â†’ Quiz)
â”‚       â”œâ”€â”€ Framer Description Text
â”‚       â””â”€â”€ Mini-Lesson #3 (Embedded Component)
â”‚           â””â”€â”€ Method Chain C (PD â†’ Knowledge Construction)
â”‚       
â”‚       [All mini-lessons completed] â†’ "Lesson Complete" button unlocked
```

### Key Components

- **Module**: Major course section (e.g., Module 1: Defining Cyberdelics)
- **Lesson**: Topic within a module (10-15 minutes total duration)
- **Mini-Lesson**: Embedded component with chained teaching methods (3-5 minutes each)
- **Method Chain**: Sequence of 2-4 teaching methods that auto-advance
- **Teaching Methods**: Progressive Disclosure, Scenario-Based, Quiz, Interactive Simulation, Knowledge Construction

### Completion Logic

- **Mini-Lessons**: Can be completed in any order within a lesson
- **Method Chains**: Must be completed sequentially within each mini-lesson
- **Auto-Advancement**: 
  - Progressive Disclosure â†’ auto-advances when all panels revealed
  - Scenario â†’ auto-advances when outcome reached
  - Quiz â†’ auto-advances when all questions answered correctly
  - Interactive Simulation â†’ user controls when to advance (no completion requirement)
  - Knowledge Construction â†’ auto-advances when template fully and correctly constructed
- **Lesson Completion**: All mini-lessons must be completed before "Lesson Complete" button unlocks

---

## WORKFLOW PHASES

### **PHASE 1: CONTENT PLANNING & MAPPING**
*Before any technical building begins*

#### 1.1 Lesson Content Breakdown

**For each lesson:**
- Review lesson learning objectives from course documents
- Identify **2-4 major topics/concepts** that need to be taught (aim for 10-15 min total)
- Each topic becomes a **mini-lesson** (3-5 minutes each)
- Avoid redundancy: Don't repeat similar ideas across different lessons
- Condense where possible: Focus on key points only

**Example: Module 1, Lesson 1 - "What is a Cyberdelic?"**
- **Mini-Lesson 1**: Core definition + key components (4 min)
- **Mini-Lesson 2**: Distinctions from psychedelics (4 min)
- **Mini-Lesson 3**: "Without substances" advantages (4 min)
- **Total**: 12 minutes

#### 1.2 Method Selection for Each Mini-Lesson

**Using your "Method Selection Guide":**
- Determine which teaching methods best serve each topic
- Design the **method chain sequence** for optimal learning flow
- Consider cognitive load and engagement pacing
- **Plan AI image prompts** for Progressive Disclosure and Scenarios
- **For Interactive Simulations**: Design concept now, build placeholder, implement later

**Method Chain Design Principles:**
```
Strong Opening:
â”œâ”€â”€ Progressive Disclosure (builds understanding with visual support)
â””â”€â”€ OR Interactive Simulation (engages immediately)

Middle Development:
â”œâ”€â”€ Scenario (applies concepts with character-driven narrative)
â””â”€â”€ OR Interactive Simulation (explores relationships)

Validation:
â”œâ”€â”€ Quiz (scenario-based knowledge checks with educational branching)
â””â”€â”€ ALWAYS include after learning content

Mastery Moment:
â””â”€â”€ Knowledge Construction (drag-drop synthesis - use sparingly)
```

**Example Method Chain Decisions:**
```
Mini-Lesson 1: Core Definition
â”œâ”€â”€ Progressive Disclosure (chunked definition building with images)
â”œâ”€â”€ Scenario ("Meet Alex discovering cyberdelics" with character portrait)
â””â”€â”€ Quiz (2-3 scenario questions with wrong answer explanations)

Mini-Lesson 2: Distinctions
â”œâ”€â”€ [Interactive Simulation - Psychedelic â†” Cyberdelic Spectrum Explorer]
â”‚   â””â”€â”€ PLACEHOLDER: Design simulation concept, implement when tool ready
â””â”€â”€ Quiz (2-3 questions testing spectrum understanding)

Mini-Lesson 3: Without Substances
â”œâ”€â”€ Progressive Disclosure (legal/safety implications with visual aids)
â”œâ”€â”€ Scenario (Choosing cyberdelic vs psychedelic path with scene images)
â””â”€â”€ Knowledge Construction (Build the "advantages framework" by dragging benefits into template)
```

#### 1.3 Content Scripting

**For each mini-lesson, prepare:**

**Progressive Disclosure Content:**
- **Text content** for each panel (2-4 sentences max per panel, 5-7 panels total)
- **AI image prompts** for panels where visual support enhances understanding
- **Image placement** specification (left/right/full-width)

**Scenario Content:**
- **Character introduction** with background
- **AI image prompt** for character portrait
- **Context/situation** description
- **Decision point** with 2-4 choices
- **Outcome narratives** for each choice path
- **Optional AI image prompts** for critical decision moments or outcome scenes
- **Reflection prompts** extracting key principles

**Quiz Content:**
> **Note**: Quizzes are implemented using `type: "scenario-based"` in manifests. Each question and answer becomes a scene with choices that branch to feedback scenes or the next question.

- **2-3 scenario-based questions** per quiz
- **Question context** (situational framing)
- **4 answer choices** per question
- **Wrong answer explanations** (why it's incorrect + teaching point)
- **Correct answer confirmation** (brief reinforcement)
- **No images** (keeps focus on conceptual understanding)

**Knowledge Construction Content:**
- **Instruction text** (what to build)
- **Template structure** (slots with labels)
- **Correct items** (go in slots)
- **Distractor items** (plausible but incorrect)
- **Completion message** (reinforcement)
- **No images** (focus on structural understanding)

**Interactive Simulation Specifications:**
- **Purpose statement** (what it demonstrates)
- **Variables and controls** (what can be manipulated)
- **Visual feedback system** (how it responds)
- **Learning outcome** (what insight should be gained)

**Content Guidelines:**
- **Concise**: Each disclosure panel = 2-4 sentences maximum
- **Focused**: One concept per panel/section
- **Visual**: Identify where images enhance understanding vs. distract
- **Progressive**: Each piece builds on the previous
- **Actionable**: Quiz tests practical understanding, not memorization
- **Realistic**: Scenarios feel authentic, characters relatable

**Deliverable:** Complete content document for each mini-lesson with all AI image prompts specified

---

### **PHASE 2: MINI-LESSON CONSTRUCTION**
*Using your web-based Lesson Creation Tool*

#### 2.1 Open Lesson Builder Tool
- Access web-based builder
- Start new mini-lesson project

#### 2.2 Chain Teaching Methods

**Building the sequence:**

1. **Select first method** from template library (e.g., Progressive Disclosure)
   
2. **Populate Progressive Disclosure:**
   - Paste scripted text into disclosure panels
   - **Add AI image prompts** to panels where specified
   - Specify image placement (left/right/full-width)
   - Configure number of reveal sections
   - Preview image layouts
   
3. **Add Scenario method** (if in chain)
   
4. **Populate Scenario:**
   - Input character introduction + background
   - **Add AI image prompt** for character portrait
   - Input narrative context
   - Define choice branches
   - Add consequence outcomes
   - **Add AI image prompts** for critical moments (if specified)
   - Place reflection prompts
   - Specify image placement for each scene
   
5. **Add Quiz method** (almost always included)
   
6. **Configure Quiz:**
   - Input 2-3 scenario-based questions
   - Define 4 answer choices per question
   - Write wrong answer explanations (educational branching)
   - Write correct answer confirmations
   - Test branching logic (wrong â†’ explanation â†’ return to question)
   - Ensure questions build on content just learned

7. **Add Knowledge Construction method** (if included)

8. **Configure Knowledge Construction:**
   - Input instruction text
   - Define template structure with labeled slots
   - Add correct items (terms/concepts that go in slots)
   - Add distractor items (30-50% of total items)
   - Set validation rules (which item goes in which slot)
   - Write completion message
   - Test drag-drop interaction

**For Interactive Simulations (when tool is ready):**
- Define simulation parameters
- Set initial values and ranges
- Configure visual feedback
- Add exploration hints/guidance
- Test interactivity thoroughly

**For Interactive Simulations (placeholder approach):**
- Document simulation specifications in separate file
- Create "Coming Soon: Interactive Simulation" placeholder in method chain
- Build surrounding methods (PD before, Quiz after)
- Return to implement simulation when tool is ready

#### 2.3 Configure Method Transitions

- **Auto-advance settings**: 
  - Progressive Disclosure â†’ automatic transition when all panels revealed
  - Scenario â†’ automatic transition when outcome reached
  - Quiz â†’ automatic transition when all questions answered correctly
  - Knowledge Construction â†’ automatic transition when template fully built
  - Simulation â†’ user clicks "Continue" when ready (no forced completion)
- **Smooth transitions**: Ensure visual continuity between methods
- **Progress indication**: Show where learner is in method chain

#### 2.4 Test Mini-Lesson Flow

- **Preview mode** in builder
- Click through entire method chain
- **Verify:**
  - Content displays correctly
  - **AI image prompts render properly** (check all specified images)
  - Images load and position correctly (left/right/full-width placements)
  - Transitions feel natural (no jarring jumps)
  - Quiz branching logic works (wrong answers â†’ explanations â†’ return to question)
  - Knowledge Construction validation works (correct items snap, wrong items shake/return)
  - Completion triggers appropriately
  - Mobile responsiveness (if applicable)

#### 2.5 Export JSON

- **Export mini-lesson** as JSON file (pure JSON format, not JavaScript)
- **Name consistently**: `M[Module#]_L[Lesson#]_MiniLesson[#]_[ShortDescription].json`
  - Example: `M1_L1_MiniLesson1_CoreDefinition.json`
- **Save to organized folder structure**:
  ```
  /course-content
    /module-1
      /lesson-1
        M1_L1_MiniLesson1_CoreDefinition.json
        M1_L1_MiniLesson2_Distinctions.json
        M1_L1_MiniLesson3_WithoutSubstances.json
      /lesson-2
        ...
  ```

**Deliverable:** JSON file for each mini-lesson, ready to embed

---

### **PHASE 3: FRAMER LESSON ASSEMBLY**
*Assembling mini-lessons into complete lesson pages*

#### 3.1 Create Lesson Page in Framer
- **Set up lesson page** structure
- **Add lesson title/header**
- **Set up navigation** (back to module, forward to next lesson)

#### 3.2 Prepare for Intro Video (Record Later)
- **Add video placeholder** at top of lesson page
- **Note video script points** based on mini-lesson content
- **Mark for recording** once lesson is approved

#### 3.3 Embed Mini-Lessons in Sequence

**For each mini-lesson:**

1. **Add Framer description text**
   - Brief 1-2 sentence introduction
   - Sets context before embedded component
   - Example: "Let's start by building a precise definition of what cyberdelics actually are."

2. **Place Framer Component** (embedded GitHub project host)
   - Insert component into lesson page
   - **Paste JSON data** from builder into component configuration
   - Component renders the mini-lesson with method chains (including images)

3. **Verify rendering**
   - Preview in Framer
   - Ensure component displays correctly
   - **Check all images load properly** (portraits, scenes, visual aids)
   - Test basic functionality (if possible in preview mode)

4. **Repeat** for all mini-lessons in the lesson

**Example Lesson Structure in Framer:**
```
[Lesson Header: "Lesson 1.1 - What is a Cyberdelic?"]

[Intro Video Placeholder: Recording after approval]

[Description: "Let's start by building a precise definition..."]
[Mini-Lesson Component #1 - JSON: M1_L1_MiniLesson1_CoreDefinition.json]
  â†³ Contains: PD (with images) â†’ Scenario (with character portrait) â†’ Quiz

[Description: "Now let's explore how cyberdelics differ from psychedelics..."]
[Mini-Lesson Component #2 - JSON: M1_L1_MiniLesson2_Distinctions.json]
  â†³ Contains: Interactive Sim (placeholder) â†’ Quiz

[Description: "Understanding the 'without substances' distinction..."]
[Mini-Lesson Component #3 - JSON: M1_L1_MiniLesson3_WithoutSubstances.json]
  â†³ Contains: PD (with images) â†’ Scenario (with scene images) â†’ Knowledge Construction

[Lesson Complete Button - LOCKED until all mini-lessons send completion]
```

#### 3.4 Configure Lesson Completion Logic
- **Framer receives completion messages** from each mini-lesson component
- **Tracks which mini-lessons completed** (order-agnostic)
- **Unlocks "Lesson Complete" button** when all mini-lessons done
- **"Lesson Complete" button** sends completion data to Outsetta

#### 3.5 Test Full Lesson Flow
- **Play through entire lesson** as a learner would
- **Verify:**
  - Each mini-lesson loads and functions
  - **All images render correctly** throughout experience
  - Quiz branching works (wrong â†’ explanation â†’ retry)
  - Knowledge Construction drag-drop works
  - Completion tracking works (can complete in any order)
  - "Lesson Complete" button unlocks correctly
  - Navigation to next lesson works
  - Mobile/responsive behavior

**Deliverable:** Complete, functional lesson page in Framer (ready for intro video)

---

### **PHASE 4: IMAGE GENERATION & INTEGRATION**
*Creating AI-generated visuals for Progressive Disclosure and Scenarios*

#### 4.1 Compile All Image Prompts

**From Content Scripts:**
- Extract all AI image prompts from Progressive Disclosure panels
- Extract all AI image prompts from Scenarios (character portraits, scenes)
- Organize by mini-lesson and method

**Example Organization:**
```
M1_L1_MiniLesson1_CoreDefinition
  â”œâ”€â”€ PD_Panel_2: [VR headset and biofeedback sensors image prompt]
  â”œâ”€â”€ PD_Panel_4: [Conceptual diagram: consciousness exploration]
  â”œâ”€â”€ Scenario_Character: [Alex portrait prompt]
  â””â”€â”€ Scenario_Scene: [Alex trying VR meditation prompt]

M1_L1_MiniLesson2_Distinctions
  â””â”€â”€ [Interactive Sim - no images needed in placeholder]

M1_L1_MiniLesson3_WithoutSubstances
  â”œâ”€â”€ PD_Panel_2: [Legal worldwide symbol/graphic]
  â”œâ”€â”€ Scenario_Character: [Sophie portrait prompt]
  â””â”€â”€ Scenario_Decision: [Split-screen psychedelic retreat vs cyberdelic lab]
```

#### 4.2 Generate Images with AI

**For Each Image Prompt:**

1. **Use AI image generation tool** (Midjourney, DALL-E, Stable Diffusion, etc.)
2. **Input refined prompt** based on your specifications
3. **Generate multiple variations** (2-4 per prompt)
4. **Select best version** that matches:
   - Learning objective (does it clarify the concept?)
   - Brand aesthetic (STAR Arts sacred geometry + tech fusion)
   - Emotional tone (appropriate for content)
   - Technical quality (resolution, composition, clarity)

**Image Specifications:**
- **Resolution**: 1920x1080 minimum (landscape) or 1080x1920 (portrait)
- **Format**: PNG or JPG (PNG preferred for graphics, JPG for photos)
- **Aspect Ratio**: 
  - Character portraits: 1:1 (square) or 3:4 (portrait)
  - Scenes: 16:9 (landscape) or 4:3
  - Diagrams/infographics: Varies based on content
- **File Size**: Optimize for web (<500KB each)
- **Color Profile**: sRGB for web display

**Batch Processing Tips:**
- Generate all character portraits first (consistent style)
- Generate all technical diagrams next (consistent visual language)
- Generate all scene illustrations last (most creative freedom)
- Use same AI tool for consistency across entire lesson

#### 4.3 Organize and Name Images

**File Naming Convention:**
```
M[Module#]_L[Lesson#]_ML[MiniLesson#]_[Method]_[Description].png

Examples:
M1_L1_ML1_PD_VRHeadsetBiofeedback.png
M1_L1_ML1_Scenario_AlexPortrait.png
M1_L1_ML1_Scenario_AlexTryingVR.png
M1_L1_ML3_PD_LegalWorldwideGraphic.png
M1_L1_ML3_Scenario_SophiePortrait.png
M1_L1_ML3_Scenario_SplitScreenChoice.png
```

**Folder Structure:**
```
/course-content
  /module-1
    /lesson-1
      /images
        M1_L1_ML1_PD_VRHeadsetBiofeedback.png
        M1_L1_ML1_Scenario_AlexPortrait.png
        M1_L1_ML1_Scenario_AlexTryingVR.png
        M1_L1_ML3_PD_LegalWorldwideGraphic.png
        M1_L1_ML3_Scenario_SophiePortrait.png
        M1_L1_ML3_Scenario_SplitScreenChoice.png
      /json
        M1_L1_MiniLesson1_CoreDefinition.json
        M1_L1_MiniLesson2_Distinctions.json
        M1_L1_MiniLesson3_WithoutSubstances.json
```

#### 4.4 Integrate Images into Builder

**Return to Lesson Builder:**
1. Open each mini-lesson JSON in builder
2. Navigate to panels/scenes with image specifications
3. **Upload images** to corresponding sections
4. **Set image placement** (left/right/full-width as specified)
5. **Test image rendering** in preview mode
6. **Adjust sizing/positioning** if needed
7. **Re-export updated JSON** with image references

**Image Integration Checklist:**
- [ ] All Progressive Disclosure panel images uploaded
- [ ] All Scenario character portraits uploaded
- [ ] All Scenario scene images uploaded
- [ ] Images positioned correctly (left/right/full-width)
- [ ] Images load properly in preview
- [ ] Image file sizes optimized for web
- [ ] Alt text added for accessibility
- [ ] Updated JSON exported

#### 4.5 Update Framer Components

**For each mini-lesson:**
1. **Replace old JSON** with updated JSON (now includes image references)
2. **Verify images render** in Framer preview
3. **Test on multiple devices** (desktop, tablet, mobile)
4. **Optimize loading** (lazy load images if needed)
5. **Check accessibility** (alt text displays correctly)

**Deliverable:** All mini-lessons now include AI-generated images integrated seamlessly

---

### **PHASE 5: TEAM REVIEW & VIDEO PRODUCTION**
*Approval process and final video recording*

#### 5.1 Internal Team Review
- **Share lesson link** with Cyberdelic Nexus team
- **Team tests** full lesson experience
- **Gather feedback** on:
  - Content clarity and accuracy
  - Method chain flow and pacing
  - **Image quality and relevance** (do images enhance understanding?)
  - Quiz question difficulty and branching logic
  - Knowledge Construction challenge level
  - Technical functionality
  - Engagement level
  - Any missing or redundant information

#### 5.2 Iterate Based on Feedback
- **Revise content** in builder tool (if needed)
- **Replace images** if feedback suggests different visuals needed
- **Adjust quiz questions** if too easy/hard or confusing
- **Refine Knowledge Construction** templates if too complex/simple
- **Re-export JSON** with updates
- **Update Framer components** with new JSON
- **Re-test** full lesson flow

#### 5.3 Record Intro Video (Once Approved)

**Script talking points** based on mini-lesson content:
- What learners will discover in this lesson
- Why this lesson matters
- High-level overview of the 2-4 mini-lessons
- Estimated time (10-15 minutes)
  
**Recording setup:**
- Professional lighting and audio
- Consistent background/setting
- Warm, welcoming tone
- 1.5-3 minute duration
  
**Video specs:**
- 1080p resolution minimum
- MP4 format
- Compressed for web delivery

#### 5.4 Embed Video in Framer
- **Upload video** to hosting platform (Framer or external)
- **Replace placeholder** with actual video embed
- **Test video playback** in lesson page
- **Verify video doesn't block** lesson progression

**Deliverable:** Fully complete lesson with team-approved content, images, and intro video

---

### **PHASE 6: DATA INTEGRATION & LAUNCH**
*Connecting to Outsetta and going live*

#### 6.1 Configure Component â†’ Framer Communication
- **Each mini-lesson component** sends completion message when finished
- **Framer receives** and logs completion status
- **Framer tracks** which mini-lessons are done (visual indicators optional)

#### 6.2 Configure Framer â†’ Outsetta Communication
- **When "Lesson Complete" clicked**, Framer sends data to Outsetta:
  - User ID
  - Module ID + Lesson ID completed
  - Timestamp
  - (Future: artifact collection data, badge progress)

#### 6.3 Test Data Flow End-to-End
- **Create test user account** in Outsetta
- **Complete lesson** as test user
- **Test Quiz functionality:**
  - Try wrong answers â†’ verify explanations appear
  - Verify return to question after wrong answer
  - Verify advancement after correct answer
- **Test Knowledge Construction:**
  - Try wrong items in slots â†’ verify shake/return
  - Try correct items â†’ verify snap/lock
  - Verify completion when template fully built
- **Verify Outsetta receives** completion data correctly
- **Check user progress** updates properly
- **Test next lesson unlock** logic (if applicable)

#### 6.4 Future Feature Hooks (build foundation now, activate later)

**Prepare data structure for:**
- **Artifact progression tracking**: Component could send artifact collection events
- **Save/resume functionality**: Outsetta could store in-progress mini-lesson state
- **Badge system**: Completion data feeds into badge unlock logic
- **Analytics**: Time spent, method engagement, quiz attempt patterns, construction iterations

#### 6.5 Launch Lesson
- **Final QA check** with fresh eyes
- **Mark lesson as "Live"** in course platform
- **Update module navigation** to include new lesson
- **Monitor** for any technical issues in first 24-48 hours

**Deliverable:** Lesson live and accessible to learners, with data flowing to Outsetta

---

## PRACTICAL WORKFLOW EXAMPLE

### **MODULE 1, LESSON 1: "WHAT IS A CYBERDELIC?"**

#### Phase 1: Content Planning

**Lesson Goal**: Establish precise definition of cyberdelics with key distinctions  
**Duration Target**: 12 minutes  
**Mini-Lessons**: 3

**Mini-Lesson Breakdown:**

1. **Core Definition & Components** (4 min)
   - What cyberdelics are
   - Key technological components (VR/AR/Biofeedback)
   - Transformation + exploration focus
   
2. **Distinctions from Psychedelics** (4 min)
   - Spectrum visualization concept
   - Similarities in intention/outcomes
   - Critical "without substances" difference
   
3. **Practical Advantages** (4 min)
   - Legal accessibility
   - Safety profile
   - Controllability and repeatability
   - Research validation

**Method Selection:**

```
Mini-Lesson 1: Core Definition & Components
â”œâ”€â”€ Progressive Disclosure (build definition step-by-step with images)
â”œâ”€â”€ Scenario ("Meet Jamie: meditation teacher discovers cyberdelics" with portrait)
â””â”€â”€ Quiz (2-3 scenario questions with wrong answer explanations)

Mini-Lesson 2: Distinctions from Psychedelics
â”œâ”€â”€ [Interactive Simulation - Psychedelic â†” Cyberdelic Spectrum Explorer]
â”‚   â””â”€â”€ PLACEHOLDER: Slider showing similarities/differences across spectrum
â”‚   â””â”€â”€ Implementation: After simulation builder is ready
â””â”€â”€ Quiz (2-3 questions on key distinctions with branching logic)

Mini-Lesson 3: Practical Advantages
â”œâ”€â”€ Progressive Disclosure (legal, safety, control advantages with visuals)
â”œâ”€â”€ Scenario ("Choosing between psychedelic retreat vs cyberdelic program")
â””â”€â”€ Knowledge Construction (Drag benefits into "Advantages Framework" template)
```

#### Phase 2: Content Scripting

**Mini-Lesson 1 - Core Definition Script:**

**Progressive Disclosure Content:**

```
Panel 1: "Cyberdelics uses digital technologies to facilitate altered states, 
         personal transformation, and spiritual exploration."
         
[NO IMAGE - Simple definition, text sufficient]

Panel 2: "The technological toolkit includes VR headsets, AR experiences, 
         and biofeedback devices like EEG and HRV monitors."
         
AI Image Prompt: "Modern VR headset (Meta Quest style), EEG headband, and HRV 
chest strap sensor arranged artfully on a clean white surface, professional 
product photography, soft dramatic lighting, tech-forward aesthetic, subtle 
sacred geometry pattern (Flower of Life) faintly visible in background, 
16:9 aspect ratio"
         
Image Placement: RIGHT

Panel 3: "Like meditation or contemplative practices, cyberdelics focuses on 
         inner exploration and consciousness expansion."
         
AI Image Prompt: "Split-screen composition: left side shows person in traditional 
meditation pose (eyes closed, peaceful), right side shows same person wearing VR 
headset in similar meditative pose, both surrounded by soft glowing sacred geometry 
patterns, ethereal atmosphere, purple and teal color palette, spiritual tech fusion, 
16:9 aspect ratio"
         
Image Placement: LEFT

Panel 4: "The critical distinction: ALL of this happens without psychoactive 
         substances. No drugs involved."
         
AI Image Prompt: "Symbolic image showing VR headset and biofeedback device on one 
side, with a clear 'no substances' symbol (pill/mushroom with prohibition circle) 
on the other side, clean graphic design, educational infographic style, blue and 
white color scheme, 16:9 aspect ratio"
         
Image Placement: RIGHT

Panel 5: "This means cyberdelic experiences are legal, physically safer, 
         highly controllable, and widely accessible."
         
[NO IMAGE - Conclusion/summary text, previous images sufficient]
```

**Scenario Content:**

```
Setup: "Meet Jamie, a meditation teacher with 10 years of practice. She's 
        curious whether technology could complement her teaching."

AI Image Prompt (Character Portrait): "Portrait of Jamie, a warm and approachable 
meditation teacher in her mid-30s, shoulder-length brown hair, wearing comfortable 
casual clothing (soft sweater), peaceful and grounded expression, sitting in a 
meditation studio with plants and soft natural light filtering through windows, 
welcoming presence, photorealistic style, 1:1 aspect ratio"

Image Placement: FULL-WIDTH (header of scenario)

Context: "A friend recommends she try a cyberdelic VR meditation experience. 
          Jamie is skepticalâ€”can technology really facilitate deep inner work?"

[NO IMAGE - Context text, character portrait sufficient]

Choice A: "Try one cyberdelic session to see for herself"
  â†’ Outcome: Jamie experiences profound meditation state in VR, realizes 
             technology can be a tool, not a replacement. Decides to learn more.
  â†’ Reflection: "Technology serving consciousness, not replacing practice."
  
  AI Image Prompt (Outcome Scene): "Jamie wearing VR headset, sitting in meditation 
  pose, surrounded by glowing ethereal mandalas and sacred geometry in the VR space 
  visible around her, peaceful expression visible on face, soft purple and teal 
  lighting, spiritual technology fusion aesthetic, sense of deep presence, 
  16:9 aspect ratio"
  
  Image Placement: FULL-WIDTH

Choice B: "Stick with traditional practice only, avoid technology"
  â†’ Outcome: Jamie misses opportunity to discover new teaching tools. A year 
             later, her students ask about cyberdelic options and she has no 
             knowledge to guide them.
  â†’ Reflection: "Staying informed helps serve your community, even if you 
                 don't personally use every tool."
  
  [NO IMAGE - Negative outcome, better to not visualize]
```

**Quiz Content:**

```
Q1: "Sarah is designing a VR experience. Which feature would make it MOST cyberdelic?"

Context: "Sarah wants her VR app to facilitate consciousness exploration, not just 
entertainment."

A) High-speed action sequences and competitive scoring
   â†’ Wrong Answer: "This focuses on external stimulation and achievement, which is 
      more characteristic of entertainment VR than cyberdelic experiences. Cyberdelics 
      emphasize internal exploration and consciousness, not competitive performance. 
      Try again."
   â†’ Returns to Q1

B) Biofeedback integration that responds to Sarah's heart rate variability
   â†’ Correct Answer: "Exactly! Biofeedback integration creates a responsive 
      relationship between internal state and external experience, which is a core 
      cyberdelic principle. This facilitates consciousness exploration."
   â†’ Advances to Q2

C) Photorealistic graphics and immersive sound effects
   â†’ Wrong Answer: "While these enhance immersion, they don't necessarily create 
      a cyberdelic experience. High-quality graphics can serve entertainment OR 
      transformationâ€”what matters is the PURPOSE and design intent. Try again."
   â†’ Returns to Q1

D) Social multiplayer features for collaborative play
   â†’ Wrong Answer: "Social features can be valuable, but they don't define a 
      cyberdelic experience. The key is whether the experience facilitates 
      consciousness exploration and transformation, not whether it's multiplayer. 
      Try again."
   â†’ Returns to Q1

Q2: "Which aspect is SHARED between psychedelics and cyberdelics?"

Context: "Understanding what these two approaches have in common helps clarify 
what makes something 'cyberdelic.'"

A) The method used (chemical vs. technological)
   â†’ Wrong Answer: "Actually, this is where they DIFFER. Psychedelics use chemical 
      substances, while cyberdelics use technology. They share the INTENTION, not 
      the method. Try again."
   â†’ Returns to Q2

B) The intention to explore consciousness and facilitate transformation
   â†’ Correct Answer: "Yes! Both psychedelics and cyberdelics share the core 
      intention of consciousness exploration and personal transformation. The 
      method differs, but the purpose is aligned."
   â†’ Advances to Q3

C) Legal status and accessibility
   â†’ Wrong Answer: "This is actually a key DIFFERENCE. Psychedelics face legal 
      restrictions in most places, while cyberdelics are legal worldwide. They 
      differ in accessibility, not share it. Try again."
   â†’ Returns to Q2

D) The requirement for a facilitator or guide
   â†’ Wrong Answer: "While both CAN benefit from facilitation, this isn't what 
      defines their shared territory. The core commonality is their transformational 
      PURPOSE, not facilitation requirements. Try again."
   â†’ Returns to Q2

Q3: "What makes an experience 'cyberdelic' rather than just 'wellness tech'?"

Context: "A company releases a VR app with biofeedback for stress reduction. 
Is this cyberdelic?"

A) The quality of the graphics and user interface
   â†’ Wrong Answer: "Visual quality doesn't determine if something is cyberdelic. 
      Even simple graphics can facilitate profound consciousness exploration if 
      the INTENTION is transformational. Try again."
   â†’ Returns to Q3

B) The intention to explore consciousness and facilitate transformation
   â†’ Correct Answer: "Precisely! The key differentiator is PURPOSE. Wellness tech 
      optimizes function (like sleep or stress), while cyberdelics facilitate 
      consciousness exploration and personal transformation. Intention matters most."
   â†’ Quiz Complete!

C) The use of VR headsets instead of phone screens
   â†’ Wrong Answer: "The platform (VR vs. phone) doesn't define cyberdelics. You 
      could have cyberdelic experiences on a phone or entertainment experiences in 
      VR. It's about the PURPOSE, not the device. Try again."
   â†’ Returns to Q3

D) The price point and target audience
   â†’ Wrong Answer: "Cost and audience don't determine if something is cyberdelic. 
      The defining factor is whether the experience is designed for consciousness 
      exploration and transformation, not who can afford it. Try again."
   â†’ Returns to Q3
```

**Knowledge Construction Content:**

```
Instruction: "Build the 'Cyberdelic Advantages Framework' by dragging each benefit 
into the correct category."

Template Structure:
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  CYBERDELIC ADVANTAGES FRAMEWORK        â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚  LEGAL ACCESS:                          â”‚
â”‚  [SLOT 1]                               â”‚
â”‚  [SLOT 2]                               â”‚
â”‚                                         â”‚
â”‚  SAFETY PROFILE:                        â”‚
â”‚  [SLOT 3]                               â”‚
â”‚  [SLOT 4]                               â”‚
â”‚                                         â”‚
â”‚  CONTROLLABILITY:                       â”‚
â”‚  [SLOT 5]                               â”‚
â”‚  [SLOT 6]                               â”‚
â”‚                                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

Correct Items (go in slots):
- "No legal restrictions worldwide" [SLOT 1]
- "No prescription or medical supervision required" [SLOT 2]
- "No risk of physical dependency or addiction" [SLOT 3]
- "No adverse drug interactions" [SLOT 4]
- "Experience intensity can be adjusted in real-time" [SLOT 5]
- "Can stop or pause experience at any time" [SLOT 6]

Distractor Items (plausible but don't fit):
- "Guaranteed mystical experiences every session"
- "Cheaper than traditional psychedelic therapy"
- "No facilitator training required"
- "Works for everyone equally well"
- "Replaces all traditional spiritual practices"
- "No preparation or integration needed"

Validation Rules:
- SLOT 1 accepts: "No legal restrictions worldwide"
- SLOT 2 accepts: "No prescription or medical supervision required"
- SLOT 3 accepts: "No risk of physical dependency or addiction"
- SLOT 4 accepts: "No adverse drug interactions"
- SLOT 5 accepts: "Experience intensity can be adjusted in real-time"
- SLOT 6 accepts: "Can stop or pause experience at any time"
- All other items shake and return to source bank

Completion Message:
"Excellent! You've constructed the Cyberdelic Advantages Framework. These six 
advantagesâ€”legal access, safety profile, and controllabilityâ€”make cyberdelics 
a unique and accessible approach to consciousness exploration."
```

**Framer Description Text:**
"Let's start by building a precise definition of what cyberdelics actually are and how they work."

#### Phase 3: Builder Tool

1. **Open Lesson Builder**

2. **Add Progressive Disclosure Method**
   - Input 5 disclosure panels with content above
   - **Panel 2**: Upload image (VR headset/biofeedback) with AI prompt, place RIGHT
   - **Panel 3**: Upload image (meditation split-screen) with AI prompt, place LEFT
   - **Panel 4**: Upload image (no substances symbol) with AI prompt, place RIGHT
   - Configure smooth reveal transitions

3. **Chain Scenario Method**
   - Input Jamie's story context
   - **Add character portrait** with AI prompt, place FULL-WIDTH
   - Define Choice A and Choice B branches
   - **Choice A outcome**: Add VR meditation scene image, place FULL-WIDTH
   - Write both outcomes and reflections

4. **Chain Quiz Method**
   - Input Q1, Q2, Q3 with all answer options
   - Write wrong answer explanations for each
   - Write correct answer confirmations
   - Test branching logic (wrong â†’ explanation â†’ return)

5. **Preview and Test**
   - Click through entire chain
   - **Verify all images display correctly** with proper placement
   - Check auto-advancement between methods
   - **Test quiz branching** (try wrong answers, verify explanations, return to question)
   - Confirm completion triggers

6. **Export JSON**
   - Filename: `M1_L1_MiniLesson1_CoreDefinition.json`
   - Save to: `/course-content/module-1/lesson-1/`

#### Phase 4: Image Generation

1. **Compile Image Prompts:**
   - PD Panel 2: VR headset/biofeedback image
   - PD Panel 3: Meditation split-screen image
   - PD Panel 4: No substances symbol image
   - Scenario: Jamie portrait
   - Scenario Choice A: VR meditation scene

2. **Generate with AI tool:**
   - Use consistent style across all images
   - Generate 2-3 variations per prompt
   - Select best versions
   - Optimize for web (<500KB each)

3. **Organize files:**
   ```
   M1_L1_ML1_PD_VRHeadsetBiofeedback.png
   M1_L1_ML1_PD_MeditationSplitScreen.png
   M1_L1_ML1_PD_NoSubstancesSymbol.png
   M1_L1_ML1_Scenario_JamiePortrait.png
   M1_L1_ML1_Scenario_VRMeditationScene.png
   ```

4. **Upload to builder and re-export JSON**

#### Phase 5: Framer Assembly

1. **Create "Lesson 1.1" page** in Framer
2. **Add lesson header**: "Lesson 1.1: What is a Cyberdelic?"
3. **Add video placeholder** (will record after approval)
4. **Add description text**: "Let's start by building a precise definition..."
5. **Place Component #1**
   - Paste `M1_L1_MiniLesson1_CoreDefinition.json`
   - Verify rendering in preview (including all images)
   - **Test quiz functionality** (wrong answers â†’ explanations work)
6. **Build Mini-Lessons 2 & 3** (repeat process)
7. **Configure completion tracking**
8. **Test full lesson flow** including all images and quiz branching

#### Phase 6: Team Review & Launch

1. **Share lesson with team** for review
2. **Incorporate feedback** (content, images, quiz difficulty)
3. **Once approved, record intro video**:
   - Script: "Welcome to Lesson 1.1. In the next 12 minutes, you'll learn 
             exactly what cyberdelics are, how they differ from psychedelics, 
             and why this technology-based approach offers unique advantages. 
             Let's dive in."
4. **Upload and embed video** in Framer
5. **Final QA check** (test everything including quiz and images)
6. **Test with Outsetta** data flow
7. **Mark lesson as Live**
8. **Monitor first learners** for any issues
9. **Lesson 1.1 Complete** âœ…

---

## EFFICIENCY OPTIMIZATIONS

### Content Batching Strategy

**Don't build one mini-lesson at a time. Instead:**

1. **Write all content first** for 3-4 lessons at once
   - **Include all AI image prompt specifications** in content docs
   - Easier to spot redundancies across lessons
   - Maintain consistent voice and tone
   - More efficient use of "writing mode" time

2. **Generate all images in batches**:
   - All character portraits together (consistent style)
   - All technical diagrams together (consistent visual language)
   - All scene illustrations together (consistent aesthetic)
   - Use same AI tool/settings for consistency

3. **Build all similar methods together**: 
   - Build all Progressive Disclosures for those lessons
   - Build all Scenarios for those lessons
   - Build all Quizzes for those lessons
   - Build all Knowledge Constructions for those lessons

4. **Use templates effectively**: 
   - Create base templates once
   - Duplicate and modify with specific content
   - Maintain consistent structure across mini-lessons

### Reusable Elements Library

**Build once, reuse many times:**

**Character Library:**
- Jamie (meditation teacher) - **Portrait already generated**
- Alex (VR designer)
- Dr. Chen (neuroscience researcher)
- Marcus (therapist exploring new modalities)
- Sofia (tech enthusiast, consciousness curious)

**Generate all portraits at once with consistent style!**

**Scenario Templates:**
- "Professional Discovery" (expert encounters cyberdelics)
- "Decision Point" (choose between two approaches)
- "Real-World Application" (apply learning to situation)
- "Unexpected Experience" (handling surprises in session)

**Quiz Question Banks:**
- Organized by topic (definitions, history, science, applications)
- Tagged by difficulty (easy, medium, challenging)
- Reusable across multiple lessons where concepts overlap
- **All with branching explanations pre-written**

**Knowledge Construction Templates:**
- Definition Building (drag terms into definition template)
- Framework Building (drag items into quadrants/categories)
- Timeline Building (drag events into chronological order)
- System Building (drag components into process flow)

**Media Asset Organization:**
```
/assets
  /images
    /characters
      jamie-meditation-teacher.png [AI generated]
      alex-vr-designer.png [AI generated]
      dr-chen-researcher.png [AI generated]
    /infographics
      cyberdelic-definition.png [AI generated]
      technology-toolkit.png [AI generated]
      no-substances-symbol.png [AI generated]
    /diagrams
      brainwave-frequencies.svg
      spectrum-visual.png [AI generated]
    /scenes
      vr-meditation-environment.png [AI generated]
      lab-setting.png [AI generated]
  /videos
    /intro
      M1_L1_intro.mp4
      M1_L2_intro.mp4
```

---

## QUALITY CONTROL CHECKPOINTS

**Before moving to next phase:**

âœ… **Phase 1 â†’ Phase 2:**
- All content scripted and reviewed for clarity
- **All AI image prompts specified** for appropriate panels/scenes
- No redundant information across lessons in batch
- Method chains designed for optimal flow
- Quiz questions with complete branching explanations written

âœ… **Phase 2 â†’ Phase 3:**
- All mini-lessons built and tested in builder tool
- **All images uploaded and positioned correctly**
- Quiz branching logic tested (wrong â†’ explanation â†’ return works)
- Knowledge Construction drag-drop tested (correct snap, wrong shake)
- JSON files exported and properly named
- Preview mode shows content correctly
- All transitions work smoothly

âœ… **Phase 3 â†’ Phase 4:**
- All mini-lessons embedded in Framer
- **Components render properly including all images**
- Quiz functionality works in Framer preview
- Knowledge Construction works in Framer preview
- Completion tracking configured
- Full lesson playthrough successful

âœ… **Phase 4 â†’ Phase 5:**
- Team approval received
- All feedback incorporated (content, images, quiz difficulty)
- Intro video recorded and embedded
- Final QA passed (including quiz and construction testing)

âœ… **Phase 5 â†’ Launch:**
- Outsetta data flow verified
- Test user account completes successfully
- **Quiz branching works end-to-end**
- **Knowledge Construction validation works end-to-end**
- No critical bugs or issues
- Navigation works correctly

---

## SUCCESS METRICS & ITERATION

### Track During Development

**Build Efficiency:**
- Time to complete each phase per lesson
- Common bottlenecks or delays
- Method combinations that build fastest
- **Image generation time and quality**
- Content areas requiring most revision

**Technical Performance:**
- Builder tool errors or limitations
- JSON export/import issues
- **Image loading and rendering performance**
- Quiz branching reliability
- Knowledge Construction drag-drop responsiveness
- Framer rendering problems
- Data transmission failures

**Content Quality:**
- Team review feedback patterns
- Areas requiring most iteration
- **Image appropriateness and clarity feedback**
- Quiz difficulty and fairness
- Knowledge Construction challenge level
- Learner confusion points (from early launches)

### Refine Based On

**Learner Engagement Data:**
- Which method chains feel most natural
- Where learners engage most deeply
- **Which images get most attention/appreciation**
- Where drop-off occurs
- Average time spent per mini-lesson
- **Quiz attempt patterns** (how many tries per question average)
- **Knowledge Construction success rates** (how quickly completed)

**Team Feedback:**
- Content accuracy and clarity
- Method appropriateness for topics
- **Image quality and relevance**
- Quiz question clarity and fairness
- Knowledge Construction template design
- Pacing and flow
- Visual design consistency

**Technical Issues:**
- Browser compatibility problems
- Mobile responsiveness issues
- **Image loading delays**
- Quiz branching bugs
- Drag-drop functionality issues
- Load times and performance
- Data tracking gaps

---

## ADDITIONAL NOTES ON AI IMAGE GENERATION

### Best Practices

**Consistency Across Lessons:**
- Use same AI tool for entire module (or entire course)
- Establish style guide early (realistic vs. stylized, color palette, mood)
- Generate related images in same batch for consistency
- Save successful prompts for reuse/adaptation

**Character Consistency:**
- Generate all portraits of same character at once
- Use consistent description across all prompts
- Consider creating character style reference sheet
- Maintain same character appearance if they appear in multiple lessons

**Technical Quality:**
- Always generate at highest resolution available
- Create 2-3 variations, select best
- Check image quality on multiple devices
- Optimize file size without losing quality
- Test loading speed in builder

**Accessibility:**
- Include alt text descriptions for all images
- Ensure images enhance, not replace, text content
- Don't rely on images alone to convey critical information
- Use high contrast for readability

### When NOT to Generate Images

**Avoid image generation when:**
- Text alone communicates concept clearly
- Image would distract from learning
- Abstract concept doesn't benefit from visualization
- Budget/time constraints limit quality
- Multiple images in sequence would overwhelm
- Placeholder or simple icon works better

**Remember:** Images should always enhance understanding, never be decorative filler.