export default class Instance {
    constructor(parent, children) {
        this.Children = children || [];
        this.Parent = parent || null;

        if (parent) {
            parent.addChild(this)
        }
    }

    get getChildren () {
        return this.Children;
    }

    addChild (child) {
        this.Children.push(child);
    }
}