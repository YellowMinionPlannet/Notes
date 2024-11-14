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
    // Solution from Other's Solution :(
    console.log("final",pnpArrays.slice(0), possibleMax);
    let accumulatedSum = 0;
    for(let i = 0; i < pnpArrays.length; i++){
         accumulatedSum = (accumulatedSum >= 0 ? accumulatedSum + pnpArrays[i].sum: pnpArrays[i].sum); 
         if(accumulatedSum > possibleMax){
            possibleMax = accumulatedSum;
        }
    }
    return possibleMax;
}

function findSumValue(array){
    if(!array instanceof Array){
        throw new TypeError("Only Array Type Please!");
    }
    return array.reduce((p, v) => {return p + v;}, 0);
}

function findAbsoluteValue(number){
    if(number >= 0){
        return number;
    }else{
        return number * -1;
    }
}

function processThreePnps(pnpArrays){
    if(!pnpArrays instanceof Array){
        throw new TypeError("Only Array Type Please!");
    }
    let target = pnpArrays.map((ele) => {return ele.sum});
    let result = findMinAbsoluteValues(target);
    result.push(findSumValue(target));
    return result;
}

function findMinAbsoluteValues(array) {
    if(array instanceof Array && array.length === 0){
        throw new RangeError("Empty array!");
    }
    if(!array instanceof Array){
        throw new TypeError("Only Array Type Please!");
    }
    let result = findAbsoluteValue(array[0]);
    let index = 0;
    for(let i = 0; i < array.length; i++){
        let current = findAbsoluteValue(array[i]);
        if(current < result){
            result = current;
            index = i;
        }
    }
    return [result, index];
}

function simplifyPnpArray(pnpArrays, lastRoundLength){
    if(pnpArrays instanceof Array && pnpArrays.length < 5){
        throw new RangeError("Too short to simplify");
    }
    
    for(let i = 2; i < pnpArrays.length - 2; ){
        let processed = processThreePnps([pnpArrays[i], pnpArrays[i-1], pnpArrays[i+1]]);
        if(processed[1] === 0){
            pnpArrays.splice(i-1, 3, pnpArrays[i - 1].extendRight(pnpArrays[i+1].endIndex, findSumValue([pnpArrays[i].sum, pnpArrays[i+1].sum])));
            continue;
        }else if(processed[2] > pnpArrays[i-2] && processed[2] > pnpArrays[i+2]){
            pnpArrays.splice(i-2, 5, pnpArrays[i -2].extendRight(pnpArrays[i+2].endIndex, findSumValue([pnpArrays[i-1].sum, pnpArrays[i].sum, pnpArrays[i+1].sum, pnpArrays[i+2].sum])));
        }else{
            i = i + 2;
        }
    }
    if(pnpArrays.length >= 5 && pnpArrays.length !== lastRoundLength){
        simplifyPnpArray(pnpArrays, pnpArrays.length);
    }
}

function findMaxFromPnpArray(pnpArrays, possibleMax){

    if(pnpArrays.length >=5 ){
        simplifyPnpArray(pnpArrays, pnpArrays.length);
    }
    console.log("Simplified",pnpArrays.slice(0));
    
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
    
    let continueFromRight = pnpArrays.length > 3;
    while(continueFromRight){
        
        if((pnpArrays[pnpArrays.length - 1].sum + pnpArrays[pnpArrays.length-2].sum + pnpArrays[pnpArrays.length-3].sum) < 0){
            pnpArrays.splice(pnpArrays.length-2, 2);
            continueFromRight = pnpArrays.length > 3;
        }else{
            continueFromRight = false;
        }
    }
    
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
        return findMaxFromPnpArrayWithNegativeRange(pnpArrays,undefined,tempMax);
    }
}