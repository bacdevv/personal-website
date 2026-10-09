---
title: Centering data before PCA
description: A short worked example of subtracting the mean.
subject: Linear Algebra
date: "2026-10-01T00:00:00Z"
draft: false
tags: []
---

> Demonstration learning note.

## The shape of the data

Rows are samples. Columns are features. If there are 100 samples and 3 features, the data matrix has shape 100 × 3.

## Subtract the column means

```python
X_centered = X - X.mean(axis=0)
```

The average of each centered column is zero, up to floating-point error. Distances between samples are unchanged by this translation.

## A question to check understanding

Does centering make every individual value equal to zero? No. It makes each column's mean zero.

## The centered matrix

$$X_c = X - \mathbf{1}\mu^T$$

Here, $\mu$ is the vector of column means.
