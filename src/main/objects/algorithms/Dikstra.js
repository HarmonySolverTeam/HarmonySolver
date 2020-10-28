.import "../algorithms/PriorityQueue.js" as PriorityQueue

function Dikstra(graph){

    this.graph = graph;
    this.queue = new PriorityQueue.PriorityQueue("distanceFromBegining");

    this.init = function() {
        var allNodes = this.graph.getNodes();
        for(var i=0; i<allNodes.length; i++){
            allNodes[i].distanceFromBegining = "infinity";
            allNodes[i].prevInShortestPath = undefined;
            this.queue.insert(allNodes[i]);
        }
        this.graph.first.distanceFromBegining = 0;
    }

    //Cormen p.662
    this.relax = function(u, v, w){
        if(u.distanceFromBegining === "infinity"){
            throw "u cannot have inifinity distance from begining";
        }

        if(u.distanceFromBegining + w < v.distanceFromBegining || v.distanceFromBegining === "infinity") {
            this.queue.decreaseKey(v, u.distanceFromBegining + w);
            v.prevInShortestPath = u;
        }
    }

    this.findShortestPaths = function() {
        this.init();
        while(this.queue.isNotEmpty()){
            var u = this.queue.extractMin();
            for(var i=0; i<u.nextNeighbours.length; i++){
                var v = u.nextNeighbours[i].node;
                var w = u.nextNeighbours[i].weight;
                this.relax(u,v,w);
            }
        }
    }

    this.getShortestPathToLastNode = function() {
        this.findShortestPaths();
        var currentNode = this.graph.last;
        var result = []
        while(currentNode.prevInShortestPath !== undefined){
            result.unshift(currentNode);
            currentNode = currentNode.prevInShortestPath;
        }
        result.splice(result.length-1, 1);
        return result;
    }

}