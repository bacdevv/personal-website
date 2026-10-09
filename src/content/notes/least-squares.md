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

I will fit a straight line to a few data points, then explain **why least squares minimizes squared errors**. Projection geometry connects the fitted values to the matrix formulas.

## Learning goals

- Build a design matrix with an intercept and predictors.
- Compute fitted values, residuals, and the sum of squared errors.
- Solve by QR or SVD without explicitly inverting normal equations.

## Visual intuition

![A mathematical visualization for least squares for model fitting.](/images/linear-algebra/course/least-squares.svg)

<section class="course-interactive" data-course-demo="least-squares" aria-label="Interactive mathematical illustration"></section>

The diagram updates independently of the Python runner. It shows one small example; the lessons below explain the general rule.

## Part A — Fit the model and see the geometry

### 120. Introduction to least-squares

**Main idea.** Least squares chooses model parameters that minimize squared prediction errors. It is useful when there are more observations than unknowns.

$$
\hat\beta=\arg\min_\beta\lVert X\beta-y\rVert_2^2
$$

**Worked example.** Three noisy points near $y=1+2x$ rarely lie on a single perfect line. Least squares finds the line whose squared vertical errors have the smallest possible total.

**Check yourself:** What do we minimize in ordinary least squares?

<details><summary>Answer</summary>

The sum of squared residuals.

</details>

### 121. Least-squares via left inverse

**Main idea.** For full-column-rank X, the normal equations produce a closed-form least-squares estimate. In practice use QR or an SVD-based solver.

$$
\hat\beta=(X^TX)^{-1}X^Ty
$$

**Worked example.** For observations $(0,1),(1,3),(2,5)$, choose $X=\begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix}$ and $y=(1,3,5)^T$. The fitted intercept and slope are $(1,2)$.

**Check yourself:** When is (XᵀX) invertible?

<details><summary>Answer</summary>

When X has full column rank.

</details>

### 122. Least-squares via orthogonal projection

**Main idea.** The least-squares prediction is the orthogonal projection of y onto the columns of X.

$$
\hat y=X\hat\beta,\quad X^T(y-\hat y)=0
$$

**Worked example.** The fitted vector $\hat y=X\hat\beta$ lies in $\operatorname{Col}(X)$. The residual $y-\hat y$ is orthogonal to every column of $X$: $X^T(y-\hat y)=0$.

**Check yourself:** What does least squares project?

<details><summary>Answer</summary>

The observed response vector onto the model column space.

</details>

## Part B — Solve and interpret residuals

### 123. Least-squares via row-reduction

**Main idea.** Row reduction solves the normal equations in small examples; be aware that X transpose X may be poorly conditioned.

$$
X^TX\beta=X^Ty
$$

**Worked example.** For a small full-rank $X$, row-reduce the augmented normal equations $[X^TX\mid X^Ty]$ to solve for $\beta$. The row reduction gives the same coefficients as QR in exact arithmetic.

**Check yourself:** What is the numerical drawback of the normal equations?

<details><summary>Answer</summary>

They square the condition number of X.

</details>

### 124. Model-predicted values and residuals

**Main idea.** The fitted values and residuals together reconstruct the observations. Residuals show model errors.

$$
y=\hat y+e
$$

**Worked example.** If $y=(1,2,5)$ and $\hat y=(1,3,4)$, residuals are $(0,-1,1)$, SSE is $2$, and residuals add to zero in this example.

**Check yourself:** Does every least-squares model have mean-zero residuals?

<details><summary>Answer</summary>

Not necessarily; that holds when the design contains an intercept under ordinary least squares.

</details>

### 125. Least-squares application 1

**Main idea.** Fit a straight line to observations and compare the fitted trend with the scattered data.

$$
\hat y_i=\beta_0+\beta_1 x_i
$$

**Worked example.** For a simple line fit, graph points and $\hat y_i=\hat\beta_0+\hat\beta_1x_i$. The slope describes the change in fitted response per unit of $x$.

**Check yourself:** What changes if we move one observed point far upward?

<details><summary>Answer</summary>

The fitted line can move; squared loss is sensitive to outliers.

</details>

## Part C — Multiple predictors and QR

### 126. Least-squares application 2

**Main idea.** Add predictors when your model calls for them. Each fitted coefficient describes a conditional linear contribution.

$$
\hat y=\beta_0+\beta_1x_1+\beta_2x_2
$$

**Worked example.** With predictors $x_1$ and $x_2$, compare $y=\beta_0+\beta_1x_1+\beta_2x_2+e$ against a single-predictor model. Coefficients depend on the variables included.

**Check yourself:** Does a fitted coefficient automatically imply causation?

<details><summary>Answer</summary>

No. Least squares estimates associations given the model assumptions.

</details>

### 127. Code challenge: Least-squares via QR decomposition

**Main idea.** QR solves least squares without explicitly forming X transpose X: first project y onto Q, then solve the triangular system.

$$
R\hat\beta=Q^Ty
$$

**Worked example.** Let the reduced QR factorization be $X=QR$. Instead of computing $(X^TX)^{-1}$, first get $z=Q^Ty$, then solve the triangular system $R\hat\beta=z$.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
x = np.arange(5., dtype=float)
y = np.array([1., 3., 4., 7., 9.])
X = np.column_stack([np.ones_like(x), x])
Q, R = np.linalg.qr(X, mode='reduced')
beta = np.linalg.solve(R, Q.T @ y)
print('QR coefficients:', beta)
assert np.allclose(beta, np.linalg.lstsq(X, y, rcond=None)[0])
```

**Check yourself:** Why is QR usually preferred over normal-equation inversion?

<details><summary>Answer</summary>

It avoids explicitly squaring the condition number and is numerically more stable.

</details>

## Detailed worked example

## Fit a line from three observations

Suppose $(x,y)$ pairs are $(0,1)$, $(1,3)$ and $(2,5)$. Write the design matrix

$$
X=\begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix},\qquad
\beta=\begin{bmatrix}\beta_0\\\beta_1\end{bmatrix},\qquad
X\beta\approx y.
$$

Here $\beta_0$ is the intercept and $\beta_1$ the slope. The exact fit is $\beta=(1,2)^T$. If an observed $y$ moves away from the line, least squares balances the residuals rather than forcing a perfect fit.

## Geometric view

The vector of fitted values $\hat y=X\hat\beta$ lies in the column space of $X$; the residual $e=y-\hat y$ is perpendicular to every column. Hence $X^Te=0$. This is the origin of the normal equations, but not a reason to compute an inverse explicitly.

A fitted line explains association in the sample, not necessarily causation. Always inspect residuals and consider model assumptions before interpreting coefficients.


## Verify the calculations with Python

The numerical examples use NumPy. Each block is self-contained so you can run it independently. If a library is still loading in the website runner, try the same code in Jupyter or Colab.

```python
import numpy as np
x = np.array([0., 1., 2., 3.])
y = np.array([1., 3., 5., 8.])
X = np.column_stack([np.ones_like(x), x])
beta, residual_sum, rank, s = np.linalg.lstsq(X, y, rcond=None)
yhat = X @ beta
residual = y - yhat
print("intercept and slope", beta)
print("SSE", float(residual @ residual))
print("orthogonality", X.T @ residual)
```

## Practice questions

I recommend answering these questions before opening the solutions. A small calculation is more useful than memorizing a long definition.

1. Why is the method called least squares?
2. What does Xᵀe=0 say geometrically?
3. Is a small training SSE proof of causal relationships?
4. Which method avoids explicit normal-equation inversion?

### Answers

1. It minimizes the sum of squared residuals.
2. The residual is perpendicular to the model column space.
3. No.
4. QR or SVD-based least-squares solver.

## Common mistakes

- Do not treat an intercept as automatically included: it needs a column of ones.
- Avoid interpreting a large coefficient without considering variable scales.
- Ordinary squared loss can be sensitive to large outliers.

## What I want you to remember

Least squares chooses the parameter vector minimizing $\lVert X\beta-y\rVert_2^2$. The best-fit residual is orthogonal to the model column space.
