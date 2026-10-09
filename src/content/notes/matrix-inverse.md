---
title: "Matrix Inverse — Linear Algebra, Chapter 8"
description: "An inverse reverses a matrix transformation; a pseudoinverse handles more general cases."
subject: Linear Algebra
date: "2026-10-09T09:08:00Z"
draft: false
tags:
  - linear-algebra
  - mathematics
  - matrix-inverse
---


An inverse reverses a matrix transformation; a pseudoinverse handles more general cases.


## The main idea

$$
A^{-1}A=I
$$

![Inverse transformation shown as an actual mathematical graph.](/images/linear-algebra/course/matrix-inverse.svg)

<section class="course-interactive" data-course-demo="inverse" aria-label="Interactive matrix inverse diagram"></section>


## Lessons

### 95. Matrix inverse: Concept and applications

An inverse reverses a square transformation. Only full-rank square matrices have a two-sided inverse.

$$
A^{-1}A=AA^{-1}=I
$$



### 96. Computing the inverse in code

Numerical software computes inverses with stable factorizations rather than manually applying a large symbolic formula. Verify by multiplying back.

$$
AA^{-1}\approx I
$$



### 97. Inverse of a 2x2 matrix

The 2-by-2 inverse swaps diagonal entries, changes the off-diagonal signs, and divides by the determinant.

$$
\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1}=\frac1{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}
$$



### 98. The MCA algorithm to compute the inverse

The minors-cofactors-adjugate method builds an inverse from determinants of smaller matrices. It is best for understanding, not large numeric computation.

$$
A^{-1}=\frac{\operatorname{adj}(A)}{\det(A)}
$$



### 99. Code challenge: Implement the MCA algorithm!!

Implement cofactor signs and the adjugate carefully. Check both AA inverse and A inverse A against identity.

$$
C_{ij}=(-1)^{i+j}M_{ij}
$$



### 100. Computing the inverse via row reduction

Augment the matrix with identity, then row-reduce the left side to identity. The right side becomes the inverse.

$$
[A\mid I]\;\longrightarrow\;[I\mid A^{-1}]
$$



### 101. Code challenge: inverse of a diagonal matrix

A diagonal matrix is inverted entry by entry along its diagonal, provided every diagonal value is nonzero.

$$
\operatorname{diag}(d_i)^{-1}=\operatorname{diag}(1/d_i)
$$



### 102. Left inverse and right inverse

For a tall full-column-rank matrix, a left inverse can recover its input. A wide full-row-rank matrix can have a right inverse.

$$
(A^TA)^{-1}A^T A=I
$$



### 103. One-sided inverses in code

One-sided inverses are shape-dependent and are not generally equal. Test multiplication order and matrix dimensions.

$$
AA^{\mathrm{right}}=I\quad\text{or}\quad A^{\mathrm{left}}A=I
$$



### 104. Proof: the inverse is unique

If a square matrix has a two-sided inverse, that inverse is unique. Multiplying by either proposed inverse gives the same identity.

$$
B=A^{-1},\ C=A^{-1}\Rightarrow B=C
$$



### 105. Pseudo-inverse, part 1

The Moore-Penrose pseudoinverse extends inversion to rectangular or singular matrices using SVD.

$$
A^+=V\Sigma^+U^T
$$



### 106. Code challenge: pseudoinverse of invertible matrices

For an invertible square matrix, the pseudoinverse equals the ordinary inverse. Verify numerically.

$$
A^+=A^{-1}\quad\text{if }A\text{ is invertible}
$$




## Worked example — Reverse the mapping

$$
A=\begin{bmatrix}2&0\\0&4\end{bmatrix},\quad A^{-1}=\begin{bmatrix}1/2&0\\0&1/4\end{bmatrix}
$$

Scaling x by 2 and y by 4 is undone by scaling by 1/2 and 1/4.


## Try it in Python

Run this with NumPy:

```python
import numpy as np
A = np.array([[2.,0.],[0.,4.]])
A_inv = np.linalg.inv(A)
print("inverse:\n", A_inv)
print("check:\n", A @ A_inv)
```


## Quick review

1. In one sentence, what is the main idea of matrix inverse?

2. When does the displayed formula fail or require an extra assumption?

3. Change one number in the example. Predict the result before calculating.


## Key takeaway

An inverse reverses a matrix transformation; a pseudoinverse handles more general cases.
