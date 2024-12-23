# 2 Linear Algebra
## 2.1 Scalars, Vectors, Matrices and Tensors

Mathematical Objects of Linear Algebra:
1. Scalars:
    - a single number
    - We write scalars in **italics**
    - scalar uses **lowercase** variables
    - for example, $Let\ s\ \in N$ is to define scalar for Natural numbers.

2. Vectors:
    - an array of numbers
    - numbers is order preserved
    - identify each number by index
    - denotes with **bold** **lowercase** variable
    - each number in array denoted with **italic** with **subscript**
    - for example, first element in vector $x$ is $x_1$

    - if vector $x$ is set of $R$ by $n$ times
    $$
    x = \begin{bmatrix}
    x_1\\
    x_2\\
    x_3\\
    ...\\
    x_n
    \end{bmatrix}
    $$

    - Subset of vector $x$ is denoted as $S = \{ 1, 3, 6 \}$ as $x_s$, and element of S is index.
    - we use $-$ to express complement of a set, for example, $x_{-1}$ is vector $x$ without $x_1$, and $x_{-s}$ is without subset s, where s is the set of index.

3. Matrix
    - 2-D array of numbers. 
    - denote with **Uppercase Bold**
    - For example, Matrix $A$ with $m$ height and $n$ width, we have $A \in R^{m*n}$
    - For element, $A_{1, 1}$ is the upper left corner of the matrix $A$
    - $A_{1,:}$ is the first row of $A$ 
    - Matrix example
    $$
    \begin{bmatrix}
    A_{1,1}&&A_{1,2}\\
    A_{2,1}&&A_{2,2}
    \end{bmatrix}
    $$
    - We use expression of $f(A)_{i,j}$ to say applying function of $f$ to each element of matrix $A$
    
4. Tensors
    - multiple axes array of numbers

Operations:
- **transpose**
    - for Matrix $A$, its transpose is $(A^T)_{i,j} = A_{j,i}$
    - for vector we can have a row matrix $A = [x_1, x_2, x_3]$ tansposed into single column vector $x$, where $x = A^T$
    - scalar it's its own transpose, $a = a^T$

    - transpose example:

    $$
    A = \begin{bmatrix}
    A_{1,1}&A_{1,2}\\
    A_{2,1}&A_{2,2}\\
    A_{3,1}&A_{3,2}
    \end{bmatrix}
    \Rightarrow
    A^T\Rightarrow
    \begin{bmatrix}
    A_{1,1}&A_{2,1}&A_{3,1}\\
    A_{1,2}&A_{2,2}&A_{3,2}
    \end{bmatrix}
    $$
- **Add**
    - two matrix need to be in same shape, and we have
    $C_{i,j} = A_{i,j} + B_{i, j}$

- **scalars**
    - simply add scalar to each element
    $D_{i,j} = a*B_{i,j} + c$

- **Add Matrix and Vector**
    - $C_{i,j}=A_{i,j} + b_j$

## 2.2 Multiplying Matrices and Vectors
- matrix $A$ must have same number of columns as matrix $B$'s row number

$$
C_{i,j} = \displaystyle\sum_kA_{i,k}B_{k,j}
$$

for example, 
we have
$$
A = \begin{bmatrix}
3&7\\
4&9
\end{bmatrix}
,
B = \begin{bmatrix}
6&2\\
5&8
\end{bmatrix}
, then\ 
AB = \begin{bmatrix}
53&62\\
69&80
\end{bmatrix}
$$

- we have 
$$
A(B+C) = AB+AC
$$
$$
A(BC) = (AB)C
$$
$$
x^Ty = y^Tx
$$
$$
(AB)^T = B^TA^T
$$
$$
x^Ty = (x^Ty)^T = y^Tx
$$

- If we have $Ax = b$ where $A$ is $m$ rows and $n$ columns and $x$ is $n$ rows, b is $m$ rows.

$$A_{1,1}x_1 + A_{1,2}x_2 + ...+ A_{1,n}x_{n} = b_1$$
$$A_{2,1}x_1 + A_{2,2}x_2 + ...+ A_{2,n}x_{n} = b_2$$
...
$$A_{m,1}x_1 + A_{m,2}x_2 + ...+ A_{m,n}x_{n} = b_m$$

## 2.3 Identity and Inverse Matrices
