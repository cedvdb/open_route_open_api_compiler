import { Node } from 'typescript';


export abstract class NodeFinder {
  static listChildNodes(node: Node) {
    const children: Node[] = [];
    node.forEachChild((childNode) => {
      children.push(childNode);
    });
    return children;
  }

}