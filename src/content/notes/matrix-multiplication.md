---
title: "Matrix Multiplication — Linear Algebra, Chapter 3"
description: "Learn matrix multiplication step by step: shapes, four useful views, geometric transformations, symmetry, Hadamard products, the Fourier transform, matrix norms, and the idea of matrix division."
subject: Linear Algebra
date: "2026-10-09T03:00:00Z"
draft: false
tags:
  - linear-algebra
  - matrices
  - matrix-multiplication
  - mathematics
---

Matrix multiplication combines rows and columns. We will calculate products, transform shapes and connect the same operation to norms and Fourier analysis.

Matrix multiplication does **not** mean multiplying numbers in the same positions. It means combining **rows** of one matrix with **columns** of another. This simple rule connects many ideas in linear algebra, from data transformations to eigenvectors and the Fourier transform.

## Learning goals

By the end, you should be able to:

1. Check whether two matrices can be multiplied and find the output shape **before calculating**.
2. Explain four ways to understand the **same** matrix product.
3. Use matrices to change vectors and 2D shapes.
4. Know when symmetry is preserved and when it is not.
5. Tell apart standard multiplication, Hadamard multiplication, and the Frobenius inner product.
6. Understand what matrix norms measure and why matrix division needs special care.

**Notation:** Capital bold letters, such as $\mathbf A$ and $\mathbf B$, are matrices. A bold lowercase letter, such as $\mathbf v$, is a vector. A regular letter, such as $\lambda$, is a single number (a **scalar**). In the equations, indices start at **1**; Python list indices start at **0**.

---

## Start here: calculate one cell at a time

In the live matrix example, highlighted cells show the **left row** and **right column** used to find one cell of the answer. Press **Next cell** four times. Then use the coordinate plane to rotate the vector (3, 1) and follow its new coordinates.

**Quick practice:**

1. The first row of A is (1, 2). The first column of B is (2, 1). What is C₁₁? **Answer:** 1×2 + 2×1 = 4.
2. The second row of A is (3, 4). The second column of B is (0, 3). What is C₂₂? **Answer:** 3×0 + 4×3 = 12.
3. Set rotation to 0° and scale to 1×. Does the vector move? **Answer:** No; the input and output are both (3, 1).

## Part A — The main rules

### 41. Introduction to standard matrix multiplication

**Rule 1: The inside numbers must match.** If the left matrix has $m$ rows and $n$ columns, the right matrix must have $n$ rows:

$$
\underbrace{\mathbf A}_{m\times n}
\underbrace{\mathbf B}_{n\times p}
=\underbrace{\mathbf C}_{m\times p}.
$$

The repeated $n$ values are the **inner dimensions**. The outside values, $m$ and $p$, give the **output shape**.

Examples:

| Expression | Allowed? | Output shape |
|---|---|---|
| $(5\times2)(2\times7)$ | Yes | $5\times7$ |
| $(2\times7)(5\times2)$ | No | Inner dimensions $7\ne5$ |
| $(3\times4)(4\times1)$ | Yes | $3\times1$ — a column vector |
| $(1\times5)(5\times1)$ | Yes | $1\times1$ — a scalar-like result |
| $(5\times1)(1\times5)$ | Yes | $5\times5$ — an outer product |

**Rule 2: Order matters.** In general, $\mathbf{AB}\ne\mathbf{BA}$. Swapping the order may even make the multiplication impossible. That is why I use *left multiplication* / *premultiplication* and *right multiplication* / *postmultiplication*.

**Rule 3: Transpose changes shapes.** If $\mathbf A$ is $m\times n$, then $\mathbf A^T$ is $n\times m$. This can make a previously invalid product valid.

**Python — check shapes without a library:**

```python
A = [[1, 2, 3], [4, 5, 6]]     # 2 x 3
B = [[1, 2], [3, 4], [5, 6]]  # 3 x 2

shape_a = (len(A), len(A[0]))
shape_b = (len(B), len(B[0]))
can_multiply = shape_a[1] == shape_b[0]
print("A:", shape_a, "B:", shape_b)
print("Allowed:", can_multiply)
if can_multiply:
    print("Output shape:", (shape_a[0], shape_b[1]))
```

**Remember:** Always check the inner dimensions **first**. Do not start multiplying entries until you know the shapes work.

### 42. Four ways to think about matrix multiplication

These four views describe the **same operation**. You can use whichever view makes the problem easier.

Take:

$$
\mathbf A=\begin{bmatrix}1&2\\3&4\end{bmatrix},\qquad
\mathbf B=\begin{bmatrix}5&6\\7&8\end{bmatrix}.
$$

Their product is:

$$
\mathbf{AB}=\begin{bmatrix}19&22\\43&50\end{bmatrix}.
$$

#### View 1: Elements — one dot product at a time

To compute entry $(i,j)$, take **row $i$ of $\mathbf A$** and **column $j$ of $\mathbf B$**, multiply matching values, then add:

$$
c_{ij}=\sum_{k=1}^{n}a_{ik}b_{kj}.
$$

For example, $c_{12}=1\cdot6+2\cdot8=22$.

#### View 2: Layers — add outer products

Take **column $k$ of the left matrix**, multiply it by **row $k$ of the right matrix**, and add these whole matrix layers:

$$
\mathbf{AB}=\sum_{k=1}^{n}\mathbf A_{:,k}\,\mathbf B_{k,:}.
$$

In our example:

$$
\begin{bmatrix}1\\3\end{bmatrix}\begin{bmatrix}5&6\end{bmatrix}
+\begin{bmatrix}2\\4\end{bmatrix}\begin{bmatrix}7&8\end{bmatrix}
=\begin{bmatrix}5&6\\15&18\end{bmatrix}
+\begin{bmatrix}14&16\\28&32\end{bmatrix}.
$$

Each nonzero outer-product layer has **rank 1**: its columns come from one basic direction. Layers appear again in singular value decomposition (SVD).

#### View 3: Columns — mix columns of the left matrix

Each output column is a weighted sum of the **columns of $\mathbf A$**. The weights come from one column of $\mathbf B$:

$$
\mathbf C_{:,j}=\sum_{k=1}^{n}b_{kj}\mathbf A_{:,k}.
$$

For example, the first output column is $5[1,3]^T+7[2,4]^T=[19,43]^T$. This is especially useful for thinking about linear models.

#### View 4: Rows — mix rows of the right matrix

Each output row is a weighted sum of the **rows of $\mathbf B$**. The weights come from one row of $\mathbf A$:

$$
\mathbf C_{i,:}=\sum_{k=1}^{n}a_{ik}\mathbf B_{k,:}.
$$

For example, the first output row is $1[5,6]+2[7,8]=[19,22]$.

| View | Take from the left | Take from the right | Build |
|---|---|---|---|
| Element | A row | A column | One number |
| Layer | A column | A row | One whole matrix layer |
| Column | Columns | Weights from a column | One output column |
| Row | Weights from a row | Rows | One output row |

### 43. Code challenge: multiply by adding layers

The challenge in I use to implement the **layer view** with a loop, then compare it to ordinary matrix multiplication.

Start with $\mathbf A\in\mathbb R^{m\times n}$ and $\mathbf B\in\mathbb R^{n\times p}$. The important detail is that you need **$n$ layers**, not $m$ or $p$.

**Python — compare direct multiplication and the layer method:**

```python
A = [[1, 2, 3], [4, 5, 6]]
B = [[7, 8], [9, 10], [11, 12]]

m, n, p = len(A), len(B), len(B[0])

# Element view: one row-column dot product per entry
normal = [[sum(A[i][k] * B[k][j] for k in range(n))
           for j in range(p)] for i in range(m)]

# Layer view: add n outer products
layers = [[0 for _ in range(p)] for _ in range(m)]
for k in range(n):
    for i in range(m):
        for j in range(p):
            layers[i][j] += A[i][k] * B[k][j]

print("Normal:", normal)
print("Layers:", layers)
print("Same answer?", normal == layers)
```

**Common mistake:** If $\mathbf A$ is $4\times6$ and $\mathbf B$ is $6\times4$, stopping after four layers misses two layers. The number of layers is always the shared **inner dimension**: $6$ in this case.

### 44. Multiplication with a diagonal matrix

A **diagonal matrix** has zeros everywhere except possibly on its main diagonal:

$$
\mathbf D=\begin{bmatrix}d_1&0&0\\0&d_2&0\\0&0&d_3\end{bmatrix}.
$$

It has an easy multiplication rule:

- **$\mathbf{AD}$: diagonal matrix on the right** — scale the **columns** of $\mathbf A$.
- **$\mathbf{DA}$: diagonal matrix on the left** — scale the **rows** of $\mathbf A$.

For a small matrix:

$$
\begin{bmatrix}1&2\\3&4\end{bmatrix}
\begin{bmatrix}10&0\\0&100\end{bmatrix}
=\begin{bmatrix}10&200\\30&400\end{bmatrix}
\quad\text{(columns scaled)}.
$$

$$
\begin{bmatrix}10&0\\0&100\end{bmatrix}
\begin{bmatrix}1&2\\3&4\end{bmatrix}
=\begin{bmatrix}10&20\\300&400\end{bmatrix}
\quad\text{(rows scaled)}.
$$

**Python — see the two different results:**

```python
A = [[1, 2], [3, 4]]
d = [10, 100]  # diagonal entries of D

right = [[A[i][j] * d[j] for j in range(2)] for i in range(2)]
left = [[A[i][j] * d[i] for j in range(2)] for i in range(2)]
print("A @ D:", right)  # scales columns
print("D @ A:", left)   # scales rows
```

**Why useful?** Diagonal matrices make it simple to change the importance of different rows or columns. They also appear in eigenvalue and singular value decompositions.

### 45. Order of operations: the LIVE → EVIL rule

When transposing a matrix product, **transpose each factor and reverse the order**:

$$
(\mathbf{AB})^T=\mathbf B^T\mathbf A^T.
$$

For four matrices, the course's memory trick is **LIVE → EVIL**:

$$
(\mathbf L\mathbf I\mathbf V\mathbf E)^T=\mathbf E^T\mathbf V^T\mathbf I^T\mathbf L^T.
$$

Here the word LIVE means a product of four matrices $\mathbf L\mathbf I\mathbf V\mathbf E$; it is **not** one matrix called LIVE.

The same reverse-order idea works for longer transpose products. Later, you will see it again with matrix inverses **when the required inverses exist**. For complex matrices, the conjugate transpose also reverses order:

$$
(\mathbf{AB})^H=\mathbf B^H\mathbf A^H.
$$

**Python — verify the rule without NumPy:**

```python
A = [[1, 2], [3, 4]]
B = [[5, 6], [7, 8]]

def transpose(M):
    return [list(row) for row in zip(*M)]

def matmul(X, Y):
    return [[sum(a * b for a, b in zip(row, col))
             for col in zip(*Y)] for row in X]

left = transpose(matmul(A, B))
right = matmul(transpose(B), transpose(A))
print("(AB)^T =", left)
print("B^T A^T =", right)
print("Equal?", left == right)
```

### 46. Matrix-vector multiplication

A vector is like a matrix with **one column** (or one row). That means matrix-vector multiplication follows the same shape rule.

For $\mathbf A\in\mathbb R^{m\times n}$ and a column vector $\mathbf v\in\mathbb R^n$:

$$
\underbrace{\mathbf A}_{m\times n}
\underbrace{\mathbf v}_{n\times1}
=\underbrace{\mathbf w}_{m\times1}.
$$

The output is a column vector with **$m$ entries**. You can think of it as a weighted combination of the columns of $\mathbf A$:

$$
\mathbf{Av}=v_1\mathbf A_{:,1}+v_2\mathbf A_{:,2}+\cdots+v_n\mathbf A_{:,n}.
$$

Putting a row vector on the **left** instead combines the **rows** of $\mathbf A$. In general, these two results differ. For a **symmetric** square matrix $\mathbf S=\mathbf S^T$, however:

$$
(\mathbf S\mathbf v)^T=\mathbf v^T\mathbf S.
$$

**Python — weighted columns:**

```python
A = [[1, 2], [3, 4]]
v = [2, 3]

Av = [sum(A[i][j] * v[j] for j in range(2)) for i in range(2)]
print("A times v:", Av)  # [8, 18]

# Change A to a symmetric matrix and compare both directions
S = [[1, 5], [5, 4]]
Sv = [sum(S[i][j] * v[j] for j in range(2)) for i in range(2)]
vTS = [sum(v[i] * S[i][j] for i in range(2)) for j in range(2)]
print("S v:", Sv)
print("v^T S:", vTS)
print("Same entries?", Sv == vTS)
```

Later, this becomes a way to view a matrix as a **machine that transforms a vector**.

---

## Part B — Multiplication as a geometric transformation

### 47. Two-dimensional transformation matrices

Think of a matrix as a **machine**:

$$
\text{input vector }\mathbf v\ \longrightarrow\ \mathbf A\mathbf v\ \longrightarrow\ \text{output vector}.
$$

The output might be longer, shorter, rotated, flipped, or flattened. The matrix decides what happens.

For example:

$$
\mathbf A=\begin{bmatrix}2&0\\0&3\end{bmatrix},\qquad
\mathbf v=\begin{bmatrix}2\\1\end{bmatrix},\qquad
\mathbf{Av}=\begin{bmatrix}4\\3\end{bmatrix}.
$$

This matrix doubles the horizontal value and triples the vertical value.

A **pure 2D rotation** through angle $\theta$ uses:

$$
\mathbf R(\theta)=\begin{bmatrix}
\cos\theta & -\sin\theta\\
\sin\theta & \cos\theta
\end{bmatrix}.
$$

For a pure rotation, the **length stays the same**:

$$
\|\mathbf R\mathbf v\|_2=\|\mathbf v\|_2,
\qquad
\mathbf R^T\mathbf R=\mathbf I.
$$

**Python — rotate a vector by 90 degrees:**

```python
import math

x, y = 2, 3
theta = math.pi / 2
c, s = math.cos(theta), math.sin(theta)
new_x = c * x - s * y
new_y = s * x + c * y
print("Before:", (x, y))
print("After:", (round(new_x, 6), round(new_y, 6)))
print("Length before:", round(math.hypot(x, y), 6))
print("Length after:", round(math.hypot(new_x, new_y), 6))
```

I also introduce the **eigenvector idea** here. Occasionally, a matrix changes only a vector's scale and not its line of direction:

$$
\mathbf A\mathbf v=\lambda\mathbf v,\qquad \mathbf v\ne\mathbf0.
$$

Then $\mathbf v$ is an **eigenvector**, and $\lambda$ is its **eigenvalue**. If $\lambda$ is negative, the output points the opposite way on the same line. We will study eigenvalues in more detail in a later chapter.

### 48. Code challenge: pure and impure rotations

What if you change just one number in a rotation matrix? I change the top-left entry from $\cos\theta$ to $2\cos\theta$:

$$
\widetilde{\mathbf R}(\theta)=\begin{bmatrix}
2\cos\theta & -\sin\theta\\
\sin\theta & \cos\theta
\end{bmatrix}.
$$

It still transforms vectors, but it is **not a pure rotation**. The output length may now depend on the angle.

**Challenge:** Keep the input vector fixed, test many angles, and compare the lengths for $\mathbf R(\theta)$ and $\widetilde{\mathbf R}(\theta)$.

**Python — print the comparison for a few angles:**

```python
import math

v = (2.0, 3.0)
for degrees in (0, 30, 60, 90, 120, 180):
    t = math.radians(degrees)
    c, s = math.cos(t), math.sin(t)
    pure = (c*v[0] - s*v[1], s*v[0] + c*v[1])
    impure = (2*c*v[0] - s*v[1], s*v[0] + c*v[1])
    print(degrees, "degrees:",
          "pure", round(math.hypot(*pure), 3),
          "impure", round(math.hypot(*impure), 3))
```

**Key observation:** A valid $2\times2$ matrix is not automatically a rotation matrix. The rotation matrix has a special pattern that keeps lengths unchanged.

### 49. Code challenge: transform a circle

A circle is a useful way to **see what a matrix does to many vectors at once**. Start with points:

$$
\mathbf x(\theta)=\begin{bmatrix}\cos\theta\\\sin\theta\end{bmatrix},
\quad 0\le\theta<2\pi.
$$

Put these points into a matrix. Then multiply by a transformation matrix. Geometrically:

- The **identity** matrix leaves the circle unchanged.
- A **rotation** turns the circle without changing its size.
- Unequal scaling can turn the circle into an **ellipse**.
- A **singular matrix** can flatten the circle to a line (or even a point), because information is lost.

**Python — generate a circle and transform sample points:**

```python
import math

# Columns of P represent points on a unit circle.
angles = [2 * math.pi * k / 8 for k in range(8)]
points = [(math.cos(t), math.sin(t)) for t in angles]

T = [[2, 0], [0, 1]]  # stretch x, keep y
transformed = [
    (T[0][0]*x + T[0][1]*y,
     T[1][0]*x + T[1][1]*y)
    for x, y in points
]

print("First circle points:", [(round(x, 2), round(y, 2))
                               for x, y in points[:3]])
print("After transformation:", [(round(x, 2), round(y, 2))
                                for x, y in transformed[:3]])
```

**Try this:** Change `T` to `[[1, 0], [0, 0]]` to flatten the circle onto the horizontal axis. A full picture can be drawn later with Matplotlib; this code focuses on the mathematics without installing a plotting package.

---

## Part C — Identities and symmetry

### 50. Additive and multiplicative identities

An **identity** is something that leaves an object unchanged. Matrix algebra has two different identities:

$$
\mathbf A+\mathbf0=\mathbf A
\qquad\text{and}\qquad
\mathbf A\mathbf I=\mathbf A=\mathbf I\mathbf A.
$$

The **zero matrix** is the *additive identity*: add zero and nothing changes. The **identity matrix** $\mathbf I$ is the *multiplicative identity*: multiply by it and nothing changes, with an appropriate size.

For non-square $\mathbf A\in\mathbb R^{m\times n}$, the identity sizes differ:

$$
\mathbf I_m\mathbf A=\mathbf A,\qquad
\mathbf A\mathbf I_n=\mathbf A.
$$

**Do not confuse these statements:** In general $\mathbf A+\mathbf I\ne\mathbf A$ and $\mathbf A\mathbf0=\mathbf0$, not $\mathbf A$.

### 51. Two ways to create a symmetric matrix

A matrix is **symmetric** if it is square and equals its transpose:

$$
\mathbf S^T=\mathbf S.
$$

**Method 1 — add the transpose.** For a **square** real matrix $\mathbf A$:

$$
\mathbf S=\frac{\mathbf A+\mathbf A^T}{2}.
$$

The division by $2$ takes the average of each mirrored pair. It is useful, but the addition needs $\mathbf A$ and $\mathbf A^T$ to have the same shape — so $\mathbf A$ must be square.

**Method 2 — multiply by the transpose.** For **any** real $m\times n$ matrix $\mathbf A$:

$$
\mathbf A^T\mathbf A\text{ is symmetric }(n\times n)
\qquad\text{and}\qquad
\mathbf A\mathbf A^T\text{ is symmetric }(m\times m).
$$

Proof idea:

$$
(\mathbf A^T\mathbf A)^T
=\mathbf A^T(\mathbf A^T)^T
=\mathbf A^T\mathbf A.
$$

This is related to the **covariance matrices** used in statistics and machine learning. Also, for every vector $\mathbf x$, $\mathbf x^T\mathbf A^T\mathbf A\mathbf x=\|\mathbf A\mathbf x\|^2\ge0$.

**Python — both methods:**

```python
A = [[1, 2], [4, 3], [5, 6]]  # 3 x 2

def transpose(M):
    return [list(row) for row in zip(*M)]

def product(X, Y):
    return [[sum(a*b for a, b in zip(row, col))
             for col in zip(*Y)] for row in X]

AT = transpose(A)
ATA = product(AT, A)   # 2 x 2
AAT = product(A, AT)   # 3 x 3
print("A^T A:", ATA)
print("A A^T:", AAT)
print("Symmetric?", ATA == transpose(ATA))
```

### 52. Hadamard (element-wise) multiplication

**Standard matrix multiplication** mixes rows with columns. **Hadamard multiplication** simply multiplies matching entries:

$$
(\mathbf A\odot\mathbf B)_{ij}=a_{ij}b_{ij}.
$$

For example:

$$
\begin{bmatrix}1&2\\3&4\end{bmatrix}
\odot\begin{bmatrix}5&6\\7&8\end{bmatrix}
=\begin{bmatrix}5&12\\21&32\end{bmatrix}.
$$

Both matrices must have the **same shape** for the usual Hadamard product. This differs from standard multiplication, whose rule is **matching inner dimensions**.

In NumPy code, `A * B` means Hadamard multiplication for arrays of equal shape, while `A @ B` means standard matrix multiplication. NumPy can also use *broadcasting* in element-wise arithmetic; that is a software feature, not the basic mathematical definition here.

**Python — compare the two methods:**

```python
A = [[1, 2], [3, 4]]
B = [[5, 6], [7, 8]]

hadamard = [[A[i][j] * B[i][j] for j in range(2)] for i in range(2)]
standard = [[sum(A[i][k] * B[k][j] for k in range(2))
             for j in range(2)] for i in range(2)]
print("Hadamard:", hadamard)
print("Standard:", standard)
```

### 53. Code challenge: combine two symmetric matrices

Create two symmetric matrices $\mathbf S$ and $\mathbf T$, then try three different ways of combining them.

| Operation | Is the result symmetric? | Why? |
|---|---|---|
| $\mathbf S+\mathbf T$ | **Yes** | Its transpose is the same sum |
| $\mathbf S\odot\mathbf T$ | **Yes** | Mirrored entries still match |
| $\mathbf{ST}$ | **Not always** | Matrix order changes under transpose |

For the last row:

$$
(\mathbf{ST})^T=\mathbf T^T\mathbf S^T=\mathbf{TS}.
$$

So the product is symmetric **if and only if** $\mathbf{ST}=\mathbf{TS}$. This is the key observation, explored more carefully in the next lesson.

**Python — one counterexample:**

```python
S = [[1, 2], [2, 3]]
T = [[4, 0], [0, 5]]
ST = [[sum(S[i][k]*T[k][j] for k in range(2))
       for j in range(2)] for i in range(2)]
TS = [[sum(T[i][k]*S[k][j] for k in range(2))
       for j in range(2)] for i in range(2)]
print("S times T:", ST)
print("T times S:", TS)
print("Product symmetric?", ST == [list(r) for r in zip(*ST)])
```

### 54. Multiplying two symmetric matrices

Here is an important point that often surprises beginners:

> Two symmetric matrices do **not** always give a symmetric product.

If both $\mathbf S$ and $\mathbf T$ are symmetric, then:

$$
\mathbf{ST}\text{ symmetric}\iff\mathbf{ST}=\mathbf{TS}.
$$

They must **commute**, meaning that swapping their multiplication order does not change the product.

Here is an interesting shortcut for **$2\times2$ symmetric matrices whose diagonal entries match within each matrix**. Such pairs can give a symmetric product, but **this shortcut does not generally work in larger dimensions**. The safe general rule is to check whether $\mathbf{ST}=\mathbf{TS}$.

This is why a result seen in a small numerical example is helpful evidence but not automatically a general proof.

### 55. Code challenge: diagonal matrices and Hadamard products

Compare these two operations:

$$
\mathbf{AA}\quad\text{(standard multiplication)},
\qquad
\mathbf A\odot\mathbf A\quad\text{(Hadamard multiplication)}.
$$

For a **full matrix**, they usually produce different results. But for a **square diagonal matrix $\mathbf D$**, both results are the same:

$$
\mathbf D^2=\mathbf D\odot\mathbf D
=\operatorname{diag}(d_1^2,\ldots,d_n^2).
$$

Why? A diagonal matrix has zero off-diagonal entries, so only each entry's own square survives in the standard product.

**Python — the special case:**

```python
D = [[2, 0, 0], [0, 3, 0], [0, 0, 4]]
n = len(D)
standard = [[sum(D[i][k]*D[k][j] for k in range(n))
             for j in range(n)] for i in range(n)]
hadamard = [[D[i][j]**2 for j in range(n)] for i in range(n)]
print("Standard D @ D:", standard)
print("Hadamard D * D:", hadamard)
print("Equal?", standard == hadamard)
```

---

## Part D — Products that measure information

### 56. Code challenge: Fourier transform with matrix multiplication

The **Fourier transform** is a way to describe a signal using frequencies rather than values over time. In this lesson, the focus is not signal theory: it is how to perform the transform using **one matrix-vector multiplication**.

For $N$ values, define the **Fourier matrix**:

$$
F_{jk}=e^{-2\pi i jk/N},\qquad j,k=0,1,\ldots,N-1.
$$

Here $i$ is the imaginary unit, $i^2=-1$, and $e^{i\theta}$ is a complex number. The Fourier transform of a vector $\mathbf x$ is:

$$
\mathbf X=\mathbf F\mathbf x.
$$

This is the **discrete Fourier transform (DFT)** with the common unnormalized forward-transform convention. Some books use a different sign or scaling; always check the convention. Building the full $\mathbf F$ is useful for learning but slow for large signals. The **fast Fourier transform (FFT)** is a much faster way to compute the same values.

**Python — a four-point Fourier transform using built-in `cmath`:**

```python
import cmath
import math

x = [1, 2, 0, 0]
N = len(x)
F = [[cmath.exp(-2j * math.pi * j * k / N)
      for k in range(N)] for j in range(N)]
X = [sum(F[j][k] * x[k] for k in range(N)) for j in range(N)]

print("Input signal:", x)
print("Fourier magnitudes:", [round(abs(value), 6) for value in X])
print("Fourier values:", [complex(round(v.real, 6), round(v.imag, 6))
                          for v in X])
```

**What to notice:** $\mathbf F$ is a complex-valued square matrix; $\mathbf x$ is a column vector; the result has $N$ complex Fourier coefficients. This example avoids NumPy so it can run inside a simple Python code block.

### 57. Frobenius dot product (matrix inner product)

A vector dot product multiplies matching entries and **adds everything into one number**. The **Frobenius inner product** does the same thing for two matrices of the same shape.

For real $m\times n$ matrices:

$$
\langle\mathbf A,\mathbf B\rangle_F
=\sum_{i=1}^{m}\sum_{j=1}^{n}a_{ij}b_{ij}
=\operatorname{tr}(\mathbf A^T\mathbf B).
$$

Another way to understand it is to **vectorize** each matrix — place all its entries into one long vector — then take the ordinary dot product:

$$
\langle\mathbf A,\mathbf B\rangle_F
=\operatorname{vec}(\mathbf A)^T\operatorname{vec}(\mathbf B).
$$

Example:

$$
\mathbf A=\begin{bmatrix}1&2\\3&4\end{bmatrix},\quad
\mathbf B=\begin{bmatrix}5&6\\7&8\end{bmatrix}.
$$

Then $\langle\mathbf A,\mathbf B\rangle_F=1(5)+2(6)+3(7)+4(8)=70$.

**Python — multiply matching entries, then add:**

```python
A = [[1, 2], [3, 4]]
B = [[5, 6], [7, 8]]
inner = sum(A[i][j] * B[i][j]
            for i in range(2) for j in range(2))
print("Frobenius inner product:", inner)  # 70
```

For **complex** matrices, the usual inner product uses a complex conjugate on the first matrix: $\langle\mathbf A,\mathbf B\rangle_F=\operatorname{tr}(\mathbf A^H\mathbf B)$. Our first examples mainly use real matrices.

### 58. Matrix norms: several ways to measure size

A **norm** is a number that measures the size or magnitude of an object. A matrix can be large in different senses, so there is **more than one matrix norm**.

#### Family 1: Frobenius norm

Square every entry, add them all, then take the square root:

$$
\|\mathbf A\|_F
=\sqrt{\sum_{i=1}^{m}\sum_{j=1}^{n}|a_{ij}|^2}.
$$

It also comes from the Frobenius inner product:

$$
\|\mathbf A\|_F=\sqrt{\langle\mathbf A,\mathbf A\rangle_F}.
$$

For a real matrix, $\|\mathbf A\|_F^2=\operatorname{tr}(\mathbf A^T\mathbf A)$.

#### Family 2: Induced or operator norms

These norms ask a different question: **How much can this matrix stretch a vector?**

$$
\|\mathbf A\|_p
=\max_{\mathbf x\ne\mathbf0}
\frac{\|\mathbf A\mathbf x\|_p}{\|\mathbf x\|_p}.
$$

Common choices include:

- **Induced 1-norm:** the largest sum of absolute values in **one column**.
- **Induced infinity-norm:** the largest sum of absolute values in **one row**.
- **Induced 2-norm:** the largest singular value; it describes maximum stretching using Euclidean vector lengths.

#### Family 3: Schatten $p$-norms

These use the **singular values** $\sigma_i$ of a matrix:

$$
\|\mathbf A\|_{S_p}
=\left(\sum_i\sigma_i^p\right)^{1/p}.
$$

- $S_1$ is the **nuclear norm**: sum of singular values.
- $S_2$ equals the **Frobenius norm**.
- $S_\infty$ is the largest singular value and equals the **induced 2-norm**.

**Important:** The symbol $\|\mathbf A\|_2$ may refer to different norms in different contexts. State the norm's **name**, not only its subscript.

**Python — compare easy norms without external libraries:**

```python
import math

A = [[1, -2], [3, 4]]
rows, cols = len(A), len(A[0])

frobenius = math.sqrt(sum(x*x for row in A for x in row))
induced_one = max(sum(abs(A[i][j]) for i in range(rows))
                  for j in range(cols))
induced_inf = max(sum(abs(x) for x in row) for row in A)

print("Frobenius:", round(frobenius, 6))
print("Induced 1-norm:", induced_one)
print("Induced infinity-norm:", induced_inf)
```

This example does not calculate singular values. You will see those in the later SVD chapters.

---

## Part E — Deeper connections and final challenges

### 59. Code challenge: when is a matrix self-adjoint?

The **self-adjoint** condition in I use written using inner products:

$$
\langle\mathbf A\mathbf v,\mathbf w\rangle
=\langle\mathbf v,\mathbf A\mathbf w\rangle.
$$

For the ordinary dot product over **real** numbers, this holds for every compatible $\mathbf v$ and $\mathbf w$ when $\mathbf A$ is **symmetric**:

$$
\mathbf A^T=\mathbf A.
$$

**Why?** Rewrite the first inner product using the transpose:

$$
(\mathbf A\mathbf v)^T\mathbf w
=\mathbf v^T\mathbf A^T\mathbf w
=\mathbf v^T\mathbf A\mathbf w.
$$

For a real $n\times n$ matrix, you need equal-sized column vectors $\mathbf v,\mathbf w\in\mathbb R^n$. The challenge deliberately chooses **different vectors** to avoid a trivial example. With complex entries, the equivalent condition uses the **Hermitian transpose**, $\mathbf A^H=\mathbf A$.

**Python — confirm the equality:**

```python
A = [[2, 1], [1, 3]]  # symmetric
v = [1, 2]
w = [3, 1]

def mv(M, x):
    return [sum(a*b for a, b in zip(row, x)) for row in M]

def dot(a, b):
    return sum(x*y for x, y in zip(a, b))

left = dot(mv(A, v), w)
right = dot(v, mv(A, w))
print("<Av, w>:", left)
print("<v, Aw>:", right)
print("Equal?", left == right)
```

One matching pair of vectors does **not** by itself prove a matrix is self-adjoint. The defining equality must hold **for all vectors** in the space.

### 60. Code challenge: the matrix asymmetry index

Instead of asking only, *Is this matrix symmetric?*, we can measure **how much of it is skew-symmetric**.

Any real square matrix can be separated into a symmetric part and a skew-symmetric part:

$$
\mathbf A=\mathbf S+\mathbf K,\quad
\mathbf S=\frac{\mathbf A+\mathbf A^T}{2},\quad
\mathbf K=\frac{\mathbf A-\mathbf A^T}{2}.
$$

Notice that $\mathbf S^T=\mathbf S$ and $\mathbf K^T=-\mathbf K$.

The **asymmetry index** is:

$$
\operatorname{AI}(\mathbf A)
=\frac{\|\mathbf K\|_F}{\|\mathbf A\|_F}
=\frac{\left\|(\mathbf A-\mathbf A^T)/2\right\|_F}
{\|\mathbf A\|_F},\qquad \mathbf A\ne\mathbf0.
$$

Interpretation:

| Index | Meaning |
|---|---|
| $0$ | Perfectly symmetric (no skew-symmetric part) |
| Between $0$ and $1$ | Has both kinds of parts |
| $1$ | Perfectly skew-symmetric (no symmetric part) |

The index of the **zero matrix** is undefined by this formula because it would require $0/0$. It is not accurate to call an index of $0.8$ literally "80% of the entries are skew-symmetric"; it is a **ratio of Frobenius magnitudes**.

**Python — test symmetric, skew-symmetric, and mixed matrices:**

```python
import math

def asymmetry_index(A):
    n = len(A)
    skew = [[(A[i][j] - A[j][i]) / 2
             for j in range(n)] for i in range(n)]
    norm_a = math.sqrt(sum(x*x for row in A for x in row))
    norm_skew = math.sqrt(sum(x*x for row in skew for x in row))
    return norm_skew / norm_a if norm_a else None

symmetric = [[2, 3], [3, 4]]
skew_symmetric = [[0, -3], [3, 0]]
mixed = [[2, -1], [3, 4]]

for name, matrix in [("Symmetric", symmetric),
                     ("Skew", skew_symmetric),
                     ("Mixed", mixed)]:
    print(name, "index:", asymmetry_index(matrix))
```

**Second challenge (from this chapter):** Generate a random symmetric matrix $\mathbf S$ and a random skew-symmetric matrix $\mathbf K$. Mix them using a parameter $p$:

$$
\mathbf A(p)=(1-p)\mathbf S+p\mathbf K,
\qquad 0\le p\le1.
$$

This makes a purely symmetric matrix at $p=0$ and a purely skew-symmetric matrix at $p=1$. However, **the resulting asymmetry index is not generally equal to $p$**. The two component norms matter. If you generate different random components at every step, the curve can fluctuate. Test the measured index rather than assuming it equals your input.

**Python — measure the index as the mixture changes:**

```python
import math

S = [[2.0, 1.0], [1.0, 3.0]]
K = [[0.0, -2.0], [2.0, 0.0]]

for p in (0.0, 0.25, 0.5, 0.75, 1.0):
    A = [[(1-p)*S[i][j] + p*K[i][j] for j in range(2)]
         for i in range(2)]
    skew = [[(A[i][j] - A[j][i])/2 for j in range(2)]
            for i in range(2)]
    nA = math.sqrt(sum(x*x for row in A for x in row))
    nK = math.sqrt(sum(x*x for row in skew for x in row))
    print("p =", p, "measured AI =", round(nK/nA, 4))
```

### 61. What about matrix division?

We have learned matrix addition and several kinds of multiplication. What about **division**?

There is no single general matrix operation $\mathbf A/\mathbf B$ that behaves like dividing two ordinary numbers. I introduce two nearby ideas:

#### Idea 1: Element-wise division

Divide matching entries, just as with the Hadamard product:

$$
(\mathbf A\oslash\mathbf B)_{ij}=\frac{a_{ij}}{b_{ij}}.
$$

For this operation, both matrices have the **same shape** and each denominator $b_{ij}$ must be **nonzero**. It is useful for operations such as taking a ratio between two sets of sensor measurements.

#### Idea 2: Multiplication by an inverse

For ordinary numbers, $2/3=2(3^{-1})$. A similar idea exists for certain matrices:

$$
\mathbf A\mathbf B^{-1}.
$$

But only **invertible square matrices** have a two-sided inverse, and the order matters:

$$
\mathbf A\mathbf B^{-1}\ne\mathbf B^{-1}\mathbf A
\quad\text{in general}.
$$

I do **not** yet teach how to compute inverses or solve systems. Those topics belong to a later chapter.

**Python — safe element-wise division:**

```python
A = [[10, 20], [30, 40]]
B = [[2, 5], [3, 8]]

if any(value == 0 for row in B for value in row):
    raise ZeroDivisionError("B contains a zero denominator")

result = [[A[i][j] / B[i][j] for j in range(2)] for i in range(2)]
print("Element-wise quotient:", result)
```

---

## One-page formula sheet

| Idea | Formula / rule | Key meaning |
|---|---|---|
| Shape | $(m\times n)(n\times p)\to(m\times p)$ | Inside dimensions match |
| One entry | $c_{ij}=\sum_k a_{ik}b_{kj}$ | Row–column dot product |
| Layers | $\mathbf{AB}=\sum_k\mathbf A_{:,k}\mathbf B_{k,:}$ | Sum outer-product layers |
| Right diagonal | $\mathbf{AD}$ | Scale columns of $\mathbf A$ |
| Left diagonal | $\mathbf{DA}$ | Scale rows of $\mathbf A$ |
| Transpose product | $(\mathbf{AB})^T=\mathbf B^T\mathbf A^T$ | Reverse the order |
| Matrix-vector | $(m\times n)(n\times1)\to(m\times1)$ | Weighted columns |
| Rotation | $\mathbf R(\theta)$ | Preserves vector length |
| Eigenvector | $\mathbf A\mathbf v=\lambda\mathbf v$ | Same line; scaled output |
| Additive identity | $\mathbf A+\mathbf0=\mathbf A$ | Add zero |
| Multiplicative identity | $\mathbf{AI}=\mathbf A$ | Multiply by identity |
| Symmetric matrix | $\mathbf S^T=\mathbf S$ | Equals its transpose |
| Symmetric product | $\mathbf{ST}$ symmetric $\iff\mathbf{ST}=\mathbf{TS}$ | Symmetric factors must commute |
| Hadamard | $(\mathbf A\odot\mathbf B)_{ij}=a_{ij}b_{ij}$ | Match entries |
| Fourier matrix | $F_{jk}=e^{-2\pi i jk/N}$ | Signal $\to$ frequencies |
| Frobenius product | $\langle\mathbf A,\mathbf B\rangle_F=\sum_{ij}a_{ij}b_{ij}$ | One number from two matrices (real case) |
| Frobenius norm | $\|\mathbf A\|_F=\sqrt{\sum_{ij}|a_{ij}|^2}$ | Overall entry magnitude |
| Induced norm | $\max_{\mathbf x\ne0}\|\mathbf A\mathbf x\|_p/\|\mathbf x\|_p$ | Maximum stretch |
| Self-adjoint | $\langle\mathbf A\mathbf v,\mathbf w\rangle=\langle\mathbf v,\mathbf A\mathbf w\rangle$ | Symmetric (real) / Hermitian (complex) |
| Symmetric part | $(\mathbf A+\mathbf A^T)/2$ | Keep mirrored values |
| Skew part | $(\mathbf A-\mathbf A^T)/2$ | Keep antisymmetric values |
| Asymmetry index | $\|\mathbf K\|_F/\|\mathbf A\|_F$ | Fraction of magnitude in the skew part |

## Common mistakes

1. **Multiplying matrices just because they contain the same total number of entries.** The **inner dimensions** must match.
2. **Assuming $\mathbf{AB}=\mathbf{BA}$.** Ordinary matrix multiplication is not generally commutative.
3. **Using `*` in NumPy and expecting standard multiplication.** `*` is element-wise; use `@` for matrix multiplication.
4. **Thinking the output has the inner dimension.** The output uses the **outer dimensions**.
5. **Adding the wrong number of outer-product layers.** Count the **shared inner dimension**.
6. **Confusing $\mathbf{AD}$ with $\mathbf{DA}$.** The first scales columns; the second scales rows.
7. **Forgetting to reverse the order during transpose.** $(\mathbf{AB})^T\ne\mathbf A^T\mathbf B^T$ in general.
8. **Thinking every transformation is a pure rotation.** A matrix may stretch, rotate, reflect, or flatten.
9. **Assuming the product of two symmetric matrices is always symmetric.** You also need the factors to commute.
10. **Using a special rule for $2\times2$ matrices in any dimension.** Small cases do not prove a general rule.
11. **Confusing a Hadamard product with a Frobenius product.** One gives a **matrix**; the other gives a **number**.
12. **Treating all matrix norms as the same.** Check which norm was specified.
13. **Assuming the zero matrix has a defined asymmetry index.** The ratio is $0/0$ there.
14. **Assuming you can divide any two matrices.** An inverse may not exist, and element-wise division is different.

## Check your understanding — 12 questions

Try these before opening the answers.

1. Can a $4\times3$ matrix multiply a $3\times5$ matrix? What output shape do you get?
2. Can the same matrices be multiplied in reverse order?
3. How do you calculate entry $(2,1)$ of $\mathbf{AB}$?
4. If $\mathbf A$ has shape $6\times4$, how many layers make up $\mathbf{AB}$ when $\mathbf B$ is $4\times2$?
5. Does $\mathbf{AD}$ scale rows or columns?
6. What is the correct transpose of $\mathbf{ABC}$?
7. Why does a pure 2D rotation preserve a vector's length?
8. What is the difference between the additive and multiplicative identities?
9. If $\mathbf S$ and $\mathbf T$ are symmetric, must $\mathbf{ST}$ be symmetric?
10. What does the Frobenius norm measure, and what does an induced norm measure?
11. What are the asymmetry indices of a nonzero symmetric matrix and a nonzero skew-symmetric matrix?
12. Does $\mathbf A/\mathbf B$ have one generally valid meaning in linear algebra?

### Answers

1. Yes. The inner dimensions both equal $3$, and the output is $4\times5$.
2. No. $(3\times5)(4\times3)$ has inner dimensions $5$ and $4$.
3. Dot product of **row 2 of $\mathbf A$** with **column 1 of $\mathbf B$**.
4. Four layers, because the shared inner dimension is $4$.
5. **Columns**. $\mathbf{DA}$ scales rows.
6. $\mathbf C^T\mathbf B^T\mathbf A^T$.
7. $\mathbf R^T\mathbf R=\mathbf I$, so the squared length is unchanged.
8. Additive identity: **zero matrix**. Multiplicative identity: **identity matrix** of the right size.
9. No. The product is symmetric exactly when $\mathbf{ST}=\mathbf{TS}$.
10. Frobenius: size of **all entries together**. Induced: largest **stretch of a vector** under the matrix.
11. $0$ for a nonzero symmetric matrix and $1$ for a nonzero skew-symmetric matrix.
12. No. You must say whether you mean element-wise division, inverse multiplication, or a later operation such as solving a linear system.

## End-of-chapter recap

**Think shapes first, operations second.** Standard matrix multiplication matches **rows with columns**; the inside shapes must agree. You can understand the result as **dot products, layers, weighted columns, or weighted rows**. A matrix can transform vectors and entire shapes; some matrices preserve length, while singular ones lose information.

The chapter then explains why **diagonal and symmetric matrices** have special multiplication rules, how Hadamard products differ from standard products, how the **Fourier transform** can be written as a matrix product, and how **Frobenius products, norms, and the asymmetry index** measure matrix relationships. There is no general matrix division: inverses need their own rules.

**Next:** Matrix Rank builds on these operations.
