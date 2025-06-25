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

    - 

