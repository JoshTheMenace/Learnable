## Introduction to Rock Types  

Welcome to the first step in your geology adventure! In this lesson you’ll discover **what rocks are**, why they’re important, and the three main families they belong to. By the end of the introduction you’ll be able to:

- Identify the three basic rock categories.  
- Recognise a few everyday examples.  
- Start thinking like a geologist—asking the right questions about the rocks around you.

---

### Why Study Rocks?

Rocks are the **building blocks of Earth’s crust**. They tell the story of our planet’s past, help us find natural resources, and even shape the landscapes we love to explore.

> **Quick Thought:**  
> Look around your room. Which objects might be made of rock (e.g., a marble countertop, a ceramic mug, a stone paperweight)?  

---

## The Three Main Rock Families  

| Rock Family | How It Forms | Typical Examples | Key Features |
|------------|--------------|------------------|--------------|
| **Igneous** | Cools and solidifies from molten magma or lava. | Granite, Basalt, Obsidian | Often have interlocking crystals; can be “intrusive” (inside Earth) or “extrusive” (on the surface). |
| **Sedimentary** | Builds up from layers of sediments (bits of rock, mineral, organic material) that are compacted and cemented. | Sandstone, Limestone, Shale | Usually layered, may contain fossils, often softer than igneous rocks. |
| **Metamorphic** | Transforms from existing rock under heat & pressure without melting. | Marble (from limestone), Slate (from shale), Gneiss (from granite) | Foliated (layered) or non‑foliated textures; crystals often larger than in the original rock. |

---

### Quick Quiz: Spot the Rock!

Below are short descriptions—pick the correct rock family by checking the box.

- [ ] **A dark, fine‑grained rock that forms from rapidly cooling lava on the ocean floor.**  
- [ ] **A layered rock that often contains fossils and was formed from ancient river sediments.**  
- [ ] **A rock that started as limestone but turned shiny and crystalline after being buried deep in the mountains.**  

*(Answers: Igneous, Sedimentary, Metamorphic – scroll down for the solution.)*  

<details><summary>Show Answers</summary>
- **Igneous** – basalt  
- **Sedimentary** – sandstone or shale (both can contain fossils)  
- **Metamorphic** – marble  
</details>

---

## Mini‑Exercise: “Rock ID” with Python  

If you enjoy a little coding, try this simple script that asks for a few clues and suggests a rock family.

```python
# Rock Family Identifier
# Answer the questions with yes/no (y/n)

def ask(question):
    return input(question + " (y/n): ").strip().lower() == 'y'

print("\n--- Rock Family Identifier ---")
if ask("Does the rock have visible crystals that interlock?"):
    print("Likely an IGNEOUS rock.")
elif ask("Is the rock layered and possibly contains fossils?"):
    print("Likely a SEDIMENTARY rock.")
elif ask("Does the rock show foliation (thin layers) or a shiny, recrystallized texture?"):
    print("Likely a METAMORPHIC rock.")
else:
    print("More information needed – try examining texture, color, and location!")
```

*Tip:* Run the code in any Python environment (e.g., VS Code, Jupyter Notebook, or an online REPL) and experiment with different answers.

---

### What’s Next?

Now that you know the three rock families, the upcoming sections will dive deeper:

1. **Igneous Rocks:** From magma to mountains.  
2. **Sedimentary Rocks:** Layers, fossils, and the story of Earth’s surface.  
3. **Metamorphic Rocks:** Heat, pressure, and transformation.

Stay curious, keep a rock‑handbook handy, and let’s explore the fascinating world beneath our feet! 🌍🪨