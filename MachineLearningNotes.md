# Linear Regression Analysis

The concept of LR is to find a line, which called hyperplane so that each dot (two-diementional) distance to that line is minimized. 
1. So we could hypothize that each dot could be described as
    
    $y = a + bx + e$
where, e represents the error/distance from the dot to the hyperplane.
2. Because we will have e > 0 and e < 0 conditions, so to simplify this, we want
$e = y - bx - a$ and $\sum_{n}e^2 = \sum_{n}(y-bx-a)^2$
3. remember that we also have $\overline{y} = a + b\overline{x}$

At last, we conduct that:

$$
a = \frac{(\sum y)(\sum x^2) - (\sum x)(\sum xy)}{n(\sum x^2)-(\sum x)^2}
$$
$$
b = \frac{n(\sum xy)-(\sum x)(\sum y)}{n(\sum x^2)-(\sum x)^2}
$$

# Logistic Regression Analysis

The concept of Logistic Regression is to categorize dots. For example, we have study hours and pass/fail result

|Hours Studied|Pass/Fail|
|-|-|
|1|0|
|2|0|
|3|0|
|4|1|
|5|1|
|6|1|

then we can represent this with Logistic Regression:

$$ y = \frac{1}{1+e^{4-x}}$$
where y is the probability of success in exam, x is hours studied.

Here we want when $x=4$ the probability of passing exam be 50%, since we have success sample data when $x = 4$

