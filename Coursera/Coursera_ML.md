- Supervised Learning
    - give machine input x and output y as data, and let machine predict y with x in the future
    - linear regression or curve regression. Regression means predict a y among infinite numbers.

    - classification algorithm
        - predict value is finite number, small, limited set of numbers, categories
        - class/category will be used interchangebly


- Unsupervised Learning
    - The data does not label y, or any "right" data
    - we need to find patterns, or structures, or relations from the data ourselves
    - for example, cluster algorithm, we find the data point is clustered into 2 different groups

# Linear Regression
- Training set
    - train model to learn training set
    - $x$, as house size, is input feature, and called input variable too
    - $y$, as house price, is target variable, and called output variable too
    - each row represent a training example
    - m is the total number of training example
    - $(x^{(i)}, y^{(i)})$ to represent ith training example in the training set.

    - we have training set and then input the training set into learning algorithm, then the learning algorithm produce a function $f$, which is called hypothesis. That $f$ can take a new input and pridict y-hat $\widehat{y}$

    for example, the house size and price sample:

    $f_{w,b}(x) = wx + b$ so this is linear regression with 1 single input variable of x, or so called univariate linear regression.

```python
import numpy as np
import matplotlib.pyplot as plt

# create an array full of 0
z = np.zeros(3)
z
# array([0,0,0])

# create an one dimension array
x = np.array([1, 2, 3, 4])

# visit shape of the array, and return the first dimension size
x.shape[0]

_2d = np.array([(1,2,3,4),(5,6,7,8)])
_2d.shape
# (2, 4)

_3d = np.array([[1,2],[3,4],[5,6]])
_3d.shape
# (3, 2)

# draw scatter plot, which draw each training example as "x", and color red
plt.scatter(x_train, y_train, marker="x", c="r")

# draw plot, which take x and y and draw a blue line
plt.plot(x_train, y_train, c="b")
```

- Cost function
    - tell us how well our model is doing
    - our example $f_{w, b}(x) = wx + b$, the w and b are called parameters, these could be improved/adjust during the model training, they are also called coefficients or weights
    
    - So cost function of $f_{w, b} = wx + b$ could be calculated as $J(w,b) =  \frac{1}{2m} \sum_{i = 1}^m{(f_{w,b}(x^{(i)})- y^{(i)})^2}$. Where, this states that we want sum of square of the error, where each error at ith training example is $y^{(i)} - \widehat{y}^{(i)}$

    - With squared error cost function, the J is always shaped like a bowl or hammock, where the bottom of the shape is the minimized value of J.

    - final formula with derivatives:
        $$
            \frac{d}{dw}J(w, b) = \frac{1}{m} \sum_{i=1}^m(wx^{(i)} + b - y^{(i)})x^{(i)}
            = \frac{1}{m} \sum_{i=1}^m(f_{w,b}(x^{(i)}) - y^{(i)})x^{(i)}
        $$
        $$
            \frac{d}{db}J(w, b) = \frac{1}{m} \sum_{i=1}^m(wx^{(i)} + b - y^{(i)})
            = \frac{1}{m} \sum_{i=1}^m(f_{w,b}(x^{(i)}) - y^{(i)})
        $$
    
- Gradient Descent
    - the principle is, each step, adjust w and b simultaneously, and always find the steepest change(decrease) on J to the next step, where J is the cost, or difference of training example y and estimated y, until we reach the bottom of the valley. (where J is minimized)
    $$ 
        tmp\_w = w - \alpha \frac{d}{dw}J(w,b)
    $$
    $$
        tmp\_b = b - \alpha \frac{d}{db}J(w,b)
    $$
    $$
        w = tmp\_w, b = tmp\_b 
    $$

    - To understand this, imagine the model is single parameterized with w, so that 
        $w = w - \alpha \frac{d}{dw}J(w)$, is the whole process, because when the tagent line(derivative) is positive, that means next w is decreasing, and leading the J(w) more closer to the bottom of the bowl shape.

    - Convex function, the function has bowl shape that only has one local/global minima

    - batch gradient descent, is the one that every step we consider all the training examples, instead of subset of training examples.

- Vector
    - ordered arrays of numbers, or something in same type
    - denoted as lower and bold letter such as $ \bold x$
    - the length of array is called dimension, or rank in math
    - the first / 0-indexed element in vector is denoted $ x_0 $, no bold
    
    - NumPy
        - basic data structure is an indexable, n-dimensional array in `dtype`, now we are using 1-D arrays, which shape is `(n, )`, where n is length of that array

```python
# all in float64
a = np.zeros(4)
a
# [0. 0. 0. 0.] 

a = np.zeros((4, ))
a
# [0. 0. 0. 0.]

a = np.random.random_sample(4)
a
# [0.30399562 0.66090592 0.5716815 0.466666743]

a = np.arrange(4.)
a
# [0. 1. 2. 3.]

a = np.random.rand(4)
a
# [0.26086281 0.64821136 0.52117968 0.01779252]

a = np.array([5,4,3,2])
a
# [5 4 3 2]

a = np.array([5.,4,3,2]);
a
# [5. 4. 3. 2.]

#vector slicing operations
a = np.arange(10)
print(f"a         = {a}")

#access 5 consecutive elements (start:stop:step)
c = a[2:7:1];     print("a[2:7:1] = ", c)

# access 3 elements separated by two 
c = a[2:7:2];     print("a[2:7:2] = ", c)

# access all elements index 3 and above
c = a[3:];        print("a[3:]    = ", c)

# access all elements below index 3
c = a[:3];        print("a[:3]    = ", c)

# access all elements
c = a[:];         print("a[:]     = ", c)

# a         = [0 1 2 3 4 5 6 7 8 9]
# a[2:7:1] =  [2 3 4 5 6]
# a[2:7:2] =  [2 4 6]
# a[3:]    =  [3 4 5 6 7 8 9]
# a[:3]    =  [0 1 2]
# a[:]     =  [0 1 2 3 4 5 6 7 8 9]

a = np.array([1,2,3,4])
print(f"a             : {a}")
# negate elements of a
b = -a 
print(f"b = -a        : {b}")

# sum all elements of a, returns a scalar
b = np.sum(a) 
print(f"b = np.sum(a) : {b}")

b = np.mean(a)
print(f"b = np.mean(a): {b}")

b = a**2
print(f"b = a**2      : {b}")

# a             : [1 2 3 4]
# b = -a        : [-1 -2 -3 -4]
# b = np.sum(a) : 10
# b = np.mean(a): 2.5
# b = a**2      : [ 1  4  9 16]

a = np.array([ 1, 2, 3, 4])
b = np.array([-1,-2, 3, 4])
print(f"Binary operators work element wise: {a + b}")
# Binary operators work element wise: [0 0 6 8]

#try a mismatched vector operation
c = np.array([1, 2])
try:
    d = a + c
except Exception as e:
    print("The error message you'll see is:")
    print(e)
# The error message you'll see is:
# operands could not be broadcast together with shapes (4,) (2,) 

a = np.array([1, 2, 3, 4])

# multiply a by a scalar
b = 5 * a 
print(f"b = 5 * a : {b}")
# b = 5 * a : [ 5 10 15 20]


# test 1-D
a = np.array([1, 2, 3, 4])
b = np.array([-1, 4, 3, 2])
c = np.dot(a, b)
print(f"NumPy 1-D np.dot(a, b) = {c}, np.dot(a, b).shape = {c.shape} ") 
c = np.dot(b, a)
print(f"NumPy 1-D np.dot(b, a) = {c}, np.dot(a, b).shape = {c.shape} ")
# NumPy 1-D np.dot(a, b) = 24, np.dot(a, b).shape = () 
# NumPy 1-D np.dot(b, a) = 24, np.dot(a, b).shape = () 


# equivalent code
a = np.arange(6).reshape(-1, 2) # where -1 means automatically figure out the column/row
a = np.arange(6).reshape(3, 2)
```

- Matrix
    - is a 2 dimensional arrays, where m is the row length and n is the column length.
    
# Multiple Features of Linear Regression
$$
f_{\vec{w}, b}(\vec{x}) = w_1x_1 + w_2x_2 + ... + w_nx_x + b, where\ \vec{w} = [w_1, w_2, w_3, ...., w_n], and\ \vec{x} = [x_1, x_2, x_3, ..., x_n]
$$
$$
    w_1 = w_1 - \alpha \frac{1}{m} \sum_{i=1}^m(f_{\vec{w},b}(\vec{x}^{(i)})- y^{(i)})x_1^{(i)}
$$

$$
    w_n = w_n - \alpha \frac{1}{m} \sum_{i=1}^m(f_{\vec{w},b}(\vec{x}^{(i)})- y^{(i)})x_n^{(i)}
$$

$$
    b = b - \alpha \frac{1}{m} \sum_{i=1}^m(f_{\vec{w},b}(\vec{x}^{(i)})- y^{(i)})
$$

- for Python Code:
```python
w = np.array([1.0, 2.5, 3.3])
b = 4
x = np.array([10, 20, 30])

# unhappy way:
f = w[0] * x[0] + w[1] * x[1] + w[2] * x[2] + b

# Ok way
f = 0
for j in range(0, n):
    f = f + w[j] * x[j]
f = f + b

# happy way
f = np.dot(w, x) + b
```


- Normal Equation

- Feature Scaling
    - when features' range has huge difference among each other, it will take more step to get to the bottom of bowl shape. for example, the number of bed room and thousands of square feet of the house area. In this case, small change on the large scale feature, thousands of square feet of area, will make greate impact on the prediction, and the cost, the contour map also shaped as unbalanced eclipses.

    - the solution is feature scaling, for example, if the area range `300 < area < 2000`, then we can devide the area by 2000, so that teh area range `0.15 < area < 1` and # of bed room devide the max, becomes `0.2 < room < 1`. the contour map will shape more like circle this way, so that it's faster to get to the lowest cost function point.

    - mean normalization method, we calculate the mean value.
        room = r - M / 5 - 1  =>   -0.46 <= r <= 0.54
        area = a - M / 2000-300    -0.18 <= a <= 0.82
    $$
    x_2 = \frac{x_2 - \mu_2}{max(x_2) - min(x_2)}
    $$
    $$
    $$

    - z-score normalization
    $$
        room = r - M / standard deviation
    $$
    $$
        area = a - M / standard deviation
    $$
    just rescale the features that range very differently from other features, and basically keep range between -1 and 1.

    -standard deviation:
        $$\sigma = \sqrt{\frac{1}{N}\sum^{N}_{i=1}(x_i - \mu)^2}$$

    for example: if we have 
    |feature and range|treatment|
    |-|-|
    |0<=$x_1$<=3|OK|
    |-2<=$x_2$<=0.5|OK|
    |-100<=$x_3$<=100|rescale, too big|
    |-0.001<=$x_4$<=0.001|rescale, too small|

    **our goal is** for each feature, range from -1 to 1 or -3 to 3 or -0.3 to 0.3 are OKs

- Decide if Gradient Descent is converging(working well)

try 3 times learning rate when picking the learning rate, for example, first choose 0.001, and then 0.003, and then 0.01, and then 0.03 etc.

- Classification
    - Binary classification where there are only two class/category possible
    - false, 0, are called negative class, and true, 1 are called positive class

# Logistic regression model

    
$$
f_{\vec{w}, b} = \frac{1}{1+e^{-(\vec{w}\vec{x} + b)}}
$$

if threshold needs to be 0.5, then $-(\vec{w}\vec{x} + b)$ needs to be 0, so when $\vec{w}\vec{x} + b = 0$ is called the decision boundry line.

- Logistic Loss Function
    - if we use square error which is used in the linear/polynomial regression model, we will never able to use gradient descent since the error function is not convex. Meaning there are so many local minimum point on the graph, and gradient descent will be trapped in local, and not get to the global minimum.

    - new cost function:
    $$
        J(\vec{w}, b) = \frac{1}{m}\sum_{i=1}^m\frac{1}{2}(f_{\vec{w}, b}(\vec{x}^{(i)}) - y^{(i)})^2
    $$

    and, we will call the part $\frac{1}{2}(f_{\vec{w}, b}(\vec{x}^{(i)}) - y^{(i)})^2$, loss function

    when target (y value) equals to 1, our $\vec{w}\vec{x} + b$ part must equal to $\infty$,. and target(y value) equals to 0 our $1 + e^{-(\vec{w}\vec{x} + b)}$ part must equalt to -$\infty$.

    so, 

    $$
    \begin{cases}
    -log(f_{\vec{w}, b}(\vec{x}^{(i)})), when\  y^{(i)} = 1\\
    -log(1-f_{\vec{w}, b}(\vec{x}^{(i)})), when \ y^{(i)} = 0
    \end{cases}
    $$

    or

    $$
    J(\vec{w}, b) = \frac{1}{m}\sum_{i=1}^m[y^{(i)}log(f_{\vec{w}, b}(\vec{x}^{(i)}))+(1-y^{(i)})log(1-f_{\vec{w}, b}(\vec{x}^{(i)}))]
    $$

    - Gradient Descent of Logistic Regression
        $$
        w_j = w_j - \sigma[\frac{1}{m}\sum_{i=1}^m(f_{\vec{w},b}(\vec{x}^{(i)})-y^{(i)})x_j^{(i)}]
        $$
        $$
        b = b - \sigma[\frac{1}{m}\sum_{i=1}^m(f_{\vec{w},b}(\vec{x}^{(i)})-y^{(i)})]
        $$

# Regularization, do this when there's a overfitting

## linear regression
- cost function
$$
J(\vec{w}, b) = \frac{1}{2m}\sum^m_{i=1}((\vec{w}\cdot\vec{x}+b) - y^{(i)})^2 + \frac{\lambda}{2m}\sum^n_{j=1}w_j^2
$$
- Derivative
$$
\begin{gather}
\frac{\partial}{\partial w_j}J(\vec{w}, b) = \frac{\partial}{\partial w_j}[\frac{1}{2m}\sum^m_{i=1}((\vec{w}\cdot\vec{x}+b) - y^{(i)})^2 + \frac{\lambda}{2m}\sum^n_{j=1}w_j^2] \\
= \frac{1}{2m}\sum^m_{i=1}[(\vec{w}\cdot\vec{x}^{(i)} + b - y^{(i)})2x_j^{(i)}] + \frac{\lambda}{2m}2w_j\\
= \frac{1}{m}\sum^m_{i=1}[(\vec{w}\cdot\vec{x}^{(i)} + b - y^{(i)})x_j^{(i)}] + \frac{\lambda}{m}w_j
\end{gather}
$$

- Gradient Descent
$$
w_j = w_j - \alpha[\frac{1}{m}\sum^m_{i=1}[f_{\vec{x},b}(\vec{x}^{(i)}-y^{(i)})x_j^{(i)}] + \frac{\lambda}{m}w_j]
$$
$$
b = b - \sigma[\frac{1}{m}\sum_{i=1}^m(f_{\vec{w},b}(\vec{x}^{(i)})-y^{(i)})]
$$

## logistics
$$
J(\vec{w}, b) = - \frac{1}{m}\sum^m_{i=1}[y^{(i)}log(f_{\vec{w}, b}(\vec{x}^{(i)})) + (1-y^{(i)})log(1-f_{\vec{w},b}(\vec{x}^{(i)}))] + \frac{\lambda}{2m}\sum^n_{j=1}w_j^2
$$
$$
w_j = w_j - \alpha[\frac{1}{m}\sum^m_{i=1}[f_{\vec{x},b}(\vec{x}^{(i)}-y^{(i)})x_j^{(i)}] + \frac{\lambda}{m}w_j]
$$