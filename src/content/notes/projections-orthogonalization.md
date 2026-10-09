---
title: "Projections and Orthogonalization — Linear Algebra, Chapter 9"
description: "Find closest points and build orthogonal bases with projections, Gram-Schmidt and QR."
subject: Linear Algebra
date: "2026-10-09T09:09:00Z"
draft: false
tags:
  - linear-algebra
  - mathematics
  - projections-orthogonalization
---


Find closest points and build orthogonal bases with projections, Gram-Schmidt and QR.


## The main idea

$$
\operatorname{proj}_a(b)=a\frac{a^Tb}{a^Ta}
$$

![Orthogonal projection shown as an actual mathematical graph.](/images/linear-algebra/course/projections-orthogonalization.svg)

<section class="course-interactive" data-course-demo="projection" aria-label="Interactive projections and orthogonalization diagram"></section>


## Lessons

### 108. Projections in R^2

To project b onto a nonzero vector a, choose the point on a's line closest to b. The residual is perpendicular to a.

$$
\operatorname{proj}_a(b)=a\frac{a^Tb}{a^Ta}
$$



### 109. Projections in R^N

Projection onto a higher-dimensional column space finds the closest vector within that space. An orthonormal basis makes the formula simple.

$$
P=QQ^T\quad\text{when }Q^TQ=I
$$



### 110. Orthogonal and parallel vector components

Every vector splits into a component along a subspace and a residual orthogonal to it.

$$
b=Pb+(I-P)b
$$



### 111. Code challenge: decompose vector to orthogonal components

Check a projection by verifying the residual is perpendicular to the projection direction.

$$
a^T(b-\operatorname{proj}_a(b))=0
$$



### 112. Orthogonal matrices

A real orthogonal square matrix preserves dot products and Euclidean lengths. Its transpose is its inverse.

$$
Q^TQ=I\Rightarrow Q^{-1}=Q^T
$$



### 113. Gram-Schmidt procedure

Gram-Schmidt subtracts earlier projections to create orthogonal vectors, then normalizes the nonzero residuals.

$$
u_2=a_2-\operatorname{proj}_{u_1}(a_2)
$$



### 114. QR decomposition

QR factorization separates a matrix into orthonormal directions Q and an upper-triangular coefficient matrix R.

$$
A=QR,\quad Q^TQ=I
$$



### 115. Code challenge: Gram-Schmidt algorithm

Implement Gram-Schmidt step by step. If a residual is zero, the new vector was dependent on earlier vectors.

$$
q_k=\frac{v_k}{\lVert v_k\rVert},\quad v_k=a_k-\sum_{i<k}(q_i^Ta_k)q_i
$$



### 116. Matrix inverse via QR decomposition

For a full-rank square matrix with QR factorization, solve using triangular R; explicit inversion is usually unnecessary.

$$
A^{-1}=R^{-1}Q^T
$$



### 117. Code challenge: Inverse via QR

Check a QR-based inverse with AA inverse. Compare numeric tolerance, not exact decimal equality.

$$
\lVert AA^{-1}-I\rVert_F\approx 0
$$



### 118. Code challenge: Prove and demonstrate the Sherman-Morrison inverse

A rank-one update admits a cheap inverse update when the denominator is nonzero.

$$
(A+uv^T)^{-1}=A^{-1}-\frac{A^{-1}uv^TA^{-1}}{1+v^TA^{-1}u}
$$



### 119. Code challenge: A^TA = R^TR

The orthonormal Q cancels in A transpose A, leaving R transpose R. This connects QR and least squares.

$$
A^TA=R^TR
$$




## Worked example — Drop a perpendicular

$$
a=\begin{bmatrix}1\\0\end{bmatrix},\ b=\begin{bmatrix}2\\3\end{bmatrix}\Rightarrow\operatorname{proj}_a(b)=\begin{bmatrix}2\\0\end{bmatrix}
$$

The residual (0,3) is perpendicular to the horizontal axis.


## Try it in Python

Run this with NumPy:

```python
import numpy as np
a = np.array([1.,0.]); b = np.array([2.,3.])
projected = a * np.dot(a,b) / np.dot(a,a)
print("projection:", projected)
print("orthogonal residual:", b - projected)
```


## Quick review

1. In one sentence, what is the main idea of projections and orthogonalization?

2. When does the displayed formula fail or require an extra assumption?

3. Change one number in the example. Predict the result before calculating.


## Key takeaway

Find closest points and build orthogonal bases with projections, Gram-Schmidt and QR.
