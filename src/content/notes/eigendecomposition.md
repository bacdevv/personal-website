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

I will look for vectors whose direction a square matrix **does not rotate**. Those eigen-directions turn a difficult transformation into simple scalar multiplication.

## Learning goals

- Find eigenvalues and eigenvectors of small square matrices.
- Identify when diagonalization fails and why symmetry simplifies the problem.
- Reconstruct matrices from eigenvectors, eigenvalues, and rank-one layers.

## Visual intuition

![A mathematical visualization for eigendecomposition.](/images/linear-algebra/course/eigendecomposition.svg)

<section class="course-interactive" data-course-demo="eigen" aria-label="Interactive mathematical illustration"></section>

The diagram updates independently of the Python runner. It shows one small example; the lessons below explain the general rule.

## Part A — Find eigenvalues and eigenvectors

### 128. What are eigenvalues and eigenvectors?

**Main idea.** An eigenvector keeps its line of direction under a square linear map; its eigenvalue gives the scale, possibly reversing direction.

$$
Av=\lambda v,\quad v\ne 0
$$

**Worked example.** For $A=\operatorname{diag}(3,-2)$, $(1,0)^T$ is an eigenvector with eigenvalue $3$, while $(0,1)^T$ has eigenvalue $-2$. The latter vector reverses direction.

**Check yourself:** Is the zero vector an eigenvector?

<details><summary>Answer</summary>

No, eigenvectors are nonzero by definition.

</details>

### 129. Finding eigenvalues

**Main idea.** An eigenvalue makes A minus lambda I singular. Solve the characteristic equation for a small matrix.

$$
\det(A-\lambda I)=0
$$

**Worked example.** For $A=\operatorname{diag}(2,5)$, $\det(A-\lambda I)=(2-\lambda)(5-\lambda)$. The roots $2$ and $5$ are eigenvalues.

**Check yourself:** Why must det(A−lambda I)=0?

<details><summary>Answer</summary>

Because an eigenvector requires a nontrivial null vector of A−lambda I.

</details>

### 130. Shortcut for eigenvalues of a 2x2 matrix

**Main idea.** For 2-by-2 matrices, the characteristic polynomial depends on trace and determinant.

$$
\lambda^2-\operatorname{tr}(A)\lambda+\det(A)=0
$$

**Worked example.** For $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$, trace is $4$, determinant $3$, and $\lambda^2-4\lambda+3=0$ gives $\lambda=1,3$.

**Check yourself:** Can an eigenvalue of a real 2×2 matrix be complex?

<details><summary>Answer</summary>

Yes, if the characteristic polynomial has negative discriminant.

</details>

### 131. Code challenge: eigenvalues of diagonal and triangular matrices

**Main idea.** The eigenvalues of triangular and diagonal matrices are their diagonal entries, including repeats.

$$
\lambda_i(A)=a_{ii}\quad\text{for triangular }A
$$

**Worked example.** The upper-triangular matrix $\begin{bmatrix}2&7\\0&-1\end{bmatrix}$ has eigenvalues $2$ and $-1$, even though its off-diagonal entry is large.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.array([[2., 9., -2.], [0., -1., 7.], [0., 0., 3.]])
print('eigenvalues:', np.linalg.eigvals(A))
print('diagonal:', np.diag(A))
assert np.allclose(np.sort(np.linalg.eigvals(A)), np.sort(np.diag(A)))
```

**Check yourself:** Do eigenvalues of a triangular matrix depend on off-diagonal entries?

<details><summary>Answer</summary>

No; they are the diagonal entries.

</details>

### 132. Code challenge: eigenvalues of random matrices

**Main idea.** Random matrices may have complex eigenvalues. A real matrix need not have only real eigenvalues.

$$
\lambda\in\mathbb C\quad\text{may occur even if }A\in\mathbb R^{n\times n}
$$

**Worked example.** The real rotation $\begin{bmatrix}0&-1\\1&0\end{bmatrix}$ has eigenvalues $i$ and $-i$: no nonzero real vector remains on its original line after a quarter turn.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.array([[0., -1.], [1., 0.]])
values, vectors = np.linalg.eig(A)
print('eigenvalues:', values)
print('residual:', np.linalg.norm(A @ vectors - vectors @ np.diag(values)))
```

**Check yourself:** How do complex eigenvalues of a real matrix occur?

<details><summary>Answer</summary>

In conjugate pairs.

</details>

### 133. Finding eigenvectors

**Main idea.** For each eigenvalue, find a nonzero vector in the null space of A minus lambda I.

$$
(A-\lambda I)v=0
$$

**Worked example.** For $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ and $\lambda=3$, solve $(A-3I)v=0$ to obtain $v=(1,1)^T$ up to nonzero scale.

**Check yourself:** Are eigenvectors uniquely scaled?

<details><summary>Answer</summary>

No. Any nonzero multiple of an eigenvector is also an eigenvector.

</details>

### 134. Eigendecomposition by hand: two examples

**Main idea.** Work out simple diagonal or symmetric 2-by-2 examples by hand before trusting a numeric eigensolver.

$$
\begin{bmatrix}2&0\\0&3\end{bmatrix}\!\begin{bmatrix}1\\0\end{bmatrix}=2\begin{bmatrix}1\\0\end{bmatrix}
$$

**Worked example.** Take $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$. Check $A(1,1)^T=3(1,1)^T$ and $A(1,-1)^T=(1,-1)^T$ directly.

**Check yourself:** What should you verify after solving for an eigenpair?

<details><summary>Answer</summary>

Check Av≈lambda v.

</details>

## Part B — Diagonalize and understand multiplicity

### 135. Diagonalization

**Main idea.** A matrix is diagonalizable when it has a basis of eigenvectors. The change of basis exposes scaling along eigen-directions.

$$
A=V\Lambda V^{-1}
$$

**Worked example.** For symmetric $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$, the normalized eigenvector matrix is $V=\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}$ and $\Lambda=\operatorname{diag}(3,1)$. Then $A=V\Lambda V^T$.

**Check yourself:** Can every square matrix be diagonalized?

<details><summary>Answer</summary>

No. Some matrices lack enough independent eigenvectors.

</details>

### 136. Matrix powers via diagonalization

**Main idea.** If a matrix is diagonalizable, raise eigenvalues to a power instead of repeatedly multiplying full matrices.

$$
A^k=V\Lambda^kV^{-1}
$$

**Worked example.** Using the same symmetric matrix, $A^{10}=V\operatorname{diag}(3^{10},1)V^T$. Only the diagonal eigenvalues are raised to the tenth power.

**Check yourself:** Why is diagonalization useful for large integer powers?

<details><summary>Answer</summary>

Powers of a diagonal matrix are easy to compute.

</details>

### 137. Code challenge: eigendecomposition of matrix differences

**Main idea.** Eigendecomposition of A minus B cannot generally be recovered by simply subtracting their individual eigenvalues. Check with a counterexample.

$$
\lambda_i(A-B)\ne\lambda_i(A)-\lambda_i(B)\quad\text{in general}
$$

**Worked example.** Let $A=\operatorname{diag}(2,0)$ and $B=\begin{bmatrix}0&1\\1&0\end{bmatrix}$. Eigenvalues of $A-B$ are not formed by simply pairing and subtracting the eigenvalues of A and B.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.diag([2., 0.])
B = np.array([[0., 1.], [1., 0.]])
print('eig(A-B):', np.linalg.eigvals(A-B))
print('eig(A):', np.linalg.eigvals(A))
print('eig(B):', np.linalg.eigvals(B))
# Eigenvalues cannot generally be subtracted one by one.
```

**Check yourself:** When can eigenvalues of a sum be easy to combine?

<details><summary>Answer</summary>

Under stronger conditions, such as simultaneously diagonalizable commuting matrices with aligned eigenvectors.

</details>

### 138. Eigenvectors of distinct eigenvalues

**Main idea.** Eigenvectors associated with distinct eigenvalues are linearly independent. For symmetric matrices, they are orthogonal.

$$
\lambda_i\ne\lambda_j\Rightarrow v_i,v_j\text{ independent}
$$

**Worked example.** For the symmetric $\begin{bmatrix}2&1\\1&2\end{bmatrix}$, eigenvectors $(1,1)$ and $(1,-1)$ correspond to distinct eigenvalues; their dot product is $0$.

**Check yourself:** Are distinct-eigenvalue eigenvectors orthogonal for all matrices?

<details><summary>Answer</summary>

No; independence is general, orthogonality requires additional conditions such as symmetry.

</details>

### 139. Eigenvectors of repeated eigenvalues

**Main idea.** A repeated eigenvalue may have one or several independent eigenvectors. The number matters for diagonalizability.

$$
\dim\ker(A-\lambda I)\le\text{algebraic multiplicity}
$$

**Worked example.** The identity $I_2$ has eigenvalue $1$ with algebraic multiplicity 2 and *two* independent eigenvectors. A Jordan block $\begin{bmatrix}1&1\\0&1\end{bmatrix}$ has the same repeated eigenvalue but only one independent eigenvector.

**Check yourself:** Does a repeated eigenvalue guarantee diagonalizability?

<details><summary>Answer</summary>

No; check geometric multiplicity.

</details>

### 140. Eigendecomposition of symmetric matrices

**Main idea.** Real symmetric matrices have real eigenvalues and an orthonormal eigenbasis.

$$
A=Q\Lambda Q^T\quad(A=A^T)
$$

**Worked example.** A real symmetric matrix can be written $A=Q\Lambda Q^T$ with orthogonal Q. Every eigenvalue is real, and an orthonormal eigenbasis exists even with repeated eigenvalues.

**Check yourself:** Why is Q^{-1}=Q^T?

<details><summary>Answer</summary>

Q has orthonormal columns.

</details>

## Part C — Eigenlayers, symmetry and generalized eigenvectors

### 141. Eigenlayers of a matrix

**Main idea.** Each eigenpair contributes one rank-one layer to the matrix reconstruction when eigenvectors form an orthonormal basis.

$$
A=\sum_i\lambda_i q_i q_i^T
$$

**Worked example.** With eigenpairs $(3,(1,1)/\sqrt2)$ and $(1,(1,-1)/\sqrt2)$, reconstruct $A=3v_1v_1^T+1v_2v_2^T$ as a sum of weighted rank-one layers.

**Check yourself:** What is the rank of a nonzero outer product vvᵀ?

<details><summary>Answer</summary>

One.

</details>

### 142. Code challenge: reconstruct a matrix from eigenlayers

**Main idea.** Reconstruct a matrix by adding its eigenlayers, then compare the numerical reconstruction error.

$$
\lVert A-\sum_i\lambda_i q_iq_i^T\rVert_F\approx0
$$

**Worked example.** Calculate each layer $\lambda_i v_i v_i^T$ numerically, sum them and compare the result to A. For a symmetric example, the reconstruction error should be close to zero.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.array([[2., 1.], [1., 2.]])
values, Q = np.linalg.eigh(A)
layers = [values[i] * np.outer(Q[:, i], Q[:, i]) for i in range(2)]
print('layers:', layers)
print('reconstructed:', sum(layers))
assert np.allclose(sum(layers), A)
```

**Check yourself:** What is a convenient reconstruction-error metric?

<details><summary>Answer</summary>

The Frobenius norm of A−QΛQᵀ.

</details>

### 143. Eigendecomposition of singular matrices

**Main idea.** A singular square matrix has at least one zero eigenvalue. Singular does not mean every eigenvalue is zero.

$$
\det(A)=0\Rightarrow 0\text{ is an eigenvalue}
$$

**Worked example.** For $A=\operatorname{diag}(3,0)$, zero is an eigenvalue with eigenvector $(0,1)^T$. Singularity does not prevent finding eigenpairs.

**Check yourself:** Which eigenvalue signals that a square matrix is singular?

<details><summary>Answer</summary>

Zero.

</details>

### 144. Code challenge: trace and determinant, eigenvalues sum and product

**Main idea.** For a square matrix, eigenvalues sum to trace and multiply to determinant, counting multiplicities.

$$
\sum_i\lambda_i=\operatorname{tr}(A),\quad\prod_i\lambda_i=\det(A)
$$

**Worked example.** The matrix $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ has eigenvalues $3$ and $1$. Their sum $4$ equals trace, and product $3$ equals determinant.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.array([[2., 1.], [1., 2.]])
eig = np.linalg.eigvals(A)
print('sum eigenvalues = trace:', sum(eig), np.trace(A))
print('product eigenvalues = det:', np.prod(eig), np.linalg.det(A))
assert np.allclose(sum(eig), np.trace(A))
```

**Check yourself:** Do eigenvalues count multiplicity in these identities?

<details><summary>Answer</summary>

Yes, each algebraic multiplicity is included.

</details>

### 145. Generalized eigendecomposition

**Main idea.** Generalized eigenvectors compare two matrix-defined transformations; symmetric positive-definite pairs are especially well behaved.

$$
Av=\lambda Bv
$$

**Worked example.** The generalized problem $Av=\lambda Bv$ describes directions measured relative to B. When $B$ is invertible this is an ordinary eigenproblem for $B^{-1}A$, though numerical solvers need not form that inverse.

**Check yourself:** What extra assumption gives a symmetric-definite GED?

<details><summary>Answer</summary>

Typically A symmetric and B symmetric positive definite.

</details>

### 146. Code challenge: GED in small and large matrices

**Main idea.** Test generalized eigenpairs by their residuals, not by componentwise comparison of eigenvectors.

$$
\lVert Av-\lambda Bv\rVert_2\approx0
$$

**Worked example.** For diagonal $A=\operatorname{diag}(2,6)$ and $B=\operatorname{diag}(1,2)$, generalized eigenvalues are $2$ and $3$. Check $Av_i=\lambda_i Bv_i$.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.diag([2., 6.]); B = np.diag([1., 2.])
# The simple example allows a diagonal generalized eigenproblem.
values = np.diag(A) / np.diag(B)
print('GED eigenvalues:', values)
for i in range(2):
    v = np.eye(2)[:, i]
    assert np.allclose(A @ v, values[i] * B @ v)
```

**Check yourself:** What should we test instead of the exact eigenvector sign?

<details><summary>Answer</summary>

The residual norm ||Av−lambda Bv||, since signs/scales may vary.

</details>

## Detailed worked example

## Eigenvectors are invariant directions

Take the real symmetric matrix $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$. Direct multiplication shows

$$
A\begin{bmatrix}1\\1\end{bmatrix}=3\begin{bmatrix}1\\1\end{bmatrix},\qquad
A\begin{bmatrix}1\\-1\end{bmatrix}=1\begin{bmatrix}1\\-1\end{bmatrix}.
$$

These vectors keep their lines of direction: one stretches threefold and the other stays the same length. Normalize both and place them into the orthogonal matrix $Q$. Then $A=Q\operatorname{diag}(3,1)Q^T$.

## Repeated eigenvalues require care

$I_2$ has repeated eigenvalue $1$ but two independent eigenvectors, so it is diagonalizable. The Jordan block $\begin{bmatrix}1&1\\0&1\end{bmatrix}$ also has a repeated eigenvalue $1$ but only one independent eigenvector. Thus repeated eigenvalues do not automatically provide a full eigenbasis.

For a real symmetric matrix, an orthonormal eigenbasis always exists and its eigenvalues are real. This makes its spectral decomposition especially useful in data analysis.


## Verify the calculations with Python

The numerical examples use NumPy. Each block is self-contained so you can run it independently. If a library is still loading in the website runner, try the same code in Jupyter or Colab.

```python
import numpy as np
A = np.array([[2., 1.], [1., 2.]])
values, Q = np.linalg.eigh(A)  # symmetric case
print("eigenvalues", values)
print("orthonormal", np.allclose(Q.T @ Q, np.eye(2)))
print("reconstruct", np.allclose(Q @ np.diag(values) @ Q.T, A))
print("eigenpair residual", np.linalg.norm(A @ Q - Q @ np.diag(values)))
J = np.array([[1., 1.], [0., 1.]])
print("Jordan eigenvalues", np.linalg.eigvals(J))
```

## Practice questions

I recommend answering these questions before opening the solutions. A small calculation is more useful than memorizing a long definition.

1. Can the zero vector be an eigenvector?
2. Why does a 2×2 real rotation through 90 degrees have no real eigenvector?
3. What guarantees orthogonal eigenvectors?
4. Do diagonalization formulas apply to all square matrices?

### Answers

1. No.
2. No real line is preserved.
3. A real symmetric matrix admits an orthonormal eigenbasis.
4. No; only those with a full eigenvector basis.

## Common mistakes

- Do not treat eigensolver output order or eigenvector signs as fixed.
- Distinct eigenvalues imply eigenvector independence, not necessarily orthogonality for a general matrix.
- Complex eigenvalues are possible for real nonsymmetric matrices.

## What I want you to remember

An eigenpair satisfies $Av=\lambda v$ for $v\ne0$. A full eigenvector basis permits diagonalization; real symmetric matrices have an orthonormal one.
