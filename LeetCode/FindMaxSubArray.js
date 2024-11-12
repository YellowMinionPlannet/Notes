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
        }
        this.mergeDirection = [];
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

function findMax(pnpArrays, lastRoundLength, result, originalNums){
    
    let pnpArraysFromLeftToRight = [];
    if(pnpArrays.length === 1){
        result.push(pnpArrays[0].sum);
    }
    for(let k = 0; k < pnpArrays.length && pnpArrays.length >= 3; k = k + 2){
        
        if(!pnpArrays[k-1]){
            if(pnpArrays[k+1].sum + pnpArrays[k].sum >=0){// <-
                pnpArrays[k].setRightToLeft();
                pnpArraysFromLeftToRight.push(SubArray.clone(pnpArrays[k]));
            }else{// O
                
            }
        }else if(!pnpArrays[k+1]){
            if(pnpArrays[k - 1].sum + pnpArrays[k].sum >= 0){// -> 
                pnpArrays[k].setLeftToRight();
                if(pnpArrays[k - 2].mergeDirection.length > 0){
                    pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length-1] = pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length - 1].extendRight(pnpArrays[k].endIndex, pnpArrays[k].sum+pnpArrays[k-1].sum);
                }else{
                    pnpArraysFromLeftToRight.push(pnpArrays[k - 2].extendRight(pnpArrays[k].endIndex, pnpArrays[k-1].sum + pnpArrays[k].sum));
                }
            }else{ // O
                if(pnpArrays[k - 2].mergeDirection.indexOf("<-")>= 0 || pnpArrays[k-2].mergeDirection.length === 2){
                    pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length-1] = pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length - 1].extendRight(pnpArrays[k].endIndex, pnpArrays[k].sum+pnpArrays[k-1].sum);
                }else if(pnpArrays[k - 2].mergeDirection.length === 0){
                    pnpArraysFromLeftToRight.push(SubArray.clone(pnpArrays[k-2]), SubArray.clone(pnpArrays[k-1]), SubArray.clone(pnpArrays[k]));
                }else if(pnpArrays[k-2].mergeDirection.indexOf("->")>=0){
                    pnpArraysFromLeftToRight.push(SubArray.clone(pnpArrays[k-1]), SubArray.clone(pnpArrays[k]));
                }
            }
        }else{
            
            if(pnpArrays[k-1].sum + pnpArrays[k].sum >=0 && pnpArrays[k+1].sum + pnpArrays[k].sum >=0){ // <- ->
                pnpArrays[k].setLeftToRight();
                pnpArrays[k].setRightToLeft();
                if(pnpArrays[k-2].mergeDirection.length > 0){
                    pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length-1] = pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length -1].extendRight(pnpArrays[k].endIndex, pnpArrays[k-1].sum + pnpArrays[k].sum);
                }
                else if(pnpArrays[k-2].mergeDirection.length ===0){
                    pnpArraysFromLeftToRight.push(pnpArrays[k-2].extendRight(pnpArrays[k].endIndex, pnpArrays[k-1].sum + pnpArrays[k].sum));
                }
            }
            else if(pnpArrays[k - 1].sum + pnpArrays[k].sum >= 0){// ->
                pnpArrays[k].setLeftToRight();
                if(pnpArrays[k -2].mergeDirection.length === 0){
                    pnpArraysFromLeftToRight.push(pnpArrays[k-2].extendRight(pnpArrays[k].endIndex, pnpArrays[k].sum + pnpArrays[k-1].sum))
                }
                else if(pnpArrays[k-2].mergeDirection.length > 0){
                    pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length-1] = pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length -1].extendRight(pnpArrays[k].endIndex, pnpArrays[k-1].sum+ pnpArrays[k].sum)
                }
            }
            else if(pnpArrays[k + 1].sum + pnpArrays[k].sum >=0){// <-
                pnpArrays[k].setRightToLeft();
                if(pnpArrays[k-2].mergeDirection.length === 0){
                    pnpArraysFromLeftToRight.push(SubArray.clone(pnpArrays[k-2]), SubArray.clone(pnpArrays[k-1]), SubArray.clone(pnpArrays[k]));
                }
                else if(pnpArrays[k-2].mergeDirection.indexOf("<-")>=0 || pnpArrays[k-2].mergeDirection.length === 2){
                    pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length-1] = pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length -1].extendRight(pnpArrays[k].endIndex, pnpArrays[k-1].sum+ pnpArrays[k].sum)
                }
                else if(pnpArrays[k-2].mergeDirection.indexOf("->")>=0){
                    pnpArraysFromLeftToRight.push(SubArray.clone(pnpArrays[k-1]), SubArray.clone(pnpArrays[k]))
                }
            }
            else{// O
                if(pnpArrays[k-2].mergeDirection.length === 0){
                    pnpArraysFromLeftToRight.push(SubArray.clone(pnpArrays[k-2]), SubArray.clone(pnpArrays[k-1]));
                }
                else if(pnpArrays[k-2].mergeDirection.indexOf("<-")>=0 || pnpArrays[k-2].mergeDirection.length === 2){
                    pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length-1] = pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length-1].extendRight(pnpArrays[k].endIndex, pnpArrays[k-1].sum + pnpArrays[k].sum);
                }
                else if(pnpArrays[k-2].mergeDirection.indexOf("->")>=0){

                }
            }
        }
        
    }
    
    for(let j = 0; j < pnpArraysFromLeftToRight.length - 1; j++){
        pnpArraysFromLeftToRight[j].resetDirection();
        if(pnpArraysFromLeftToRight[j].endIndex >= pnpArraysFromLeftToRight[j+1].beginIndex){
            let tempSum = 0;
            for(let x = pnpArraysFromLeftToRight[j+1].endIndex; x > pnpArraysFromLeftToRight[j].endIndex; x--){
                tempSum = tempSum + originalNums[x];
            }
            pnpArraysFromLeftToRight[j] = pnpArraysFromLeftToRight[j].extendRight(pnpArraysFromLeftToRight[j+1].endIndex, tempSum);
            pnpArraysFromLeftToRight.splice(j+1, 1);
        }
    }
    
    if(pnpArraysFromLeftToRight.length !== lastRoundLength){
        findMax(pnpArraysFromLeftToRight, pnpArraysFromLeftToRight.length, result, originalNums);
    }else{
        result.push(...pnpArraysFromLeftToRight.map((ele) => { return ele.sum;}));
    }
}

function maxSubArray(nums) {
    let pnpArrays = [];
    if(nums.every((ele) => { return ele < 0;})){
        pnpArrays = nums;
    }else{

        for(let i = 0; i < nums.length; i++){
            let currentNum = nums[i];

            if(currentNum >= 0 ){
                if(pnpArrays[pnpArrays.length - 1] && pnpArrays[pnpArrays.length - 1].sum >= 0){
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
                    pnpArrays.push(new SubArray(i, i, currentNum));
                }
                else if(pnpArrays[pnpArrays.length - 1] && pnpArrays[pnpArrays.length - 1].sum < 0){
                    pnpArrays[pnpArrays.length - 1] = pnpArrays[pnpArrays.length - 1].extendRight(i, currentNum);
                }
                if(!pnpArrays[pnpArrays.length - 1]){

                }
            }
        }
    }

    if(pnpArrays[pnpArrays.length - 1].sum < 0){
        pnpArrays.pop();
    }
    
    const result = [];
    findMax(pnpArrays, pnpArrays.length, result, nums);

    let maxSum = result[0];
    for(let l = 1; l < result.length; l++){
        maxSum < result[l]? maxSum = result[l]:maxSum = maxSum;
    }

    return maxSum;
}