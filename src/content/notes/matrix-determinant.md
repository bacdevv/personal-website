---
title: "Matrix Determinant — Linear Algebra, Chapter 7"
description: "The determinant measures area scaling and tells whether a square matrix is invertible."
subject: Linear Algebra
date: "2026-10-09T09:07:00Z"
draft: false
tags:
  - linear-algebra
  - mathematics
  - matrix-determinant
---


The determinant measures area scaling and tells whether a square matrix is invertible.


## The main idea

$$
\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc
$$

![Area and orientation shown as an actual mathematical graph.](/images/linear-algebra/course/matrix-determinant.svg)

<section class="course-interactive" data-course-demo="determinant" aria-label="Interactive matrix determinant diagram"></section>


## Lessons

### 87. Determinant: concept and applications

The determinant measures signed area or volume scaling for a square matrix. Zero means the transformation collapses a dimension.

$$
\det(A)=0\iff A\text{ is singular}
$$



### 88. Determinant of a 2x2 matrix

For a 2-by-2 matrix, multiply the main diagonal, then subtract the other diagonal's product.

$$
\det\!\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc
$$



### 89. Code challenge: determinant of small and large singular matrices

A singular matrix has dependent rows or columns, so its determinant is zero. Try duplicate a row to force that case.

$$
\det(A)=0\quad\text{if two rows coincide}
$$



### 90. Determinant of a 3x3 matrix

For 3-by-3 matrices, expand by cofactors. Every cofactor is the determinant of a smaller 2-by-2 matrix with a sign.

$$
\det(A)=a_{11}M_{11}-a_{12}M_{12}+a_{13}M_{13}
$$



### 91. Code challenge: large matrices with row exchanges

Swapping two rows reverses the determinant's sign, but not its magnitude. Track swaps during elimination.

$$
\det(PA)=-\det(A)\quad\text{for one row swap}
$$



### 92. Find matrix values for a given determinant

Treat a matrix entry as an unknown, expand the determinant, and solve the resulting equation for the desired value.

$$
\det\!\begin{bmatrix}x&1\\2&3\end{bmatrix}=3x-2
$$



### 93. Code challenge: determinant of shifted matrices

Adding a multiple of the identity changes eigenvalues; it does not add a constant to the determinant. Special shifts can make the matrix singular.

$$
\det(A+\lambda I)=\prod_i(\mu_i+\lambda)
$$



### 94. Code challenge: determinant of matrix product

The determinant of a product equals the product of the determinants. This holds for compatible square matrices.

$$
\det(AB)=\det(A)\det(B)
$$




## Worked example — A 2×2 transformation

$$
A=\begin{bmatrix}2&1\\0&3\end{bmatrix},\quad\det(A)=6
$$

A unit square becomes a parallelogram with area 6. A negative determinant would reverse orientation.


## Try it in Python

Run this with NumPy:

```python
import numpy as np
A = np.array([[2.,1.],[0.,3.]])
print("det(A):", np.linalg.det(A))
print("area scale:", abs(np.linalg.det(A)))
```


## Quick review

1. In one sentence, what is the main idea of matrix determinant?

2. When does the displayed formula fail or require an extra assumption?

3. Change one number in the example. Predict the result before calculating.


## Key takeaway

The determinant measures area scaling and tells whether a square matrix is invertible.
