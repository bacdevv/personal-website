---
title: "Matrix Rank — Linear Algebra, Chapter 4"
description: "A visual, hands-on guide to matrix rank: independent information, row reduction, numerical tolerance, rank inequalities, Gram matrices, shifting, and span tests."
subject: Linear Algebra
date: "2026-10-09T14:00:00Z"
draft: false
tags:
  - linear-algebra
  - matrix-rank
  - matrices
  - mathematics
---

**About this chapter.** This is **Chapter 4: Matrix Rank**, covering lessons **62–71** of the supplied course transcript. It continues [Vectors](/notes/vectors/), [Matrices](/notes/matrices/), and [Matrix Multiplication](/notes/matrix-multiplication/). The explanations follow the source's order, use beginner-friendly English, and include reproducible NumPy examples and visual exercises. Lesson 71 is a study-habits reflection rather than a mathematics lesson; it is retained so the transcript is covered completely.

**How to use this chapter:** Start with the SVG figure for each lesson, predict the answer, then open **Live demo** on the right and choose the matching lesson number. Its calculations run in lightweight JavaScript, not Pyodide. Python examples are independent: run one block at a time and do not assume variables survive between blocks.

**Learning outcomes:** By the end, you should be able to explain what rank measures, find rank with three methods, predict rank bounds, construct reduced-rank matrices, understand numerical rank, and check whether a vector belongs to a span.

| Symbol | Meaning |
|:--|:--|
| $A\in\mathbb R^{m\times n}$ | A real matrix with $m$ rows and $n$ columns |
| $\operatorname{rank}(A)$ | Number of independent rows (equivalently, columns) |
| $A^T$ | Transpose of $A$ |
| $I$ | Identity matrix of the appropriate size |
| $\lambda$ | Scalar, often a shift applied to the diagonal |
| $\operatorname{span}(S)$ | Every linear combination of the columns of $S$ |

![A roadmap from matrix dimensions to rank, dependencies, numerical thresholds, and span tests.](/images/linear-algebra/matrix-rank/00-roadmap.svg)

---

## Part A — Understanding and computing rank

### 62. Rank: concepts, terms, and applications

A matrix's **shape** tells you how many rows and columns it has. Its **rank** tells you how many independent directions of information those rows or columns actually carry. These are different things.

For example,

$$
A=\begin{bmatrix}1&2&3\\2&4&6\end{bmatrix}\in\mathbb R^{2\times3}.
$$

The second row is twice the first. Although the matrix contains six entries, there is only **one independent row**, so $\operatorname{rank}(A)=1$.

There are **six core facts** in this lecture:

1. Rank is one non-negative **integer** associated with the whole matrix, not one rank for rows and a different rank for columns.
2. For an $m\times n$ matrix, $0\le\operatorname{rank}(A)\le\min(m,n)$.
3. The maximum number of independent rows is **equal** to the maximum number of independent columns.
4. A matrix that reaches $\min(m,n)$ is **full rank**. A tall full-rank matrix is **full column rank**; a wide full-rank matrix is **full row rank**. Below the maximum, it is **rank deficient** (or reduced rank).
5. Geometrically, rank is the dimension of the span of the matrix's columns: zero for the zero matrix, one for a line, two for a plane, and so on.
6. Equivalently, rank is the largest number of linearly independent columns **or** rows.

> A **square** $n\times n$ matrix is invertible exactly when its rank is $n$. A rectangular full-rank matrix is not itself an invertible square matrix.

A matrix with four columns can still have rank two: the additional columns may lie in the same 2D plane. This matters in **PCA**, data analysis, and compression, because redundant columns do not add new directions of variation.

![Three matrices demonstrate ranks zero, one, and two despite different numbers of entries.](/images/linear-algebra/matrix-rank/62-rank-meaning.svg)

**Try it in Live demo → 62.** Switch among the zero, line, plane, and full-rank examples. Notice how the dimensions of the matrix stay fixed while its rank changes.

```python
import numpy as np

A = np.array([[1, 2, 3], [2, 4, 6]], dtype=float)
print("shape:", A.shape)             # (2, 3)
print("maximum rank:", min(A.shape)) # 2
print("actual rank:", np.linalg.matrix_rank(A))  # 1
```

**Check yourself:** A $5\times3$ matrix has two duplicate columns, and its remaining independent columns span two directions. What is its rank? **Answer: 2**. The *number* of columns (3) is not the number of independent columns (2).

### 63. Computing rank: theory and practice

The transcript presents several ways to arrive at the **same** mathematical rank.

**Method 1 — Inspect dependencies.** For small integer matrices, ask whether one row or column can be expressed as a linear combination of the others. Here $[2,4]=2[1,2]$, so the second row is redundant.

**Method 2 — Row reduction.** Use elementary row operations to form an echelon matrix and count **nonzero pivot rows**. For example,

$$
\begin{bmatrix}1&2\\2&4\end{bmatrix}
\xrightarrow{R_2\leftarrow R_2-2R_1}
\begin{bmatrix}1&2\\0&0\end{bmatrix}.
$$

Exactly one pivot remains; the rank is one.

**Method 3 — Singular value decomposition (SVD).** Count the nonzero singular values $\sigma_i$. In exact mathematics, $\operatorname{rank}(A)=\#\{i:\sigma_i>0\}$. In floating-point computation, software uses a **tolerance** so tiny roundoff errors do not count as new dimensions.

**Method 4 — Eigenvalues, with an important condition.** The lecture also discusses counting nonzero eigenvalues. That is a valid way to obtain rank for **symmetric matrices** (such as $A^TA$); it is **not** a general rule for arbitrary nonsymmetric matrices. For example, $\begin{bmatrix}0&1\\0&0\end{bmatrix}$ has rank one but both eigenvalues equal zero. SVD is the reliable general-purpose approach.

![Counting pivots and singular values to understand numerical rank.](/images/linear-algebra/matrix-rank/63-computing-rank.svg)

**Numerical rank versus exact rank.** Consider $D=\operatorname{diag}(3,1,10^{-8})$. Mathematically its rank is three. If a program treats singular values at or below $10^{-6}$ as zero, it reports numerical rank two. This is intentional when the smallest direction may be noise.

```python
import numpy as np

D = np.diag([3., 1., 1e-8])
singular_values = np.linalg.svd(D, compute_uv=False)
for tolerance in [1e-4, 1e-6, 1e-10]:
    print("tol", tolerance, "rank", np.sum(singular_values > tolerance))

R = np.array([[1., 2.], [2., 4.]])
print("SVD rank:", np.linalg.matrix_rank(R))
```

**Try Live demo → 63.** Move the tolerance control, and watch the smallest singular value appear or disappear from the count. This illustrates the transcript's satellite sensor/noise example. A rank estimate on measured data is not automatically the exact, noise-free rank.

**Check yourself:** Why could $10^{-13}$ be counted as zero? **Answer:** The threshold represents numerical uncertainty; the computer cannot reliably distinguish every tiny value from roundoff or noise.

---

## Part B — Rank under operations

### 64. Rank of added and multiplied matrices

Suppose $A$ and $B$ have the same shape so that $A+B$ is defined. The rank of their sum is bounded by their combined ranks:

$$
\boxed{\operatorname{rank}(A+B)\le
\operatorname{rank}(A)+\operatorname{rank}(B)}.
$$

Of course it also cannot exceed the number of rows or columns. A useful complete upper bound is

$$
\operatorname{rank}(A+B)\le\min\bigl(m,n,\operatorname{rank}(A)+\operatorname{rank}(B)\bigr).
$$

Adding two rank-one matrices **can** produce rank two. For example,

$$
A=\begin{bmatrix}1&0\\0&0\end{bmatrix},\quad
B=\begin{bmatrix}0&0\\0&1\end{bmatrix},\quad
A+B=I_2.
$$

Both inputs have rank one; the sum has rank two. But this is an **upper bound**, not a guarantee: if $B=-A$, the sum has rank zero.

For a matrix product $AB$ with compatible shapes, the rule is instead

$$
\boxed{\operatorname{rank}(AB)\le
\min\bigl(\operatorname{rank}(A),\operatorname{rank}(B)\bigr)}.
$$

Each output column is a combination of columns already supplied by $A$, and each output row is a combination of rows in $B$. Multiplication cannot create more independent directions than either factor has.

![Rank can increase under addition but never exceed either factor under multiplication.](/images/linear-algebra/matrix-rank/64-rank-bounds.svg)

```python
import numpy as np

A = np.array([[1, 0], [0, 0]])
B = np.array([[0, 0], [0, 1]])
for name, M in [("A", A), ("B", B), ("A+B", A+B), ("AB", A@B), ("A-A", A-A)]:
    print(name, "rank =", np.linalg.matrix_rank(M))
```

**Try Live demo → 64.** Compare complementary matrices (sum increases rank) with cancelling matrices (sum drops to zero). **Predict before selecting!**

**Check yourself:** If $\operatorname{rank}(A)=2$ and $\operatorname{rank}(B)=3$, what is the largest possible $\operatorname{rank}(AB)$? **Answer: 2**, provided the matrix sizes allow the multiplication.

### 65. Code challenge: create a reduced-rank matrix by multiplication

Repeating rows or columns produces dependencies, but the transcript introduces a more flexible construction:

$$
X\in\mathbb R^{m\times r},\quad Y\in\mathbb R^{r\times n},
\qquad \boxed{A=XY\in\mathbb R^{m\times n}}.
$$

The product satisfies $\operatorname{rank}(A)\le r$. For generic random matrices **and** $r\le\min(m,n)$, it typically has rank **exactly** $r$. The rank bound alone does not prove equality for every pair of factors; some choices produce additional dependencies.

The specific challenge is to create a **10×10 matrix of rank 4**, then generalize to arbitrary $m,n,r$.

![Two thin factors produce a larger matrix whose rank cannot exceed the inner dimension.](/images/linear-algebra/matrix-rank/65-factorization.svg)

```python
import numpy as np

rng = np.random.default_rng(42)
m, n, r = 10, 10, 4
assert 0 <= r <= min(m, n)
X = rng.standard_normal((m, r))
Y = rng.standard_normal((r, n))
A = X @ Y
print("X:", X.shape, "Y:", Y.shape)
print("A:", A.shape, "rank:", np.linalg.matrix_rank(A))

# Try 8 x 47 with rank 3 by replacing m, n, r.
```

**Try Live demo → 65.** Change the inner dimension $r$. Observe that a four-by-four displayed result can have any rank from one to three without simply copying an entire row.

**Challenge:** Write a function `make_rank(m, n, r, seed=42)`; validate $0\le r\le\min(m,n)$ and print both `A.shape` and `np.linalg.matrix_rank(A)`.

### 66. Code challenge: scalar multiplication and rank

Does multiplying every entry of a matrix by the same number change the rank? It changes lengths and possibly signs, but not linear dependence—**except when the scalar is zero**.

$$
\boxed{\operatorname{rank}(\lambda A)=\operatorname{rank}(A)
\quad\text{for }\lambda\ne0},
\qquad \operatorname{rank}(0A)=0.
$$

Why? If one column is a combination of others, multiplying every column by the same nonzero scalar preserves that relationship. Multiplying by zero destroys all independent directions.

**Rank is not a linear operator.** In general,

$$\operatorname{rank}(\lambda A)\ne\lambda\operatorname{rank}(A).$$

For a rank-two matrix and $\lambda=3$, the left side is two while the right side is six.

![Scaling stretches or flips vectors without changing their span, except at zero.](/images/linear-algebra/matrix-rank/66-scalar-rank.svg)

```python
import numpy as np

F = np.array([[1., 0.], [0., 1.], [1., 1.]])   # rank 2
R = np.array([[1., 2.], [2., 4.], [3., 6.]])   # rank 1
for lam in [-3, 0, 0.5, 10**6]:
    print("lambda =", lam, "rank(F) =", np.linalg.matrix_rank(lam*F),
          "rank(R) =", np.linalg.matrix_rank(lam*R))
```

**Try Live demo → 66.** Drag $\lambda$ across zero. Rank jumps to zero **only at zero** in exact arithmetic. In floating-point software, extremely tiny nonzero scalars may also affect computed rank because of tolerance and underflow.

---

## Part C — Transposes, Gram matrices, and shifting

### 67. Rank of $A^TA$ and $AA^T$

This central lecture states that for **real** matrices,

$$
\boxed{\operatorname{rank}(A)=\operatorname{rank}(A^T)
=\operatorname{rank}(A^TA)=\operatorname{rank}(AA^T)}.
$$

For an $m\times n$ matrix, $A^TA$ is $n\times n$ and $AA^T$ is $m\times m$. Both are **symmetric**. They preserve the rank of $A$ even though their shapes differ.

**Why is it true?** The transcript gives three perspectives: column/row space, null space, and SVD. The null-space argument is especially compact:

$$
A^TAx=0\quad\Longrightarrow\quad
x^TA^TAx=\|Ax\|^2=0\quad\Longrightarrow\quad Ax=0.
$$

The reverse implication is immediate. Therefore $\ker(A^TA)=\ker(A)$; because both act on vectors in $\mathbb R^n$, they have the same rank. By transposing the argument, the same reasoning applies to $AA^T$.

Alternatively, if $A=U\Sigma V^T$, then $A^TA=V\Sigma^T\Sigma V^T$. Squaring nonzero singular values does not change how many are nonzero. This is an exact-arithmetic fact; computer tolerances can give surprising answers for badly conditioned matrices.

![A tall matrix becomes two symmetric square matrices of different sizes but the same rank.](/images/linear-algebra/matrix-rank/67-gram-rank.svg)

```python
import numpy as np

A = np.array([[1., 0.], [0., 1.], [1., 1.]])
for name, M in [("A", A), ("A.T", A.T),
                ("A.T @ A", A.T @ A), ("A @ A.T", A @ A.T)]:
    print(name, "shape:", M.shape, "rank:", np.linalg.matrix_rank(M))
```

A **tall, full-column-rank** matrix produces an invertible $A^TA$. A **wide, full-row-rank** matrix produces an invertible $AA^T$. That is why these Gram matrices appear in least squares and statistics.

**Try Live demo → 67.** Change between independent and dependent columns. Both Gram matrices always keep the same rank as their original matrix, despite having different shapes.

### 68. Code challenge: ranks of summed and multiplied Gram matrices

The transcript asks you to generate independent random $2\times5$ matrices $A$ and $B$, then compare

$$
P=(A^TA)(B^TB),\qquad S=A^TA+B^TB.
$$

Each Gram matrix is $5\times5$ but has rank at most two. By the earlier rules,

$$
\operatorname{rank}(P)\le2,\qquad
\operatorname{rank}(S)\le4.
$$

In a typical random example, the sum may reach rank four. The product **need not** have rank two. Its actual rank depends on the alignment of the two matrices' row spaces.

![Two rank-two Gram matrices can sum to rank four while their product has rank zero or two.](/images/linear-algebra/matrix-rank/68-gram-challenge.svg)

**Concrete geometric example:** Set

$$
A=\begin{bmatrix}1&0&0&0\\0&1&0&0\end{bmatrix},\quad
B=\begin{bmatrix}0&0&1&0\\0&0&0&1\end{bmatrix}.
$$

Their row spaces occupy different coordinate directions. Then $A^TA+B^TB=I_4$ has rank **4**, while $(A^TA)(B^TB)=0$ has rank **0**. If $B=A$, the sum and product both have rank **2**.

```python
import numpy as np

A = np.array([[1., 0., 0., 0.], [0., 1., 0., 0.]])
B = np.array([[0., 0., 1., 0.], [0., 0., 0., 1.]])
G1, G2 = A.T @ A, B.T @ B
print("rank G1, G2:", np.linalg.matrix_rank(G1), np.linalg.matrix_rank(G2))
print("rank sum:", np.linalg.matrix_rank(G1 + G2))
print("rank product:", np.linalg.matrix_rank(G1 @ G2))

# Optional: use independent 2x5 random matrices as in the transcript.
```

**Try Live demo → 68.** Switch between *orthogonal* and *aligned* row spaces. Both examples satisfy the inequalities, but the exact ranks differ. **Question:** Why does a rank inequality never promise equality?

### 69. Make a reduced-rank square matrix full rank by shifting

**Shifting** means adding a scaled identity matrix, changing diagonal entries and leaving off-diagonal entries alone:

$$
\boxed{\widetilde A=A+\lambda I}.
$$

This requires **square** $A$ for the addition to make sense. The transcript starts with an all-zero matrix: $0+I=I$ immediately becomes full rank. A small shift often helps a singular matrix become invertible while altering its entries only slightly.

But there are **two important caveats**:

1. **Not every nonzero shift works.** If $-\lambda$ is an eigenvalue of $A$, then $A+\lambda I$ is singular. For $A=\operatorname{diag}(2,0,0)$, shifting by $\lambda=-2$ still leaves one zero diagonal entry.
2. **Large shifts change the original problem.** A shift of $1000I$ may make the matrix full rank but can dominate its original information. Choosing a useful $\lambda$ depends on the application.

This idea is related to **regularization** in statistics and machine learning, but regularization should not be described as recovering missing information from the original dataset.

![An identity-matrix shift changes only the diagonal and can restore full rank.](/images/linear-algebra/matrix-rank/69-shifting.svg)

```python
import numpy as np

A = np.diag([2., 0., 0.])
for lam in [0., 0.01, -2., 1., 1000.]:
    shifted = A + lam * np.eye(3)
    print(f"lambda={lam:7g}: rank={np.linalg.matrix_rank(shifted)}",
          "diagonal=", np.diag(shifted))
```

**Try Live demo → 69.** Test $\lambda=0$, $0.01$, $1$, and $-2$. Watch the diagonal and rank. Note that a numerical tolerance can classify a sufficiently small shifted value as zero.

---

## Part D — Membership in a span and learning habits

### 70. Code challenge: is a vector in the span of a set?

The source asks you to test whether $v=[1,2,3,4]^T$ belongs to the span of two different sets of column vectors. The core method is to **append $v$ as a new column** and compare ranks:

$$
\boxed{v\in\operatorname{span}(S)
\iff\operatorname{rank}([S\mid v])=\operatorname{rank}(S)}.
$$

Why? If $v$ is already a combination of the columns of $S$, adding it does not create another independent direction. Otherwise, the augmented matrix gains rank by one.

To illustrate this in three dimensions where a picture is easier to draw, take

$$
S=\begin{bmatrix}1&0\\0&1\\0&0\end{bmatrix},
\quad v=\begin{bmatrix}1\\2\\z\end{bmatrix}.
$$

- When $z=0$, $v=1s_1+2s_2$ and lies **in** the $xy$ plane: both ranks equal two.
- When $z\ne0$, $v$ points out of that plane: the augmented matrix has rank three.

This visual 3D example is a teaching adaptation; the lecture's coding exercise uses a 4D vector.

![Augmenting a matrix with a new vector tests whether the vector is in its span.](/images/linear-algebra/matrix-rank/70-span-membership.svg)

```python
import numpy as np

S = np.array([[1., 0.], [0., 1.], [0., 0.]])
for z in [0., 1., -2.]:
    v = np.array([[1.], [2.], [z]])  # shape (3,1) matters
    augmented = np.concatenate((S, v), axis=1)
    print("z:", z, "rank(S):", np.linalg.matrix_rank(S),
          "rank([S|v]):", np.linalg.matrix_rank(augmented))

# For the lecture's 4D question, construct v = [[1],[2],[3],[4]]
# and compare the two provided sets by the same rule.
```

**Try Live demo → 70.** Drag $z$ through zero; predict when the vector leaves the plane. In finite-precision data, rank comparisons also require a tolerance.

**Practice:** Does $v=[2,3,0]^T$ lie in the span of $e_1$ and $e_2$? **Yes**. Does $[2,3,1]^T$? **No**.

### 71. Course tangent: self-accountability in online learning

The final recording pauses the mathematics to discuss **consistency in self-paced education**. You can replay a lesson whenever you like, but fewer fixed deadlines can make it easy to stop studying for days or weeks.

The speaker asks you to consider whether structure, reminders, study partners, or your own habits help you stay accountable. This is a reflection rather than a rank theorem.

**A small study protocol:** Pick one specific concept, predict an answer *before* opening its demo, test it with Python, and write down one thing that surprised you. Set a short regular study slot rather than relying only on motivation.

![A compact study loop: predict, test, explain, and repeat.](/images/linear-algebra/matrix-rank/71-self-accountability.svg)

**Try Live demo → 71.** Tick off *Predict → Test → Explain → Review* and see your study progress. This checklist stays in this browser session; it is not a server-stored account record.

---

## Summary: the essential rank rules

| Question | Rule | Common mistake |
|:--|:--|:--|
| Maximum rank of $m\times n$? | $\min(m,n)$ | Assuming rank equals number of entries |
| Rank of transpose? | $\operatorname{rank}(A^T)=\operatorname{rank}(A)$ | Thinking rows and columns have different ranks |
| Rank of sum? | $\operatorname{rank}(A+B)\le r_A+r_B$ | Treating the bound as an equality |
| Rank of product? | $\operatorname{rank}(AB)\le\min(r_A,r_B)$ | Assuming product rank always reaches the bound |
| Rank of nonzero scaling? | $\operatorname{rank}(\lambda A)=r_A$ | Forgetting the zero-scalar exception |
| Rank of Gram matrices? | $r_A=r_{A^TA}=r_{AA^T}$ | Assuming their **sizes** stay the same |
| Shift a singular square matrix? | $A+\lambda I$ may become full rank | Assuming *every* nonzero shift works |
| Is $v$ in a span? | $r_{[S|v]}=r_S$ | Appending $v$ as a row rather than a column |

## Final concept check

1. Can the rank of a $4\times6$ matrix be five? Explain.
2. A $2\times2$ matrix has identical rows. How many pivots remain after row reduction?
3. Two rank-one matrices are added. Can the result have rank zero? Give an example.
4. Can multiplying two rank-two matrices produce a rank-zero matrix? Give an example.
5. Explain why $XY$ has rank at most $r$ when $X$ has $r$ columns and $Y$ has $r$ rows.
6. A rank-three matrix is multiplied by $\lambda=-7$. What is the new rank? What if $\lambda=0$?
7. If $A$ is $5\times2$ with rank two, what are the sizes and ranks of $A^TA$ and $AA^T$?
8. If $A=\operatorname{diag}(2,0,0)$, why does shifting by $\lambda=-2$ fail to produce full rank?
9. What changes when you append a vector *outside* a matrix's column space?
10. Why might SVD-based rank estimation depend on a tolerance when working with real measurements?

<details>
<summary>Check your answers</summary>

1. No. Its rank is at most $\min(4,6)=4$.
2. One pivot if the common row is nonzero; zero pivots if both rows are zero.
3. Yes: $B=-A$ gives $A+B=0$.
4. Yes. For example, appropriately shaped matrices with nonoverlapping row/column directions can multiply to zero; the Gram example in Lesson 68 illustrates this.
5. The image of $XY$ lies inside the column space of $X$, which has dimension at most $r$.
6. Rank three for $-7$; rank zero for $0$.
7. $A^TA$ is $2\times2$, rank two; $AA^T$ is $5\times5$, rank two.
8. $A-2I=\operatorname{diag}(0,-2,-2)$ still has one zero eigenvalue.
9. The augmented matrix's rank rises by one.
10. Very small singular values may reflect rounding errors or measurement noise; the tolerance determines which are treated as zero.

</details>

## Python environment and reproducibility

The snippets require only `numpy`. In local Python, Jupyter, or Colab:

```bash
pip install numpy
```

In the website's inline Python runner, the first execution might download NumPy through Pyodide. **No image upload, OpenCV, Seaborn, or scikit-learn is needed for this chapter.** SVG diagrams are static, and the Live demo is implemented in fast browser-side JavaScript; you can study the visual concepts even if the Python runner cannot load.

**Source coverage:** This chapter follows all ten recordings, **62–71**, in the uploaded transcript. Worked numerical examples are illustrative adaptations where the transcript describes figures or MATLAB outputs without providing their exact numeric matrices. The course's core statements are preserved; the mathematical caveats about general eigenvalues, product-rank equality, and special shifts are clarified to avoid misleading interpretations.
