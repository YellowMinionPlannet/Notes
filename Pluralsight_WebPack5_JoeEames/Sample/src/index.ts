import log from "./util";

let cart = [] as string[];

function addToCart(item: string){
    cart.push(item);
    log("added: " + item);
}

function removeFromCart(index: number){
    cart.splice(index, 1);
    log("removed: " + index);
}

addToCart("Waterproof Boots");
