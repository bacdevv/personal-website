---
title: "Matrices — Linear Algebra, Chapter 2"
description: "A beginner-friendly introduction to matrices: shapes, special matrices, addition, scaling, transpose, complex values, trace, and broadcasting, with clear LaTeX and Python examples."
subject: Linear Algebra
date: "2026-10-09T08:00:00Z"
draft: false
tags:
  - linear-algebra
  - matrices
  - mathematics
---

> **About this chapter.** This is **Chapter 2: Introduction to Matrices**, based on lessons **31–40** of the supplied transcript. It follows [Chapter 1: Vectors](/notes/vectors/). I have kept the lessons in their original order, removed repeated speech, and explained each idea in simple English. The Python examples use only standard Python so you can run them in the blog's code playground. **Matrix–matrix multiplication is not taught in this transcript; it will come later.**

A **matrix** is a rectangular table of numbers. If a vector is one list, you can think of a matrix as several lists arranged in rows and columns.

## What you will learn

1. How to read a matrix's **shape**, entries, rows, and columns.
2. How to recognize common **special matrices**.
3. How to **add, subtract, and scale** matrices.
4. How **transpose**, **complex matrices**, **diagonal**, and **trace** work.
5. How **broadcasting** makes matrix arithmetic easier in Python, and when it can cause mistakes.

**Notation:** Bold uppercase letters such as $\mathbf{A}$ represent matrices. A normal lowercase letter such as $s$ or $\lambda$ is a single number, called a **scalar**. The entry in row $i$, column $j$ is $a_{ij}$.

---

## Part A — What is a matrix?

### 31. Matrix terminology and dimensionality

Consider this matrix:

$$
\mathbf{A}=\begin{bmatrix}
2 & 6 & 1\\
4 & 3 & 5
\end{bmatrix}.
$$

It has **2 rows and 3 columns**, so its **shape** (or size) is $2\times 3$.

$$
\boxed{\mathbf{A}\in\mathbb{R}^{m\times n}}
\qquad
\underbrace{m}_{\text{rows}}\times\underbrace{n}_{\text{columns}}
$$

Always say **rows first, columns second**. The lecture's memory trick is *Mr. Nice Guy*: **m rows, n columns**.

- **Entry / element:** one number inside a matrix.
- **Row:** one horizontal line of numbers.
- **Column:** one vertical line of numbers.
- **Index:** the entry's address, written $a_{ij}$ (row $i$, then column $j$).
- **Main diagonal:** $a_{11},a_{22},a_{33},\ldots$ (top-left to bottom-right).
- **Off-diagonal:** any entry that is not on the main diagonal.
- **Block matrix:** a larger matrix written as smaller matrix pieces.

In the example, $a_{12}=6$ and $a_{21}=4$. These are different positions. In mathematical notation, indices normally start at **1**; in Python, indices start at **0**.

A matrix can be described in several ways:

| View | Meaning for an $m\times n$ matrix |
|---|---|
| Shape | $m$ rows, $n$ columns |
| Number of values | $mn$ entries |
| Column vectors | $n$ vectors, each with $m$ entries (in $\mathbb{R}^m$) |
| Row vectors | $m$ vectors, each with $n$ entries (in $\mathbb{R}^n$) |

For instance, a $2\times3$ matrix and a $3\times2$ matrix both contain **six numbers**, but they do **not** have the same shape. This is why the word *dimension* can be confusing for matrices. When checking operations, use **shape**.

A matrix is a 2D arrangement of entries. Arrays with more axes are often called *higher-order arrays* or *tensors*; this chapter stays with ordinary matrices.

**Python — inspect a matrix:**

```python
A = [[2, 6, 1],
     [4, 3, 5]]

rows = len(A)
cols = len(A[0])
print("Shape:", (rows, cols))       # (2, 3)
print("Row 1:", A[0])              # [2, 6, 1]
print("Column 2:", [r[1] for r in A])
print("a_12:", A[0][1])            # 6
```

**Important:** A Python list of lists *represents* a matrix here, but NumPy arrays are more convenient for large numerical calculations. Plain lists do not automatically follow matrix arithmetic rules.

### 32. A zoo of matrices: learn the main types

A matrix is often named after a useful pattern. Several names can apply to the **same** matrix.

#### Square and rectangular matrices

A **square** matrix has the same number of rows and columns ($n\times n$). In this course, a **rectangular** matrix means a non-square matrix ($m\ne n$):

$$
\text{Square: }\begin{bmatrix}1&2\\3&4\end{bmatrix}
\qquad
\text{Non-square: }\begin{bmatrix}1&2&3\\4&5&6\end{bmatrix}.
$$

#### Symmetric and skew-symmetric matrices

A **symmetric** matrix mirrors across its main diagonal:

$$
\mathbf{S}=\begin{bmatrix}2&4\\4&7\end{bmatrix},
\qquad\boxed{\mathbf{S}^T=\mathbf{S}}.
$$

A **skew-symmetric** matrix mirrors with the signs reversed:

$$
\mathbf{K}=\begin{bmatrix}0&-3\\3&0\end{bmatrix},
\qquad\boxed{\mathbf{K}^T=-\mathbf{K}}.
$$

**Why are the diagonal values of a skew-symmetric matrix zero?** Every diagonal entry must equal its own negative: $a_{ii}=-a_{ii}$. Over the real or complex numbers, this means $a_{ii}=0$. Both symmetric and skew-symmetric matrices must be **square**.

#### Identity, zero, and diagonal matrices

The **identity matrix** behaves like the number $1$ in appropriately sized matrix multiplication:

$$
\mathbf{I}_3=\begin{bmatrix}
1&0&0\\0&1&0\\0&0&1
\end{bmatrix}.
$$

The **zero matrix** contains only zeros. A **diagonal matrix** has zeros everywhere **except possibly on** its main diagonal:

$$
\mathbf{0}_{2\times2}=\begin{bmatrix}0&0\\0&0\end{bmatrix},
\qquad
\mathbf{D}=\begin{bmatrix}5&0&0\\0&0&0\\0&0&-2\end{bmatrix}.
$$

A diagonal entry **may be zero**. The identity is a special diagonal matrix with all diagonal entries equal to $1$. A diagonal matrix with the same scalar on each diagonal position can be written $s\mathbf{I}$.

#### Upper and lower triangular matrices

An **upper triangular** matrix has zeros **below** the main diagonal. A **lower triangular** matrix has zeros **above** it:

$$
\mathbf{U}=\begin{bmatrix}2&4&1\\0&3&5\\0&0&7\end{bmatrix},
\quad
\mathbf{L}=\begin{bmatrix}2&0&0\\4&3&0\\1&5&7\end{bmatrix}.
$$

#### Augmented or concatenated matrices

Two matrices with the **same number of rows** can be joined side by side:

$$
\left[\begin{array}{cc|c}
1&2&9\\3&4&8
\end{array}\right].
$$

The vertical bar is only a visual separator. If $\mathbf{A}$ is $m\times p$ and $\mathbf{B}$ is $m\times q$, the joined matrix $[\mathbf{A}\mid\mathbf{B}]$ is $m\times(p+q)$.

**Python — build common special matrices:**

```python
n = 3
identity = [[int(i == j) for j in range(n)] for i in range(n)]
zeros = [[0 for j in range(n)] for i in range(n)]
diagonal_values = [2, 5, -1]
diagonal = [[diagonal_values[i] if i == j else 0
             for j in range(n)] for i in range(n)]

print("Identity:", identity)
print("Zeros:", zeros)
print("Diagonal:", diagonal)
```

**Python — test symmetry:**

```python
A = [[2, 4], [4, 7]]
B = [[0, -3], [3, 0]]

is_symmetric = all(A[i][j] == A[j][i]
                   for i in range(2) for j in range(2))
is_skew = all(B[i][j] == -B[j][i]
              for i in range(2) for j in range(2))
print("A is symmetric:", is_symmetric)  # True
print("B is skew-symmetric:", is_skew)  # True
```

**Remember:** The names describe the *pattern*. They do not necessarily describe the size or the values of every entry.

---

## Part B — Arithmetic with matrices

### 33. Matrix addition, subtraction, and shifting

For **ordinary** matrix addition or subtraction, the matrices must have **exactly the same shape**. Add or subtract the entries at the same row and column.

$$
\mathbf{A}=\begin{bmatrix}1&2\\3&4\end{bmatrix},\quad
\mathbf{B}=\begin{bmatrix}5&-1\\2&6\end{bmatrix}.
$$

$$
\mathbf{A}+\mathbf{B}=\begin{bmatrix}6&1\\5&10\end{bmatrix},\qquad
\mathbf{A}-\mathbf{B}=\begin{bmatrix}-4&3\\1&-2\end{bmatrix}.
$$

The entry rule is:

$$
(\mathbf{A}\pm\mathbf{B})_{ij}=a_{ij}\pm b_{ij}.
$$

**Useful addition rules:**

$$
\mathbf{A}+\mathbf{B}=\mathbf{B}+\mathbf{A}
\qquad\text{and}\qquad
\mathbf{A}+(\mathbf{B}+\mathbf{C})=(\mathbf{A}+\mathbf{B})+\mathbf{C}.
$$

These are called **commutative** (order does not matter) and **associative** (grouping does not matter).

**Python — add and subtract without NumPy:**

```python
A = [[1, 2], [3, 4]]
B = [[5, -1], [2, 6]]

add = [[A[i][j] + B[i][j] for j in range(2)] for i in range(2)]
subtract = [[A[i][j] - B[i][j] for j in range(2)] for i in range(2)]
print("A + B =", add)
print("A - B =", subtract)
```

#### Matrix shifting: change only the diagonal

For a **square** matrix, we can add a multiple of the identity:

$$
\boxed{\mathbf{A}_{\text{shifted}}=\mathbf{A}+\lambda\mathbf{I}_n}.
$$

For example:

$$
\begin{bmatrix}1&2\\3&4\end{bmatrix}
+2\begin{bmatrix}1&0\\0&1\end{bmatrix}
=\begin{bmatrix}3&2\\3&6\end{bmatrix}.
$$

Only the **diagonal entries** increase by $\lambda$. The transcript introduces this as *matrix shifting*, an idea used in regularization in numerical computing and machine learning. We will revisit why it helps in later chapters.

```python
A = [[1, 2], [3, 4]]
shift = 2
shifted = [[A[i][j] + (shift if i == j else 0)
            for j in range(2)] for i in range(2)]
print(shifted)  # [[3, 2], [3, 6]]
```

### 34. Matrix–scalar multiplication

A **scalar** is one number. To multiply a matrix by a scalar, multiply **every entry** by that number:

$$
3\begin{bmatrix}1&-2\\0&4\end{bmatrix}
=\begin{bmatrix}3&-6\\0&12\end{bmatrix}.
$$

$$
(s\mathbf{A})_{ij}=s\,a_{ij},
\qquad\boxed{s\mathbf{A}=\mathbf{A}s}.
$$

You may write the scalar before or after the matrix; this is **not** the same question as swapping the order of two matrices in matrix multiplication.

```python
A = [[1, -2], [0, 4]]
s = 3
scaled = [[s * value for value in row] for row in A]
print(scaled)  # [[3, -6], [0, 12]]
```

### 35. Code challenge: is scalar multiplication linear?

**The transcript's question:** Does multiplying by a scalar obey the distributive rule?

$$
\boxed{s(\mathbf{A}+\mathbf{B})=s\mathbf{A}+s\mathbf{B}}.
$$

**Why yes?** Look at one entry:

$$
s(a_{ij}+b_{ij})=sa_{ij}+sb_{ij}.
$$

It works for each entry, so it works for the whole matrix. This is the simple reason behind the rule—not merely an observation from code.

**Try the challenge in Python:**

```python
A = [[1.2, -3.0], [4.1, 2.2]]
B = [[2.0, 5.1], [-1.1, 0.8]]
s = 1.7

left = [[s * (A[i][j] + B[i][j]) for j in range(2)]
        for i in range(2)]
right = [[s * A[i][j] + s * B[i][j] for j in range(2)]
         for i in range(2)]

print("Left:", left)
print("Right:", right)
print("Almost equal:", all(abs(left[i][j] - right[i][j]) < 1e-10
                           for i in range(2) for j in range(2)))
```

**Computer note:** Decimal values may differ by extremely small rounding errors, such as $10^{-15}$. For numerical tests, compare with a small tolerance instead of demanding exact equality.

---

## Part C — Turn rows into columns

### 36. Transpose

**Transpose** means exchanging rows and columns. A matrix with shape $m\times n$ becomes a matrix with shape $n\times m$.

$$
\mathbf{A}=\begin{bmatrix}1&2&3\\4&5&6\end{bmatrix}
\quad\Longrightarrow\quad
\mathbf{A}^{T}=\begin{bmatrix}1&4\\2&5\\3&6\end{bmatrix}.
$$

The first **row** becomes the first **column** (or the first column becomes the first row). Transpose does **not** mean rotating the drawing by $90^\circ$.

The entry rule is:

$$
(\mathbf{A}^T)_{ij}=a_{ji},\qquad
\boxed{(\mathbf{A}^T)^T=\mathbf{A}}.
$$

Transpose also gives the formal tests for special matrices:

$$
\mathbf{S}^T=\mathbf{S}\quad\text{(symmetric)},
\qquad
\mathbf{K}^T=-\mathbf{K}\quad\text{(skew-symmetric)}.
$$

**Python — transpose a list of lists:**

```python
A = [[1, 2, 3], [4, 5, 6]]
AT = [list(column) for column in zip(*A)]
print("A:", A)
print("A transpose:", AT)  # [[1, 4], [2, 5], [3, 6]]
print("Shape:", (len(AT), len(AT[0])))  # (3, 2)
```

**NumPy translation:** For a 2D NumPy array, `A.T` is the transpose, and `np.transpose(A)` does the same thing. A plain Python list does not have `.T`.

### 37. Complex matrices and the Hermitian transpose

A **complex number** has a real part and an imaginary part:

$$
z=a+bi,\qquad i^2=-1.
$$

A **complex matrix** has at least one complex-valued entry, for example:

$$
\mathbf{C}=\begin{bmatrix}1+2i&3\\-i&4-i\end{bmatrix}.
$$

There are **two different operations**:

- **Ordinary transpose $\mathbf{C}^T$:** exchange rows and columns; do **not** change signs.
- **Hermitian transpose $\mathbf{C}^H$:** exchange rows and columns **and** replace every $a+bi$ with $a-bi$. This is also called the *conjugate transpose*.

$$
\mathbf{C}^{T}=\begin{bmatrix}1+2i&-i\\3&4-i\end{bmatrix},
\qquad
\mathbf{C}^{H}=\begin{bmatrix}1-2i&i\\3&4+i\end{bmatrix}.
$$

Only the **imaginary part** changes its sign during conjugation. Real values remain unchanged. For a real matrix, $\mathbf{C}^H=\mathbf{C}^T$.

**Python — compare ordinary and Hermitian transpose:**

```python
C = [[1 + 2j, 3], [-1j, 4 - 1j]]
ordinary = [list(column) for column in zip(*C)]
hermitian = [[value.conjugate() for value in row]
             for row in ordinary]
print("Transpose:", ordinary)
print("Hermitian transpose:", hermitian)
```

**Python vs MATLAB:** In NumPy, `A.T` gives the **ordinary** transpose, even for complex arrays; use `A.conj().T` for the Hermitian transpose. In MATLAB, the `'` operator performs the conjugate transpose; `.'` performs the ordinary transpose. This difference is easy to miss.

---

## Part D — Diagonal and trace

### 38. Extract the diagonal and calculate trace

The **diagonal** exists even in a **non-square** matrix. It simply stops at whichever edge comes first.

For example:

$$
\mathbf{A}=\begin{bmatrix}
2&5&7\\3&-1&4
\end{bmatrix},
\qquad
\operatorname{diag}(\mathbf{A})=\begin{bmatrix}2\\-1\end{bmatrix}.
$$

For $\mathbf{A}\in\mathbb{R}^{m\times n}$, there are $\min(m,n)$ entries on the main diagonal.

**Trace** is the **sum of the diagonal entries of a square matrix**:

$$
\boxed{\operatorname{tr}(\mathbf{A})=\sum_{i=1}^{n}a_{ii}}
\qquad(\mathbf{A}\in\mathbb{R}^{n\times n}).
$$

Example:

$$
\mathbf{B}=\begin{bmatrix}3&8&1\\2&-2&0\\7&4&5\end{bmatrix},
\qquad
\operatorname{tr}(\mathbf{B})=3+(-2)+5=6.
$$

**Do not confuse these actions:**

- *Extracting a diagonal* takes a matrix and returns a vector.
- *Creating a diagonal matrix* takes a vector and puts its values on the diagonal, with zeros elsewhere.
- *Diagonalizing a matrix* is a **different**, more advanced topic for a future chapter.

**Why useful?** In a covariance matrix (used in statistics and PCA), the diagonal entries are the **variances** of the individual variables. Trace is one way to add up those diagonal variances.

**Python — diagonal and trace:**

```python
A = [[3, 8, 1],
     [2, -2, 0],
     [7, 4, 5]]

diag = [A[i][i] for i in range(len(A))]
trace = sum(diag)
print("Diagonal:", diag)  # [3, -2, 5]
print("Trace:", trace)    # 6
```

### 39. Code challenge: is trace a linear operation?

**The transcript asks us to test two rules** for square matrices of the same size:

$$
\boxed{\operatorname{tr}(\mathbf{A}+\mathbf{B})
=\operatorname{tr}(\mathbf{A})+\operatorname{tr}(\mathbf{B})}
$$

$$
\boxed{\operatorname{tr}(s\mathbf{A})=s\operatorname{tr}(\mathbf{A})}.
$$

**Why do both work?** Trace just sums diagonal entries, and adding those numbers obeys the usual arithmetic rules:

$$
\begin{aligned}
\operatorname{tr}(\mathbf{A}+\mathbf{B})
&=\sum_i(a_{ii}+b_{ii})\\
&=\sum_i a_{ii}+\sum_i b_{ii},\\
\operatorname{tr}(s\mathbf{A})
&=\sum_i sa_{ii}=s\sum_i a_{ii}.
\end{aligned}
$$

That is what it means for trace to be **linear**. Experimenting with numbers is useful, but these algebra steps explain **why** it is true.

**Python — reproduce the challenge:**

```python
A = [[1, 2], [3, 4]]
B = [[5, 6], [7, 8]]
s = 3

trace = lambda M: sum(M[i][i] for i in range(len(M)))
plus = [[A[i][j] + B[i][j] for j in range(2)]
        for i in range(2)]
scaled = [[s * value for value in row] for row in A]

print(trace(plus), trace(A) + trace(B))  # 18 18
print(trace(scaled), s * trace(A))      # 15 15
```

---

## Part E — Broadcasting: a practical Python idea

### 40. Broadcasting matrix arithmetic

In **ordinary matrix addition**, two matrices need exactly the same shape. In numerical software, **broadcasting** is a shortcut that **repeats** a smaller array across compatible positions so you can do element-by-element arithmetic without copying it by hand.

Think of this matrix with **3 rows and 4 columns**:

$$
\mathbf{A}=\begin{bmatrix}
1&2&3&4\\
5&6&7&8\\
9&10&11&12
\end{bmatrix}.
$$

#### Add a row vector to every row

Let $\mathbf{r}=[10,20,30,40]$. Broadcasting adds it to each row:

$$
\mathbf{A}+_{\text{broadcast}}\mathbf{r}
=\begin{bmatrix}
11&22&33&44\\
15&26&37&48\\
19&30&41&52
\end{bmatrix}.
$$

The row vector has **4 values**, matching the matrix's **4 columns**.

#### Add a column vector to every column

Let $\mathbf{c}=[100,200,300]^T$. Its **3 values** match the **3 rows**:

$$
\mathbf{A}+_{\text{broadcast}}\mathbf{c}
=\begin{bmatrix}
101&102&103&104\\
205&206&207&208\\
309&310&311&312
\end{bmatrix}.
$$

**Python — what broadcasting does, step by step:**

```python
A = [[1, 2, 3, 4],
     [5, 6, 7, 8],
     [9, 10, 11, 12]]
row = [10, 20, 30, 40]
col = [100, 200, 300]

add_to_rows = [[value + row[j] for j, value in enumerate(line)]
               for line in A]
add_to_cols = [[value + col[i] for value in line]
               for i, line in enumerate(A)]

print("Add to rows:", add_to_rows)
print("Add to columns:", add_to_cols)
```

In NumPy, the same idea is concise:

- `A + np.array([10, 20, 30, 40])` adds to each row of a $(3,4)$ array.
- `A + np.array([100, 200, 300]).reshape(3, 1)` adds to each column.

**Why `.reshape(3, 1)`?** A NumPy array with shape `(3,)` has no explicit column orientation. Shaping it as `(3, 1)` tells NumPy to repeat its three values across the four columns. A `(3,)` array does **not** automatically work as a column for a `(3, 4)` matrix.

NumPy matches dimensions from the **right**: for each pair of axes, the sizes must be equal or one of them must be $1$. This is a useful programming extension, not a change to the ordinary same-shape rule in abstract linear algebra. Broadcasting also works with subtraction and **element-wise** multiplication/division. Element-wise multiplication is not matrix–matrix multiplication.

#### The reshape order detail from the transcript

When arranging the numbers $1,\ldots,12$ into a $3\times4$ matrix, the result depends on the reshape order:

- **C order (row by row):** first row is `[1, 2, 3, 4]`.
- **F order (column by column):** first column is `[1, 2, 3]`.

NumPy writes these as `reshape(3, 4, order="C")` and `reshape(3, 4, order="F")`. Neither is universally correct; the right choice depends on your task. The transcript compares this distinction with MATLAB's column-oriented behavior.

#### A beginner's warning

Broadcasting is convenient, but it can **silently do something different from what you meant**. Always check the shapes before running numerical code. This matters a lot in machine learning.

---

## One-page formula sheet

| Topic | Formula or condition | Meaning |
|---|---|---|
| Matrix shape | $\mathbf{A}\in\mathbb{R}^{m\times n}$ | $m$ rows and $n$ columns |
| One entry | $a_{ij}$ | Row $i$, column $j$ |
| Addition | $(\mathbf{A}+\mathbf{B})_{ij}=a_{ij}+b_{ij}$ | Shapes must match |
| Scalar multiplication | $(s\mathbf{A})_{ij}=sa_{ij}$ | Scale every entry |
| Shifting | $\mathbf{A}+\lambda\mathbf{I}_n$ | Change the diagonal of a square matrix |
| Transpose | $(\mathbf{A}^T)_{ij}=a_{ji}$ | Switch rows and columns |
| Double transpose | $(\mathbf{A}^T)^T=\mathbf{A}$ | Back to original |
| Symmetric | $\mathbf{A}^T=\mathbf{A}$ | Mirror across diagonal |
| Skew-symmetric | $\mathbf{A}^T=-\mathbf{A}$ | Mirror with opposite sign |
| Hermitian transpose | $\mathbf{A}^H=\overline{\mathbf{A}}^{T}$ | Transpose + complex conjugate |
| Trace | $\operatorname{tr}(\mathbf{A})=\sum_i a_{ii}$ | Add diagonal entries, for square matrices |
| Trace linearity | $\operatorname{tr}(s\mathbf{A}+\mathbf{B})=s\operatorname{tr}(\mathbf{A})+\operatorname{tr}(\mathbf{B})$ | Valid for equally sized square matrices |
| Broadcasting | Compatible axis sizes match or one is $1$ | Numerical-software rule |

## Common mistakes and how to avoid them

1. **Saying a $2\times3$ matrix has 3 rows.** Read rows first, columns second.
2. **Treating $a_{12}$ as row 2, column 1.** The first index is the row.
3. **Checking only the number of entries.** A $2\times3$ and a $3\times2$ matrix each have 6 values, but ordinary addition is not defined between them.
4. **Thinking all diagonal entries must be nonzero.** A diagonal matrix can have zeros on its diagonal.
5. **Confusing transpose with rotation.** Rows become columns without reversing their order.
6. **Using ordinary transpose for complex inner products.** Sometimes you need the Hermitian (conjugate) transpose.
7. **Computing trace for a non-square matrix.** This course defines trace for square matrices only.
8. **Writing `A + B` for Python nested lists and expecting matrix addition.** Lists concatenate or raise errors; use element loops or NumPy arrays.
9. **Thinking `(3,)` means a column vector in NumPy.** Use `(3, 1)` for an explicit column.
10. **Assuming broadcasting is always wanted.** An operation can succeed in code and still be conceptually wrong.

## Check your understanding (10 questions)

Try to answer these before reading the solutions.

1. Matrix $\mathbf{A}$ has 4 rows and 7 columns. What is its shape? How many entries are there?
2. If $a_{23}=9$, where is the number 9?
3. Can you add a $2\times3$ matrix to a $3\times2$ matrix? Why?
4. Must a skew-symmetric matrix have zeros on the diagonal?
5. If $\mathbf{A}=\begin{bmatrix}1&2\\3&4\end{bmatrix}$, what is $\mathbf{A}+2\mathbf{I}$?
6. If $\mathbf{A}$ has shape $2\times5$, what is the shape of $\mathbf{A}^T$?
7. How does $\mathbf{A}^H$ differ from $\mathbf{A}^T$ for a complex matrix?
8. What is the trace of $\begin{bmatrix}2&8\\-3&5\end{bmatrix}$?
9. Is $\operatorname{tr}(3\mathbf{A})=3\operatorname{tr}(\mathbf{A})$ true for square $\mathbf{A}$?
10. For a NumPy matrix with shape `(3, 4)`, why do we reshape a 3-element vector to `(3, 1)` before adding it by rows (one value for each matrix row)?

### Answers to the 10 questions

1. Shape $4\times7$, with $28$ entries.
2. Row 2, column 3.
3. No. The shapes differ; equal entry counts are not enough.
4. Yes, since $a_{ii}=-a_{ii}$.
5. $\begin{bmatrix}3&2\\3&6\end{bmatrix}$.
6. $5\times2$.
7. The Hermitian transpose also conjugates complex entries (flips signs of imaginary parts).
8. $2+5=7$.
9. Yes. The trace operator is linear.
10. `(3, 1)` makes the 3 values align with 3 matrix rows and repeat across 4 columns. A `(3,)` array aligns from the right and does not fit a `(3, 4)` array.


## End-of-chapter recap

A **vector** stores an ordered list of values; a **matrix** arranges values in rows and columns. Before any matrix operation, check the **shape**. Addition works entry by entry, multiplication by a scalar scales every entry, and transpose swaps the row and column positions. Symmetry, diagonal structure, and trace give special meaning to square matrices. Broadcasting is a practical shortcut used in Python and machine learning—but you should always know **what is being repeated and why**.

**Next chapter:** Matrix–matrix multiplication and its rules, when those lessons are provided. This chapter is complete on its own and can be expanded with new notes later.
