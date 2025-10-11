## Introduction to Rock Types  
*Welcome to your first step into the fascinating world of geology!*  
In this lesson we’ll explore **what rocks are**, **why they matter**, and **the three basic families of rocks** you’ll encounter in the field (or in the backyard).

---

### 🌍 What Is a Rock?

A **rock** is a naturally occurring solid made of one or more minerals (or mineraloids) that are **bound together**.  
Think of a rock as a **“rock sandwich”**—the layers (minerals) are the fillings, and the crust (the whole mass) is what we see and touch.

> **Quick Check:**  
> *Can you name any mineral you’ve heard of?* (Hint: quartz, feldspar, mica…)

---

### 🤔 Why Study Rocks?

- **Tell the story of Earth:** Rocks record ancient environments, climate, and even life.  
- **Resources for daily life:** From building materials to metals and fuels, many of our necessities come from rocks.  
- **Safety & hazards:** Understanding rock stability helps engineers design tunnels, dams, and skyscrapers.

---

### 🪨 The Three Main Rock Types

Geologists group all rocks into three **parent families** based on how they formed.

| Rock Family | How It Forms | Typical Examples | Key Features |
|------------|--------------|------------------|--------------|
| **Igneous** | **Melted rock (magma or lava) cools & solidifies** | Granite, Basalt, Obsidian | Crystalline texture; may have visible crystals (intrusive) or glassy surface (extrusive). |
| **Sedimentary** | **Particles settle, compact, and cement together** (or precipitate from water) | Sandstone, Limestone, Shale | Layered (stratified); often contain fossils. |
| **Metamorphic** | **Existing rock is transformed by heat, pressure, or chemically active fluids** | Marble, Slate, Gneiss | Recrystallized minerals; foliation (layered) or non‑foliated textures. |

#### Quick Visual Cheat‑Sheet

```text
Igneous      →  🔥 Melt → Cool → Solid
Sedimentary →  🌊 Deposit → Compact → Cement
Metamorphic →  ♨️ Heat/Pressure → Recrystallize
```

---

### 🎯 Key Concepts to Remember

- **Origin matters:** The *process* that creates a rock determines its family.  
- **Texture tells a story:** Grain size, layering, and crystal shape reveal formation conditions.  
- **Names are clues:**  
  - *-ite* (e.g., **granite**) often signals an **igneous** rock.  
  - *-stone* (e.g., **sandstone**) usually points to a **sedimentary** rock.  
  - *-marble* or *-slate* are **metamorphic**.

---

### 🧪 Interactive Mini‑Lab: “Guess the Rock”

Below is a tiny Python script you can run (or copy into an online interpreter) to test your knowledge. It randomly selects a rock description; you type the rock type you think matches.

```python
import random

rocks = {
    "Granite":    ("Igneous", "Coarse‑grained, visible crystals, formed deep underground."),
    "Basalt":    ("Igneous", "Fine‑grained, dark, erupted as lava."),
    "Sandstone": ("Sedimentary", "Layered, made of sand‑sized grains, often contains fossils."),
    "Shale":     ("Sedimentary", "Very fine‑grained, splits into thin sheets."),
    "Marble":    ("Metamorphic", "Recrystallized limestone, reacts with acid."),
    "Slate":     ("Metamorphic", "Fine‑grained, splits into flat sheets."),
}

name, (family, clue) = random.choice(list(rocks.items()))
print(f"🔎 Description: {clue}")
guess = input("What rock family does this belong to? (Igneous/Sedimentary/Metamorphic): ").strip().title()

if guess == family:
    print("✅ Correct! Well done.")
else:
    print(f"❌ Oops. The correct answer is **{family}**.")
```

*Try it a few times and see how quickly you can identify each rock family!*

---

### 📚 What’s Next?

- **Dive deeper** into each rock family (mineral composition, formation environments).  
- **Hands‑on activity:** Collect a small rock from your yard, note its texture, and try to classify it using the cheat‑sheet.  
- **Quiz time:** A short multiple‑choice quiz will follow the next section to reinforce today’s concepts.

> **Remember:** Rocks are the Earth’s autobiography—by learning their language, you become a storyteller of deep time! 🌋📖