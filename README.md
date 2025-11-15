# 🎨 The Scream – Audio-Reactive Pixel Animation

**Interactive Animation – p5.js + ml5.js (Audio-Driven Pixel Fragmentation Prototype)**

by **Haoze Qin**, SID: **550403751**  
Master of Interaction Design & Electronic Arts – The University of Sydney (USYD)

**9103 Individual Coding Task**

---

## 🧠 Project Description

### **Group Project Context**
Our group collaboratively produced a visual reinterpretation of *Edvard Munch’s* **The Scream**, using segmentation-based compositing, pixelation, and interaction. The concept behind the group project captures that inner scream you feel when you've forgotten to hand in your assignment, infused with a touch of humour.

The collective code blends:
- uNet person segmentation (ml5.js)
- Pixel-processing
- Dynamic overlays (e.g., “I forgot ddl”)
- Live camera input (optional)
- Real-time animation logic

My individual work extends this shared base through **audio-driven animation**, bringing an additional sensory to the group code and artwork.

---

## 🎧 Individual Animation Approach

### **1. Interaction Instructions**
To interact with my individual animation:

1. **Click the “▶️ Play” button to play the music**  
   – Music begins, and the animation becomes audio-reactive.

2. *(Optional)* **Click “🔴 Enable Camera”**  
   – This activates live uNet segmentation so you can choose your own body appears inside the artwork.And save your own screenshot

3. Observe the following behaviours:
   - The entire image **pulses, jitters, and warps** with sound amplitude  
   - Text **“I forgot ddl”** vibrates and reacts to music  
   - After a few seconds / when the drum come up in audio:  
     **both the portrait and the text crack open and shatter into pixel fragments**  
   - Finally the fragments **fall, rotate, fade**, simulating emotional collapse

No additional interaction is required—the artwork animates itself based on audio energy.

---

## 🔍 2. Individual Method: Audio-Driven Animation

### ✔ Why I chose **Audio**  
I selected **audio** as my individual driver because sound naturally conveys:
- directly emotional transmit
- tension buildup  
- psychological overload  
- rhythmic instability  
- also audio has the power to make the listener feel the theme i want express
These ideas strongly match the theme of *The Scream*.

### ✔ What I have animated using sound amplitude？
My audio-reactive system controls:

#### **(A) Global Effects**
- Pixel size (fine → coarse)  
- Full-canvas jitter  
- Wave-like distortion  
- Brightness emphasis

#### **(B) Portrait Animation**
- Breathing-style scaling  
- Vertical bounce  
- Lateral warping (sinusoidal)  
- Random jitter  
- *Cracking* stage → *Shattering* stage  

#### **(C) Text Animation**
- Pulsing (font size)  
- Jitter (emotional instability)  
- Colour sampling from the background  
- Delayed shattering based on musical peak

### ✔ Uniqueness from group members  
While the group code focused on:
- static segmentation  
- fixed pixelation  
- simple overlays  

My version adds:
- **time-based shatter physics**  
- **fragment rotation & gravity**  
- **ease-based cracking motion**  
- **audio-reactive wave effects**  
- **dual-stage destruction (crack → shatter)**  
- **camera optionality controlled by user**

This creates a more intense and expressive transformation distinct from the other group members.

---

## 🎞 References / Inspiration

### **Visual & Conceptual References**

- **https://www.reddit.com/r/PixelArt/**  
  A large collection of high-quality pixel art styles, character design, abstraction, and shading.

- **https://pixeljoint.com**  
  One of the most established pixel-art communities; helpful for pixel structure, shading, and animation inspiration.

### **Technical Inspiration**
- p5.js pixel manipulation examples  
- ml5.js uNet segmentation tutorials  
- Audio amplitude visualization methods  
- Game-engine particle systems (Unity, Godot)

### **Digital Fragmentation / Shatter Effects**

- **https://openprocessing.org**  
  Thousands of audio-reactive sketches and creative coding examples using p5.js.

- **https://inconvergent.net/generative/**  
  Advanced generative art exploring distortion, motion instability, and organic forms.

- **https://www.behance.net/search/projects?search=glitch%20art**  
  High-quality glitch art, particle destruction, and visual chaos from professional creators.

- **https://www.eyejackapp.com/artists**  
  AR artists using fragmentation, distortion and expressive breakdown in digital artworks.
These references helped shape the concept of translating **emotional breakdown → visual decomposition**.

---

## 🎛 What I Changed from the Group Code (Short)

- Added a **audio system** using p5.Amplitude() to control pixelation, shaking, scaling, and distortion.
- Implemented a **crack → shatter effect** for both the portrait and the text, triggered by audio peaks.
- Added **wave distortion** and **jitter** so the entire painting reacts emotionally to the music.
- Made the “I forgot ddl” text **audio-responsive** with colour sampling and vibration.
- Kept core group features (segmentation, pixelation, UI buttons) but expanded them with sound-driven behaviour to create a more expressive, dynamic version.

---
### 🛠 Technical Explanation 

## 1. Audio Processing

amp = new p5.Amplitude();
levelSmooth = lerp(levelSmooth, amp.getLevel() * 3, 0.15);
---
## 2. Details of My Individual Approach

### 🎧 *Audio → Animation Mapping*
This amplitude controls:

- scaling  
- jitter  
- warping  
- fragment triggering  
- pixelation size  

---

##3. 🔧 Additional Technical Tools (Not Covered in Class)

Below are the extra tools and techniques I used in my individual animation that were not fully taught in class, and the reasons for using them.

---

### 1） ml5.js uNet Person Segmentation
- Although computer vision was mentioned conceptually, deep-learning segmentation models were not taught.

**Why I used it**
- To isolate the human figure with high accuracy.
- Allowed me to treat the portrait as a separate pixel layer.
- Enabled pixelation, distortion, cracking, and shattering of the user’s body.

---

### 2）Easing Functions (easeOutCubic)
- Easing curves were not covered in class.

**Why I used it**
- Needed smoother motion when the portrait “cracks open.”
- Linear motion felt artificial; easing added realistic tension buildup.

---

### 3） Custom Fragment Physics System
- We did not learn particle systems, angular rotation, or per-piece physics.

**Why**
- Allowed text and portrait to break into many independent pieces.
- Enabled rotation, gravity, fading, and free-fall.

---

### 4）Audio Amplitude Smoothing (p5.Amplitude + lerp)
- Ensures the visual rhythm follows the music

**Why**
- Raw audio fluctuates too quickly.
- `lerp()` produced smooth transitions for breathing, jitter, and shatter triggers.

---

### 5）Dynamic Pixelation
- Dynamic pixels align more closely with our group programming theme.

**Why**
- Created a rhythmic, unstable visual identity.
- Pixel size reacts to sound → communicates emotional tension.

---

### 6）Color Sampling from Background (get())
- Dynamic color sampling was not taught.

**Why**
- Ensures “I forgot ddl” blends with the artwork’s palette.
- Makes typography visually cohesive with the background.

---

### 7）Wave Distortion Effects (sin/cos)
- Procedural wave motion was not formally covered.

**Why**
- Added wobbling instability to match the music.
- Strengthened emotional expression (anxiety, pressure, tension).

---

### 8）Camera On/Off
- Add the function to use camera

**Why**
- Gives users control over whether their face appears in the artwork.
- Prevents unnecessary processing when the camera is not used.

---

## 📄 Summary
----------
These methods and tools enable the audio to intertwine with this artistic creation, gradually shattering with the drumbeat or passage of time to convey the sense of urgency intended.

Building upon the team collaborative development of code for creating polka dot art styles, I personally employed tools to achieve an interactive effect between audio and artistic works by:

*   audio amplitude
*   expressive pixel movement
*   cracking and shattering
*   user-optional camera
*   The text shatters with the emergence of the drumbeat.
*   Pixelation rendering
