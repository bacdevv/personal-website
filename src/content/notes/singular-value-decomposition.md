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

I will treat SVD as **rotate → stretch → rotate**. It works for rectangular matrices and explains rank, approximation error, conditioning, and pseudoinverses.

## Learning goals

- Interpret the dimensions and geometry of $U\Sigma V^T$.
- Construct low-rank approximations from the largest singular values.
- Use singular values to understand numerical rank and conditioning.

## Visual intuition

![A mathematical visualization for singular value decomposition.](/images/linear-algebra/course/singular-value-decomposition.svg)

<section class="course-interactive" data-course-demo="svd" aria-label="Interactive mathematical illustration"></section>

The diagram updates independently of the Python runner. It shows one small example; the lessons below explain the general rule.

## Part A — Build and interpret the SVD

### 147. Singular value decomposition (SVD)

**Main idea.** SVD works for any real rectangular or square matrix and separates input directions, scale, and output directions.

$$
A=U\Sigma V^T
$$

**Worked example.** For $A=\begin{bmatrix}3&0\\0&1\\0&0\end{bmatrix}$, the singular values are $3,1$. An input unit circle maps to an ellipse in a 3D output plane with semiaxes $3$ and $1$.

**Check yourself:** Does SVD require a square matrix?

<details><summary>Answer</summary>

No. It applies to all real or complex matrices.

</details>

### 148. Code challenge: SVD vs. eigendecomposition for square symmetric matrices

**Main idea.** For symmetric positive semidefinite matrices, singular values coincide with nonnegative eigenvalues; this is not true for all symmetric matrices.

$$
\sigma_i(A)=|\lambda_i(A)|\quad\text{when }A=A^T
$$

**Worked example.** For symmetric $A=\operatorname{diag}(3,-2)$, eigenvalues are $3,-2$, while singular values are $3,2$. The singular values forget signs but keep stretching magnitudes.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.diag([3., -2.])
print('eigenvalues:', np.linalg.eigvalsh(A))
print('singular values:', np.linalg.svd(A, compute_uv=False))
assert np.allclose(np.sort(np.linalg.svd(A, compute_uv=False)),
                   np.sort(np.abs(np.linalg.eigvalsh(A))))
```

**Check yourself:** When do singular values equal eigenvalues for symmetric A?

<details><summary>Answer</summary>

When A is positive semidefinite (all eigenvalues nonnegative).

</details>

### 149. Relation between singular values and eigenvalues

**Main idea.** Singular values are the square roots of eigenvalues of $A^T$ A. They are nonnegative.

$$
\sigma_i^2=\lambda_i(A^TA)
$$

**Worked example.** For $A=\operatorname{diag}(3,2)$, $A^TA=\operatorname{diag}(9,4)$. Its eigenvalues $9,4$ have nonnegative square roots $3,2$, the singular values.

**Check yourself:** Can a singular value be negative?

<details><summary>Answer</summary>

No.

</details>

### 150. Code challenge: U from eigendecomposition of A^TA

**Main idea.** Compute right singular vectors from $A^T$ A, then derive left singular vectors for nonzero singular values.

$$
u_i=\frac{Av_i}{\sigma_i}\quad(\sigma_i>0)
$$

**Worked example.** With $A=\begin{bmatrix}3&0\\0&2\\0&0\end{bmatrix}$, take $v_1=(1,0)^T$, $\sigma_1=3$; then $Av_1/3=(1,0,0)^T=u_1$. Repeat for the second direction.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.array([[3., 0.], [0., 2.], [0., 0.]])
values, V = np.linalg.eigh(A.T @ A)
order = np.argsort(values)[::-1]
values, V = values[order], V[:, order]
s = np.sqrt(np.maximum(values, 0))
U = A @ V / s[np.newaxis, :]
print('singular values:', s)
assert np.allclose(U.T @ U, np.eye(2))
```

**Check yourself:** Why is u_i = Av_i/sigma_i invalid at sigma_i=0?

<details><summary>Answer</summary>

Division by zero; complete the orthonormal basis separately.

</details>

### 151. SVD and the four subspaces

**Main idea.** SVD organizes bases for the row space, column space, and their orthogonal null-space complements.

$$
\operatorname{rank}(A)=\#\{\sigma_i>0\}
$$

**Worked example.** For the above 3×2 matrix, $\operatorname{Col}(A)$ is the $xy$ plane, $\operatorname{Row}(A)=\mathbb R^2$, $\operatorname{Null}(A)=\{0\}$ and $\operatorname{Null}(A^T)$ is the $z$-axis.

**Check yourself:** What does the number of nonzero singular values equal?

<details><summary>Answer</summary>

The rank.

</details>

## Part B — Spectra, approximations and pseudoinverses

### 152. Spectral theory of matrices

**Main idea.** The spectrum of singular values tells how strongly the matrix stretches each orthogonal input direction.

$$
\lVert Av_i\rVert_2=\sigma_i
$$

**Worked example.** Compare singular values $(5,1)$ and $(5,0.01)$. Both maps have rank 2 in exact arithmetic, but the second almost removes one direction and has a much larger condition number.

**Check yourself:** What information does the singular-value spectrum give?

<details><summary>Answer</summary>

The amount of stretching along orthogonal input directions.

</details>

### 153. SVD for low-rank approximations

**Main idea.** Keep only the largest singular values for a lower-rank approximation, trading accuracy for storage or noise reduction.

$$
A_k=\sum_{i=1}^{k}\sigma_i u_iv_i^T
$$

**Worked example.** Suppose $A$ has singular values $(5,2,0.2)$. The best rank-2 approximation keeps the first two terms; its Frobenius error is $\sqrt{0.2^2}=0.2$.

**Check yourself:** Which singular directions should we retain for minimum Frobenius error?

<details><summary>Answer</summary>

The ones with largest singular values.

</details>

### 154. Convert singular values to percent variance

**Main idea.** Squared singular values measure the matrix's Frobenius energy. Normalize their squares to obtain fractions.

$$
p_i=\frac{\sigma_i^2}{\sum_j\sigma_j^2}
$$

**Worked example.** For singular values $(3,1)$, squared values are $(9,1)$, so the first component accounts for $90\%$ of the Frobenius energy and the second for $10\%$.

**Check yourself:** Why not divide singular values directly by their sum to compute explained energy?

<details><summary>Answer</summary>

Energy is proportional to squared singular values.

</details>

### 155. Code challenge: When is UV^T valid, what is its norm, and is it orthogonal?

**Main idea.** For a thin SVD, UV transpose has special orthogonality properties only under the right dimension assumptions. Check shapes first.

$$
(UV^T)^T(UV^T)=VU^TUV^T
$$

**Worked example.** For the thin SVD of a rectangular matrix, dimensions can make $UV^T$ invalid if U and V have different retained-column counts. With matching thin factors, $UV^T$ is a partial isometry, not generally a square orthogonal matrix.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.array([[2., 0.], [0., 1.], [0., 0.]])
U, s, Vt = np.linalg.svd(A, full_matrices=False)
M = U @ Vt   # 3x2: orthonormal columns, not square orthogonal
print('shape:', M.shape)
print('M^T M:', M.T @ M)
print('Frobenius norm:', np.linalg.norm(M, 'fro'))
assert np.allclose(M.T @ M, np.eye(2))
```

**Check yourself:** When is UVᵀ an orthogonal square matrix?

<details><summary>Answer</summary>

In a full square SVD with square orthogonal U and V.

</details>

### 156. SVD, matrix inverse, and pseudoinverse

**Main idea.** Invert nonzero singular values to form the pseudoinverse; zero values remain zero.

$$
A^+=V\Sigma^+U^T
$$

**Worked example.** For $A=\operatorname{diag}(2,0)$, pseudoinverse is $\operatorname{diag}(1/2,0)$. Nonzero singular values are inverted, zero ones are left zero.

**Check yourself:** What does pseudoinverse do with singular directions?

<details><summary>Answer</summary>

It does not try to invert zero singular values.

</details>

## Part C — Conditioning and stable solutions

### 157. SVD, (pseudo)inverse, and left-inverse

**Main idea.** A full-column-rank tall matrix has a left inverse equal to its pseudoinverse. For general matrices, use SVD.

$$
A^+=(A^TA)^{-1}A^T\quad\text{if full column rank}
$$

**Worked example.** A tall full-column-rank matrix has $A^+=(A^TA)^{-1}A^T$. This is also a least-squares left inverse, but an SVD-based implementation handles poor conditioning better.

**Check yourself:** Does a rectangular pseudoinverse always yield a two-sided inverse?

<details><summary>Answer</summary>

No; it yields projections AA⁺ and A⁺A.

</details>

### 158. Condition number of a matrix

**Main idea.** A large condition number signals sensitivity to perturbations. If the smallest singular value is zero, the 2-norm condition number is infinite.

$$
\kappa_2(A)=\frac{\sigma_{\max}}{\sigma_{\min}}
$$

**Worked example.** For $A=\operatorname{diag}(10,0.1)$, the 2-norm condition number is $10/0.1=100$. Perturbations can be amplified relative to well-conditioned matrices.

**Check yourself:** What happens to condition number at a zero smallest singular value?

<details><summary>Answer</summary>

It is infinite for a singular matrix under the usual 2-norm definition.

</details>

### 159. Code challenge: Create matrix with desired condition number

**Main idea.** Choose singular values with a prescribed ratio to synthesize a matrix with a target condition number.

$$
\Sigma=\operatorname{diag}(\kappa,1)\Rightarrow\kappa_2=\kappa
$$

**Worked example.** To construct a matrix with condition number $50$, choose orthogonal U,V and singular values $(5,0.1)$, then set $A=U\Sigma V^T$.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
Q = np.array([[0., -1.], [1., 0.]])
D = np.diag([5., 0.1])
A = Q @ D
print('condition number:', np.linalg.cond(A))
assert np.isclose(np.linalg.cond(A), 50)
```

**Check yourself:** Why is a diagonal SVD construction convenient?

<details><summary>Answer</summary>

Condition number is the ratio of largest to smallest positive singular values for a nonsingular matrix.

</details>

### 160. Code challenge: Why you avoid the inverse

**Main idea.** Avoid computing an explicit inverse when solving equations. Factorizations are often faster and more stable.

$$
Ax=b\quad\text{solve directly rather than }x=A^{-1}b
$$

**Worked example.** Instead of computing $x=A^{-1}b$, call a linear solver. Forming $A^{-1}$ explicitly generally adds unnecessary work and can increase numerical error.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.array([[3., 1.], [1., 2.]])
b = np.array([5., 4.])
x_solve = np.linalg.solve(A, b)
x_inverse = np.linalg.inv(A) @ b
print('solve:', x_solve, 'explicit inverse:', x_inverse)
assert np.allclose(x_solve, x_inverse)
# Prefer np.linalg.solve for actual work.
```

**Check yourself:** Which NumPy function solves square systems without forming inverse?

<details><summary>Answer</summary>

np.linalg.solve.

</details>

## Detailed worked example

## A rectangular SVD

For $A=\begin{bmatrix}3&0\\0&1\\0&0\end{bmatrix}$, the nonzero singular values are $3$ and $1$. The right singular vectors identify orthogonal input directions; $A$ stretches them by these factors and the left singular vectors identify output directions. Unlike eigendecomposition, SVD works for rectangular matrices.

The thin factorization has dimensions $U\in\mathbb R^{3\times2}$, $\Sigma\in\mathbb R^{2\times2}$, and $V^T\in\mathbb R^{2\times2}$. Their product is $3\times2$, just like $A$.

## Keep only strong directions

Suppose the singular values are $(5,2,0.1)$. The rank-2 truncated SVD removes only the weakest direction. Its Frobenius reconstruction error is $0.1$; the first two squared singular values explain $(25+4)/(25+4+0.01)$ of the matrix energy.

A tiny singular value makes inverse problems sensitive to perturbations. The condition number $\kappa_2(A)=\sigma_{\max}/\sigma_{\min}$ records this sensitivity for nonsingular matrices. Stable solvers matter more than forming inverse matrices.


## Verify the calculations with Python

The numerical examples use NumPy. Each block is self-contained so you can run it independently. If a library is still loading in the website runner, try the same code in Jupyter or Colab.

```python
import numpy as np
A = np.array([[3., 0.], [0., 1.], [0., 0.]])
U, s, Vt = np.linalg.svd(A, full_matrices=False)
print("shapes:", U.shape, s.shape, Vt.shape)
reconstruction = U @ np.diag(s) @ Vt
print("reconstruction error:", np.linalg.norm(A - reconstruction))
print("singular values:", s)
print("condition number:", s.max() / s.min())
A1 = U[:, :1] @ np.diag(s[:1]) @ Vt[:1, :]
print("rank-1 error:", np.linalg.norm(A - A1))
```

## Practice questions

I recommend answering these questions before opening the solutions. A small calculation is more useful than memorizing a long definition.

1. What does SVD handle that ordinary eigendecomposition does not?
2. Can singular values be negative?
3. Which quantity measures numerical sensitivity of an invertible matrix?
4. Why use sigma² for percentage variance?

### Answers

1. Rectangular matrices.
2. No.
3. Its condition number.
4. Squared singular values give energy/Frobenius variance contributions.

## Common mistakes

- Singular values are not generally eigenvalues; for symmetric A they are absolute eigenvalue magnitudes.
- A rank-k approximation is not the same as keeping any arbitrary k directions.
- When sigma_min is close to zero, numerical inversion amplifies noise.

## What I want you to remember

SVD decomposes any matrix into orthogonal directions and nonnegative stretches. Small singular values signal directions that are difficult to recover reliably.
