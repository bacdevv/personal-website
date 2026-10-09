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

I will build the projection formula from a **right angle**: the residual must be perpendicular to the direction we project onto. That leads naturally to Gram–Schmidt and QR.

## Learning goals

- Calculate a projection and verify its residual is orthogonal.
- Construct orthonormal directions using Gram–Schmidt.
- Interpret $A=QR$ and apply QR to numerical problems.

## Visual intuition

![A mathematical visualization for projections and orthogonalization.](/images/linear-algebra/course/projections-orthogonalization.svg)

<section class="course-interactive" data-course-demo="projection" aria-label="Interactive mathematical illustration"></section>

The diagram updates independently of the Python runner. It shows one small example; the lessons below explain the general rule.

## Part A — Project onto a line or subspace

### 108. Projections in R^2

**Main idea.** To project b onto a nonzero vector a, choose the point on a's line closest to b. The residual is perpendicular to a.

$$
\operatorname{proj}_a(b)=a\frac{a^Tb}{a^Ta}
$$

**Worked example.** Let $a=(1,1)$ and $b=(3,1)$. The projection coefficient is $(a\cdot b)/(a\cdot a)=4/2=2$, so $\hat b=(2,2)$ and residual $(1,-1)$ is perpendicular to $a$.

**Check yourself:** What happens if a=0?

<details><summary>Answer</summary>

The projection onto its direction is undefined; there is no nonzero direction.

</details>

### 109. Projections in R^N

**Main idea.** Projection onto a higher-dimensional column space finds the closest vector within that space. An orthonormal basis makes the formula simple.

$$
P=QQ^T\quad\text{when }Q^TQ=I
$$

**Worked example.** If $Q$ contains orthonormal columns $(1,0,0)^T$ and $(0,1,0)^T$, then $QQ^T=\operatorname{diag}(1,1,0)$. It removes the third component of any 3D vector.

**Check yourself:** Does QQ^T work without orthonormal columns?

<details><summary>Answer</summary>

Not directly; a full-column-rank nonorthonormal basis uses A(AᵀA)⁻¹Aᵀ.

</details>

### 110. Orthogonal and parallel vector components

**Main idea.** Every vector splits into a component along a subspace and a residual orthogonal to it.

$$
b=Pb+(I-P)b
$$

**Worked example.** Using $b=(3,1)$ and projection onto $(1,1)$, write $b=(2,2)+(1,-1)$. The components are orthogonal: $(2,2)\cdot(1,-1)=0$.

**Check yourself:** How do you recover b from the two components?

<details><summary>Answer</summary>

Add the projection and the residual.

</details>

### 111. Code challenge: decompose vector to orthogonal components

**Main idea.** Check a projection by verifying the residual is perpendicular to the projection direction.

$$
a^T(b-\operatorname{proj}_a(b))=0
$$

**Worked example.** Implement $\beta=(a^Tb)/(a^Ta)$ and $r=b-\beta a$. Check `abs(a @ r) < tolerance` rather than comparing floating-point values to zero exactly.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
a = np.array([1., 1.])
b = np.array([3., 1.])
parallel = (a @ b) / (a @ a) * a
orthogonal = b - parallel
print('parallel', parallel, 'orthogonal', orthogonal)
assert np.allclose(parallel + orthogonal, b)
assert np.isclose(a @ orthogonal, 0)
```

**Check yourself:** What are two numerical tests for a correct projection?

<details><summary>Answer</summary>

Reconstruction b ≈ projection + residual; orthogonality a·residual ≈ 0.

</details>

## Part B — Orthogonality, Gram–Schmidt and QR

### 112. Orthogonal matrices

**Main idea.** A real orthogonal square matrix preserves dot products and Euclidean lengths. Its transpose is its inverse.

$$
Q^TQ=I\Rightarrow Q^{-1}=Q^T
$$

**Worked example.** A $90^\circ$ rotation has $Q=\begin{bmatrix}0&-1\\1&0\end{bmatrix}$. Both $Q^TQ=I$ and $\|Qx\|_2=\|x\|_2$ hold for every $x$.

**Check yourself:** Can det(Q) be negative for an orthogonal Q?

<details><summary>Answer</summary>

Yes. Reflections have determinant −1.

</details>

### 113. Gram-Schmidt procedure

**Main idea.** Gram-Schmidt subtracts earlier projections to create orthogonal vectors, then normalizes the nonzero residuals.

$$
u_2=a_2-\operatorname{proj}_{u_1}(a_2)
$$

**Worked example.** Start with $a_1=(1,0)$ and $a_2=(1,1)$. Subtract $(a_1\cdot a_2)a_1=(1,0)$ from $a_2$ to get $(0,1)$, an orthogonal direction.

**Check yourself:** What happens if the residual becomes zero?

<details><summary>Answer</summary>

The new vector is dependent on previous ones.

</details>

### 114. QR decomposition

**Main idea.** QR factorization separates a matrix into orthonormal directions Q and an upper-triangular coefficient matrix R.

$$
A=QR,\quad Q^TQ=I
$$

**Worked example.** For $A=\begin{bmatrix}1&1\\0&1\end{bmatrix}$, Gram-Schmidt produces $Q=I$ and $R=A$. Verify $Q^TQ=I$ and $QR=A$.

**Check yourself:** What shape is reduced Q for a full-column-rank m×n matrix?

<details><summary>Answer</summary>

m×n with n orthonormal columns.

</details>

### 115. Code challenge: Gram-Schmidt algorithm

**Main idea.** Implement Gram-Schmidt step by step. If a residual is zero, the new vector was dependent on earlier vectors.

$$
q_k=\frac{v_k}{\lVert v_k\rVert},\quad v_k=a_k-\sum_{i<k}(q_i^Ta_k)q_i
$$

**Worked example.** In modified Gram-Schmidt, subtract each projection from the current residual immediately before computing the next coefficient. This often improves numerical behavior over the classical implementation.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np

def gram_schmidt(A):
    A = np.array(A, dtype=float)
    Q = np.zeros_like(A)
    for j in range(A.shape[1]):
        v = A[:, j].copy()
        for i in range(j):
            v -= np.dot(Q[:, i], v) * Q[:, i]
        length = np.linalg.norm(v)
        if length < 1e-10: raise ValueError('dependent columns')
        Q[:, j] = v / length
    return Q

A = [[1., 1.], [0., 1.], [0., 0.]]
Q = gram_schmidt(A)
print(Q)
assert np.allclose(Q.T @ Q, np.eye(2))
```

**Check yourself:** Why check the norm before normalizing?

<details><summary>Answer</summary>

A zero or tiny residual indicates dependence or numerical instability.

</details>

## Part C — Inverse and QR identities

### 116. Matrix inverse via QR decomposition

**Main idea.** For a full-rank square matrix with QR factorization, solve using triangular R; explicit inversion is usually unnecessary.

$$
A^{-1}=R^{-1}Q^T
$$

**Worked example.** With $A=QR$, $Ax=b$ becomes $R x=Q^T b$ after left-multiplying by $Q^T$ when $Q$ is square orthogonal. Solve triangular R by back-substitution.

**Check yourself:** Must we explicitly form A⁻¹ for Ax=b?

<details><summary>Answer</summary>

No. Solving the triangular system is preferable.

</details>

### 117. Code challenge: Inverse via QR

**Main idea.** Check a QR-based inverse with AA inverse. Compare numeric tolerance, not exact decimal equality.

$$
\lVert AA^{-1}-I\rVert_F\approx 0
$$

**Worked example.** Compute a QR-based candidate inverse by solving $R X=Q^T$ column by column. Verify $\lVert AX-I\rVert_F$ is small, rather than rounding every entry.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.array([[3., 1.], [1., 2.]])
Q, R = np.linalg.qr(A)
X = np.linalg.solve(R, Q.T)
print('inverse by QR:', X)
assert np.allclose(A @ X, np.eye(2))
```

**Check yourself:** What can make a QR-based inverse fail?

<details><summary>Answer</summary>

Singular A or a nearly singular R.

</details>

### 118. Code challenge: Prove and demonstrate the Sherman-Morrison inverse

**Main idea.** A rank-one update admits a cheap inverse update when the denominator is nonzero.

$$
(A+uv^T)^{-1}=A^{-1}-\frac{A^{-1}uv^TA^{-1}}{1+v^TA^{-1}u}
$$

**Worked example.** For scalar $A=[2]$, $u=v=[1]$, the updated matrix is $[3]$. Sherman–Morrison gives $1/2-(1/4)/(1+1/2)=1/3$, as expected.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.array([[3., 0.], [0., 2.]])
u = np.array([1., 1.]); v = np.array([1., -1.])
Ai = np.linalg.inv(A)
denominator = 1 + v @ Ai @ u
assert abs(denominator) > 1e-10
updated = Ai - np.outer(Ai @ u, v @ Ai) / denominator
print('residual:', np.linalg.norm(updated - np.linalg.inv(A + np.outer(u, v))))
```

**Check yourself:** When is the update formula invalid?

<details><summary>Answer</summary>

When 1+vᵀA⁻¹u equals zero.

</details>

### 119. Code challenge: A^TA = R^TR

**Main idea.** The orthonormal Q cancels in $A^T$ A, leaving R transpose R. This connects QR and least squares.

$$
A^TA=R^TR
$$

**Worked example.** If $A=QR$ and $Q^TQ=I$, then $A^TA=R^TQ^TQR=R^TR$. This identity is useful for relating least-squares normal equations to QR.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.array([[1., 2.], [3., 0.], [2., 1.]])
Q, R = np.linalg.qr(A, mode='reduced')
print('A^T A:\n', A.T @ A)
print('R^T R:\n', R.T @ R)
assert np.allclose(A.T @ A, R.T @ R)
```

**Check yourself:** Does forming AᵀA improve conditioning?

<details><summary>Answer</summary>

No; it often squares the condition number.

</details>

## Detailed worked example

## One projection, calculated twice

Let $a=(1,1)^T$ and $b=(3,1)^T$. The projection coefficient is $\beta=a^Tb/(a^Ta)=4/2=2$. Therefore the parallel component is $(2,2)^T$ and the residual is $(1,-1)^T$.

Check: $(1,1)\cdot(1,-1)=0$. The residual is perpendicular to the projection direction. That orthogonality is the defining feature of the closest point on a line.

## Gram–Schmidt becomes QR

Start with two independent columns $a_1,a_2$. Normalize $a_1$ to obtain $q_1$. Subtract from $a_2$ the component in direction $q_1$, then normalize the remainder to obtain $q_2$. Collect the orthonormal columns into $Q$; the coefficients become an upper-triangular matrix $R$ so that $A=QR$.

When computing on nearly dependent vectors, prefer established QR routines or modified Gram–Schmidt. A vanishing residual must not be divided by its length.


## Verify the calculations with Python

The numerical examples use NumPy. Each block is self-contained so you can run it independently. If a library is still loading in the website runner, try the same code in Jupyter or Colab.

```python
import numpy as np
a = np.array([1., 1.])
b = np.array([3., 1.])
p = a * (a @ b) / (a @ a)
r = b - p
print("projection", p, "residual", r, "dot", a @ r)
A = np.array([[1., 1.], [0., 1.], [0., 0.]])
Q, R = np.linalg.qr(A, mode="reduced")
print("QR reconstructs A:", np.allclose(Q @ R, A))
print("Q is orthonormal:", np.allclose(Q.T @ Q, np.eye(2)))
```

## Practice questions

I recommend answering these questions before opening the solutions. A small calculation is more useful than memorizing a long definition.

1. What is the dot product between a and the projection residual?
2. Why are columns of Q useful?
3. Which formula gives a rank-one inverse update?

### Answers

1. Zero.
2. They form an orthonormal basis.
3. Sherman–Morrison, when its denominator is nonzero.

## Common mistakes

- Projection onto a line needs a nonzero direction vector.
- A rectangular thin Q satisfies QᵀQ=I but usually QQᵀ is a projection, not full identity.
- QR and Gram–Schmidt can have numerical issues for nearly dependent columns.

## What I want you to remember

A projection splits a vector into an in-subspace part and a perpendicular residual. QR turns independent columns into an orthonormal basis and manageable triangular coefficients.
