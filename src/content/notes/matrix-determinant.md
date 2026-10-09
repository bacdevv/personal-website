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

I will explain the determinant through **signed area and volume** before computing it. Then we will use row operations and small code challenges to discover what changes its value.

## Learning goals

- Compute 2×2 and 3×3 determinants with the appropriate shortcut or expansion.
- Predict the effect of row swaps, dependent rows, and diagonal shifts.
- Relate $\det(A)=0$ to singularity and loss of dimensions.

## Visual intuition

![A mathematical visualization for matrix determinant.](/images/linear-algebra/course/matrix-determinant.svg)

<section class="course-interactive" data-course-demo="determinant" aria-label="Interactive mathematical illustration"></section>

The diagram updates independently of the Python runner. It shows one small example; the lessons below explain the general rule.

## Part A — What the determinant measures

### 87. Determinant: concept and applications

**Main idea.** The determinant measures signed area or volume scaling for a square matrix. Zero means the transformation collapses a dimension.

$$
\det(A)=0\iff A\text{ is singular}
$$

**Worked example.** The matrix $\operatorname{diag}(2,3)$ multiplies area by $6$; $\operatorname{diag}(2,-3)$ multiplies area magnitude by $6$ but reverses orientation. A zero determinant collapses all area.

**Check yourself:** Is a negative determinant a negative geometric area?

<details><summary>Answer</summary>

No. Its magnitude is the area factor; the sign indicates orientation.

</details>

### 88. Determinant of a 2x2 matrix

**Main idea.** For a 2-by-2 matrix, multiply the main diagonal, then subtract the other diagonal's product.

$$
\det\!\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc
$$

**Worked example.** For $A=\begin{bmatrix}2&1\\3&4\end{bmatrix}$, $\det(A)=2\cdot4-1\cdot3=5$. The parallelogram formed by its columns has area $5$.

**Check yourself:** What is det([[1,2],[2,4]])?

<details><summary>Answer</summary>

0, because the columns are dependent.

</details>

### 89. Code challenge: determinant of small and large singular matrices

**Main idea.** A singular matrix has dependent rows or columns, so its determinant is zero. Try duplicate a row to force that case.

$$
\det(A)=0\quad\text{if two rows coincide}
$$

**Worked example.** Duplicating a row makes a matrix singular, so its determinant becomes zero at any size. For numerical matrices, distinguish an exactly zero theoretical determinant from a tiny floating-point value.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.array([[1., 3., 2.], [4., 0., 1.], [1., 3., 2.]])
print('rank:', np.linalg.matrix_rank(A))
print('det:', np.linalg.det(A))
assert np.linalg.matrix_rank(A) < 3
```

**Check yourself:** Does a tiny computed determinant always prove exact singularity?

<details><summary>Answer</summary>

No. Check tolerance, conditioning, or matrix rank.

</details>

## Part B — Computation and row operations

### 90. Determinant of a 3x3 matrix

**Main idea.** For 3-by-3 matrices, expand by cofactors. Every cofactor is the determinant of a smaller 2-by-2 matrix with a sign.

$$
\det(A)=a_{11}M_{11}-a_{12}M_{12}+a_{13}M_{13}
$$

**Worked example.** For $A=\begin{bmatrix}1&2&0\\0&3&1\\0&0&4\end{bmatrix}$, the upper-triangular shortcut gives $\det(A)=1\cdot3\cdot4=12$. Expanding by the first column gives the same result.

**Check yourself:** What controls the alternating signs of a cofactor expansion?

<details><summary>Answer</summary>

The factor (-1)^(i+j).

</details>

### 91. Code challenge: large matrices with row exchanges

**Main idea.** Swapping two rows reverses the determinant's sign, but not its magnitude. Track swaps during elimination.

$$
\det(PA)=-\det(A)\quad\text{for one row swap}
$$

**Worked example.** Swapping the rows of $\operatorname{diag}(2,3)$ turns determinant $6$ into $-6$. If a row swap is needed during elimination, count it before multiplying diagonal pivots.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.array([[2., 1.], [4., 3.]])
B = A[[1, 0]]   # one row exchange
print('det(A):', np.linalg.det(A))
print('det(B):', np.linalg.det(B))
assert np.allclose(np.linalg.det(B), -np.linalg.det(A))
```

**Check yourself:** What do two row swaps do to determinant sign?

<details><summary>Answer</summary>

They restore the original sign.

</details>

### 92. Find matrix values for a given determinant

**Main idea.** Treat a matrix entry as an unknown, expand the determinant, and solve the resulting equation for the desired value.

$$
\det\!\begin{bmatrix}x&1\\2&3\end{bmatrix}=3x-2
$$

**Worked example.** Let $A(x)=\begin{bmatrix}x&1\\2&3\end{bmatrix}$. If $\det A=10$, solve $3x-2=10$ to obtain $x=4$. Substitute to verify.

**Check yourself:** Which x makes A(x) singular?

<details><summary>Answer</summary>

x = 2/3.

</details>

## Part C — Shifts, products and deeper rules

### 93. Code challenge: determinant of shifted matrices

**Main idea.** Adding a multiple of the identity changes eigenvalues; it does not add a constant to the determinant. Special shifts can make the matrix singular.

$$
\det(A+\lambda I)=\prod_i(\mu_i+\lambda)
$$

**Worked example.** For $A=\operatorname{diag}(1,3)$, $\det(A+\lambda I)=(1+\lambda)(3+\lambda)$. It vanishes at $\lambda=-1$ and $-3$, even though both shifts are nonzero.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.diag([1., 3.])
for shift in [-3, -1, 0, 1, 2]:
    D = A + shift * np.eye(2)
    print('lambda=', shift, 'det=', round(np.linalg.det(D), 6),
          'rank=', np.linalg.matrix_rank(D))
```

**Check yourself:** Does det(A+lambda I) equal det(A)+lambda?

<details><summary>Answer</summary>

No. The determinant is not linear in that way.

</details>

### 94. Code challenge: determinant of matrix product

**Main idea.** The determinant of a product equals the product of the determinants. This holds for compatible square matrices.

$$
\det(AB)=\det(A)\det(B)
$$

**Worked example.** Take diagonal $A=\operatorname{diag}(2,3)$ and $B=\operatorname{diag}(4,5)$. Then $AB=\operatorname{diag}(8,15)$, so $\det(AB)=120=(6)(20)$.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.array([[2., 1.], [0., 3.]])
B = np.array([[1., 4.], [2., 1.]])
left = np.linalg.det(A @ B)
right = np.linalg.det(A) * np.linalg.det(B)
print('det(AB)=', left, 'det(A)det(B)=', right)
assert np.allclose(left, right)
```

**Check yourself:** If det(A)=0, what is det(AB)?

<details><summary>Answer</summary>

Zero for any compatible square B.

</details>

## Detailed worked example

## Worked example: signed area

Let $A=\begin{bmatrix}2&1\\1&3\end{bmatrix}$. The two column vectors form a parallelogram. Its signed area factor is $\det(A)=2\cdot3-1\cdot1=5$. If the columns swap, the determinant becomes $-5$, while the physical area remains $5$.

Now set the second column to twice the first, obtaining $B=\begin{bmatrix}2&4\\1&2\end{bmatrix}$. Then $\det(B)=0$: the parallelogram collapses into a line. This is also the signal that $B$ is singular.

## Track determinant through elimination

Elimination offers three elementary rules. Swapping two rows multiplies the determinant by $-1$; multiplying one row by $c$ multiplies the determinant by $c$; adding a multiple of another row does not change it. For a triangular matrix, the determinant is simply the product of the diagonal entries.

**Do not confuse** the determinant with a measure of conditioning. A very small nonzero determinant alone does not characterize numerical stability, especially when scales and dimension vary.


## Verify the calculations with Python

The numerical examples use NumPy. Each block is self-contained so you can run it independently. If a library is still loading in the website runner, try the same code in Jupyter or Colab.

```python
import numpy as np
A = np.array([[2., 1.], [1., 3.]])
B = np.array([[2., 4.], [1., 2.]])
print("det(A):", np.linalg.det(A))
print("det(B):", np.linalg.det(B))
print("det(A@A):", np.linalg.det(A @ A))
print("det(A)**2:", np.linalg.det(A) ** 2)
for lam in [-3, -1, 0, 1]:
    print(lam, np.linalg.det(np.diag([1., 3.]) + lam * np.eye(2)))
```

## Practice questions

I recommend answering these questions before opening the solutions. A small calculation is more useful than memorizing a long definition.

1. Does determinant exist for a 2×3 matrix?
2. What happens to det(A) when two rows are exchanged?
3. If det(A)=0, can A have an inverse?
4. Is det(A+B)=det(A)+det(B) generally true?

### Answers

1. No; the ordinary determinant requires a square matrix.
2. The sign reverses.
3. No.
4. No.

## Common mistakes

- Vertical bars around a matrix may denote determinant; use brackets for an ordinary matrix.
- A negative determinant is orientation reversal, not a negative physical area.
- A tiny det is not, by itself, a reliable singularity test in floating-point arithmetic.

## What I want you to remember

The determinant is a scalar defined for square matrices. Its sign tracks orientation, its magnitude tracks area/volume scaling, and zero means singularity.
