"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeFinder = void 0;
class NodeFinder {
    static listChildNodes(node) {
        const children = [];
        node.forEachChild((childNode) => {
            children.push(childNode);
        });
        return children;
    }
}
exports.NodeFinder = NodeFinder;
