---
title: "Quadratic Forms and Definiteness — Linear Algebra, Chapter 13"
description: "Quadratic forms connect matrix eigenvalues to curved surfaces and PCA."
subject: Linear Algebra
date: "2026-10-09T09:13:00Z"
draft: false
tags:
  - linear-algebra
  - mathematics
  - quadratic-forms
---


Quadratic forms connect matrix eigenvalues to curved surfaces and PCA.


## The main idea

$$
q(x)=x^TAx
$$

![Quadratic form surface shown as an actual mathematical graph.](/images/linear-algebra/course/quadratic-forms.svg)

<section class="course-interactive" data-course-demo="quadratic" aria-label="Interactive quadratic forms and definiteness diagram"></section>


## Lessons

### 161. The quadratic form in algebra

A quadratic form maps a vector to a scalar using a square matrix. It depends on both the matrix and direction.

$$
q(x)=x^TAx
$$



### 162. The quadratic form in geometry

For a symmetric matrix, plotting q(x) over a 2D grid gives a surface. The shape may be a bowl, saddle, or inverted bowl.

$$
q(x,y)=ax^2+2bxy+cy^2
$$



### 163. The normalized quadratic form

Normalizing by the vector length removes the effect of simply scaling a nonzero vector.

$$
R_A(x)=\frac{x^TAx}{x^Tx}
$$



### 164. Code challenge: Visualize the normalized quadratic form

Sweep an angle around the unit circle and plot the normalized quadratic form. Its extrema reveal special axes.

$$
x(\theta)=\begin{bmatrix}\cos\theta\\\sin\theta\end{bmatrix}
$$



### 165. Eigenvectors and the quadratic form surface

For symmetric A, eigenvectors are stationary directions of the Rayleigh quotient. Their values are eigenvalues.

$$
R_A(q_i)=\lambda_i\quad(\lVert q_i\rVert=1)
$$



### 166. Application of the normalized quadratic form: PCA

PCA chooses principal directions of a covariance matrix. The leading eigenvectors maximize variance along those directions.

$$
\max_{\lVert x\rVert=1}x^TCx=\lambda_{\max}(C)
$$



### 167. Quadratic form of generalized eigendecomposition

Generalized quadratic forms compare energy measured by two matrices, when the denominator is positive.

$$
\frac{x^TAx}{x^TBx},\quad B\succ0
$$



### 168. Matrix definiteness, geometry, and eigenvalues

Definiteness classifies the signs of x transpose A x. The geometry distinguishes bowls, saddles and flat directions.

$$
A\succ0\iff x^TAx>0\quad\forall x\ne0
$$



### 169. Proof: A^TA is always positive (semi)definite

Every A transpose A is positive semidefinite because its quadratic form is a squared length; it is positive definite only for full column rank.

$$
x^TA^TAx=\lVert Ax\rVert_2^2\ge0
$$



### 170. Proof: Eigenvalues and matrix definiteness

For real symmetric A, eigenvalue signs determine definiteness. Positive eigenvalues mean a positive-definite form.

$$
A\succ0\iff\lambda_{\min}(A)>0\quad(A=A^T)
$$




## Worked example — Bowl or saddle?

$$
A=\begin{bmatrix}2&0\\0&1\end{bmatrix},\quad q(x,y)=2x^2+y^2
$$

Every nonzero direction has positive energy, so the surface is a bowl.


## Try it in Python

Run this with NumPy:

```python
import numpy as np
A = np.diag([2.,1.]); x = np.array([1.,2.])
print("quadratic form:", x@A@x)
print("Rayleigh quotient:", (x@A@x)/(x@x))
print("positive eigenvalues:", np.linalg.eigvalsh(A))
```


## Quick review

1. In one sentence, what is the main idea of quadratic forms and definiteness?

2. When does the displayed formula fail or require an extra assumption?

3. Change one number in the example. Predict the result before calculating.


## Key takeaway

Quadratic forms connect matrix eigenvalues to curved surfaces and PCA.
