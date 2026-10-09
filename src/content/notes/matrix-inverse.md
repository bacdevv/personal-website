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

I will treat the inverse as an operation that **undoes a transformation**. I will compare hand formulas, Gauss–Jordan elimination, one-sided inverses, and the pseudoinverse—without confusing their purposes.

## Learning goals

- Know when an ordinary inverse exists and verify it by multiplication.
- Compare the 2×2 formula, cofactor method, and row reduction.
- Choose **solve** or **pseudoinverse** when those fit the problem better.

## Visual intuition

![A mathematical visualization for matrix inverse.](/images/linear-algebra/course/matrix-inverse.svg)

<section class="course-interactive" data-course-demo="inverse" aria-label="Interactive mathematical illustration"></section>

The diagram updates independently of the Python runner. It shows one small example; the lessons below explain the general rule.

## Part A — Meaning and inverse formulas

### 95. Matrix inverse: Concept and applications

**Main idea.** An inverse reverses a square transformation. Only full-rank square matrices have a two-sided inverse.

$$
A^{-1}A=AA^{-1}=I
$$

**Worked example.** For $A=\operatorname{diag}(2,4)$, the inverse is $\operatorname{diag}(1/2,1/4)$: first transform, then undo the scaling. If a diagonal entry is zero, the lost direction cannot be recovered.

**Check yourself:** Does every square matrix have an inverse?

<details><summary>Answer</summary>

No; only full-rank square matrices do.

</details>

### 96. Computing the inverse in code

**Main idea.** Numerical software computes inverses with stable factorizations rather than manually applying a large symbolic formula. Verify by multiplying back.

$$
AA^{-1}\approx I
$$

**Worked example.** Numerically check $A=\begin{bmatrix}2&1\\1&1\end{bmatrix}$ and its computed inverse by measuring $\lVert AA^{-1}-I\rVert$. Floating-point products are approximately, not necessarily exactly, identity.

**Check yourself:** When solving Ax=b, should we usually compute inv(A) @ b?

<details><summary>Answer</summary>

Prefer a direct solve such as numpy.linalg.solve(A,b).

</details>

### 97. Inverse of a 2x2 matrix

**Main idea.** The 2-by-2 inverse swaps diagonal entries, changes the off-diagonal signs, and divides by the determinant.

$$
\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1}=\frac1{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}
$$

**Worked example.** For $A=\begin{bmatrix}2&1\\1&1\end{bmatrix}$, determinant is $1$. The inverse is $\begin{bmatrix}1&-1\\-1&2\end{bmatrix}$. Multiply both ways to verify identity.

**Check yourself:** What fails when ad-bc=0?

<details><summary>Answer</summary>

The inverse formula requires division by zero; the matrix is singular.

</details>

### 98. The MCA algorithm to compute the inverse

**Main idea.** The minors-cofactors-adjugate method builds an inverse from determinants of smaller matrices. It is best for understanding, not large numeric computation.

$$
A^{-1}=\frac{\operatorname{adj}(A)}{\det(A)}
$$

**Worked example.** For a $3\times3$ matrix, the minors form a new grid. Apply checkerboard cofactor signs, transpose the cofactor matrix, then divide by the determinant. This is the adjugate construction.

**Check yourself:** Why is adjugate generally poor for large numerical matrices?

<details><summary>Answer</summary>

It uses many determinants and is less efficient and stable than factorization methods.

</details>

## Part B — Algorithms and one-sided inverses

### 99. Code challenge: Implement the MCA algorithm!!

**Main idea.** Implement cofactor signs and the adjugate carefully. Check both AA inverse and A inverse A against identity.

$$
C_{ij}=(-1)^{i+j}M_{ij}
$$

**Worked example.** Test the minor/cofactor code on $I_3$ first: all diagonal cofactors are $1$, all off-diagonal ones are $0$. Then test on a nonsymmetric matrix and verify the inverse numerically.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np

def inverse_by_cofactors(A):
    A = np.array(A, dtype=float)
    n = A.shape[0]
    determinant = np.linalg.det(A)
    if np.isclose(determinant, 0): raise ValueError('singular matrix')
    cof = np.zeros_like(A)
    for i in range(n):
        for j in range(n):
            minor = np.delete(np.delete(A, i, axis=0), j, axis=1)
            cof[i, j] = (-1) ** (i+j) * np.linalg.det(minor)
    return cof.T / determinant

A = np.array([[2., 0., 1.], [1., 1., 0.], [0., 1., 2.]])
X = inverse_by_cofactors(A)
print(X)
assert np.allclose(A @ X, np.eye(3))
```

**Check yourself:** Why must the cofactor matrix be transposed?

<details><summary>Answer</summary>

The adjugate is the transpose of the cofactor matrix.

</details>

### 100. Computing the inverse via row reduction

**Main idea.** Augment the matrix with identity, then row-reduce the left side to identity. The right side becomes the inverse.

$$
[A\mid I]\;\longrightarrow\;[I\mid A^{-1}]
$$

**Worked example.** Start with $[\,\begin{smallmatrix}2&1\\1&1\end{smallmatrix}\mid I_2\,]$. After row reduction the left becomes $I_2$, while the right becomes $\begin{bmatrix}1&-1\\-1&2\end{bmatrix}$.

**Check yourself:** What if the left side cannot be reduced to I?

<details><summary>Answer</summary>

A is singular and has no ordinary inverse.

</details>

### 101. Code challenge: inverse of a diagonal matrix

**Main idea.** A diagonal matrix is inverted entry by entry along its diagonal, provided every diagonal value is nonzero.

$$
\operatorname{diag}(d_i)^{-1}=\operatorname{diag}(1/d_i)
$$

**Worked example.** For $D=\operatorname{diag}(2,-4,5)$, $D^{-1}=\operatorname{diag}(1/2,-1/4,1/5)$. Off-diagonal zeros stay zero.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
D = np.diag([2., -4., 5.])
Dinv = np.diag(1 / np.diag(D))
print(Dinv)
assert np.allclose(D @ Dinv, np.eye(3))
```

**Check yourself:** Is a diagonal matrix invertible when any diagonal entry is zero?

<details><summary>Answer</summary>

No.

</details>

### 102. Left inverse and right inverse

**Main idea.** For a tall full-column-rank matrix, a left inverse can recover its input. A wide full-row-rank matrix can have a right inverse.

$$
(A^TA)^{-1}A^T A=I
$$

**Worked example.** For $A=\begin{bmatrix}1\\2\end{bmatrix}$, a left inverse is $L=\begin{bmatrix}1/5&2/5\end{bmatrix}$ because $LA=[1]$. In contrast $AL$ is a 2×2 projection, not $I_2$.

**Check yourself:** What rank must a tall matrix have for a left inverse?

<details><summary>Answer</summary>

Full column rank.

</details>

### 103. One-sided inverses in code

**Main idea.** One-sided inverses are shape-dependent and are not generally equal. Test multiplication order and matrix dimensions.

$$
AA^{\mathrm{right}}=I\quad\text{or}\quad A^{\mathrm{left}}A=I
$$

**Worked example.** For the wide matrix $A=\begin{bmatrix}1&2\end{bmatrix}$, the column $R=(1/5,2/5)^T$ satisfies $AR=1$. But $RA$ is not the 2×2 identity.

**Check yourself:** Does a rectangular matrix have a two-sided inverse?

<details><summary>Answer</summary>

No, not in the usual sense.

</details>

## Part C — Uniqueness and the pseudoinverse

### 104. Proof: the inverse is unique

**Main idea.** If a square matrix has a two-sided inverse, that inverse is unique. Multiplying by either proposed inverse gives the same identity.

$$
B=A^{-1},\ C=A^{-1}\Rightarrow B=C
$$

**Worked example.** If $B$ and $C$ are both inverses of $A$, then $B=BI=B(AC)=(BA)C=IC=C$. Associativity gives uniqueness in three short steps.

**Check yourself:** What property makes these parentheses movable?

<details><summary>Answer</summary>

Associativity of matrix multiplication.

</details>

### 105. Pseudo-inverse, part 1

**Main idea.** The Moore-Penrose pseudoinverse extends inversion to rectangular or singular matrices using SVD.

$$
A^+=V\Sigma^+U^T
$$

**Worked example.** For $A=\operatorname{diag}(2,0)$, the pseudoinverse is $A^+=\operatorname{diag}(1/2,0)$. Only nonzero singular values are reciprocated; zero stays zero.

**Check yourself:** Can pseudoinverse recover information destroyed by a zero singular value?

<details><summary>Answer</summary>

No. It returns a minimum-norm least-squares solution.

</details>

### 106. Code challenge: pseudoinverse of invertible matrices

**Main idea.** For an invertible square matrix, the pseudoinverse equals the ordinary inverse. Verify numerically.

$$
A^+=A^{-1}\quad\text{if }A\text{ is invertible}
$$

**Worked example.** For nonsingular $A=\begin{bmatrix}2&1\\1&1\end{bmatrix}$, compare `np.linalg.pinv(A)` with `np.linalg.inv(A)`. Both approach the same array within floating-point error.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np
A = np.array([[2., 1.], [1., 1.]])
print('inverse:', np.linalg.inv(A))
print('pseudoinverse:', np.linalg.pinv(A))
assert np.allclose(np.linalg.inv(A), np.linalg.pinv(A))
```

**Check yourself:** When might pinv differ from inv?

<details><summary>Answer</summary>

For singular or rectangular matrices, or when tolerance truncates tiny singular values.

</details>

## Detailed worked example

## Inverse as an undo operation

If $A=\operatorname{diag}(2,3)$, then $A$ stretches the two coordinate directions by $2$ and $3$. Its inverse $A^{-1}=\operatorname{diag}(1/2,1/3)$ undoes those changes. If a direction is sent to zero, no inverse can recover what was lost.

For $A=\begin{bmatrix}2&1\\1&1\end{bmatrix}$, $\det(A)=1$ and $A^{-1}=\begin{bmatrix}1&-1\\-1&2\end{bmatrix}$. Check both $AA^{-1}=I$ and $A^{-1}A=I$. Multiplication order matters outside this inverse identity.

## Three different tasks: inverse, solve, pseudoinverse

- **Inverse:** calculate $A^{-1}$, only for a square nonsingular matrix.
- **Solve:** find $x$ satisfying $Ax=b$. Numerically, prefer a direct solver to forming the inverse.
- **Pseudoinverse:** find a least-squares or minimum-norm solution when $A$ is rectangular or singular.

A one-sided inverse for a rectangular full-rank matrix has just one identity relation. Its opposite-order product is normally a projection rather than an identity.


## Verify the calculations with Python

The numerical examples use NumPy. Each block is self-contained so you can run it independently. If a library is still loading in the website runner, try the same code in Jupyter or Colab.

```python
import numpy as np
A = np.array([[2., 1.], [1., 1.]])
b = np.array([5., 3.])
inv = np.linalg.inv(A)
print("inverse:", inv)
print("identity error:", np.linalg.norm(A @ inv - np.eye(2)))
print("solve:", np.linalg.solve(A, b))
R = np.array([[1., 2., 3.], [2., 4., 6.]])
print("rank-deficient pseudoinverse:", np.linalg.pinv(R))
print("A A+ A ≈ A:", np.allclose(R @ np.linalg.pinv(R) @ R, R))
```

## Practice questions

I recommend answering these questions before opening the solutions. A small calculation is more useful than memorizing a long definition.

1. What numerical approach is preferred to x=inv(A)@b?
2. Can a 3×2 matrix have an ordinary two-sided inverse?
3. What happens to inversion if det(A)=0?
4. When does pinv(A)=inv(A)?

### Answers

1. Use np.linalg.solve(A,b).
2. No.
3. No ordinary inverse exists.
4. For an invertible square A (modulo numeric tolerance).

## Common mistakes

- An inverse is not computed by dividing every matrix entry by the original entry.
- Do not swap left and right multiplication when manipulating matrix equations.
- The pseudoinverse is not a guarantee of unique exact solutions.

## What I want you to remember

An ordinary inverse exactly reverses a nonsingular square map. For solving $Ax=b$, a linear solver is normally safer and simpler than forming $A^{-1}$.
