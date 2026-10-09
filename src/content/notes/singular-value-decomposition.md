---
title: "Singular Value Decomposition — Linear Algebra, Chapter 12"
description: "SVD separates any real matrix into orthogonal changes of basis and nonnegative stretches."
subject: Linear Algebra
date: "2026-10-09T09:12:00Z"
draft: false
tags:
  - linear-algebra
  - mathematics
  - singular-value-decomposition
---


SVD separates any real matrix into orthogonal changes of basis and nonnegative stretches.


## The main idea

$$
A=U\Sigma V^T
$$

![Singular value spectrum shown as an actual mathematical graph.](/images/linear-algebra/course/singular-value-decomposition.svg)

<section class="course-interactive" data-course-demo="svd" aria-label="Interactive singular value decomposition diagram"></section>


## Lessons

### 147. Singular value decomposition (SVD)

SVD works for any real rectangular or square matrix and separates input directions, scale, and output directions.

$$
A=U\Sigma V^T
$$



### 148. Code challenge: SVD vs. eigendecomposition for square symmetric matrices

For symmetric positive semidefinite matrices, singular values coincide with nonnegative eigenvalues; this is not true for all symmetric matrices.

$$
\sigma_i(A)=|\lambda_i(A)|\quad\text{when }A=A^T
$$



### 149. Relation between singular values and eigenvalues

Singular values are the square roots of eigenvalues of A transpose A. They are nonnegative.

$$
\sigma_i^2=\lambda_i(A^TA)
$$



### 150. Code challenge: U from eigendecomposition of A^TA

Compute right singular vectors from A transpose A, then derive left singular vectors for nonzero singular values.

$$
u_i=\frac{Av_i}{\sigma_i}\quad(\sigma_i>0)
$$



### 151. SVD and the four subspaces

SVD organizes bases for the row space, column space, and their orthogonal null-space complements.

$$
\operatorname{rank}(A)=\#\{\sigma_i>0\}
$$



### 152. Spectral theory of matrices

The spectrum of singular values tells how strongly the matrix stretches each orthogonal input direction.

$$
\lVert Av_i\rVert_2=\sigma_i
$$



### 153. SVD for low-rank approximations

Keep only the largest singular values for a lower-rank approximation, trading accuracy for storage or noise reduction.

$$
A_k=\sum_{i=1}^{k}\sigma_i u_iv_i^T
$$



### 154. Convert singular values to percent variance

Squared singular values measure the matrix's Frobenius energy. Normalize their squares to obtain fractions.

$$
p_i=\frac{\sigma_i^2}{\sum_j\sigma_j^2}
$$



### 155. Code challenge: When is UV^T valid, what is its norm, and is it orthogonal?

For a thin SVD, UV transpose has special orthogonality properties only under the right dimension assumptions. Check shapes first.

$$
(UV^T)^T(UV^T)=VU^TUV^T
$$



### 156. SVD, matrix inverse, and pseudoinverse

Invert nonzero singular values to form the pseudoinverse; zero values remain zero.

$$
A^+=V\Sigma^+U^T
$$



### 157. SVD, (pseudo)inverse, and left-inverse

A full-column-rank tall matrix has a left inverse equal to its pseudoinverse. For general matrices, use SVD.

$$
A^+=(A^TA)^{-1}A^T\quad\text{if full column rank}
$$



### 158. Condition number of a matrix

A large condition number signals sensitivity to perturbations. If the smallest singular value is zero, the 2-norm condition number is infinite.

$$
\kappa_2(A)=\frac{\sigma_{\max}}{\sigma_{\min}}
$$



### 159. Code challenge: Create matrix with desired condition number

Choose singular values with a prescribed ratio to synthesize a matrix with a target condition number.

$$
\Sigma=\operatorname{diag}(\kappa,1)\Rightarrow\kappa_2=\kappa
$$



### 160. Code challenge: Why you avoid the inverse

Avoid computing an explicit inverse when solving equations. Factorizations are often faster and more stable.

$$
Ax=b\quad\text{solve directly rather than }x=A^{-1}b
$$




## Worked example — Compress by keeping one mode

$$
A=U\operatorname{diag}(5,1,0.1)V^T
$$

Keeping only the largest singular value produces a rank-one approximation; smaller modes are discarded.


## Try it in Python

Run this with NumPy:

```python
import numpy as np
A = np.diag([5.,1.,.1])
U,s,Vt = np.linalg.svd(A)
print("singular values:", s)
print("rank-one approximation:\n", (U[:,:1]*s[:1])@Vt[:1,:])
```


## Quick review

1. In one sentence, what is the main idea of singular value decomposition?

2. When does the displayed formula fail or require an extra assumption?

3. Change one number in the example. Predict the result before calculating.


## Key takeaway

SVD separates any real matrix into orthogonal changes of basis and nonnegative stretches.
