class SubArray{
    constructor(beginIndex, endIndex, initSum, direction){
        if(isNaN(beginIndex)&&isNaN(endIndex)){
            throw TypeError("index not a number");
        } 
        if(beginIndex > endIndex){
            throw RangeError("begin index greater than end index");
        }
        this.beginIndex = beginIndex;
        this.endIndex = endIndex;
        this.sum = 0;
        if(initSum){
            this.sum = initSum;
        }
        if(direction && direction.length > 0){
            this.mergeDirection = direction.slice(0);
        }else{
            this.mergeDirection = [];
        }
    }

    static clone(clone){
        if(!clone instanceof SubArray){
            throw new Error("Invalid type");
        }
        return new SubArray(clone.beginIndex, clone.endIndex, clone.sum, clone.mergeDirection);
    }

    extendLeft = (beginIndex, extendedValue) => {
        if(beginIndex > this.endIndex){
            throw RangeError("begin index greater than end index");
        }
        if(beginIndex < this.beginIndex){
            return new SubArray(beginIndex, this.endIndex, this.sum+extendedValue, this.mergeDirection);
        }
    };
    extendRight = (endIndex, extendedValue) => {
        if(endIndex < this.beginIndex){
            throw RangeError("end index less than begin index");
        }
        if(endIndex > this.endIndex){
            return new SubArray(this.beginIndex, endIndex, this.sum+extendedValue, this.mergeDirection);
        }
    };
    setRightToLeft = () =>{
        this.mergeDirection.push("<-");
    }
    setLeftToRight = () =>{
        this.mergeDirection.push("->")
    }
    resetDirection = () =>{
        this.mergeDirection = [];
    }
}

function findMaxFromPnpArrayWithNegativeRange(pnpArrays, negativeRange, possibleMax){
    // Mix and Match
    console.log("nagtive", pnpArrays.slice(0));
    for(let b = 0; b < pnpArrays.length - 2 && pnpArrays.length >= 5; b = b + 2){
        for(let e = b + 2; e < pnpArrays.length; e = e + 2){
            console.log([b, e]);
            let extendedValue = 0;
            let flag = b + 1;
            while(flag <= e){
                extendedValue = extendedValue + pnpArrays[flag].sum;
                flag++;
            }
            console.log(extendedValue, "extended");
            let tempMax = (pnpArrays[b].extendRight(pnpArrays[e].endIndex, extendedValue)).sum;
            console.log(tempMax);
            if(tempMax > possibleMax){
                possibleMax = tempMax;
            }
        }
    }
    return possibleMax;
}

function findMaxFromPnpArray(pnpArrays, possibleMax){
    console.log("INIT", pnpArrays.slice(0), possibleMax);
    // First we want to decrease size if possible.
    let continueFromLeft = pnpArrays.length >= 3; 
    while(continueFromLeft){
        if(pnpArrays[0].sum + pnpArrays[1].sum + pnpArrays[2].sum < 0){
            pnpArrays.splice(0, 2);
            continueFromLeft = pnpArrays.length >=3;
        }else{
            continueFromLeft = false;
        }
    }
    console.log("decreassing", pnpArrays.slice(0));
    let continueFromRight = pnpArrays.length > 3;
    while(continueFromRight){
        
        if((pnpArrays[pnpArrays.length - 1].sum + pnpArrays[pnpArrays.length-2].sum + pnpArrays[pnpArrays.length-3].sum) < 0){
            pnpArrays.splice(pnpArrays.length-2, 2);
            continueFromRight = pnpArrays.length > 3;
        }else{
            continueFromRight = false;
        }
    }
    console.log("decreased", pnpArrays.slice(0));
    if(pnpArrays.length === 3){
        let tempMax = pnpArrays[0].sum + pnpArrays[1].sum + pnpArrays[2].sum;
        if( tempMax > possibleMax){
            possibleMax = tempMax;
        }
        return possibleMax;
    }else if(pnpArrays.length === 1){
        if(possibleMax < pnpArrays[0].sum){
            return pnpArrays[0].sum;
        }
        return possibleMax;
    }
    else if(pnpArrays.length === 5){
        return findMaxFromPnpArrayWithNegativeRange(pnpArrays, undefined, possibleMax);
    }
    else{
        //First find the exclude range
        // let possibleNegativeRange = [];
        // for(let i = 0; i < pnpArrays.length && pnpArrays.length > 5; i++){
            
        // }
        return findMaxFromPnpArrayWithNegativeRange(pnpArrays, undefined, possibleMax);
    }
}

function findMaxFromArray(array){
    console.log("FindMaxFromArray", array.slice(0));
    if(array.length <= 0){
        throw new RangeError("Empty Array!");
    }
    let tempMax = array[0];
    for(let i = 1; i < array.length; i++){
        if(tempMax < array[i]){
            tempMax = array[i];
        }
    }
    return tempMax;
}

function maxSubArray(nums) {
    // First excludes all negative numbers and input with only one number
    if(nums.every((ele) => { return ele < 0;})){
        return findMaxFromArray(nums);
    }
    else if(nums.length === 1){
        return nums[0];
    }
    else{
        let possibleMax = [], pnpArrays =[];
        for(let i = 0; i < nums.length; i++){
            let currentNum = nums[i];

            if(currentNum >= 0 ){
                if(pnpArrays[pnpArrays.length - 1] && pnpArrays[pnpArrays.length - 1].sum >=0){
                    pnpArrays[pnpArrays.length - 1] = pnpArrays[pnpArrays.length - 1].extendRight(i, currentNum);
                }
                else if(pnpArrays[pnpArrays.length - 1] && pnpArrays[pnpArrays.length - 1].sum < 0){
                    pnpArrays.push(new SubArray(i, i, currentNum));
                }
                if(!pnpArrays[pnpArrays.length - 1]){
                    pnpArrays.push(new SubArray(i, i, currentNum));
                }
            }else{
                if(pnpArrays[pnpArrays.length - 1] && pnpArrays[pnpArrays.length - 1].sum >= 0){
                    possibleMax.push(pnpArrays[pnpArrays.length - 1].sum);
                    pnpArrays.push(new SubArray(i, i, currentNum));
                }
                else if(pnpArrays[pnpArrays.length - 1] && pnpArrays[pnpArrays.length - 1].sum < 0){
                    pnpArrays[pnpArrays.length - 1] = pnpArrays[pnpArrays.length - 1].extendRight(i, currentNum);
                }
                if(!pnpArrays[pnpArrays.length - 1]){

                }
            }
        }
        if(pnpArrays[pnpArrays.length - 1].sum < 0){
            pnpArrays.pop();
        }else{
            possibleMax.push(pnpArrays[pnpArrays.length-1].sum);
        }
        if(pnpArrays.length === 1){
            return pnpArrays[0].sum;
        }

        let tempMax =  findMaxFromArray(possibleMax);
        return findMaxFromPnpArray(pnpArrays,tempMax);
    }
}