
import { BinaryHeap } from './heap.js';

var arr=[];
var friends ;
var number_of_transaction ;

document.getElementById("button1").addEventListener("click", function(e)
{
  arr=[];
  e.preventDefault();
  var a = document.getElementById("friends").value;
var   b = document.getElementById("transaction").value;
  console.log(a);
  console.log(b);
friends=parseInt(a);
number_of_transaction= parseInt(b);
  document.getElementById("friends").value= "";
  document.getElementById("transaction").value ="";
});
document.getElementById("button2").addEventListener("click", function(e)
{
  e.preventDefault();
var  a = parseInt(document.getElementById("name1").value);
var  b = parseInt(document.getElementById("name2").value);
var  c = document.getElementById("money").value;
arr.push([a,b,c]);
  document.getElementById("name1").value= "";
  document.getElementById("name2").value ="";
    document.getElementById("money").value ="";
});




onload = function () {
    // create a network
    let curr_data;
    const container = document.getElementById('mynetwork');
    const container2 = document.getElementById('mynetwork2');
    const genNew = document.getElementById('generate-graph');
    const solve = document.getElementById('solve');
    const temptext = document.getElementById('temptext');
    // initialise graph options
    const options = {
        edges: {
            arrows: {
                to: true
            },
            labelHighlightBold: true,
            font: {
                size: 20
            }
        },
        nodes: {
            font: '12px arial #ffd56b',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf183',
                size: 50,
                color: '#344fa1',
            }
        }
    };
    // initialize your network!
    let network = new vis.Network(container);
    network.setOptions(options);
    let network2 = new vis.Network(container2);
    network2.setOptions(options);

    function createData(){


        // Adding people to nodes array
        let nodes = [];
        for(let i=1;i<=friends;i++){
            nodes.push({id:parseInt(i), label:"Person "+i})
        }
        nodes = new vis.DataSet(nodes);

        // Dynamically creating edges with random amount to be paid from one to another friend
        const edges = [];
        for(let i = 0 ;i < number_of_transaction ;i++)
        {
          console.log(arr[i][0] , arr[i][1],arr[i][2]);
          edges.push({from: arr[i][0], to: arr[i][1], label: String(arr[i][2])});
        }

        const data = {
            nodes: nodes,
            edges: edges
        };
        return data;
    }


    genNew.onclick = function () {
        const data = createData();
        curr_data = data;
        network.setData(data);
        temptext.style.display = "inline";
        container2.style.display = "none";
    };

    solve.onclick = function () {
        temptext.style.display  = "none";
        container2.style.display = "inline";
        const solvedData = solveData();
        network2.setData(solvedData);
    };

    function solveData() {
        let data = curr_data;
        const sz = data['nodes'].length;
        const vals = Array(sz).fill(0);
        // Calculating net balance of each person
        for(let i=0;i<data['edges'].length;i++) {
            const edge = data['edges'][i];
            vals[edge['to'] - 1] += parseInt(edge['label']);
            vals[edge['from'] - 1] -= parseInt(edge['label']);
        }

        const pos_heap = new BinaryHeap();
        const neg_heap = new BinaryHeap();

        for(let i=0;i<sz;i++){
            if(vals[i]>0){
                pos_heap.insert([vals[i],i]);
            } else{
                neg_heap.insert(([-vals[i],i]));
                vals[i] *= -1;
            }
        }

        const new_edges = [];
        while(!pos_heap.empty() && !neg_heap.empty()){
            const mx = pos_heap.extractMax();
            const mn = neg_heap.extractMax();

            const amt = Math.min(mx[0],mn[0]);
            const to = mx[1];
            const from = mn[1];

            new_edges.push({from: from+1, to: to+1, label: String(Math.abs(amt))});
            vals[to] -= amt;
            vals[from] -= amt;

            if(mx[0] > mn[0]){
                pos_heap.insert([vals[to],to]);
            } else if(mx[0] < mn[0]){
                neg_heap.insert([vals[from],from]);
            }
        }

        data = {
            nodes: data['nodes'],
            edges: new_edges
        };
        return data;
    }

    //genNew.click();

};
