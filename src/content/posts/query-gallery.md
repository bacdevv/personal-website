---
title: "Query, gallery, and the idea behind Re-ID"
description: "A demonstration learning article introducing person re-identification and retrieval."
pubDatetime: "2026-10-07T00:00:00Z"
featured: true
draft: false
tags: ["Machine Learning", "Person Re-ID"]
---

> Demonstration article · Replace or adapt this content before your personal launch.

## What are we looking for?

In person re-identification, a query image shows the person we want to find. The gallery is the collection of candidate images. A model represents each image with a feature vector and ranks gallery images by distance to the query.

## Query and gallery are different roles

One query may be compared with hundreds of gallery images. Each gallery image is a candidate, not a separate gallery dataset.

```python
import numpy as np

query = np.array([1.0, 0.0])
gallery = np.array([[0.9, 0.1], [0.0, 1.0]])
distances = np.linalg.norm(gallery - query, axis=1)
ranking = np.argsort(distances)
print(ranking)
```

This toy calculation illustrates ranking. It is not an experiment or a benchmark result.

## What changes under occlusion?

When parts of a person are hidden, a feature may contain information about an obstacle or another person. A useful research question is how to judge the reliability of visible evidence for a particular pair of images.

See the [research journal](/research) for clearly labeled hypotheses.
