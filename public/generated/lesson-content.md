## Introduction to Rock Types  

Welcome to your first adventure into the world of **geology**! 🌍 In this short lesson you’ll learn what rocks are, why they matter, and the three main families they belong to. By the end you’ll be able to point to a rock in the park and name its type—no lab coat required.

---

### What is a rock?

- **Definition:** A rock is a solid aggregate of one or more minerals (or mineraloids) that forms the Earth’s crust.  
- **Why it matters:** Rocks record Earth’s history, provide building materials, and host the resources we use every day (oil, coal, metals, etc.).

> **Think about it:** When you pick up a stone on a hike, you’re actually holding a tiny time capsule that may be millions of years old!

---

### The Three Main Rock Families  

| Family | How it forms | Typical examples | Key clues you can see |
|--------|--------------|------------------|-----------------------|
| **Igneous** | Cools and solidifies from molten magma or lava | Granite, basalt, obsidian | - Interlocking crystals <br> - Often **hard** and **dense** |
| **Sedimentary** | Layers of sediments are compressed and cemented over time | Sandstone, limestone, shale | - Visible **layers** (strata) <br> - May contain **fossils** |
| **Metamorphic** | Existing rocks are altered by heat & pressure (without melting) | Marble, slate, gneiss | - **Foliated** (banded) or **non‑foliated** textures <br> - Recrystallized minerals |

#### Quick visual cheat‑sheet

```text
Igneous      →  🔥  (magma → solid)
Sedimentary →  🌊  (layers → rock)
Metamorphic →  🔄  (heat & pressure → new rock)
```

---

### How to Identify a Rock – A Simple Checklist  

1. **Look at the texture**  
   - Grain size (fine, medium, coarse)  
   - Are the grains interlocked or layered?  

2. **Check the color**  
   - Dark (mafic) vs. light (felsic) for igneous rocks.  

3. **Feel the hardness** (use a fingernail, a copper penny, or a steel nail)  

4. **Search for fossils or layers** – clues point to sedimentary rocks.  

5. **Notice any banding or foliation** – hallmark of metamorphic rocks.  

---

## Interactive Mini‑Quiz  

> **Your turn!** Below is a tiny Python script you can run (or just read through) that asks you a few questions and tells you the likely rock type.

```python
# Rock Type Identifier – beginner version
# Run this in any Python environment (e.g., IDLE, Jupyter, online repl)

def identify_rock():
    print("\n--- Rock Type Identifier ---")
    texture = input("Is the rock grainy (yes/no)? ").strip().lower()
    layers = input("Does it have visible layers or fossils (yes/no)? ").strip().lower()
    banding = input("Do you see banded/foliated patterns (yes/no)? ").strip().lower()
    hardness = input("Is it very hard (yes/no)? ").strip().lower()

    if layers == "yes":
        return "Sedimentary rock"
    elif banding == "yes":
        return "Metamorphic rock"
    elif texture == "yes" and hardness == "yes":
        return "Igneous rock"
    else:
        return "Rock type unclear – try examining more features!"

print("\nThink of a rock you have nearby and answer the questions.")
result = identify_rock()
print("\n>>> Your rock is likely:", result)
```

**Try it out!**  
- Grab a stone from your garden, a sidewalk slab, or a souvenir.  
- Answer the prompts honestly.  
- See what the script suggests and compare it with the checklist above.

---

### Recap – Key Takeaways  

- Rocks are solid collections of minerals that tell Earth’s story.  
- There are **three major families**: igneous, sedimentary, and metamorphic.  
- Simple observations (texture, layers, hardness, banding) let you guess a rock’s family.  
- Hands‑on practice (like the mini‑quiz) cements your new knowledge.

---

#### Ready for the next step?  

In the upcoming lesson we’ll dive deeper into **how each rock family forms** and explore cool real‑world examples—from the towering granite cliffs of Yosemite to the fossil‑rich chalk cliffs of Dover. Keep your rock collection handy, and let curiosity rock! 🎸🪨