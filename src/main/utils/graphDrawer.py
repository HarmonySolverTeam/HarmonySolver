import matplotlib.pyplot as plt
import networkx as nx
import networkx.drawing.layout as nxd

line = input("")
edges = []
vertex_layers = {}
vertexes = []
edge_weights = {}
while line != "":
    # line = line.split(" ")[1]
    v, u, layer_of_v, weight = line.split(",")[0], line.split(",")[1], int(line.split(",")[2]), line.split(",")[3]
    edges += [(v, u)]
    edge_weights[(v,u)] = weight
    if v not in vertexes:
        vertexes += [v]
    if u not in vertexes:
        vertexes += [u]
    vertex_layers[v] = layer_of_v
    line = input("")

# add missing layers number:
last_layer = max(vertex_layers.values()) + 1
for v in vertexes:
    if v not in vertex_layers.keys():
        edges_to_prev_of_v = list(filter(lambda x: x[1] == v, edges))
        if edges_to_prev_of_v:
            vertex_layers[v] = vertex_layers[edges_to_prev_of_v[0][0]] + 1
        else:
            vertex_layers[v] = last_layer


# draw graph in layers
G = nx.Graph()
G.add_edges_from(edges)
for v, data in G.nodes(data=True):
    data['subset'] = vertex_layers[v]
pos = nxd.multipartite_layout(G)
nx.draw(G, pos=pos, node_size=0.2, with_labels=True, edge_labels=edge_weights) #, font_size=10)
nx.draw_networkx_edge_labels(G, pos=pos, edge_labels=edge_weights)
# plt.axis('off')
plt.show()