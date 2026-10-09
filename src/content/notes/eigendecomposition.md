---
title: "Eigendecomposition — Linear Algebra, Chapter 11"
description: "Eigenvectors reveal directions that a square matrix only stretches or flips."
subject: Linear Algebra
date: "2026-10-09T09:11:00Z"
draft: false
tags:
  - linear-algebra
  - mathematics
  - eigendecomposition
---


Eigenvectors reveal directions that a square matrix only stretches or flips.


## The main idea

$$
A\mathbf v=\lambda\mathbf v
$$

![Eigenvector directions shown as an actual mathematical graph.](/images/linear-algebra/course/eigendecomposition.svg)

<section class="course-interactive" data-course-demo="eigen" aria-label="Interactive eigendecomposition diagram"></section>


## Lessons

### 128. What are eigenvalues and eigenvectors?

An eigenvector keeps its line of direction under a square linear map; its eigenvalue gives the scale, possibly reversing direction.

$$
Av=\lambda v,\quad v\ne 0
$$



### 129. Finding eigenvalues

An eigenvalue makes A minus lambda I singular. Solve the characteristic equation for a small matrix.

$$
\det(A-\lambda I)=0
$$



### 130. Shortcut for eigenvalues of a 2x2 matrix

For 2-by-2 matrices, the characteristic polynomial depends on trace and determinant.

$$
\lambda^2-\operatorname{tr}(A)\lambda+\det(A)=0
$$



### 131. Code challenge: eigenvalues of diagonal and triangular matrices

The eigenvalues of triangular and diagonal matrices are their diagonal entries, including repeats.

$$
\lambda_i(A)=a_{ii}\quad\text{for triangular }A
$$



### 132. Code challenge: eigenvalues of random matrices

Random matrices may have complex eigenvalues. A real matrix need not have only real eigenvalues.

$$
\lambda\in\mathbb C\quad\text{may occur even if }A\in\mathbb R^{n\times n}
$$



### 133. Finding eigenvectors

For each eigenvalue, find a nonzero vector in the null space of A minus lambda I.

$$
(A-\lambda I)v=0
$$



### 134. Eigendecomposition by hand: two examples

Work out simple diagonal or symmetric 2-by-2 examples by hand before trusting a numeric eigensolver.

$$
\begin{bmatrix}2&0\\0&3\end{bmatrix}\!\begin{bmatrix}1\\0\end{bmatrix}=2\begin{bmatrix}1\\0\end{bmatrix}
$$



### 135. Diagonalization

A matrix is diagonalizable when it has a basis of eigenvectors. The change of basis exposes scaling along eigen-directions.

$$
A=V\Lambda V^{-1}
$$



### 136. Matrix powers via diagonalization

If a matrix is diagonalizable, raise eigenvalues to a power instead of repeatedly multiplying full matrices.

$$
A^k=V\Lambda^kV^{-1}
$$



### 137. Code challenge: eigendecomposition of matrix differences

Eigendecomposition of A minus B cannot generally be recovered by simply subtracting their individual eigenvalues. Check with a counterexample.

$$
\lambda_i(A-B)\ne\lambda_i(A)-\lambda_i(B)\quad\text{in general}
$$



### 138. Eigenvectors of distinct eigenvalues

Eigenvectors associated with distinct eigenvalues are linearly independent. For symmetric matrices, they are orthogonal.

$$
\lambda_i\ne\lambda_j\Rightarrow v_i,v_j\text{ independent}
$$



### 139. Eigenvectors of repeated eigenvalues

A repeated eigenvalue may have one or several independent eigenvectors. The number matters for diagonalizability.

$$
\dim\ker(A-\lambda I)\le\text{algebraic multiplicity}
$$



### 140. Eigendecomposition of symmetric matrices

Real symmetric matrices have real eigenvalues and an orthonormal eigenbasis.

$$
A=Q\Lambda Q^T\quad(A=A^T)
$$



### 141. Eigenlayers of a matrix

Each eigenpair contributes one rank-one layer to the matrix reconstruction when eigenvectors form an orthonormal basis.

$$
A=\sum_i\lambda_i q_i q_i^T
$$



### 142. Code challenge: reconstruct a matrix from eigenlayers

Reconstruct a matrix by adding its eigenlayers, then compare the numerical reconstruction error.

$$
\lVert A-\sum_i\lambda_i q_iq_i^T\rVert_F\approx0
$$



### 143. Eigendecomposition of singular matrices

A singular square matrix has at least one zero eigenvalue. Singular does not mean every eigenvalue is zero.

$$
\det(A)=0\Rightarrow 0\text{ is an eigenvalue}
$$



### 144. Code challenge: trace and determinant, eigenvalues sum and product

For a square matrix, eigenvalues sum to trace and multiply to determinant, counting multiplicities.

$$
\sum_i\lambda_i=\operatorname{tr}(A),\quad\prod_i\lambda_i=\det(A)
$$



### 145. Generalized eigendecomposition

Generalized eigenvectors compare two matrix-defined transformations; symmetric positive-definite pairs are especially well behaved.

$$
Av=\lambda Bv
$$



### 146. Code challenge: GED in small and large matrices

Test generalized eigenpairs by their residuals, not by componentwise comparison of eigenvectors.

$$
\lVert Av-\lambda Bv\rVert_2\approx0
$$




## Worked example — Stretch two axes

$$
A=\begin{bmatrix}2&0\\0&3\end{bmatrix},\quad Ae_1=2e_1,\ Ae_2=3e_2
$$

The coordinate axes are eigen-directions. Most other vectors change direction.


## Try it in Python

Run this with NumPy:

```python
import numpy as np
A = np.diag([2.,3.])
values, vectors = np.linalg.eig(A)
print("eigenvalues:", values)
print("reconstruction:\n", vectors@np.diag(values)@np.linalg.inv(vectors))
```


## Quick review

1. In one sentence, what is the main idea of eigendecomposition?

2. When does the displayed formula fail or require an extra assumption?

3. Change one number in the example. Predict the result before calculating.


## Key takeaway

Eigenvectors reveal directions that a square matrix only stretches or flips.
