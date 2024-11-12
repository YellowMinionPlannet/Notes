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
            debugger
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

function findMax(pnpArrays, lastRoundLength, result){
    console.log("INIT", pnpArrays);
    let pnpArraysFromLeftToRight = [];
    if(pnpArrays.length === 1){
        result.push(pnpArrays[0].sum);
    }
    for(let k = 0; k < pnpArrays.length && pnpArrays.length >= 3; k = k + 2){
        debugger
        console.log(pnpArrays, pnpArraysFromLeftToRight, k);
        if(!pnpArrays[k-1]){
            if(pnpArrays[k+1].sum + pnpArrays[k].sum >=0){
                pnpArrays[k].setRightToLeft();
                pnpArraysFromLeftToRight.push(pnpArrays[k].extendRight(pnpArrays[k + 2].endIndex, pnpArrays[k + 1].sum + pnpArrays[k+2].sum));
            }else{

            }
        }else if(!pnpArrays[k+1]){
            if(pnpArrays[k - 1].sum + pnpArrays[k].sum >= 0){
                pnpArrays[k].setLeftToRight();
                if(pnpArrays[k - 2].mergeDirection.indexOf("->")>= 0){
                    pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length - 1].extendRight(pnpArrays[k].endIndex, pnpArrays[k].sum+pnpArrays[k-1].sum);
                }else if(pnpArrays[k-2].mergeDirection.length === 0){
                    pnpArraysFromLeftToRight.push(pnpArrays[k - 2].extendRight(pnpArrays[k].endIndex, pnpArrays[k-1].sum + pnpArrays[k].sum));
                }
            }else{
                if(pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length - 1]){
                    pnpArraysFromLeftToRight.push(SubArray.clone(pnpArrays[k-1]), SubArray.clone(pnpArrays[k]));
                }else{
                    pnpArraysFromLeftToRight.push(SubArray.clone(pnpArrays[k-2]), SubArray.clone(pnpArrays[k-1]), SubArray.clone(pnpArrays[k]));
                }
            }
        }else{
            debugger
            if(pnpArrays[k-1].sum + pnpArrays[k].sum >=0 && pnpArrays[k+1].sum + pnpArrays[k].sum >=0){
                pnpArrays[k].setLeftToRight();
                pnpArrays[k].setRightToLeft();
                if(pnpArrays[k-2].mergeDirection.length === 2 || pnpArrays[k-2].mergeDirection.indexOf("<-")>= 0){
                    pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length -1].extendRight(pnpArrays[k+2].endIndex, pnpArrays[k+1].sum+pnpArrays[k+2].sum);
                }
                if(pnpArrays[k-2].mergeDirection.length ===0){
                    pnpArraysFromLeftToRight.push(pnpArrays[k-2].extendRight(pnpArrays[k+2].endIndex, pnpArrays[k-1].sum + pnpArrays[k].sum+pnpArrays[k+1].sum+pnpArrays[k+2].sum));
                }
                if(pnpArrays[k-2].mergeDirection.indexOf("->")){
                    pnpArraysFromLeftToRight.push(pnpArrays[k].extendRight(pnpArrays[k+2].endIndex, pnpArrays[k+1].sum + pnpArrays[k+2].sum));
                }
            }
            else if(pnpArrays[k - 1].sum + pnpArrays[k].sum >= 0){
                pnpArrays[k].setLeftToRight();
                if(pnpArrays[k -2].mergeDirection.length === 0){
                    pnpArraysFromLeftToRight.push(pnpArrays[k-2].extendRight(pnpArrays[k].endIndex, pnpArrays[k].sum + pnpArrays[k-1].sum))
                }
                if(pnpArrays[k-2].mergeDirection.indexOf("->")>=0){
                    if(pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length -1]){
                        pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length - 1].extendRight(pnpArrays[k].endIndex, pnpArrays[k-1].sum + pnpArrays[k].sum);
                    }
                }
            }
            else if(pnpArrays[k + 1].sum + pnpArrays[k].sum >=0){
                pnpArrays[k].setRightToLeft();
                if(pnpArrays[k-2].mergeDirection.length === 0){
                    pnpArraysFromLeftToRight.push(SubArray.clone(pnpArrays[k-2]), SubArray.clone(pnpArrays[k-1]), pnpArrays[k].extendRight(pnpArrays[k+2].endIndex, pnpArrays[k+1].sum + pnpArrays[k+2].sum));
                }
                if(pnpArrays[k-2].mergeDirection.indexOf("<-")>=0){
                    pnpArraysFromLeftToRight[pnpArraysFromLeftToRight.length -1].extendRight(pnpArrays[k+2].endIndex, pnpArrays[k+1].sum+ pnpArrays[k+2].sum)
                }
                if(pnpArrays[k-2].mergeDirection.indexOf("->")>=0){
                    pnpArraysFromLeftToRight.push(pnpArrays[k].extendRight(pnpArrays[k+2].endIndex,pnpArrays[k+1].sum + pnpArrays[k+2].sum));
                }
            }
            else{
                if(pnpArrays[k-2].mergeDirection.length === 0){
                    pnpArraysFromLeftToRight.push(SubArray.clone(pnpArrays[k-2]), SubArray.clone(pnpArrays[k-1]));
                }
                if(pnpArrays[k-2].mergeDirection.indexOf("<-")>=0){

                }
                if(pnpArrays[k-2].mergeDirection.indexOf("->")>=0){

                }
            }
        }
    }
    debugger
    console.log("LEFTEND", pnpArraysFromLeftToRight);
    // for(let j = pnpArrays.length -1 ; j >=0 && pnpArrays.length >=3; j = j -2){
    //     console.log(pnpArraysFromRightToLeft, j);
    //     if(!pnpArrays[j+1]){
           
    //     }else if(!pnpArrays[j-1]){
    //         if(pnpArrays[j + 1].sum + pnpArrays[j].sum >= 0){
    //             pnpArrays[j].setRightToLeft();
    //             if(pnpArrays[j + 2].mergeDirection.indexOf("<-") >= 0){
    //                 pnpArraysFromRightToLeft[0].extendLeft(pnpArrays[j].beginIndex, pnpArrays[j+1].sum + pnpArrays[j].sum);
    //             }else{
    //                 pnpArraysFromRightToLeft.unshift(pnpArrays[j + 2].extendLeft(pnpArrays[j].beginIndex, pnpArrays[j+1].sum + pnpArrays[j].sum));
    //             }
    //         }else{
    //             if(pnpArraysFromRightToLeft[0]){
    //                 pnpArraysFromRightToLeft.unshift(pnpArrays[j+1], pnpArrays[j]);
    //             }else{
    //                 pnpArraysFromRightToLeft.unshift(pnpArrays[j+2], pnpArrays[j+1], pnpArrays[j]);
    //             }
    //         }
    //     }else{
    //         if(pnpArrays[j + 1].sum + pnpArrays[j].sum >= 0){
    //             pnpArrays[j].setRightToLeft();
    //             if(pnpArrays[j+2].mergeDirection.indexOf("<-")>=0){
    //                 pnpArraysFromRightToLeft[0].extendLeft(pnpArrays[j].beginIndex, pnpArrays[j+1].sum + pnpArrays[j].sum);
    //             }else{
    //                 pnpArraysFromRightToLeft.unshift(pnpArrays[j+2].extendLeft(pnpArrays[j].beginIndex, pnpArrays[j+1].sum+pnpArrays[j].sum));
    //             }
    //         }else{
    //             //pnpArraysFromRightToLeft.unshift(pnpArrays[j+1], pnpArrays[j]);
    //         }
    //     }
    // }
    // console.log("RIGHTEND", pnpArrays);


    if(pnpArraysFromLeftToRight.length !== lastRoundLength){
        pnpArraysFromLeftToRight.forEach((ele) => { ele.resetDirection();});
        findMax(pnpArraysFromLeftToRight, pnpArraysFromLeftToRight.length, result);
    }else{

        result.push(pnpArraysFromLeftToRight.map((ele) => { return ele.sum;}));
    }
    // if(pnpArraysFromRightToLeft.length !== lastRoundLength){
    //     pnpArraysFromRightToLeft.forEach((ele)=>{ele.mergeDirection = [];});
    //     findMax(pnpArraysFromRightToLeft, pnpArraysFromRightToLeft.length, result);

    // }else{
    //     result.push(pnpArraysFromRightToLeft.map((ele) => {return ele.sum;}))
    // }
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
    //console.log(pnpArrays);
    const result = [];
    findMax(pnpArrays, pnpArrays.length, result);

    let maxSum = result[0];
    for(let l = 1; l < result.length; l ++){
        maxSum < result[l]? maxSum = result[l]:maxSum = maxSum;
    }

    return maxSum;
}