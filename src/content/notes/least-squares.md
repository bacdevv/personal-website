---
title: "Least-Squares Model Fitting — Linear Algebra, Chapter 10"
description: "Fit a linear model by minimizing squared prediction errors and interpreting residuals."
subject: Linear Algebra
date: "2026-10-09T09:10:00Z"
draft: false
tags:
  - linear-algebra
  - mathematics
  - least-squares
---


Fit a linear model by minimizing squared prediction errors and interpreting residuals.


## The main idea

$$
\hat\beta=\arg\min_\beta\|X\beta-y\|_2^2
$$

![Data and fitted line shown as an actual mathematical graph.](/images/linear-algebra/course/least-squares.svg)

<section class="course-interactive" data-course-demo="least-squares" aria-label="Interactive least-squares model fitting diagram"></section>


## Lessons

### 120. Introduction to least-squares

Least squares chooses model parameters that minimize squared prediction errors. It is useful when there are more observations than unknowns.

$$
\hat\beta=\arg\min_\beta\lVert X\beta-y\rVert_2^2
$$



### 121. Least-squares via left inverse

For full-column-rank X, the normal equations produce a closed-form least-squares estimate. In practice use QR or an SVD-based solver.

$$
\hat\beta=(X^TX)^{-1}X^Ty
$$



### 122. Least-squares via orthogonal projection

The least-squares prediction is the orthogonal projection of y onto the columns of X.

$$
\hat y=X\hat\beta,\quad X^T(y-\hat y)=0
$$



### 123. Least-squares via row-reduction

Row reduction solves the normal equations in small examples; be aware that X transpose X may be poorly conditioned.

$$
X^TX\beta=X^Ty
$$



### 124. Model-predicted values and residuals

The fitted values and residuals together reconstruct the observations. Residuals show model errors.

$$
y=\hat y+e
$$



### 125. Least-squares application 1

Fit a straight line to observations and compare the fitted trend with the scattered data.

$$
\hat y_i=\beta_0+\beta_1 x_i
$$



### 126. Least-squares application 2

Add predictors when your model calls for them. Each fitted coefficient describes a conditional linear contribution.

$$
\hat y=\beta_0+\beta_1x_1+\beta_2x_2
$$



### 127. Code challenge: Least-squares via QR decomposition

QR solves least squares without explicitly forming X transpose X: first project y onto Q, then solve the triangular system.

$$
R\hat\beta=Q^Ty
$$




## Worked example — Fit three points

$$
(x,y)\in\{(0,1),(1,2),(2,2)\}
$$

A least-squares line balances the residuals rather than passing through every point.


## Try it in Python

Run this with NumPy:

```python
import numpy as np
x = np.array([0.,1.,2.])
y = np.array([1.,2.,2.])
X = np.column_stack([np.ones_like(x),x])
beta = np.linalg.lstsq(X,y,rcond=None)[0]
print("intercept and slope:", beta)
print("residuals:", y-X@beta)
```


## Quick review

1. In one sentence, what is the main idea of least-squares model fitting?

2. When does the displayed formula fail or require an extra assumption?

3. Change one number in the example. Predict the result before calculating.


## Key takeaway

Fit a linear model by minimizing squared prediction errors and interpreting residuals.
