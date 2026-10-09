---
title: "Solving Systems of Equations — Linear Algebra, Chapter 6"
description: "Turn equations into matrices, then solve them with systematic row operations."
subject: Linear Algebra
date: "2026-10-09T09:06:00Z"
draft: false
tags:
  - linear-algebra
  - mathematics
  - solving-systems
---


Turn equations into matrices, then solve them with systematic row operations.


## The main idea

$$
A\mathbf x=\mathbf b
$$

![Line intersections and pivots shown as an actual mathematical graph.](/images/linear-algebra/course/solving-systems.svg)

<section class="course-interactive" data-course-demo="systems" aria-label="Interactive solving systems of equations diagram"></section>


## Lessons

### 80. Systems of equations: algebra and geometry

Each equation in two variables is a line. A solution to two equations is their intersection: one point, a whole line, or none.

$$
ax+by=c
$$



### 81. Converting systems of equations to matrix equations

Stack coefficients into a matrix, unknowns into a vector, and constants into another vector. This turns a system into Ax=b.

$$
A\mathbf x=\mathbf b
$$



### 82. Gaussian elimination

Gaussian elimination replaces rows using operations that preserve the solution set. The goal is an upper-triangular or echelon system.

$$
R_2\leftarrow R_2-2R_1
$$



### 83. Echelon form and pivots

A pivot marks a leading nonzero entry. Pivot columns identify independent directions, while free columns lead to free variables.

$$
\operatorname{rank}(A)=\text{number of pivots}
$$



### 84. Reduced row echelon form

RREF normalizes each pivot to one and clears entries above and below it. It makes the general solution easy to read.

$$
\operatorname{rref}\!\left(\begin{bmatrix}1&2\\2&4\end{bmatrix}\right)=\begin{bmatrix}1&2\\0&0\end{bmatrix}
$$



### 85. Code challenge: RREF of matrices with different sizes and ranks

Different matrix shapes and ranks produce different numbers of pivots. Always compare the coefficient and augmented matrices to detect inconsistency.

$$
\operatorname{rank}(A)<\operatorname{rank}([A\mid b])\Rightarrow\text{no solution}
$$



### 86. Matrix spaces after row reduction

Row reduction preserves the row space and null space, but generally changes the column space. Pivot positions point back to basis columns of the original matrix.

$$
\operatorname{Null}(A)=\operatorname{Null}(\operatorname{rref}(A))
$$




## Worked example — One solution

$$
\begin{cases}x+y=3\\x-y=1\end{cases}\ \Rightarrow\ (x,y)=(2,1)
$$

The two lines cross once. If they were parallel but distinct, no solution would exist.


## Try it in Python

Run this with NumPy:

```python
import numpy as np
A = np.array([[1.,1.],[1.,-1.]])
b = np.array([3.,1.])
print("solution:", np.linalg.solve(A, b))
```


## Quick review

1. In one sentence, what is the main idea of solving systems of equations?

2. When does the displayed formula fail or require an extra assumption?

3. Change one number in the example. Predict the result before calculating.


## Key takeaway

Turn equations into matrices, then solve them with systematic row operations.
