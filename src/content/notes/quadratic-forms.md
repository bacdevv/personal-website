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

I will connect $x^TAx$ to **curved surfaces, eigen-directions, and PCA**. By checking its sign in different directions, we can classify a symmetric matrix as positive, negative, or indefinite.

## Learning goals

- Evaluate and normalize quadratic forms with small numerical examples.
- Relate Rayleigh-quotient extrema to eigenvalues for symmetric matrices.
- Classify definiteness and prove $A^TA$ is positive semidefinite.

## Visual intuition

![A mathematical visualization for quadratic forms and definiteness.](/images/linear-algebra/course/quadratic-forms.svg)

<section class="course-interactive" data-course-demo="quadratic" aria-label="Interactive mathematical illustration"></section>

The diagram updates independently of the Python runner. It shows one small example; the lessons below explain the general rule.

## Part A — Quadratic forms and normalized values

### 161. The quadratic form in algebra

**Main idea.** A quadratic form maps a vector to a scalar using a square matrix. It depends on both the matrix and direction.

$$
q(x)=x^TAx
$$

**Worked example.** For $A=\operatorname{diag}(2,1)$ and $x=(3,-1)^T$, $x^TAx=2(3^2)+1(-1)^2=19$.

**Check yourself:** Is a quadratic form a vector?

<details><summary>Answer</summary>

No, it is a scalar.

</details>

### 162. The quadratic form in geometry

**Main idea.** For a symmetric matrix, plotting q(x) over a 2D grid gives a surface. The shape may be a bowl, saddle, or inverted bowl.

$$
q(x,y)=ax^2+2bxy+cy^2
$$

**Worked example.** For positive diagonal $A$, the level set $x^TAx=1$ is an ellipse. If the matrix has mixed-sign eigenvalues, the geometry changes to hyperbolas.

**Check yourself:** What does the contour of x²+y²=1 look like?

<details><summary>Answer</summary>

The unit circle.

</details>

### 163. The normalized quadratic form

**Main idea.** Normalizing by the vector length removes the effect of simply scaling a nonzero vector.

$$
R_A(x)=\frac{x^TAx}{x^Tx}
$$

**Worked example.** The normalized Rayleigh quotient $R_A(x)=x^TAx/(x^Tx)$ removes the effect of multiplying x by a nonzero scalar. For diag(2,5) it ranges between 2 and 5 over nonzero x.

**Check yourself:** Can the Rayleigh quotient be evaluated at x=0?

<details><summary>Answer</summary>

No; its denominator would be zero.

</details>

### 164. Code challenge: Visualize the normalized quadratic form

**Main idea.** Sweep an angle around the unit circle and plot the normalized quadratic form. Its extrema reveal special axes.

$$
x(\theta)=\begin{bmatrix}\cos\theta\\\sin\theta\end{bmatrix}
$$

**Worked example.** For $A=\operatorname{diag}(2,5)$ and a unit vector $x=(\cos\theta,\sin\theta)$, plot $R_A(x)=2\cos^2\theta+5\sin^2\theta$. It reaches 2 and 5 at the eigen-directions.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.diag([2., 5.])
for degrees in [0, 30, 60, 90]:
    theta = np.deg2rad(degrees)
    x = np.array([np.cos(theta), np.sin(theta)])
    quotient = (x @ A @ x) / (x @ x)
    print(f'{degrees}°: {quotient:.3f}')
# The minimum and maximum are the eigenvalues 2 and 5.
```

**Check yourself:** At what angle is R_A maximal for this example?

<details><summary>Answer</summary>

At a y-axis direction, e.g. 90 degrees.

</details>

## Part B — Eigen-directions, PCA and GED

### 165. Eigenvectors and the quadratic form surface

**Main idea.** For symmetric A, eigenvectors are stationary directions of the Rayleigh quotient. Their values are eigenvalues.

$$
R_A(q_i)=\lambda_i\quad(\lVert q_i\rVert=1)
$$

**Worked example.** For symmetric A, stationary directions of the Rayleigh quotient are eigenvectors. Its extremes occur at smallest and largest eigenvalues, visible on the surface or contour plot.

**Check yourself:** What geometrically separates maximum and minimum directions?

<details><summary>Answer</summary>

They are orthogonal eigen-directions for a symmetric 2×2 with distinct eigenvalues.

</details>

### 166. Application of the normalized quadratic form: PCA

**Main idea.** PCA chooses principal directions of a covariance matrix. The leading eigenvectors maximize variance along those directions.

$$
\max_{\lVert x\rVert=1}x^TCx=\lambda_{\max}(C)
$$

**Worked example.** PCA diagonalizes a centered covariance matrix. The top eigenvector maximizes projected variance, so projected data spread is largest along PC1.

**Check yourself:** Does PCA require centering before covariance eigendecomposition?

<details><summary>Answer</summary>

Yes for the standard variance-maximizing PCA interpretation.

</details>

### 167. Quadratic form of generalized eigendecomposition

**Main idea.** Generalized quadratic forms compare energy measured by two matrices, when the denominator is positive.

$$
\frac{x^TAx}{x^TBx},\quad B\succ0
$$

**Worked example.** For a symmetric matrix pair $(A,B)$ with positive-definite B, the generalized Rayleigh quotient is $x^TAx/(x^TBx)$. Stationary directions satisfy $Av=\lambda Bv$.

**Check yourself:** Why require B positive definite in this formulation?

<details><summary>Answer</summary>

To keep the denominator positive for nonzero x.

</details>

## Part C — Definiteness and positive semidefinite proofs

### 168. Matrix definiteness, geometry, and eigenvalues

**Main idea.** Definiteness classifies the signs of x transpose A x. The geometry distinguishes bowls, saddles and flat directions.

$$
A\succ0\iff x^TAx>0\quad\forall x\ne0
$$

**Worked example.** For $A=\operatorname{diag}(2,-1)$, $x^TAx=2x_1^2-x_2^2$ can be positive or negative. Therefore A is indefinite.

**Check yourself:** What does zero eigenvalue imply for a positive semidefinite matrix?

<details><summary>Answer</summary>

Some nonzero direction can have zero quadratic form.

</details>

### 169. Proof: A^TA is always positive (semi)definite

**Main idea.** Every $A^T$ A is positive semidefinite because its quadratic form is a squared length; it is positive definite only for full column rank.

$$
x^TA^TAx=\lVert Ax\rVert_2^2\ge0
$$

**Worked example.** For any real A, $x^TA^TAx=\|Ax\|_2^2\ge0$. Equality holds precisely when x belongs to the null space of A.

**Check yourself:** When is AᵀA positive definite?

<details><summary>Answer</summary>

When A has full column rank.

</details>

### 170. Proof: Eigenvalues and matrix definiteness

**Main idea.** For real symmetric A, eigenvalue signs determine definiteness. Positive eigenvalues mean a positive-definite form.

$$
A\succ0\iff\lambda_{\min}(A)>0\quad(A=A^T)
$$

**Worked example.** A real symmetric A is positive definite if and only if all its eigenvalues are strictly positive. Diag(2,-1) fails because its second eigenvalue is negative.

**Check yourself:** Can a nonsymmetric matrix be classified solely by its real eigenvalue signs?

<details><summary>Answer</summary>

Not with the standard symmetric definiteness equivalence; use the symmetric part for the real quadratic form.

</details>

## Detailed worked example

## A quadratic form in two coordinates

Take $A=\operatorname{diag}(2,1)$ and $x=(3,-1)^T$. Then $x^TAx=2\cdot9+1\cdot1=19$. If $x$ doubles, the value increases fourfold because every term contains two factors of $x$.

The curve $x^TAx=1$ is an ellipse when $A$ is symmetric positive definite. For $A=\operatorname{diag}(2,-1)$, the form becomes $2x_1^2-x_2^2$ and changes sign, so the level sets look hyperbolic.

## Definiteness from eigenvalues

For a real symmetric matrix, positive definite means $x^TAx>0$ for every nonzero $x$, equivalent to all eigenvalues being positive. Positive semidefinite allows equality; indefinite means the quadratic form takes both positive and negative values.

Because $x^TA^TAx=\lVert Ax\rVert_2^2\ge0$, $A^TA$ is always positive semidefinite. It is positive definite only when $A$ has no nonzero null vector.


## Verify the calculations with Python

The numerical examples use NumPy. Each block is self-contained so you can run it independently. If a library is still loading in the website runner, try the same code in Jupyter or Colab.

```python
import numpy as np
A = np.diag([2., -1.])
for v in [np.array([1., 0.]), np.array([0., 1.])]:
    print(v, float(v @ A @ v))
print("eigenvalues:", np.linalg.eigvalsh(A))
B = np.array([[1., 2.], [0., 0.], [1., -1.]])
G = B.T @ B
print("Gram eigenvalues:", np.linalg.eigvalsh(G))
print("is PSD:", np.min(np.linalg.eigvalsh(G)) >= -1e-10)
```

## Practice questions

I recommend answering these questions before opening the solutions. A small calculation is more useful than memorizing a long definition.

1. Is xᵀAx a matrix or scalar?
2. How do we classify symmetric diag(2,-1)?
3. Why is AᵀA positive semidefinite?
4. What is a stationary direction of the Rayleigh quotient?

### Answers

1. A scalar.
2. Indefinite.
3. xᵀAᵀAx=||Ax||²≥0.
4. An eigenvector, under the symmetric setting.

## Common mistakes

- Definiteness via eigenvalues is straightforward for real symmetric (Hermitian) matrices.
- The zero vector does not test strict positivity in the definition.
- A normalized quadratic form is undefined for the zero vector.

## What I want you to remember

For real symmetric $A$, the signs of its eigenvalues determine definiteness. The Rayleigh quotient describes the quadratic form per unit squared vector length.
