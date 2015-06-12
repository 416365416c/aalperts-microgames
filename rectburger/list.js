//Data Structure Class
var global = (function(){return this;}).call();
function List(a) {
    if(a == undefined)
        a = 255;
                
    if(this == global)
        return new List(a);
    this.ds = new Array(a);
    this.size = 0;
}

List.prototype.append = function(i) {
    this.ds[this.size] = i;
    this.size += 1;
}

//Alters the order of the list
List.prototype.remove = function(i) {
    this.ds[i] = this.ds[this.size-1];
    this.size -= 1;
}

List.prototype.set = function(i,val) {
    this.ds[i] = val;
}

List.prototype.at = function(i) {
    return this.ds[i];
}

List.prototype.contains = function(i) {
    for(var j = 0; j < this.size; j++){
        if(this.ds[j] == i)
            return true;
    }
    return false;
}

List.prototype.destroy = function(i) {
    this.ds[i].destroy();
    this.remove(i);
}

List.prototype.clearItems = function() {
    for(var j = 0; j < this.size; j++)
        if(this.ds[j] != null)
            this.ds[j].destroy();
    this.size = 0;
}

List.prototype.toString = function() {
    var ret = "";
    for(var j in this.ds){
        if(j!=0)
            ret += ',';
        ret += this.ds[j].toString();
    }
    return ret;
}
