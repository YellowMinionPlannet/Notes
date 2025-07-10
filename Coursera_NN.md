- Brief about Neural Network (Deep Learning)
    - start at 1950s trying  to mimic human brain(biological brain)
    - gain traction at 1980s to 1990s for the handwritten recognition, post code, cheque numbers
    - 2005 rebranded as Deep Learning, huge impact on speech recognition and computer vision
    - 2012, ImageNet made huge influence for computer vision, Fei Fei Li and her research works
        - computer vision stands for using sensor and program to identify object, including object classification, facial recognition 
    - then, texts and natural language processing.

- Biological Brain
    - Neuron has cell body, and cell body's core is nucleus, and the branch like stuff is dendrites(突触), where the input coming from, and after the neuron got input, they do some computation, and send out the output through a long tail, called axon, that axon will connect to other neuron, and output becomes input for those other neurons.


- Neural Network (computer world)
    - have some input,like number 2, and do computation, then output number 0.7, and then 0.7 becomes input for other neuron.
    - why deep learning?
        - traditional model like logistic regression and linear regression's performance can't scale much as data accumulates, they already met their limit.
        - Very complicated neural network design can benefit from big data, and perform much better than the traditional one, also need to consume large quantity of power and GPU.

- To demo, let's consider a simple example, we are selling t-shirt, and we want to predict if this t-shirt gonna be the top seller.
    - input is price
    - output is yes/no
    - and using logistic regression, we know that predict value is sigmoid function of $-(wx+b)$, and we call this activation. 
        - why calling activation? 'cause this word is also used in neural science to express how strong the output is passed to the next neuron, here since the prediction is between 0 and 1, it's more likely a probability to express yes. Just as strength to say yes.
    - this logistic regression model could be a single neuron in the network.

- To demo for simplified neural network, we re-visit this problem with new design:
    - there are 4 features to decide if this t-shirt gonna be a top seller:
        1. price
        2. shipping cost
        3. marketing
        4. material
    - these 4 features, or numbers are grouped as input layer.
    - then we classified 3 elements that will affect this t-shirt being top-seller:
        1. affordability, where decided by price and shipping cost
        2. awareness, by marketing
        3. perceived quality, byprice and materials
    - these three elements are called activation, and these middle layer is called hidden layer.

    - so we actually have 3 neuron, each for one element, these 3 neuron groups together and form a *layer*
    - and their output will be input for another final neuron that decide what are the probability of being top seller, which is another single neuroned layer, and also output layer.
    - so deep learning, the middle layer/hidden layer 's feature is not decided manually, but refined/ polished by machine itself.
    - in total, this is also called multiple perceptron.


- Training Details(Neural Networks)
    1. Specify how to compute output given input x and parameters w, b
    ```py
    # for linear regression
    z = np.dot(w, x) + b
    # for logistic regression
    f_x = 1/(1+np.exp(-z))

    # for numpy if you have 1d array, as long as length matches you can do np.dot()
    a = np.array([1, 2, 3])
    b = np.array([4, 5, 6])
    np.dot(a, b) == np.dot(b, a)

    # but if it's 2d array, you can only do dot product if 1st array column match 2nd array rows
    v1 = np.array([[1, 2, 3]])      # Shape: (1, 3) — row vector
    v2 = np.array([[4], [5], [6]])

    np.dot(v1, v2)  # → (1,3)·(3,1) = (1,1) → scalar
    np.dot(v2, v1)  # → (3,1)·(1,3) = (3,3) → matrix
    ```

    2. specify loss and cost function

    $z = np.dot(w,x) + b$

    $f_x = \frac{1}{(1+np.exp(-z))}$
    
    $L(f_{\vec{w},b}(\vec{x}^{(i)}), y^{(i)}) = -y * np.log(f_x) - (1-y) * np.log(1-f_x)$
    
    cost = $\frac{1}{m}\sum_{i=1}^mL(f_{\vec{w},b}(\vec{x}^{(i)}), y^{(i)})$

    3. train
    $$
    w = w - alpha * dj\_dw
    $$
    $$
    b = b - alpha * dj\_db
    $$

    Please see ML notes for this equation

    but in tensorflow the code is:
    ```py
    import tensorflow as tf
    from tensorflow.keras import Sequential
    from tensorflow.keras.layers import Dense
    from tensorflow.keras.losses import BinaryCrossentropy

    model = Sequential([Dense(units=25, activation='sigmoid'), 
                        Dense(units=15, activation='sigmoid'), 
                        Dense(units=1, activation='sigmoid')])
    model.compile(loss=BinaryCrossentropy())
    model.fit(X, Y, epochs=100)
    ```
- ReLU function
    $$
    g(z) = max(0, z), where,  z = wx+b
    $$

- Multiclass Classification Problem
    - when we want y is not any number like linear regression or polynomial regression, but y might be multiple discrete values. For example, we expect y could be 1, 2, 3, 4, 5, 6, 7, 8, 9, 0
    - So we have Softmax algorithm
        - suppose we have logistic regression that produce 2 possible output
            then output layer, we have
            $$
            a_1 = g(z) = \frac{1}{1+e^{-z}} = P(y=1|\vec{x})
            $$
            if this is the probability of y expect to be True/1
            then 
            $$
            a_2 = 1 - a_1 = P(y=0|\vec{x})
            $$
        - so from this, we can expect if we want label y be 4 values, 1, 2, 3, 4, we will have
        $$
        z_1 = \vec{w_1}\vec{x} + b_1, \  \  a_1 = \frac{e^{z_1}}{e^{z_1}+e^{z_2}+e^{z_3}+e^{z_4}} = P(y=1|\vec{x})
        $$
        $$
        z_2 = \vec{w_2}\vec{x} + b_2, \  \  a_2 = \frac{e^{z_2}}{e^{z_1}+e^{z_2}+e^{z_3}+e^{z_4}} = P(y=2|\vec{x})
        $$
        $$
        z_3 = \vec{w_3}\vec{x} + b_3, \  \  a_3 = \frac{e^{z_3}}{e^{z_1}+e^{z_2}+e^{z_3}+e^{z_4}} = P(y=3|\vec{x})
        $$
        $$
        z_4 = \vec{w_4}\vec{x} + b_4, \  \  a_4 = \frac{e^{z_4}}{e^{z_1}+e^{z_2}+e^{z_3}+e^{z_4}} = P(y=4|\vec{x})
        $$
    - Softmax loss vs. cost:
        $$
        loss = \begin{cases} 
            -loga_1,\ if\ y = 1\\
            -loga_2,\ if\ y = 2\\
            ...\\
            -loga_n,\ if\ y = n
        \end{cases}
        $$
    - Softmax implementation with tensorflow
    ```py
    import tensorflow as tf
    from tensorflow.keras import Sequential
    from tensorflow.keras.layers import Dense

    model = Sequential(
        [
            Dense(units=25, activation='relu')
            Dense(units=15, activation='relu')
            Dense(units=10, activation='softmax')
        ]
    )

    from tensorflow.keras.losses import SparseCategoricalCrossentropy

    model.compile(loss=SparseCategoricalCrossentropy())
    model.fit(X,Y, epochs=100)
    ```
    > IMPORTANT: this is not the final version due to computer calculation accuracy

    ```py   
    # original version of logistic
    model = Sequential([
        Dense(units=25, activation='relu'),
        Dense(units=15, activation='relu'),
        Dense(units=1, activation='sigmoid')
    ])
    model.compile(loss=BinaryCrossEntropy())

    # updated version of logistic
    model = Sequential([
        Dense(units=25, activation='relu'),
        Dense(units=15, activation='relu'),
        Dense(units=1, activation='linear')
    ])
    model.compile(loss=BinaryCrossEntropy(from_logits=True))
    model.fit(X,Y,epochs=100)
    logits = model(X) # here instead of a_1...a_n is z_1....z_n, z = wx + b
    f_x = tf.nn.sigmoid(logits)

    # original version of softmax
    model = Sequential([
        Dense(units=25, activation='relu'),
        Dense(units=15, activation='relu'),
        Dense(units=10, activation='softmax')
    ])
    model.compile(loss=SparseCategoricalCrossEntropy())

    # updated version of softmax
    model = Sequential([
        Dense(units=25, activation='relu'),
        Dense(units=15, activation='relu'),
        Dense(units=10, activation='linear')
    ])
    model.compile(loss=SparseCategoricalCrossEntropy(from_logits=True))
    model.fit(X,Y,epochs=100)
    logits = model(X) # here instead of a_1...a_n is z_1....z_n, z = wx + b
    f_x = tf.nn.softmax(logits)
    ```