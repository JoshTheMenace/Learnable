## Introduction to Rock Types  

Welcome to the first step in learning about **rocks** – the solid building blocks of the Earth’s crust. In this beginner‑level lesson we’ll explore **what rocks are**, why they’re important, and the three major families they belong to.

---

### What is a rock?  

- A **rock** is a naturally occurring solid made of one or more minerals (or mineraloids).  
- Rocks can be **hard or soft**, **light‑colored or dark**, and they tell geologists stories about how the Earth has changed over millions of years.  

> **Example:** The granite you might see in a kitchen countertop is an igneous rock made primarily of quartz, feldspar, and mica.

---

### The Three Main Rock Types  

| Rock Type | How it Forms | Typical Examples | Key Features |
|-----------|--------------|------------------|--------------|
| **Igneous** | **Solidifies from molten magma or lava**. | Granite, Basalt | Crystalline texture; often contains interlocking mineral grains. |
| **Sedimentary** | **Compacts and cements particles** (sediments) that were transported by water, wind, or ice. | Sandstone, Limestone, Shale | Often layered (strata); may contain fossils. |
| **Metamorphic** | **Transforms under heat & pressure** without melting. | Marble, Slate, Gneiss | Recrystallized minerals; foliated (layered) or non‑foliated textures. |

#### Quick Look at Each Type  

- **Igneous** – *“Born from fire.”*  
  - **Intrusive** (e.g., granite) cools **slowly** beneath the surface → large crystals.  
  - **Extrusive** (e.g., basalt) cools **quickly** at the surface → fine‑grained or glassy.

- **Sedimentary** – *“Built from bits.”*  
  - **Clastic** (e.g., sandstone) = cemented rock fragments.  
  - **Chemical** (e.g., limestone) = minerals precipitated from solution.  
  - **Organic** (e.g., coal) = accumulated plant/animal debris.

- **Metamorphic** – *“Re‑shaped under pressure.”*  
  - **Foliated** (e.g., slate) = minerals aligned in layers.  
  - **Non‑foliated** (e.g., marble) = minerals interlocked without a layered pattern.

---

### Simple Python Demo – Classify a Rock  

Below is a tiny Python snippet that shows how you might **programmatically categorize** a rock based on a few key properties.

```python
def classify_rock(origin, texture):
    """
    origin: 'igneous', 'sedimentary', or 'metamorphic'
    texture: 'coarse', 'fine', 'layered', 'foliated', 'non‑foliated'
    """
    if origin == "igneous":
        return "Igneous Rock"
    elif origin == "sedimentary":
        return "Sedimentary Rock"
    elif origin == "metamorphic":
        if texture in ("foliated", "layered"):
            return "Foliated Metamorphic Rock"
        else:
            return "Non‑foliated Metamorphic Rock"
    else:
        return "Unknown rock type"

# Example usage
print(classify_rock("igneous", "coarse"))   # → Igneous Rock
print(classify_rock("metamorphic", "foliated"))  # → Foliated Metamorphic Rock
```

*Try modifying the `origin` and `texture` values to see how the classification changes!*

---

### Interactive Exploration  

- **Visualize how rocks form over time**  
  [Explore Rock Formation](button:visualization:Show how different rock types form over time)

- **Test your new knowledge**  
  [Take Quiz](button:quiz:Test your knowledge about rock classification)

- **Practice identifying rock samples**  
  [Try Exercise](button:exercise:Practice identifying rock samples)

---

#### Recap – Key Takeaways  

- Rocks are natural aggregates of minerals.  
- The three main families—**igneous, sedimentary, metamorphic**—are distinguished by **how they form**.  
- Recognizing texture, composition, and formation environment helps you identify any rock you encounter.

Ready to dive deeper? Click the buttons above to see rocks in action, challenge yourself, and start classifying real‑world samples!